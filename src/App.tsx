import './styles/base.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './shared/ui/layout'
import Home from './pages/home'
import Upload from './pages/upload'
import Explore from './pages/explore'
import Favourites from './pages/favourites'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/explore" element={<Explore />} />
      </Route>
    </Routes>
  )
}

export default App
