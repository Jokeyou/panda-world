'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Camera, BookOpen, ArrowRight, Sparkles, ChevronDown } from 'lucide-react'

// ===== Animation Variants =====
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.8 + i * 0.15, duration: 0.5 },
  }),
}

// ===== Background bamboo leaves (static positions, CSS animated) =====
function BambooLeaves() {
  const leaves = ['🍃', '🌿', '🎋', '🍃', '🌿', '🍃', '🎋', '🌿', '🍃', '🌿']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {leaves.map((leaf, i) => (
        <span
          key={i}
          className="leaf-enhanced absolute text-2xl opacity-0"
          style={{
            left: `${5 + i * 9.5}%`,
            top: `${-5 + (i % 3) * 12}%`,
            animationDelay: `${i * 1.7}s`,
            animationDuration: `${10 + i * 1.5}s`,
            fontSize: `${1.5 + Math.random() * 1.5}rem`,
          }}
        >
          {leaf}
        </span>
      ))}
    </div>
  )
}

// ===== Floating panda silhouettes =====
function PandaSilhouettes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Large faint panda silhouette */}
      <div
        className="panda-silhouette absolute opacity-[0.04] text-[20rem] select-none"
        style={{ right: '-5%', top: '10%', animationDelay: '0s' }}
      >
        🐼
      </div>
      {/* Smaller one */}
      <div
        className="panda-silhouette absolute opacity-[0.03] text-[12rem] select-none"
        style={{ left: '-3%', bottom: '15%', animationDelay: '2s' }}
      >
        🐼
      </div>
      {/* Tiny accent */}
      <div
        className="panda-silhouette absolute opacity-[0.05] text-[6rem] select-none"
        style={{ left: '60%', top: '60%', animationDelay: '4s' }}
      >
        🎋
      </div>
    </div>
  )
}

// ===== Animated counter (for stats) =====
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (value === 0) return
    const steps = 30
    const increment = value / steps
    const stepDuration = (duration * 1000) / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(increment * step), value)
      setCount(current)
      if (step >= steps) clearInterval(timer)
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

// ===== Props =====
interface HeroSectionProps {
  liveCount: number
  pandaCount: number
  familyCount: number
}

export default function HeroSection({ liveCount, pandaCount, familyCount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* === Background Layers === */}
      {/* Base gradient */}
      <div className="absolute inset-0 gradient-hero-enhanced" />

      {/* Bamboo SVG pattern overlay */}
      <div className="absolute inset-0 bamboo-pattern opacity-40" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      {/* Floating panda silhouettes */}
      <PandaSilhouettes />

      {/* Falling bamboo leaves */}
      <BambooLeaves />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* === Content === */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 relative z-10 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div variants={fadeInScale}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-bamboo-200/60 shadow-sm mb-8
                           dark:bg-panda-800/70 dark:border-panda-700/60">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-bamboo-700 tracking-wide dark:text-bamboo-300">
                {liveCount} 路直播在线 · {pandaCount} 只明星熊猫
              </span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-panda-900
                       leading-[1.05] tracking-tight dark:text-panda-100"
          >
            <span className="inline-block">看遍全世界的</span>
            <br />
            <span className="inline-block hero-title-gradient mt-2">
              大熊猫
            </span>
            <span className="inline-block ml-2 sm:ml-3 animate-float text-4xl sm:text-5xl md:text-7xl lg:text-8xl">
              🐼
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 sm:mt-8 text-lg sm:text-xl text-panda-500 leading-relaxed max-w-xl dark:text-panda-300"
          >
            全球首个大熊猫直播聚合平台。一次看遍成都、华盛顿、爱丁堡、莫斯科的熊猫。
          </motion.p>

          {/* Tagline pills */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mt-4">
            {['📡 看直播', '📖 识熊猫', '🧠 做测试', '🌳 画族谱'].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                           bg-white/60 backdrop-blur-sm border border-panda-100/60
                           text-sm font-medium text-panda-600
                           dark:bg-panda-800/60 dark:border-panda-700/60 dark:text-panda-300"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/live"
              className="hero-cta-primary group inline-flex items-center gap-3 text-lg px-8 py-4
                         rounded-2xl font-bold bg-panda-900 text-white
                         hover:shadow-2xl hover:shadow-panda-900/25 hover:-translate-y-0.5
                         active:translate-y-0 transition-all duration-300"
            >
              <Camera size={20} className="group-hover:scale-110 transition-transform" />
              看全球直播
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/pandas"
              className="hero-cta-secondary group inline-flex items-center gap-3 text-lg px-8 py-4
                         rounded-2xl font-semibold
                         bg-white/80 backdrop-blur-xl border-2 border-panda-200 text-panda-800
                         hover:border-panda-400 hover:bg-white hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0 transition-all duration-300
                         dark:bg-panda-800/80 dark:border-panda-600 dark:text-panda-100
                         dark:hover:border-panda-500 dark:hover:bg-panda-700"
            >
              <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
              探索熊猫图鉴
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div className="flex gap-6 sm:gap-10 md:gap-16 mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-panda-200/40 dark:border-panda-700/40">
            {[
              { value: pandaCount, label: '收录熊猫', icon: '🐼' },
              { value: liveCount, label: '全球直播源', icon: '📡' },
              { value: familyCount, label: '熊猫家族', icon: '🌳' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={statVariants}
                className="group cursor-default"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-panda-900 tabular-nums dark:text-panda-100">
                    <AnimatedCounter value={stat.value} />
                  </span>
                  <span className="text-xl opacity-50 group-hover:opacity-100 transition-opacity">
                    {stat.icon}
                  </span>
                </div>
                <span className="text-sm font-medium text-panda-400 mt-0.5 block dark:text-panda-500">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <ChevronDown
          size={24}
          className="text-panda-300 dark:text-panda-600 animate-bounce-soft"
          strokeWidth={1.5}
        />
      </motion.div>
    </section>
  )
}
