"""
LeadForge AI — Reply Handler Module
Reads unread Gmail replies, classifies intent with Claude, and responds.
"""

import base64
import json
import logging
import os
from email.utils import parseaddr
from pathlib import Path

import anthropic
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

import lead_db
import mockup_generator
from config import (
    ANTHROPIC_API_KEY,
    CLAUDE_MODEL,
    GMAIL_CREDENTIALS_PATH,
    GMAIL_TOKEN_PATH,
    OWNER_NAME,
    PHONE_NUMBER,
    SENDER_EMAIL,
    WEBSITE_URL,
)
from email_sender import send_reply_email

logger = logging.getLogger(__name__)

_GMAIL_SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",  # needed to mark as read
]

# ── Intent buckets ────────────────────────────────────────────────────────────
INTENT_INTERESTED = "interested"
INTENT_QUESTION = "question"
INTENT_PRICE_OBJECTION = "price_objection"
INTENT_UNSURE = "unsure"
INTENT_NOT_INTERESTED = "not_interested"
INTENT_UNSUBSCRIBE = "unsubscribe"

_VALID_INTENTS = {
    INTENT_INTERESTED,
    INTENT_QUESTION,
    INTENT_PRICE_OBJECTION,
    INTENT_UNSURE,
    INTENT_NOT_INTERESTED,
    INTENT_UNSUBSCRIBE,
}

# ── Neil's persona system prompt ──────────────────────────────────────────────
_NEIL_SYSTEM = f"""\
You are Neil Mitchell, President & CEO and CTO of LeadForge AI, a freelance web design agency \
based in Saint John, New Brunswick, Canada. You build modern, professional websites for local \
businesses at a flat rate of $650, delivered in 3–5 business days. Post-launch updates are \
$75/hour, prorated to 10-minute intervals with no minimum. Clients own 100% of their site \
after payment. Your phone number is {PHONE_NUMBER} and your website is {WEBSITE_URL}.

Your tone is warm, direct, confident, and local. You write short, conversational emails — no \
fluff, no pushy sales tactics. You always end with your full signature:

{OWNER_NAME}
President & CEO · CTO
LeadForge AI · {WEBSITE_URL} · {PHONE_NUMBER}
"""


def _get_gmail_service():
    """Authenticate and return a Gmail API service object."""
    creds = None
    token_path = Path(GMAIL_TOKEN_PATH)
    creds_path = Path(GMAIL_CREDENTIALS_PATH)

    if token_path.exists():
        creds = Credentials.from_authorized_user_file(str(token_path), _GMAIL_SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not creds_path.exists():
                raise FileNotFoundError(
                    f"Gmail credentials file not found at {GMAIL_CREDENTIALS_PATH}. "
                    "Download OAuth credentials from Google Cloud Console."
                )
            flow = InstalledAppFlow.from_client_secrets_file(str(creds_path), _GMAIL_SCOPES)
            creds = flow.run_local_server(port=0)

        with open(token_path, "w") as f:
            f.write(creds.to_json())

    return build("gmail", "v1", credentials=creds)


def _get_unread_replies(service) -> list[dict]:
    """
    Fetch unread emails in the inbox that are replies (have In-Reply-To header),
    sent to the SENDER_EMAIL address.
    """
    try:
        results = service.users().messages().list(
            userId="me",
            q=f"is:unread to:{SENDER_EMAIL} in:inbox",
            maxResults=25,
        ).execute()
        messages = results.get("messages", [])
    except HttpError as exc:
        logger.error("Gmail list failed: %s", exc)
        return []

    emails = []
    for msg_meta in messages:
        try:
            msg = service.users().messages().get(
                userId="me",
                id=msg_meta["id"],
                format="full",
            ).execute()
            emails.append(msg)
        except HttpError as exc:
            logger.warning("Could not fetch message id=%s: %s", msg_meta["id"], exc)

    return emails


def _parse_email(msg: dict) -> dict:
    """Extract sender, subject, and plain-text body from a Gmail message."""
    headers = {h["name"]: h["value"] for h in msg.get("payload", {}).get("headers", [])}
    from_raw = headers.get("From", "")
    _, from_email = parseaddr(from_raw)
    subject = headers.get("Subject", "")

    body = _extract_body(msg.get("payload", {}))

    return {
        "gmail_id": msg["id"],
        "from_email": from_email,
        "from_name": from_raw.split("<")[0].strip().strip('"'),
        "subject": subject,
        "body": body,
    }


def _extract_body(payload: dict) -> str:
    """Recursively extract plain-text body from a Gmail payload."""
    mime_type = payload.get("mimeType", "")
    body_data = payload.get("body", {}).get("data", "")

    if mime_type == "text/plain" and body_data:
        return base64.urlsafe_b64decode(body_data).decode("utf-8", errors="replace")

    for part in payload.get("parts", []):
        text = _extract_body(part)
        if text:
            return text

    return ""


def _classify_intent(client: anthropic.Anthropic, email_body: str, email_subject: str) -> str:
    """
    Use Claude to classify the reply intent.
    Returns one of the INTENT_* constants.
    """
    prompt = f"""\
Classify the intent of this inbound email reply from a local business owner.

Subject: {email_subject}
Body:
{email_body}

Return ONLY a JSON object with a single key "intent" whose value is one of:
- "interested"       — they want to proceed, ask what's next, or express enthusiasm
- "question"         — they have a specific question (pricing details, process, timeline, hosting)
- "price_objection"  — they think it's too expensive or want to negotiate
- "unsure"           — they're on the fence, non-committal, want to think about it
- "not_interested"   — they explicitly decline or say no thanks
- "unsubscribe"      — they ask to be removed from the list

Example output: {{"intent": "interested"}}
"""
    try:
        response = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=64,
            system=_NEIL_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text.strip()
        data = json.loads(raw)
        intent = data.get("intent", "").lower()
        if intent not in _VALID_INTENTS:
            logger.warning("Claude returned unknown intent %r — defaulting to 'question'", intent)
            return INTENT_QUESTION
        return intent
    except Exception as exc:
        logger.error("Intent classification failed: %s", exc)
        return INTENT_QUESTION  # safe default


def _generate_reply(
    client: anthropic.Anthropic,
    intent: str,
    original_body: str,
    original_subject: str,
    business_name: str,
) -> str:
    """
    Generate an appropriate reply based on the classified intent.
    Returns the plain-text email body.
    """
    intent_instructions = {
        INTENT_INTERESTED: (
            "The business owner is interested and wants to proceed. "
            "Celebrate briefly, explain the next step (intake form — 5 quick questions: "
            "business name, services offered, preferred colours, any existing images/logo, "
            "and contact details), and offer to call them at their convenience. "
            "Keep it warm and concise."
        ),
        INTENT_QUESTION: (
            "The business owner has a question. Answer it directly and conversationally. "
            "Common questions: how does hosting work (you handle it, included in price), "
            "what's the timeline (3-5 business days from intake), do they own the site (yes, 100% after payment), "
            "what tech is used (modern stack, SEO-ready). Keep it brief."
        ),
        INTENT_PRICE_OBJECTION: (
            "The business owner thinks the price is high. Acknowledge their concern respectfully. "
            "Reinforce the value: agencies charge $3,000–$15,000 for similar work; this is $650 flat, "
            "delivered in under a week. Offer a quick 15-minute call to walk through what they get. "
            "Don't be pushy — be confident."
        ),
        INTENT_UNSURE: (
            "The business owner is on the fence. Offer to send a free mockup of their potential website "
            "so they can see exactly what they'd get before committing to anything. "
            "Frame it as zero risk — they can say no after seeing it."
        ),
        INTENT_NOT_INTERESTED: (
            "The business owner is not interested. Thank them graciously for their time. "
            "Leave the door open ('If circumstances change, feel free to reach out'). "
            "No pressure whatsoever. Wish them well."
        ),
        INTENT_UNSUBSCRIBE: (
            "The business owner wants to unsubscribe. Confirm immediately that you've removed them "
            "from your list and they will not hear from you again. Be brief and respectful."
        ),
    }

    instruction = intent_instructions.get(intent, intent_instructions[INTENT_QUESTION])

    prompt = f"""\
Write a reply email to {business_name} based on their response to your cold outreach.

Their original message:
Subject: {original_subject}
Body:
{original_body}

Instruction: {instruction}

Write only the email body text (no subject line, no "From:", no "To:"). \
End with your standard signature. Keep it under 200 words.
"""
    try:
        response = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=512,
            system=_NEIL_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text.strip()
    except Exception as exc:
        logger.error("Reply generation failed: %s", exc)
        return (
            f"Hi {business_name},\n\nThank you for your reply — I'll get back to you shortly.\n\n"
            f"{OWNER_NAME}\nLeadForge AI · {WEBSITE_URL} · {PHONE_NUMBER}"
        )


def _mark_as_read(service, gmail_id: str) -> None:
    """Remove the UNREAD label from a message."""
    try:
        service.users().messages().modify(
            userId="me",
            id=gmail_id,
            body={"removeLabelIds": ["UNREAD"]},
        ).execute()
    except HttpError as exc:
        logger.warning("Could not mark message %s as read: %s", gmail_id, exc)


def check_and_handle_replies() -> int:
    """
    Read unread Gmail replies, classify intent, auto-respond, and update the DB.

    Returns:
        Number of replies handled.
    """
    try:
        service = _get_gmail_service()
    except Exception as exc:
        logger.error("Gmail authentication failed: %s", exc)
        return 0

    raw_emails = _get_unread_replies(service)
    if not raw_emails:
        logger.info("No unread replies found")
        return 0

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    handled = 0

    for raw_msg in raw_emails:
        try:
            email = _parse_email(raw_msg)
            sender_email = email["from_email"]
            logger.info(
                "Processing reply from %s | subject=%r",
                sender_email,
                email["subject"],
            )

            # Look up the corresponding lead
            lead = lead_db.get_lead_by_email(sender_email)
            business_name = lead["business_name"] if lead else email["from_name"] or "there"
            lead_id = lead["id"] if lead else None

            # Classify intent
            intent = _classify_intent(client, email["body"], email["subject"])
            logger.info("Intent classified as %r for %s", intent, sender_email)

            # Update DB
            if lead_id:
                lead_db.record_reply(lead_id)

                intent_to_status = {
                    INTENT_INTERESTED: "Interested",
                    INTENT_QUESTION: "Follow Up",
                    INTENT_PRICE_OBJECTION: "Follow Up",
                    INTENT_UNSURE: "Follow Up",
                    INTENT_NOT_INTERESTED: "Not Interested",
                    INTENT_UNSUBSCRIBE: "Not Interested",
                }
                new_status = intent_to_status.get(intent, "Follow Up")
                lead_db.update_lead_status(lead_id, new_status, notes=f"Intent: {intent}")
                lead_db.log_email(
                    lead_id,
                    direction="inbound",
                    subject=email["subject"],
                    body=email["body"][:2000],
                )

            # Generate and send response
            reply_body = _generate_reply(
                client,
                intent,
                email["body"],
                email["subject"],
                business_name,
            )
            reply_subject = f"Re: {email['subject']}" if not email["subject"].startswith("Re:") else email["subject"]

            sent = send_reply_email(sender_email, reply_subject, reply_body)
            if sent and lead_id:
                lead_db.log_email(
                    lead_id,
                    direction="outbound",
                    subject=reply_subject,
                    body=reply_body,
                )

            # If interested, trigger mockup generation
            if intent == INTENT_INTERESTED and lead:
                category = lead.get("category", "local business")
                address = lead.get("business_address", "New Brunswick")
                try:
                    mockup_path = mockup_generator.generate_mockup(
                        business_name=business_name,
                        category=category,
                        location=address,
                    )
                    if mockup_path and lead_id:
                        lead_db.mark_mockup_sent(lead_id)
                        logger.info("Mockup generated: %s", mockup_path)
                except Exception as exc:
                    logger.error("Mockup generation failed for %s: %s", business_name, exc)

            # Mark message as read in Gmail
            _mark_as_read(service, email["gmail_id"])
            handled += 1

        except Exception as exc:
            logger.error("Error handling reply from raw message: %s", exc)
            continue

    logger.info("Reply handling complete — %d replies handled", handled)
    return handled
