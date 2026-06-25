import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: '🌳 熊猫家族树',
  description: '全球首个熊猫家族谱系交互图。可视化浏览熊猫家族关系，搜索、缩放、拖拽，谁是谁的爸妈兄弟姐妹一目了然。',
  openGraph: {
    title: '熊猫家族树 | Panda World',
    description: '全球首个熊猫家族谱系交互图',
    type: 'website',
    images: [{ url: '/panda-og.png', width: 1200, height: 630 }],
  },
}

const FamilyTreeContent = dynamic(() => import('./FamilyTreeContent'), {
  loading: () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Title skeleton */}
      <div className="h-12 w-64 rounded-xl bg-panda-100/60 dark:bg-panda-700/60 mb-4" />
      <div className="h-5 w-96 rounded-lg bg-panda-50/80 dark:bg-panda-700/50 mb-8" />
      {/* Search skeleton */}
      <div className="h-11 w-full max-w-md rounded-xl bg-panda-100/50 dark:bg-panda-700/50 mb-6" />
      {/* Canvas skeleton */}
      <div className="card overflow-hidden mb-8">
        <div className="h-[550px] bg-panda-50/40 dark:bg-panda-700/20 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-panda-100/60 dark:bg-panda-700/60" />
            <div className="h-4 w-32 mx-auto rounded bg-panda-100/50 dark:bg-panda-700/50" />
          </div>
        </div>
      </div>
    </div>
  ),
})

export default function FamilyTreePage() {
  return <FamilyTreeContent />
}
