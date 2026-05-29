"""
FinBERT Sentiment Analysis Service.
Uses ProsusAI/finbert from HuggingFace Transformers.
Only handles sentiment classification - nothing else.
"""

import asyncio
from typing import Optional
from transformers import pipeline

# Lazy load the model to avoid slow startup
_pipeline = None


def _load_pipeline():
    """Load FinBERT pipeline once and cache it."""
    global _pipeline
    if _pipeline is None:
        try:
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
            raise Exception(f"Failed to load FinBERT model: {e}")
    return _pipeline


def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment of financial text using FinBERT.
    Returns: {"label": "positive|negative|neutral", "confidence": float}
    """
    # Truncate to 512 tokens (FinBERT limit)
    text = text[:1000]

    pipe = _load_pipeline()

    if pipe is None:
        raise Exception("FinBERT model is not loaded or failed to initialize.")

    try:
        results = pipe(text)
        scores = results[0] if isinstance(results[0], list) else results

        # Find the highest scoring label
        best = max(scores, key=lambda x: x["score"])
        label = best["label"].lower()

        return {
            "label": label,
            "confidence": round(best["score"], 3),
        }
    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        raise Exception(f"FinBERT analysis error: {e}")


async def analyze_sentiment_async(text: str) -> dict:
    """Async wrapper for sentiment analysis (runs in thread pool)."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, analyze_sentiment, text)
