'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function FunFactsCarousel({ facts }: { facts: string[] }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

  const length = facts?.length || 0

  const goTo = useCallback((index: number) => {
    if (length === 0) return
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current, length])

  const next = useCallback(() => {
    if (length === 0) return
    setDirection(1)
    setCurrent(prev => (prev + 1) % length)
  }, [length])

  const prev = useCallback(() => {
    if (length === 0) return
    setDirection(-1)
    setCurrent(prev => (prev - 1 + length) % length)
  }, [length])

  // Auto-play every 5 seconds
  useEffect(() => {
    if (length === 0) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, length])

  if (!facts || facts.length === 0) return null

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-xl font-bold text-panda-900 mb-4">💡 冷知识</h2>

      {/* Carousel */}
      <div className="relative overflow-hidden min-h-[80px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex items-center gap-4 px-2"
          >
            {/* Number badge */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bamboo-100 text-bamboo-600
                            flex items-center justify-center text-sm font-bold">
              {current + 1}
            </div>
            <p className="text-panda-700 leading-relaxed">{facts[current]}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-600
                     flex items-center justify-center transition-colors"
          aria-label="上一条"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {facts.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-bamboo-600 w-6'
                  : 'bg-bamboo-200 hover:bg-bamboo-300'
              }`}
              aria-label={`第 ${i + 1} 条`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-9 h-9 rounded-full bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-600
                     flex items-center justify-center transition-colors"
          aria-label="下一条"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
