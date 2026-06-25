import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: '🐼 关于我们 · Panda World 的品牌故事',
  description: 'Panda World 致力于让每一个人了解大熊猫。我们的使命是保护大熊猫、传播熊猫文化，愿景是成为全球最全面的熊猫数字平台。',
  openGraph: {
    title: '关于我们 | Panda World',
    description: 'Panda World 的品牌故事 —— 让每一个人了解大熊猫',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const AboutContent = dynamic(() => import('./AboutContent'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="gradient-hero-enhanced">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="h-8 w-24 mx-auto rounded-full bg-panda-100/60 dark:bg-panda-700/60 mb-6" />
            <div className="h-12 w-80 mx-auto rounded-xl bg-panda-100/50 dark:bg-panda-700/50 mb-4" />
            <div className="h-6 w-96 mx-auto rounded-lg bg-panda-50/60 dark:bg-panda-700/50" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-panda-100/50 dark:bg-panda-700/50" />
            <div className="h-8 w-32 mx-auto rounded-xl bg-panda-100/60 dark:bg-panda-700/60 mb-3" />
            <div className="h-5 w-64 mx-auto rounded-lg bg-panda-50/80 dark:bg-panda-700/50" />
            <div className="h-5 w-48 mx-auto rounded-lg bg-panda-50/60 dark:bg-panda-700/40 mt-2" />
          </div>
        ))}
      </div>
    </div>
  ),
})

export default function AboutPage() {
  return <AboutContent />
}
