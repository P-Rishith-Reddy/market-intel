"""
Rule-based stock suggestions based on sector and sentiment.
Maps (sector, direction) → list of stock tickers.
Simple, explainable, no ML needed.
"""

# sector → bullish stocks when sector is performing well
BULLISH_STOCKS = {
    "energy": [
        {"ticker": "XOM", "company": "ExxonMobil"},
        {"ticker": "CVX", "company": "Chevron"},
        {"ticker": "COP", "company": "ConocoPhillips"},
        {"ticker": "SLB", "company": "Schlumberger"},
    ],
    "technology": [
        {"ticker": "NVDA", "company": "NVIDIA"},
        {"ticker": "AMD", "company": "Advanced Micro Devices"},
        {"ticker": "MSFT", "company": "Microsoft"},
        {"ticker": "AVGO", "company": "Broadcom"},
    ],
    "banking": [
        {"ticker": "JPM", "company": "JPMorgan Chase"},
        {"ticker": "GS", "company": "Goldman Sachs"},
        {"ticker": "MS", "company": "Morgan Stanley"},
        {"ticker": "BAC", "company": "Bank of America"},
    ],
    "defense": [
        {"ticker": "LMT", "company": "Lockheed Martin"},
        {"ticker": "RTX", "company": "Raytheon Technologies"},
        {"ticker": "NOC", "company": "Northrop Grumman"},
        {"ticker": "BA", "company": "Boeing (Defense)"},
    ],
    "healthcare": [
        {"ticker": "JNJ", "company": "Johnson & Johnson"},
        {"ticker": "PFE", "company": "Pfizer"},
        {"ticker": "UNH", "company": "UnitedHealth Group"},
        {"ticker": "ABBV", "company": "AbbVie"},
    ],
    "consumer_goods": [
        {"ticker": "PG", "company": "Procter & Gamble"},
        {"ticker": "KO", "company": "Coca-Cola"},
        {"ticker": "WMT", "company": "Walmart"},
        {"ticker": "COST", "company": "Costco"},
    ],
    "automotive": [
        {"ticker": "TSLA", "company": "Tesla"},
        {"ticker": "GM", "company": "General Motors"},
        {"ticker": "F", "company": "Ford Motor"},
        {"ticker": "RIVN", "company": "Rivian"},
    ],
    "real_estate": [
        {"ticker": "AMT", "company": "American Tower REIT"},
        {"ticker": "PLD", "company": "Prologis"},
        {"ticker": "EQIX", "company": "Equinix"},
    ],
    "cryptocurrency": [
        {"ticker": "COIN", "company": "Coinbase"},
        {"ticker": "MSTR", "company": "MicroStrategy"},
        {"ticker": "RIOT", "company": "Riot Platforms"},
    ],
    "agriculture": [
        {"ticker": "ADM", "company": "Archer-Daniels-Midland"},
        {"ticker": "MOS", "company": "Mosaic Company"},
        {"ticker": "CF", "company": "CF Industries"},
    ],
}

# sector → bearish stocks (hurt by negative sentiment in that sector)
BEARISH_STOCKS = {
    "energy": [
        {"ticker": "DAL", "company": "Delta Air Lines"},
        {"ticker": "UAL", "company": "United Airlines"},
        {"ticker": "AAL", "company": "American Airlines"},
        {"ticker": "FDX", "company": "FedEx"},
    ],
    "banking": [
        {"ticker": "NYCB", "company": "NY Community Bancorp"},
        {"ticker": "SIVB", "company": "SVB Financial"},
        {"ticker": "FRC", "company": "First Republic Bank"},
    ],
    "technology": [
        {"ticker": "INTC", "company": "Intel"},
        {"ticker": "QCOM", "company": "Qualcomm"},
        {"ticker": "MU", "company": "Micron Technology"},
    ],
    "consumer_goods": [
        {"ticker": "NKE", "company": "Nike"},
        {"ticker": "SBUX", "company": "Starbucks"},
        {"ticker": "MCD", "company": "McDonald's"},
    ],
    "airlines": [
        {"ticker": "DAL", "company": "Delta Air Lines"},
        {"ticker": "UAL", "company": "United Airlines"},
        {"ticker": "LUV", "company": "Southwest Airlines"},
        {"ticker": "JBLU", "company": "JetBlue Airways"},
    ],
    "automotive": [
        {"ticker": "STLA", "company": "Stellantis"},
        {"ticker": "HMC", "company": "Honda Motor"},
        {"ticker": "TM", "company": "Toyota Motor"},
    ],
    "real_estate": [
        {"ticker": "OPEN", "company": "Opendoor Technologies"},
        {"ticker": "Z", "company": "Zillow Group"},
        {"ticker": "RDFN", "company": "Redfin"},
    ],
    "cryptocurrency": [
        {"ticker": "HOOD", "company": "Robinhood Markets"},
        {"ticker": "SQ", "company": "Block (formerly Square)"},
    ],
    "agriculture": [
        {"ticker": "TSN", "company": "Tyson Foods"},
        {"ticker": "CAG", "company": "ConAgra Brands"},
    ],
}


def get_stock_suggestions(sectors: list[str], overall_sentiment: str) -> list[dict]:
    """
    Given detected sectors and overall sentiment,
    return bullish and bearish stock suggestions.
    """
    suggestions = []
    seen_tickers = set()

    for sector in sectors[:3]:  # Limit to top 3 sectors
        # Bullish picks for positive sentiment in sector
        if overall_sentiment in ["positive", "neutral"]:
            for stock in BULLISH_STOCKS.get(sector, [])[:2]:
                if stock["ticker"] not in seen_tickers:
                    suggestions.append({
                        **stock,
                        "direction": "bullish",
                        "sector": sector,
                        "reason": f"Positive momentum in {sector.replace('_', ' ')} sector"
                    })
                    seen_tickers.add(stock["ticker"])

        # Bearish picks for negative sentiment (sector takes a hit)
        if overall_sentiment in ["negative", "neutral"]:
            for stock in BEARISH_STOCKS.get(sector, [])[:2]:
                if stock["ticker"] not in seen_tickers:
                    suggestions.append({
                        **stock,
                        "direction": "bearish",
                        "sector": sector,
                        "reason": f"Downward pressure from {sector.replace('_', ' ')} sector headwinds"
                    })
                    seen_tickers.add(stock["ticker"])

    return suggestions[:8]  # Cap at 8 suggestions
