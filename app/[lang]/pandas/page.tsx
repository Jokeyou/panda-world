import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { getDictionary, type Lang } from '@/lib/i18n/server'

export async function generateMetadata(
  { params }: { params: { lang: string } }
): Promise<Metadata> {
  const dict = await getDictionary((params.lang as Lang) || 'zh')
  const isEn = params.lang === 'en'

  return {
    title: dict.pandas.metaTitle,
    description: dict.pandas.metaDesc,
    openGraph: {
      title: isEn ? 'Panda Guide | Panda World' : '熊猫图鉴 | Panda World',
      description: dict.pandas.metaOgDesc,
      type: 'website',
      images: [{ url: '/panda-og.png', width: 1200, height: 630 }],
    },
  }
}

const PandasContent = dynamic(() => import('./PandasContent'), {
  loading: () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title skeleton */}
      <div className="h-12 w-48 rounded-xl bg-panda-100/60 dark:bg-panda-700/60 mb-3 animate-pulse" />
      <div className="h-5 w-80 rounded-lg bg-panda-50/80 dark:bg-panda-700/80 mb-8 animate-pulse" />
      {/* Skeleton grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-panda-100/60 dark:bg-panda-700/60" />
            <div className="h-6 w-20 mx-auto rounded-lg bg-panda-100/60 dark:bg-panda-700/60 mb-2" />
            <div className="h-3.5 w-24 mx-auto rounded bg-panda-50/80 dark:bg-panda-700/80 mb-3" />
            <div className="flex justify-center gap-1.5">
              <div className="h-5 w-12 rounded-full bg-panda-50/80 dark:bg-panda-700/80" />
              <div className="h-5 w-14 rounded-full bg-panda-50/80 dark:bg-panda-700/80" />
              <div className="h-5 w-10 rounded-full bg-panda-50/80 dark:bg-panda-700/80" />
            </div>
            <div className="space-y-1.5 mt-3">
              <div className="h-3 rounded bg-panda-50/80 dark:bg-panda-700/80 w-full" />
              <div className="h-3 rounded bg-panda-50/80 dark:bg-panda-700/80 w-3/4 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
})

export default function PandasPage() {
  return <PandasContent />
}
