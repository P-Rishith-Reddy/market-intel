import React from 'react'
import { Activity, Zap, BarChart2, RefreshCw } from 'lucide-react'

export default function Header({ onRefresh, isLoading }) {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Frosted glass bar */}
      <div className="bg-surface-900/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            {/* Animated logo mark */}
            <div className="relative flex items-center justify-center w-9 h-9">
              <div className="absolute inset-0 rounded-lg bg-brand-500/20 animate-pulse-slow" />
              <BarChart2 className="w-5 h-5 text-brand-400 relative z-10" />
            </div>
            <div>
              <span className="font-display font-700 text-white text-lg tracking-tight">
                Market<span className="text-brand-400">Pulse</span>
              </span>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest -mt-0.5">
                AI Intelligence
              </div>
            </div>
          </div>

          {/* Center status */}
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-mono">
              LIVE FEED ACTIVE
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-400 font-mono">FINBERT + GROQ</span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 text-sm font-medium hover:bg-brand-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
    </header>
  )
}
