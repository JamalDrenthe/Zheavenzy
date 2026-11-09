import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { PlatformProvider } from './lib/platform.tsx'
import { TrackProvider } from './context/TrackContext.tsx'
import { PlaylistProvider } from './context/PlaylistContext.tsx'
import { PlayerProvider } from './context/PlayerContext.tsx'
import { Toaster } from './components/ui/sonner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <PlatformProvider>
        <TrackProvider>
          <PlaylistProvider>
            <PlayerProvider>
              <App />
              <Toaster position="top-right" richColors theme="dark" />
            </PlayerProvider>
          </PlaylistProvider>
        </TrackProvider>
      </PlatformProvider>
    </HashRouter>
  </StrictMode>,
)
