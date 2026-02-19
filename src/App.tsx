import './styles/base.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './shared/ui/layout'
import Home from './pages/home'
import Upload from './pages/upload'
import Explore from './pages/explore'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/favourites" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/explore" element={<Explore />} />
      </Route>
    </Routes>
  )
}

export default App
