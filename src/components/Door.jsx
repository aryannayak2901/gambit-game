import React from 'react'
import { motion } from 'framer-motion'

const Door = ({ 
  index, 
  level, 
  isSelected, 
  canClick, 
  onClick, 
  showResult, 
  isCorrect, 
  position 
}) => {
  const getDoorVariants = () => ({
    idle: {
      scale: 1,
      rotateY: 0,
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
    },
    hover: {
      scale: 1.05,
      y: -5,
      boxShadow: '0 10px 30px rgba(0, 255, 255, 0.4)',
      transition: { type: 'spring', stiffness: 300 }
    },
    selected: {
      scale: 1.1,
      boxShadow: '0 0 40px rgba(255, 0, 255, 0.6)',
      transition: { duration: 0.3 }
    },
    correct: {
      scale: 1.05,
      boxShadow: '0 0 30px rgba(0, 255, 0, 0.8)',
      borderColor: '#00ff00',
      transition: { duration: 0.5 }
    },
    incorrect: {
      scale: 0.95,
      x: [-5, 5, -5, 5, 0],
      boxShadow: '0 0 30px rgba(255, 0, 0, 0.8)',
      borderColor: '#ff0000',
      transition: { duration: 0.6 }
    }
  })

  const getAnimationState = () => {
    if (showResult) {
      return isCorrect ? 'correct' : 'incorrect'
    }
    if (isSelected) {
      return 'selected'
    }
    return 'idle'
  }

  const getDoorIcon = () => {
    if (showResult) {
      return isCorrect ? '✓' : '✗'
    }
    return position === 'left' ? '◀' : position === 'middle' ? '●' : '▶'
  }

  const getDoorColor = () => {
    if (showResult) {
      return isCorrect ? 'text-neon-green' : 'text-red-500'
    }
    if (isSelected) {
      return 'text-neon-pink'
    }
    return 'text-neon-cyan'
  }

  return (
    <motion.div
      className={`door relative cursor-pointer ${canClick ? 'hover:cursor-pointer' : 'cursor-not-allowed'}`}
      variants={getDoorVariants()}
      initial="idle"
      animate={getAnimationState()}
      whileHover={canClick ? 'hover' : 'idle'}
      onClick={canClick ? onClick : undefined}
      style={{
        minHeight: '120px',
        background: 'linear-gradient(135deg, #16213e, #1a1a3a)',
        border: '2px solid #00ffff',
        borderRadius: '12px 12px 0 0',
      }}
    >
      {/* Door Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Door Icon */}
        <motion.div
          className={`text-4xl font-bold ${getDoorColor()}`}
          animate={{
            scale: isSelected ? [1, 1.2, 1] : 1,
            rotate: showResult && !isCorrect ? [0, -10, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          {getDoorIcon()}
        </motion.div>

        {/* Door Label */}
        <div className={`text-sm font-bold mt-2 ${getDoorColor()} pixel-text`}>
          {position.toUpperCase()}
        </div>

        {/* Selection Indicator */}
        {isSelected && !showResult && (
          <motion.div
            className="absolute inset-0 border-4 border-neon-pink rounded-lg"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        )}

        {/* Result Overlay */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute inset-0 flex items-center justify-center rounded-lg ${
              isCorrect 
                ? 'bg-green-500/20 border-green-500' 
                : 'bg-red-500/20 border-red-500'
            } border-2`}
          >
            <div className={`text-6xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '🎉' : '💀'}
            </div>
          </motion.div>
        )}
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/10 to-transparent rounded-lg" />
      </div>

      {/* Interaction Hint */}
      {canClick && !isSelected && (
        <motion.div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-neon-cyan bg-deep-purple px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity"
          initial={{ y: -10, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
        >
          Click to choose
        </motion.div>
      )}
    </motion.div>
  )
}

export default Door