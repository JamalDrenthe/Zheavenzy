import { useEffect, useRef, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, MessageSquare, Paperclip, Smile, Mic, CheckCheck, Search } from 'lucide-react'
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
  }, [thread.length, active, typing])

  const openThread = (id: string) => {
    setActive(id)
    setSeen((s) => ({ ...s, [id]: (messages[id] ?? []).filter((m) => m.from === 'them').length }))
    setTyping(false)
  }

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
          {/* WhatsApp-achtige chat: lichte kaart op donkere pagina */}
          <div className="rounded-2xl overflow-hidden shadow-[0_2rem_4rem_-2rem_rgba(0,0,0,0.7)] grid md:grid-cols-[320px_1fr] min-h-[560px] bg-white">
            {/* Contacten */}
            <div className="border-r border-[#e5e5e5] bg-white flex flex-col">
              <div className="px-5 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
                <span className="text-[#333] font-bold text-sm">Chats</span>
                <Search className="w-4 h-4 text-[#999]" />
              </div>
              <div className="flex-1 overflow-y-auto">
                {threadIds.length === 0 ? (
                  <p className="px-5 py-6 text-[#999] text-xs">Nog geen gesprekken. Stuur een bericht vanaf een profielpagina.</p>
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
                        className={`relative w-full text-left flex items-center gap-3 px-4 py-3.5 border-b border-[#f0f0f0] transition-colors ${
                          active === id ? 'bg-[#f5f1e6]' : 'hover:bg-[#f7f7f7]'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#8a6d1d] text-sm font-bold">
                            {initials(m.name)}
                          </div>
                          {unread > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow">
                              {unread}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[#333] font-semibold text-sm truncate">{m.name}</span>
                            {last && (
                              <span className="text-[#999] text-[10px] shrink-0">
                                {new Date(last.ts).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <div className="text-[#999] text-xs truncate mt-0.5 flex items-center gap-1">
                            {last?.from === 'me' && <CheckCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />}
                            <span className="truncate">{last ? last.text : roleLabel(m.role)}</span>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Chat */}
            <div className="flex flex-col bg-[#efeae2]">
              {activeMember ? (
                <>
                  {/* Chat-header */}
                  <div className="px-5 py-3 bg-white border-b border-[#e5e5e5] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#8a6d1d] text-xs font-bold">
                      {initials(activeMember.name)}
                    </div>
                    <div>
                      <div className="text-[#333] font-bold text-sm">{activeMember.name}</div>
                      <div className="text-[#999] text-[11px]">
                        {typing ? 'aan het typen...' : `${roleLabel(activeMember.role)} · online`}
                      </div>
                    </div>
                  </div>

                  {/* Berichten — WhatsApp-achtergrond */}
                  <div
                    className="flex-1 overflow-y-auto px-5 py-4 max-h-[460px]"
                    style={{
                      backgroundColor: '#efeae2',
                      backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
                      backgroundSize: '18px 18px',
                    }}
                  >
                    <div className="text-center mb-4">
                      <span className="bg-[#fdf3c9] text-[#8a6d1d] text-[10px] font-medium px-4 py-1.5 rounded-lg shadow-sm">
                        Vandaag
                      </span>
                    </div>
                    {thread.length === 0 && (
                      <p className="text-[#999] text-xs text-center py-10">
                        Start het gesprek met {activeMember.name.split(' ')[0]}.
                      </p>
                    )}
                    <div className="space-y-2">
                      {thread.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`max-w-[70%] w-fit px-3.5 py-2 text-sm text-[#333] shadow-[0_1px_2px_rgba(0,0,0,0.15)] ${
                            msg.from === 'me'
                              ? 'ml-auto bg-[#e7d8a8] rounded-2xl rounded-br-sm'
                              : 'bg-white rounded-2xl rounded-bl-sm'
                          }`}
                        >
                          {msg.text}
                          <span className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-[#999]">
                            {new Date(msg.ts).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                            {msg.from === 'me' && <CheckCheck className="w-3.5 h-3.5 text-[#8a6d1d]" />}
                          </span>
                        </motion.div>
                      ))}
                      {typing && (
                        <div className="w-fit bg-white rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className="w-2 h-2 rounded-full bg-[#bbb] animate-bounce"
                              style={{ animationDelay: `${d * 200}ms` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div ref={endRef} />
                  </div>

                  {/* Invoer */}
                  <form onSubmit={send} className="bg-[#f0f0f0] px-3 py-2.5 flex items-center gap-2">
                    <Smile className="w-6 h-6 text-[#999] hover:text-[#333] transition-colors cursor-pointer shrink-0" />
                    <Paperclip className="w-6 h-6 text-[#999] hover:text-[#333] transition-colors cursor-pointer shrink-0" />
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Typ een bericht"
                      className="flex-1 bg-white rounded-full px-5 py-2.5 text-[#333] text-sm placeholder-[#999] focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                    />
                    {draft.trim() ? (
                      <button type="submit" className="w-10 h-10 rounded-full bg-[#D4AF37] hover:bg-[#c39f2e] transition-colors flex items-center justify-center shrink-0 shadow">
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    ) : (
                      <Mic className="w-6 h-6 text-[#999] hover:text-[#333] transition-colors cursor-pointer shrink-0" />
                    )}
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#999] p-10">
                  <MessageSquare className="w-10 h-10 mb-4 text-[#ccc]" />
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
