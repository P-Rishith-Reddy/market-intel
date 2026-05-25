import React from 'react'
import { Layers } from 'lucide-react'
import { formatSector } from '../utils/helpers'

// Visual config per sector
const SECTOR_ICONS = {
  energy: '⚡',
  technology: '💻',
  banking: '🏦',
  consumer_goods: '🛒',
  real_estate: '🏠',
  defense: '🛡️',
  airlines: '✈️',
  automotive: '🚗',
  healthcare: '⚕️',
  agriculture: '🌾',
  cryptocurrency: '₿',
  retail: '🏪',
  general: '📊',
}

const SECTOR_DESC = {
  energy: 'Oil, gas, utilities, renewable power',
  technology: 'Semiconductors, software, hardware, AI',
  banking: 'Commercial banks, investment banks, lending',
  consumer_goods: 'FMCG, retail products, food & beverage',
  real_estate: 'REITs, housing, commercial property',
  defense: 'Defense contractors, military, aerospace',
  airlines: 'Commercial aviation, cargo, airports',
  automotive: 'EVs, ICE vehicles, auto parts',
  healthcare: 'Pharma, biotech, health insurance',
  agriculture: 'Farming, commodities, fertilizers',
  cryptocurrency: 'Digital assets, blockchain, defi',
  retail: 'E-commerce, brick-and-mortar, specialty',
  general: 'Cross-sector market impact',
}

function SectorCard({ sector, sentiment }) {
  const icon = SECTOR_ICONS[sector] || '📊'
  const desc = SECTOR_DESC[sector] || 'Market sector'

  const borderColor = {
    positive: 'border-emerald-500/30',
    negative: 'border-red-500/30',
    neutral: 'border-blue-500/20',
  }[sentiment] || 'border-white/[0.07]'

  const glowColor = {
    positive: 'shadow-emerald-500/10',
    negative: 'shadow-red-500/10',
    neutral: 'shadow-blue-500/10',
  }[sentiment] || ''

  return (
    <div className={`p-3 rounded-lg bg-white/[0.03] border ${borderColor} shadow-lg ${glowColor} hover:bg-white/[0.06] transition-all duration-200`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-display font-semibold text-slate-200">
          {formatSector(sector)}
        </span>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}

export default function SectorCards({ analysis, isLoading }) {
  const sectors = analysis?.sectors || []
  const sentiment = analysis?.sentiment?.label || 'neutral'

  if (isLoading) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-display font-semibold text-white uppercase tracking-wide">
            Sector Impact
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-16 shimmer rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-brand-400" />
        <h2 className="text-sm font-display font-semibold text-white uppercase tracking-wide">
          Sector Impact Detection
        </h2>
        <span className="ml-auto text-[10px] font-mono text-slate-500">Rule-Based NLP</span>
      </div>

      {sectors.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">
          Select an article to detect affected sectors
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {sectors.map((sector) => (
            <SectorCard key={sector} sector={sector} sentiment={sentiment} />
          ))}
        </div>
      )}
    </div>
  )
}
