"""
/graph endpoint - builds economic propagation graph for React Flow
"""

from fastapi import APIRouter
from pydantic import BaseModel
from utils.graph_builder import build_propagation_graph

router = APIRouter()


class GraphRequest(BaseModel):
    title: str
    sectors: list[str]
    sentiment: str = "neutral"


@router.post("/")
async def get_propagation_graph(request: GraphRequest):
    """
    Build an economic propagation graph.
    Returns nodes and edges compatible with React Flow.
    """
    graph = build_propagation_graph(
        headline=request.title,
        sectors=request.sectors,
        sentiment=request.sentiment,
    )
    return graph
