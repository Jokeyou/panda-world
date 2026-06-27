'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

// ============================================================
// Types
// ============================================================

export interface GalleryItem {
  url: string
  credit: string
}

interface PhotoGalleryDict {
  photoGallery: string
  photoGalleryEmpty: string
  photoGalleryClose: string
  photoGalleryPrev: string
  photoGalleryNext: string
}

interface PhotoGalleryProps {
  gallery: GalleryItem[]
  dict: PhotoGalleryDict
}

// ============================================================
// Blur placeholder
// ============================================================

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsM' +
  'DQ4SEA4OEREMDRIQERURExYWFxYWGhoaGhsbGxsbGxsbGz/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAA' +
  'Cf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q=='

// ============================================================
// Component
// ============================================================

export default function PhotoGallery({ gallery, dict }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // ============================================================
  // Empty state
  // ============================================================

  if (!gallery || gallery.length === 0) {
    return (
      <div className="card p-5 md:p-6 mb-8">
        <h2 className="text-lg md:text-xl font-bold text-panda-900 dark:text-panda-100 mb-4">
          {dict.photoGallery}
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-panda-400">
          <span className="text-4xl mb-3">📸</span>
          <p className="text-sm">{dict.photoGalleryEmpty}</p>
        </div>
      </div>
    )
  }

  // ============================================================
  // Scroll handling
  // ============================================================

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current
    if (!el) return
    const child = el.children[index] as HTMLElement
    if (!child) return
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: 'smooth' })
  }, [])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const scrollLeft = el.scrollLeft
    const children = Array.from(el.children) as HTMLElement[]
    let closest = 0
    let minDist = Infinity
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - el.offsetLeft - scrollLeft)
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    })
    setActiveIndex(closest)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // ============================================================
  // Navigation
  // ============================================================

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, gallery.length - 1))
    setActiveIndex(clamped)
    scrollToIndex(clamped)
  }, [gallery.length, scrollToIndex])

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  // ============================================================
  // Touch / swipe
  // ============================================================

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50
    if (diff > threshold) goNext()
    else if (diff < -threshold) goPrev()
  }, [goPrev, goNext])

  // ============================================================
  // Lightbox
  // ============================================================

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }, [])

  const lightboxPrev = useCallback(() => {
    setLightboxIndex(i => (i > 0 ? i - 1 : gallery.length - 1))
  }, [gallery.length])

  const lightboxNext = useCallback(() => {
    setLightboxIndex(i => (i < gallery.length - 1 ? i + 1 : 0))
  }, [gallery.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') lightboxPrev()
      if (e.key === 'ArrowRight') lightboxNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, closeLightbox, lightboxPrev, lightboxNext])

  // ============================================================
  // Render
  // ============================================================

  return (
    <>
      <div className="card p-5 md:p-6 mb-8">
        <h2 className="text-lg md:text-xl font-bold text-panda-900 dark:text-panda-100 mb-4">
          {dict.photoGallery}
        </h2>

        {/* Scrollable strip */}
        <div className="relative group/gallery">
          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-2"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {gallery.map((item, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="flex-shrink-0 w-[280px] sm:w-[320px] h-[200px] sm:h-[220px] relative snap-center overflow-hidden rounded-xl
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-500
                           group/item cursor-pointer"
              >
                <Image
                  src={item.url}
                  alt={`Gallery ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 ease-out group-hover/item:scale-105"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes="(max-width: 640px) 280px, 320px"
                  onError={(e) => {
                    // Hide broken image, show fallback
                    const el = e.currentTarget
                    el.style.display = 'none'
                    const parent = el.parentElement
                    if (parent) {
                      const fb = parent.querySelector('[data-fallback]') as HTMLElement
                      if (fb) fb.style.display = 'flex'
                    }
                  }}
                />
                {/* Fallback for broken images */}
                <div
                  data-fallback
                  className="absolute inset-0 hidden items-center justify-center bg-cream dark:bg-panda-800 text-4xl"
                >
                  🐾
                </div>
                {/* Credit overlay */}
                {item.credit && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs leading-relaxed pointer-events-none">
                    📷 {item.credit}
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors duration-200 pointer-events-none" />
              </button>
            ))}
          </div>

          {/* Left arrow */}
          {gallery.length > 1 && activeIndex > 0 && (
            <button
              onClick={goPrev}
              aria-label={dict.photoGalleryPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                         bg-white/90 dark:bg-panda-800/90 shadow-lg
                         flex items-center justify-center
                         text-panda-700 dark:text-panda-200
                         opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200
                         hover:bg-white dark:hover:bg-panda-700
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-500"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Right arrow */}
          {gallery.length > 1 && activeIndex < gallery.length - 1 && (
            <button
              onClick={goNext}
              aria-label={dict.photoGalleryNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                         bg-white/90 dark:bg-panda-800/90 shadow-lg
                         flex items-center justify-center
                         text-panda-700 dark:text-panda-200
                         opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200
                         hover:bg-white dark:hover:bg-panda-700
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-500"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Dot indicators */}
        {gallery.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none
                  ${i === activeIndex
                    ? 'bg-bamboo-500 w-5'
                    : 'bg-panda-200 dark:bg-panda-700 hover:bg-bamboo-400'
                  }`}
              />
            ))}
          </div>
        )}

        {/* Image counter */}
        <div className="text-center text-xs text-panda-400 mt-2">
          {activeIndex + 1} / {gallery.length}
        </div>
      </div>

      {/* ============================================================ */}
      {/* Lightbox */}
      {/* ============================================================ */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label={dict.photoGalleryClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full
                       bg-white/10 hover:bg-white/20
                       flex items-center justify-center
                       text-white transition-colors
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={24} />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-10 text-white/80 text-sm">
            {lightboxIndex + 1} / {gallery.length}
          </div>

          {/* Prev button */}
          {gallery.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxPrev() }}
              aria-label={dict.photoGalleryPrev}
              className="absolute left-4 z-10 w-12 h-12 rounded-full
                         bg-white/10 hover:bg-white/20
                         flex items-center justify-center
                         text-white transition-colors
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Next button */}
          {gallery.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxNext() }}
              aria-label={dict.photoGalleryNext}
              className="absolute right-4 z-10 w-12 h-12 rounded-full
                         bg-white/10 hover:bg-white/20
                         flex items-center justify-center
                         text-white transition-colors
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallery[lightboxIndex].url}
              alt={`Gallery ${lightboxIndex + 1}`}
              fill
              unoptimized
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Credit */}
          {gallery[lightboxIndex].credit && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm backdrop-blur-sm">
              📷 {gallery[lightboxIndex].credit}
            </div>
          )}

          {/* Dot indicators in lightbox */}
          {gallery.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  aria-label={`${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200
                    ${i === lightboxIndex
                      ? 'bg-white w-4'
                      : 'bg-white/40 hover:bg-white/70'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
