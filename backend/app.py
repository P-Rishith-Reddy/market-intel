from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import news, analyze, graph, reasoning

app = FastAPI(
    title="Market Intelligence API",
    description="AI-powered financial market intelligence platform",
    version="1.0.0"
)

# Allow frontend (localhost:5173 for Vite dev, and production domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(news.router, prefix="/news", tags=["News"])
app.include_router(analyze.router, prefix="/analyze", tags=["Analysis"])
app.include_router(graph.router, prefix="/graph", tags=["Graph"])
app.include_router(reasoning.router, prefix="/reasoning", tags=["Reasoning"])


@app.get("/")
async def root():
    return {"status": "ok", "message": "Market Intelligence API is running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
