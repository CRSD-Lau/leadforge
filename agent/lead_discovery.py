"""
LeadForge AI — Lead Discovery Module
Searches Google Maps Places API for businesses without websites.
"""

import logging
import random
import re
from urllib.parse import quote_plus

import googlemaps

import lead_db
from config import GOOGLE_MAPS_API_KEY, SEARCH_CATEGORIES, TARGET_REGIONS

logger = logging.getLogger(__name__)

# Social-only "websites" that count as having no real site
_SOCIAL_PATTERNS = re.compile(
    r"(facebook\.com|fb\.com|instagram\.com|twitter\.com|x\.com|tiktok\.com|yelp\.com|google\.com/maps)",
    re.IGNORECASE,
)

# How many categories / regions to sample per run so we spread coverage
_CATEGORIES_PER_RUN = 5
_REGIONS_PER_RUN = 2


def _is_no_website(place: dict) -> bool:
    """Return True when the place has no real website."""
    website = (place.get("website") or "").strip()
    if not website:
        return True
    if _SOCIAL_PATTERNS.search(website):
        return True
    return False


def _extract_email_from_place(place: dict) -> str | None:
    """
    Google Maps does not expose email addresses directly.
    We stash None here and let a future enrichment step fill it in.
    """
    return None


def _place_to_lead(place: dict, category: str) -> dict:
    """Convert a Places API result dict to our internal lead dict."""
    place_id = place.get("place_id", "")
    maps_url = f"https://www.google.com/maps/place/?q=place_id:{place_id}" if place_id else ""

    return {
        "business_name": place.get("name", ""),
        "address": place.get("formatted_address") or place.get("vicinity", ""),
        "phone": place.get("formatted_phone_number") or place.get("international_phone_number"),
        "email": _extract_email_from_place(place),
        "category": category,
        "maps_url": maps_url,
        "has_website": False,
    }


def _search_places(client: googlemaps.Client, query: str) -> list[dict]:
    """
    Execute a text-search query and fetch place details for each result.
    Returns a list of raw place detail dicts.
    """
    results = []
    try:
        response = client.places(query=query)
        raw_places = response.get("results", [])

        # Paginate up to 3 pages (60 results max) but stop early if we have enough
        next_page_token = response.get("next_page_token")
        page = 1
        while next_page_token and page < 3:
            import time
            time.sleep(2)  # Google requires a short delay before using next_page_token
            response = client.places(query=query, page_token=next_page_token)
            raw_places.extend(response.get("results", []))
            next_page_token = response.get("next_page_token")
            page += 1

        for raw in raw_places:
            place_id = raw.get("place_id")
            if not place_id:
                continue
            try:
                detail = client.place(
                    place_id=place_id,
                    fields=[
                        "name",
                        "formatted_address",
                        "formatted_phone_number",
                        "international_phone_number",
                        "website",
                        "place_id",
                        "business_status",
                        "types",
                    ],
                )
                place_data = detail.get("result", {})
                # Skip permanently closed businesses
                if place_data.get("business_status") == "CLOSED_PERMANENTLY":
                    continue
                results.append(place_data)
            except Exception as exc:
                logger.warning("Could not fetch details for place_id=%s: %s", place_id, exc)

    except Exception as exc:
        logger.error("Places text search failed for query=%r: %s", query, exc)

    return results


def discover_leads(
    categories: list[str] | None = None,
    regions: list[str] | None = None,
    max_results: int = 20,
) -> list[dict]:
    """
    Search Google Maps for businesses without websites.

    Args:
        categories: Business categories to search (defaults to a random sample
                    from config.SEARCH_CATEGORIES).
        regions:    Geographic regions to search (defaults to a random sample
                    from config.TARGET_REGIONS).
        max_results: Hard cap on how many leads to return per run.

    Returns:
        List of lead dicts ready to be inserted into the database.
    """
    if categories is None:
        categories = random.sample(SEARCH_CATEGORIES, min(_CATEGORIES_PER_RUN, len(SEARCH_CATEGORIES)))
    if regions is None:
        regions = random.sample(TARGET_REGIONS, min(_REGIONS_PER_RUN, len(TARGET_REGIONS)))

    logger.info(
        "Lead discovery starting | categories=%s | regions=%s",
        categories,
        regions,
    )

    try:
        gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
    except Exception as exc:
        logger.error("Failed to initialise Google Maps client: %s", exc)
        return []

    new_leads: list[dict] = []

    for region in regions:
        for category in categories:
            if len(new_leads) >= max_results:
                break

            query = f"{category} in {region}"
            logger.info("Searching: %r", query)
            raw_places = _search_places(gmaps, query)

            for place in raw_places:
                if len(new_leads) >= max_results:
                    break

                if not _is_no_website(place):
                    continue  # Business already has a real website

                lead = _place_to_lead(place, category)

                # Deduplicate against the database
                if lead_db.lead_exists(lead["business_name"], lead.get("email")):
                    logger.debug("Duplicate — skipping: %s", lead["business_name"])
                    continue

                new_leads.append(lead)
                logger.info(
                    "Discovered: %s | %s | phone=%s",
                    lead["business_name"],
                    lead["address"],
                    lead["phone"],
                )

        if len(new_leads) >= max_results:
            break

    logger.info("Lead discovery complete — %d new leads found", len(new_leads))
    return new_leads
