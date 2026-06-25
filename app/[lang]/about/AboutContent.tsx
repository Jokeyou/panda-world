'use client'

import { motion } from 'framer-motion'
import { Heart, Target, Eye, Leaf, Sparkles } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
}

const sections = [
  {
    icon: Heart,
    title: '品牌故事',
    subtitle: 'Brand Story',
    gradient: 'from-rose-500 to-pink-500',
    bgLight: 'bg-rose-50 dark:bg-rose-900/20',
    iconBg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    body: 'Panda World 诞生于一个简单的想法：让每一个人都能了解、喜爱大熊猫。我们汇聚全球熊猫直播、构建结构化数据图鉴、打造互动体验，将散落在世界各地的熊猫信息整合到一个平台上。从成都到大坂，从华盛顿到爱丁堡，每一只熊猫都有自己的故事——我们就是那个讲故事的人。',
  },
  {
    icon: Target,
    title: '我们的使命',
    subtitle: 'Our Mission',
    gradient: 'from-bamboo-500 to-bamboo-600',
    bgLight: 'bg-bamboo-50 dark:bg-bamboo-900/20',
    iconBg: 'bg-bamboo-100 dark:bg-bamboo-900/30 text-bamboo-600 dark:text-bamboo-400',
    body: '保护大熊猫，传播熊猫文化。我们致力于通过技术和内容创新，降低人们了解大熊猫的门槛。从直播聚合到熊猫图鉴，从家族树到MBTI趣味测试，每一项功能都服务于一个目标——让大熊猫保护不再是小众话题，而是每个人都能参与的全球行动。',
  },
  {
    icon: Eye,
    title: '未来愿景',
    subtitle: 'Our Vision',
    gradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-warm-100 dark:bg-orange-900/20',
    iconBg: 'bg-warm-200 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    body: '成为全球最全面、最有趣的熊猫数字平台。我们计划收录全球每一只圈养大熊猫的完整档案，接入更多国家的熊猫直播信号，构建更丰富的互动体验。未来，Panda World 不仅是看熊猫的地方，更是学习、分享、交流的熊猫爱好者社区。',
  },
]

const values = [
  { icon: Leaf, label: '真实 · Authentic', desc: '所有熊猫数据基于公开权威来源，持续校验更新' },
  { icon: Sparkles, label: '有趣 · Fun', desc: '熊猫不只有严肃的保护话题，更有温暖可爱的日常' },
  { icon: Heart, label: '热爱 · Love', desc: '每一行代码都来自对熊猫的真心喜爱' },
]

export default function AboutContent() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="gradient-hero-enhanced relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block tag-green mb-6 text-sm">🐼 关于我们</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-panda-900 dark:text-panda-100 mb-4 leading-tight tracking-tight">
              让每一个人
              <br />
              <span className="hero-title-gradient">了解大熊猫</span>
            </h1>
            <p className="text-panda-500 dark:text-panda-400 text-lg leading-relaxed max-w-xl mx-auto">
              我们汇聚全球熊猫数据，打造最完整的熊猫数字家园。
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Brand Story / Mission / Vision ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className={`card p-6 sm:p-8 flex flex-col items-center text-center group ${section.bgLight}`}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl ${section.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <section.icon size={30} />
              </div>

              {/* Title */}
              <h3 className={`text-xl font-bold bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent mb-1`}>
                {section.title}
              </h3>
              <p className="text-xs text-panda-400 dark:text-panda-500 mb-4 tracking-wide uppercase">
                {section.subtitle}
              </p>

              {/* Divider */}
              <div className={`w-10 h-0.5 rounded-full bg-gradient-to-r ${section.gradient} mb-4`} />

              {/* Body */}
              <p className="text-panda-600 dark:text-panda-300 text-sm leading-relaxed">
                {section.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-white/60 dark:bg-panda-800/40 border-y border-panda-100/60 dark:border-panda-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-3xl mb-3 block">🧡</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-panda-900 dark:text-panda-100 mb-2">
              我们的价值观
            </h2>
            <p className="text-panda-500 dark:text-panda-400 text-sm">
              Panda World 背后的信念
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-bamboo-50 dark:bg-bamboo-900/30 flex items-center justify-center text-bamboo-600 dark:text-bamboo-400">
                  <v.icon size={22} />
                </div>
                <p className="font-semibold text-panda-800 dark:text-panda-200 text-sm">{v.label}</p>
                <p className="text-xs text-panda-400 dark:text-panda-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-5xl mb-4">🐼</p>
          <h2 className="text-xl sm:text-2xl font-bold text-panda-900 dark:text-panda-100 mb-3">
            来 Panda World，一起探索熊猫的世界
          </h2>
          <p className="text-panda-500 dark:text-panda-400 text-sm mb-8 max-w-md mx-auto">
            看直播、识熊猫、测MBTI、画族谱——一站式了解大熊猫的一切
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/live" className="btn-primary text-sm">
              📡 看全球直播
            </a>
            <a href="/pandas" className="btn-outline text-sm">
              📖 探索熊猫图鉴
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
