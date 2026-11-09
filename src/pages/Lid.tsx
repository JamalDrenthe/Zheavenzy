import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Coins, MessageSquare, CalendarCheck, CheckCircle2, ArrowLeft, UserPlus, UserCheck, UserPlus2, Users, Play, Pause, Music2, ExternalLink } from 'lucide-react'
import { usePlatform } from '../lib/usePlatform'
import { usePlayer } from '@/context/PlayerContext'
import { useTracks } from '@/context/TrackContext'
import { members, roleLabel, dayLabel, dayISO } from '../lib/data'
import { TrackCover } from '@/components/TrackCover'

const dayOffsets = Array.from({ length: 14 }, (_, i) => i)

export default function Lid() {
  const { id } = useParams()
  const { user, requestBooking, bookings, following, friends, pendingFriends, toggleFollow, requestFriend } = usePlatform()
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()
  const { tracks } = useTracks()
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  const member = members.find((m) => m.id === id)
  if (!user) return <Navigate to="/login" replace />
  if (!member) return <Navigate to="/leden" replace />

  const myBookings = bookings.filter((b) => b.memberId === member.id)
  const isFollowing = following.includes(member.id)
  const isFriend = friends.includes(member.id)
  const isPending = pendingFriends.includes(member.id)
  const followerCount = member.followers + (isFollowing ? 1 : 0)

  // Find tracks matching this member (e.g. Jamal Drenthe)
  const memberTracks = tracks.filter((t) => t.userId === 'jamal-drenthe' || t.userName?.toLowerCase().includes(member.name.toLowerCase()))

  const book = () => {
    if (selected === null) return
    requestBooking(member.id, dayISO(selected))
    setDone(true)
    setSelected(null)
  }

  return (
    <>
      <section className="relative bg-[#050505] pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.05)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <Link to="/leden" className="text-white/40 text-xs hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1.5 mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Terug naar leden
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-black/60 border border-[#D4AF37]/30 flex items-center justify-center p-2 overflow-hidden flex-shrink-0 shadow-xl">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-contain" />
              ) : (
                <div className="text-[#D4AF37] font-bold text-2xl">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
              )}
            </div>
            <div>
              <div className="text-[#D4AF37]/70 text-[10px] font-bold uppercase tracking-[0.2em]">{roleLabel(member.role)}</div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mt-1">{member.name}</h1>
              {member.logoUrl && (
                <div className="mt-2 mb-1 flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">Official Signature:</span>
                  <img src={member.logoUrl} alt={`${member.name} Signature Logo`} className="h-6 w-auto object-contain opacity-90 brightness-110" />
                </div>
              )}
              <p className="text-white/50 mt-1 max-w-xl">{member.tagline}</p>
              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline mt-2 font-medium"
                >
                  <ExternalLink className="w-3 h-3" /> {member.website.replace('https://', '')}
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-3 ml-auto">
              <button
                onClick={() => toggleFollow(member.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isFollowing ? 'bg-[#D4AF37] text-[#050505]' : 'btn-outline'
                }`}
              >
                {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isFollowing ? 'Volgend' : 'Volg'}
              </button>
              <button
                onClick={() => requestFriend(member.id)}
                disabled={isFriend || isPending}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isFriend
                    ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] cursor-default'
                    : isPending
                      ? 'bg-white/5 border border-white/10 text-white/40 cursor-default'
                      : 'btn-outline'
                }`}
              >
                {isFriend ? <UserCheck className="w-4 h-4" /> : <UserPlus2 className="w-4 h-4" />}
                {isFriend ? 'Vrienden' : isPending ? 'Verzoek verstuurd' : 'Vriendschapsverzoek'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-8">
          {/* Profiel & Tracks */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8">
              <div className="flex flex-wrap gap-6 mb-6">
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Skill-rating</div>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(member.stars) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-white/20'}`}
                      />
                    ))}
                    <span className="text-white font-bold ml-1">{member.stars.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Credits-saldo</div>
                  <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
                    <Coins className="w-4 h-4" />
                    {member.credits.toLocaleString('nl-NL')}
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Werken met {member.name.split(' ')[0]}</div>
                  <div className="text-white font-bold">{member.costPerDay} credits / dag</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Volgers</div>
                  <div className="text-white font-bold">{followerCount.toLocaleString('nl-NL')}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Samenwerkingen</div>
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    {member.collabs}
                  </div>
                </div>
              </div>

              <h2 className="text-white font-bold mb-3">Over {member.name.split(' ')[0]}</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">{member.bio}</p>

              <h3 className="text-white font-bold mb-3 text-sm">Diensten</h3>
              <div className="flex flex-wrap gap-2">
                {member.services.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Muziek & Discografie */}
            {memberTracks.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                      <Music2 className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">Muziek & Discografie</h2>
                      <p className="text-white/40 text-xs">{memberTracks.length} officiële tracks op Zheavenzy</p>
                    </div>
                  </div>
                  <Link
                    to="/app"
                    className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    Open in Zheavenzy App
                  </Link>
                </div>

                <div className="space-y-2">
                  {memberTracks.map((trk, idx) => {
                    const isCurrent = currentTrack?.id === trk.id
                    const isTrkPlaying = isCurrent && isPlaying
                    return (
                      <div
                        key={trk.id}
                        className={`group flex items-center gap-3.5 p-3 rounded-xl transition-all border ${
                          isCurrent
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-white'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-[#D4AF37]/20 text-white/90'
                        }`}
                      >
                        <button
                          onClick={() => {
                            if (isCurrent) {
                              togglePlay()
                            } else {
                              playTrack(trk)
                            }
                          }}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                            isTrkPlaying
                              ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30'
                              : 'bg-white/10 group-hover:bg-[#D4AF37] group-hover:text-black text-white'
                          }`}
                          aria-label={isTrkPlaying ? 'Pauzeer' : 'Speel af'}
                        >
                          {isTrkPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                          <TrackCover track={trk} size="sm" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/track/${trk.id}`}
                            className="font-semibold text-sm hover:text-[#D4AF37] transition-colors truncate block"
                          >
                            {trk.title}
                          </Link>
                          <div className="text-white/40 text-xs flex items-center gap-2 mt-0.5">
                            <span>#{idx + 1}</span>
                            <span>•</span>
                            <span>{trk.genre || 'Hip-Hop / Urban'}</span>
                            {trk.bpm && (
                              <>
                                <span>•</span>
                                <span>{trk.bpm} BPM</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="text-right text-xs text-white/40 flex flex-col items-end flex-shrink-0">
                          <span className="font-mono text-white/70">
                            {trk.durationFormatted || `${Math.floor(trk.duration / 60)}:${String(Math.floor(trk.duration % 60)).padStart(2, '0')}`}
                          </span>
                          <span className="text-[10px] text-[#D4AF37]/70">
                            {(trk.playsCount || 0).toLocaleString('nl-NL')} streams
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Kalender */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-8">
              <h2 className="text-white font-bold mb-1 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#D4AF37]" />
                Beschikbaarheid
              </h2>
              <p className="text-white/40 text-xs mb-5">
                {member.directBook ? 'Direct boeken staat aan: kies een gewenste dag.' : 'Deze professional werkt op aanvraag: kies een dag om een aanvraag te sturen.'}
              </p>
              <div className="grid grid-cols-7 gap-2">
                {dayOffsets.map((o) => {
                  const free = member.available.includes(o)
                  const isSel = selected === o
                  return (
                    <button
                      key={o}
                      disabled={!free}
                      onClick={() => setSelected(isSel ? null : o)}
                      className={`rounded-lg py-3 text-center text-xs font-medium transition-all ${
                        isSel
                          ? 'bg-[#D4AF37] text-[#050505] font-bold'
                          : free
                            ? 'bg-[#1a1a1a] border border-[#D4AF37]/20 text-white/80 hover:border-[#D4AF37]/60'
                            : 'bg-[#0d0d0d] text-white/20 cursor-not-allowed'
                      }`}
                    >
                      {dayLabel(o)}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={book}
                disabled={selected === null}
                className="w-full btn-gold glow-gold mt-6 py-3.5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {member.directBook ? 'Boek direct' : 'Stuur boekingsaanvraag'}
                {selected !== null ? ` voor ${dayLabel(selected)}` : ''}
              </button>
              {done && (
                <p className="text-[#D4AF37] text-xs font-semibold mt-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {member.directBook ? 'Boeking bevestigd! Ook te zien in je dashboard en berichten.' : 'Aanvraag verstuurd! Je krijgt bericht zodra er gereageerd is.'}
                </p>
              )}
              {myBookings.length > 0 && (
                <div className="mt-5 pt-5 border-t border-white/10 space-y-2">
                  {myBookings.map((b, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-white/60">{b.date}</span>
                      <span className={`font-bold uppercase tracking-wider ${b.status === 'bevestigd' ? 'text-[#D4AF37]' : 'text-white/40'}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Acties */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-8">
              <h3 className="text-white font-bold mb-4">Direct contact</h3>
              <p className="text-white/40 text-xs leading-relaxed mb-5">
                Stuur {member.name.split(' ')[0]} een direct bericht via het platform om samenwerking te bespreken.
              </p>
              <Link
                to={`/berichten?to=${member.id}`}
                className="btn-outline w-full flex items-center justify-center gap-2 py-3.5"
              >
                <MessageSquare className="w-4 h-4" />
                Stuur een bericht
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-8">
              <h3 className="text-white font-bold mb-3 text-sm">Zo werkt samenwerken</h3>
              <ul className="space-y-3 text-xs text-white/50 leading-relaxed">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> Boek of stuur een aanvraag met de kalender</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> Betaal eenvoudig met credits ({member.costPerDay} per dag)</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> Bespreek details via direct messages</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
