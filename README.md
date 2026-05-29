# 📊 MarketPulse AI — Financial Market Intelligence Platform

> Real-time AI-powered financial news analysis with sentiment detection, sector impact mapping, economic propagation graphs, and bullish/bearish stock signals.

![Stack](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI-blue)
![AI](https://img.shields.io/badge/AI-FinBERT%20%2B%20Groq%20LLaMA--3-orange)
![Status](https://img.shields.io/badge/Status-Demo%20Ready-green)

---

## 🧠 What It Does

1. **Fetches** live financial/economic news (Finnhub → GDELT → Mock fallback)
2. **Analyzes sentiment** using FinBERT (positive/negative/neutral + confidence)
3. **Detects sectors** via rule-based keyword mapping (energy, tech, banking, etc.)
4. **Generates AI reasoning** using Groq (LLaMA-3) — economic chain reactions, analyst-style explanations
5. **Visualizes propagation** as an interactive React Flow graph (zoom, pan, animated edges)
6. **Suggests stocks** that are bullish/bearish based on sector impact rules

---

## 📁 Project Structure

```
market-intel/
├── backend/
│   ├── app.py                  # FastAPI entry point
│   ├── routes/
│   │   ├── news.py             # GET /news/
│   │   ├── analyze.py          # POST /analyze/
│   │   ├── graph.py            # POST /graph/
│   │   └── reasoning.py        # POST /reasoning/
│   ├── services/
│   │   ├── news_service.py     # Finnhub/GDELT/mock fetching
│   │   ├── sentiment_service.py # FinBERT wrapper
│   │   └── reasoning_service.py # Groq API wrapper
│   ├── models/
│   │   └── schemas.py          # Pydantic models
│   ├── utils/
│   │   ├── sector_mapper.py    # Keyword → sector rules
│   │   ├── stock_mapper.py     # Sector → stock rules
│   │   └── graph_builder.py    # Propagation chain templates
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx             # Main dashboard
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── NewsPanel.jsx
    │   │   ├── SentimentPanel.jsx
    │   │   ├── SectorCards.jsx
    │   │   ├── ReasoningPanel.jsx
    │   │   ├── PropagationGraph.jsx
    │   │   └── StocksPanel.jsx
    │   ├── services/
    │   │   └── api.js          # Axios API client
    │   └── utils/
    │       └── helpers.js      # Formatting utilities
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## ⚡ Quick Start

### 1. Clone & Setup

```bash
git clone <your-repo>
cd market-intel
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env and add your API keys

# Run server
uvicorn app:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# VITE_API_URL=http://localhost:8000

# Run dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
# Groq API — FREE at https://console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Finnhub API — FREE at https://finnhub.io (optional)
# If empty, falls back to GDELT, then mock data
FINNHUB_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Frontend (`frontend/.env.local`)

```env
VITE_API_URL=http://localhost:8000
```

---

## 🌐 API Endpoints

### `GET /news/`
Fetch latest financial news articles.
```json
{
  "articles": [
    {
      "id": "abc123",
      "title": "Fed signals rate cuts...",
      "summary": "...",
      "source": "Reuters",
      "timestamp": "2025-05-24T09:00:00Z",
      "url": "https://..."
    }
  ],
  "count": 8
}
```

### `POST /analyze/`
Run FinBERT sentiment + sector detection.
```json
// Request
{ "title": "Oil prices surge...", "summary": "OPEC cuts production..." }

// Response
{
  "sentiment": { "label": "negative", "confidence": 0.82 },
  "sectors": ["energy", "airlines", "consumer_goods"]
}
```

### `POST /graph/`
Build economic propagation graph.
```json
// Response
{
  "nodes": [
    { "id": "root", "label": "Oil Price Surge", "type": "event", "sentiment": "negative" },
    { "id": "node_0", "label": "Fuel Costs Rise", "type": "economic", "sentiment": "negative" }
  ],
  "edges": [
    { "id": "edge_root_node_0", "source": "root", "target": "node_0", "label": "leads to" }
  ]
}
```

### `POST /reasoning/`
Generate Groq AI analysis + stock suggestions.
```json
// Response
{
  "reasoning": {
    "economic_reasoning": "The oil supply reduction...",
    "chain_reaction": "OPEC cuts → Oil prices rise → Fuel costs up → Airlines squeezed → Tickets pricier",
    "sector_impact": "Energy sector benefits while...",
    "bullish_sectors": ["energy", "defense"],
    "bearish_sectors": ["airlines", "consumer_goods"],
    "affected_stocks": ["XOM", "CVX", "DAL", "UAL"]
  },
  "stock_suggestions": [
    { "ticker": "XOM", "company": "ExxonMobil", "direction": "bullish", "sector": "energy" },
    { "ticker": "DAL", "company": "Delta Air Lines", "direction": "bearish", "sector": "airlines" }
  ]
}
```

---

## 🚀 Deployment

### Backend → Render

1. Push backend to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard

### Frontend → Vercel

1. Push frontend to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | TailwindCSS (dark glassmorphism) |
| Graph | React Flow |
| Charts | Recharts |
| HTTP | Axios |
| Backend | FastAPI + Uvicorn |
| Sentiment AI | FinBERT (ProsusAI/finbert) |
| Reasoning AI | Groq API (LLaMA-3 8B) |
| News | Finnhub / GDELT / Mock |
| Models | Pydantic v2 |

---

## 🧩 Architecture Notes

- **FinBERT** is loaded lazily on first request (avoids cold start delay)
- **Groq** is called async with timeout; falls back to mock reasoning if unavailable
- **News** has 3-tier fallback: Finnhub → GDELT → Mock data (always works in demo)
- **Graph** uses pre-built propagation chain templates per sector (no ML needed)
- **Stock suggestions** are entirely rule-based (sector → ticker mappings)
- All **background analysis** runs in parallel (batch sentiment on all articles at load)

---

## ⚠️ Disclaimer

This platform is for **educational and demonstration purposes only**.
It does not provide financial advice and should not be used for trading decisions.
Stock suggestions are rule-based heuristics, not predictions.

---

*Built as an AI-powered market reasoning demo · FinBERT + Groq + React Flow*
