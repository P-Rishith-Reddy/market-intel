"""
Rule-based sector detection from news text.
Maps keywords → affected sectors.
Simple, explainable, easy to extend.
"""

# Keyword → sector mapping
# Add more rules as needed
SECTOR_KEYWORD_MAP = {
    "energy": [
        "oil", "crude", "petroleum", "natural gas", "opec", "pipeline",
        "lng", "fossil fuel", "gasoline", "diesel", "refinery", "brent", "wti"
    ],
    "technology": [
        "semiconductor", "chip", "ai", "artificial intelligence", "cloud",
        "software", "hardware", "nvidia", "intel", "tsmc", "data center",
        "cybersecurity", "tech", "silicon", "microchip", "quantum"
    ],
    "banking": [
        "interest rate", "federal reserve", "fed", "inflation", "monetary policy",
        "bank", "lending", "credit", "mortgage", "yield", "bond", "treasury",
        "rate hike", "rate cut", "quantitative easing", "financial sector"
    ],
    "consumer_goods": [
        "inflation", "consumer price", "cpi", "retail", "spending", "walmart",
        "amazon", "supply chain", "commodity", "food prices", "wages"
    ],
    "real_estate": [
        "housing", "mortgage", "property", "real estate", "interest rate",
        "construction", "home prices", "reit", "rent", "commercial real estate"
    ],
    "defense": [
        "war", "conflict", "military", "defense", "weapons", "geopolitical",
        "nato", "ukraine", "russia", "china", "taiwan", "arms", "missile"
    ],
    "airlines": [
        "airline", "aviation", "airport", "flight", "travel", "fuel cost",
        "delta", "united airlines", "american airlines", "southwest", "boeing"
    ],
    "automotive": [
        "electric vehicle", "ev", "tesla", "auto", "car", "truck",
        "gm", "ford", "battery", "lithium", "charging station"
    ],
    "healthcare": [
        "pharma", "drug", "fda", "vaccine", "biotech", "healthcare",
        "hospital", "medicare", "medicaid", "clinical trial", "pfizer"
    ],
    "agriculture": [
        "wheat", "corn", "soybean", "grain", "crop", "drought",
        "fertilizer", "farming", "food supply", "agriculture"
    ],
    "cryptocurrency": [
        "bitcoin", "crypto", "ethereum", "blockchain", "defi", "nft",
        "coinbase", "binance", "digital currency", "stablecoin"
    ],
    "retail": [
        "retail sales", "consumer spending", "e-commerce", "black friday",
        "shopping", "mall", "department store", "target", "walmart"
    ],
}


def detect_sectors(text: str) -> list[str]:
    """
    Given a news title + summary string, return list of affected sectors.
    Uses simple keyword matching - no ML required.
    """
    text_lower = text.lower()
    detected = set()

    for sector, keywords in SECTOR_KEYWORD_MAP.items():
        for keyword in keywords:
            if keyword in text_lower:
                detected.add(sector)
                break  # No need to check more keywords for this sector

    return list(detected) if detected else ["general"]


def get_sector_display_name(sector: str) -> str:
    """Convert snake_case sector to display name."""
    return sector.replace("_", " ").title()
