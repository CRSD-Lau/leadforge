"""
LeadForge AI — HTML Mockup Generator
Uses Claude to produce a single-file responsive HTML landing page for a lead,
then saves it to the mockups/ directory and optionally emails it.
"""

import logging
import os
import re
from pathlib import Path

import anthropic

from config import (
    ANTHROPIC_API_KEY,
    CLAUDE_MODEL,
    MOCKUPS_DIR,
    OWNER_NAME,
    PHONE_NUMBER,
    SENDER_EMAIL,
    WEBSITE_URL,
)

logger = logging.getLogger(__name__)

_NEIL_SYSTEM = f"""\
You are Neil Mitchell, a professional web designer and President of LeadForge AI. \
You create stunning, modern HTML websites for local Canadian businesses. \
Your designs are clean, professional, mobile-responsive, and conversion-focused.
"""

_MOCKUP_PROMPT = """\
Generate a complete, single-file HTML landing page for a local business with these details:

Business Name: {business_name}
Category: {category}
Location: {location}

Requirements:
1. Single HTML file with ALL CSS inlined in a <style> tag (no external stylesheets, no CDN links)
2. Professional, modern design — clean typography, tasteful colour palette suited to the business type
3. Fully responsive (mobile-first, works on all screen sizes)
4. Sections to include:
   a. Navigation bar with business name and a "Contact Us" CTA button
   b. Hero section — large heading with business name, a short punchy tagline, and a CTA button
   c. About section — 2-3 sentences describing the business (make it sound authentic and local)
   d. Services section — 3–4 service cards with icons (use Unicode/emoji as inline icons), title, and 1-line description
   e. Why Choose Us — 3 bullet points with icons highlighting professionalism, local roots, and reliability
   f. Contact section — placeholder phone number, placeholder address in {location}, contact form (non-functional, visual only)
   g. Footer with business name, copyright, and "Website by LeadForge AI · neil-mitchell.vercel.app"
5. Colour palette: choose 2–3 colours appropriate for a {category} business. Use CSS custom properties (--primary, --secondary, --accent).
6. Typography: use a clean system font stack (e.g. -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)
7. Smooth scroll behaviour on anchor links
8. Subtle box shadows and border-radius on cards for depth
9. CTA buttons should use the primary colour and have a hover effect

Output ONLY the complete HTML — no markdown, no explanation, no code fences. Start with <!DOCTYPE html>.
"""


def _slugify(name: str) -> str:
    """Convert a business name to a safe filename slug."""
    slug = name.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    return slug[:60] or "business"


def generate_mockup(business_name: str, category: str, location: str) -> str | None:
    """
    Generate a responsive HTML mockup for a business using Claude.

    Args:
        business_name: The business's name.
        category:      Business category (e.g. "plumber", "hair salon").
        location:      City/region string (e.g. "Saint John, NB").

    Returns:
        Absolute path to the saved HTML file, or None on failure.
    """
    logger.info("Generating mockup for %s (%s) in %s", business_name, category, location)

    prompt = _MOCKUP_PROMPT.format(
        business_name=business_name,
        category=category,
        location=location,
    )

    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        response = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=4096,
            system=_NEIL_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        html_content = response.content[0].text.strip()
    except Exception as exc:
        logger.error("Claude mockup generation failed for %s: %s", business_name, exc)
        return None

    # Strip any accidental markdown code fences
    if html_content.startswith("```"):
        lines = html_content.split("\n")
        # Remove first and last fence lines
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        html_content = "\n".join(lines)

    # Ensure the mockups directory exists
    mockups_path = Path(MOCKUPS_DIR)
    mockups_path.mkdir(parents=True, exist_ok=True)

    slug = _slugify(business_name)
    file_path = mockups_path / f"{slug}.html"

    try:
        file_path.write_text(html_content, encoding="utf-8")
        logger.info("Mockup saved: %s", file_path)
        return str(file_path.resolve())
    except Exception as exc:
        logger.error("Failed to save mockup HTML for %s: %s", business_name, exc)
        return None


def generate_and_email_mockup(lead: dict) -> bool:
    """
    Generate a mockup and email it (as an attachment or inline link) to the lead.

    For now, we email a message telling them we've created a preview and direct
    them to reply so we can share it. (Direct HTML attachment via Resend requires
    a paid plan; inline link via a hosting step is more robust.)

    Args:
        lead: Lead dict from the database.

    Returns:
        True if the notification email was sent successfully.
    """
    from email_sender import send_reply_email  # local import to avoid circular

    business_name = lead.get("business_name", "your business")
    category = lead.get("category", "local business")
    location = lead.get("business_address", "New Brunswick")
    to_email = lead.get("business_email")

    if not to_email:
        logger.warning("No email for lead %s — skipping mockup email", business_name)
        return False

    file_path = generate_mockup(business_name, category, location)
    if not file_path:
        return False

    subject = f"Here's a free mockup I built for {business_name}"
    body = f"""\
Hi {business_name},

I put together a quick mockup of what your website could look like — and I have to say, \
it came out really well.

I've got the design ready on my end. To send it over, just reply to this email and I'll \
share the live preview link with you right away. Takes 30 seconds.

No commitment required — I want you to see exactly what you'd be getting before deciding anything.

Looking forward to hearing from you!

{OWNER_NAME}
President & CEO · CTO
LeadForge AI · {WEBSITE_URL} · {PHONE_NUMBER}

---
To unsubscribe, reply with "UNSUBSCRIBE". LeadForge AI · Saint John, NB · CASL-compliant.
"""
    success = send_reply_email(to_email, subject, body)
    if success:
        logger.info("Mockup notification sent to %s <%s>", business_name, to_email)
    return success
