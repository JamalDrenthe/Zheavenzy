import { useEffect, useRef, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, MessageSquare } from 'lucide-react'
import PageHero from '../components/PageHero'
import { usePlatform } from '../lib/usePlatform'
import { members, roleLabel } from '../lib/data'

export default function Berichten() {
  const { user, messages, sendMessage } = usePlatform()
  const [params] = useSearchParams()
  const [active, setActive] = useState<string | null>(params.get('to'))
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, active])

  if (!user) return <Navigate to="/login" replace />

  const activeMember = members.find((m) => m.id === active)
  const thread = active ? (messages[active] ?? []) : []
  const threadIds = [...new Set([...Object.keys(messages), ...(active ? [active] : [])])]

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!active || !draft.trim()) return
    sendMessage(active, draft.trim())
    setDraft('')
  }

  return (
    <>
      <PageHero
        eyebrow="Direct Messages"
        title={
          <>
            Praat direct met <span className="text-gradient-gold">het netwerk.</span>
          </>
        }
        description="Berichten tussen accounts — bespreek samenwerkingen, boekingen en ideeën."
        minHeight="min-h-[40vh]"
      />

      <section className="py-16 bg-[#0a0a0a] border-y border-white/5 min-h-[55vh]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="glass-card rounded-3xl overflow-hidden grid md:grid-cols-[280px_1fr] min-h-[480px]">
            {/* Gesprekken */}
            <div className="border-r border-white/10 bg-[#0d0d0d]">
              <div className="px-5 py-4 border-b border-white/10 text-white/40 text-xs uppercase tracking-wider font-bold">
                Gesprekken
              </div>
              {threadIds.length === 0 ? (
                <p className="px-5 py-6 text-white/30 text-xs">Nog geen gesprekken. Stuur een bericht vanaf een profielpagina.</p>
              ) : (
                threadIds.map((id) => {
                  const m = members.find((mm) => mm.id === id)
                  if (!m) return null
                  const last = (messages[id] ?? []).at(-1)
                  return (
                    <button
                      key={id}
                      onClick={() => setActive(id)}
                      className={`w-full text-left px-5 py-4 border-b border-white/5 transition-colors ${
                        active === id ? 'bg-[#D4AF37]/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="text-white font-semibold text-sm">{m.name}</div>
                      <div className="text-[#D4AF37]/60 text-[10px] uppercase tracking-wider">{roleLabel(m.role)}</div>
                      {last && <div className="text-white/30 text-xs mt-1 truncate">{last.text}</div>}
                    </button>
                  )
                })
              )}
            </div>

            {/* Chat */}
            <div className="flex flex-col">
              {activeMember ? (
                <>
                  <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] text-xs font-bold">
                      {activeMember.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{activeMember.name}</div>
                      <div className="text-white/30 text-[10px] uppercase tracking-wider">{roleLabel(activeMember.role)}</div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 max-h-[420px]">
                    {thread.length === 0 && (
                      <p className="text-white/30 text-xs text-center py-10">
                        Start het gesprek met {activeMember.name.split(' ')[0]}.
                      </p>
                    )}
                    {thread.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                          msg.from === 'me'
                            ? 'ml-auto bg-[#D4AF37] text-[#050505]'
                            : 'bg-[#1a1a1a] text-white/80 border border-white/10'
                        }`}
                      >
                        {msg.text}
                        <div className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-[#050505]/50' : 'text-white/25'}`}>
                          {new Date(msg.ts).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={endRef} />
                  </div>
                  <form onSubmit={send} className="border-t border-white/10 p-4 flex gap-3">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={`Bericht aan ${activeMember.name.split(' ')[0]}...`}
                      className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
                    />
                    <button type="submit" className="btn-gold px-5 flex items-center gap-2 text-sm">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-white/30 p-10">
                  <MessageSquare className="w-10 h-10 mb-4 text-white/15" />
                  <p className="text-sm">Kies een gesprek of stuur een bericht vanaf een profielpagina.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
