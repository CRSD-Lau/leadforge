"""
LeadForge AI — Email Sender Module
Sends cold outreach and follow-up emails via the Resend API.
"""

import logging
from string import Template

import resend

import lead_db
from config import (
    OWNER_NAME,
    PHONE_NUMBER,
    RESEND_API_KEY,
    SENDER_EMAIL,
    WEBSITE_URL,
)

logger = logging.getLogger(__name__)

resend.api_key = RESEND_API_KEY

# ── Email templates ───────────────────────────────────────────────────────────

_COLD_SUBJECT = "Quick website for {business_name} in 3–5 days"

_COLD_BODY = """\
Hello {business_name},

I came across your business and noticed you currently don't have a website (or it appears outdated).

I specialise in designing modern, scalable, and aesthetically pleasing websites for local businesses. \
I have over 10 years of experience and can deliver a fully deployed professional website within 3–5 business days.

You can view my own professional site here: {website_url}

I offer:
  · Flat rate: $650 per site
  · Delivered in 3–5 business days
  · Fully deployed production site
  · Modern responsive design
  · SEO-friendly structure

After launch:
  · $75/hour for updates
  · No minimum time
  · Prorated to 10-minute intervals

If you'd like, I can even send a quick mockup tailored to your business.

Let me know!

{owner_name}
President & CEO · CTO
LeadForge AI · {website_url} · {phone_number}

---
You are receiving this email because your business appeared in a local search. \
To unsubscribe and never be contacted again, simply reply with "UNSUBSCRIBE" in the subject line. \
LeadForge AI · Saint John, New Brunswick, Canada · CASL-compliant outreach.
"""

_FOLLOW_UP_SUBJECT = "Free mockup for {business_name} — no strings attached"

_FOLLOW_UP_BODY = """\
Hi {business_name},

I reached out a few days ago about building a website for your business.

I wanted to follow up with a specific offer: I'll create a **free mockup** of what your website could look like — \
no commitment required. You can see the design before you decide anything.

A few quick facts:
  · $650 flat rate — one payment, fully deployed site
  · Ready in 3–5 business days
  · Modern, mobile-friendly, SEO-ready

Interested in seeing the mockup? Just reply and I'll have it to you within hours.

{owner_name}
LeadForge AI · {website_url} · {phone_number}

---
To unsubscribe, reply with "UNSUBSCRIBE" in the subject line. \
LeadForge AI · Saint John, New Brunswick, Canada · CASL-compliant outreach.
"""


def _render(template: str, **kwargs) -> str:
    """Simple string-format render with safe fallbacks."""
    return template.format(**kwargs)


def send_cold_email(lead: dict) -> bool:
    """
    Send a cold outreach email to a discovered lead.

    Args:
        lead: Dict with at least 'business_name' and 'business_email'.

    Returns:
        True on success, False on any failure.
    """
    to_email = lead.get("business_email") or lead.get("email")
    if not to_email:
        logger.warning("No email address for lead '%s' — skipping", lead.get("business_name"))
        return False

    business_name = lead.get("business_name", "there")
    subject = _COLD_SUBJECT.format(business_name=business_name)
    body = _render(
        _COLD_BODY,
        business_name=business_name,
        website_url=WEBSITE_URL,
        owner_name=OWNER_NAME,
        phone_number=PHONE_NUMBER,
    )

    try:
        response = resend.Emails.send(
            {
                "from": f"{OWNER_NAME} <{SENDER_EMAIL}>",
                "to": [to_email],
                "subject": subject,
                "text": body,
            }
        )
        email_id = response.get("id") if isinstance(response, dict) else getattr(response, "id", None)
        logger.info(
            "Cold email sent to %s <%s> | resend_id=%s",
            business_name,
            to_email,
            email_id,
        )
        return True

    except Exception as exc:
        logger.error("Failed to send cold email to %s <%s>: %s", business_name, to_email, exc)
        return False


def send_follow_up_email(lead: dict) -> bool:
    """
    Send a follow-up email to a stale lead (no reply after 3 days).

    Args:
        lead: Lead dict from the database.

    Returns:
        True on success, False on any failure.
    """
    to_email = lead.get("business_email")
    if not to_email:
        logger.warning("No email address for lead id=%s — skipping follow-up", lead.get("id"))
        return False

    business_name = lead.get("business_name", "there")
    subject = _FOLLOW_UP_SUBJECT.format(business_name=business_name)
    body = _render(
        _FOLLOW_UP_BODY,
        business_name=business_name,
        website_url=WEBSITE_URL,
        owner_name=OWNER_NAME,
        phone_number=PHONE_NUMBER,
    )

    try:
        response = resend.Emails.send(
            {
                "from": f"{OWNER_NAME} <{SENDER_EMAIL}>",
                "to": [to_email],
                "subject": subject,
                "text": body,
            }
        )
        email_id = response.get("id") if isinstance(response, dict) else getattr(response, "id", None)
        logger.info(
            "Follow-up email sent to %s <%s> | resend_id=%s",
            business_name,
            to_email,
            email_id,
        )
        return True

    except Exception as exc:
        logger.error(
            "Failed to send follow-up email to %s <%s>: %s",
            business_name,
            to_email,
            exc,
        )
        return False


def send_reply_email(to_email: str, subject: str, body: str) -> bool:
    """
    Generic reply-sending helper used by reply_handler and mockup_generator.

    Args:
        to_email: Recipient address.
        subject:  Email subject.
        body:     Plain-text body (Claude-generated content is passed in here).

    Returns:
        True on success, False on failure.
    """
    if not to_email:
        logger.warning("send_reply_email called with empty to_email")
        return False

    try:
        response = resend.Emails.send(
            {
                "from": f"{OWNER_NAME} <{SENDER_EMAIL}>",
                "to": [to_email],
                "subject": subject,
                "text": body,
            }
        )
        email_id = response.get("id") if isinstance(response, dict) else getattr(response, "id", None)
        logger.info("Reply sent to %s | resend_id=%s", to_email, email_id)
        return True

    except Exception as exc:
        logger.error("Failed to send reply to %s: %s", to_email, exc)
        return False


def send_booking_message(lead: dict) -> bool:
    """
    Send the close-flow booking message for an interested lead.

    Args:
        lead: Lead dict from the database.

    Returns:
        True on success, False on failure.
    """
    to_email = lead.get("business_email")
    if not to_email:
        return False

    business_name = lead.get("business_name", "there")
    subject = f"Next steps for {business_name}'s new website"

    body = f"""\
Hi {business_name},

Fantastic — I'm excited to get started on your website!

Here's what happens next:

1. I'll send you a brief intake form (5 questions: business name, services, colours, any images, and your contact details).
2. I begin design immediately on receipt.
3. You receive a live preview link within 3–5 business days.
4. Once you approve, the site goes live — no extra charge.

To kick things off, feel free to call or text me directly:
  {PHONE_NUMBER}

Or simply reply to this email with the answers to the five questions above and I'll get rolling right away.

Pricing recap:
  · $650 flat rate — one payment
  · Hosting, domain, and deployment all handled by me
  · Post-launch updates: $75/hr, prorated to 10-minute intervals — no minimum

Full site ownership transfers to you after payment. You get all source files.

Looking forward to working with you!

{OWNER_NAME}
President & CEO · CTO
LeadForge AI · {WEBSITE_URL} · {PHONE_NUMBER}

---
To unsubscribe, reply with "UNSUBSCRIBE". LeadForge AI · Saint John, NB · CASL-compliant.
"""
    return send_reply_email(to_email, subject, body)


def send_terms_email(lead: dict) -> bool:
    """
    Send ownership, delivery, and pricing terms to an interested lead.

    Args:
        lead: Lead dict from the database.

    Returns:
        True on success, False on failure.
    """
    to_email = lead.get("business_email")
    if not to_email:
        return False

    business_name = lead.get("business_name", "there")
    subject = f"Website terms & what you own — {business_name}"

    body = f"""\
Hi {business_name},

Here is a clear breakdown of everything included:

WHAT YOU GET
  · A fully deployed, production-ready website
  · Modern responsive design (works on phone, tablet, desktop)
  · SEO-friendly structure (title tags, meta descriptions, sitemap)
  · All source code — you own it outright after payment
  · Hosted and live with a real domain (I handle setup)

DELIVERY
  · 3–5 business days from the time I receive your intake information
  · You'll review a live preview before anything goes public

PRICING
  · $650 flat rate — one-time payment, no hidden fees
  · Payment due on delivery (you approve the site first)
  · Accepted: Interac e-Transfer, credit card (Stripe link provided)

POST-LAUNCH SUPPORT
  · $75/hour for any updates or additions
  · No minimum hours — prorated to 10-minute intervals
  · Turnaround on updates: typically same day

OWNERSHIP
  · You own 100% of the website after payment
  · All source files delivered via GitHub or ZIP download
  · No lock-in — you can host it anywhere, with anyone

Questions? Call or text me any time:
  {PHONE_NUMBER}

{OWNER_NAME}
President & CEO · CTO
LeadForge AI · {WEBSITE_URL} · {PHONE_NUMBER}

---
To unsubscribe, reply with "UNSUBSCRIBE". LeadForge AI · Saint John, NB · CASL-compliant.
"""
    return send_reply_email(to_email, subject, body)
