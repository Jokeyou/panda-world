'use client'

import { useMemo } from 'react'
import pandas from '@/data/pandas.json'
import BirthdayCard from '@/components/BirthdayCard'
import { useTranslation, type Lang } from '@/lib/i18n'
import { Cake, ChevronDown } from 'lucide-react'
import { useState } from 'react'

// ─── Birthday helpers ──────────────────────────────────────────

interface BirthdayInfo {
  month: number       // 1-12
  day: number
  age: number | null
  daysUntil: number
  isToday: boolean
  birthDateRaw: string
  birthDateValid: boolean
}

function parseBirthDate(raw: string): { month: number; day: number; year: number } | null {
  if (!raw || typeof raw !== 'string') return null

  // Try standard YYYY-MM-DD
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (match) {
    const year = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    const day = parseInt(match[3], 10)
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return { month, day, year }
    }
  }

  // Try to extract YYYY-MM-DD from Chinese mixed text
  const looseMatch = raw.match(/(\d{4})[年-](\d{1,2})[月-](\d{1,2})/)
  if (looseMatch) {
    const year = parseInt(looseMatch[1], 10)
    const month = parseInt(looseMatch[2], 10)
    const day = parseInt(looseMatch[3], 10)
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return { month, day, year }
    }
  }

  return null
}

function getDaysUntilNextBirthday(month: number, day: number): { daysUntil: number; isToday: boolean } {
  const today = new Date()
  const todayMonth = today.getMonth() + 1
  const todayDay = today.getDate()

  // Check if today is the birthday
  if (todayMonth === month && todayDay === day) {
    return { daysUntil: 0, isToday: true }
  }

  // This year's birthday
  const thisYearBirthday = new Date(today.getFullYear(), month - 1, day)

  // If this year's birthday has passed, use next year
  const targetDate =
    thisYearBirthday < today
      ? new Date(today.getFullYear() + 1, month - 1, day)
      : thisYearBirthday

  const diffMs = targetDate.getTime() - today.getTime()
  const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  return { daysUntil, isToday: false }
}

function computeAge(birthYear: number, birthMonth: number, birthDay: number): number {
  const today = new Date()
  let age = today.getFullYear() - birthYear
  const m = today.getMonth() + 1 - birthMonth
  if (m < 0 || (m === 0 && today.getDate() < birthDay)) {
    age--
  }
  return age
}

// ─── Grouped panda type ────────────────────────────────────────

interface GroupedPanda {
  id: string
  name: string
  nameEn: string
  personality: string[]
  claimToFame: string
  tags: string[]
  gender: string
  birthday: BirthdayInfo
}

// ─── Month section component ──────────────────────────────────

function MonthSection({
  month,
  pandas: monthPandas,
  lang,
}: {
  month: number
  pandas: GroupedPanda[]
  lang: Lang
}) {
  const { t } = useTranslation()
  const monthKey = String(month) as keyof typeof t extends (k: infer K) => string
    ? never
    : string
  const monthLabel = t(`birthdays.monthLabels.${month}`)
  const [collapsed, setCollapsed] = useState(false)

  const hasToday = monthPandas.some((p) => p.birthday.isToday)

  return (
    <section className="mb-8">
      {/* Month header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between gap-3 mb-4 group"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-panda-800 dark:text-panda-100">
            {monthLabel}
          </h2>
          <span className="text-sm text-panda-400 dark:text-panda-500 bg-panda-100/60 dark:bg-panda-700/60 px-2.5 py-0.5 rounded-full">
            {monthPandas.length}
          </span>
          {hasToday && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full animate-pulse">
              🎂
            </span>
          )}
        </div>
        <ChevronDown
          size={20}
          className={`text-panda-400 transition-transform duration-200 ${
            collapsed ? '-rotate-90' : ''
          }`}
        />
      </button>

      {/* Panda cards */}
      {!collapsed && (
        <>
          {monthPandas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {monthPandas.map((p) => (
                <BirthdayCard
                  key={p.id}
                  panda={{
                    id: p.id,
                    name: p.name,
                    nameEn: p.nameEn,
                    personality: p.personality,
                    claimToFame: p.claimToFame,
                    tags: p.tags,
                    gender: p.gender,
                  }}
                  birthday={p.birthday}
                  lang={lang}
                />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Cake size={40} className="mx-auto text-panda-300 dark:text-panda-600 mb-3" />
              <p className="text-panda-400 dark:text-panda-500 text-sm">
                {t('birthdays.noBirthday')}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  )
}

// ─── Main component ────────────────────────────────────────────

export default function BirthdaysContent({ lang }: { lang: Lang }) {
  const { t } = useTranslation()

  // Process all pandas: parse birthdays, group by month
  const { grouped, unknownBirthdays } = useMemo(() => {
    const grouped: Map<number, GroupedPanda[]> = new Map()
    for (let m = 1; m <= 12; m++) grouped.set(m, [])
    const unknown: GroupedPanda[] = []

    for (const p of pandas) {
      const raw = (p as any).birthDate as string | undefined

      if (!raw) {
        unknown.push({
          id: p.id,
          name: p.name,
          nameEn: p.nameEn,
          personality: p.personality,
          claimToFame: p.claimToFame,
          tags: p.tags,
          gender: p.gender,
          birthday: {
            month: 0,
            day: 0,
            age: null,
            daysUntil: -1,
            isToday: false,
            birthDateRaw: '',
            birthDateValid: false,
          },
        })
        continue
      }

      const parsed = parseBirthDate(raw)

      if (!parsed) {
        unknown.push({
          id: p.id,
          name: p.name,
          nameEn: p.nameEn,
          personality: p.personality,
          claimToFame: p.claimToFame,
          tags: p.tags,
          gender: p.gender,
          birthday: {
            month: 0,
            day: 0,
            age: null,
            daysUntil: -1,
            isToday: false,
            birthDateRaw: raw,
            birthDateValid: false,
          },
        })
        continue
      }

      const { daysUntil, isToday } = getDaysUntilNextBirthday(parsed.month, parsed.day)
      const age = computeAge(parsed.year, parsed.month, parsed.day)

      const entry: GroupedPanda = {
        id: p.id,
        name: p.name,
        nameEn: p.nameEn,
        personality: p.personality,
        claimToFame: p.claimToFame,
        tags: p.tags,
        gender: p.gender,
        birthday: {
          month: parsed.month,
          day: parsed.day,
          age,
          daysUntil,
          isToday,
          birthDateRaw: raw,
          birthDateValid: true,
        },
      }

      grouped.get(parsed.month)!.push(entry)
    }

    // Sort each month by day of month
    grouped.forEach((pandas) => {
      pandas.sort((a, b) => a.birthday.day - b.birthday.day)
    })

    return { grouped, unknownBirthdays: unknown }
  }, [])

  // Count total with valid birthdays
  const totalValid = useMemo(() => {
    let count = 0
    grouped.forEach((pandas) => {
      count += pandas.length
    })
    return count
  }, [grouped])

  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-panda-800 dark:text-panda-100 mb-3">
          {t('birthdays.title')}
        </h1>
        <p className="text-panda-500 dark:text-panda-400 max-w-lg mx-auto text-sm sm:text-base">
          {t('birthdays.subtitle')}
        </p>
        <p className="text-xs text-panda-400 dark:text-panda-500 mt-2">
          {totalValid} {lang === 'en' ? 'pandas tracked' : '只熊猫已收录'}
          {unknownBirthdays.length > 0 &&
            ` · ${unknownBirthdays.length} ${lang === 'en' ? 'unknown' : '只生日未知'}`}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10 text-xs">
        <span className="inline-flex items-center gap-1.5 text-panda-500 dark:text-panda-400">
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          {t('birthdays.legend.today')}
        </span>
        <span className="inline-flex items-center gap-1.5 text-panda-500 dark:text-panda-400">
          <span className="w-3 h-3 rounded-full bg-bamboo-400" />
          {t('birthdays.legend.thisMonth')}
        </span>
        <span className="inline-flex items-center gap-1.5 text-panda-500 dark:text-panda-400">
          <span className="w-3 h-3 rounded-full bg-panda-300 dark:bg-panda-600" />
          {t('birthdays.legend.upcoming')}
        </span>
      </div>

      {/* Month sections */}
      {months.map((month) => (
        <MonthSection
          key={month}
          month={month}
          pandas={grouped.get(month) || []}
          lang={lang}
        />
      ))}

      {/* Unknown birthdays section */}
      {unknownBirthdays.length > 0 && (
        <section className="mt-12 pt-8 border-t border-panda-200 dark:border-panda-700">
          <h2 className="text-lg font-semibold text-panda-500 dark:text-panda-400 mb-4 text-center">
            {t('birthdays.unknownBirthDate')} ({unknownBirthdays.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 opacity-60">
            {unknownBirthdays.map((p) => (
              <BirthdayCard
                key={p.id}
                panda={{
                  id: p.id,
                  name: p.name,
                  nameEn: p.nameEn,
                  personality: p.personality,
                  claimToFame: p.claimToFame,
                  tags: p.tags,
                  gender: p.gender,
                }}
                birthday={p.birthday}
                lang={lang}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
