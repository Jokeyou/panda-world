'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MapPin, MessageCircle, Check, AlertCircle, ExternalLink } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

const contactInfo = [
  {
    icon: Mail,
    label: '邮箱',
    value: 'hello@panda-world-one.vercel.app',
    href: 'mailto:hello@panda-world-one.vercel.app',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: MessageCircle,
    label: '微信',
    value: 'PandaWorld_official',
    href: '#',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: MapPin,
    label: '所在地',
    value: '成都 · 中国',
    href: null,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
  },
]

export default function ContactContent() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = '请输入姓名'
    if (!form.email.trim()) {
      errs.email = '请输入邮箱'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = '邮箱格式不正确'
    }
    if (!form.message.trim()) errs.message = '请输入留言内容'
    else if (form.message.trim().length < 6) errs.message = '留言至少需要 6 个字符'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')

    // Simulate API call (replace with real endpoint later)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      setErrors({})
    } catch {
      setStatus('error')
    }
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 rounded-2xl border text-sm transition-all duration-200 outline-none
     bg-white/80 dark:bg-panda-800/80 backdrop-blur-sm
     ${errors[field]
       ? 'border-red-300 dark:border-red-500/50 focus:ring-2 focus:ring-red-400/30'
       : 'border-panda-200 dark:border-panda-700 focus:ring-2 focus:ring-bamboo-400/30 focus:border-bamboo-400'
     }
     placeholder:text-panda-400 dark:placeholder:text-panda-500
     text-panda-900 dark:text-panda-100`

  return (
    <div>
      {/* ── Hero ── */}
      <section className="gradient-hero-enhanced relative overflow-hidden">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block tag-blue mb-6 text-sm">📬 联系我们</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-panda-900 dark:text-panda-100 mb-4 leading-tight tracking-tight">
              我们很想听到
              <br />
              <span className="hero-title-gradient">你的声音</span>
            </h1>
            <p className="text-panda-500 dark:text-panda-400 text-lg leading-relaxed max-w-xl mx-auto">
              任何关于大熊猫的问题、建议或合作意向，欢迎随时联系。
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Form ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
            custom={0}
            className="lg:col-span-3"
          >
            <div className="card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-panda-900 dark:text-panda-100 mb-1 flex items-center gap-2">
                <Send size={20} className="text-bamboo-600 dark:text-bamboo-400" />
                发送消息
              </h2>
              <p className="text-sm text-panda-400 dark:text-panda-500 mb-6">
                填写下方表单，我们会尽快回复
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-panda-700 dark:text-panda-300 mb-1.5">
                    姓名 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }) }}
                    placeholder="你的名字"
                    className={inputClass('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />{errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-panda-700 dark:text-panda-300 mb-1.5">
                    邮箱 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: undefined }) }}
                    placeholder="你的邮箱地址"
                    className={inputClass('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />{errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-panda-700 dark:text-panda-300 mb-1.5">
                    留言 <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: undefined }) }}
                    placeholder="说点什么吧…"
                    className={inputClass('message') + ' resize-none'}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />{errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      发送中…
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      发送消息
                    </>
                  )}
                </button>

                {/* Success / Error feedback */}
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-2xl"
                  >
                    <Check size={16} />
                    消息已发送！我们会尽快回复你 🐼
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-2xl"
                  >
                    <AlertCircle size={16} />
                    发送失败，请稍后再试
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* ── Contact Info ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
            custom={1}
            className="lg:col-span-2"
          >
            <div className="card p-6 sm:p-8 h-full">
              <h2 className="text-xl font-bold text-panda-900 dark:text-panda-100 mb-1 flex items-center gap-2">
                <MapPin size={20} className="text-bamboo-600 dark:text-bamboo-400" />
                联系方式
              </h2>
              <p className="text-sm text-panda-400 dark:text-panda-500 mb-6">
                你也可以通过以下方式找到我们
              </p>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div
                    key={info.label}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-panda-50 dark:hover:bg-panda-800/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl ${info.bg} flex items-center justify-center flex-shrink-0`}>
                      <info.icon size={20} className={info.color} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-panda-400 dark:text-panda-500 mb-0.5">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm font-medium text-panda-800 dark:text-panda-200 hover:text-bamboo-600 dark:hover:text-bamboo-400 transition-colors flex items-center gap-1 break-all"
                        >
                          {info.value}
                          <ExternalLink size={12} className="flex-shrink-0 opacity-50" />
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-panda-800 dark:text-panda-200">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider + Social hint */}
              <div className="mt-8 pt-6 border-t border-panda-100 dark:border-panda-700/50">
                <p className="text-xs text-panda-400 dark:text-panda-500 mb-3">
                  关注我们的社交媒体
                </p>
                <div className="flex items-center gap-3">
                  {/* WeChat */}
                  <a
                    href="#"
                    className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center
                               text-green-600 dark:text-green-400 hover:scale-110 transition-transform"
                    title="微信"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.053 5.032c-2.165 0-4.206.865-5.944 2.388-1.737 1.523-2.698 3.6-2.698 5.845 0 4.282 3.893 7.744 8.642 7.744.762 0 1.514-.117 2.239-.314a.682.682 0 01.563.078l1.494.874a.26.26 0 00.13.043c.127 0 .229-.103.229-.23a.286.286 0 00-.037-.168l-.307-1.16a.463.463 0 01.168-.52C20.303 21.845 22 20.322 22 18.266c0-3.86-3.36-7.005-7.349-7.243zm-3.413 3.67c.504 0 .913.416.913.928a.92.92 0 01-.913.927.92.92 0 01-.913-.927c0-.512.409-.928.913-.928zm4.628 0c.504 0 .913.416.913.928a.92.92 0 01-.913.927.92.92 0 01-.913-.927c0-.512.409-.928.913-.928z"/>
                    </svg>
                  </a>
                  {/* Weibo */}
                  <a
                    href="#"
                    className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center
                               text-red-500 dark:text-red-400 hover:scale-110 transition-transform"
                    title="微博"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-3.965-6.645c-.578 2.808 1.055 4.856 3.75 4.461 2.645-.392 4.323-3.067 3.743-5.67-.58-2.604-2.614-4.41-5.068-4.033-2.457.377-3.882 2.558-2.425 5.242zm13.154-2.671c.223-.103.331-.322.199-.559-.364-.743-.877-1.098-1.014-1.655-.158-.64.088-1.196.458-1.196.287 0 .532.277.77.644.338.517.406.572.857.335.223-.103.331-.322.199-.559-.343-.753-.836-1.439-1.316-1.754-.531-.35-1.148-.35-1.606.042-.656.56-.822 1.385-.507 2.011.27.533.652.842.96 1.317.158.242.149.37-.04.457-.193.088-.376-.04-.551-.195-.294-.261-.624-.558-1.076-.558-.687 0-1.064.606-.86 1.29.185.45.678.772 1.108 1.003.228.124.36.262.36.48 0 .172-.177.262-.392.205-.993-.263-2.04-.89-2.04-2.318 0-1.966 1.762-3.266 3.953-3.266 2.111 0 3.88 1.214 3.88 2.92 0 .667-.305 1.086-.732 1.282z"/>
                    </svg>
                  </a>
                  {/* GitHub */}
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-panda-100 dark:bg-panda-700/50 flex items-center justify-center
                               text-panda-700 dark:text-panda-300 hover:scale-110 transition-transform"
                    title="GitHub"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  {/* Twitter/X */}
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-panda-100 dark:bg-panda-700/50 flex items-center justify-center
                               text-panda-700 dark:text-panda-300 hover:scale-110 transition-transform"
                    title="Twitter / X"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
