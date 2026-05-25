"""
/reasoning endpoint - generates AI economic reasoning via Groq
"""

from fastapi import APIRouter, HTTPException
from models.schemas import ReasoningRequest
from services.reasoning_service import generate_reasoning
from utils.stock_mapper import get_stock_suggestions

router = APIRouter()


@router.post("/")
async def get_reasoning(request: ReasoningRequest):
    """
    Generate comprehensive economic reasoning for a news event.
    Uses Groq (llama3) for analyst-style explanations.
    Includes bullish/bearish stock suggestions.
    """
    try:
        # Generate AI reasoning
        reasoning = await generate_reasoning(
            title=request.title,
            summary=request.summary,
            sentiment=request.sentiment,
            sectors=request.sectors,
        )

        # Get rule-based stock suggestions
        stocks = get_stock_suggestions(
            sectors=request.sectors,
            overall_sentiment=request.sentiment,
        )

        return {
            "reasoning": reasoning,
            "stock_suggestions": stocks,
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
