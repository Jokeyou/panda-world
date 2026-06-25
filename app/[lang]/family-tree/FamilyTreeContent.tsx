'use client'

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import pandas from '@/data/pandas.json'
import families from '@/data/families.json'
import { ZoomIn, ZoomOut, Move, Search, X } from 'lucide-react'

interface TreeNode {
  id: string
  name: string
  nameEn: string
  x: number
  y: number
  familyId: string
  parentIds: string[]
  imageUrl?: string
  isRoot: boolean
}

// Build tree nodes from family data
function buildTree(): TreeNode[] {
  const nodes: TreeNode[] = []

  families.forEach((family, fi) => {
    const familyPandas = pandas.filter(p => p.familyId === family.id)
    const col = fi % 3
    const row = Math.floor(fi / 3)
    const baseX = 150 + col * 450
    const baseY = 120 + row * 340

    // Root panda
    const root = familyPandas.find(p => p.name === family.rootPanda)
    if (root) {
      nodes.push({
        id: root.id,
        name: root.name,
        nameEn: root.nameEn,
        x: baseX,
        y: baseY,
        familyId: family.id,
        parentIds: [],
        imageUrl: root.imageUrl,
        isRoot: true,
      })
    }

    // Child pandas arranged around root
    const children = familyPandas.filter(p => p.name !== family.rootPanda)
    children.forEach((p, i) => {
      const totalChildren = children.length
      // Arrange in a semi-circle below the root
      const startAngle = -Math.PI * 0.6
      const endAngle = Math.PI * 0.6
      const angle = totalChildren > 1
        ? startAngle + (i / (totalChildren - 1)) * (endAngle - startAngle)
        : 0
      const radius = 160
      nodes.push({
        id: p.id,
        name: p.name,
        nameEn: p.nameEn,
        x: baseX + Math.sin(angle) * radius,
        y: baseY + Math.cos(angle) * radius + 40,
        familyId: family.id,
        parentIds: [root?.id ?? ''],
        imageUrl: p.imageUrl,
        isRoot: false,
      })
    })
  })

  return nodes
}

// Mini panda face SVG component for tree nodes
function MiniPandaFace({ color = '#4A7C32' }: { color?: string }) {
  return (
    <g>
      {/* Ears */}
      <circle cx={16} cy={10} r={10} fill="#1a1a1a" />
      <circle cx={64} cy={10} r={10} fill="#1a1a1a" />
      <circle cx={16} cy={10} r={5} fill="#3a3a3a" opacity={0.4} />
      <circle cx={64} cy={10} r={5} fill="#3a3a3a" opacity={0.4} />

      {/* Face */}
      <ellipse cx={40} cy={35} rx={28} ry={24} fill="white" stroke="#e5e5e5" strokeWidth={1} />

      {/* Eye patches */}
      <ellipse cx={30} cy={30} rx={12} ry={10} fill="#1a1a1a" transform="rotate(-8, 30, 30)" />
      <ellipse cx={50} cy={30} rx={12} ry={10} fill="#1a1a1a" transform="rotate(8, 50, 30)" />

      {/* Eyes (white) */}
      <circle cx={31} cy={29} r={4} fill="white" opacity={0.95} />
      <circle cx={49} cy={29} r={4} fill="white" opacity={0.95} />

      {/* Pupils */}
      <circle cx={32} cy={29} r={2.2} fill="#1a1a1a" />
      <circle cx={50} cy={29} r={2.2} fill="#1a1a1a" />

      {/* Eye highlights */}
      <circle cx={33} cy={27.5} r={0.8} fill="white" />
      <circle cx={51} cy={27.5} r={0.8} fill="white" />

      {/* Nose */}
      <ellipse cx={40} cy={38} rx={4} ry={2.8} fill="#1a1a1a" />

      {/* Mouth */}
      <path d="M36,42 Q40,47 44,42" fill="none" stroke="#1a1a1a" strokeWidth={1.2} strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx={22} cy={38} rx={6} ry={3.5} fill="#FFB5B5" opacity={0.3} />
      <ellipse cx={58} cy={38} rx={6} ry={3.5} fill="#FFB5B5" opacity={0.3} />
    </g>
  )
}

export default function FamilyTreeContent() {
  // ━━ State ━━
  const [scale, setScale] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [highlightSearch, setHighlightSearch] = useState(false)

  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const searchInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const nodes = useMemo(() => buildTree(), [])
  const colors: Record<string, string> = {}
  families.forEach(f => { colors[f.id] = f.color })

  // ━━ Search matching ━━
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>()
    const q = searchQuery.toLowerCase()
    return new Set(
      nodes.filter(n =>
        n.name.includes(q) || n.nameEn.toLowerCase().includes(q)
      ).map(n => n.id)
    )
  }, [searchQuery, nodes])

  // ━━ Path highlighting (root → selected node) ━━
  const highlightedPath = useMemo(() => {
    if (!selectedNode) return { nodes: new Set<string>(), edges: new Set<string>() }
    const nodeSet = new Set<string>()
    const edgeSet = new Set<string>()
    const visited = new Set<string>()

    function traceUp(id: string) {
      if (visited.has(id)) return
      visited.add(id)
      nodeSet.add(id)
      const node = nodes.find(n => n.id === id)
      if (node) {
        for (const parentId of node.parentIds) {
          edgeSet.add(`${parentId}→${id}`)
          traceUp(parentId)
        }
      }
    }

    traceUp(selectedNode.id)
    return { nodes: nodeSet, edges: edgeSet }
  }, [selectedNode, nodes])

  // ━━ Zoom with mouse wheel ━━
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const isPinch = e.ctrlKey || e.metaKey
    if (isPinch) {
      e.preventDefault()
    }

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const delta = e.deltaY > 0 ? -0.08 : 0.08
    const newScale = Math.min(Math.max(scale + delta, 0.3), 3)
    const scaleRatio = newScale / scale

    // Zoom toward cursor position
    const newPanX = mouseX - (mouseX - panX) * scaleRatio
    const newPanY = mouseY - (mouseY - panY) * scaleRatio

    setScale(newScale)
    setPanX(newPanX)
    setPanY(newPanY)
  }, [scale, panX])

  // ━━ Pan with mouse drag ━━
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('input')) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, panX, panY }
  }, [panX, panY])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPanX(dragStart.current.panX + dx)
    setPanY(dragStart.current.panY + dy)
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Global mouse up to catch drag end outside canvas
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  // ━━ Button zoom ━━
  const zoomIn = () => setScale(s => Math.min(s + 0.2, 3))
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.3))
  const resetView = () => { setScale(1); setPanX(0); setPanY(0) }

  // ━━ Filtered nodes ━━
  const filteredNodes = useMemo(() =>
    selectedFamily ? nodes.filter(n => n.familyId === selectedFamily) : nodes,
    [selectedFamily, nodes]
  )

  // ━━ Handle node click ━━
  const handleNodeClick = useCallback((node: TreeNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }, [])

  // Handle search submission
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('')
      searchInputRef.current?.blur()
    }
  }

  const isSearchActive = searchQuery.trim().length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ━━ Header ━━ */}
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-panda-900 dark:text-panda-100">
          🌳 熊猫家族树
        </h1>
        <p className="mt-3 text-lg text-panda-500 dark:text-panda-300 max-w-2xl">
          全球首个熊猫家族谱系交互图。滚轮缩放，拖拽平移，点击节点查看详情。
        </p>
      </div>

      {/* ━━ Search + Family filter row ━━ */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search box */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-panda-400 dark:text-panda-400 pointer-events-none"
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="搜索熊猫名字…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setHighlightSearch(true)}
            onBlur={() => setHighlightSearch(false)}
            className="w-full pl-10 pr-10 py-2 rounded-xl border-2 border-panda-100 bg-white
                       text-sm text-panda-900 placeholder-panda-400
                       focus:border-bamboo-400 focus:outline-none focus:ring-2 focus:ring-bamboo-200
                       transition-all duration-200
                       dark:border-panda-700 dark:bg-panda-900 dark:text-panda-100 dark:placeholder-panda-500"
          />
          {isSearchActive && (
            <button
              onClick={() => { setSearchQuery(''); searchInputRef.current?.focus() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full
                         hover:bg-panda-100 dark:hover:bg-panda-800 transition-colors"
            >
              <X size={16} className="text-panda-400 dark:text-panda-400" />
            </button>
          )}
          {/* Search results count */}
          {isSearchActive && (
            <span className="absolute -bottom-5 left-3 text-xs text-panda-400 dark:text-panda-400">
              找到 {searchMatches.size} 只熊猫
            </span>
          )}
        </div>

        {/* Family filter buttons */}
        <div className="flex flex-wrap gap-2 items-start">
          <button
            onClick={() => setSelectedFamily(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !selectedFamily
                ? 'bg-panda-900 text-white shadow-md'
                : 'bg-panda-100 text-panda-600 hover:bg-panda-200 dark:bg-panda-800 dark:text-panda-300 dark:hover:bg-panda-700'
            }`}
          >
            全部家族
          </button>
          {families.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFamily(f.id === selectedFamily ? null : f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                f.id === selectedFamily
                  ? 'border-current'
                  : 'border-transparent bg-panda-50 text-panda-500 dark:bg-panda-800 dark:text-panda-400'
              }`}
              style={f.id === selectedFamily ? {
                borderColor: f.color,
                backgroundColor: f.color + '18',
                color: f.color,
              } : {}}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* ━━ Canvas ━━ */}
      <div className="card overflow-hidden mb-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-panda-100 dark:border-panda-700 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-panda-400 dark:text-panda-400 flex items-center gap-2">
              <Move size={14} />
              拖拽平移 · 滚轮缩放
            </span>
            {/* Reset button */}
            {(scale !== 1 || panX !== 0 || panY !== 0) && (
              <button
                onClick={resetView}
                className="text-xs px-2 py-1 rounded-xl bg-panda-100 text-panda-500
                           hover:bg-panda-200 dark:bg-panda-800 dark:text-panda-300 dark:hover:bg-panda-700 transition-colors"
              >
                重置视图
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.3}
              className="p-2 rounded-xl hover:bg-panda-100 dark:hover:bg-panda-800 transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-sm text-panda-500 dark:text-panda-400 w-12 text-center tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= 3}
              className="p-2 rounded-xl hover:bg-panda-100 dark:hover:bg-panda-800 transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ZoomIn size={18} />
            </button>
          </div>
        </div>

        {/* SVG Canvas */}
        <div
          ref={containerRef}
          className="overflow-x-auto overflow-y-hidden md:overflow-hidden relative
                     h-[420px] md:h-[550px]"
          style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'manipulation' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.05s ease-out',
            }}
          >
            <svg
              viewBox="0 0 1600 900"
              className="block"
              style={{ minWidth: '800px', height: 'auto' }}
            >
              {/* ━━ Edges (connecting lines) ━━ */}
              {filteredNodes
                .filter(n => n.parentIds.length > 0)
                .map(node => {
                  const parent = filteredNodes.find(p => p.id === node.parentIds[0])
                  if (!parent) return null
                  const edgeKey = `${parent.id}→${node.id}`
                  const isPathEdge = highlightedPath.edges.has(edgeKey)
                  const isDimmed = isSearchActive && searchMatches.size > 0 &&
                    !searchMatches.has(node.id) && !searchMatches.has(parent.id)

                  return (
                    <g key={`edge-${node.id}`}>
                      {/* Shadow/glow for highlighted paths */}
                      {isPathEdge && (
                        <line
                          x1={parent.x} y1={parent.y}
                          x2={node.x} y2={node.y}
                          stroke="#F59E0B"
                          strokeWidth={6}
                          strokeOpacity={0.25}
                          strokeLinecap="round"
                        />
                      )}
                      <line
                        x1={parent.x} y1={parent.y}
                        x2={node.x} y2={node.y}
                        stroke={
                          isPathEdge ? '#F59E0B' :
                          isDimmed ? '#e5e5e5' :
                          colors[node.familyId] || '#ccc'
                        }
                        strokeWidth={isPathEdge ? 2.5 : 1.8}
                        strokeOpacity={isDimmed ? 0.2 : isPathEdge ? 0.8 : 0.35}
                        strokeLinecap="round"
                      />
                    </g>
                  )
                })}

              {/* ━━ Nodes ━━ */}
              {filteredNodes.map(node => {
                const isPathNode = highlightedPath.nodes.has(node.id)
                const isSearchMatch = searchMatches.has(node.id)
                const isDimmed = isSearchActive && searchMatches.size > 0 && !isSearchMatch
                const isSelected = selectedNode?.id === node.id
                const familyColor = colors[node.familyId] || '#ccc'
                const nodeSize = node.isRoot ? 48 : 40

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x - nodeSize}, ${node.y - nodeSize})`}
                    className="cursor-pointer"
                    style={{ transition: 'opacity 0.2s' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNodeClick(node)
                    }}
                  >
                    {/* Path highlight glow ring */}
                    {isPathNode && (
                      <circle
                        cx={nodeSize} cy={nodeSize}
                        r={nodeSize + 10}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        strokeOpacity={0.3}
                        className="animate-pulse"
                      />
                    )}

                    {/* Outer circle */}
                    <circle
                      cx={nodeSize} cy={nodeSize}
                      r={nodeSize + 2}
                      fill="white"
                      stroke={
                        isSelected ? '#F59E0B' :
                        isPathNode ? '#F59E0B' :
                        isSearchMatch ? '#10B981' :
                        familyColor
                      }
                      strokeWidth={isSelected || isPathNode ? 3 : isSearchMatch ? 2.5 : 2}
                      opacity={isDimmed ? 0.35 : 1}
                      className="transition-all duration-200"
                      style={{
                        filter: isSearchMatch ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' :
                                isPathNode ? 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))' :
                                'none',
                      }}
                    />

                    {/* Mini panda face inside the node */}
                    <g
                      transform={`translate(${nodeSize - 40}, ${nodeSize - 40})`}
                      opacity={isDimmed ? 0.35 : 1}
                    >
                      <MiniPandaFace color={familyColor} />
                    </g>

                    {/* Root badge */}
                    {node.isRoot && (
                      <>
                        <rect
                          x={nodeSize - 28} y={-14}
                          width={56} height={18}
                          rx={9}
                          fill={familyColor}
                          opacity={isDimmed ? 0.35 : 0.9}
                        />
                        <text
                          x={nodeSize} y={-1}
                          textAnchor="middle"
                          fontSize={10}
                          fontWeight="bold"
                          fill="white"
                          opacity={isDimmed ? 0.35 : 1}
                        >
                          ROOT
                        </text>
                      </>
                    )}

                    {/* Name label */}
                    <text
                      x={nodeSize}
                      y={nodeSize + nodeSize + 20}
                      textAnchor="middle"
                      fontSize={node.isRoot ? 14 : 12.5}
                      fontWeight={isSelected || isSearchMatch ? 'bold' : '600'}
                      fill={isSearchMatch ? '#10B981' : isDimmed ? '#ccc' : '#1a1a1a'}
                      opacity={isDimmed ? 0.4 : 1}
                      className="transition-colors duration-200"
                    >
                      {node.name}
                    </text>
                    <text
                      x={nodeSize}
                      y={nodeSize + nodeSize + 36}
                      textAnchor="middle"
                      fontSize={10}
                      fill={isDimmed ? '#ddd' : '#999'}
                      opacity={isDimmed ? 0.35 : 0.8}
                    >
                      {node.nameEn}
                    </text>

                    {/* Search match indicator dot */}
                    {isSearchMatch && !isPathNode && (
                      <circle
                        cx={nodeSize + nodeSize - 8} cy={8}
                        r={5}
                        fill="#10B981"
                        stroke="white"
                        strokeWidth={2}
                      />
                    )}
                  </g>
                )
              })}

              {/* ━━ Empty state ━━ */}
              {filteredNodes.length === 0 && (
                <text x={800} y={400} textAnchor="middle" fontSize={18} fill="#999">
                  该家族暂无熊猫数据
                </text>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* ━━ Legend (when path is highlighted) ━━ */}
      {selectedNode && highlightedPath.nodes.size > 1 && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl
                        flex items-center gap-3 text-sm text-amber-800
                        dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-200">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
          <span>
            高亮路径：从根节点到 <strong>{selectedNode.name}</strong> 的家族谱系路径
            （共 {highlightedPath.nodes.size} 代）
          </span>
        </div>
      )}

      {/* ━━ Detail Panel ━━ */}
      {selectedNode && (
        <div className="card p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
            <div className="flex items-start sm:items-center gap-4">
              {/* Large panda avatar in detail panel */}
              <div className="w-20 h-20 rounded-full bg-bamboo-50 flex items-center justify-center
                              border-2 border-bamboo-200 overflow-hidden flex-shrink-0
                              dark:bg-bamboo-900/30 dark:border-bamboo-700">
                <svg width={80} height={80} viewBox="0 0 80 80">
                  <MiniPandaFace color={colors[selectedNode.familyId]} />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-panda-900 dark:text-panda-100">{selectedNode.name}</h3>
                <p className="text-sm text-panda-400 dark:text-panda-400">{selectedNode.nameEn}</p>
                {/* Path breadcrumb */}
                {highlightedPath.nodes.size > 1 && (
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {Array.from(highlightedPath.nodes).reverse().map((id, i) => {
                      const n = nodes.find(nd => nd.id === id)
                      if (!n) return null
                      return (
                        <span key={id} className="flex items-center gap-1.5">
                          {i > 0 && <span className="text-panda-300 dark:text-panda-600 text-xs">→</span>}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                            ${id === selectedNode.id
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-panda-100 text-panda-500 dark:bg-panda-800 dark:text-panda-300'}`}
                          >
                            {n.name}
                          </span>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <a
              href={`/pandas/${selectedNode.id}`}
              className="btn-primary text-sm flex-shrink-0 w-full sm:w-auto text-center"
            >
              查看详情 →
            </a>
          </div>
          <div className="flex gap-3 text-sm text-panda-500 dark:text-panda-300">
            <span>
              家族：
              <span className="font-medium" style={{ color: colors[selectedNode.familyId] }}>
                {families.find(f => f.id === selectedNode.familyId)?.name}
              </span>
            </span>
            <span className="text-panda-300 dark:text-panda-600">|</span>
            <span>
              角色：
              <span className="font-medium text-panda-700 dark:text-panda-300">
                {selectedNode.isRoot ? '家族始祖' : '家族成员'}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
