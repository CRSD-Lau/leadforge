"""
LeadForge AI — Configuration
Loads all environment variables and defines static constants.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ── API keys ──────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY: str = os.environ["ANTHROPIC_API_KEY"]
RESEND_API_KEY: str = os.environ["RESEND_API_KEY"]
GOOGLE_MAPS_API_KEY: str = os.environ["GOOGLE_MAPS_API_KEY"]

# ── Sender identity ───────────────────────────────────────────────────────────
SENDER_EMAIL: str = os.environ.get("SENDER_EMAIL", "neil@leadforge-ai.ca")
PHONE_NUMBER: str = "506-639-9083"
WEBSITE_URL: str = "neil-mitchell.vercel.app"
OWNER_NAME: str = "Neil Mitchell"

# ── Gmail ─────────────────────────────────────────────────────────────────────
GMAIL_CREDENTIALS_PATH: str = os.environ.get("GMAIL_CREDENTIALS_PATH", "credentials.json")
GMAIL_TOKEN_PATH: str = os.environ.get("GMAIL_TOKEN_PATH", "token.json")

# ── Business categories to search ─────────────────────────────────────────────
SEARCH_CATEGORIES: list[str] = [
    "restaurant",
    "plumber",
    "roofing contractor",
    "auto detailing",
    "hair salon",
    "dentist",
    "landscaping",
    "gym",
    "construction",
    "electrician",
    "flooring",
    "painting contractor",
    "hvac",
    "moving company",
    "pet grooming",
    "physiotherapy",
    "massage therapy",
    "childcare",
    "bakery",
    "alterations",
    "fence company",
    "snow removal",
    "cleaning service",
    "tutoring",
    "yoga studio",
    "mechanic",
    "martial arts",
    "optometrist",
    "accounting",
    "photography",
]

# ── Target regions ────────────────────────────────────────────────────────────
TARGET_REGIONS: list[str] = [
    "Saint John New Brunswick",
    "Quispamsis New Brunswick",
    "Rothesay New Brunswick",
]

# ── Agent runtime settings ────────────────────────────────────────────────────
MAX_EMAILS_PER_RUN: int = 10
# 14 minutes — 1-minute buffer before GitHub Actions 15-minute timeout
AGENT_TIMEOUT_SECONDS: int = 14 * 60

# ── Paths ─────────────────────────────────────────────────────────────────────
DB_PATH: str = os.environ.get("DB_PATH", "leads.db")
MOCKUPS_DIR: str = os.environ.get("MOCKUPS_DIR", "mockups")
LOG_FILE: str = "agent.log"

# ── LLM ──────────────────────────────────────────────────────────────────────
CLAUDE_MODEL: str = "claude-sonnet-4-6"
