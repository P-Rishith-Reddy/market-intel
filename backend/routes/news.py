"""
/news endpoint - fetches latest financial news
"""

from fastapi import APIRouter, Query
from services.news_service import get_news

router = APIRouter()


@router.get("/")
async def fetch_news(count: int = Query(default=8, ge=1, le=20)):
    """
    Fetch latest financial/economic news.
    Returns list of articles with title, summary, source, timestamp, url.
    """
    articles = await get_news(count=count)
    return {"articles": articles, "count": len(articles)}
