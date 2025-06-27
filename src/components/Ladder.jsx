import React from 'react'
import { motion } from 'framer-motion'
import LadderLevel from './LadderLevel'
import PlayerAvatar from './PlayerAvatar'

const Ladder = ({ game, currentPlayer, onDoorSelect, onBribe }) => {
  if (!game) return null

  const levels = Array.from({ length: 10 }, (_, i) => 10 - i) // 10 to 1

  return (
    <div className="relative w-[90vw] max-w-6xl min-w-0 arcade-panel mx-auto flex flex-col items-center justify-center p-0">
      {/* Ladder Structure */}
      <div className="w-full flex flex-col items-center justify-center">
        {/* Game Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 w-full"
        >
          <h1 className="text-4xl font-bold text-neon-yellow pixel-text animate-glow">
            LUCKY LADDERS
          </h1>
          <div className="text-neon-cyan text-lg mt-2 pixel-text">
            Level {Math.max(...game.players.map(p => p.position))} / 10
          </div>
        </motion.div>

        {/* Ladder Levels */}
        <div className="space-y-4 w-[90%] mx-auto">
          {levels.map((level, index) => (
            <motion.div
              key={level}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LadderLevel
                level={level}
                game={game}
                currentPlayer={currentPlayer}
                onDoorSelect={onDoorSelect}
                onBribe={onBribe}
                isActive={game.status === 'playing'}
              />
            </motion.div>
          ))}
        </div>


        {/* Starting Platform */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 p-4 bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 rounded-lg border border-neon-cyan/50"
        >
          <div className="text-center text-neon-cyan font-bold text-lg mb-2">
            STARTING PLATFORM
          </div>
          <div className="flex justify-center space-x-4">
            {game.players
              .filter(player => player.position === 1)
              .map(player => (
                <PlayerAvatar
                  key={player.id}
                  player={player}
                  isCurrentPlayer={currentPlayer?.id === player.id}
                />
              ))}
          </div>
        </motion.div>

        {/* Game Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center"
        >
          {game.status === 'waiting' && (
            <div className="text-neon-yellow text-lg animate-pulse">
              Waiting for players... ({game.players.length}/3)
            </div>
          )}
          {game.status === 'playing' && (
            <div className="text-neon-green text-lg">
              Game in progress - Choose your doors!
            </div>
          )}
          {game.status === 'finished' && (
            <div className="text-neon-yellow text-xl font-bold animate-glow">
              🎉 Game Finished! 🎉
            </div>
          )}
        </motion.div>

        {/* Pot Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4, type: 'spring' }}
          className="mt-2 mb-4 mx-auto bg-gradient-to-r from-neon-yellow/20 to-neon-pink/20 rounded-lg p-3 border border-neon-yellow/50 flex flex-col items-center"
        >
          <div className="text-neon-yellow font-bold text-sm pixel-text">POT</div>
          <div className="text-2xl font-bold text-neon-yellow animate-pulse pixel-text">
            {game.pot} GORBA
          </div>
        </motion.div>

        {/* Particles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {Array.from({ length: 20 }).map((_, i) => (
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

export default Ladder