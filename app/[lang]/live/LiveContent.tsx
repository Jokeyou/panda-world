'use client'

import Link from 'next/link'
import streams from '@/data/streams.json'
import pandas from '@/data/pandas.json'
import PandaAvatar from '@/components/PandaAvatar'
import { MapPin, Clock, Eye, ExternalLink, Wifi, WifiOff } from 'lucide-react'

const liveStreams = streams.filter(s => s.status === 'live')
const offlineStreams = streams.filter(s => s.status !== 'live')

export default function LiveContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-panda-900 dark:text-panda-100">
          🌍 全球熊猫直播间
        </h1>
        <p className="mt-3 text-base md:text-lg text-panda-500 dark:text-panda-300 max-w-2xl">
          聚合成都、华盛顿、爱丁堡、莫斯科等全球熊猫直播源。
          点击卡片进入详情，或直接跳转到官方直播页面。
        </p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            {liveStreams.length} 路直播在线
          </div>
          {offlineStreams.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-panda-400 dark:text-panda-400">
              <span className="w-2 h-2 rounded-full bg-panda-300" />
              {offlineStreams.length} 路离线
            </div>
          )}
        </div>
      </div>

      {/* Live Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...liveStreams, ...offlineStreams].map((stream) => (
          <StreamDetailCard key={stream.id} stream={stream} />
        ))}
      </div>
    </div>
  )
}

function StreamDetailCard({ stream }: { stream: any }) {
  const isLive = stream.status === 'live'

  return (
    <article className={`card overflow-hidden ${!isLive && 'opacity-70 grayscale-[30%]'}`}>
      {/* Stream Preview */}
      <div className="aspect-video bg-gradient-to-br from-panda-800 to-bamboo-900 relative
                      flex items-center justify-center">
        <div className="absolute inset-0 opacity-15">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-4xl absolute animate-float"
                 style={{ left: `${15 + i * 14}%`, top: `${10 + (i % 3) * 30}%`, animationDelay: `${i * 0.8}s` }}>
              🎋
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-3 animate-bounce-soft flex justify-center">
            <PandaAvatar data={pandas[0]} size={100} />
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold
                           ${isLive ? 'bg-red-500 text-white' : 'bg-panda-300 text-panda-600'}`}>
            {isLive ? (
              <>
                <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                LIVE · {stream.activeHours}
              </>
            ) : (
              <>
                <WifiOff size={14} />
                离线 · 可能暂时不可用
              </>
            )}
          </div>
        </div>

        {/* Offline overlay */}
        {!isLive && (
          <div className="absolute inset-0 bg-panda-900/20 flex items-center justify-center z-20">
            <span className="text-white/80 text-lg font-bold tracking-wider">暂不可用</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-panda-900 dark:text-panda-100">{stream.name}</h2>
            <p className="text-xs md:text-sm text-panda-400 dark:text-panda-400 mt-0.5">{stream.location}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm text-panda-500 dark:text-panda-300 mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} />
            {stream.city}, {stream.country}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {stream.activeHours}
          </span>
          {isLive && stream.viewers > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye size={14} />
              {(stream.viewers / 1000).toFixed(0)}K 观看
            </span>
          )}
        </div>

        {/* Period Tags */}
        {stream.periods && stream.periods.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-panda-400 dark:text-panda-400 uppercase tracking-wider mb-2">
              时段
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {stream.periods.slice(0, 3).map((period: string, i: number) => {
                const colors = ['tag-gold', 'tag-green', 'tag-blue']
                return <span key={period} className={colors[i % 3]}>{period}</span>
              })}
            </div>
          </div>
        )}

        {/* Pandas */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-panda-400 dark:text-panda-400 uppercase tracking-wider mb-2">
            常驻熊猫
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {stream.pandas.map((name: string) => (
              <span key={name} className="tag-gold">{name}</span>
            ))}
          </div>
        </div>

        {/* Action */}
        <a
          href={stream.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all
                      ${isLive
                        ? 'bg-bamboo-600 text-white hover:bg-bamboo-700'
                        : 'bg-panda-100 text-panda-500 hover:bg-panda-200 dark:bg-panda-800 dark:text-panda-300 dark:hover:bg-panda-700'}`}
        >
          <ExternalLink size={15} />
          前往官方直播
        </a>
      </div>
    </article>
  )
}
