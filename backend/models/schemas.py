"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel
from typing import List, Optional


class NewsArticle(BaseModel):
    id: str
    title: str
    summary: str
    source: str
    timestamp: str
    url: str


class SentimentResult(BaseModel):
    article_id: str
    title: str
    label: str          # positive | negative | neutral
    confidence: float   # 0.0 - 1.0
    sectors: List[str]  # detected affected sectors


class GraphNode(BaseModel):
    id: str
    label: str
    type: str           # event | sector | stock | economic
    sentiment: str      # positive | negative | neutral


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str


class PropagationGraph(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


class StockSuggestion(BaseModel):
    ticker: str
    company: str
    direction: str      # bullish | bearish
    sector: str
    reason: str


class AnalyzeRequest(BaseModel):
    article_id: Optional[str] = None
    title: str
    summary: str


class ReasoningRequest(BaseModel):
    title: str
    summary: str
    sentiment: str
    sectors: List[str]


class ReasoningResponse(BaseModel):
    economic_reasoning: str
    chain_reaction: str
    sector_impact: str
    bullish_sectors: List[str]
    bearish_sectors: List[str]
    affected_stocks: List[str]
