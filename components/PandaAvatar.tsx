// Generate unique panda avatar SVG based on personality traits
// Each panda gets distinct features: expression, accessories, pose

interface PandaData {
  id: string
  name: string
  personality: string[]
  claimToFame: string
  tags: string[]
  gender: string
}

// Color schemes based on tags
function getAccentColor(tags: string[]): string {
  if (tags.includes('顶流')) return '#F59E0B'
  if (tags.includes('海归')) return '#3B82F6'
  if (tags.includes('网红')) return '#EC4899'
  if (tags.includes('妈妈')) return '#F97316'
  if (tags.includes('传奇')) return '#8B5CF6'
  if (tags.includes('新一代')) return '#10B981'
  return '#4A7C32'
}

// Expression based on personality
function getExpression(personality: string[]): {
  eyes: string
  mouth: string
  cheeks: boolean
  blush: string
} {
  if (personality.includes('呆萌') || personality.includes('害羞')) {
    return { eyes: 'dot', mouth: 'small', cheeks: true, blush: '#FFB5B5' }
  }
  if (personality.includes('活泼') || personality.includes('调皮')) {
    return { eyes: 'sparkle', mouth: 'grin', cheeks: false, blush: 'none' }
  }
  if (personality.includes('温柔') || personality.includes('安静')) {
    return { eyes: 'soft', mouth: 'gentle', cheeks: true, blush: '#FFD4D4' }
  }
  if (personality.includes('聪明') || personality.includes('胆子大')) {
    return { eyes: 'sharp', mouth: 'smirk', cheeks: false, blush: 'none' }
  }
  if (personality.includes('撒娇') || personality.includes('粘人')) {
    return { eyes: 'happy', mouth: 'cute', cheeks: true, blush: '#FFC0C0' }
  }
  if (personality.includes('稳重') || personality.includes('坚定')) {
    return { eyes: 'calm', mouth: 'subtle', cheeks: false, blush: 'none' }
  }
  return { eyes: 'normal', mouth: 'normal', cheeks: false, blush: 'none' }
}

// Accessories based on claim to fame
function getAccessory(id: string, tags: string[], claimToFame: string): string | null {
  if (id === 'meng-lan') return 'crown'      // 越狱王
  if (id === 'fu-bao') return 'bow'           // 公主
  if (id === 'xiang-xiang') return 'ribbon'    // 优雅
  if (id === 'qi-yi') return 'heart'           // 粘人
  if (id === 'hua-hua') return 'flower'        // 花花
  if (id === 'bing-dwen-dwen') return 'ice'    // 冰墩墩
  if (id === 'ya-ya') return 'star'            // 坚强
  if (tags.includes('吃播')) return 'bamboo'
  if (tags.includes('功夫熊猫')) return 'bandana'
  return null
}

function renderEyes(type: string, cx: number, cy: number) {
  switch (type) {
    case 'dot':
      return <circle cx={cx} cy={cy} r={3} fill="#1a1a1a" />
    case 'sparkle':
      return (
        <g>
          <circle cx={cx} cy={cy} r={5} fill="#1a1a1a" />
          <circle cx={cx - 1.5} cy={cy - 1.5} r={2.5} fill="white" />
          <circle cx={cx + 2} cy={cy - 0.5} r={1.5} fill="white" />
        </g>
      )
    case 'soft':
      return (
        <g>
          <ellipse cx={cx} cy={cy} rx={4} ry={3.5} fill="#1a1a1a" />
          <circle cx={cx - 1} cy={cy - 1} r={1.5} fill="white" />
        </g>
      )
    case 'sharp':
      return (
        <g>
          <ellipse cx={cx} cy={cy} rx={5.5} ry={4.5} fill="#1a1a1a" />
          <circle cx={cx} cy={cy - 1} r={2} fill="white" />
          <line x1={cx - 4} y1={cy - 4} x2={cx - 2} y2={cy - 6} stroke="#1a1a1a" strokeWidth={1.5} />
        </g>
      )
    case 'happy':
      return (
        <g>
          <path d={`M${cx - 5},${cy} Q${cx},${cy - 4} ${cx + 5},${cy}`} fill="none" stroke="#1a1a1a" strokeWidth={2} />
          <circle cx={cx} cy={cy + 1} r={2.5} fill="#1a1a1a" />
        </g>
      )
    case 'calm':
      return <ellipse cx={cx} cy={cy} rx={4} ry={5} fill="#1a1a1a" />
    default:
      return <circle cx={cx} cy={cy} r={4.5} fill="#1a1a1a" />
  }
}

function renderMouth(type: string, cx: number, cy: number) {
  switch (type) {
    case 'small':
      return <circle cx={cx} cy={cy} r={2} fill="#1a1a1a" />
    case 'grin':
      return (
        <path
          d={`M${cx - 8},${cy - 2} Q${cx},${cy + 8} ${cx + 8},${cy - 2}`}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={2}
          strokeLinecap="round"
        />
      )
    case 'gentle':
      return (
        <path
          d={`M${cx - 6},${cy} Q${cx},${cy + 4} ${cx + 6},${cy}`}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      )
    case 'smirk':
      return (
        <path
          d={`M${cx - 6},${cy} Q${cx},${cy + 5} ${cx + 8},${cy - 2}`}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={2}
          strokeLinecap="round"
        />
      )
    case 'cute':
      return (
        <g>
          <circle cx={cx} cy={cy} r={2.5} fill="#1a1a1a" />
          <path d={`M${cx - 4},${cy - 4} Q${cx},${cy - 1} ${cx + 4},${cy - 4}`}
                fill="none" stroke="#1a1a1a" strokeWidth={1} strokeLinecap="round" />
        </g>
      )
    case 'subtle':
      return (
        <path
          d={`M${cx - 5},${cy} Q${cx},${cy + 2} ${cx + 5},${cy}`}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      )
    default:
      return (
        <path
          d={`M${cx - 5},${cy} Q${cx},${cy + 4} ${cx + 5},${cy}`}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      )
  }
}

function renderAccessory(type: string) {
  switch (type) {
    case 'crown':
      return (
        <g transform="translate(0, -68)">
          <path d="M-12,5 L-10,-8 L-4,-2 L0,-10 L4,-2 L10,-8 L12,5 Z"
                fill="#FBBF24" stroke="#F59E0B" strokeWidth={1} />
          <circle cx={-10} cy={-8} r={2} fill="#FCD34D" />
          <circle cx={0} cy={-10} r={2} fill="#FCD34D" />
          <circle cx={10} cy={-8} r={2} fill="#FCD34D" />
        </g>
      )
    case 'bow':
      return (
        <g transform="translate(18, -60)">
          <path d="M0,0 Q-6,-8 -4,-14 Q0,-10 0,0 Z" fill="#EC4899" />
          <path d="M0,0 Q6,-8 4,-14 Q0,-10 0,0 Z" fill="#F472B6" />
          <circle cx={0} cy={-7} r={2.5} fill="#BE185D" />
        </g>
      )
    case 'ribbon':
      return (
        <g transform="translate(-20, -55)">
          <path d="M0,8 Q-5,-2 0,-12" fill="none" stroke="#8B5CF6" strokeWidth={3} strokeLinecap="round" />
          <path d="M0,8 Q5,-2 0,-12" fill="none" stroke="#7C3AED" strokeWidth={2} strokeLinecap="round" />
          <circle cx={0} cy={-12} r={2} fill="#8B5CF6" />
        </g>
      )
    case 'heart':
      return (
        <g transform="translate(20, -62)">
          <path d="M0,5 Q0,0 -5,-4 Q-8,-6 -5,-8 Q-2,-6 0,-3 Q2,-6 5,-8 Q8,-6 5,-4 Q0,0 0,5 Z"
                fill="#EF4444" />
        </g>
      )
    case 'flower':
      return (
        <g transform="translate(-18, -62)">
          <circle cx={0} cy={0} r={4} fill="#FBBF24" />
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <ellipse key={angle}
              cx={0} cy={-8} rx={3} ry={5}
              fill="#FCD34D"
              transform={`rotate(${angle})`}
              opacity={0.8}
            />
          ))}
        </g>
      )
    case 'star':
      return (
        <g transform="translate(22, -58)">
          <path d="M0,-8 L2,-3 L7,-3 L3,1 L5,7 L0,3 L-5,7 L-3,1 L-7,-3 L-2,-3 Z"
                fill="#FBBF24" />
        </g>
      )
    case 'bamboo':
      return (
        <g transform="translate(-22, -50)">
          <rect x={-2} y={-10} width={4} height={18} rx={2} fill="#4A7C32" opacity={0.8} />
          <rect x={-2} y={4} width={4} height={4} rx={1} fill="#6BA84F" />
          <rect x={-2} y={-4} width={4} height={4} rx={1} fill="#6BA84F" />
          <ellipse cx={0} cy={-12} rx={6} ry={3} fill="#6BA84F" opacity={0.6} />
        </g>
      )
    case 'bandana':
      return (
        <g transform="translate(0, -46)">
          <path d="M-14,8 Q-10,0 0,-5 Q10,0 14,8 Z" fill="#EF4444" opacity={0.9} />
          <path d="M-14,8 L-12,12 L-8,8" fill="#EF4444" />
          <circle cx={0} cy={-2} r={2} fill="#DC2626" />
        </g>
      )
    default:
      return null
  }
}

export default function PandaAvatar({
  data,
  size = 200,
  className = '',
}: {
  data: PandaData
  size?: number
  className?: string
}) {
  const accent = getAccentColor(data.tags)
  const expr = getExpression(data.personality)
  const accessory = getAccessory(data.id, data.tags, data.claimToFame)
  const scale = size / 200

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`bg-${data.id}`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity={0.08} />
          <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
        </radialGradient>
      </defs>

      {/* Background circle */}
      <circle cx={100} cy={100} r={95} fill={`url(#bg-${data.id})`} />
      <circle cx={100} cy={100} r={93} fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.15} />

      {/* Ears */}
      <circle cx={42} cy={45} r={22} fill="#1a1a1a" />
      <circle cx={158} cy={45} r={22} fill="#1a1a1a" />
      {/* Inner ears */}
      <circle cx={42} cy={45} r={10} fill="#3a3a3a" opacity={0.4} />
      <circle cx={158} cy={45} r={10} fill="#3a3a3a" opacity={0.4} />

      {/* Face (white) */}
      <ellipse cx={100} cy={110} rx={55} ry={50} fill="white" stroke="#E5E5E5" strokeWidth={1} />

      {/* Eye patches (black ovals) */}
      <ellipse cx={78} cy={96} rx={22} ry={18} fill="#1a1a1a"
               transform="rotate(-8, 78, 96)" />
      <ellipse cx={122} cy={96} rx={22} ry={18} fill="#1a1a1a"
               transform="rotate(8, 122, 96)" />

      {/* Eyes (white pupils) */}
      <circle cx={80} cy={94} r={6} fill="white" opacity={0.9} />
      <circle cx={120} cy={94} r={6} fill="white" opacity={0.9} />

      {/* Eye expression */}
      {renderEyes(expr.eyes, 80, 94)}
      {renderEyes(expr.eyes, 120, 94)}

      {/* Nose */}
      <ellipse cx={100} cy={112} rx={8} ry={5.5} fill="#1a1a1a" />
      <ellipse cx={98} cy={110} rx={2.5} ry={1.5} fill="#4a4a4a" />

      {/* Mouth */}
      {renderMouth(expr.mouth, 100, 128)}

      {/* Blush */}
      {expr.cheeks && (
        <>
          <ellipse cx={58} cy={115} rx={14} ry={8} fill="#FFB5B5" opacity={0.35} />
          <ellipse cx={142} cy={115} rx={14} ry={8} fill="#FFB5B5" opacity={0.35} />
        </>
      )}

      {/* Accessory */}
      {accessory && renderAccessory(accessory)}

      {/* Body hint */}
      <ellipse cx={100} cy={178} rx={30} ry={18} fill="#1a1a1a" opacity={0.08} />
    </svg>
  )
}
