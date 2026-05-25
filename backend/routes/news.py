"""
/news endpoint - fetches latest financial news
"""

from fastapi import APIRouter, Query, HTTPException
from services.news_service import get_news

router = APIRouter()


@router.get("/")
async def fetch_news(count: int = Query(default=8, ge=1, le=20)):
    """
    Fetch latest financial/economic news.
    Returns list of articles with title, summary, source, timestamp, url.
    """
    try:
        articles = await get_news(count=count)
        return {"articles": articles, "count": len(articles)}
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
