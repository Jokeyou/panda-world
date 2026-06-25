'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import pandas from '@/data/pandas.json'
import PandaAvatar from '@/components/PandaAvatar'
import { useTranslation } from '@/lib/i18n'
import { Search, Filter, MapPin, Calendar, Tag, ArrowUpDown } from 'lucide-react'

const allTags = Array.from(new Set(pandas.flatMap(p => p.tags))).sort()

type SortKey = 'default' | 'name' | 'age' | 'location'

function getAge(birthDate: string): number | null {
  try {
    const birth = new Date(birthDate)
    if (isNaN(birth.getTime())) return null
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    const m = now.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
    return age
  } catch {
    return null
  }
}

// ─── Skeleton Card ───────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card p-4 sm:p-5 animate-pulse">
      {/* Avatar placeholder */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-full bg-panda-100/60 dark:bg-panda-700/60" />
      {/* Name placeholder */}
      <div className="h-6 w-20 mx-auto rounded-lg bg-panda-100/60 dark:bg-panda-700/60 mb-2" />
      {/* Subtitle placeholder */}
      <div className="h-3.5 w-24 mx-auto rounded bg-panda-50/80 dark:bg-panda-700/80 mb-3" />
      {/* Tags placeholder */}
      <div className="flex justify-center gap-1.5">
        <div className="h-5 w-12 rounded-full bg-panda-50/80 dark:bg-panda-700/80" />
        <div className="h-5 w-14 rounded-full bg-panda-50/80 dark:bg-panda-700/80" />
        <div className="h-5 w-10 rounded-full bg-panda-50/80 dark:bg-panda-700/80" />
      </div>
      {/* Description placeholder */}
      <div className="space-y-1.5 mt-3">
        <div className="h-3 rounded bg-panda-50/80 dark:bg-panda-700/80 w-full" />
        <div className="h-3 rounded bg-panda-50/80 dark:bg-panda-700/80 w-3/4 mx-auto" />
      </div>
    </div>
  )
}

// ─── Page Component ──────────────────────────────────────────
export default function PandasContent() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [genderFilter, setGenderFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>('default')
  const [isLoading, setIsLoading] = useState(true)

  // ─── Sort Options (computed for i18n) ─────────────────────
  const sortOptions = useMemo<{ key: SortKey; label: string; icon: React.ReactNode }[]>(() => [
    { key: 'default', label: t('pandas.sortDefault'), icon: <ArrowUpDown size={14} /> },
    { key: 'name', label: t('pandas.sortByName'), icon: <Tag size={14} /> },
    { key: 'age', label: t('pandas.sortByAge'), icon: <Calendar size={14} /> },
    { key: 'location', label: t('pandas.sortByLocation'), icon: <MapPin size={14} /> },
  ], [t])

  // Simulate initial loading for skeleton screen
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  // Filter
  let filtered = pandas.filter(p => {
    if (search && !p.name.includes(search) && !p.nameEn?.toLowerCase().includes(search.toLowerCase()) && !p.nicknames.some(n => n.includes(search))) return false
    if (activeTag && !p.tags.includes(activeTag)) return false
    if (genderFilter && p.gender !== genderFilter) return false
    return true
  })

  // Sort
  if (sortBy === 'name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
  } else if (sortBy === 'age') {
    filtered = [...filtered].sort((a, b) => {
      const aTime = new Date(a.birthDate).getTime()
      const bTime = new Date(b.birthDate).getTime()
      if (isNaN(aTime) && isNaN(bTime)) return 0
      if (isNaN(aTime)) return 1
      if (isNaN(bTime)) return -1
      return aTime - bTime // oldest (earliest birth) first
    })
  } else if (sortBy === 'location') {
    filtered = [...filtered].sort((a, b) => a.currentHome.localeCompare(b.currentHome, 'zh'))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-panda-900 dark:text-panda-100">
          {t('pandas.title')}
        </h1>
        <p className="mt-3 text-lg text-panda-500 dark:text-panda-300">
          {t('pandas.description', { count: pandas.length })}
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-panda-400 dark:text-panda-500" />
          <input
            type="text"
            placeholder={t('pandas.searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-panda-200 bg-panda-50/50
                       focus:outline-none focus:border-bamboo-400 focus:ring-2 focus:ring-bamboo-100
                       text-panda-900 placeholder-panda-400 transition-all
                       dark:border-panda-600 dark:bg-panda-800/70 dark:text-panda-100
                       dark:placeholder:text-panda-500 dark:focus:border-bamboo-500 dark:focus:ring-bamboo-500/30"
          />
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`tag text-sm ${!activeTag ? 'bg-panda-900 text-white dark:bg-panda-100 dark:text-panda-900' : 'bg-panda-100 text-panda-600 hover:bg-panda-200 dark:bg-panda-800 dark:text-panda-300 dark:hover:bg-panda-700'}`}
          >
            {t('pandas.allTags')}
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`tag text-sm transition-all ${
                tag === activeTag
                  ? 'bg-bamboo-600 text-white dark:bg-bamboo-500'
                  : 'bg-panda-100 text-panda-600 hover:bg-panda-200 dark:bg-panda-800 dark:text-panda-300 dark:hover:bg-panda-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Gender filter */}
        <div className="flex gap-2">
          {[null, 'male', 'female'].map(g => (
            <button
              key={g ?? 'all'}
              onClick={() => setGenderFilter(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                genderFilter === g
                  ? 'bg-panda-900 text-white dark:bg-panda-100 dark:text-panda-900'
                  : 'bg-panda-50 text-panda-500 hover:bg-panda-100 dark:bg-panda-800 dark:text-panda-300 dark:hover:bg-panda-700'
              }`}
            >
              {g === null ? t('pandas.allGender') : g === 'male' ? t('pandas.male') : t('pandas.female')}
            </button>
          ))}
        </div>
      </div>

      {/* Sort buttons */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-panda-400 dark:text-panda-400 mr-1 hidden sm:inline">{t('pandas.sortLabel')}</span>
        {sortOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              sortBy === opt.key
                ? 'bg-bamboo-600 text-white shadow-sm dark:bg-bamboo-500'
                : 'bg-white text-panda-500 hover:bg-panda-50 hover:text-panda-700 border border-panda-200/60 dark:bg-panda-800 dark:text-panda-300 dark:hover:bg-panda-700 dark:hover:text-panda-200 dark:border-panda-700'
            }`}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* ─── Empty State ─────────────────────────────── */
        <div className="text-center py-16 md:py-20">
          {/* Panda illustration */}
          <div className="relative w-44 h-44 mx-auto mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Bamboo stalks */}
              <rect x={28} y={30} width={5} height={130} rx={2.5} fill="#C8E6C0" />
              <rect x={55} y={10} width={5} height={150} rx={2.5} fill="#B8D8A8" />
              <rect x={140} y={25} width={5} height={135} rx={2.5} fill="#C8E6C0" />
              <rect x={168} y={45} width={5} height={110} rx={2.5} fill="#B8D8A8" />
              {/* Bamboo leaves */}
              <ellipse cx={30} cy={35} rx={10} ry={3.5} fill="#A8D194" transform="rotate(-25, 30, 35)" />
              <ellipse cx={57} cy={15} rx={11} ry={3.5} fill="#A8D194" transform="rotate(18, 57, 15)" />
              <ellipse cx={142} cy={30} rx={9} ry={3} fill="#A8D194" transform="rotate(-15, 142, 30)" />

              {/* Body */}
              <ellipse cx={100} cy={135} rx={38} ry={34} fill="white" stroke="#E0DDD5" strokeWidth={1.2} />
              {/* Head */}
              <circle cx={100} cy={88} r={30} fill="white" stroke="#E0DDD5" strokeWidth={1.2} />
              {/* Ears */}
              <circle cx={74} cy={64} r={13} fill="#1A1A1A" />
              <circle cx={126} cy={64} r={13} fill="#1A1A1A" />
              <circle cx={74} cy={64} r={5} fill="#3A3A3A" opacity={0.3} />
              <circle cx={126} cy={64} r={5} fill="#3A3A3A" opacity={0.3} />
              {/* Eye patches */}
              <ellipse cx={86} cy={84} rx={13} ry={10} fill="#1A1A1A" transform="rotate(-6, 86, 84)" />
              <ellipse cx={114} cy={84} rx={13} ry={10} fill="#1A1A1A" transform="rotate(6, 114, 84)" />
              {/* Eyes — slightly worried */}
              <circle cx={87} cy={82} r={4} fill="white" opacity={0.9} />
              <circle cx={113} cy={82} r={4} fill="white" opacity={0.9} />
              <circle cx={87.5} cy={83} r={2.2} fill="#1A1A1A" />
              <circle cx={112.5} cy={83} r={2.2} fill="#1A1A1A" />
              {/* Worried eyebrows */}
              <line x1={76} y1={75} x2={93} y2={77} stroke="#1A1A1A" strokeWidth={1.8} strokeLinecap="round" />
              <line x1={124} y1={75} x2={107} y2={77} stroke="#1A1A1A" strokeWidth={1.8} strokeLinecap="round" />
              {/* Nose */}
              <ellipse cx={100} cy={94} rx={5.5} ry={4} fill="#1A1A1A" />
              <ellipse cx={98} cy={92.5} rx={2} ry={1} fill="#4A4A4A" />
              {/* Mouth — slight frown */}
              <path d="M93,104 Q100,99 107,104" fill="none" stroke="#1A1A1A" strokeWidth={1.5} strokeLinecap="round" />
              {/* Blush */}
              <ellipse cx={72} cy={94} rx={8} ry={5} fill="#FFB5B5" opacity={0.28} />
              <ellipse cx={128} cy={94} rx={8} ry={5} fill="#FFB5B5" opacity={0.28} />
              {/* Arms */}
              <ellipse cx={62} cy={125} rx={14} ry={10} fill="#1A1A1A" transform="rotate(15, 62, 125)" />
              <ellipse cx={138} cy={125} rx={14} ry={10} fill="#1A1A1A" transform="rotate(-15, 138, 125)" />
              {/* Legs */}
              <ellipse cx={82} cy={165} rx={16} ry={11} fill="#1A1A1A" />
              <ellipse cx={118} cy={165} rx={16} ry={11} fill="#1A1A1A" />

              {/* Question marks */}
              <text x={148} y={58} fontSize={20} fill="#B0C8A0" fontWeight="bold" opacity={0.55}>?</text>
              <text x={42} y={48} fontSize={15} fill="#B0C8A0" fontWeight="bold" opacity={0.35}>?</text>

              {/* Small magnifying glass */}
              <g transform="translate(148, 120)" opacity={0.45}>
                <circle cx={0} cy={0} r={9} fill="none" stroke="#A0B890" strokeWidth={2.5} />
                <line x1={6} y1={6} x2={14} y2={14} stroke="#A0B890" strokeWidth={2.5} strokeLinecap="round" />
              </g>
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-panda-400 dark:text-panda-300 mb-1">
            {t('pandas.emptyTitle')}
          </h2>
          <p className="text-panda-400 dark:text-panda-400">{t('pandas.emptyDesc')}</p>
        </div>
      ) : (
        /* ─── Grid ────────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map(panda => (
            <Link
              key={panda.id}
              href={`/pandas/${panda.id}`}
              className="card p-4 sm:p-5 group block hover:-translate-y-1.5 hover:shadow-xl"
            >
              {/* Avatar — smooth scale on hover */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 transition-transform duration-500 ease-out group-hover:scale-110">
                <PandaAvatar data={panda} size={112} />
              </div>

              {/* Name */}
              <h3 className="text-lg sm:text-xl font-bold text-center text-panda-900 group-hover:text-bamboo-700 dark:text-panda-100 dark:group-hover:text-bamboo-400 transition-colors duration-300">
                {panda.name}
                <span className="text-sm font-normal text-panda-400 dark:text-panda-400 ml-1.5">{panda.nameEn}</span>
              </h3>

              {/* Gender & Location */}
              <div className="flex items-center justify-center gap-3 mt-2 text-xs sm:text-xs text-panda-400 dark:text-panda-400">
                <span>{panda.gender === 'male' ? '♂' : '♀'}</span>
                <span>·</span>
                <span>{panda.birthPlace}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-1 mt-3">
                {panda.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="tag-green text-xs">{tag}</span>
                ))}
              </div>

              {/* Claim */}
              <p className="text-xs sm:text-sm text-panda-500 dark:text-panda-300 text-center mt-3 leading-relaxed line-clamp-2">
                {panda.claimToFame}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
