"""
LeadForge AI — Database Module
Manages the SQLite leads.db with full CRUD helpers.
"""

import logging
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

from config import DB_PATH

logger = logging.getLogger(__name__)

# ── Schema ────────────────────────────────────────────────────────────────────
_SCHEMA = """
CREATE TABLE IF NOT EXISTS leads (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name     TEXT    NOT NULL,
    business_email    TEXT,
    business_phone    TEXT,
    business_address  TEXT,
    category          TEXT,
    maps_url          TEXT,
    status            TEXT    DEFAULT 'Sent',
    email_sent_at     TIMESTAMP,
    last_reply_at     TIMESTAMP,
    reply_count       INTEGER DEFAULT 0,
    notes             TEXT,
    mockup_sent       INTEGER DEFAULT 0,
    follow_up_count   INTEGER DEFAULT 0,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_log (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id   INTEGER REFERENCES leads(id),
    direction TEXT,
    subject   TEXT,
    body      TEXT,
    sent_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

_UPDATE_TRIGGER = """
CREATE TRIGGER IF NOT EXISTS update_leads_timestamp
AFTER UPDATE ON leads
FOR EACH ROW
BEGIN
    UPDATE leads SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
"""


def _connect() -> sqlite3.Connection:
    """Return a connection with row_factory set to Row."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def init_db() -> None:
    """Create tables and triggers if they don't exist yet."""
    db_path = Path(DB_PATH)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with _connect() as conn:
        conn.executescript(_SCHEMA)
        conn.executescript(_UPDATE_TRIGGER)
    logger.info("Database initialised at %s", DB_PATH)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return dict(row)


# ── Public API ────────────────────────────────────────────────────────────────

def add_lead(lead_dict: dict) -> int:
    """
    Insert a new lead row and return the auto-generated id.

    Expected keys (all optional except business_name):
        business_name, business_email, business_phone, business_address,
        category, maps_url
    """
    sql = """
        INSERT INTO leads (
            business_name, business_email, business_phone,
            business_address, category, maps_url, status, email_sent_at
        ) VALUES (
            :business_name, :business_email, :business_phone,
            :business_address, :category, :maps_url, 'Discovered', NULL
        )
    """
    params = {
        "business_name": lead_dict.get("business_name", ""),
        "business_email": lead_dict.get("email") or lead_dict.get("business_email"),
        "business_phone": lead_dict.get("phone") or lead_dict.get("business_phone"),
        "business_address": lead_dict.get("address") or lead_dict.get("business_address"),
        "category": lead_dict.get("category"),
        "maps_url": lead_dict.get("maps_url"),
    }
    with _connect() as conn:
        cur = conn.execute(sql, params)
        lead_id = cur.lastrowid
    logger.debug("Inserted lead id=%s: %s", lead_id, lead_dict.get("business_name"))
    return lead_id


def update_lead_status(lead_id: int, status: str, notes: str | None = None) -> None:
    """Update a lead's status (and optionally append to notes)."""
    if notes:
        sql = """
            UPDATE leads
            SET status = ?, notes = COALESCE(notes || ' | ', '') || ?
            WHERE id = ?
        """
        params = (status, notes, lead_id)
    else:
        sql = "UPDATE leads SET status = ? WHERE id = ?"
        params = (status, lead_id)

    with _connect() as conn:
        conn.execute(sql, params)
    logger.debug("Lead id=%s status -> %s", lead_id, status)


def mark_email_sent(lead_id: int) -> None:
    """Stamp email_sent_at and set status to Sent."""
    with _connect() as conn:
        conn.execute(
            "UPDATE leads SET status = 'Sent', email_sent_at = ? WHERE id = ?",
            (datetime.utcnow().isoformat(), lead_id),
        )


def increment_follow_up(lead_id: int) -> None:
    """Bump follow_up_count for a lead."""
    with _connect() as conn:
        conn.execute(
            "UPDATE leads SET follow_up_count = follow_up_count + 1 WHERE id = ?",
            (lead_id,),
        )


def mark_mockup_sent(lead_id: int) -> None:
    """Set mockup_sent flag to 1."""
    with _connect() as conn:
        conn.execute("UPDATE leads SET mockup_sent = 1 WHERE id = ?", (lead_id,))


def record_reply(lead_id: int) -> None:
    """Increment reply_count and stamp last_reply_at."""
    with _connect() as conn:
        conn.execute(
            """
            UPDATE leads
            SET reply_count = reply_count + 1,
                last_reply_at = ?
            WHERE id = ?
            """,
            (datetime.utcnow().isoformat(), lead_id),
        )


def get_leads_by_status(status: str) -> list[dict]:
    """Return all leads matching the given status."""
    with _connect() as conn:
        rows = conn.execute(
            "SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC",
            (status,),
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


def lead_exists(business_name: str, email: str | None) -> bool:
    """Return True if a lead with this name or email already exists."""
    with _connect() as conn:
        if email:
            row = conn.execute(
                "SELECT id FROM leads WHERE business_name = ? OR business_email = ?",
                (business_name, email),
            ).fetchone()
        else:
            row = conn.execute(
                "SELECT id FROM leads WHERE business_name = ?",
                (business_name,),
            ).fetchone()
    return row is not None


def get_lead_by_email(email: str) -> dict | None:
    """Look up a lead by its business_email. Returns None if not found."""
    with _connect() as conn:
        row = conn.execute(
            "SELECT * FROM leads WHERE business_email = ? ORDER BY created_at DESC LIMIT 1",
            (email,),
        ).fetchone()
    return _row_to_dict(row) if row else None


def log_email(lead_id: int, direction: str, subject: str, body: str) -> None:
    """Append an entry to email_log."""
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO email_log (lead_id, direction, subject, body)
            VALUES (?, ?, ?, ?)
            """,
            (lead_id, direction, subject, body),
        )
    logger.debug("Logged %s email for lead id=%s | subject=%s", direction, lead_id, subject)


def get_stale_leads(days: int = 3, follow_up_count: int = 0) -> list[dict]:
    """
    Return leads with status='Sent' or 'Follow Up', email sent more than `days` ago,
    no reply yet (reply_count = 0), and exactly `follow_up_count` follow-ups sent.
    """
    cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()
    with _connect() as conn:
        rows = conn.execute(
            """
            SELECT * FROM leads
            WHERE status IN ('Sent', 'Follow Up')
              AND email_sent_at < ?
              AND reply_count = 0
              AND follow_up_count = ?
            ORDER BY email_sent_at ASC
            """,
            (cutoff, follow_up_count),
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


def increment_follow_up_count(lead_id: int) -> None:
    """Alias for increment_follow_up — bumps follow_up_count by 1."""
    increment_follow_up(lead_id)


def get_all_leads() -> list[dict]:
    """Return every lead row (for reporting)."""
    with _connect() as conn:
        rows = conn.execute("SELECT * FROM leads ORDER BY created_at DESC").fetchall()
    return [_row_to_dict(r) for r in rows]
