# LeadForge AI

LeadForge AI pairs a Next.js marketing site with a Python outreach agent for Saint John small-business website leads. The agent finds businesses with weak or missing web presence, sends cold email through Resend, tracks replies in SQLite, and can generate simple HTML mockups for interested leads.

The offer is intentionally simple: Neil builds a professional React/Next.js website in 3 to 5 days for a flat $650, then hands over the deployed site and code.

## Website Preview

![LeadForge AI website hero screenshot](docs/assets/readme-screenshot.png)

## Repository Structure

```text
leadforge/
  agent/                  Python outreach agent
    agent.py              Run orchestrator with a 15 minute cap
    config.py             Environment variables and constants
    lead_discovery.py     Google Maps business discovery
    email_sender.py       Resend cold outreach
    lead_db.py            SQLite lead database
    reply_handler.py      Gmail reply reading and classification
    mockup_generator.py   HTML mockup generation
    follow_up.py          Day 3 and Day 7 follow-ups

  website/                Next.js 14 website for leadforge-ai.ca
    app/                  Pages, metadata, contact API, and routes
    components/           Navbar, footer, pricing, process, and 3D hero UI

  .github/workflows/
    agent.yml             Weekday GitHub Actions schedule
```

## Website

```bash
cd website
npm install
npm run dev
npm run build
```

Local dev runs at `http://localhost:3000`. Production is intended for Vercel with the public domain `leadforge-ai.ca`.

## Agent

```bash
cd agent
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python agent.py
```

On Windows, activate the virtual environment with:

```powershell
.\.venv\Scripts\Activate.ps1
```

## GitHub Actions

The production agent workflow runs Monday to Friday at `09:00 UTC`, which is 6:00 AM Atlantic Daylight Time. It can also be started manually from the Actions tab.

Required repository secrets:

| Secret | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude classification and mockup generation |
| `RESEND_API_KEY` | Outbound email |
| `GOOGLE_MAPS_API_KEY` | Places discovery |
| `SENDER_EMAIL` | Sender identity |
| `GMAIL_TOKEN_JSON` | Optional Gmail OAuth token for reply handling |

## Gmail OAuth

1. Enable the Gmail API in Google Cloud Console.
2. Create OAuth 2.0 credentials for a desktop app.
3. Save `credentials.json` in `agent/`.
4. Run the reply handler once locally to generate `token.json`.
5. Store the token contents as the `GMAIL_TOKEN_JSON` GitHub secret.

## Business Model

| Scenario | Revenue | Net Profit | Margin |
|---|---:|---:|---:|
| 1 site/month | $650 | about $438 | 67% |
| 3 sites/month | $1,950 | about $1,738 | 89% |
| 6 sites/month | $3,900 | about $3,638 | 93% |

Fixed overhead is about $201.50 per month. Break-even is about 0.31 sites per month.

## Tech Stack

| Layer | Technology |
|---|---|
| Agent | Python, Claude Sonnet, Google Maps Places API, Resend, Gmail OAuth, SQLite |
| Website | Next.js 14, React 18, Tailwind CSS, Three.js, Framer Motion |
| Hosting | Vercel for the site, GitHub Actions for the agent |

## Contact

- Neil Mitchell
- LeadForge AI, Saint John, NB
- 506-639-9083
- neil@leadforge-ai.ca
