import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useGame } from '../contexts/GameContext'
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  Coins, 
  TrendingUp, 
  Users, 
  Calendar,
  Award,
  Zap,
  BarChart3
} from 'lucide-react'

const Profile = () => {
  const navigate = useNavigate()
  const { connected, publicKey } = useWallet()
  const { getPlayerStats } = useGame()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      
      if (connected) {
        // Get player stats
        const playerStats = getPlayerStats()
        setStats(playerStats)
        
        // Generate achievements based on stats
        const playerAchievements = generateAchievements(playerStats)
        setAchievements(playerAchievements)
      }
      
      setLoading(false)
    }

    loadProfile()
  }, [connected, getPlayerStats])

  const generateAchievements = (stats) => {
    const achievements = []
    
    if (stats.wins >= 1) {
      achievements.push({
        id: 'first_win',
        title: 'First Victory',
        description: 'Won your first game',
        icon: '🏆',
        unlocked: true,
        rarity: 'common'
      })
    }
    
    if (stats.wins >= 10) {
      achievements.push({
        id: 'veteran',
        title: 'Veteran Climber',
        description: 'Won 10 games',
        icon: '🎖️',
        unlocked: true,
        rarity: 'uncommon'
      })
    }
    
    if (stats.winRate >= 50) {
      achievements.push({
        id: 'skilled',
        title: 'Skilled Player',
        description: 'Maintain 50%+ win rate',
        icon: '⭐',
        unlocked: true,
        rarity: 'rare'
      })
    }
    
    if (stats.highestLevel === 10) {
      achievements.push({
        id: 'summit',
        title: 'Summit Reached',
        description: 'Reached the top level',
        icon: '🏔️',
        unlocked: true,
        rarity: 'epic'
      })
    }
    
    if (stats.totalBribes >= 50) {
      achievements.push({
        id: 'big_spender',
        title: 'Big Spender',
        description: 'Used 50+ bribes',
        icon: '💰',
        unlocked: true,
        rarity: 'uncommon'
      })
    }
    
    if (stats.gorbaWon >= 100) {
      achievements.push({
        id: 'rich',
        title: 'GORBA Collector',
        description: 'Won 100+ GORBA',
        icon: '💎',
        unlocked: true,
        rarity: 'rare'
      })
    }

    // Add some locked achievements
    if (stats.wins < 50) {
      achievements.push({
        id: 'master',
        title: 'Master Climber',
        description: 'Win 50 games',
        icon: '👑',
        unlocked: false,
        rarity: 'legendary',
        progress: stats.wins,
        target: 50
      })
    }
    
    return achievements
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 text-gray-400'
      case 'uncommon': return 'border-green-400 text-green-400'
      case 'rare': return 'border-blue-400 text-blue-400'
      case 'epic': return 'border-purple-400 text-purple-400'
      case 'legendary': return 'border-yellow-400 text-yellow-400'
      default: return 'border-gray-400 text-gray-400'
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="game-panel p-8 max-w-md mx-auto"
          >
            <h1 className="text-3xl font-bold text-neon-cyan mb-6">PROFILE</h1>
            <p className="text-gray-300 mb-6">
              Connect your wallet to view your player profile and statistics.
            </p>
            <WalletMultiButton className="!bg-gradient-to-r !from-neon-cyan !to-neon-pink mb-4" />
            <motion.button
              onClick={() => navigate('/')}
              className="neon-button border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>BACK TO HOME</span>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-neon-yellow pixel-text animate-glow">
              PROFILE
            </h1>
            <p className="text-lg text-neon-cyan mt-2">
              Your Lucky Ladders statistics and achievements
            </p>
          </div>
          
          <motion.button
            onClick={() => navigate('/')}
            className="neon-button border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>BACK TO HOME</span>
            </div>
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="loading-spinner mx-auto mb-4" />
            <div className="text-neon-cyan text-lg">Loading profile...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Player Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="game-panel p-6"
            >
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink flex items-center justify-center text-3xl font-bold">
                  👤
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Player #{publicKey.toString().slice(-8)}
                  </h2>
                  <div className="text-sm text-gray-400 font-mono">
                    {publicKey.toString()}
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-neon-green">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Member since Dec 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="game-panel p-6 text-center">
                <Trophy className="w-12 h-12 text-neon-yellow mx-auto mb-4" />
                <div className="text-3xl font-bold text-neon-yellow mb-2">
                  {stats.wins}
                </div>
                <div className="text-sm text-gray-400 mb-1">Wins</div>
                <div className="text-xs text-red-400">
                  {stats.losses} losses
                </div>
              </div>

              <div className="game-panel p-6 text-center">
                <Target className="w-12 h-12 text-neon-green mx-auto mb-4" />
                <div className="text-3xl font-bold text-neon-green mb-2">
                  {stats.winRate}%
                </div>
                <div className="text-sm text-gray-400 mb-1">Win Rate</div>
                <div className="text-xs text-neon-cyan">
                  {stats.gamesPlayed} games
                </div>
              </div>

              <div className="game-panel p-6 text-center">
                <Coins className="w-12 h-12 text-neon-pink mx-auto mb-4" />
                <div className="text-3xl font-bold text-neon-pink mb-2">
                  {stats.gorbaWon}
                </div>
                <div className="text-sm text-gray-400 mb-1">GORBA Won</div>
                <div className="text-xs text-red-400">
                  -{stats.gorbaLost} lost
                </div>
              </div>

              <div className="game-panel p-6 text-center">
                <TrendingUp className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
                <div className="text-3xl font-bold text-neon-cyan mb-2">
                  {stats.highestLevel}
                </div>
                <div className="text-sm text-gray-400 mb-1">Highest Level</div>
                <div className="text-xs text-neon-yellow">
                  Avg: {stats.averageLevel}
                </div>
              </div>
            </motion.div>

            {/* Detailed Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="game-panel p-6"
            >
              <h3 className="text-2xl font-bold text-neon-cyan mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                DETAILED STATISTICS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-neon-yellow">Game Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Games Played:</span>
                      <span className="text-white font-bold">{stats.gamesPlayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Win Streak:</span>
                      <span className="text-neon-green font-bold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Best Rank:</span>
                      <span className="text-neon-yellow font-bold">#12</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-neon-pink">GORBA Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Bribes:</span>
                      <span className="text-neon-pink font-bold">{stats.totalBribes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Net GORBA:</span>
                      <span className={`font-bold ${stats.gorbaWon - stats.gorbaLost >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                        {stats.gorbaWon - stats.gorbaLost >= 0 ? '+' : ''}{stats.gorbaWon - stats.gorbaLost}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Avg per Game:</span>
                      <span className="text-neon-cyan font-bold">
                        {((stats.gorbaWon - stats.gorbaLost) / stats.gamesPlayed).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-neon-green">Climbing Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Avg Level:</span>
                      <span className="text-neon-green font-bold">{stats.averageLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Level 10 Reached:</span>
                      <span className="text-neon-yellow font-bold">{stats.wins} times</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Success Rate:</span>
                      <span className="text-neon-cyan font-bold">{((stats.averageLevel / 10) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="game-panel p-6"
            >
              <h3 className="text-2xl font-bold text-neon-cyan mb-6 flex items-center">
                <Award className="w-6 h-6 mr-2" />
                ACHIEVEMENTS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${achievement.unlocked 
                        ? `${getRarityColor(achievement.rarity)} bg-current/5` 
                        : 'border-gray-600 text-gray-500 bg-gray-800/30'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        <div className={`text-xs font-bold uppercase ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </div>
                        
                        {/* Progress bar for locked achievements */}
                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.target}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-neon-cyan h-2 rounded-full transition-all"
                                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {Array.from({ length: 30 }).map((_, i) => (
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

export default Profile