const TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'
import { useSocket } from '../contexts/SocketContext'
import PlayerAvatar from '../components/PlayerAvatar'
import ChatBox from '../components/ChatBox'
import toast from 'react-hot-toast'
import { Copy, Users, Clock, ArrowLeft, Share2 } from 'lucide-react'

const Lobby = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { currentGame, currentPlayer } = useGame()
  const { messages, sendMessage } = useSocket()
  const [countdown, setCountdown] = useState(null)
  const [isChatMinimized, setIsChatMinimized] = useState(true)
  const [copied, setCopied] = useState(false)

  // Redirect to game when it starts
  useEffect(() => {
    if (currentGame?.status === 'playing') {
      navigate(`/game/${gameId}`)
    }
  }, [currentGame?.status, gameId, navigate])

  // Start countdown when 3 players join
  useEffect(() => {
    if (currentGame?.players?.length === 3 && currentGame.status === 'waiting') {
      setCountdown(TEST_MODE ? 1 : 5)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return null
          }
          return prev - 1
        })
      }, TEST_MODE ? 200 : 1000)
      return () => clearInterval(timer)
    }
  }, [currentGame?.players?.length, currentGame?.status])

  const copyGameId = async () => {
    try {
      await navigator.clipboard.writeText(gameId)
      setCopied(true)
      toast.success('Game ID copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy Game ID')
    }
  }

  const shareGame = async () => {
    const shareData = {
      title: 'Join my Lucky Ladders game!',
      text: `Join my Gorbagana Gambit: Lucky Ladders game with ID: ${gameId}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`Join my Lucky Ladders game! Game ID: ${gameId} - ${window.location.href}`)
        toast.success('Game link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleLeaveGame = () => {
    navigate('/')
    toast.info('Left the lobby')
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* CRT/Arcade overlays intensified */}
        <div className="crt-effect">
          <div className="crt-scanlines"></div>
          <div className="crt-glow"></div>
          <div className="crt-static"></div>
        </div>
        <div className="arcade-bg-pixel absolute inset-0 w-full h-full z-0 pointer-events-none animate-bg-float"></div>
        <div className="arcade-sprite-overlay absolute inset-0 w-full h-full z-10 pointer-events-none"></div>
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none"></div>
        <div className="text-center relative z-30">
          <div className="loading-spinner mx-auto mb-4 animate-glow-flicker" />
          <div className="text-neon-cyan text-lg pixel-text retro-glow animate-glow-flicker">Loading game...</div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-4 bg-black relative overflow-hidden">
      {/* CRT/Arcade overlays intensified */}
      <div className="crt-effect">
        <div className="crt-scanlines"></div>
        <div className="crt-glow"></div>
        <div className="crt-static"></div>
      </div>
      <div className="arcade-bg-pixel absolute inset-0 w-full h-full z-0 pointer-events-none animate-bg-float"></div>
      <div className="arcade-sprite-overlay absolute inset-0 w-full h-full z-10 pointer-events-none"></div>
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none"></div>
      <div className="max-w-4xl mx-auto relative z-30">
        {/* Header - arcade style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold pixel-text retro-glow animate-glow mb-2 drop-shadow-neon animate-crt-flicker tracking-widest text-neon-cyan">
            <span className="block text-neon-yellow animate-glow-flicker">GAME</span>
            <span className="block text-neon-pink animate-glow-flicker">LOBBY</span>
          </h1>
          <div className="flex items-center justify-center space-x-4 text-neon-cyan mt-2">
            <span className="text-lg pixel-text">Game ID:</span>
            <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-4 py-2 border-2 border-neon-cyan/80 retro-border shadow-lg">
              <span className="font-mono text-xl font-bold text-neon-yellow">{gameId}</span>
              <motion.button
                onClick={copyGameId}
                className="text-neon-cyan hover:text-neon-pink transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {copied ? '✓' : <Copy className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Lobby Panel - neon arcade style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="game-panel retro-border p-8 mb-6 shadow-2xl animate-crt-flicker"
        >
          {/* Game Status */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Users className="w-6 h-6 text-neon-cyan animate-pulse" />
              <span className="text-2xl font-bold text-neon-cyan">
                {currentGame.players.length}/3 PLAYERS
              </span>
            </div>
            {countdown && (
              <motion.div
                key={countdown}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="countdown-number text-6xl font-bold text-neon-yellow mb-4 animate-glow-flicker"
              >
                {countdown}
              </motion.div>
            )}
            <div className="text-lg text-neon-pink pixel-text animate-glow-flicker">
              {currentGame.players.length < 3 
                ? 'Waiting for more players to join...'
                : countdown 
                  ? 'Game starting soon!'
                  : 'Ready to start!'
              }
            </div>
          </div>

          {/* Players Grid - neon arcade style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AnimatePresence>
              {Array.from({ length: 3 }).map((_, index) => {
                const player = currentGame.players[index]
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      relative p-6 rounded-lg border-2 transition-all duration-300 neon-panel
                      ${player 
                        ? 'bg-gradient-to-b from-neon-cyan/10 to-neon-pink/10 border-neon-cyan retro-border shadow-xl animate-crt-flicker' 
                        : 'bg-gray-800/30 border-gray-600 border-dashed'
                      }
                    `}
                  >
                    {player ? (
                      <div className="text-center space-y-4">
                        <PlayerAvatar
                          player={player}
                          isCurrentPlayer={currentPlayer?.id === player.id}
                          size="lg"
                        />
                        <div>
                          <div className="font-bold text-lg text-white mb-1 pixel-text">
                            {player.name}
                          </div>
                          <div className="text-sm text-gray-400 font-mono">
                            {player.address.slice(0, 8)}...
                          </div>
                          <div className="text-sm text-neon-yellow font-bold mt-2">
                            {player.gorbaBalance} GORBA
                          </div>
                          {currentPlayer?.id === player.id && (
                            <div className="text-xs text-neon-green font-bold mt-1 animate-pulse">
                              YOU
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="text-gray-500">
                          Waiting for player...
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Game Info - neon arcade style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-black/30 rounded-lg p-4 border border-neon-cyan/30 retro-border">
              <div className="text-neon-cyan font-bold text-sm mb-1 pixel-text">ENTRY FEE</div>
              <div className="text-2xl font-bold text-neon-yellow pixel-text">3 GORBA</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-neon-pink/30 retro-border">
              <div className="text-neon-pink font-bold text-sm mb-1 pixel-text">TOTAL POT</div>
              <div className="text-2xl font-bold text-neon-yellow pixel-text">{currentGame.pot} GORBA</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-neon-green/30 retro-border">
              <div className="text-neon-green font-bold text-sm mb-1 pixel-text">LEVELS</div>
              <div className="text-2xl font-bold text-neon-yellow pixel-text">10</div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons - neon arcade style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={shareGame}
            className="neon-button border-neon-green text-neon-green hover:bg-neon-green/10 pixel-text retro-glow animate-glow-flicker"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>SHARE GAME</span>
            </div>
          </motion.button>
          <motion.button
            onClick={handleLeaveGame}
            className="neon-button border-red-400 text-red-400 hover:bg-red-400/10 pixel-text retro-glow animate-glow-flicker"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>LEAVE LOBBY</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Game Rules - neon arcade style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 game-panel retro-border p-6 shadow-xl animate-crt-flicker"
        >
          <h3 className="text-xl font-bold text-neon-cyan mb-4 text-center pixel-text">GAME RULES</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <div className="text-neon-yellow font-bold mb-2">🎯 OBJECTIVE</div>
              <p>Be the first to reach Level 10 or be the last player standing to win the entire pot!</p>
            </div>
            <div>
              <div className="text-neon-pink font-bold mb-2">🚪 DOORS</div>
              <p>Each level has 3 doors. Only 1 is safe, the other 2 are traps that eliminate you.</p>
            </div>
            <div>
              <div className="text-neon-green font-bold mb-2">💰 BRIBES</div>
              <p>Spend 1 GORBA to increase your safe door chance by 10% for that level.</p>
            </div>
            <div>
              <div className="text-neon-cyan font-bold mb-2">🏆 WINNING</div>
              <p>Winner takes all GORBA in the pot. Good luck and choose wisely!</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ChatBox and Particles */}
      <ChatBox
        messages={messages}
        onSendMessage={sendMessage}
        currentPlayer={currentPlayer}
        isMinimized={isChatMinimized}
        onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
      />
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle animate-glow-flicker"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
}

export default Lobby;