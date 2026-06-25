import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const LiveContent = dynamic(() => import('./LiveContent'), {
  loading: () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-10 w-72 rounded-xl bg-panda-100/60 dark:bg-panda-700/60" />
        <div className="h-5 w-96 rounded-lg bg-panda-50/50 dark:bg-panda-700/50 mt-3" />
        <div className="flex items-center gap-4 mt-4">
          <div className="h-5 w-32 rounded-full bg-green-100/60 dark:bg-green-900/30" />
          <div className="h-5 w-24 rounded-full bg-panda-100/40 dark:bg-panda-700/40" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-video bg-panda-100/30 dark:bg-panda-700/30" />
            <div className="p-5 space-y-3">
              <div className="h-6 w-40 rounded-lg bg-panda-100/60 dark:bg-panda-700/60" />
              <div className="h-4 w-28 rounded-lg bg-panda-50/50 dark:bg-panda-700/50" />
              <div className="flex gap-2">
                <div className="h-6 w-14 rounded-full bg-panda-100/40 dark:bg-panda-700/40" />
                <div className="h-6 w-14 rounded-full bg-panda-100/40 dark:bg-panda-700/40" />
              </div>
              <div className="h-10 w-36 rounded-xl bg-panda-100/40 dark:bg-panda-700/40 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
})

export const metadata: Metadata = {
  title: '全球熊猫直播间',
  description: '聚合成都、华盛顿、爱丁堡、莫斯科等全球熊猫直播源。实时观看大熊猫的日常起居、吃竹子、玩耍打闹，一站式看遍全世界熊猫直播。',
  openGraph: {
    title: '全球熊猫直播间 | Panda World',
    description: '聚合全球熊猫直播源，实时观看大熊猫日常起居',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '全球熊猫直播间 | Panda World',
    description: '聚合全球熊猫直播源，实时观看大熊猫日常起居',
    images: ['/opengraph-image'],
  },
  other: {
    'wechat:title': '全球熊猫直播间 | Panda World',
    'wechat:description': '聚合全球熊猫直播源，实时观看大熊猫日常起居',
    'wechat:image': '/opengraph-image',
  },
}

export default function LivePage() {
  return <LiveContent />
}
