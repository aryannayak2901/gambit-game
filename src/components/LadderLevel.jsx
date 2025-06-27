import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Door from './Door'
import PlayerAvatar from './PlayerAvatar'
import BribeButton from './BribeButton'

const LadderLevel = ({ level, game, currentPlayer, onDoorSelect, onBribe, isActive }) => {
  const [selectedDoor, setSelectedDoor] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // Get players at this level
  const playersAtLevel = game.players.filter(player => player.position === level)
  
  // Check if current player can interact with this level
  const canInteract = isActive && 
    currentPlayer && 
    currentPlayer.status === 'active' && 
    currentPlayer.position === level

  // Check if level is completed (any player has passed it)
  const isCompleted = game.players.some(player => player.position > level)

  const handleDoorClick = async (doorIndex) => {
    if (!canInteract || selectedDoor !== null) return

    setSelectedDoor(doorIndex)
    
    // Simulate door selection delay
    setTimeout(async () => {
      const result = await onDoorSelect(doorIndex, level)
      setShowResult(true)
      
      // Reset after showing result
      setTimeout(() => {
        setSelectedDoor(null)
        setShowResult(false)
      }, 2000)
    }, 500)
  }

  const handleBribe = () => {
    if (!canInteract) return
    onBribe(level)
  }

  return (
    <motion.div
      className={`ladder-level w-full p-4 ${isCompleted ? 'level-completed' : ''}`}
      whileHover={canInteract ? { scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Level Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-neon-cyan pixel-text">
            LEVEL {level}
          </div>
          {isCompleted && (
            <div className="text-neon-green text-sm font-bold animate-pulse">
              ✓ COMPLETED
            </div>
          )}
        </div>
        
        {/* Bribe Button */}
        {canInteract && (
          <BribeButton
            onBribe={handleBribe}
            gorbaBalance={currentPlayer.gorbaBalance}
            level={level}
          />
        )}
      </div>

      {/* Doors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 w-full">
        {[0, 1, 2].map((doorIndex) => (
          <Door
            key={doorIndex}
            index={doorIndex}
            level={level}
            isSelected={selectedDoor === doorIndex}
            canClick={canInteract}
            onClick={() => handleDoorClick(doorIndex)}
            showResult={showResult}
            isCorrect={showResult && game.safeDoors && game.safeDoors[level] === doorIndex}
            position={doorIndex === 0 ? 'left' : doorIndex === 1 ? 'middle' : 'right'}
          />
        ))}
      </div>

      {/* Players at this level */}
      {playersAtLevel.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center space-x-2"
        >
          {playersAtLevel.map(player => (
            <PlayerAvatar
              key={player.id}
              player={player}
              isCurrentPlayer={currentPlayer?.id === player.id}
              showClimbing={player.position > level}
            />
          ))}
        </motion.div>
      )}

      {/* Level Platform */}
      <div className="mt-2 h-2 bg-gradient-to-r from-neon-cyan/30 via-neon-cyan/50 to-neon-cyan/30 rounded-full" />
    </motion.div>
  )
}

export default LadderLevel