import React, { useState } from 'react'
import { Cpu, ChevronDown, ChevronUp, Zap, ArrowRight } from 'lucide-react'
import { formatSector } from '../utils/helpers'

function ChainStep({ step, index }) {
  // Parse "→" separated steps
  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mt-0.5">
        <span className="text-[9px] text-brand-400 font-mono font-bold">{index + 1}</span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">{step.trim()}</p>
    </div>
  )
}

export default function ReasoningPanel({ reasoning, isLoading }) {
  const [expanded, setExpanded] = useState(true)

  if (isLoading) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-display font-semibold text-white uppercase tracking-wide">
            AI Reasoning Engine
          </h2>
          <span className="ml-auto text-[10px] font-mono text-amber-400 animate-pulse">
            ⚡ Groq processing...
          </span>
        </div>
        <div className="space-y-3">
          {[80, 60, 90, 50, 70].map((w, i) => (
            <div key={i} className={`h-3 shimmer rounded`} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!reasoning) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-display font-semibold text-white uppercase tracking-wide">
            AI Reasoning Engine
          </h2>
          <span className="ml-auto text-[10px] font-mono text-slate-500">Groq / LLaMA-3</span>
        </div>
        <p className="text-sm text-slate-500 text-center py-6">
          Select an article to generate AI analysis
        </p>
      </div>
    )
  }

  const r = reasoning.reasoning || {}
  const chainSteps = (r.chain_reaction || '').split('→').filter(Boolean)

  return (
    <div className="glass-card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-4 h-4 text-brand-400" />
        <h2 className="text-sm font-display font-semibold text-white uppercase tracking-wide">
          AI Reasoning Engine
        </h2>
        <div className="ml-auto flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] font-mono text-amber-400">Groq LLaMA-3</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Economic Reasoning */}
        <div className="p-3 rounded-lg bg-brand-500/5 border border-brand-500/15">
          <p className="text-[10px] text-brand-400 font-mono uppercase tracking-wider mb-1.5">
            Economic Reasoning
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">{r.economic_reasoning}</p>
        </div>

        {/* Chain Reaction */}
        {chainSteps.length > 0 && (
          <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/15">
            <p className="text-[10px] text-purple-400 font-mono uppercase tracking-wider mb-2.5">
              Chain Reaction
            </p>
            <div className="space-y-2">
              {chainSteps.map((step, i) => (
                <React.Fragment key={i}>
                  <ChainStep step={step} index={i} />
                  {i < chainSteps.length - 1 && (
                    <div className="flex items-center pl-6">
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Sector Impact */}
        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
          <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider mb-1.5">
            Sector Impact
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">{r.sector_impact}</p>
        </div>

        {/* Bullish / Bearish sectors */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-[10px] text-emerald-400 font-mono uppercase mb-1.5">↑ Bullish</p>
            <div className="flex flex-wrap gap-1">
              {(r.bullish_sectors || []).map((s) => (
                <span key={s} className="text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                  {formatSector(s)}
                </span>
              ))}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/20">
            <p className="text-[10px] text-red-400 font-mono uppercase mb-1.5">↓ Bearish</p>
            <div className="flex flex-wrap gap-1">
              {(r.bearish_sectors || []).map((s) => (
                <span key={s} className="text-[10px] text-red-300 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full font-mono">
                  {formatSector(s)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
