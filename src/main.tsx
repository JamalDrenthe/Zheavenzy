import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { PlatformProvider } from './lib/platform.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <PlatformProvider>
        <App />
      </PlatformProvider>
    </HashRouter>
  </StrictMode>,
)
