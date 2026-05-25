"""
News fetching service.
Primary: Finnhub API
Fallback: GDELT API (free, no key needed)
Last resort: Mock data for demo purposes
"""

import os
import httpx
import uuid
from datetime import datetime, timezone
from typing import Optional


FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "")
FINNHUB_BASE_URL = "https://finnhub.io/api/v1"
GDELT_URL = "https://api.gdeltproject.org/api/v2/doc/doc"


async def fetch_news_finnhub(category: str = "general", count: int = 10) -> list[dict]:
    """Fetch news from Finnhub API."""
    if not FINNHUB_API_KEY:
        return []

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(
                f"{FINNHUB_BASE_URL}/news",
                params={"category": category, "token": FINNHUB_API_KEY}
            )
            resp.raise_for_status()
            articles = resp.json()[:count]

            return [
                {
                    "id": str(article.get("id", uuid.uuid4())),
                    "title": article.get("headline", "No title"),
                    "summary": article.get("summary", "")[:400],
                    "source": article.get("source", "Finnhub"),
                    "timestamp": datetime.fromtimestamp(
                        article.get("datetime", 0), tz=timezone.utc
                    ).isoformat(),
                    "url": article.get("url", "#"),
                }
                for article in articles
                if article.get("headline")
            ]
        except Exception as e:
            print(f"Finnhub fetch error: {e}")
            return []


async def fetch_news_gdelt(query: str = "economy finance market", count: int = 10) -> list[dict]:
    """Fetch news from GDELT (free, no API key needed)."""
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            params = {
                "query": query,
                "mode": "artlist",
                "maxrecords": count,
                "format": "json",
                "timespan": "24h",
                "sort": "DateDesc",
            }
            resp = await client.get(GDELT_URL, params=params)
            resp.raise_for_status()
            data = resp.json()
            articles = data.get("articles", [])

            return [
                {
                    "id": str(uuid.uuid4()),
                    "title": a.get("title", "No title"),
                    "summary": a.get("seendate", "") + " — " + a.get("domain", ""),
                    "source": a.get("domain", "GDELT"),
                    "timestamp": a.get("seendate", datetime.now(timezone.utc).isoformat()),
                    "url": a.get("url", "#"),
                }
                for a in articles
                if a.get("title")
            ]
        except Exception as e:
            print(f"GDELT fetch error: {e}")
            return []


def get_mock_news() -> list[dict]:
    """
    Fallback mock news for demo/development.
    Realistic financial news articles.
    """
    return [
        {
            "id": "mock_001",
            "title": "Federal Reserve Signals Three Rate Cuts in 2025 Amid Cooling Inflation",
            "summary": "Fed Chair Powell indicated the central bank is prepared to cut interest rates three times in 2025 as inflation shows sustained progress toward the 2% target. Markets rallied on the news with the S&P 500 gaining 1.2%.",
            "source": "Reuters",
            "timestamp": "2025-05-24T09:30:00Z",
            "url": "https://example.com/fed-rate-cuts",
        },
        {
            "id": "mock_002",
            "title": "OPEC+ Agrees to Extend Production Cuts Through Q3 2025",
            "summary": "OPEC+ members reached agreement to maintain current production cuts of 2.2 million barrels per day through September 2025. Brent crude jumped 3.4% to $87 per barrel following the announcement.",
            "source": "Bloomberg",
            "timestamp": "2025-05-24T08:15:00Z",
            "url": "https://example.com/opec-cuts",
        },
        {
            "id": "mock_003",
            "title": "NVIDIA Reports Record Q1 Earnings, Data Center Revenue Surges 427%",
            "summary": "NVIDIA posted record quarterly revenue of $26B, beating estimates by 10%. Data center segment driven by AI chip demand saw revenues surge 427% YoY. The company raised full-year guidance citing insatiable AI infrastructure demand.",
            "source": "CNBC",
            "timestamp": "2025-05-24T07:00:00Z",
            "url": "https://example.com/nvidia-earnings",
        },
        {
            "id": "mock_004",
            "title": "China Manufacturing PMI Contracts for Second Consecutive Month",
            "summary": "China's official manufacturing PMI fell to 49.2 in May, contracting for the second month. Export orders weakened significantly amid ongoing trade tensions with the US. Global supply chain concerns intensified.",
            "source": "Financial Times",
            "timestamp": "2025-05-24T06:00:00Z",
            "url": "https://example.com/china-pmi",
        },
        {
            "id": "mock_005",
            "title": "Ukraine Conflict Escalation Disrupts Grain Exports, Food Prices Spike",
            "summary": "Renewed fighting near Odessa port has disrupted Black Sea grain shipments. Wheat futures surged 8% to multi-month highs. UN Food Agency warns of potential food security crisis in 40 developing nations.",
            "source": "BBC",
            "timestamp": "2025-05-24T05:30:00Z",
            "url": "https://example.com/ukraine-grain",
        },
        {
            "id": "mock_006",
            "title": "Apple Announces $110B Share Buyback as Services Revenue Hits All-Time High",
            "summary": "Apple reported quarterly earnings of $1.53 per share, beating expectations. Services revenue reached $23.8B driven by App Store and iCloud. The company announced its largest-ever share buyback program.",
            "source": "Wall Street Journal",
            "timestamp": "2025-05-23T22:00:00Z",
            "url": "https://example.com/apple-buyback",
        },
        {
            "id": "mock_007",
            "title": "US Inflation Data Shows CPI Rose 0.3% in April, Core Remains Sticky",
            "summary": "Consumer Price Index rose 0.3% month-over-month and 3.4% year-over-year. Core CPI excluding food and energy increased 0.4%. Shelter costs remain the primary driver of inflation persistence.",
            "source": "MarketWatch",
            "timestamp": "2025-05-23T18:00:00Z",
            "url": "https://example.com/cpi-data",
        },
        {
            "id": "mock_008",
            "title": "Tesla Cuts EV Prices Again as Competition from Chinese Rivals Intensifies",
            "summary": "Tesla reduced Model 3 and Model Y prices by up to 4% in North America and Europe. The move comes as BYD and other Chinese EV makers gain market share globally. Gross margin concerns weigh on TSLA stock.",
            "source": "Reuters",
            "timestamp": "2025-05-23T16:00:00Z",
            "url": "https://example.com/tesla-price-cut",
        },
    ]


async def get_news(count: int = 8) -> list[dict]:
    """
    Main news fetching function.
    Tries Finnhub → GDELT → Mock data fallback.
    """
    # Try Finnhub first (best quality)
    articles = await fetch_news_finnhub(count=count)
    if articles:
        return articles[:count]

    # Try GDELT (free fallback)
    articles = await fetch_news_gdelt(count=count)
    if articles:
        return articles[:count]

    # Return mock data for demo
    return get_mock_news()[:count]
