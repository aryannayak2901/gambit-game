import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Trophy, Medal, Award, ArrowLeft, Coins, TrendingUp, Users, Target } from 'lucide-react'

const Leaderboard = () => {
  const navigate = useNavigate()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('wins')

  // Mock leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData = [
        {
          rank: 1,
          name: 'CryptoKing',
          address: 'ABC123...XYZ789',
          wins: 47,
          losses: 12,
          winRate: 79.7,
          gorbaWon: 2840,
          gorbaLost: 360,
          totalGames: 59,
          bribesUsed: 23,
          highestLevel: 10,
          averageLevel: 8.4,
        },
        {
          rank: 2,
          name: 'LadderMaster',
          address: 'DEF456...ABC123',
          wins: 38,
          losses: 15,
          winRate: 71.7,
          gorbaWon: 2280,
          gorbaLost: 450,
          totalGames: 53,
          bribesUsed: 31,
          highestLevel: 10,
          averageLevel: 7.8,
        },
        {
          rank: 3,
          name: 'DoorPicker',
          address: 'GHI789...DEF456',
          wins: 35,
          losses: 18,
          winRate: 66.0,
          gorbaWon: 2100,
          gorbaLost: 540,
          totalGames: 53,
          bribesUsed: 19,
          highestLevel: 10,
          averageLevel: 7.2,
        },
        {
          rank: 4,
          name: 'BribeQueen',
          address: 'JKL012...GHI789',
          wins: 29,
          losses: 21,
          winRate: 58.0,
          gorbaWon: 1740,
          gorbaLost: 630,
          totalGames: 50,
          bribesUsed: 67,
          highestLevel: 10,
          averageLevel: 6.9,
        },
        {
          rank: 5,
          name: 'LuckyClimber',
          address: 'MNO345...JKL012',
          wins: 26,
          losses: 19,
          winRate: 57.8,
          gorbaWon: 1560,
          gorbaLost: 570,
          totalGames: 45,
          bribesUsed: 12,
          highestLevel: 10,
          averageLevel: 6.5,
        },
        {
          rank: 6,
          name: 'TrapAvoider',
          address: 'PQR678...MNO345',
          wins: 22,
          losses: 23,
          winRate: 48.9,
          gorbaWon: 1320,
          gorbaLost: 690,
          totalGames: 45,
          bribesUsed: 8,
          highestLevel: 10,
          averageLevel: 5.8,
        },
        {
          rank: 7,
          name: 'GorbaGambler',
          address: 'STU901...PQR678',
          wins: 19,
          losses: 26,
          winRate: 42.2,
          gorbaWon: 1140,
          gorbaLost: 780,
          totalGames: 45,
          bribesUsed: 45,
          highestLevel: 9,
          averageLevel: 5.2,
        },
        {
          rank: 8,
          name: 'NewbieClimber',
          address: 'VWX234...STU901',
          wins: 15,
          losses: 20,
          winRate: 42.9,
          gorbaWon: 900,
          gorbaLost: 600,
          totalGames: 35,
          bribesUsed: 5,
          highestLevel: 8,
          averageLevel: 4.8,
        },
      ]
      
      setLeaderboardData(mockData)
      setLoading(false)
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />
      case 2: return <Medal className="w-6 h-6 text-gray-300" />
      case 3: return <Award className="w-6 h-6 text-amber-600" />
      default: return <span className="text-neon-cyan font-bold text-lg">#{rank}</span>
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'border-yellow-400 bg-yellow-400/10'
      case 2: return 'border-gray-300 bg-gray-300/10'
      case 3: return 'border-amber-600 bg-amber-600/10'
      default: return 'border-neon-cyan/30 bg-neon-cyan/5'
    }
  }

  const sortedData = [...leaderboardData].sort((a, b) => {
    switch (selectedTab) {
      case 'wins': return b.wins - a.wins
      case 'winRate': return b.winRate - a.winRate
      case 'gorba': return b.gorbaWon - a.gorbaWon
      case 'games': return b.totalGames - a.totalGames
      default: return a.rank - b.rank
    }
  })

  const tabs = [
    { id: 'wins', label: 'Most Wins', icon: Trophy },
    { id: 'winRate', label: 'Win Rate', icon: TrendingUp },
    { id: 'gorba', label: 'GORBA Won', icon: Coins },
    { id: 'games', label: 'Games Played', icon: Users },
  ]

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-neon-yellow pixel-text animate-glow mb-4">
            LEADERBOARD
          </h1>
          <p className="text-lg text-neon-cyan">
            Top players in Gorbagana Gambit: Lucky Ladders
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center mb-8"
        >
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

          {/* Tab Selector */}
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-bold ${
                  selectedTab === tab.id
                    ? 'border-neon-pink text-neon-pink bg-neon-pink/10'
                    : 'border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-1">
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="game-panel p-6"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4" />
              <div className="text-neon-cyan text-lg">Loading leaderboard...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 text-sm font-bold text-neon-cyan border-b border-neon-cyan/30 pb-2">
                <div className="col-span-1">RANK</div>
                <div className="col-span-3">PLAYER</div>
                <div className="col-span-2 text-center">WINS</div>
                <div className="col-span-2 text-center">WIN RATE</div>
                <div className="col-span-2 text-center">GORBA WON</div>
                <div className="col-span-2 text-center">GAMES</div>
              </div>

              {/* Player Rows */}
              {sortedData.map((player, index) => (
                <motion.div
                  key={player.address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`grid grid-cols-12 gap-4 p-4 rounded-lg border-2 transition-all hover:scale-[1.02] ${getRankColor(player.rank)}`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(player.rank)}
                  </div>

                  {/* Player Info */}
                  <div className="col-span-3">
                    <div className="font-bold text-white text-lg">{player.name}</div>
                    <div className="text-sm text-gray-400 font-mono">
                      {player.address}
                    </div>
                  </div>

                  {/* Wins */}
                  <div className="col-span-2 text-center">
                    <div className="text-2xl font-bold text-neon-green">{player.wins}</div>
                    <div className="text-xs text-gray-400">{player.losses} losses</div>
                  </div>

                  {/* Win Rate */}
                  <div className="col-span-2 text-center">
                    <div className="text-2xl font-bold text-neon-yellow">{player.winRate}%</div>
                    <div className="text-xs text-gray-400">win rate</div>
                  </div>

                  {/* GORBA Won */}
                  <div className="col-span-2 text-center">
                    <div className="text-2xl font-bold text-neon-pink">{player.gorbaWon}</div>
                    <div className="text-xs text-gray-400">-{player.gorbaLost} lost</div>
                  </div>

                  {/* Total Games */}
                  <div className="col-span-2 text-center">
                    <div className="text-2xl font-bold text-neon-cyan">{player.totalGames}</div>
                    <div className="text-xs text-gray-400">games played</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="game-panel p-4 text-center">
            <Trophy className="w-8 h-8 text-neon-yellow mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-yellow">
              {leaderboardData.reduce((sum, p) => sum + p.wins, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Wins</div>
          </div>
          
          <div className="game-panel p-4 text-center">
            <Coins className="w-8 h-8 text-neon-pink mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-pink">
              {leaderboardData.reduce((sum, p) => sum + p.gorbaWon, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">GORBA Won</div>
          </div>
          
          <div className="game-panel p-4 text-center">
            <Users className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-cyan">
              {leaderboardData.reduce((sum, p) => sum + p.totalGames, 0)}
            </div>
            <div className="text-sm text-gray-400">Games Played</div>
          </div>
          
          <div className="game-panel p-4 text-center">
            <Target className="w-8 h-8 text-neon-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-neon-green">
              {(leaderboardData.reduce((sum, p) => sum + p.winRate, 0) / leaderboardData.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Avg Win Rate</div>
          </div>
        </motion.div>
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

export default Leaderboard