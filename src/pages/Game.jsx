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

const Game = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { currentGame, currentPlayer, selectDoor, useBribe } = useGame()
  const { messages, sendMessage, selectDoor: socketSelectDoor, useBribe: socketUseBribe } = useSocket()
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [gameEndModal, setGameEndModal] = useState(false)

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
    <div className="min-h-screen p-4">
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
        className="fixed bottom-4 left-4 flex space-x-4"
      >
        <motion.button
          onClick={handleLeaveGame}
          className="neon-button border-red-400 text-red-400 hover:bg-red-400/10 px-4 py-2"
          whileHover={{ scale: 1.05 }}
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
            className="game-panel p-8 max-w-md mx-4 text-center"
          >
            {isCurrentPlayerWinner ? (
              <div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold text-neon-yellow mb-4 animate-glow">
                  VICTORY!
                </h2>
                <p className="text-neon-cyan mb-2">
                  Congratulations! You won the game!
                </p>
                <div className="text-2xl font-bold text-neon-yellow mb-6">
                  +{currentGame.pot} GORBA
                </div>
              </div>
            ) : winner ? (
              <div>
                <div className="text-4xl mb-4">💀</div>
                <h2 className="text-3xl font-bold text-red-400 mb-4">
                  GAME OVER
                </h2>
                <p className="text-neon-cyan mb-2">
                  {winner.name} won the game!
                </p>
                <div className="text-xl text-neon-yellow mb-6">
                  They won {currentGame.pot} GORBA
                </div>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-4">🤝</div>
                <h2 className="text-3xl font-bold text-neon-cyan mb-4">
                  GAME ENDED
                </h2>
                <p className="text-gray-300 mb-6">
                  The game has ended
                </p>
              </div>
            )}

            <div className="space-y-4">
              <motion.button
                onClick={handlePlayAgain}
                className="neon-button w-full py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>PLAY AGAIN</span>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/leaderboard')}
                className="neon-button w-full py-3 border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10"
                whileHover={{ scale: 1.05 }}
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
            className="particle"
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