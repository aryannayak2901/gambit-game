import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'
import { useSocket } from '../contexts/SocketContext'
import Ladder from '../components/Ladder'
import GameHUD from '../components/GameHUD'
import ChatBox from '../components/ChatBox'
import toast from 'react-hot-toast'
import { ArrowLeft, Home } from 'lucide-react'

import DevTools from '../components/DevTools'
const TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';

const Game = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { currentGame, currentPlayer, selectDoor, useBribe } = useGame()
  const { messages, sendMessage, selectDoor: socketSelectDoor, useBribe: socketUseBribe } = useSocket()
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [gameEndModal, setGameEndModal] = useState(false)

  // DevTools state
  const [devSafeDoor, setDevSafeDoor] = useState(undefined)

  // Handle game end
  useEffect(() => {
    if (currentGame?.status === 'finished') {
      setGameEndModal(true)
    }
  }, [currentGame?.status])

  // Handle door selection
  const handleDoorSelect = async (doorIndex, level) => {
    if (!currentGame || !currentPlayer) {
      toast.error('Game not found')
      return false
    }

    try {
      // Use socket for real-time updates
      socketSelectDoor(gameId, doorIndex, level)
      
      // Also update local state
      const result = await selectDoor(doorIndex, level)
      return result
    } catch (error) {
      console.error('Error selecting door:', error)
      toast.error('Failed to select door')
      return false
    }
  }

  // DevTools actions
  const handleDevSkipLevel = () => {
    // Instantly move player up one level (mock)
    if (currentGame && currentPlayer) {
      // Simulate correct door selection
      handleDoorSelect(currentGame.safeDoors[currentGame.currentLevel], currentGame.currentLevel)
    }
  }

  const handleDevRevealSafeDoor = () => {
    if (currentGame) {
      setDevSafeDoor(currentGame.safeDoors[currentGame.currentLevel])
    }
  }

  const handleDevForceTrap = () => {
    // Simulate trap (wrong door)
    if (currentGame && currentPlayer) {
      let wrongDoor = [0,1,2].find(d => d !== currentGame.safeDoors[currentGame.currentLevel])
      handleDoorSelect(wrongDoor, currentGame.currentLevel)
    }
  }

  const handleDevAutoWin = () => {
    // Instantly win the game (mock)
    if (currentGame && currentPlayer) {
      for (let lvl = currentGame.currentLevel; lvl <= 10; lvl++) {
        handleDoorSelect(currentGame.safeDoors[lvl], lvl)
      }
    }
  }

  // Handle bribe usage
  const handleBribe = async (level) => {
    if (!currentGame || !currentPlayer) {
      toast.error('Game not found')
      return false
    }

    try {
      // Use socket for real-time updates
      socketUseBribe(gameId, level)
      
      // Also update local state
      const result = await useBribe(level)
      return result
    } catch (error) {
      console.error('Error using bribe:', error)
      toast.error('Failed to use bribe')
      return false
    }
  }

  const handleLeaveGame = () => {
    navigate('/')
    toast.info('Left the game')
  }

  const handlePlayAgain = () => {
    navigate('/')
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <div className="text-neon-cyan text-lg">Loading game...</div>
        </div>
      </div>
    )
  }

  const winner = currentGame.players.find(p => p.status === 'winner')
  const isCurrentPlayerWinner = winner?.id === currentPlayer?.id

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
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
        {/* Extra animated overlays or particles can go here */}
      </div>
      {/* DevTools Overlay (only in TEST MODE) */}
      {TEST_MODE && (
        <DevTools
          onSkipLevel={handleDevSkipLevel}
          onRevealSafeDoor={handleDevRevealSafeDoor}
          onForceTrap={handleDevForceTrap}
          onAutoWin={handleDevAutoWin}
          safeDoor={devSafeDoor}
          currentLevel={currentGame.currentLevel}
        />
      )}
      {/* Game HUD */}
      <GameHUD 
        game={currentGame} 
        currentPlayer={currentPlayer}
      />

      {/* Main Game Area */}
      <div className="pt-32 pb-8">
        <Ladder
          game={currentGame}
          currentPlayer={currentPlayer}
          onDoorSelect={handleDoorSelect}
          onBribe={handleBribe}
        />
      </div>

      {/* Game Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 flex space-x-4 z-50"
      >
        <motion.button
          onClick={handleLeaveGame}
          className="neon-button border-red-400 text-red-400 hover:bg-red-400/10 px-4 py-2 pixel-text retro-glow animate-glow-flicker"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>LEAVE</span>
          </div>
        </motion.button>
      </motion.div>

      {/* Chat */}
      <ChatBox
        messages={messages}
        onSendMessage={sendMessage}
        currentPlayer={currentPlayer}
        isMinimized={isChatMinimized}
        onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
      />

      {/* Game End Modal */}
      {gameEndModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="game-panel retro-border p-8 max-w-md mx-4 text-center shadow-2xl animate-glow-flicker"
          >
            {isCurrentPlayerWinner ? (
              <div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4 animate-glow-flicker"
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold text-neon-yellow mb-4 animate-glow pixel-text retro-glow">
                  VICTORY!
                </h2>
                <p className="text-neon-cyan mb-2 pixel-text animate-glow-flicker">
                  Congratulations! You won the game!
                </p>
                <div className="text-2xl font-bold text-neon-yellow mb-6 pixel-text animate-glow-flicker">
                  +{currentGame.pot} GORBA
                </div>
              </div>
            ) : winner ? (
              <div>
                <div className="text-4xl mb-4 animate-glow-flicker">💀</div>
                <h2 className="text-3xl font-bold text-red-400 mb-4 pixel-text retro-glow animate-glow-flicker">
                  GAME OVER
                </h2>
                <p className="text-neon-cyan mb-2 pixel-text animate-glow-flicker">
                  {winner.name} won the game!
                </p>
                <div className="text-xl text-neon-yellow mb-6 pixel-text animate-glow-flicker">
                  They won {currentGame.pot} GORBA
                </div>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-4 animate-glow-flicker">🤝</div>
                <h2 className="text-3xl font-bold text-neon-cyan mb-4 pixel-text retro-glow animate-glow-flicker">
                  GAME ENDED
                </h2>
                <p className="text-gray-300 mb-6 pixel-text animate-glow-flicker">
                  The game has ended
                </p>
              </div>
            )}
            <div className="space-y-4">
              <motion.button
                onClick={handlePlayAgain}
                className="neon-button w-full py-3 pixel-text retro-glow animate-glow-flicker"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>PLAY AGAIN</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => navigate('/leaderboard')}
                className="neon-button w-full py-3 border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 pixel-text retro-glow animate-glow-flicker"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                VIEW LEADERBOARD
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {Array.from({ length: 40 }).map((_, i) => (
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

export default Game