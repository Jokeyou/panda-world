import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Panda World · 全球大熊猫平台'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a3a0a 0%, #2e5a1e 40%, #4a7c32 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: 60,
        }}
      >
        {/* Bamboo leaves decoration */}
        <div style={{ position: 'absolute', top: 30, left: 60, opacity: 0.15, fontSize: 80 }}>
          🎋
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 80, opacity: 0.15, fontSize: 80 }}>
          🎋
        </div>

        {/* Logo area */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 80,
            marginBottom: 30,
          }}
        >
          🐼
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: 'white',
            margin: 0,
            letterSpacing: -2,
            textAlign: 'center',
          }}
        >
          Panda World
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.75)',
            margin: 0,
            marginTop: 16,
            textAlign: 'center',
          }}
        >
          全球大熊猫平台 · 直播 · 图鉴 · 百科
        </p>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 6,
            background: 'linear-gradient(90deg, #f59e0b 0%, #84cc16 50%, #22c55e 100%)',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
