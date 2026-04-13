"""
LeadForge AI — Main Agent Orchestrator
Runs Mon–Fri at 6:00 AM via GitHub Actions.
Hard 15-minute runtime budget (14-min internal cap).

Steps:
  1. Lead Discovery  — Google Maps → businesses without websites
  2. Email Outreach  — Send cold email via Resend
  3. Lead Tracking   — Log everything to SQLite
  4. Reply Handling  — Read inbound Gmail replies, classify, respond
  5. Mockup Gen      — Generate HTML mockup for interested leads
  6. Follow-Ups      — Day 3 / Day 7 sequences for non-responders
  7. Summary         — Print run stats
"""

import logging
import os
import sys
import time
from datetime import datetime

# ── Logging setup (file + console) ────────────────────────────────────────────
from config import (
    AGENT_TIMEOUT_SECONDS,
    DB_PATH,
    LOG_FILE,
    MAX_EMAILS_PER_RUN,
    MOCKUPS_DIR,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)

logger = logging.getLogger("leadforge.agent")


def _elapsed(start: float) -> float:
    return time.time() - start


def _time_left(start: float) -> float:
    return AGENT_TIMEOUT_SECONDS - _elapsed(start)


def _check_time(start: float, label: str) -> bool:
    """Return True if we have > 60 seconds left, else log a warning and return False."""
    remaining = _time_left(start)
    if remaining < 60:
        logger.warning("Skipping step '%s' — only %.0fs remaining", label, remaining)
        return False
    logger.info("Step '%s' starting — %.0fs remaining", label, remaining)
    return True


# ── Ensure required directories exist ─────────────────────────────────────────

def _ensure_dirs() -> None:
    os.makedirs(MOCKUPS_DIR, exist_ok=True)
    # DB is created automatically by lead_db on first import


# ── Individual step wrappers ───────────────────────────────────────────────────

def step_discover(start: float) -> list[dict]:
    """Step 1: Discover new leads via Google Maps."""
    if not _check_time(start, "Lead Discovery"):
        return []
    try:
        import lead_discovery
        leads = lead_discovery.discover_leads(max_results=20)
        logger.info("Discovery: %d new leads found", len(leads))
        return leads
    except Exception:
        logger.exception("Lead discovery failed")
        return []


def step_outreach(start: float, leads: list[dict]) -> int:
    """Step 2+3: Send cold emails + log to DB. Returns # emails sent."""
    if not leads:
        return 0
    if not _check_time(start, "Email Outreach"):
        return 0

    import lead_db
    import email_sender

    sent = 0
    for lead in leads:
        if sent >= MAX_EMAILS_PER_RUN:
            logger.info("Reached MAX_EMAILS_PER_RUN (%d) — stopping outreach", MAX_EMAILS_PER_RUN)
            break
        if _time_left(start) < 90:
            logger.warning("Low time budget — stopping outreach at %d sent", sent)
            break

        # Only email leads we have an address for
        if not lead.get("email"):
            # Store lead without sending so we don't lose the discovery
            lead_id = lead_db.add_lead({**lead, "status": "No Email"})
            logger.info("Stored (no email): %s [id=%s]", lead["business_name"], lead_id)
            continue

        lead_id = lead_db.add_lead(lead)
        success = email_sender.send_cold_email(lead)

        if success:
            lead_db.update_lead_status(lead_id, "Sent")
            lead_db.log_email(
                lead_id,
                direction="outbound",
                subject=f"Quick website for {lead['business_name']} in 3–5 days",
                body="[cold outreach template]",
            )
            logger.info("Email sent → %s <%s>", lead["business_name"], lead.get("email"))
            sent += 1
        else:
            lead_db.update_lead_status(lead_id, "Error", notes="Email send failed")
            logger.warning("Email failed → %s", lead["business_name"])

    return sent


def step_replies(start: float) -> int:
    """Step 4+5: Check inbound replies, classify, respond, generate mockups."""
    if not _check_time(start, "Reply Handling"):
        return 0
    try:
        import reply_handler
        handled = reply_handler.check_and_handle_replies()
        logger.info("Replies handled: %d", handled)
        return handled
    except Exception:
        logger.exception("Reply handling failed")
        return 0


def step_follow_ups(start: float) -> int:
    """Step 6: Send follow-ups to stale leads."""
    if not _check_time(start, "Follow-Ups"):
        return 0
    try:
        import follow_up
        count = follow_up.send_follow_ups()
        logger.info("Follow-ups sent: %d", count)
        return count
    except Exception:
        logger.exception("Follow-up step failed")
        return 0


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    start = time.time()
    run_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    logger.info("=" * 70)
    logger.info("LeadForge AI Agent — Run started at %s", run_date)
    logger.info("Timeout budget: %ds (%dm)", AGENT_TIMEOUT_SECONDS, AGENT_TIMEOUT_SECONDS // 60)
    logger.info("=" * 70)

    _ensure_dirs()

    # ── Step 1: Discovery ──────────────────────────────────────────────────────
    leads = step_discover(start)

    # ── Step 2+3: Outreach ─────────────────────────────────────────────────────
    emails_sent = step_outreach(start, leads)

    # ── Step 4+5: Reply handling + mockups ────────────────────────────────────
    replies_handled = step_replies(start)

    # ── Step 6: Follow-ups ────────────────────────────────────────────────────
    follow_ups_sent = step_follow_ups(start)

    # ── Summary ───────────────────────────────────────────────────────────────
    elapsed = _elapsed(start)
    logger.info("=" * 70)
    logger.info("Run complete in %.1fs (%.1fm)", elapsed, elapsed / 60)
    logger.info("  Leads discovered : %d", len(leads))
    logger.info("  Emails sent      : %d", emails_sent)
    logger.info("  Replies handled  : %d", replies_handled)
    logger.info("  Follow-ups sent  : %d", follow_ups_sent)
    logger.info("=" * 70)


if __name__ == "__main__":
    main()
