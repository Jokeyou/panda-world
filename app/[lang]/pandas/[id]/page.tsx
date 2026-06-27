import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import pandas from '@/data/pandas.json'
import families from '@/data/families.json'
import PandaAvatar from '@/components/PandaAvatar'
import PandaImage from '@/components/PandaImage'
import PhotoGallery from '@/components/PhotoGallery'
import PersonalityTags from '@/components/PersonalityTags'
import { getShareContent, getPandaOgImageUrl } from '@/lib/share-content'
import { getDictionary, type Lang } from '@/lib/i18n/server'
import { ArrowLeft, MapPin, Calendar, Star, Globe } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import { getPandaArticleSchema, getBreadcrumbSchema } from '@/lib/jsonld'

const LifeTimeline = dynamic(() => import('@/components/LifeTimeline'), {
  loading: () => <div className="animate-pulse h-48 bg-panda-50 dark:bg-panda-800/60 rounded-2xl mb-8" />,
})

const FunFactsCarousel = dynamic(() => import('@/components/FunFactsCarousel'), {
  loading: () => <div className="animate-pulse h-40 bg-panda-50 dark:bg-panda-800/60 rounded-2xl mb-8" />,
})

// Generate static params for all pandas
export function generateStaticParams() {
  return pandas.map(p => ({ id: p.id }))
}

export function generateMetadata(
  { params }: { params: { lang: string; id: string } }
): Metadata {
  const panda = pandas.find(p => p.id === params.id)
  if (!panda) return { title: '未找到' }

  const lang = params.lang === 'en' ? 'en' : 'zh'
  const share = getShareContent(
    { ...panda, tags: panda.tags, personality: panda.personality },
    lang
  )
  const ogImageUrl = getPandaOgImageUrl(panda.id)
  const birthYear = new Date(panda.birthDate).getFullYear()

  const enDesc = `${panda.nameEn} (${panda.name}), ${panda.claimToFame}. Birth place: ${panda.birthPlace}, Current home: ${panda.currentHome}.`

  return {
    title: `${panda.name} · ${panda.nameEn}`,
    description: lang === 'en'
      ? `${panda.nameEn} (${panda.name}) — ${panda.claimToFame}. Birth: ${panda.birthPlace}, Now: ${panda.currentHome}. Traits: ${panda.tags.slice(0, 4).join(', ')}.`
      : `${panda.name}（${panda.nameEn}）——${panda.claimToFame}。出生地：${panda.birthPlace}，现居：${panda.currentHome}。性格标签：${panda.tags.slice(0, 4).join('、')}。`,

    // Open Graph (Facebook, LinkedIn, Slack, etc.)
    openGraph: {
      title: share.title,
      description: lang === 'en' ? enDesc : share.description,
      type: 'article',
      locale: lang === 'en' ? 'en_US' : 'zh_CN',
      siteName: 'Panda World',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${panda.name} · ${panda.nameEn} — Panda World`,
        },
      ],
      // Article-specific metadata
      publishedTime: panda.life_events?.[0]?.date || panda.birthDate,
      modifiedTime: panda.life_events?.[panda.life_events.length - 1]?.date || panda.birthDate,
      authors: ['Panda World'],
      tags: [...panda.tags, panda.name, panda.nameEn],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: share.title,
      description: lang === 'en' ? enDesc : share.description,
      images: [ogImageUrl],
    },

    // WeChat / Weibo / other platforms (via `other` meta tags)
    other: {
      // WeChat Moments & official account share
      'wechat:title': share.wechatTitle,
      'wechat:description': share.wechatDesc,
      'wechat:image': ogImageUrl,
      // Additional meta for Chinese platforms
      'og:site_name': 'Panda World · 全球大熊猫平台',
      'og:locale': lang === 'en' ? 'en_US' : 'zh_CN',
      'article:published_time': panda.life_events?.[0]?.date || panda.birthDate,
      'article:tag': panda.tags.join(','),
      'article:section': 'Panda Guide',
    },

    // Keywords for SEO
    keywords: [
      ...share.hashtags.map(h => h.replace('#', '')),
      panda.name,
      panda.nameEn,
      panda.birthPlace,
      panda.currentHome,
      `熊猫${birthYear}`,
    ],
  }
}

export default async function PandaDetailPage({ params }: { params: { lang: string; id: string } }) {
  const dict = await getDictionary((params.lang as Lang) || 'zh')
  const d = dict.pandaDetail

  const panda = pandas.find(p => p.id === params.id)
  if (!panda) notFound()

  const familyMembers = pandas.filter(p =>
    p.familyId === panda.familyId && p.id !== panda.id
  )

  const age = new Date().getFullYear() - new Date(panda.birthDate).getFullYear()

  const lang = (params.lang as Lang) || 'zh'
  const isEn = lang === 'en'

  return (
    <>
      <JsonLd data={getPandaArticleSchema(panda, isEn ? 'en' : 'zh') as unknown as Record<string, unknown>} />
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Panda World', url: 'https://panda-world-one.vercel.app' },
        { name: isEn ? 'Panda Guide' : '熊猫图鉴', url: `https://panda-world-one.vercel.app/pandas` },
        { name: `${panda.name} (${panda.nameEn})`, url: `https://panda-world-one.vercel.app/pandas/${panda.id}` },
      ]) as unknown as Record<string, unknown>} />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Back */}
      <Link href="/pandas" className="inline-flex items-center gap-2 text-panda-500 hover:text-panda-900 dark:text-panda-400 dark:hover:text-panda-100 mb-8 transition-colors">
        <ArrowLeft size={18} />
        {d.back}
      </Link>

      {/* Hero Card */}
      <div className="card overflow-hidden mb-8">
        {/* Hero Image */}
        <PandaImage panda={panda} size="hero" priority />

        {/* Title & Info */}
        <div className="px-6 pb-6 pt-4">
          <div className="flex flex-col items-center">

            <h1 className="text-2xl md:text-3xl font-extrabold text-panda-900 dark:text-panda-100 mt-3">
              {panda.name}
              <span className="text-base md:text-lg font-normal text-panda-400 ml-2">{panda.nameEn}</span>
            </h1>

            {/* Nicknames */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {panda.nicknames.map(n => (
                <span key={n} className="tag-gold">{n}</span>
              ))}
            </div>

            {/* Claim */}
            <p className="text-sm md:text-base text-panda-600 dark:text-panda-300 text-center mt-4 max-w-lg leading-relaxed">
              💬 {panda.claimToFame}
            </p>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <PhotoGallery
        gallery={(panda as any).gallery || []}
        dict={{
          photoGallery: d.photoGallery,
          photoGalleryEmpty: d.photoGalleryEmpty,
          photoGalleryClose: d.photoGalleryClose,
          photoGalleryPrev: d.photoGalleryPrev,
          photoGalleryNext: d.photoGalleryNext,
        }}
      />

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <InfoCard icon={<Calendar size={18} />} label={d.birthDate} value={panda.birthDate} />
        <InfoCard icon={<MapPin size={18} />} label={d.birthPlace} value={panda.birthPlace} />
        <InfoCard icon={<Globe size={18} />} label={d.currentHome} value={panda.currentHome} />
        <InfoCard icon={<Star size={18} />} label={d.spectacleNumber} value={panda.spectacleNumber} />
      </div>

      {/* Details Card */}
      <div className="card p-5 md:p-6 mb-8">
        <h2 className="text-lg md:text-xl font-bold text-panda-900 dark:text-panda-100 mb-4">{d.details}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm">
          <DetailItem label={d.gender} value={panda.gender === 'male' ? d.male : d.female} />
          <DetailItem label={d.age} value={`${age} ${d.ageUnit}`} />
          <DetailItem label={d.weight} value={panda.weight} />
          <DetailItem label={d.mother} value={panda.mother} />
          <DetailItem label={d.father} value={panda.father} />
          <DetailItem label={d.family} value={(families as any[]).find((f: any) => f.id === panda.familyId)?.name || panda.familyId} />
        </div>
      </div>

      {/* Personality */}
      <PersonalityTags traits={panda.personality} />

      {/* Fun Facts Carousel */}
      <FunFactsCarousel facts={panda.funFacts} />

      {/* Life Timeline */}
      {panda.life_events && panda.life_events.length > 0 && (
        <LifeTimeline events={panda.life_events} />
      )}

      {/* Family Members */}
      {familyMembers.length > 0 && (
        <div className="card p-5 md:p-6 mb-8">
          <h2 className="text-lg md:text-xl font-bold text-panda-900 dark:text-panda-100 mb-4">{d.familyMembers}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {familyMembers.map(member => (
              <Link
                key={member.id}
                href={`/pandas/${member.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-bamboo-50 dark:hover:bg-bamboo-900/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-bamboo-100 dark:bg-bamboo-900/40 flex items-center justify-center overflow-hidden
                                group-hover:scale-110 transition-transform">
                  <PandaAvatar data={member} size={40} />
                </div>
                <div>
                  <div className="font-semibold text-panda-900 dark:text-panda-100 text-sm">{member.name}</div>
                  <div className="text-xs text-panda-400">{member.nameEn}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Panda Recommendations */}
      {(() => {
        const related = pandas
          .filter(p => p.id !== panda.id)
          .map(p => {
            let score = 0
            const reasons: string[] = []

            // Same family = strong signal
            if (p.familyId === panda.familyId) {
              score += 3
              reasons.push(d.sameFamily)
            }

            // Overlapping personality traits
            const commonTraits = p.personality.filter(t => panda.personality.includes(t))
            if (commonTraits.length > 0) {
              score += commonTraits.length
              reasons.push(d.commonTraits.replace('{count}', String(commonTraits.length)))
            }

            return { ...p, score, reasons, commonTraits }
          })
          .filter(p => p.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)

        if (related.length === 0) return null

        return (
          <div className="card p-5 md:p-6 mb-8">
            <h2 className="text-lg md:text-xl font-bold text-panda-900 dark:text-panda-100 mb-4">
              {d.relatedPandas}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(p => (
                <Link
                  key={p.id}
                  href={`/pandas/${p.id}`}
                  className="group flex flex-col items-center p-4 rounded-2xl
                             bg-cream dark:bg-panda-900 hover:bg-bamboo-50 dark:hover:bg-panda-800 transition-all duration-200
                             hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Photo */}
                  <div className="mb-3 overflow-hidden rounded-2xl w-full">
                    <PandaImage panda={p} size="card" />
                  </div>

                  {/* Name */}
                  <div className="font-bold text-panda-900 dark:text-panda-100 text-sm">{p.name}</div>
                  <div className="text-xs text-panda-400 mt-0.5">{p.nameEn}</div>

                  {/* Personality Tags */}
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {p.personality.slice(0, 3).map(t => (
                      <span
                        key={t}
                        className="text-xs bg-bamboo-50 dark:bg-bamboo-900/40 text-bamboo-700 dark:text-bamboo-300 px-1.5 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Relation hint */}
                  <div className="text-xs text-bamboo-600 dark:text-bamboo-400 mt-2 bg-bamboo-50/60 dark:bg-bamboo-900/30 px-2 py-0.5 rounded-full">
                    {p.reasons[0]}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
    </>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-4 flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3 sm:gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-bamboo-50 dark:bg-bamboo-900/40 flex items-center justify-center text-bamboo-600 dark:text-bamboo-400">
        {icon}
      </div>
      <div>
        <div className="text-xs text-panda-400 uppercase tracking-wider">{label}</div>
        <div className="font-semibold text-panda-900 dark:text-panda-100">{value}</div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-panda-400 mb-0.5">{label}</div>
      <div className="font-medium text-panda-900 dark:text-panda-100">{value}</div>
    </div>
  )
}
