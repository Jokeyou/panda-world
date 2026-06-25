'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Camera, BookOpen, Network, Sparkles, ArrowRight, MapPin, Eye } from 'lucide-react'
import streams from '@/data/streams.json'
import pandas from '@/data/pandas.json'
import PandaAvatar from '@/components/PandaAvatar'
import { useTranslation } from '@/lib/i18n'

const HeroSection = dynamic(() => import('@/components/HeroSection'), {
  loading: () => (
    <section className="gradient-hero-enhanced py-16 sm:py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-pulse">
        <div className="h-8 sm:h-10 w-56 sm:w-80 mx-auto rounded-xl bg-panda-100/40 mb-4 sm:mb-6" />
        <div className="h-5 sm:h-6 w-64 sm:w-96 mx-auto rounded-lg bg-panda-50/50 mb-8 sm:mb-10" />
        <div className="flex justify-center gap-4 sm:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 w-20 sm:h-16 sm:w-24 rounded-2xl bg-white/40" />
          ))}
        </div>
      </div>
    </section>
  ),
})

const featuredPandas = pandas.filter(p => ['hua-hua', 'meng-lan', 'fu-bao', 'qi-yi'].includes(p.id))
const liveStreams = streams.filter(s => s.status === 'live').slice(0, 3)
const liveCount = streams.filter(s => s.status === 'live').length

export default function HomePageClient() {
  const { t } = useTranslation()

  return (
    <div>
      {/* ===== HERO ===== */}
      <HeroSection
        liveCount={liveCount}
        pandaCount={pandas.length}
        familyCount={6}
      />

      {/* ===== LIVE STREAMS PREVIEW ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-panda-900 dark:text-panda-100">
              {t('home.liveSection.title')}
            </h2>
            <p className="text-sm sm:text-base text-panda-500 dark:text-panda-400 mt-1">
              {t('home.liveSection.subtitle')}
            </p>
          </div>
          <Link href="/live" className="btn-outline text-sm inline-flex items-center gap-1">
            {t('home.liveSection.viewAll')} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liveStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} t={t} />
          ))}
        </div>
      </section>

      {/* ===== FEATURED PANDAS ===== */}
      <section className="bg-white dark:bg-panda-900 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-panda-900 dark:text-panda-100">
                {t('home.featuredSection.title')}
              </h2>
              <p className="text-sm sm:text-base text-panda-500 dark:text-panda-400 mt-1">
                {t('home.featuredSection.subtitle')}
              </p>
            </div>
            <Link href="/pandas" className="btn-outline text-sm inline-flex items-center gap-1">
              {t('home.featuredSection.viewAll')} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredPandas.map((panda) => (
              <Link key={panda.id} href={`/pandas/${panda.id}`} className="card card-hover p-5 group block">
                <div className="w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <PandaAvatar data={panda} size={96} />
                </div>

                <h3 className="text-lg font-bold text-center text-panda-900 dark:text-panda-100 group-hover:text-bamboo-700 transition-colors">
                  {panda.name}
                </h3>
                <p className="text-xs text-center text-panda-400 dark:text-panda-500 mt-0.5">{panda.nameEn}</p>

                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {panda.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="tag-green">{tag}</span>
                  ))}
                </div>

                <p className="text-sm text-panda-500 dark:text-panda-400 text-center mt-3 line-clamp-2 leading-relaxed">
                  {panda.claimToFame}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MBTI CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="card p-6 sm:p-8 md:p-12 bg-gradient-to-br from-warm-100 to-bamboo-50 border-bamboo-200
                        dark:from-panda-800 dark:to-panda-900 dark:border-panda-700
                        flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 text-orange-700 text-xs sm:text-sm mb-3 sm:mb-4">
              {t('home.mbtiCta.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-panda-900 dark:text-panda-100">
              {t('home.mbtiCta.title')}
            </h2>
            <p className="mt-3 text-panda-600 dark:text-panda-300 text-base sm:text-lg">
              {t('home.mbtiCta.desc')}
            </p>
            <Link href="/mbti" className="btn-primary inline-flex items-center gap-2 mt-6 text-base sm:text-lg">
              <Sparkles size={20} />
              {t('home.mbtiCta.cta')}
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="animate-float">
            <PandaAvatar data={pandas.find(p => p.id === 'hua-hua')!} size={140} />
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-panda-900 text-white py-10 md:py-16 dark:bg-panda-900 dark:border-t dark:border-panda-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12">
            {t('home.whySection.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera size={28} />}
              title={t('home.whySection.f1Title')}
              desc={t('home.whySection.f1Desc')}
            />
            <FeatureCard
              icon={<BookOpen size={28} />}
              title={t('home.whySection.f2Title')}
              desc={t('home.whySection.f2Desc')}
            />
            <FeatureCard
              icon={<Network size={28} />}
              title={t('home.whySection.f3Title')}
              desc={t('home.whySection.f3Desc')}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function StreamCard({ stream, t }: { stream: any; t: (key: string) => string }) {
  return (
    <div className="card card-hover overflow-hidden group">
      {/* Preview placeholder */}
      <div className="aspect-video bg-gradient-to-br from-panda-800 to-bamboo-900 relative
                      flex items-center justify-center overflow-hidden">
        {/* Fake bamboo forest bg */}
        <div className="absolute inset-0 opacity-20">
          <div className="text-6xl text-center animate-float">🎋</div>
        </div>
        <div className="relative z-10 text-center">
          <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">🐼</div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/80 text-white text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {stream.status === 'live' ? t('home.streamStatus.live') : t('home.streamStatus.offline')}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-panda-900 dark:text-panda-100">{stream.name}</h3>
          {stream.viewers > 0 && (
            <span className="flex items-center gap-1 text-xs text-panda-400">
              <Eye size={12} />
              {(stream.viewers / 1000).toFixed(0)}K
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-panda-400 mb-2">
          <MapPin size={12} />
          {stream.city}, {stream.country}
        </div>

        <div className="flex flex-wrap gap-1">
          {stream.pandas.slice(0, 3).map((name: string) => (
            <span key={name} className="tag-gold text-xs">{name}</span>
          ))}
          {stream.pandas.length > 3 && (
            <span className="tag text-xs bg-panda-100 text-panda-500">+{stream.pandas.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-bamboo-600/20 text-bamboo-300 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-panda-300 leading-relaxed">{desc}</p>
    </div>
  )
}
