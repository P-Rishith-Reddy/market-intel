/**
 * API Service - all calls to the FastAPI backend
 * Base URL from env or defaults to localhost:8000
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000000000, // 5 minutes (allows time for the 438MB FinBERT model to download on first run)
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

// Response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

/**
 * Fetch latest financial news
 */
export const fetchNews = async (count = 8) => {
  const res = await api.get('/news/', { params: { count } })
  return res.data
}

/**
 * Analyze a single article - sentiment + sectors
 */
export const analyzeArticle = async ({ article_id, title, summary }) => {
  const res = await api.post('/analyze/', { article_id, title, summary })
  return res.data
}

/**
 * Analyze multiple articles in batch
 */
export const analyzeArticlesBatch = async (articles) => {
  const res = await api.post('/analyze/batch', articles)
  return res.data
}

/**
 * Get economic propagation graph for React Flow
 */
export const getGraph = async ({ title, sectors, sentiment }) => {
  const res = await api.post('/graph/', { title, sectors, sentiment })
  return res.data
}

/**
 * Get AI reasoning + stock suggestions
 */
export const getReasoning = async ({ title, summary, sentiment, sectors }) => {
  const res = await api.post('/reasoning/', { title, summary, sentiment, sectors })
  return res.data
}

export default api
