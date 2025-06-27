import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
const TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';
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
    if (!TEST_MODE && !connected) {
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
      // In test mode, use mock navigation
      if (TEST_MODE) {
        const gameId = await createGame(playerName.trim())
        navigate(`/lobby/${gameId}`)
      } else {
        createGame(playerName.trim())
        // Navigation will be handled by socket events
        setTimeout(() => {
          const gameId = Math.random().toString(36).substring(2, 15)
          navigate(`/lobby/${gameId}`)
        }, 1000)
      }
    } catch (error) {
      console.error('Error creating game:', error)
      toast.error('Failed to create game')
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinGame = async () => {
    if (!TEST_MODE && !connected) {
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
      // In test mode, use mock navigation
      if (TEST_MODE) {
        await joinGame(gameId.trim(), playerName.trim())
        navigate(`/lobby/${gameId.trim()}`)
      } else {
        joinGame(gameId.trim(), playerName.trim())
        navigate(`/lobby/${gameId.trim()}`)
      }
    } catch (error) {
      console.error('Error joining game:', error)
      toast.error('Failed to join game')
    } finally {
      setIsJoining(false)
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
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
      <div className="w-full max-w-4xl mx-auto relative z-30 flex flex-col items-center justify-center">
        {/* Main Title - stacked, glowing, arcade style */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h1 className="text-7xl md:text-8xl font-bold pixel-text retro-glow animate-glow mb-2 drop-shadow-neon animate-crt-flicker tracking-widest text-neon-cyan">
            <span className="block text-neon-yellow animate-glow-flicker">GORBAGANA</span>
            <span className="block text-neon-pink animate-glow-flicker">GAMBIT</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold pixel-text retro-glow text-neon-cyan animate-glow-flicker tracking-widest mb-2">
            LUCKY LADDERS
          </h2>
          <p className="text-lg md:text-xl text-neon-cyan/80 pixel-text retro-glow animate-glow-flicker max-w-2xl mx-auto mt-2">
            Climb the ladder of fortune! <span className="text-neon-yellow">3 players</span>, <span className="text-neon-pink">10 levels</span>, 1 winner takes all the <span className="text-neon-green">$GORBA</span>.<br/>
            <span className="text-neon-pink">Choose your doors wisely or use bribes to increase your odds!</span>
          </p>
        </motion.div>

        {/* Game Info Panels - neon, animated, arcade style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
          <div className="retro-border neon-panel bg-black/70 p-6 flex flex-col items-center justify-center animate-crt-flicker shadow-2xl">
            <Users className="w-8 h-8 text-neon-cyan mb-2 animate-pulse" />
            <div className="text-2xl font-bold pixel-text retro-glow text-neon-cyan mb-1">3 PLAYERS</div>
            <div className="text-neon-cyan/80 pixel-text text-center">Compete against 2 other players in real-time multiplayer action</div>
          </div>
          <div className="retro-border neon-panel bg-black/70 p-6 flex flex-col items-center justify-center animate-crt-flicker shadow-2xl">
            <Gamepad2 className="w-8 h-8 text-neon-pink mb-2 animate-pulse" />
            <div className="text-2xl font-bold pixel-text retro-glow text-neon-pink mb-1">10 LEVELS</div>
            <div className="text-neon-cyan/80 pixel-text text-center">Climb through 10 challenging levels, each with 3 doors to choose from</div>
          </div>
          <div className="retro-border neon-panel bg-black/70 p-6 flex flex-col items-center justify-center animate-crt-flicker shadow-2xl">
            <Trophy className="w-8 h-8 text-neon-yellow mb-2 animate-pulse" />
            <div className="text-2xl font-bold pixel-text retro-glow text-neon-yellow mb-1">WIN GORBA</div>
            <div className="text-neon-cyan/80 pixel-text text-center">Winner takes the entire pot! Use bribes to increase your chances</div>
          </div>
        </div>

        {/* Main Game Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="game-panel retro-border max-w-2xl mx-auto shadow-2xl animate-glow-flicker"
        >
          {/* Wallet Connection */}
          <div className="text-center mb-8">
            {TEST_MODE ? (
              <div className="text-neon-green font-bold text-lg retro-glow">TEST MODE: Wallet Mocked</div>
            ) : (
              <>
                <WalletMultiButton className="!bg-gradient-to-r !from-neon-cyan !to-neon-pink !retro-border !shadow-lg" />
                {connected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-neon-green retro-glow"
                  >
                    ✓ Wallet Connected: {publicKey?.toString().slice(0, 8)}...
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Player Name Input */}
          <div className="mb-6">
            <label className="block text-neon-cyan font-bold mb-2 text-sm uppercase pixel-text retro-glow">
              Player Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your player name"
              className="w-full bg-black/50 border-2 border-neon-cyan/80 rounded-lg px-4 py-3 text-neon-cyan placeholder-neon-pink focus:outline-none focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 transition-all pixel-text shadow-lg"
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
          className="flex flex-wrap justify-center space-x-6 mt-12"
        >
          <motion.button
            onClick={() => navigate('/leaderboard')}
            className="flex items-center space-x-2 neon-button border-neon-yellow text-neon-yellow hover:bg-neon-pink/10 hover:text-neon-pink pixel-text retro-glow animate-glow-flicker"
            whileHover={{ scale: 1.08 }}
          >
            <Trophy className="w-5 h-5" />
            <span className="font-bold">LEADERBOARD</span>
          </motion.button>
          <motion.button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 neon-button border-neon-cyan text-neon-cyan hover:bg-neon-pink/10 hover:text-neon-pink pixel-text retro-glow animate-glow-flicker"
            whileHover={{ scale: 1.08 }}
          >
            <User className="w-5 h-5" />
            <span className="font-bold">PROFILE</span>
          </motion.button>
          <motion.button
            onClick={() => navigate('/playground')}
            className="flex items-center space-x-2 neon-button border-neon-pink text-neon-pink hover:bg-neon-yellow/10 hover:text-neon-yellow pixel-text retro-glow animate-glow-flicker border border-neon-pink rounded px-4 py-2 ml-2"
            whileHover={{ scale: 1.12 }}
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold">TEST ARENA</span>
          </motion.button>
        </motion.div>

        {/* Particles Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {Array.from({ length: 50 }).map((_, i) => (
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
    </div>
  )
}

export default Home