import { NextRequest } from 'next/server'
import pandas from '@/data/pandas.json'

export const runtime = 'edge'

// Accent color by tags (mirrors PandaAvatar logic)
function getAccentColor(tags: string[]): string {
  if (tags.includes('顶流')) return '#F59E0B'
  if (tags.includes('海归')) return '#3B82F6'
  if (tags.includes('网红')) return '#EC4899'
  if (tags.includes('妈妈')) return '#F97316'
  if (tags.includes('传奇')) return '#8B5CF6'
  if (tags.includes('新一代')) return '#10B981'
  return '#4A7C32'
}

// Expression by personality
type Expression = {
  eyes: 'dot' | 'sparkle' | 'soft' | 'sharp' | 'happy' | 'calm' | 'normal'
  mouth: 'small' | 'grin' | 'gentle' | 'smirk' | 'cute' | 'subtle' | 'normal'
  cheeks: boolean
}

function getExpression(personality: string[]): Expression {
  if (personality.includes('呆萌') || personality.includes('害羞')) {
    return { eyes: 'dot', mouth: 'small', cheeks: true }
  }
  if (personality.includes('活泼') || personality.includes('调皮')) {
    return { eyes: 'sparkle', mouth: 'grin', cheeks: false }
  }
  if (personality.includes('温柔') || personality.includes('安静')) {
    return { eyes: 'soft', mouth: 'gentle', cheeks: true }
  }
  if (personality.includes('聪明') || personality.includes('胆子大')) {
    return { eyes: 'sharp', mouth: 'smirk', cheeks: false }
  }
  if (personality.includes('撒娇') || personality.includes('粘人')) {
    return { eyes: 'happy', mouth: 'cute', cheeks: true }
  }
  if (personality.includes('稳重') || personality.includes('坚韧')) {
    return { eyes: 'calm', mouth: 'subtle', cheeks: false }
  }
  return { eyes: 'normal', mouth: 'normal', cheeks: false }
}

// Accessory by id/tags
function getAccessory(id: string, tags: string[]): string | null {
  if (id === 'meng-lan') return 'crown'
  if (id === 'fu-bao') return 'bow'
  if (id === 'xiang-xiang') return 'ribbon'
  if (id === 'qi-yi') return 'heart'
  if (id === 'hua-hua') return 'flower'
  if (id === 'bing-dwen-dwen') return 'ice'
  if (id === 'ya-ya') return 'star'
  if (tags.includes('吃播')) return 'bamboo'
  if (tags.includes('功夫熊猫')) return 'bandana'
  return null
}

// --- SVG string builders ---

function eyesSvg(type: string, cx: number, cy: number): string {
  switch (type) {
    case 'dot':
      return `<circle cx="${cx}" cy="${cy}" r="3" fill="#1a1a1a"/>`
    case 'sparkle':
      return `
        <circle cx="${cx}" cy="${cy}" r="5" fill="#1a1a1a"/>
        <circle cx="${cx - 1.5}" cy="${cy - 1.5}" r="2.5" fill="white"/>
        <circle cx="${cx + 2}" cy="${cy - 0.5}" r="1.5" fill="white"/>
      `
    case 'soft':
      return `
        <ellipse cx="${cx}" cy="${cy}" rx="4" ry="3.5" fill="#1a1a1a"/>
        <circle cx="${cx - 1}" cy="${cy - 1}" r="1.5" fill="white"/>
      `
    case 'sharp':
      return `
        <ellipse cx="${cx}" cy="${cy}" rx="5.5" ry="4.5" fill="#1a1a1a"/>
        <circle cx="${cx}" cy="${cy - 1}" r="2" fill="white"/>
        <line x1="${cx - 4}" y1="${cy - 4}" x2="${cx - 2}" y2="${cy - 6}" stroke="#1a1a1a" stroke-width="1.5"/>
      `
    case 'happy':
      return `
        <path d="M${cx - 5},${cy} Q${cx},${cy - 4} ${cx + 5},${cy}" fill="none" stroke="#1a1a1a" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy + 1}" r="2.5" fill="#1a1a1a"/>
      `
    case 'calm':
      return `<ellipse cx="${cx}" cy="${cy}" rx="4" ry="5" fill="#1a1a1a"/>`
    default:
      return `<circle cx="${cx}" cy="${cy}" r="4.5" fill="#1a1a1a"/>`
  }
}

function mouthSvg(type: string): string {
  const cx = 100, cy = 128
  switch (type) {
    case 'small':
      return `<circle cx="${cx}" cy="${cy}" r="2" fill="#1a1a1a"/>`
    case 'grin':
      return `<path d="M${cx - 8},${cy - 2} Q${cx},${cy + 8} ${cx + 8},${cy - 2}" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>`
    case 'gentle':
      return `<path d="M${cx - 6},${cy} Q${cx},${cy + 4} ${cx + 6},${cy}" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>`
    case 'smirk':
      return `<path d="M${cx - 6},${cy} Q${cx},${cy + 5} ${cx + 8},${cy - 2}" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>`
    case 'cute':
      return `
        <circle cx="${cx}" cy="${cy}" r="2.5" fill="#1a1a1a"/>
        <path d="M${cx - 4},${cy - 4} Q${cx},${cy - 1} ${cx + 4},${cy - 4}" fill="none" stroke="#1a1a1a" stroke-width="1" stroke-linecap="round"/>
      `
    case 'subtle':
      return `<path d="M${cx - 5},${cy} Q${cx},${cy + 2} ${cx + 5},${cy}" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>`
    default:
      return `<path d="M${cx - 5},${cy} Q${cx},${cy + 4} ${cx + 5},${cy}" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>`
  }
}

function accessorySvg(type: string | null): string {
  switch (type) {
    case 'crown':
      return `
        <g transform="translate(0, -68)">
          <path d="M-12,5 L-10,-8 L-4,-2 L0,-10 L4,-2 L10,-8 L12,5 Z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/>
          <circle cx="-10" cy="-8" r="2" fill="#FCD34D"/>
          <circle cx="0" cy="-10" r="2" fill="#FCD34D"/>
          <circle cx="10" cy="-8" r="2" fill="#FCD34D"/>
        </g>`
    case 'bow':
      return `
        <g transform="translate(18, -60)">
          <path d="M0,0 Q-6,-8 -4,-14 Q0,-10 0,0 Z" fill="#EC4899"/>
          <path d="M0,0 Q6,-8 4,-14 Q0,-10 0,0 Z" fill="#F472B6"/>
          <circle cx="0" cy="-7" r="2.5" fill="#BE185D"/>
        </g>`
    case 'ribbon':
      return `
        <g transform="translate(-20, -55)">
          <path d="M0,8 Q-5,-2 0,-12" fill="none" stroke="#8B5CF6" stroke-width="3" stroke-linecap="round"/>
          <path d="M0,8 Q5,-2 0,-12" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round"/>
          <circle cx="0" cy="-12" r="2" fill="#8B5CF6"/>
        </g>`
    case 'heart':
      return `
        <g transform="translate(20, -62)">
          <path d="M0,5 Q0,0 -5,-4 Q-8,-6 -5,-8 Q-2,-6 0,-3 Q2,-6 5,-8 Q8,-6 5,-4 Q0,0 0,5 Z" fill="#EF4444"/>
        </g>`
    case 'flower':
      return `
        <g transform="translate(-18, -62)">
          <circle cx="0" cy="0" r="4" fill="#FBBF24"/>
          ${[0, 60, 120, 180, 240, 300].map(angle =>
            `<ellipse cx="0" cy="-8" rx="3" ry="5" fill="#FCD34D" transform="rotate(${angle})" opacity="0.8"/>`
          ).join('')}
        </g>`
    case 'star':
      return `
        <g transform="translate(22, -58)">
          <path d="M0,-8 L2,-3 L7,-3 L3,1 L5,7 L0,3 L-5,7 L-3,1 L-7,-3 L-2,-3 Z" fill="#FBBF24"/>
        </g>`
    case 'bamboo':
      return `
        <g transform="translate(-22, -50)">
          <rect x="-2" y="-10" width="4" height="18" rx="2" fill="#4A7C32" opacity="0.8"/>
          <rect x="-2" y="4" width="4" height="4" rx="1" fill="#6BA84F"/>
          <rect x="-2" y="-4" width="4" height="4" rx="1" fill="#6BA84F"/>
          <ellipse cx="0" cy="-12" rx="6" ry="3" fill="#6BA84F" opacity="0.6"/>
        </g>`
    case 'bandana':
      return `
        <g transform="translate(0, -46)">
          <path d="M-14,8 Q-10,0 0,-5 Q10,0 14,8 Z" fill="#EF4444" opacity="0.9"/>
          <path d="M-14,8 L-12,12 L-8,8" fill="#EF4444"/>
          <circle cx="0" cy="-2" r="2" fill="#DC2626"/>
        </g>`
    default:
      return ''
  }
}

function generateSvg(panda: typeof pandas[number]): string {
  const accent = getAccentColor(panda.tags)
  const expr = getExpression(panda.personality)
  const accessory = getAccessory(panda.id, panda.tags)
  const nameDisplay = panda.name.length <= 3 ? panda.name : panda.name.slice(0, 3)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.02"/>
    </radialGradient>
  </defs>
  <!-- Background -->
  <circle cx="100" cy="100" r="95" fill="url(#bg)"/>
  <circle cx="100" cy="100" r="93" fill="none" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.15"/>

  <!-- Ears -->
  <circle cx="42" cy="45" r="22" fill="#1a1a1a"/>
  <circle cx="158" cy="45" r="22" fill="#1a1a1a"/>
  <circle cx="42" cy="45" r="10" fill="#3a3a3a" opacity="0.4"/>
  <circle cx="158" cy="45" r="10" fill="#3a3a3a" opacity="0.4"/>

  <!-- Face -->
  <ellipse cx="100" cy="110" rx="55" ry="50" fill="white" stroke="#E5E5E5" stroke-width="1"/>

  <!-- Eye patches -->
  <ellipse cx="78" cy="96" rx="22" ry="18" fill="#1a1a1a" transform="rotate(-8, 78, 96)"/>
  <ellipse cx="122" cy="96" rx="22" ry="18" fill="#1a1a1a" transform="rotate(8, 122, 96)"/>

  <!-- Eye whites -->
  <circle cx="80" cy="94" r="6" fill="white" opacity="0.9"/>
  <circle cx="120" cy="94" r="6" fill="white" opacity="0.9"/>

  <!-- Eye expressions -->
  ${eyesSvg(expr.eyes, 80, 94)}
  ${eyesSvg(expr.eyes, 120, 94)}

  <!-- Nose -->
  <ellipse cx="100" cy="112" rx="8" ry="5.5" fill="#1a1a1a"/>
  <ellipse cx="98" cy="110" rx="2.5" ry="1.5" fill="#4a4a4a"/>

  <!-- Mouth -->
  ${mouthSvg(expr.mouth)}

  <!-- Blush -->
  ${expr.cheeks ? `
    <ellipse cx="58" cy="115" rx="14" ry="8" fill="#FFB5B5" opacity="0.35"/>
    <ellipse cx="142" cy="115" rx="14" ry="8" fill="#FFB5B5" opacity="0.35"/>
  ` : ''}

  <!-- Accessory -->
  ${accessorySvg(accessory)}

  <!-- Body hint -->
  <ellipse cx="100" cy="178" rx="30" ry="18" fill="#1a1a1a" opacity="0.08"/>

  <!-- Name label -->
  <text x="100" y="192" text-anchor="middle" font-size="10" fill="${accent}" font-family="sans-serif"
        font-weight="600" opacity="0.5">${nameDisplay}</text>
</svg>`
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || ''

  const panda = pandas.find(
    p => p.nameEn === name || p.name === name || p.id === name
  )

  // Fallback: generic panda avatar for unknown names
  if (!panda) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="95" fill="#FDFAF3"/>
  <circle cx="100" cy="100" r="93" fill="none" stroke="#4A7C32" stroke-width="1.5" stroke-opacity="0.15"/>
  <circle cx="42" cy="45" r="22" fill="#1a1a1a"/>
  <circle cx="158" cy="45" r="22" fill="#1a1a1a"/>
  <circle cx="42" cy="45" r="10" fill="#3a3a3a" opacity="0.4"/>
  <circle cx="158" cy="45" r="10" fill="#3a3a3a" opacity="0.4"/>
  <ellipse cx="100" cy="110" rx="55" ry="50" fill="white" stroke="#E5E5E5" stroke-width="1"/>
  <ellipse cx="78" cy="96" rx="22" ry="18" fill="#1a1a1a" transform="rotate(-8, 78, 96)"/>
  <ellipse cx="122" cy="96" rx="22" ry="18" fill="#1a1a1a" transform="rotate(8, 122, 96)"/>
  <circle cx="80" cy="94" r="6" fill="white" opacity="0.9"/>
  <circle cx="120" cy="94" r="6" fill="white" opacity="0.9"/>
  <circle cx="80" cy="94" r="4.5" fill="#1a1a1a"/>
  <circle cx="120" cy="94" r="4.5" fill="#1a1a1a"/>
  <ellipse cx="100" cy="112" rx="8" ry="5.5" fill="#1a1a1a"/>
  <ellipse cx="98" cy="110" rx="2.5" ry="1.5" fill="#4a4a4a"/>
  <path d="M95,128 Q100,132 105,128" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round"/>
  <ellipse cx="100" cy="178" rx="30" ry="18" fill="#1a1a1a" opacity="0.08"/>
  <text x="100" y="190" text-anchor="middle" font-size="10" fill="#4A7C32" font-family="sans-serif"
        font-weight="600" opacity="0.5">🐼</text>
</svg>`
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    })
  }

  const svg = generateSvg(panda)

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  })
}
