"""
Economic propagation graph builder.
Takes a news event + sectors and builds a node/edge graph
showing how the event propagates through the economy.
"""

import uuid

# Template propagation chains per sector
# Each chain: list of (label, type, sentiment) tuples
PROPAGATION_CHAINS = {
    "energy": [
        ("Oil Price Surge", "event", "negative"),
        ("Fuel Costs Rise", "economic", "negative"),
        ("Transport Costs Up", "economic", "negative"),
        ("Airline Margins Squeezed", "sector", "negative"),
        ("Energy Stocks Rally", "stock", "positive"),
        ("Consumer Spending Falls", "economic", "negative"),
    ],
    "technology": [
        ("Chip Supply Disruption", "event", "negative"),
        ("Production Slowdown", "economic", "negative"),
        ("Tech Product Delays", "sector", "negative"),
        ("Consumer Electronics Hit", "economic", "negative"),
        ("Defense Tech Benefits", "stock", "positive"),
    ],
    "banking": [
        ("Interest Rate Change", "event", "neutral"),
        ("Borrowing Costs Shift", "economic", "negative"),
        ("Mortgage Rates Move", "sector", "negative"),
        ("Real Estate Cools", "economic", "negative"),
        ("Bank Net Interest Margins Expand", "stock", "positive"),
        ("Consumer Debt Burden Rises", "economic", "negative"),
    ],
    "defense": [
        ("Geopolitical Conflict", "event", "negative"),
        ("Defense Spending Increases", "economic", "positive"),
        ("Weapons Contracts Awarded", "sector", "positive"),
        ("Defense Stocks Rally", "stock", "positive"),
        ("Oil Supply Disrupted", "economic", "negative"),
        ("Energy Prices Spike", "economic", "negative"),
    ],
    "consumer_goods": [
        ("Inflation Surge", "event", "negative"),
        ("Consumer Purchasing Power Falls", "economic", "negative"),
        ("Retail Sales Decline", "sector", "negative"),
        ("Discount Retailers Benefit", "stock", "positive"),
        ("Luxury Brands Hurt", "stock", "negative"),
    ],
    "automotive": [
        ("EV Demand Shift", "event", "positive"),
        ("Battery Demand Spikes", "economic", "positive"),
        ("Lithium Prices Rise", "economic", "negative"),
        ("Legacy Automakers Lose Share", "stock", "negative"),
        ("EV Manufacturers Rally", "stock", "positive"),
    ],
    "real_estate": [
        ("Rate Hike Announced", "event", "negative"),
        ("Mortgage Costs Jump", "economic", "negative"),
        ("Home Affordability Falls", "sector", "negative"),
        ("Housing Market Cools", "economic", "negative"),
        ("Rental Demand Rises", "stock", "positive"),
    ],
    "cryptocurrency": [
        ("Crypto Regulation News", "event", "negative"),
        ("Investor Confidence Shaken", "economic", "negative"),
        ("Bitcoin Selloff", "sector", "negative"),
        ("Altcoins Follow", "stock", "negative"),
        ("Traditional Finance Benefits", "stock", "positive"),
    ],
    "airlines": [
        ("Fuel Price Spike", "event", "negative"),
        ("Operating Costs Surge", "economic", "negative"),
        ("Ticket Prices Rise", "sector", "negative"),
        ("Passenger Demand Falls", "economic", "negative"),
        ("Airline Stocks Tumble", "stock", "negative"),
    ],
    "agriculture": [
        ("Drought / Weather Event", "event", "negative"),
        ("Crop Yields Drop", "economic", "negative"),
        ("Food Commodity Prices Rise", "sector", "negative"),
        ("Food Inflation Increases", "economic", "negative"),
        ("Fertilizer Companies Benefit", "stock", "positive"),
    ],
    "general": [
        ("Market Event Detected", "event", "neutral"),
        ("Investor Sentiment Shifts", "economic", "neutral"),
        ("Volatility Increases", "sector", "negative"),
        ("Defensive Stocks Sought", "stock", "positive"),
        ("Risk Assets Under Pressure", "stock", "negative"),
    ],
}


def build_propagation_graph(
    headline: str,
    sectors: list[str],
    sentiment: str
) -> dict:
    """
    Build a React Flow compatible node/edge graph
    for the economic propagation of a news event.
    """
    nodes = []
    edges = []

    # Add the root news event node
    root_id = "root"
    nodes.append({
        "id": root_id,
        "label": headline[:60] + "..." if len(headline) > 60 else headline,
        "type": "event",
        "sentiment": sentiment,
    })

    # Use the first matched sector (or general fallback)
    primary_sector = sectors[0] if sectors else "general"
    chain = PROPAGATION_CHAINS.get(primary_sector, PROPAGATION_CHAINS["general"])

    prev_id = root_id
    for i, (label, node_type, node_sentiment) in enumerate(chain):
        node_id = f"node_{i}"
        nodes.append({
            "id": node_id,
            "label": label,
            "type": node_type,
            "sentiment": node_sentiment,
        })
        edges.append({
            "id": f"edge_{prev_id}_{node_id}",
            "source": prev_id,
            "target": node_id,
            "label": "leads to",
        })
        prev_id = node_id

    # If multiple sectors, add a secondary branch from root
    if len(sectors) > 1:
        secondary_sector = sectors[1]
        secondary_chain = PROPAGATION_CHAINS.get(
            secondary_sector, PROPAGATION_CHAINS["general"]
        )[:3]  # Only first 3 nodes for secondary branch

        prev_id = root_id
        for i, (label, node_type, node_sentiment) in enumerate(secondary_chain):
            node_id = f"sec_node_{i}"
            nodes.append({
                "id": node_id,
                "label": label,
                "type": node_type,
                "sentiment": node_sentiment,
            })
            edges.append({
                "id": f"edge_{prev_id}_{node_id}",
                "source": prev_id,
                "target": node_id,
                "label": "also impacts",
            })
            prev_id = node_id

    return {"nodes": nodes, "edges": edges}
