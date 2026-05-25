"""
/analyze endpoint - runs FinBERT sentiment + sector detection on an article
"""

from fastapi import APIRouter, HTTPException
from models.schemas import AnalyzeRequest
from services.sentiment_service import analyze_sentiment_async
from utils.sector_mapper import detect_sectors

router = APIRouter()


@router.post("/")
async def analyze_article(request: AnalyzeRequest):
    """
    Analyze a news article:
    1. Run FinBERT sentiment classification
    2. Detect affected sectors via keyword rules
    Returns sentiment label, confidence, and impacted sectors.
    """
    try:
        # Combine title + summary for richer analysis
        full_text = f"{request.title}. {request.summary}"

        # FinBERT sentiment
        sentiment = await analyze_sentiment_async(full_text)

        # Rule-based sector detection
        sectors = detect_sectors(full_text)

        return {
            "article_id": request.article_id or "unknown",
            "title": request.title,
            "sentiment": sentiment,
            "sectors": sectors,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch")
async def analyze_batch(articles: list[AnalyzeRequest]):
    """Analyze multiple articles at once."""
    import asyncio
    try:
        results = await asyncio.gather(*[
            analyze_article(article) for article in articles
        ])
        return {"results": list(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
