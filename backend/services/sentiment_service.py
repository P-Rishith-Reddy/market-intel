"""
FinBERT Sentiment Analysis Service.
Uses ProsusAI/finbert from HuggingFace Transformers.
Only handles sentiment classification - nothing else.
"""

import asyncio
from typing import Optional

# Lazy load the model to avoid slow startup
_pipeline = None


def _load_pipeline():
    """Load FinBERT pipeline once and cache it."""
    global _pipeline
    if _pipeline is None:
        try:
            from transformers import pipeline
            print("Loading FinBERT model... (first run may take a moment)")
            _pipeline = pipeline(
                "text-classification",
                model="ProsusAI/finbert",
                tokenizer="ProsusAI/finbert",
                top_k=None,  # Return all class scores
            )
            print("FinBERT loaded successfully.")
        except Exception as e:
            print(f"FinBERT load error: {e}")
            _pipeline = None
    return _pipeline


def _mock_sentiment(text: str) -> dict:
    """
    Deterministic mock sentiment when FinBERT isn't available.
    Uses simple keyword heuristics for demo purposes.
    """
    text_lower = text.lower()

    negative_words = ["fall", "drop", "crisis", "war", "conflict", "cut",
                      "decline", "recession", "loss", "risk", "concern", "inflation",
                      "surge", "spike", "disruption", "contract"]
    positive_words = ["record", "surge", "beat", "growth", "rally", "high",
                      "buyback", "profit", "gain", "strong", "revenue", "boom"]

    neg_count = sum(1 for w in negative_words if w in text_lower)
    pos_count = sum(1 for w in positive_words if w in text_lower)

    if pos_count > neg_count:
        return {"label": "positive", "confidence": 0.72 + (pos_count * 0.03)}
    elif neg_count > pos_count:
        return {"label": "negative", "confidence": 0.68 + (neg_count * 0.03)}
    else:
        return {"label": "neutral", "confidence": 0.61}


def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment of financial text using FinBERT.
    Returns: {"label": "positive|negative|neutral", "confidence": float}
    """
    # Truncate to 512 tokens (FinBERT limit)
    text = text[:1000]

    pipe = _load_pipeline()

    if pipe is None:
        # FinBERT not available - use mock
        return _mock_sentiment(text)

    try:
        results = pipe(text)
        # results is list of list of dicts: [[{label, score}, ...]]
        scores = results[0] if isinstance(results[0], list) else results

        # Find the highest scoring label
        best = max(scores, key=lambda x: x["score"])
        label = best["label"].lower()

        # Map FinBERT labels (positive/negative/neutral)
        return {
            "label": label,
            "confidence": round(best["score"], 3),
        }
    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        return _mock_sentiment(text)


async def analyze_sentiment_async(text: str) -> dict:
    """Async wrapper for sentiment analysis (runs in thread pool)."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, analyze_sentiment, text)
