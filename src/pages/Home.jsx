import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useGame } from '../contexts/GameContext'
import { useSocket } from '../contexts/SocketContext'
import toast from 'react-hot-toast'
import { Play, Users, Trophy, User, Gamepad2, Coins } from 'lucide-react'

const Home = () => {
  const [playerName, setPlayerName] = useState('')
  const [gameId, setGameId] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  
  const navigate = useNavigate()
  const { connected, publicKey } = useWallet()
  const { loading } = useGame()
  const { createGame, joinGame, connected: socketConnected } = useSocket()

  const handleCreateGame = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!playerName.trim()) {
      toast.error('Please enter your player name')
      return
    }

    if (!socketConnected) {
      toast.error('Not connected to game server')
      return
    }

    setIsCreating(true)
    try {
      createGame(playerName.trim())
      // Navigation will be handled by socket events
      setTimeout(() => {
        const gameId = Math.random().toString(36).substring(2, 15)
        navigate(`/lobby/${gameId}`)
      }, 1000)
    } catch (error) {
      console.error('Error creating game:', error)
      toast.error('Failed to create game')
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinGame = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!playerName.trim()) {
      toast.error('Please enter your player name')
      return
    }

    if (!gameId.trim()) {
      toast.error('Please enter a game ID')
      return
    }

    if (!socketConnected) {
      toast.error('Not connected to game server')
      return
    }

    setIsJoining(true)
    try {
      joinGame(gameId.trim(), playerName.trim())
      navigate(`/lobby/${gameId.trim()}`)
    } catch (error) {
      console.error('Error joining game:', error)
      toast.error('Failed to join game')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-neon-yellow pixel-text animate-glow mb-4">
            GORBAGANA GAMBIT
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-neon-cyan pixel-text mb-6">
            LUCKY LADDERS
          </h2>
          <p className="text-lg text-neon-cyan max-w-2xl mx-auto leading-relaxed">
            Climb the ladder of fortune! 3 players, 10 levels, 1 winner takes all the $GORBA.
            Choose your doors wisely or use bribes to increase your odds!
          </p>
        </motion.div>

        {/* Game Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="game-panel p-6 text-center">
            <Users className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neon-cyan mb-2">3 PLAYERS</h3>
            <p className="text-sm text-gray-300">
              Compete against 2 other players in real-time multiplayer action
            </p>
          </div>
          
          <div className="game-panel p-6 text-center">
            <Gamepad2 className="w-12 h-12 text-neon-pink mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neon-pink mb-2">10 LEVELS</h3>
            <p className="text-sm text-gray-300">
              Climb through 10 challenging levels, each with 3 doors to choose from
            </p>
          </div>
          
          <div className="game-panel p-6 text-center">
            <Coins className="w-12 h-12 text-neon-yellow mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neon-yellow mb-2">WIN GORBA</h3>
            <p className="text-sm text-gray-300">
              Winner takes the entire pot! Use bribes to increase your chances
            </p>
          </div>
        </motion.div>

        {/* Main Game Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="game-panel p-8 max-w-2xl mx-auto"
        >
          {/* Wallet Connection */}
          <div className="text-center mb-8">
            <WalletMultiButton className="!bg-gradient-to-r !from-neon-cyan !to-neon-pink" />
            {connected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-neon-green"
              >
                ✓ Wallet Connected: {publicKey?.toString().slice(0, 8)}...
              </motion.div>
            )}
          </div>

          {/* Player Name Input */}
          <div className="mb-6">
            <label className="block text-neon-cyan font-bold mb-2 text-sm uppercase">
              Player Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your player name"
              className="w-full bg-black/30 border-2 border-neon-cyan/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 transition-all"
              maxLength={20}
              disabled={!connected}
            />
          </div>

          {/* Game Actions */}
          <div className="space-y-4">
            {/* Create Game */}
            <motion.button
              onClick={handleCreateGame}
              disabled={!connected || !playerName.trim() || isCreating || loading}
              className="neon-button w-full py-4 text-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={connected && playerName.trim() ? { scale: 1.02 } : {}}
              whileTap={connected && playerName.trim() ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-center space-x-3">
                <Play className="w-6 h-6" />
                <span>{isCreating ? 'CREATING...' : 'CREATE NEW GAME'}</span>
              </div>
            </motion.button>

            {/* Join Game */}
            <div className="space-y-3">
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter Game ID to join"
                className="w-full bg-black/30 border-2 border-neon-pink/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 transition-all"
                disabled={!connected}
              />
              <motion.button
                onClick={handleJoinGame}
                disabled={!connected || !playerName.trim() || !gameId.trim() || isJoining || loading}
                className="neon-button w-full py-4 text-lg border-neon-pink text-neon-pink hover:bg-neon-pink/10 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={connected && playerName.trim() && gameId.trim() ? { scale: 1.02 } : {}}
                whileTap={connected && playerName.trim() && gameId.trim() ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-center space-x-3">
                  <Users className="w-6 h-6" />
                  <span>{isJoining ? 'JOINING...' : 'JOIN GAME'}</span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Connection Status */}
          <div className="mt-6 text-center text-sm">
            <div className={`flex items-center justify-center space-x-2 ${
              socketConnected ? 'text-neon-green' : 'text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                socketConnected ? 'bg-neon-green animate-pulse' : 'bg-red-400'
              }`} />
              <span>
                {socketConnected ? 'Connected to Game Server' : 'Connecting to Server...'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center space-x-6 mt-12"
        >
          <motion.button
            onClick={() => navigate('/leaderboard')}
            className="flex items-center space-x-2 text-neon-yellow hover:text-neon-pink transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="w-5 h-5" />
            <span className="font-bold">LEADERBOARD</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 text-neon-cyan hover:text-neon-pink transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <User className="w-5 h-5" />
            <span className="font-bold">PROFILE</span>
          </motion.button>
        </motion.div>

        {/* Particles Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {Array.from({ length: 50 }).map((_, i) => (
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
    </div>
  )
}

export default Home