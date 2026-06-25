import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: '📬 联系我们 · Panda World',
  description: '有任何关于大熊猫的问题、建议或合作意向？欢迎联系 Panda World 团队。',
  openGraph: {
    title: '联系我们 | Panda World',
    description: '联系 Panda World 团队 —— 问题、建议、合作，我们都在这里',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const ContactContent = dynamic(() => import('./ContactContent'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="gradient-hero-enhanced">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="h-8 w-24 mx-auto rounded-full bg-panda-100/60 dark:bg-panda-700/60 mb-6" />
            <div className="h-12 w-72 mx-auto rounded-xl bg-panda-100/50 dark:bg-panda-700/50 mb-4" />
            <div className="h-6 w-80 mx-auto rounded-lg bg-panda-50/60 dark:bg-panda-700/50" />
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-8 space-y-4">
            <div className="h-5 w-20 rounded bg-panda-100/60 dark:bg-panda-700/60" />
            <div className="h-12 rounded-xl bg-panda-50/80 dark:bg-panda-700/50" />
            <div className="h-5 w-20 rounded bg-panda-100/60 dark:bg-panda-700/60" />
            <div className="h-12 rounded-xl bg-panda-50/80 dark:bg-panda-700/50" />
            <div className="h-5 w-20 rounded bg-panda-100/60 dark:bg-panda-700/60" />
            <div className="h-32 rounded-xl bg-panda-50/80 dark:bg-panda-700/50" />
            <div className="h-12 w-40 rounded-2xl bg-panda-100/40 dark:bg-panda-700/40" />
          </div>
          <div className="card p-8 space-y-6">
            <div className="h-5 w-24 rounded bg-panda-100/60 dark:bg-panda-700/60" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-panda-100/50 dark:bg-panda-700/50" />
                <div className="space-y-1">
                  <div className="h-4 w-20 rounded bg-panda-100/60 dark:bg-panda-700/60" />
                  <div className="h-3 w-32 rounded bg-panda-50/80 dark:bg-panda-700/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
})

export default function ContactPage() {
  return <ContactContent />
}
