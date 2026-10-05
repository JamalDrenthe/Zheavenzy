import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Bell, BellOff } from 'lucide-react'
import PageHero from '../components/PageHero'
import { usePlatform } from '../lib/usePlatform'

export default function Notificaties() {
  const { user, notifications, markNotificationsRead } = usePlatform()

  useEffect(() => {
    if (user) markNotificationsRead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user) return <Navigate to="/login" replace />

  return (
    <>
      <PageHero
        eyebrow="Notificaties"
        title={
          <>
            Al je <span className="text-gradient-gold">updates.</span>
          </>
        }
        description="Boekingen, vriendschapsverzoeken, credits en uploads — alles op één plek."
        minHeight="min-h-[40vh]"
      />

      <section className="py-16 bg-[#0a0a0a] border-y border-white/5 min-h-[50vh]">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          {notifications.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <BellOff className="w-10 h-10 text-white/15 mx-auto mb-4" />
              <p className="text-white/40 text-sm">Nog geen notificaties. Boek iemand, volg leden of upload je werk.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...notifications].reverse().map((n) => (
                <div key={n.id} className="glass-card rounded-xl px-5 py-4 flex items-start gap-4">
                  <Bell className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-white/80 text-sm">{n.text}</p>
                    <p className="text-white/30 text-xs mt-1">
                      {new Date(n.ts).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
