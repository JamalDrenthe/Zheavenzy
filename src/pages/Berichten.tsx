import { useEffect, useRef, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, MessageSquare, Paperclip, Smile, Mic } from 'lucide-react'
import PageHero from '../components/PageHero'
import { usePlatform } from '../lib/usePlatform'
import { members, roleLabel } from '../lib/data'

const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2)

export default function Berichten() {
  const { user, messages, sendMessage } = usePlatform()
  const [params] = useSearchParams()
  const [active, setActive] = useState<string | null>(params.get('to'))
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [seen, setSeen] = useState<Record<string, number>>({})
  const endRef = useRef<HTMLDivElement>(null)

  const thread = active ? (messages[active] ?? []) : []

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.length, active])

  const openThread = (id: string) => {
    setActive(id)
    setSeen((s) => ({ ...s, [id]: (messages[id] ?? []).filter((m) => m.from === 'them').length }))
    setTyping(false)
  }

  // Markeer actieve thread als gelezen + typing-indicator zolang laatste bericht van mij is
  useEffect(() => {
    if (!active) return
    const incoming = thread.filter((m) => m.from === 'them').length
    const last = thread.at(-1)
    if (last?.from === 'me' && Date.now() - last.ts < 4000) {
      setTyping(true)
    } else {
      setTyping(false)
      setSeen((s) => ({ ...s, [active]: incoming }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread.length, active])

  if (!user) return <Navigate to="/login" replace />

  const activeMember = members.find((m) => m.id === active)
  const threadIds = [...new Set([...Object.keys(messages), ...(active ? [active] : [])])]
  const unreadFor = (id: string) =>
    Math.max(0, (messages[id] ?? []).filter((m) => m.from === 'them').length - (seen[id] ?? 0))

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
          <div className="glass-card rounded-3xl overflow-hidden grid md:grid-cols-[300px_1fr] min-h-[520px]">
            {/* Contacten */}
            <div className="border-r border-white/10 bg-[#0d0d0d] flex flex-col">
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-white/40 text-xs uppercase tracking-wider font-bold">Contacten</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {threadIds.length === 0 ? (
                  <p className="px-5 py-6 text-white/30 text-xs">Nog geen gesprekken. Stuur een bericht vanaf een profielpagina.</p>
                ) : (
                  threadIds.map((id) => {
                    const m = members.find((mm) => mm.id === id)
                    if (!m) return null
                    const last = (messages[id] ?? []).at(-1)
                    const unread = unreadFor(id)
                    return (
                      <button
                        key={id}
                        onClick={() => openThread(id)}
                        className={`relative w-full text-left flex items-center gap-3 px-4 py-4 border-b border-white/5 transition-colors ${
                          active === id ? 'bg-[#D4AF37]/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-xs font-bold">
                            {initials(m.name)}
                          </div>
                          {unread > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#050505] text-[9px] font-bold rounded-full min-w-4 h-4 flex items-center justify-center px-1">
                              {unread}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-semibold text-sm truncate">{m.name}</div>
                          <div className="text-[#D4AF37]/60 text-[10px] uppercase tracking-wider">{roleLabel(m.role)}</div>
                          {last && <div className="text-white/30 text-xs mt-0.5 truncate">{last.text}</div>}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Chat */}
            <div className="flex flex-col">
              {activeMember ? (
                <>
                  {/* Chat-header */}
                  <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3 bg-[#0d0d0d]">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-xs font-bold">
                      {initials(activeMember.name)}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{activeMember.name}</div>
                      <div className="text-white/30 text-[10px] uppercase tracking-wider">
                        {typing ? 'typt...' : `${roleLabel(activeMember.role)} · gezien vandaag`}
                      </div>
                    </div>
                  </div>

                  {/* Berichten */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 max-h-[440px] bg-[#0b0b0b] shadow-[inset_0_2rem_2rem_-2rem_rgba(0,0,0,0.4),inset_0_-2rem_2rem_-2rem_rgba(0,0,0,0.4)]">
                    <div className="text-center mb-4">
                      <span className="bg-[#1a1a1a] text-white/30 text-[10px] uppercase tracking-wider px-4 py-1 rounded-full border border-white/10">
                        Vandaag
                      </span>
                    </div>
                    {thread.length === 0 && (
                      <p className="text-white/30 text-xs text-center py-10">
                        Start het gesprek met {activeMember.name.split(' ')[0]}.
                      </p>
                    )}
                    <div className="space-y-3">
                      {thread.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`max-w-[70%] w-fit px-4 py-3 text-sm shadow-lg shadow-black/30 ${
                            msg.from === 'me'
                              ? 'ml-auto bg-[#D4AF37] text-[#050505] rounded-2xl rounded-br-none'
                              : 'bg-[#1a1a1a] text-white/85 border border-white/10 rounded-2xl rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                          <div className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-[#050505]/50 text-right' : 'text-white/25'}`}>
                            {new Date(msg.ts).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </motion.div>
                      ))}
                      {typing && (
                        <div className="w-fit bg-[#1a1a1a] border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1.5">
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className="w-2 h-2 rounded-full bg-white/30 animate-bounce"
                              style={{ animationDelay: `${d * 200}ms` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div ref={endRef} />
                  </div>

                  {/* Invoer */}
                  <form onSubmit={send} className="border-t border-white/10 px-4 py-3 flex items-center gap-2 bg-[#0d0d0d]">
                    <Paperclip className="w-5 h-5 text-white/25 hover:text-[#D4AF37] transition-colors cursor-pointer shrink-0" />
                    <Smile className="w-5 h-5 text-white/25 hover:text-[#D4AF37] transition-colors cursor-pointer shrink-0" />
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={`Bericht aan ${activeMember.name.split(' ')[0]}...`}
                      className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-full px-5 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 shadow-inner shadow-black/30"
                    />
                    <Mic className="w-5 h-5 text-white/25 hover:text-[#D4AF37] transition-colors cursor-pointer shrink-0" />
                    <button type="submit" className="btn-gold glow-gold w-10 h-10 rounded-full flex items-center justify-center shrink-0 !px-0">
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
