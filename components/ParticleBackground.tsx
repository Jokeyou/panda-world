'use client'

import { useEffect, useRef } from 'react'

// ── Particle types ──────────────────────────────────────────

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  type: 'leaf' | 'paw' | 'sparkle'
  life: number
  maxLife: number
}

// ── Draw helpers ─────────────────────────────────────────────

function drawBambooLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  opacity: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.globalAlpha = opacity * 0.7

  // Leaf shape: elongated ellipse with pointed tips
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(
    -size * 0.4, -size * 0.25,
    -size * 0.35, -size * 0.5,
    0, -size * 0.6,
  )
  ctx.bezierCurveTo(
    size * 0.35, -size * 0.5,
    size * 0.4, -size * 0.25,
    0, 0,
  )
  ctx.fillStyle = '#4A7C32'
  ctx.fill()

  // Vein line
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, -size * 0.55)
  ctx.strokeStyle = '#3A6422'
  ctx.lineWidth = 0.8
  ctx.stroke()

  ctx.restore()
}

function drawPawPrint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  opacity: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.globalAlpha = opacity * 0.4

  const s = size * 0.45
  // Main pad
  ctx.beginPath()
  ctx.ellipse(0, s * 0.3, s * 0.8, s * 0.6, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#5A5A5A'
  ctx.fill()

  // Toe pads (4 small circles)
  const toes = [
    [-s * 0.7, -s * 0.5],
    [-s * 0.25, -s * 0.85],
    [s * 0.25, -s * 0.85],
    [s * 0.7, -s * 0.5],
  ]
  toes.forEach(([tx, ty]) => {
    ctx.beginPath()
    ctx.arc(tx, ty, s * 0.28, 0, Math.PI * 2)
    ctx.fillStyle = '#5A5A5A'
    ctx.fill()
  })

  ctx.restore()
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  opacity: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.globalAlpha = opacity * 0.8

  const s = size * 0.5
  ctx.beginPath()
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2
    const sx = Math.cos(angle) * s
    const sy = Math.sin(angle) * s
    const cx1 = Math.cos(angle + 0.5) * s * 0.35
    const cy1 = Math.sin(angle + 0.5) * s * 0.35
    const cx2 = Math.cos(angle - 0.5) * s * 0.35
    const cy2 = Math.sin(angle - 0.5) * s * 0.35

    if (i === 0) ctx.moveTo(sx, sy)
    else ctx.lineTo(sx, sy)
    ctx.quadraticCurveTo(cx1, cy1, 0, 0)
    ctx.quadraticCurveTo(cx2, cy2, sx, sy)
  }
  ctx.fillStyle = '#FBBF24'
  ctx.fill()

  // Glow
  ctx.beginPath()
  ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2)
  ctx.fillStyle = '#FDE68A'
  ctx.fill()

  ctx.restore()
}

// ── Main component ───────────────────────────────────────────

interface ParticleBackgroundProps {
  className?: string
  particleCount?: number
}

export default function ParticleBackground({
  className = '',
  particleCount = 40,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ── Resize handler ──
    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    // ── Spawn particles ──
    const spawn = (): Particle => {
      const types: Particle['type'][] = ['leaf', 'leaf', 'leaf', 'paw', 'paw', 'sparkle']
      const type = types[Math.floor(Math.random() * types.length)]
      const rect = canvas.getBoundingClientRect()

      return {
        x: Math.random() * rect.width,
        y: rect.height + 20,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.5 + 0.3),
        size: type === 'leaf' ? 12 + Math.random() * 16 : type === 'paw' ? 14 + Math.random() * 10 : 6 + Math.random() * 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: type === 'sparkle' ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.3,
        type,
        life: 0,
        maxLife: 350 + Math.random() * 450,
      }
    }

    // Initialize
    particlesRef.current = Array.from({ length: particleCount }, spawn)

    // ── Animation loop ──
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const particles = particlesRef.current

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        // Fade in/out
        const fadeIn = Math.min(p.life / 40, 1)
        const fadeOut = Math.max(0, 1 - (p.life - p.maxLife + 60) / 60)
        const currentOpacity = p.opacity * fadeIn * fadeOut

        // Draw
        if (currentOpacity > 0.01) {
          if (p.type === 'leaf') {
            drawBambooLeaf(ctx, p.x, p.y, p.size, p.rotation, currentOpacity)
          } else if (p.type === 'paw') {
            drawPawPrint(ctx, p.x, p.y, p.size, p.rotation, currentOpacity)
          } else {
            drawSparkle(ctx, p.x, p.y, p.size, p.rotation, currentOpacity)
          }
        }

        // Remove and respawn when dead
        if (p.life >= p.maxLife || p.y < -60) {
          particles[i] = spawn()
          particles[i].y = rect.height + 10
        }

        // Also respawn if drifting too far horizontally
        if (p.x < -60 || p.x > rect.width + 60) {
          particles[i] = spawn()
          particles[i].y = rect.height + 10
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [particleCount])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  )
}
