'use client'

import { useState } from 'react'
import Image from 'next/image'
import PandaAvatar from './PandaAvatar'

// ============================================================
// Types
// ============================================================

export interface PandaImageData {
  id: string
  name: string
  photoUrl?: string
  photoCredit?: string
  imageUrl?: string
  personality: string[]
  claimToFame: string
  tags: string[]
  gender: string
}

type PandaImageSize = 'thumb' | 'card' | 'hero'

interface PandaImageProps {
  panda: PandaImageData
  size?: PandaImageSize
  className?: string
  priority?: boolean
}

// ============================================================
// Size config
// ============================================================

const SIZE_CONFIG: Record<PandaImageSize, { width: number; height: number; className: string }> = {
  thumb: { width: 200, height: 200, className: 'w-[200px] h-[200px]' },
  card:  { width: 400, height: 300, className: 'w-full h-[300px] max-w-[400px]' },
  hero:  { width: 1200, height: 600, className: 'w-full h-[400px] md:h-[500px]' },
}

// ============================================================
// Blur placeholder — warm cream solid color base64
// ============================================================

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsM' +
  'DQ4SEA4OEREMDRIQERURExYWFxYWGhoaGhsbGxsbGxsbGz/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAA' +
  'Cf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q=='

// ============================================================
// Component
// ============================================================

export default function PandaImage({
  panda,
  size = 'card',
  className = '',
  priority = false,
}: PandaImageProps) {
  const [hasError, setHasError] = useState(false)
  const { width, height, className: sizeClass } = SIZE_CONFIG[size]

  // Determine the image source: prefer photoUrl, fallback to imageUrl
  const imgSrc = panda.photoUrl || panda.imageUrl || ''

  // If no image source or error occurred → show PandaAvatar fallback
  if (!imgSrc || hasError) {
    const avatarSize = size === 'thumb' ? 200 : size === 'hero' ? 400 : 300
    return (
      <div className={`flex items-center justify-center bg-cream/30 ${sizeClass} ${className}`}>
        <PandaAvatar data={panda} size={avatarSize} />
      </div>
    )
  }

  // Determine aspect ratio for Next.js Image
  const aspectRatio = width / height
  const fillMode = size === 'hero'

  return (
    <div
      className={`relative overflow-hidden group ${sizeClass} ${className}`}
    >
      {/* Image with hover zoom */}
      <Image
        src={imgSrc}
        alt={panda.name}
        width={fillMode ? undefined : width}
        height={fillMode ? undefined : height}
        fill={fillMode}
        unoptimized
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={`object-cover transition-transform duration-300 ease-out group-hover:scale-105 ${
          fillMode ? 'w-full h-full' : ''
        }`}
        onError={() => setHasError(true)}
        sizes={
          size === 'hero'
            ? '100vw'
            : size === 'card'
              ? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 400px'
              : '200px'
        }
      />

      {/* Photo credit overlay */}
      {panda.photoCredit && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs leading-relaxed pointer-events-none select-none">
          📷 {panda.photoCredit}
        </div>
      )}
    </div>
  )
}
