import React, { useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { GitBranch } from 'lucide-react'

// ── Custom node colors by type/sentiment ──────────────────────────────────────
const NODE_STYLES = {
  event: {
    background: 'linear-gradient(135deg, #0a2a5e 0%, #0d3578 100%)',
    border: '1.5px solid rgba(37, 168, 255, 0.8)',
    color: '#93c5fd',
    boxShadow: '0 0 16px rgba(37, 168, 255, 0.3)',
  },
  economic: {
    background: 'linear-gradient(135deg, #1e1a40 0%, #2d1f5e 100%)',
    border: '1.5px solid rgba(139, 92, 246, 0.6)',
    color: '#c4b5fd',
    boxShadow: '0 0 12px rgba(139, 92, 246, 0.2)',
  },
  sector: {
    background: 'linear-gradient(135deg, #1a2e1a 0%, #1f3d1f 100%)',
    border: '1.5px solid rgba(52, 211, 153, 0.5)',
    color: '#6ee7b7',
    boxShadow: '0 0 12px rgba(52, 211, 153, 0.15)',
  },
  stock_positive: {
    background: 'linear-gradient(135deg, #0f2d1a 0%, #133a20 100%)',
    border: '1.5px solid rgba(52, 211, 153, 0.6)',
    color: '#34d399',
    boxShadow: '0 0 14px rgba(52, 211, 153, 0.25)',
  },
  stock_negative: {
    background: 'linear-gradient(135deg, #2d0f0f 0%, #3a1313 100%)',
    border: '1.5px solid rgba(248, 113, 113, 0.6)',
    color: '#f87171',
    boxShadow: '0 0 14px rgba(248, 113, 113, 0.25)',
  },
  stock_neutral: {
    background: 'linear-gradient(135deg, #1a1f2d 0%, #1f263a 100%)',
    border: '1.5px solid rgba(148, 163, 184, 0.4)',
    color: '#94a3b8',
    boxShadow: '0 0 8px rgba(148, 163, 184, 0.1)',
  },
}

// ── Layout: convert linear node list to tree positions ────────────────────────
function layoutNodes(rawNodes) {
  const mainChain = rawNodes.filter((n) => !n.id.startsWith('sec_'))
  const secChain = rawNodes.filter((n) => n.id.startsWith('sec_'))

  const MAIN_X = 300
  const SEC_X = 700
  const ROOT_X = 300
  const Y_STEP = 130
  const START_Y = 60

  const positioned = []

  // Root node centered
  if (mainChain.length > 0) {
    const root = mainChain[0]
    positioned.push({ ...root, x: ROOT_X, y: START_Y })

    // Main chain flows down
    mainChain.slice(1).forEach((node, i) => {
      positioned.push({ ...node, x: MAIN_X - 80, y: START_Y + (i + 1) * Y_STEP })
    })
  }

  // Secondary branch offset to the right
  secChain.forEach((node, i) => {
    positioned.push({ ...node, x: SEC_X, y: START_Y + (i + 1) * Y_STEP })
  })

  return positioned
}

// ── Custom React Flow node renderer ──────────────────────────────────────────
function CustomNode({ data }) {
  const styleKey = data.type === 'stock'
    ? `stock_${data.sentiment || 'neutral'}`
    : data.type

  const style = NODE_STYLES[styleKey] || NODE_STYLES['economic']

  const typeIcon = {
    event: '⚡',
    economic: '📊',
    sector: '🏭',
    stock: data.sentiment === 'positive' ? '📈' : '📉',
  }[data.type] || '○'

  return (
    <div
      style={{
        ...style,
        borderRadius: 10,
        padding: '10px 14px',
        minWidth: 160,
        maxWidth: 220,
        fontSize: 12,
        fontFamily: '"Roboto", sans-serif',
        cursor: 'default',
        transition: 'all 0.2s',
      }}
      className="react-flow__node-custom"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>{typeIcon}</span>
        <span style={{ fontWeight: 500, lineHeight: 1.3, color: style.color }}>
          {data.label}
        </span>
      </div>
    </div>
  )
}

const nodeTypes = { custom: CustomNode }

// ── Main PropagationGraph component ──────────────────────────────────────────
export default function PropagationGraph({ graphData, isLoading }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Build React Flow nodes from backend data
  const rfNodes = useMemo(() => {
    if (!graphData?.nodes) return []
    const positioned = layoutNodes(graphData.nodes)
    return positioned.map((node) => ({
      id: node.id,
      type: 'custom',
      position: { x: node.x, y: node.y },
      data: {
        label: node.label,
        type: node.type,
        sentiment: node.sentiment,
      },
      draggable: true,
    }))
  }, [graphData])

  // Build React Flow edges
  const rfEdges = useMemo(() => {
    if (!graphData?.edges) return []
    return graphData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgba(37, 168, 255, 0.6)',
        width: 16,
        height: 16,
      },
      style: { stroke: 'rgba(37, 168, 255, 0.4)', strokeWidth: 1.5 },
      labelStyle: { fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' },
      labelBgStyle: { fill: 'rgba(5, 10, 18, 0.8)' },
    }))
  }, [graphData])

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-4 h-4 text-brand-400" />
        <h2 className="text-sm font-display font-semibold text-white uppercase tracking-wide">
          Economic Propagation Graph
        </h2>
        <span className="ml-auto text-[10px] font-mono text-slate-500">
          Interactive · Zoom & Pan
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-3">
        {[
          { color: '#60a5fa', label: 'Event' },
          { color: '#c4b5fd', label: 'Economic' },
          { color: '#6ee7b7', label: 'Sector' },
          { color: '#34d399', label: 'Bullish' },
          { color: '#f87171', label: 'Bearish' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
            />
            <span className="text-[10px] text-slate-500 font-mono">{label}</span>
          </div>
        ))}
      </div>

      {/* Graph canvas */}
      <div className="flex-1 min-h-[400px] rounded-lg overflow-hidden border border-white/[0.06]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center shimmer rounded-lg">
            <span className="text-slate-500 text-sm">Building propagation graph...</span>
          </div>
        ) : !graphData || rfNodes.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
            <GitBranch className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm">
              Select a news article to visualize<br />economic propagation effects
            </p>
          </div>
        ) : (
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.3}
            maxZoom={2}
            attributionPosition="bottom-left"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="rgba(255,255,255,0.04)"
            />
            <Controls
              showInteractive={false}
              style={{
                background: 'rgba(10, 22, 40, 0.8)',
                border: '1px solid rgba(37, 168, 255, 0.2)',
                borderRadius: 8,
              }}
            />
            <MiniMap
              nodeColor={(node) => {
                const s = node.data?.sentiment
                if (s === 'positive') return '#34d399'
                if (s === 'negative') return '#f87171'
                return '#60a5fa'
              }}
              style={{
                background: 'rgba(10, 22, 40, 0.9)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8,
              }}
              maskColor="rgba(5, 10, 18, 0.7)"
            />
          </ReactFlow>
        )}
      </div>
    </div>
  )
}
