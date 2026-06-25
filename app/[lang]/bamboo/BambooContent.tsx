'use client'

import { motion } from 'framer-motion'
import {
  Leaf, Heart, Shield, Lightbulb, Clock, MapPin,
  Apple, Baby, TrendingUp, Sparkles, ChevronRight, Info
} from 'lucide-react'

// ─── Animation Variants ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardHover = { scale: 1.02, y: -4, transition: { duration: 0.25 } }

// ─── Data ──────────────────────────────────────────────────────

const dietFacts = [
  { label: '每日进食量', value: '12–38 kg', desc: '成年大熊猫每天吃掉相当于自身体重 15–40% 的竹子' },
  { label: '进食时长', value: '10–16 小时', desc: '醒着的时间几乎都在吃，因为竹子营养密度低' },
  { label: '竹子种类', value: '20+ 种', desc: '偏爱箭竹、冷箭竹、华西箭竹等高纤维低木质素品种' },
  { label: '偶尔开荤', value: '≤1%', desc: '野生熊猫偶尔捕食竹鼠、鸟类或取食腐肉补充蛋白质' },
]

const reproductionFacts = [
  { label: '繁殖季节', value: '3–5 月', desc: '雌性每年仅发情一次，窗口期仅 24–72 小时' },
  { label: '怀孕周期', value: '95–160 天', desc: '存在"胚胎滞育"现象，实际发育仅 45–55 天' },
  { label: '幼崽体重', value: '90–130 g', desc: '仅为母体体重的 1/900，是所有哺乳动物中最小的新生儿之一' },
  { label: '育幼方式', value: '单胎为主', desc: '野外通常只抚养一只；圈养双胞胎时饲养员会轮流换崽' },
]

const conservationTimeline = [
  { year: '1970s', title: '濒危初现', desc: '野外种群不足 1,000 只，栖息地破碎化严重' },
  { year: '1980s', title: '保护起步', desc: '中国建立首批大熊猫自然保护区，启动圈养繁育计划' },
  { year: '1990s', title: '国际合作', desc: '熊猫作为外交使者走向世界，同时国际科研合作展开' },
  { year: '2000s', title: '栖息地恢复', desc: '"天然林保护工程"和"退耕还林"使栖息地逐步恢复' },
  { year: '2016', title: '降为易危', desc: 'IUCN 红色名录从"濒危(EN)"下调为"易危(VU)"，野外约 1,864 只' },
  { year: '2021', title: '国家公园', desc: '大熊猫国家公园正式设立，横跨川陕甘三省' },
]

const funFacts = [
  { icon: '🦴', title: '伪拇指', desc: '熊猫前掌有一个由腕骨特化而成的"第六指"，专门用来抓握竹子。这是演化史上的经典案例。' },
  { icon: '🦷', title: '食肉目素食者', desc: '熊猫属于食肉目，拥有典型的肉食动物消化系统，却 99% 以竹子为食——肠道菌群至今仍是研究热点。' },
  { icon: '❄️', title: '从不冬眠', desc: '与大多数熊科动物不同，大熊猫不冬眠。它们一年四季都在吃竹子，冬季靠厚皮毛保暖。' },
  { icon: '💩', title: '便便造纸', desc: '熊猫粪便中富含未消化的竹纤维。四川已有工匠用熊猫便便制作高级手工纸和文创产品。' },
  { icon: '🌳', title: '爬树高手', desc: '幼崽约 7 个月开始爬树，成年熊猫也能轻松上树——不是为了躲避天敌，更多是为了玩耍和休息。' },
  { icon: '🎨', title: '黑白之谜', desc: '科学家认为黑白毛色有双重作用：白色在雪地伪装，黑色眼圈用于同类识别和威吓天敌。' },
]

const evolutionStages = [
  { period: '约 800 万年前', name: '始熊猫', latin: 'Ailurarctos', desc: '熊猫科最早祖先，体型约为现代熊猫的一半，分布于中国南方' },
  { period: '约 200–300 万年前', name: '小种大熊猫', latin: 'Ailuropoda microta', desc: '体型仅为现代熊猫的 1/3，牙齿已特化为咀嚼竹纤维结构' },
  { period: '约 100 万年前', name: '武陵山大熊猫', latin: 'Ailuropoda wulingshanensis', desc: '体型逐渐增大，分布范围扩展到中国中部和南部' },
  { period: '约 50 万年前', name: '巴氏大熊猫', latin: 'Ailuropoda baconi', desc: '体型比现代熊猫大 1/8–1/10，是熊猫演化史上最大的成员' },
  { period: '现代', name: '大熊猫', latin: 'Ailuropoda melanoleuca', desc: '现存唯一的大熊猫物种，分布于四川、陕西、甘肃的 6 大山系' },
]

const habitats = [
  { name: '岷山山系', region: '四川北部', desc: '最大的大熊猫栖息地，约占野生种群的 40%', highlight: true },
  { name: '邛崃山系', region: '四川中西部', desc: '世界自然遗产，卧龙保护区所在地', highlight: true },
  { name: '大相岭', region: '四川南部', desc: '连接岷山与凉山种群的关键走廊带' },
  { name: '小相岭', region: '四川南部', desc: '最小的大熊猫栖息地之一，种群隔离风险较高' },
  { name: '秦岭山系', region: '陕西南部', desc: '分布有大熊猫秦岭亚种，毛色偏棕褐色', highlight: true },
  { name: '凉山山系', region: '四川南部', desc: '最南端的栖息地，种群数量较少' },
]

// ─── Sub-Components ────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, subtitle }: {
  icon: React.ElementType
  title: string
  subtitle: string
}) {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-bamboo-100 text-bamboo-600 mb-4
                      dark:bg-bamboo-900/40 dark:text-bamboo-300">
        <Icon size={28} />
      </div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-panda-900 dark:text-panda-100">{title}</h2>
      <p className="mt-2 text-panda-500 dark:text-panda-300 text-lg">{subtitle}</p>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────

export default function BambooContent() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden gradient-hero-enhanced">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bamboo-100 text-bamboo-700 text-sm font-medium mb-6
                             dark:bg-bamboo-900/40 dark:text-bamboo-300">
              📚 熊猫百科
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-panda-900 dark:text-panda-100 leading-tight">
              关于大熊猫
              <br />
              <span className="hero-title-gradient">你不知道的 100 件事</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-panda-500 dark:text-panda-300 leading-relaxed">
              从演化起源到保护现状，从饮食习惯到繁殖秘密——
              <br className="hidden sm:block" />
              一篇读懂全球最受欢迎的动物明星。
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-panda-400 dark:text-panda-400">
              <span>🌿 800 万年演化史</span>
              <span>🎋 每天 12–38kg 竹子</span>
              <span>🌍 野外约 1,864 只</span>
              <span>🏔️ 6 大山系栖息地</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 1. 饮食习性 ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <SectionHeader
          icon={Apple}
          title="饮食习性"
          subtitle="一只吃素的熊——大熊猫的干饭哲学"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {dietFacts.map((fact, i) => (
            <motion.div
              key={fact.label}
              variants={fadeUp}
              custom={i}
              whileHover={cardHover}
              className="card p-6 text-center group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🎋
              </div>
              <div className="text-3xl font-extrabold text-bamboo-600 dark:text-bamboo-400 mb-1">{fact.value}</div>
              <div className="text-sm font-semibold text-panda-700 dark:text-panda-200 mb-2">{fact.label}</div>
              <p className="text-sm text-panda-400 dark:text-panda-400 leading-relaxed">{fact.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Extra detail card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 card p-6 md:p-8 bg-gradient-to-br from-bamboo-50 to-white border-bamboo-200
                     dark:from-bamboo-900/20 dark:to-panda-900 dark:border-bamboo-800"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-bamboo-100 flex items-center justify-center
                            dark:bg-bamboo-900/40">
              <Info size={20} className="text-bamboo-600 dark:text-bamboo-300" />
            </div>
            <div>
              <h3 className="font-bold text-panda-900 dark:text-panda-100 mb-2">为什么只吃竹子不会营养不良？</h3>
              <p className="text-panda-500 dark:text-panda-300 leading-relaxed text-sm">
                大熊猫虽然 99% 的食物是竹子，但它们会选择性地食用竹叶、竹笋和嫩竹竿的不同部位来平衡营养。
                竹笋含水量高、蛋白质含量丰富（可达 20%），是春夏季节的首选；秋冬则更多依赖竹叶。
                此外，大熊猫肠道中的特定菌群（如梭菌属）可以高效分解纤维素，帮助它们从低营养食物中获取能量。
                研究表明，大熊猫每天可消化约 20% 的竹纤维——这一效率在哺乳动物中相当惊人。
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== 2. 繁殖特点 ===== */}
      <section className="bg-white dark:bg-panda-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={Heart}
            title="繁殖特点"
            subtitle="繁衍不易——大熊猫的育幼密码"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {reproductionFacts.map((fact, i) => (
              <motion.div
                key={fact.label}
                variants={fadeUp}
                custom={i}
                whileHover={cardHover}
                className="card p-6 text-center group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🐾
                </div>
                <div className="text-3xl font-extrabold text-bamboo-600 dark:text-bamboo-400 mb-1">{fact.value}</div>
                <div className="text-sm font-semibold text-panda-700 dark:text-panda-200 mb-2">{fact.label}</div>
                <p className="text-sm text-panda-400 dark:text-panda-400 leading-relaxed">{fact.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Cub stages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 card p-6 md:p-8"
          >
            <h3 className="font-bold text-panda-900 dark:text-panda-100 mb-4 flex items-center gap-2">
              <Baby size={20} className="text-bamboo-600 dark:text-bamboo-400" />
              幼崽成长时间线
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { time: '出生', desc: '粉红色、无毛、双目紧闭，完全依赖母亲保温与哺乳', weight: '90–130 g' },
                { time: '1 个月', desc: '黑白毛色开始显现，但仍无法自主行动', weight: '~2 kg' },
                { time: '3 个月', desc: '开始学习爬行，眼睛完全睁开', weight: '~5 kg' },
                { time: '6–12 个月', desc: '开始吃竹子，逐渐断奶，学会爬树', weight: '~25 kg' },
              ].map((stage) => (
                <div key={stage.time} className="p-4 rounded-2xl bg-bamboo-50/50 border border-bamboo-100/50
                                                  dark:bg-bamboo-900/20 dark:border-bamboo-800/30">
                  <div className="text-sm font-bold text-bamboo-700 dark:text-bamboo-400 mb-1">{stage.time}</div>
                  <div className="text-xs text-panda-400 dark:text-panda-400 mb-2">{stage.weight}</div>
                  <p className="text-sm text-panda-500 dark:text-panda-300 leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 3. 保护级别 ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <SectionHeader
          icon={Shield}
          title="保护级别"
          subtitle="从濒危到易危——一部中国保护生物学的成功故事"
        />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-bamboo-200 dark:bg-bamboo-800 md:-translate-x-px" />

          <div className="space-y-8">
            {conservationTimeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative flex items-start gap-6 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-bamboo-600 border-2 border-white dark:border-panda-800 shadow-sm -translate-x-1/2 mt-1.5 z-10" />

                {/* Content */}
                <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="card p-5 inline-block text-left">
                    <span className="tag-green text-xs mb-2 inline-block">{item.year}</span>
                    <h3 className="font-bold text-panda-900 dark:text-panda-100">{item.title}</h3>
                    <p className="text-sm text-panda-500 dark:text-panda-300 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current status highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 card p-6 md:p-8 bg-gradient-to-br from-bamboo-600 to-bamboo-800 text-white text-center"
        >
          <TrendingUp size={32} className="mx-auto mb-3 text-bamboo-200" />
          <p className="text-lg font-bold">截至 2024 年，野外大熊猫种群数量约 1,900 只</p>
          <p className="text-bamboo-200 text-sm mt-2 max-w-xl mx-auto">
            比 2003 年的约 1,596 只增长近 19%。中国已建立 67 个大熊猫自然保护区，
            保护了 67% 的野生大熊猫种群和 57% 的大熊猫栖息地。
          </p>
        </motion.div>
      </section>

      {/* ===== 4. 冷知识 ===== */}
      <section className="bg-panda-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-bamboo-600/30 text-bamboo-300 mb-4">
              <Lightbulb size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold">冷知识</h2>
            <p className="mt-2 text-panda-300 text-lg">关于大熊猫的那些"冷"到发抖的事实</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {funFacts.map((fact, i) => (
              <motion.div
                key={fact.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-panda-800/60 backdrop-blur-sm rounded-2xl p-6 border border-panda-700/50
                           hover:border-bamboo-600/50 transition-colors duration-300"
              >
                <div className="text-3xl mb-3">{fact.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white">{fact.title}</h3>
                <p className="text-panda-300 text-sm leading-relaxed">{fact.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 5. 演化史 ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <SectionHeader
          icon={Clock}
          title="演化史"
          subtitle="800 万年的进化之旅——从始熊猫到现代大熊猫"
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-bamboo-200 dark:border-bamboo-800">
                <th className="text-left py-4 px-4 text-sm font-bold text-panda-500 dark:text-panda-300 uppercase tracking-wider">时期</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-panda-500 dark:text-panda-300 uppercase tracking-wider">物种</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-panda-500 dark:text-panda-300 uppercase tracking-wider">学名</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-panda-500 dark:text-panda-300 uppercase tracking-wider">特征</th>
              </tr>
            </thead>
            <tbody>
              {evolutionStages.map((stage, i) => (
                <motion.tr
                  key={stage.period}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-panda-100 dark:border-panda-700 hover:bg-bamboo-50/50 dark:hover:bg-bamboo-900/20 transition-colors"
                >
                  <td className="py-4 px-4 text-sm font-semibold text-bamboo-700 dark:text-bamboo-400 whitespace-nowrap">
                    {stage.period}
                  </td>
                  <td className="py-4 px-4 font-bold text-panda-900 dark:text-panda-100">
                    {stage.name}
                  </td>
                  <td className="py-4 px-4 text-sm text-panda-400 dark:text-panda-400 italic">
                    {stage.latin}
                  </td>
                  <td className="py-4 px-4 text-sm text-panda-500 dark:text-panda-300 leading-relaxed">
                    {stage.desc}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 card p-6 bg-bamboo-50/50 border border-bamboo-100
                     dark:bg-bamboo-900/20 dark:border-bamboo-800/30"
        >
          <p className="text-sm text-panda-500 dark:text-panda-300 leading-relaxed">
            <strong className="text-panda-700 dark:text-panda-200">🔬 关键发现：</strong>
            大熊猫由中新世晚期的始熊猫演化而来，在约 200 万年前从杂食转向以竹子为主的专食性饮食策略。
            这一转变伴随着牙齿结构的特化（更宽的臼齿、更强的咀嚼肌）和伪拇指的演化。
            尽管在分类学上属于食肉目熊科，大熊猫的基因组研究表明它们拥有完整但"关闭"的鲜味感知基因
            （TAS1R1），这解释了它们为何对肉类缺乏兴趣——演化让它们主动选择了"素食"道路。
          </p>
        </motion.div>
      </section>

      {/* ===== 6. 分布地图 ===== */}
      <section className="bg-white dark:bg-panda-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={MapPin}
            title="分布地图"
            subtitle="现存大熊猫仅分布于中国的 6 大山系"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="card overflow-hidden aspect-[4/3] lg:aspect-auto relative
                         bg-gradient-to-br from-bamboo-50 via-cream to-warm-100
                         dark:from-bamboo-900/30 dark:via-panda-900 dark:to-warm-900/20
                         flex items-center justify-center"
            >
              {/* Simplified China map hint with habitat dots */}
              <div className="relative w-full h-full max-w-md">
                {/* Stylized mountain icons representing habitats */}
                <div className="absolute top-[25%] left-[30%] text-center">
                  <div className="w-3 h-3 rounded-full bg-bamboo-600 shadow-lg shadow-bamboo-300 mx-auto animate-pulse" />
                  <span className="text-xs text-panda-500 dark:text-panda-400 mt-1 block">岷山</span>
                </div>
                <div className="absolute top-[38%] left-[22%] text-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-bamboo-500 shadow-lg shadow-bamboo-300 mx-auto" />
                  <span className="text-xs text-panda-500 dark:text-panda-400 mt-1 block">邛崃</span>
                </div>
                <div className="absolute top-[55%] left-[25%] text-center">
                  <div className="w-2 h-2 rounded-full bg-bamboo-400 shadow-lg shadow-bamboo-300 mx-auto" />
                  <span className="text-xs text-panda-500 dark:text-panda-400 mt-1 block">大小相岭</span>
                </div>
                <div className="absolute top-[62%] left-[28%] text-center">
                  <div className="w-2 h-2 rounded-full bg-bamboo-400 shadow-lg shadow-bamboo-300 mx-auto" />
                  <span className="text-xs text-panda-500 dark:text-panda-400 mt-1 block">凉山</span>
                </div>
                <div className="absolute top-[18%] left-[42%] text-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-bamboo-500 shadow-lg shadow-bamboo-300 mx-auto" />
                  <span className="text-xs text-panda-500 dark:text-panda-400 mt-1 block">秦岭</span>
                </div>

                {/* Decorative panda silhouette */}
                <div className="absolute bottom-4 right-4 text-6xl opacity-20">🐼</div>

                {/* Map label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center opacity-40">
                    <MapPin size={48} className="mx-auto text-panda-300 dark:text-panda-500" />
                    <p className="text-sm text-panda-400 dark:text-panda-400 mt-2 font-medium">川 · 陕 · 甘</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Habitat list */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {habitats.map((habitat, i) => (
                <motion.div
                  key={habitat.name}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ x: 4 }}
                  className={`card p-4 flex items-start gap-4 ${
                    habitat.highlight ? 'border-bamboo-200 bg-bamboo-50/30 dark:border-bamboo-700 dark:bg-bamboo-900/20' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 ${
                    habitat.highlight ? 'bg-bamboo-600' : 'bg-panda-300'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-panda-900 dark:text-panda-100">{habitat.name}</h3>
                      {habitat.highlight && (
                        <span className="tag-green text-xs">主要栖息地</span>
                      )}
                    </div>
                    <p className="text-xs text-panda-400 dark:text-panda-400 mt-0.5">{habitat.region}</p>
                    <p className="text-sm text-panda-500 dark:text-panda-300 mt-1 leading-relaxed">{habitat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Data source note */}
          <p className="text-xs text-panda-300 dark:text-panda-500 text-center mt-8">
            数据来源：国家林业和草原局、IUCN 红色名录、大熊猫国家公园管理局
          </p>
        </div>
      </section>

      {/* ===== CTA to MBTI ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-8 md:p-10 bg-gradient-to-br from-warm-100 to-bamboo-50 border-bamboo-200 text-center
                     dark:from-warm-900/20 dark:to-bamboo-900/20 dark:border-bamboo-800"
        >
          <Sparkles size={32} className="mx-auto mb-4 text-bamboo-600 dark:text-bamboo-400" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-panda-900 dark:text-panda-100 mb-2">
            学完知识，来测测你是哪只熊猫？
          </h2>
          <p className="text-panda-500 dark:text-panda-300 mb-6 max-w-lg mx-auto">
            5 道趣味题，匹配你的专属熊猫性格。生成分享卡片，和朋友一起玩！
          </p>
          <a href="/mbti" className="btn-primary inline-flex items-center gap-2">
            开始测试
            <ChevronRight size={18} />
          </a>
        </motion.div>
      </section>
    </div>
  )
}
