"""
LeadForge AI — Follow-Up Module
Sends Day 3 and Day 7 follow-up emails to non-responding leads.
Industry benchmarks: follow-ups double response rates from ~2-3% to 5-7%.
"""

import logging

import anthropic
import resend

import lead_db
from config import (
    ANTHROPIC_API_KEY,
    CLAUDE_MODEL,
    OWNER_NAME,
    PHONE_NUMBER,
    RESEND_API_KEY,
    SENDER_EMAIL,
    WEBSITE_URL,
)

logger = logging.getLogger(__name__)

resend.api_key = RESEND_API_KEY
_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

_SYSTEM_PROMPT = f"""You are {OWNER_NAME}, owner of LeadForge AI in Saint John, NB.
You write concise, warm, non-pushy follow-up emails to local business owners.
Your tone is friendly and professional — never salesy or desperate.
Keep emails short (under 120 words). Always offer a specific next step.
Sign off as: {OWNER_NAME} | LeadForge AI | {WEBSITE_URL} | {PHONE_NUMBER}
"""


def _generate_follow_up(lead: dict, follow_up_number: int) -> str:
    """Use Claude to write a follow-up email body."""
    business_name = lead["business_name"]
    category = lead.get("category", "business")

    angle = (
        "Offer to send a free mockup of what their website could look like."
        if follow_up_number == 1
        else "Reference that you only work with a small number of local businesses at a time and spots are limited."
    )

    prompt = (
        f"Write follow-up #{follow_up_number} to {business_name}, a {category} in Saint John NB "
        f"who didn't respond to my first email about building them a professional website for $650. "
        f"Angle: {angle}. "
        f"Keep it under 120 words. Don't repeat everything from the first email — just a new hook."
    )

    try:
        message = _client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=300,
            system=_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )
        return message.content[0].text.strip()
    except Exception as exc:
        logger.error("Claude follow-up generation failed for %s: %s", business_name, exc)
        # Fallback template
        if follow_up_number == 1:
            return (
                f"Hi {business_name},\n\n"
                "Just following up on my note from a few days ago about your website.\n\n"
                "I can send you a free mockup of what your site could look like — "
                "no commitment required. Takes me about 10 minutes.\n\n"
                f"Let me know!\n\n{OWNER_NAME}\nLeadForge AI · {WEBSITE_URL} · {PHONE_NUMBER}"
            )
        return (
            f"Hi {business_name},\n\n"
            "Last note from me — I only take on a handful of local builds each month "
            "and I have one spot left. $650 flat, live in 3–5 days.\n\n"
            "Happy to hop on a quick call if that helps.\n\n"
            f"{OWNER_NAME}\nLeadForge AI · {WEBSITE_URL} · {PHONE_NUMBER}"
        )


def send_follow_ups() -> int:
    """
    Find stale leads and send follow-up emails.
    - Day 3 follow-up: leads with status='Sent', no reply, sent 3+ days ago
    - Day 7 follow-up: leads with follow_up_count=1, still no reply, 7+ days since first send

    Returns the number of follow-up emails sent.
    """
    sent_count = 0

    # --- Day 3 follow-ups ---
    day3_leads = lead_db.get_stale_leads(days=3, follow_up_count=0)
    logger.info("Day 3 follow-up candidates: %d", len(day3_leads))

    for lead in day3_leads:
        if not lead.get("business_email"):
            logger.debug("No email for lead id=%s, skipping follow-up", lead["id"])
            continue

        body = _generate_follow_up(lead, follow_up_number=1)
        subject = f"Still interested? Website for {lead['business_name']}"

        try:
            resend.Emails.send({
                "from": f"Neil Mitchell <{SENDER_EMAIL}>",
                "to": [lead["business_email"]],
                "subject": subject,
                "text": body,
            })
            lead_db.update_lead_status(lead["id"], "Follow Up", notes="Day 3 follow-up sent")
            lead_db.log_email(lead["id"], "outbound", subject, body)
            # Increment follow_up_count
            lead_db.increment_follow_up_count(lead["id"])
            logger.info("Day 3 follow-up sent → %s", lead["business_name"])
            sent_count += 1
        except Exception as exc:
            logger.error("Day 3 follow-up failed for %s: %s", lead["business_name"], exc)

    # --- Day 7 follow-ups ---
    day7_leads = lead_db.get_stale_leads(days=7, follow_up_count=1)
    logger.info("Day 7 follow-up candidates: %d", len(day7_leads))

    for lead in day7_leads:
        if not lead.get("business_email"):
            continue

        body = _generate_follow_up(lead, follow_up_number=2)
        subject = f"Last note — website for {lead['business_name']}"

        try:
            resend.Emails.send({
                "from": f"Neil Mitchell <{SENDER_EMAIL}>",
                "to": [lead["business_email"]],
                "subject": subject,
                "text": body,
            })
            lead_db.update_lead_status(lead["id"], "Follow Up", notes="Day 7 follow-up sent")
            lead_db.log_email(lead["id"], "outbound", subject, body)
            lead_db.increment_follow_up_count(lead["id"])
            logger.info("Day 7 follow-up sent → %s", lead["business_name"])
            sent_count += 1
        except Exception as exc:
            logger.error("Day 7 follow-up failed for %s: %s", lead["business_name"], exc)

    return sent_count
