import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: '🐼 熊猫 MBTI 测试',
  description: '5道趣味题，30秒找到你的专属熊猫人格！花花、萌兰、福宝...你会是哪一只？生成分享卡片，和朋友一起玩！',
  openGraph: {
    title: '熊猫 MBTI 测试 | Panda World',
    description: '5道趣味题，找到你的专属熊猫人格！',
    type: 'website',
    images: [{ url: '/panda-og.png', width: 1200, height: 630 }],
  },
}

const MBTIContent = dynamic(() => import('./MbtiContent'), {
  loading: () => (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center animate-pulse">
        {/* Avatar skeleton */}
        <div className="w-40 h-40 mx-auto mb-8 rounded-full bg-panda-100/60 dark:bg-panda-700/60" />
        {/* Title skeleton */}
        <div className="h-10 w-64 mx-auto rounded-xl bg-panda-100/60 dark:bg-panda-700/60 mb-4" />
        <div className="h-5 w-40 mx-auto rounded-lg bg-panda-50/80 dark:bg-panda-700/50 mb-8" />
        {/* Button skeleton */}
        <div className="h-14 w-40 mx-auto rounded-3xl bg-bamboo-100/60 dark:bg-bamboo-900/40" />
        {/* Subtitle skeleton */}
        <div className="h-4 w-56 mx-auto mt-6 rounded bg-panda-50/50 dark:bg-panda-700/50" />
      </div>
    </div>
  ),
})

export default function MBTIPage() {
  return <MBTIContent />
}
