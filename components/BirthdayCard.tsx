'use client'

import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import PandaAvatar from './PandaAvatar'
import type { Lang } from '@/lib/i18n'
import { useTranslation } from '@/lib/i18n'

interface PandaBirthdayData {
  id: string
  name: string
  nameEn: string
  personality: string[]
  claimToFame: string
  tags: string[]
  gender: string
}

interface BirthdayInfo {
  age: number | null
  daysUntil: number
  isToday: boolean
  birthDateRaw: string
  birthDateValid: boolean
}

export default function BirthdayCard({
  panda,
  birthday,
  lang,
}: {
  panda: PandaBirthdayData
  birthday: BirthdayInfo
  lang: Lang
}) {
  const { t } = useTranslation()

  const name = lang === 'en' && panda.nameEn ? panda.nameEn : panda.name

  return (
    <Link
      href={lang === 'en' ? `/en/pandas/${panda.id}` : `/pandas/${panda.id}`}
      className="group"
    >
      <div
        className={`
          relative card p-4 sm:p-5 transition-all duration-300
          hover:shadow-lg hover:-translate-y-1
          ${birthday.isToday
            ? 'ring-2 ring-warm-300 dark:ring-amber-500/50 bg-gradient-to-b from-amber-50/50 to-cream dark:from-amber-900/10 dark:to-panda-800/30'
            : 'hover:bg-panda-50/50 dark:hover:bg-panda-800/30'
          }
        `}
      >
        {/* Today badge */}
        {birthday.isToday && (
          <div className="absolute -top-2 -right-2 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-900 shadow-md animate-bounce-soft">
              🎉 {t('birthdays.today')}
            </span>
          </div>
        )}

        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24">
            <PandaAvatar data={panda} size={96} />
          </div>
        </div>

        {/* Name */}
        <h3 className="text-center font-semibold text-panda-800 dark:text-panda-100 text-base mb-1 truncate">
          {name}
        </h3>
        {lang === 'zh' && panda.nameEn && (
          <p className="text-center text-xs text-panda-400 dark:text-panda-500 truncate mb-2">
            {panda.nameEn}
          </p>
        )}

        {/* Birthday info */}
        <div className="flex items-center justify-center gap-3 mt-2 text-sm">
          {birthday.birthDateValid ? (
            <>
              {/* Age */}
              {birthday.age !== null && (
                <span className="inline-flex items-center gap-1 text-panda-500 dark:text-panda-400">
                  <Calendar size={13} />
                  {t('birthdays.age', { age: birthday.age })}
                </span>
              )}

              {/* Days until next birthday */}
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  birthday.isToday
                    ? 'text-amber-600 dark:text-amber-400'
                    : birthday.daysUntil <= 30
                      ? 'text-bamboo-600 dark:text-bamboo-400'
                      : 'text-panda-500 dark:text-panda-400'
                }`}
              >
                <Clock size={13} />
                {birthday.isToday
                  ? t('birthdays.today')
                  : t('birthdays.daysUntil', { count: birthday.daysUntil })}
              </span>
            </>
          ) : (
            <span className="text-panda-400 dark:text-panda-500 text-xs italic">
              {t('birthdays.unknownBirthDate')}
            </span>
          )}
        </div>

        {/* Claim to fame preview */}
        <p className="text-center text-xs text-panda-400 dark:text-panda-500 mt-2 line-clamp-1">
          {lang === 'en' ? panda.claimToFame : panda.claimToFame}
        </p>
      </div>
    </Link>
  )
}
