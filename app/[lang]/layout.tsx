import type { Metadata, Viewport } from 'next'
import { LanguageProvider, type Lang } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Breadcrumb from '@/components/Breadcrumb'
import Footer from '@/components/Footer'

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Lang = params.lang === 'en' ? 'en' : 'zh'
  const meta: Record<Lang, string> = {
    zh: '🐼 Panda World · 全球大熊猫平台 — 直播聚合 · 熊猫图鉴 · 家族树',
    en: '🐼 Panda World · Global Giant Panda Platform — Live Streams · Panda Guide · Family Tree',
  }
  const desc: Record<Lang, string> = {
    zh: '全球大熊猫直播聚合平台 · 熊猫图鉴 · 家族树 · 趣味测试。看遍全世界的熊猫！',
    en: 'The world\'s first giant panda livestream aggregator · Panda Encyclopedia · Family Tree · Fun Quizzes. Watch pandas from around the globe!',
  }

  return {
    title: {
      default: meta[lang],
      template: `%s | Panda World`,
    },
    description: desc[lang],
    openGraph: {
      title: meta[lang],
      description: desc[lang],
      type: 'website',
      locale: lang === 'en' ? 'en_US' : 'zh_CN',
      siteName: 'Panda World',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta[lang],
      description: desc[lang],
      images: ['/opengraph-image'],
    },
    other: {
      'wechat:title': meta[lang],
      'wechat:description': desc[lang],
      'wechat:image': '/opengraph-image',
    },
    alternates: {
      canonical: lang === 'en' ? 'https://pandaworld.vercel.app/en' : 'https://pandaworld.vercel.app',
    },
  }
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const lang: Lang = params.lang === 'en' ? 'en' : 'zh'

  return (
    <LanguageProvider lang={lang}>
      <Navbar />
      <Breadcrumb />
      <main className="flex-1">{children}</main>
      <Footer />
    </LanguageProvider>
  )
}
