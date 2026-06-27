import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import JsonLd from '@/components/JsonLd'
import { getBambooFaqSchema, getBreadcrumbSchema } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: '📚 熊猫百科 · 关于大熊猫你不知道的100件事',
  description: '从演化起源到保护现状，从饮食习惯到繁殖秘密——一篇读懂大熊猫。饮食习性、繁殖特点、保护级别、冷知识、演化史、分布地图。',
  openGraph: {
    title: '熊猫百科 | Panda World',
    description: '从演化起源到保护现状，一篇读懂大熊猫',
    type: 'article',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const BambooContent = dynamic(() => import('./BambooContent'), {
  loading: () => (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="gradient-hero-enhanced">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="h-8 w-28 mx-auto rounded-full bg-panda-100/60 dark:bg-panda-700/60 mb-6" />
            <div className="h-12 w-96 mx-auto rounded-xl bg-panda-100/50 dark:bg-panda-700/50 mb-4" />
            <div className="h-6 w-80 mx-auto rounded-lg bg-panda-50/60 dark:bg-panda-700/50" />
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-28 rounded bg-panda-50/50 dark:bg-panda-700/40" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Content section skeletons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 w-48 mx-auto rounded-xl bg-panda-100/60 dark:bg-panda-700/60" />
            <div className="h-5 w-64 mx-auto rounded-lg bg-panda-50/80 dark:bg-panda-700/50" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="card p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-panda-100/50 dark:bg-panda-700/50" />
                  <div className="h-8 w-20 mx-auto rounded bg-panda-100/60 dark:bg-panda-700/60 mb-2" />
                  <div className="h-4 w-24 mx-auto rounded bg-panda-50/80 dark:bg-panda-700/50" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
})

export default function BambooPage({ params }: { params: { lang: string } }) {
  const isEn = params.lang === 'en'
  return (
    <>
      <JsonLd data={getBambooFaqSchema(isEn ? 'en' : 'zh') as unknown as Record<string, unknown>} />
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Panda World', url: 'https://panda-world-one.vercel.app' },
        { name: isEn ? 'Panda Wiki' : '熊猫百科', url: 'https://panda-world-one.vercel.app/bamboo' },
      ]) as unknown as Record<string, unknown>} />
      <BambooContent />
    </>
  )
}
