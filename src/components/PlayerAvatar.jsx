import React from 'react'
import { motion } from 'framer-motion'

const PlayerAvatar = ({ player, isCurrentPlayer, showClimbing = false, size = 'md' }) => {
  const getAvatarSize = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8 text-xs'
      case 'lg': return 'w-16 h-16 text-lg'
      default: return 'w-12 h-12 text-sm'
    }
  }

  const getPlayerColor = () => {
    switch (player.color) {
      case 'blue': return 'border-blue-400 text-blue-400 bg-blue-400/20'
      case 'red': return 'border-red-400 text-red-400 bg-red-400/20'
      case 'green': return 'border-green-400 text-green-400 bg-green-400/20'
      default: return 'border-neon-cyan text-neon-cyan bg-neon-cyan/20'
    }
  }

  const getStatusEffect = () => {
    if (player.status === 'winner') {
      return 'victory-player'
    }
    if (player.status === 'eliminated') {
      return 'player-eliminated'
    }
    if (showClimbing) {
      return 'climbing-player'
    }
    return ''
  }

  const getPlayerInitials = () => {
    return player.name ? player.name.substring(0, 2).toUpperCase() : 'P'
  }

  return (
    <motion.div
      className="relative flex flex-col items-center space-y-1"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Avatar Circle */}
      <motion.div
        className={`
          player-avatar relative rounded-full border-2 flex items-center justify-center font-bold
          ${getAvatarSize()} ${getPlayerColor()} ${getStatusEffect()}
          ${isCurrentPlayer ? 'ring-2 ring-neon-yellow ring-offset-2 ring-offset-transparent' : ''}
        `}
        whileHover={{ scale: 1.1 }}
        animate={player.status === 'winner' ? {
          boxShadow: [
            '0 0 20px rgba(255, 215, 0, 0.5)',
            '0 0 40px rgba(255, 215, 0, 0.8)',
            '0 0 20px rgba(255, 215, 0, 0.5)',
          ]
        } : {}}
        transition={{ duration: 1, repeat: player.status === 'winner' ? Infinity : 0 }}
      >
        {/* Avatar Content */}
        <span className="relative z-10">
          {player.status === 'winner' ? '👑' : 
           player.status === 'eliminated' ? '💀' : 
           getPlayerInitials()}
        </span>

        {/* Spinning Border Effect */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-current via-transparent to-current opacity-30 animate-spin" />
      </motion.div>

      {/* Player Name */}
      <div className={`text-xs font-bold pixel-text ${getPlayerColor().split(' ')[1]} truncate max-w-16`}>
        {player.name}
      </div>

      {/* Status Indicators */}
      <div className="flex flex-col items-center space-y-1">
        {/* Current Player Indicator */}
        {isCurrentPlayer && (
          <motion.div
            className="text-xs text-neon-yellow font-bold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            YOU
          </motion.div>
        )}

        {/* Position Indicator */}
        <div className="text-xs text-neon-cyan">
          L{player.position}
        </div>

        {/* GORBA Balance */}
        {player.gorbaBalance !== undefined && (
          <div className="text-xs text-neon-yellow">
            {player.gorbaBalance}G
          </div>
        )}

        {/* Bribe Count */}
        {player.bribes > 0 && (
          <div className="text-xs text-neon-pink">
            💰{player.bribes}
          </div>
        )}
      </div>

      {/* Status Effects */}
      {player.status === 'winner' && (
        <motion.div
          className="absolute -top-8 text-2xl"
          animate={{
            y: [-5, -15, -5],
            rotate: [-5, 5, -5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎉
        </motion.div>
      )}

      {player.status === 'eliminated' && (
        <motion.div
          className="absolute inset-0 bg-red-500/20 rounded-full"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      {/* Climbing Effect */}
      {showClimbing && (
        <motion.div
          className="absolute -top-4 text-lg"
          animate={{
            y: [-20, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 0.8 }}
        >
          ⬆️
        </motion.div>
      )}
    </motion.div>
  )
}

export default PlayerAvatar