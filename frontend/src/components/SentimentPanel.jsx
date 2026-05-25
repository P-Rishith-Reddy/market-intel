import React from 'react'
import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts'
import { formatSector, confidencePct } from '../utils/helpers'

const SENTIMENT_CONFIG = {
  positive: {
    color: '#34d399',
    bg: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/30',
    Icon: TrendingUp,
    label: 'POSITIVE',
    fill: '#34d399',
  },
  negative: {
    color: '#f87171',
    bg: 'from-red-500/20 to-red-600/5',
    border: 'border-red-500/30',
    Icon: TrendingDown,
    label: 'NEGATIVE',
    fill: '#f87171',
  },
  neutral: {
    color: '#60a5fa',
    bg: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/30',
    Icon: Minus,
    label: 'NEUTRAL',
    fill: '#60a5fa',
  },
}

function ConfidenceGauge({ confidence, color }) {
  const pct = Math.round(confidence * 100)
  const data = [{ value: pct, fill: color }]

  return (
    <div className="relative w-24 h-24">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="90%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'rgba(255,255,255,0.05)' }}
            dataKey="value"
            cornerRadius={4}
            angleAxisId={0}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-lg font-display font-bold" style={{ color }}>{pct}%</span>
        <span className="text-[9px] text-slate-500 font-mono uppercase">conf.</span>
      </div>
    </div>
  )
}

export default function SentimentPanel({ analysis, isLoading, article }) {
  if (isLoading) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-display font-semibold text-white uppercase tracking-wide">
            Sentiment Analysis
          </h2>
        </div>
        <div className="space-y-3">
          <div className="h-20 shimmer rounded-lg" />
          <div className="h-4 shimmer rounded w-3/4" />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="h-6 w-20 shimmer rounded-full" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-display font-semibold text-white uppercase tracking-wide">
            Sentiment Analysis
          </h2>
        </div>
        <p className="text-sm text-slate-500 text-center py-6">
          Select an article to analyze sentiment
        </p>
      </div>
    )
  }

  const sentiment = analysis.sentiment?.label || 'neutral'
  const confidence = analysis.sentiment?.confidence || 0
  const config = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral
  const { Icon } = config

  return (
    <div className={`glass-card p-5 border ${config.border} animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-brand-400" />
        <h2 className="text-sm font-display font-semibold text-white uppercase tracking-wide">
          Sentiment Analysis
        </h2>
        <span className="ml-auto text-[10px] font-mono text-slate-500">FinBERT</span>
      </div>

      {/* Main sentiment display */}
      <div className={`rounded-lg p-4 bg-gradient-to-br ${config.bg} border ${config.border} mb-4`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-5 h-5" style={{ color: config.color }} />
              <span
                className="text-2xl font-display font-bold tracking-tight"
                style={{ color: config.color }}
              >
                {config.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Financial sentiment classification
            </p>
          </div>
          <ConfidenceGauge confidence={confidence} color={config.color} />
        </div>
      </div>

      {/* Sectors */}
      <div>
        <p className="text-[10px] text-slate-500 font-mono uppercase mb-2 tracking-wider">
          Affected Sectors
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(analysis.sectors || []).map((sector) => (
            <span key={sector} className="sector-pill">
              {formatSector(sector)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
