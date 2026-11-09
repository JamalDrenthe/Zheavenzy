import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Artiesten from './pages/Artiesten'
import Diensten from './pages/Diensten'
import Studio from './pages/Studio'
import Marketing from './pages/Marketing'
import Events from './pages/Events'
import Platform from './pages/Platform'
import Releases from './pages/Releases'
import Lidmaatschap from './pages/Lidmaatschap'
import Netwerk from './pages/Netwerk'
import Over from './pages/Over'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leden from './pages/Leden'
import Lid from './pages/Lid'
import Berichten from './pages/Berichten'
import Credits from './pages/Credits'
import Instellingen from './pages/Instellingen'
import Notificaties from './pages/Notificaties'
import MuziekApp from './pages/MuziekApp'
import UploadTrack from './pages/UploadTrack'
import TrackDetail from './pages/TrackDetail'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* Zheavenzy Music & Streaming App */}
        <Route path="/app" element={<MuziekApp />} />
        <Route path="/muziek" element={<Navigate to="/app" replace />} />
        <Route path="/app/upload" element={<UploadTrack />} />
        <Route path="/upload" element={<Navigate to="/app/upload" replace />} />
        <Route path="/app/track/:id" element={<TrackDetail />} />
        <Route path="/track/:id" element={<TrackDetail />} />

        <Route path="/diensten" element={<Diensten />} />
        <Route path="/diensten/artiesten" element={<Artiesten />} />
        <Route path="/artiesten" element={<Navigate to="/diensten/artiesten" replace />} />
        <Route path="/diensten/studio" element={<Studio />} />
        <Route path="/diensten/marketing" element={<Marketing />} />
        <Route path="/diensten/events" element={<Events />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/sevenc" element={<Navigate to="/platform" replace />} />
        <Route path="/platform/releases" element={<Releases />} />
        <Route path="/lidmaatschap" element={<Lidmaatschap />} />
        <Route path="/netwerk" element={<Netwerk />} />
        <Route path="/over" element={<Over />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leden" element={<Leden />} />
        <Route path="/leden/:id" element={<Lid />} />
        <Route path="/berichten" element={<Berichten />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/instellingen" element={<Instellingen />} />
        <Route path="/notificaties" element={<Notificaties />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
