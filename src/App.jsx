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

function App() {
  return (
    <WalletProvider>
      <GameProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen bg-space-gradient bg-crt-lines relative overflow-hidden">
              {/* CRT Scanline Effect */}
              <div className="fixed inset-0 pointer-events-none z-50">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-scanline"></div>
              </div>
              
              {/* Main Content */}
              <div className="relative z-10">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/lobby/:gameId" element={<Lobby />} />
                  <Route path="/game/:gameId" element={<Game />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
              
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