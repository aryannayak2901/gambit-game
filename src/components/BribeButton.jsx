import React, { useState } from 'react'
import { motion } from 'framer-motion'

const BribeButton = ({ onBribe, gorbaBalance, level, disabled = false }) => {
  const [isUsing, setIsUsing] = useState(false)
  
  const canUseBribe = gorbaBalance >= 1 && !disabled
  
  const handleBribe = async () => {
    if (!canUseBribe || isUsing) return
    
    setIsUsing(true)
    try {
      await onBribe()
    } finally {
      setTimeout(() => setIsUsing(false), 1000)
    }
  }

  return (
    <motion.button
      className={`
        relative px-6 py-3 font-bold text-sm uppercase tracking-wider rounded-lg
        transition-all duration-300 overflow-hidden
        ${canUseBribe 
          ? 'bg-gradient-to-r from-neon-pink to-purple-600 text-white border-2 border-neon-pink hover:shadow-lg hover:shadow-neon-pink/50' 
          : 'bg-gray-600 text-gray-400 border-2 border-gray-500 cursor-not-allowed'
        }
        ${isUsing ? 'animate-pulse' : canUseBribe ? 'bribe-available' : ''}
      `}
      onClick={handleBribe}
      disabled={!canUseBribe || isUsing}
      whileHover={canUseBribe ? { scale: 1.05 } : {}}
      whileTap={canUseBribe ? { scale: 0.95 } : {}}
    >
      {/* Background Animation */}
      {canUseBribe && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}

      {/* Button Content */}
      <div className="relative z-10 flex items-center space-x-2">
        <span>💰</span>
        <span>
          {isUsing ? 'BRIBING...' : 'BRIBE'}
        </span>
        <span className="text-xs">
          (1 GORBA)
        </span>
      </div>

      {/* Tooltip */}
      <motion.div
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-deep-purple text-neon-cyan text-xs px-3 py-2 rounded-lg border border-neon-cyan/50 whitespace-nowrap opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        +10% safe door chance
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neon-cyan/50" />
      </motion.div>

      {/* Insufficient Funds Indicator */}
      {!canUseBribe && gorbaBalance < 1 && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-red-400 whitespace-nowrap"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Need 1 GORBA
        </motion.div>
      )}

      {/* Success Effect */}
      {isUsing && (
        <motion.div
          className="absolute inset-0 bg-neon-pink/30 rounded-lg"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0],
          }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  )
}

export default BribeButton