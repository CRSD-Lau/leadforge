'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type FormState = 'idle' | 'sending' | 'success' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setState('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try calling directly.')
      setState('error')
    }
  }

  return (
    <>
      {/* Header */}
      <section className="relative bg-navy-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-500/6 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-tag mb-4 block">Get In Touch</span>
            <h1 className="font-sans font-extrabold text-5xl sm:text-6xl text-white leading-tight mb-5">
              {"Let's build your"}{' '}
              <span className="text-gradient-orange">website.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Fill in the form and Neil will respond within one business day. Or skip it and call directly.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {state === 'success' ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-navy bg-green-500/5 border-green-500/20 text-center py-16"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-400">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="font-sans font-bold text-xl text-white mb-2">Message sent!</h3>
                    <p className="font-sans text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Neil will get back to you within one business day.{' '}
                      <a href="tel:5066399083" className="text-orange-400 hover:text-orange-300 underline">
                        Call 506-639-9083
                      </a>{' '}
                      if urgent.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'name',     label: 'Your Name',      placeholder: 'Jane Smith',         required: true,  type: 'text'  },
                        { name: 'business', label: 'Business Name',  placeholder: 'Smith Plumbing Co.', required: true,  type: 'text'  },
                        { name: 'email',    label: 'Email Address',  placeholder: 'jane@smithplumbing.ca', required: true, type: 'email' },
                        { name: 'phone',    label: 'Phone (optional)', placeholder: '506-555-0100',     required: false, type: 'tel'   },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block font-mono text-xs text-slate-500 uppercase tracking-widest mb-2">
                            {field.label}{field.required && <span className="text-orange-500 ml-1">*</span>}
                          </label>
                          <input
                            type={field.type} name={field.name} required={field.required}
                            value={form[field.name as keyof typeof form]} onChange={handleChange}
                            placeholder={field.placeholder}
                            disabled={state === 'sending'}
                            className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 font-sans text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all disabled:opacity-50"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-slate-500 uppercase tracking-widest mb-2">
                        Tell us about your business
                      </label>
                      <textarea
                        name="message" rows={5} value={form.message} onChange={handleChange}
                        disabled={state === 'sending'}
                        placeholder="What does your business do? What pages do you need? Any design preferences?"
                        className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 font-sans text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all resize-none disabled:opacity-50"
                      />
                    </div>

                    {state === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-red-400 flex-shrink-0">
                          <path d="M8 5v4M8 11h.01M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span className="font-sans text-sm text-red-300">{errorMsg}</span>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={state === 'sending'}
                      className="btn-orange w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:-translate-y-0"
                    >
                      {state === 'sending' ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Sending…
                        </span>
                      ) : 'Send Message →'}
                    </button>

                    <p className="font-sans text-xs text-slate-600 text-center">
                      Or just reply to our outreach email — we will get the conversation going from there.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-5"
            >
              {/* Contact details */}
              <div className="card-navy">
                <h3 className="font-sans font-bold text-white text-base mb-5">Prefer to call?</h3>
                <div className="space-y-4">
                  {[
                    { icon: '☎', label: 'Phone',    value: '506-639-9083',       href: 'tel:5066399083' },
                    { icon: '@', label: 'Email',    value: 'neil@leadforge-ai.ca', href: 'mailto:neil@leadforge-ai.ca' },
                    { icon: '◎', label: 'Location', value: 'Saint John, NB, Canada', href: null },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-mono text-orange-500 text-sm">{item.icon}</span>
                      </div>
                      <div>
                        <div className="font-mono text-xs text-slate-600 uppercase tracking-wider">{item.label}</div>
                        {item.href ? (
                          <a href={item.href} className="font-sans text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors">{item.value}</a>
                        ) : (
                          <span className="font-sans text-sm font-medium text-slate-300">{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What happens next */}
              <div className="card-navy bg-orange-500/5 border-orange-500/20">
                <h3 className="font-sans font-bold text-white text-base mb-4">What happens next?</h3>
                <ol className="space-y-3">
                  {[
                    'Neil responds within 1 business day',
                    'We schedule a 15-min discovery call',
                    'Build starts within 24hrs of the call',
                    'Live site in 3–5 days',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-mono text-xs text-orange-500 w-5 flex-shrink-0 mt-0.5">0{i + 1}</span>
                      <span className="font-sans text-sm text-slate-400">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Price card */}
              <div className="card-navy bg-navy-900 border-navy-600">
                <div className="font-mono text-xs text-orange-500 tracking-widest uppercase mb-2">Pricing</div>
                <div className="font-sans font-extrabold text-4xl text-white mb-1">$650</div>
                <div className="font-sans text-sm text-slate-500 mb-3">flat rate · one-time</div>
                <div className="font-sans text-xs text-slate-600">Post-launch: $75/hr · No minimum · 10-min prorate</div>
              </div>

              {/* Response time badge */}
              <div className="flex items-center gap-3 px-4 py-3 bg-navy-900 border border-navy-600 rounded-xl">
                <span className="dot-orange animate-pulse-slow flex-shrink-0" />
                <div>
                  <p className="font-mono text-xs text-orange-400">Typical response: same day</p>
                  <p className="font-sans text-xs text-slate-600 mt-0.5">Mon–Fri · Atlantic time</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
