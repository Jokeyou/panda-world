// Trait explanations for tooltip display
const TRAIT_EXPLANATIONS: Record<string, string> = {
  温顺: '性格温和顺从，不争不抢，对谁都友善',
  呆萌: '憨态可掬，反应慢半拍，天然呆惹人爱',
  慢性子: '做事不急不躁，按自己节奏悠闲生活',
  吃货: '对食物充满热情，吃饭是第一大事',
  活泼: '精力充沛，好动爱玩，停不下来',
  聪明: '智商高，学东西快，会玩各种丰容玩具',
  胆子大: '勇敢无畏，不惧怕新鲜事物和挑战',
  战斗力强: '身体强壮，打闹从不吃亏',
  调皮: '爱捣蛋捉弄同伴，熊猫界的熊孩子',
  粘人: '喜欢黏着饲养员或同伴，特别会撒娇',
  爱撒娇: '擅长用各种方式讨要关注和零食',
  镜头感强: '天生会找镜头，拍照永远是最佳角度',
  优雅: '举止从容高贵，吃饭走路都有范儿',
  安静: '不喜欢吵闹，喜欢独自安静待着',
  独立: '不依赖别人，自己也能玩得很好',
  好奇: '对什么都感兴趣，喜欢探索新事物',
  坚韧: '意志坚强，面对困难也能坚持下去',
  温和: '脾气好，对同伴和饲养员都很温柔',
  适应力强: '到新环境能很快适应，不认生',
  文静: '安静斯文，像个大家闺秀',
  观察力强: '善于观察周围环境，警惕性高',
  温柔: '性格柔软温暖，从不发火',
  有母性: '天生会照顾幼崽，是个好妈妈',
  母性强: '照顾幼崽无微不至，母性本能突出',
  阳光: '性格开朗明亮，像太阳一样温暖',
  贪吃: '超级爱吃，一天到晚嘴不停',
  懒散: '能躺着绝不坐着，佛系生活代表',
  耐心: '不急不躁，对幼崽和同伴特别有耐心',
  谨慎: '做事小心，不会贸然行动',
  强壮: '体格健壮，力量感十足',
  稳重: '沉着冷静，有大将之风',
  绅士: '举止得体有风度，熊猫界的绅士',
  害羞: '容易不好意思，见到人多就躲',
  内敛: '性格内向，不张扬不表现',
  社恐: '天生不喜欢社交场合，独处最自在',
  可爱: '天生一副萌样，让人看了就想抱',
  标志性: '具有代表性和辨识度，一眼就能认出',
  乐天: '天生乐观派，什么事都不放在心上',
  佛系: '一切随缘，不争不抢，活得很通透',
  好脾气: '脾气好得没话说，怎么逗都不生气',
  憨厚: '老实憨厚，看起来就可靠',
  独特: '与众不同，有自己的特色',
  霸气: '气场强大，走路吃饭都带着王者风范',
  沉稳: '成熟稳重，处事不惊',
  领地意识强: '对自己地盘看得很紧，不容侵犯',
  多情: '感情丰富，对同伴和饲养员都有深厚感情',
  基因优秀: '遗传基因好，后代大多也是明星熊猫',
  经验丰富: '见多识广，经历过大场面',
  好动: '闲不住，总得找点事情做',
  爱打架: '一言不合就动手，但都是玩闹性质',
  运动健将: '擅长爬树翻墙，运动能力超强',
  老实: '憨厚老实，从不惹事',
  话痨: '特别爱叫唤，整天叽叽咕咕说个不停',
  低调: '不喜欢出风头，默默做自己的事',
  爱闹: '喜欢闹腾，总是能把气氛带起来',
  粘妹妹: '特别黏妹妹，形影不离的好哥哥',
  爱玩: '什么玩具都能玩半天，玩心很重',
  好斗: '争强好胜，打架从不认输',
}

// Warm-tone color palette (橙、红、黄、棕等暖色调)
const WARM_COLORS = {
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  orange:  { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200' },
  red:     { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200' },
  yellow:  { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200' },
  stone:   { bg: 'bg-stone-100',  text: 'text-stone-700',   border: 'border-stone-300' },
}

// Assign traits to warm color bins
const TRAIT_COLOR_MAP: Record<string, typeof WARM_COLORS.amber> = {
  // Amber — 阳光/吃货/佛系 型
  阳光: WARM_COLORS.amber, 乐天: WARM_COLORS.amber, 吃货: WARM_COLORS.amber,
  贪吃: WARM_COLORS.amber, 佛系: WARM_COLORS.amber, 好脾气: WARM_COLORS.amber,
  慢性子: WARM_COLORS.amber, 懒散: WARM_COLORS.amber,

  // Orange — 活泼/好奇/爱玩 型
  活泼: WARM_COLORS.orange, 调皮: WARM_COLORS.orange, 好奇: WARM_COLORS.orange,
  好动: WARM_COLORS.orange, 爱闹: WARM_COLORS.orange, 爱玩: WARM_COLORS.orange,
  运动健将: WARM_COLORS.orange, 粘人: WARM_COLORS.orange, 粘妹妹: WARM_COLORS.orange,
  镜头感强: WARM_COLORS.orange,

  // Red — 战斗力/霸气/强势 型
  战斗力强: WARM_COLORS.red, 胆子大: WARM_COLORS.red, 霸气: WARM_COLORS.red,
  好斗: WARM_COLORS.red, 爱打架: WARM_COLORS.red, 领地意识强: WARM_COLORS.red,
  强壮: WARM_COLORS.red,

  // Rose — 温柔/粘人/母性 型
  温柔: WARM_COLORS.rose, 爱撒娇: WARM_COLORS.rose, 有母性: WARM_COLORS.rose,
  母性强: WARM_COLORS.rose, 多情: WARM_COLORS.rose,

  // Yellow — 呆萌/可爱/聪明 型
  呆萌: WARM_COLORS.yellow, 可爱: WARM_COLORS.yellow, 聪明: WARM_COLORS.yellow,
  标志性: WARM_COLORS.yellow, 独特: WARM_COLORS.yellow, 基因优秀: WARM_COLORS.yellow,

  // Stone — 稳重/温和/内敛 型 (warm brown substitute)
  稳重: WARM_COLORS.stone, 温和: WARM_COLORS.stone, 温顺: WARM_COLORS.stone,
  安静: WARM_COLORS.stone, 文静: WARM_COLORS.stone, 优雅: WARM_COLORS.stone,
  绅士: WARM_COLORS.stone, 内敛: WARM_COLORS.stone, 害羞: WARM_COLORS.stone,
  社恐: WARM_COLORS.stone, 耐心: WARM_COLORS.stone, 谨慎: WARM_COLORS.stone,
  憨厚: WARM_COLORS.stone, 老实: WARM_COLORS.stone, 低调: WARM_COLORS.stone,
  沉稳: WARM_COLORS.stone, 坚韧: WARM_COLORS.stone, 独立: WARM_COLORS.stone,
  适应力强: WARM_COLORS.stone, 观察力强: WARM_COLORS.stone, 经验丰富: WARM_COLORS.stone,
  话痨: WARM_COLORS.stone,
}

const DEFAULT_COLOR = WARM_COLORS.orange

export default function PersonalityTags({ traits }: { traits: string[] }) {
  return (
    <div className="card p-6 mb-8">
      <h2 className="text-xl font-bold text-panda-900 mb-3">🎭 性格特点</h2>
      <div className="flex flex-wrap gap-2">
        {traits.map(trait => {
          const c = TRAIT_COLOR_MAP[trait] || DEFAULT_COLOR
          const tooltip = TRAIT_EXPLANATIONS[trait]
          return (
            <div key={trait} className="relative group">
              {/* Badge */}
              <span
                className={`inline-block px-4 py-2 rounded-full font-medium text-sm border transition-all
                            hover:scale-105 hover:shadow-sm cursor-default
                            ${c.bg} ${c.text} ${c.border}`}
              >
                {trait}
              </span>
              {/* Tooltip */}
              {tooltip && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5
                             bg-panda-900 text-cream text-xs rounded-lg whitespace-nowrap
                             opacity-0 invisible group-hover:opacity-100 group-hover:visible
                             transition-all duration-200 z-10 shadow-lg
                             pointer-events-none"
                >
                  {tooltip}
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2
                                  border-4 border-transparent border-t-panda-900" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
