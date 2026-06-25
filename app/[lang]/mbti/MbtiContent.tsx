'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Share2, RefreshCw, ArrowRight, Camera } from 'lucide-react'
import PandaAvatar from '@/components/PandaAvatar'
import ParticleBackground from '@/components/ParticleBackground'
import { useScreenshot } from '@/hooks/useScreenshot'
import { getMbtiShareText, performShare } from '@/lib/share'
import pandas from '@/data/pandas.json'

// MBTI questions and results
const questions = [
  {
    id: 1,
    question: '周末早上，你通常会？',
    options: [
      { text: '睡到自然醒，能躺就躺', panda: 'hua-hua' },
      { text: '出门探索新鲜事物', panda: 'meng-lan' },
      { text: '约朋友吃饭聊天', panda: 'fu-bao' },
      { text: '独自享受安静的时光', panda: 'ji-xiao' },
    ],
  },
  {
    id: 2,
    question: '面对困难时，你的第一反应是？',
    options: [
      { text: '佛系等待，总会有办法', panda: 'hua-hua' },
      { text: '主动出击，想办法解决', panda: 'meng-lan' },
      { text: '撒个娇，找人帮忙', panda: 'fu-bao' },
      { text: '默默观察，谨慎行动', panda: 'ding-ding' },
    ],
  },
  {
    id: 3,
    question: '朋友眼中的你是？',
    options: [
      { text: '呆萌可爱的开心果', panda: 'hua-hua' },
      { text: '活力满满的冒险家', panda: 'meng-lan' },
      { text: '温暖贴心的粘人精', panda: 'fu-bao' },
      { text: '温柔安静的小天使', panda: 'xiang-xiang' },
    ],
  },
  {
    id: 4,
    question: '如果去旅行，你会选择？',
    options: [
      { text: '回家躺着（这就是最好的旅行）', panda: 'hua-hua' },
      { text: '极限运动，挑战自我', panda: 'meng-lan' },
      { text: '海外度假，拍照打卡', panda: 'fu-bao' },
      { text: '深山隐居，回归自然', panda: 'ji-xiao' },
    ],
  },
  {
    id: 5,
    question: '你最喜欢吃什么？',
    options: [
      { text: '什么都可以，不挑食', panda: 'hua-hua' },
      { text: '肉！无肉不欢', panda: 'meng-lan' },
      { text: '精致的甜点和零食', panda: 'fu-bao' },
      { text: '健康清淡的食物', panda: 'xiang-xiang' },
    ],
  },
]

const results: Record<string, {
  name: string
  nameEn: string
  emoji: string
  title: string
  description: string
  traits: string[]
  shareText: string
}> = {
  'hua-hua': {
    name: '花花',
    nameEn: 'Hua Hua',
    emoji: '🐼',
    title: '佛系吃货型',
    description: '你和花花一样，是个温柔佛系的小可爱！不争不抢，享受生活，相信一切都会慢慢变好。虽然偶尔有点慢性子，但你的呆萌魅力无人能挡。',
    traits: ['佛系', '呆萌', '吃货', '温柔'],
    shareText: '我今天的熊猫人格是【花花·佛系吃货型】🐼 不争不抢，一切随缘～',
  },
  'meng-lan': {
    name: '萌兰',
    nameEn: 'Meng Lan',
    emoji: '🐼',
    title: '越狱冒险王',
    description: '你和萌兰一样，是天生的冒险家！精力旺盛，智商在线，永远在挑战边界。朋友都觉得你太能折腾了，但你的人生信条是：没有翻不过的墙！',
    traits: ['勇敢', '聪明', '活力', '战斗力'],
    shareText: '我今天的熊猫人格是【萌兰·越狱冒险王】🐼 没有我翻不过的墙！',
  },
  'fu-bao': {
    name: '福宝',
    nameEn: 'Fu Bao',
    emoji: '🐼',
    title: '撒娇公主型',
    description: '你和福宝一样，是个被大家宠爱的小公主！天生镜头感，走到哪都是焦点。内心柔软爱撒娇，但关键时刻也能独当一面。',
    traits: ['可爱', '撒娇', '镜头感', '人气王'],
    shareText: '我今天的熊猫人格是【福宝·撒娇公主型】🐼 我就是被宠爱的福公主～',
  },
  'ji-xiao': {
    name: '绩笑',
    nameEn: 'Ji Xiao',
    emoji: '🐼',
    title: '社恐独处型',
    description: '你和绩笑一样，享受独处的时光。不是不合群，只是更喜欢安静。内心世界丰富，观察力一流，是朋友圈里最靠谱的倾听者。',
    traits: ['内敛', '温柔', '观察力', '独立'],
    shareText: '我今天的熊猫人格是【绩笑·社恐独处型】🐼 一个人待着就是最好的充电方式～',
  },
  'ding-ding': {
    name: '丁丁',
    nameEn: 'Ding Ding',
    emoji: '🐼',
    title: '温柔守护型',
    description: '你和丁丁一样，是个温柔又强大的人。看起来安静，但内心充满力量。能给身边的人安全感，是不可多得的靠谱伙伴。',
    traits: ['温柔', '耐心', '坚定', '守护'],
    shareText: '我今天的熊猫人格是【丁丁·温柔守护型】🐼 安静但有力量～',
  },
  'xiang-xiang': {
    name: '香香',
    nameEn: 'Xiang Xiang',
    emoji: '🐼',
    title: '优雅贵族型',
    description: '你和香香一样，天生带着优雅气质。不争不抢但自带光环，走到哪里都引人注目。独立又自信，是真正的贵公子/贵公主。',
    traits: ['优雅', '独立', '自信', '贵气'],
    shareText: '我今天的熊猫人格是【香香·优雅贵族型】🐼 优雅永不过时～',
  },
}

export default function MBTIContent() {
  const [step, setStep] = useState<'start' | 'questions' | 'result'>('start')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)

  const handleAnswer = (pandaId: string) => {
    const newAnswers = [...answers, pandaId]
    setAnswers(newAnswers)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      // Calculate result
      const counts: Record<string, number> = {}
      newAnswers.forEach(a => { counts[a] = (counts[a] || 0) + 1 })
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
      setResult(top)
      setStep('result')
    }
  }

  const reset = () => {
    setStep('start')
    setCurrentQ(0)
    setAnswers([])
    setResult(null)
  }

  const handleShare = async () => {
    if (!result || !results[result]) return
    const shareData = getMbtiShareText({
      name: results[result].name,
      nameEn: results[result].nameEn,
      title: results[result].title,
      traits: results[result].traits,
    })
    const ok = await performShare(shareData)
    if (ok && !navigator.share) {
      alert('分享文案已复制到剪贴板！')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimatePresence mode="wait">
        {step === 'start' && (
          <StartScreen key="start" onStart={() => setStep('questions')} />
        )}

        {step === 'questions' && (
          <QuestionScreen
            key={`q-${currentQ}`}
            question={questions[currentQ]}
            current={currentQ}
            total={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {step === 'result' && result && results[result] && (
          <ResultScreen
            key="result"
            result={results[result]}
            onRetry={reset}
            onShare={handleShare}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-8 flex justify-center"
      >
        <PandaAvatar data={pandas[0]} size={160} />
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-panda-900 dark:text-panda-100 mb-4">
        今天哪只熊猫最像你？
      </h1>
      <p className="text-lg text-panda-500 dark:text-panda-300 mb-2">
        5 道趣味题 · 30 秒完成
      </p>
      <p className="text-sm text-panda-400 dark:text-panda-400 mb-10">
        基于全球 16 只明星熊猫的真实性格数据
      </p>

      <button
        onClick={onStart}
        className="btn-primary inline-flex items-center justify-center gap-2
                   text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-3xl
                   hover:scale-105 transition-transform w-full sm:w-auto"
      >
        <Sparkles size={24} />
        开始测试
        <ArrowRight size={22} />
      </button>

      <p className="text-xs text-panda-300 dark:text-panda-500 mt-6">已帮助 128,394 人找到自己的熊猫人格 🎉</p>
    </motion.div>
  )
}

function QuestionScreen({
  question,
  current,
  total,
  onAnswer,
}: {
  question: any
  current: number
  total: number
  onAnswer: (pandaId: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="py-8"
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        <div className="flex-1 h-2 bg-panda-100 dark:bg-panda-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-bamboo-500 rounded-full"
            initial={{ width: `${((current) / total) * 100}%` }}
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm text-panda-400 dark:text-panda-400 font-medium">{current + 1}/{total}</span>
      </div>

      {/* Question */}
      <motion.h2
        key={question.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-panda-900 dark:text-panda-100 text-center mb-10"
      >
        {question.question}
      </motion.h2>

      {/* Options */}
      <div className="grid gap-3">
        {question.options.map((opt: any, i: number) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onAnswer(opt.panda)}
            className="card card-hover p-5 text-left flex items-center gap-4 group"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-bamboo-50 flex items-center justify-center text-2xl
                            group-hover:bg-bamboo-100 dark:bg-bamboo-900/30 dark:group-hover:bg-bamboo-900/50 transition-colors">
              🐼
            </div>
            <span className="text-lg font-medium text-panda-800 group-hover:text-panda-900 dark:text-panda-200 dark:group-hover:text-panda-100 transition-colors">
              {opt.text}
            </span>
            <ArrowRight size={18} className="ml-auto text-panda-300 group-hover:text-bamboo-600 dark:text-panda-500 dark:group-hover:text-bamboo-400 transition-colors" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function ResultScreen({
  result,
  onRetry,
  onShare,
}: {
  result: any
  onRetry: () => void
  onShare: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { capture } = useScreenshot()
  const [saving, setSaving] = useState(false)

  const handleSaveCard = useCallback(async () => {
    if (!cardRef.current) return
    setSaving(true)
    const filename = `panda-mbti-${result.nameEn?.toLowerCase().replace(/\s+/g, '-') || 'result'}.png`
    await capture(cardRef.current, filename)
    setSaving(false)
  }, [capture, result.nameEn])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="py-8"
    >
      {/* ── Particle background layer ── */}
      <div className="relative">
        <ParticleBackground particleCount={35} />

        {/* ── Card (screenshot target) ── */}
        <div
          ref={cardRef}
          className="result-card relative z-10 text-center py-10 px-6 sm:px-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bamboo-100 text-bamboo-700
                       font-semibold text-sm mb-6 dark:bg-bamboo-900/40 dark:text-bamboo-300"
          >
            <Sparkles size={16} />
            你的熊猫人格
          </motion.div>

          {/* Panda Avatar */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4 flex justify-center"
          >
            {(() => {
              const resultPandaId = Object.keys(results).find(k => results[k] === result)
              const pandaData = resultPandaId ? pandas.find(p => p.id === resultPandaId) : pandas[0]
              return pandaData ? <PandaAvatar data={pandaData} size={180} /> : null
            })()}
          </motion.div>

          {/* Name & Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-panda-900 dark:text-panda-100"
          >
            {result.name} · {result.title}
          </motion.h2>
          <p className="text-panda-400 dark:text-panda-400 mt-1">{result.nameEn}</p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-panda-600 dark:text-panda-300 mt-4 leading-relaxed max-w-md mx-auto"
          >
            {result.description}
          </motion.p>

          {/* Traits */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
          >
            {result.traits.map((trait: string) => (
              <span key={trait} className="px-4 py-2 rounded-full bg-warm-100 text-orange-700 font-medium text-sm
                                           border border-warm-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800">
                {trait}
              </span>
            ))}
          </motion.div>

          {/* Watermark */}
          <p className="text-panda-300 dark:text-panda-500 text-xs mt-8">🐼 panda-world.vercel.app</p>
        </div>
      </div>

      {/* ── Action buttons (outside card, not in screenshot) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-3 mt-8"
      >
        <button
          onClick={handleSaveCard}
          disabled={saving}
          className="btn-outline inline-flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Camera size={18} />
          {saving ? '保存中...' : '保存卡片'}
        </button>
        <button
          onClick={onShare}
          className="btn-primary inline-flex items-center justify-center gap-2 text-lg w-full sm:w-auto"
        >
          <Share2 size={20} />
          分享结果
        </button>
        <button
          onClick={onRetry}
          className="btn-outline inline-flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <RefreshCw size={18} />
          再测一次
        </button>
      </motion.div>

      {/* Link to panda detail */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sm text-panda-400 dark:text-panda-400 mt-6 text-center"
      >
        想了解更多？
        <a
          href={`/pandas/${Object.keys(results).find(k => results[k] === result)}`}
          className="text-bamboo-600 dark:text-bamboo-400 font-medium ml-1 hover:underline"
        >
          去看看真正的{result.name} →
        </a>
      </motion.p>
    </motion.div>
  )
}
