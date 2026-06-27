import { ImageResponse } from 'next/og'
import pandas from '@/data/pandas.json'

export const runtime = 'edge'
export const alt = 'Panda detail share card'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://panda-world-one.vercel.app'

// Accent colors based on panda tags
function getAccentColor(tags: string[]): string {
  if (tags.includes('顶流')) return '#F59E0B'
  if (tags.includes('海归')) return '#3B82F6'
  if (tags.includes('网红')) return '#EC4899'
  if (tags.includes('妈妈')) return '#F97316'
  if (tags.includes('传奇')) return '#8B5CF6'
  if (tags.includes('新一代')) return '#10B981'
  return '#4A7C32'
}

// Get a panda expression emoji based on personality
function getPandaEmoji(personality: string[]): string {
  if (personality.includes('呆萌') || personality.includes('害羞')) return '🥺'
  if (personality.includes('活泼') || personality.includes('调皮')) return '😆'
  if (personality.includes('温柔') || personality.includes('撒娇')) return '😊'
  if (personality.includes('聪明') || personality.includes('胆子大')) return '😎'
  if (personality.includes('稳重') || personality.includes('坚定')) return '😌'
  return '🐼'
}

// Get accessory emoji for special pandas
function getAccessoryEmoji(id: string, tags: string[]): string {
  if (id === 'meng-lan') return '👑'
  if (id === 'fu-bao') return '🎀'
  if (id === 'hua-hua') return '🌸'
  if (id === 'xiang-xiang') return '🎗️'
  if (id === 'qi-yi') return '💕'
  if (id === 'bing-dwen-dwen') return '❄️'
  if (id === 'ya-ya') return '⭐'
  if (tags.includes('吃播')) return '🎋'
  if (tags.includes('功夫熊猫')) return '🥋'
  return ''
}

/**
 * Fetch the panda's main photo and return as a base64 data URI.
 * Falls back to null on any error (network, timeout, etc.).
 */
async function fetchPandaPhoto(imagePath: string): Promise<string | null> {
  try {
    const url = imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) return null

    const arrayBuffer = await res.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    return `data:${contentType};base64,${base64}`
  } catch {
    return null
  }
}

export default async function og({ params }: { params: { lang: string; id: string } }) {
  const panda = pandas.find(p => p.id === params.id)

  if (!panda) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a3a0a, #4a7c32)',
            color: 'white',
            fontSize: 48,
          }}
        >
          🐼 Panda Not Found
        </div>
      ),
      { ...size }
    )
  }

  // Fetch panda photo: prefer photoUrl, fallback to imageUrl
  const photoPath = (panda as any).photoUrl || (panda as any).imageUrl || ''
  const photoDataUri = photoPath ? await fetchPandaPhoto(photoPath) : null

  const age = new Date().getFullYear() - new Date(panda.birthDate).getFullYear()
  const accent = getAccentColor(panda.tags)
  const funFact = panda.funFacts[0]
  const genderIcon = panda.gender === 'male' ? '♂' : '♀'
  const moodEmoji = getPandaEmoji(panda.personality)
  const accEmoji = getAccessoryEmoji(panda.id, panda.tags)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1a3a0a 0%, #2e5a1e 35%, #3d6b28 100%)',
          color: 'white',
          padding: '50px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Bamboo decorations */}
        <div style={{ position: 'absolute', top: 25, left: 45, opacity: 0.12, fontSize: 60 }}>
          🎋
        </div>
        <div style={{ position: 'absolute', top: 30, right: 60, opacity: 0.1, fontSize: 55 }}>
          🎋
        </div>
        <div style={{ position: 'absolute', bottom: 50, left: 80, opacity: 0.08, fontSize: 50 }}>
          🎋
        </div>
        <div style={{ position: 'absolute', bottom: 60, right: 50, opacity: 0.12, fontSize: 55 }}>
          🎋
        </div>

        {/* Accent dot decorations */}
        <div
          style={{
            position: 'absolute', top: 40, right: 130, width: 8, height: 8,
            borderRadius: '50%', background: accent, opacity: 0.3,
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: 100, left: 200, width: 5, height: 5,
            borderRadius: '50%', background: accent, opacity: 0.25,
          }}
        />
        <div
          style={{
            position: 'absolute', top: 120, right: 280, width: 4, height: 4,
            borderRadius: '50%', background: accent, opacity: 0.2,
          }}
        />

        {/* Main content: two-column layout */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            gap: 50,
            alignItems: 'center',
          }}
        >
          {/* Left: Panda photo or emoji avatar */}
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {photoDataUri ? (
              <img
                src={photoDataUri}
                alt={panda.name}
                width={240}
                height={240}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            ) : (
              <>
                {/* Panda emoji */}
                <span style={{ fontSize: 120, lineHeight: 1 }}>{moodEmoji}</span>
                {/* Accessory */}
                {accEmoji && (
                  <span style={{
                    position: 'absolute',
                    top: 8,
                    right: 55,
                    fontSize: 40,
                    lineHeight: 1,
                  }}>
                    {accEmoji}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Right: Panda info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              gap: 14,
            }}
          >
            {/* Name */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                }}
              >
                {panda.name}
              </span>
              <span style={{ fontSize: 28, fontWeight: 500, opacity: 0.7 }}>
                {panda.nameEn}
              </span>
            </div>

            {/* Age + Gender badge + location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  fontSize: 22,
                  background: 'rgba(255,255,255,0.15)',
                  padding: '4px 16px',
                  borderRadius: 20,
                  fontWeight: 600,
                }}
              >
                {genderIcon} {age}岁
              </span>
              <span style={{ fontSize: 20, opacity: 0.6 }}>
                📍 {panda.birthPlace}
              </span>
            </div>

            {/* Claim to Fame */}
            <p
              style={{
                fontSize: 26,
                fontWeight: 500,
                opacity: 0.92,
                margin: 0,
                lineHeight: 1.4,
                maxWidth: 700,
              }}
            >
              💬 {panda.claimToFame}
            </p>

            {/* Fun Fact */}
            <div
              style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 20 }}>✨</span>
              <p
                style={{
                  fontSize: 20,
                  margin: 0,
                  opacity: 0.85,
                  lineHeight: 1.5,
                }}
              >
                {funFact}
              </p>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {panda.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: 16,
                    background: 'rgba(255,255,255,0.12)',
                    padding: '3px 12px',
                    borderRadius: 12,
                    fontWeight: 500,
                  }}
                >
                  🏷️ {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom branding bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 30,
            paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🐼</span>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
              Panda World
            </span>
          </div>
          <span style={{ fontSize: 18, opacity: 0.5 }}>
            全球大熊猫平台 · 直播 · 图鉴 · 百科
          </span>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 5,
            background: `linear-gradient(90deg, ${accent} 0%, #84cc16 50%, #22c55e 100%)`,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
