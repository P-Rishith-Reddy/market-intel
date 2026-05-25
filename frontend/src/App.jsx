import React, { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import NewsPanel from './components/NewsPanel'
import SentimentPanel from './components/SentimentPanel'
import SectorCards from './components/SectorCards'
import ReasoningPanel from './components/ReasoningPanel'
import PropagationGraph from './components/PropagationGraph'
import StocksPanel from './components/StocksPanel'
import { fetchNews, analyzeArticle, getGraph, getReasoning } from './services/api'

export default function App() {
  // ── State ───────────────────────────────────────────────────────────────────
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)

  // Per-article cached analyses (keyed by article.id)
  const [analyses, setAnalyses] = useState({})

  // Current selected article's full data
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [currentReasoning, setCurrentReasoning] = useState(null)
  const [currentGraph, setCurrentGraph] = useState(null)

  // Loading states
  const [isLoadingNews, setIsLoadingNews] = useState(false)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  const [isLoadingGraph, setIsLoadingGraph] = useState(false)
  const [isLoadingReasoning, setIsLoadingReasoning] = useState(false)

  const [error, setError] = useState(null)

  // ── Load news on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    setIsLoadingNews(true)
    setError(null)
    try {
      const data = await fetchNews(8)
      setArticles(data.articles || [])
      // Auto-analyze all articles in background for badge display
      if (data.articles?.length > 0) {
        backgroundAnalyzeAll(data.articles)
      }
    } catch (err) {
      setError('Failed to fetch news. Check if backend is running.')
      console.error(err)
    } finally {
      setIsLoadingNews(false)
    }
  }

  // Run lightweight analysis on all articles for the news list badges
  const backgroundAnalyzeAll = async (articleList) => {
    const batch = articleList.map(async (article) => {
      try {
        const result = await analyzeArticle({
          article_id: article.id,
          title: article.title,
          summary: article.summary,
        })
        setAnalyses((prev) => ({ ...prev, [article.id]: result }))
      } catch (e) {
        // Silent fail for background analysis
      }
    })
    await Promise.allSettled(batch)
  }

  // ── Handle article selection ────────────────────────────────────────────────
  const handleArticleSelect = useCallback(async (article) => {
    setSelectedArticle(article)

    // If already analyzed, reuse cached data
    const cached = analyses[article.id]
    if (cached) {
      setCurrentAnalysis(cached)
      // Still fetch reasoning + graph (they're article-specific heavy operations)
      await fetchGraphAndReasoning(article, cached)
      return
    }

    // Full analysis flow
    setIsLoadingAnalysis(true)
    setCurrentAnalysis(null)
    setCurrentReasoning(null)
    setCurrentGraph(null)

    try {
      // 1. Sentiment + Sectors
      const analysis = await analyzeArticle({
        article_id: article.id,
        title: article.title,
        summary: article.summary,
      })
      setCurrentAnalysis(analysis)
      setAnalyses((prev) => ({ ...prev, [article.id]: analysis }))
      setIsLoadingAnalysis(false)

      // 2. Graph + Reasoning in parallel
      await fetchGraphAndReasoning(article, analysis)
    } catch (err) {
      setError('Analysis failed. Check backend connection.')
      setIsLoadingAnalysis(false)
    }
  }, [analyses])

  const fetchGraphAndReasoning = async (article, analysis) => {
    const sectors = analysis?.sectors || ['general']
    const sentiment = analysis?.sentiment?.label || 'neutral'

    setIsLoadingGraph(true)
    setIsLoadingReasoning(true)

    // Fetch both in parallel
    await Promise.allSettled([
      getGraph({ title: article.title, sectors, sentiment })
        .then((g) => setCurrentGraph(g))
        .catch(console.error)
        .finally(() => setIsLoadingGraph(false)),

      getReasoning({ title: article.title, summary: article.summary, sentiment, sectors })
        .then((r) => setCurrentReasoning(r))
        .catch(console.error)
        .finally(() => setIsLoadingReasoning(false)),
    ])
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-900">
      {/* Ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-700/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full bg-purple-700/8 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-brand-600/8 blur-3xl" />
      </div>

      {/* Header */}
      <Header onRefresh={loadNews} isLoading={isLoadingNews} />

      {/* Main content */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-6">

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Row 1: News Feed + Sentiment + Stocks ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-4 mb-4">
          {/* News Feed */}
          <div className="lg:row-span-2 min-h-[500px] lg:max-h-[700px]">
            <NewsPanel
              articles={articles}
              selectedArticle={selectedArticle}
              onSelect={handleArticleSelect}
              analyses={analyses}
              isLoading={isLoadingNews}
            />
          </div>

          {/* Sentiment */}
          <SentimentPanel
            analysis={currentAnalysis}
            isLoading={isLoadingAnalysis}
            article={selectedArticle}
          />

          {/* Stocks */}
          <div className="lg:row-span-2">
            <StocksPanel
              reasoning={currentReasoning}
              isLoading={isLoadingReasoning}
            />
          </div>

          {/* AI Reasoning */}
          <ReasoningPanel
            reasoning={currentReasoning}
            isLoading={isLoadingReasoning}
          />
        </div>

        {/* ── Row 2: Sector Impact ── */}
        <div className="mb-4">
          <SectorCards
            analysis={currentAnalysis}
            isLoading={isLoadingAnalysis}
          />
        </div>

        {/* ── Row 3: Propagation Graph (full width) ── */}
        <div className="h-[560px]">
          <PropagationGraph
            graphData={currentGraph}
            isLoading={isLoadingGraph}
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-[11px] text-slate-600 font-mono">
          MarketPulse AI · FinBERT Sentiment · Groq LLaMA-3 Reasoning · React Flow Visualization
          <span className="mx-2">·</span>
          Not financial advice
        </footer>
      </main>
    </div>
  )
}
