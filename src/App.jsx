import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from './contexts/WalletContext'
import { GameProvider } from './contexts/GameContext'
import { SocketProvider } from './contexts/SocketContext'
import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Playground from './pages/Playground'

import DevTools from './components/DevTools'
const TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';

function App() {
  return (
    <WalletProvider>
      <GameProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen bg-space-gradient bg-crt-lines relative overflow-hidden">
              {/* --- PIXEL ART ARCADE BACKGROUND --- */}
              <div className="arcade-bg-pixel absolute inset-0 w-full h-full z-0 pointer-events-none"></div>

              {/* CRT/Arcade Scanline & Glow Effect */}
              <div className="crt-effect">
                <div className="crt-scanlines"></div>
                <div className="crt-glow"></div>
              </div>

              {/* --- ANIMATED SPRITE OVERLAY --- */}
              <div className="arcade-sprite-overlay absolute inset-0 w-full h-full z-10 pointer-events-none"></div>

              {/* Main Content */}
              <div className="relative z-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/lobby/:gameId" element={<Lobby />} />
                  <Route path="/game/:gameId" element={<Game />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/playground" element={<Playground />} />
                </Routes>
              </div>

              {/* DevTools Overlay for TEST MODE */}
              {/* {TEST_MODE && <DevTools />} */}

              {/* Toast Notifications */}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1a1a3a',
                    color: '#00ffff',
                    border: '1px solid #00ffff',
                    borderRadius: '8px',
                    fontFamily: 'Orbitron, monospace',
                  },
                }}
              />
            </div>
          </Router>
        </SocketProvider>
      </GameProvider>
    </WalletProvider>
  )
}

export default App