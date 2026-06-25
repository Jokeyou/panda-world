import Link from 'next/link'
import pandas from '@/data/pandas.json'
import PandaAvatar from '@/components/PandaAvatar'

interface Panda {
  id: string
  name: string
  nameEn: string
  currentHome: string
  birthPlace: string
  familyId: string
  tags: string[]
}

export default function RelatedPandas({ current }: { current: Panda & { [key: string]: any } }) {
  // Score-based ranking: same home = 3, same family = 2, same birthplace = 1
  const scored = pandas
    .filter(p => p.id !== current.id)
    .map(p => {
      let score = 0
      if (p.currentHome === current.currentHome && current.currentHome !== 'N/A') score += 3
      if (p.familyId === current.familyId) score += 2
      if (p.birthPlace === current.birthPlace && current.birthPlace !== 'N/A') score += 1
      return { ...p, score }
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  if (scored.length === 0) return null

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-xl font-bold text-panda-900 mb-4">🐼 相关熊猫推荐</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {scored.map(panda => (
          <Link
            key={panda.id}
            href={`/pandas/${panda.id}`}
            className="group flex flex-col items-center p-4 rounded-2xl
                       bg-cream hover:bg-bamboo-50 transition-all duration-200
                       hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-bamboo-100 flex items-center justify-center
                            overflow-hidden group-hover:scale-110 transition-transform mb-2.5">
              <PandaAvatar data={panda} size={64} />
            </div>
            <div className="font-semibold text-panda-900 text-sm text-center">{panda.name}</div>
            <div className="text-xs text-panda-400 mt-0.5">{panda.nameEn}</div>
            {/* Relation hint */}
            <div className="text-xs text-bamboo-600 mt-1.5 bg-bamboo-50 px-2 py-0.5 rounded-full">
              {panda.familyId === current.familyId ? '同家族' : '同地点'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
