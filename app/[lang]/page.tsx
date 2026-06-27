import type { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'
import JsonLd from '@/components/JsonLd'
import { getHomePageSchema, getBreadcrumbSchema } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: '全球大熊猫直播聚合 · 图鉴 · 家族树',
  description: 'Panda World 是全球首个大熊猫直播聚合+结构化数据+互动体验平台。看直播、识熊猫、测MBTI、画族谱，一站式了解大熊猫的一切。',
  openGraph: {
    title: 'Panda World · 全球大熊猫直播聚合平台',
    description: '看遍全世界的熊猫！直播聚合 · 熊猫图鉴 · 家族树 · MBTI趣味测试',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Panda World · 全球大熊猫直播聚合平台',
    description: '看遍全世界的熊猫！直播聚合 · 熊猫图鉴 · 家族树 · MBTI趣味测试',
    images: ['/opengraph-image'],
    creator: '@PandaWorld',
  },
  other: {
    'wechat:title': 'Panda World · 全球大熊猫平台',
    'wechat:description': '看遍全世界的熊猫！直播聚合 · 熊猫图鉴 · 家族树 · MBTI趣味测试',
    'wechat:image': '/opengraph-image',
  },
}

export default function Home() {
  return (
    <>
      <JsonLd data={getHomePageSchema() as unknown as Record<string, unknown>} />
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Panda World', url: 'https://panda-world-one.vercel.app' },
      ]) as unknown as Record<string, unknown>} />
      <HomePageClient />
    </>
  )
}
