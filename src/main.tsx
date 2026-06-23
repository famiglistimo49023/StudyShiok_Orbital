import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'

import Login from './components/Login'
import Register from './components/Register'
import Explore from './components/Explore'
import Dashboard from './components/Dashboard'
import Maps from './components/Maps'
import Suggest from './components/SuggestSpot'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* navbar tabs */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/suggest" element={<Suggest />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
)