import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { getDictionary, type Lang } from '@/lib/i18n/server'
import JsonLd from '@/components/JsonLd'
import { getBreadcrumbSchema } from '@/lib/jsonld'

export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const lang: Lang = params.lang === 'en' ? 'en' : 'zh'
  const dict = getDictionary(lang)
  const isEn = lang === 'en'

  return {
    title: dict.birthdays.metaTitle,
    description: dict.birthdays.metaDesc,
    openGraph: {
      title: isEn ? 'Birthday Tracker | Panda World' : '生日追踪 | Panda World',
      description: dict.birthdays.metaDesc,
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  }
}

const BirthdaysContent = dynamic(() => import('@/app/birthdays/BirthdaysContent'), {
  loading: () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title skeleton */}
      <div className="text-center mb-10">
        <div className="h-10 w-48 rounded-xl bg-panda-100/60 dark:bg-panda-700/60 mb-3 mx-auto animate-pulse" />
        <div className="h-5 w-80 rounded-lg bg-panda-50/80 dark:bg-panda-700/80 mb-2 mx-auto animate-pulse" />
        <div className="h-4 w-40 rounded bg-panda-50/80 dark:bg-panda-700/80 mx-auto animate-pulse" />
      </div>
      {/* Month section skeletons */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="mb-8">
          <div className="h-8 w-24 rounded-lg bg-panda-100/60 dark:bg-panda-700/60 mb-4 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="card p-5 animate-pulse">
                <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-panda-100/60 dark:bg-panda-700/60" />
                <div className="h-5 w-20 mx-auto rounded-lg bg-panda-100/60 dark:bg-panda-700/60 mb-2" />
                <div className="h-3.5 w-16 mx-auto rounded bg-panda-50/80 dark:bg-panda-700/80 mb-2" />
                <div className="h-3 w-28 mx-auto rounded bg-panda-50/80 dark:bg-panda-700/80" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
})

export default function BirthdaysPage({ params }: { params: { lang: string } }) {
  const lang: Lang = params.lang === 'en' ? 'en' : 'zh'

  return (
    <>
      <JsonLd
        data={
          getBreadcrumbSchema([
            { name: 'Panda World', url: 'https://panda-world-one.vercel.app' },
            {
              name: lang === 'en' ? 'Birthday Tracker' : '生日追踪',
              url: `https://panda-world-one.vercel.app${lang === 'en' ? '/en' : ''}/birthdays`,
            },
          ]) as unknown as Record<string, unknown>
        }
      />
      <BirthdaysContent lang={lang} />
    </>
  )
}
