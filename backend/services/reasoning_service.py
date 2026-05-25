"""
Groq AI Reasoning Service.
Uses Groq API (llama3-8b-8192) to generate economic reasoning.
Only generates human-readable explanations - no prediction models.
"""

import os
import httpx
import json
from typing import Optional

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama3-8b-8192"


def _build_analysis_prompt(title: str, summary: str, sentiment: str, sectors: list[str]) -> str:
    """Build the analyst-style prompt for Groq."""
    sector_list = ", ".join(sectors)

    return f"""You are a senior financial analyst providing concise market intelligence.

NEWS: {title}
SUMMARY: {summary}
SENTIMENT: {sentiment}
AFFECTED SECTORS: {sector_list}

Respond ONLY with a valid JSON object (no markdown, no explanation):
{{
  "economic_reasoning": "2-3 sentence explanation of the economic implications",
  "chain_reaction": "Step-by-step chain of economic effects (3-4 steps, use → between steps)",
  "sector_impact": "1-2 sentence explanation of sector-level impact",
  "bullish_sectors": ["sector1", "sector2"],
  "bearish_sectors": ["sector1", "sector2"],
  "affected_stocks": ["TICKER1", "TICKER2", "TICKER3", "TICKER4"]
}}

Be concise, specific, and analytical. Use real ticker symbols."""


def _mock_reasoning(title: str, sectors: list[str], sentiment: str) -> dict:
    """Fallback mock reasoning when Groq is unavailable."""
    sector_str = sectors[0].replace("_", " ") if sectors else "multiple sectors"

    return {
        "economic_reasoning": f"This development in {sector_str} signals potential structural shifts in market dynamics. The {sentiment} sentiment reflects investor uncertainty about second-order effects on supply chains and pricing power.",
        "chain_reaction": f"News breaks → {sector_str.title()} volatility spikes → Institutional investors rebalance → Retail follows → Broader market repricing occurs",
        "sector_impact": f"The {sector_str} sector faces immediate pressure with downstream effects likely propagating to related industries within 2-4 trading sessions.",
        "bullish_sectors": ["defense", "energy"] if sentiment == "negative" else ["technology", "consumer_goods"],
        "bearish_sectors": sectors[:2] if sentiment == "negative" else ["real_estate", "airlines"],
        "affected_stocks": ["XOM", "CVX", "LMT", "RTX"] if "energy" in sectors else ["NVDA", "MSFT", "AAPL", "META"],
    }


async def generate_reasoning(
    title: str,
    summary: str,
    sentiment: str,
    sectors: list[str]
) -> dict:
    """
    Generate economic reasoning using Groq API.
    Falls back to mock data if API unavailable.
    """
    if not GROQ_API_KEY:
        print("No GROQ_API_KEY found, using mock reasoning.")
        return _mock_reasoning(title, sectors, sentiment)

    prompt = _build_analysis_prompt(title, summary, sentiment, sectors)

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,       # Low temperature for consistent analysis
        "max_tokens": 500,
        "response_format": {"type": "json_object"},
    }

    async with httpx.AsyncClient(timeout=20) as client:
        try:
            resp = await client.post(GROQ_API_URL, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]

            # Parse the JSON response
            result = json.loads(content)

            # Ensure all required fields exist
            return {
                "economic_reasoning": result.get("economic_reasoning", "Analysis unavailable"),
                "chain_reaction": result.get("chain_reaction", "Chain analysis unavailable"),
                "sector_impact": result.get("sector_impact", "Sector analysis unavailable"),
                "bullish_sectors": result.get("bullish_sectors", []),
                "bearish_sectors": result.get("bearish_sectors", []),
                "affected_stocks": result.get("affected_stocks", []),
            }

        except json.JSONDecodeError as e:
            print(f"Groq JSON parse error: {e}")
            return _mock_reasoning(title, sectors, sentiment)
        except httpx.HTTPError as e:
            print(f"Groq API HTTP error: {e}")
            return _mock_reasoning(title, sectors, sentiment)
        except Exception as e:
            print(f"Groq API error: {e}")
            return _mock_reasoning(title, sectors, sentiment)
