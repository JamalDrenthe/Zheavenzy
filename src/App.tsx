import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Artiesten from './pages/Artiesten'
import Netwerk from './pages/Netwerk'
import Over from './pages/Over'
import Contact from './pages/Contact'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/artiesten" element={<Artiesten />} />
        <Route path="/netwerk" element={<Netwerk />} />
        <Route path="/over" element={<Over />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}

export default App
