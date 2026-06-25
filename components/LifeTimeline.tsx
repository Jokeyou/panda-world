'use client'

import { motion } from 'framer-motion'

interface LifeEvent {
  date: string
  title: string
  description: string
}

export default function LifeTimeline({ events }: { events: LifeEvent[] }) {
  if (!events || events.length === 0) return null

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-xl font-bold text-panda-900 mb-6">📅 生平时间线</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-bamboo-200" />

        <div className="space-y-6">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex gap-5"
            >
              {/* Dot */}
              <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full
                              bg-bamboo-100 border-2 border-bamboo-400
                              flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-bamboo-600' : 'bg-bamboo-400'}`} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                  <span className="font-bold text-panda-900">{event.title}</span>
                  <span className="text-xs text-panda-400">{event.date}</span>
                </div>
                <p className="text-sm text-panda-600 leading-relaxed">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
