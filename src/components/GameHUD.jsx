import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Users, Clock, Coins } from 'lucide-react'
import PlayerAvatar from './PlayerAvatar'

const GameHUD = ({ game, currentPlayer, timeRemaining }) => {
  if (!game) return null

  const activePlayers = game.players.filter(p => p.status === 'active')
  const eliminatedPlayers = game.players.filter(p => p.status === 'eliminated')
  const winner = game.players.find(p => p.status === 'winner')

  return (
    <div className="fixed top-4 left-4 right-4 z-30 pointer-events-none">
      <div className="flex justify-between items-start">
        {/* Left Panel - Game Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="game-panel p-4 pointer-events-auto"
        >
          <div className="space-y-3">
            {/* Game Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                game.status === 'waiting' ? 'bg-yellow-400 animate-pulse' :
                game.status === 'playing' ? 'bg-green-400 animate-pulse' :
                'bg-red-400'
              }`} />
              <span className="text-sm font-bold text-neon-cyan uppercase">
                {game.status === 'waiting' ? 'Waiting for Players' :
                 game.status === 'playing' ? 'Game in Progress' :
                 'Game Finished'}
              </span>
            </div>

            {/* Players Count */}
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm text-neon-cyan">
                {game.players.length}/3 Players
              </span>
            </div>

            {/* Pot Value */}
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-neon-yellow" />
              <span className="text-sm text-neon-yellow font-bold">
                {game.pot} GORBA
              </span>
            </div>

            {/* Timer (if applicable) */}
            {timeRemaining && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-neon-pink" />
                <span className="text-sm text-neon-pink font-bold">
                  {Math.ceil(timeRemaining / 1000)}s
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Panel - Players */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="game-panel p-4 pointer-events-auto"
        >
          <div className="space-y-4">
            {/* Active Players */}
            {activePlayers.length > 0 && (
              <div>
                <div className="text-xs text-neon-green font-bold mb-2 uppercase">
                  Active Players
                </div>
                <div className="flex space-x-2">
                  {activePlayers.map(player => (
                    <PlayerAvatar
                      key={player.id}
                      player={player}
                      isCurrentPlayer={currentPlayer?.id === player.id}
                      size="sm"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Winner */}
            {winner && (
              <div>
                <div className="text-xs text-neon-yellow font-bold mb-2 uppercase flex items-center space-x-1">
                  <Trophy className="w-3 h-3" />
                  <span>Winner</span>
                </div>
                <PlayerAvatar
                  player={winner}
                  isCurrentPlayer={currentPlayer?.id === winner.id}
                  size="sm"
                />
              </div>
            )}

            {/* Eliminated Players */}
            {eliminatedPlayers.length > 0 && (
              <div>
                <div className="text-xs text-red-400 font-bold mb-2 uppercase">
                  Eliminated
                </div>
                <div className="flex space-x-2">
                  {eliminatedPlayers.map(player => (
                    <PlayerAvatar
                      key={player.id}
                      player={player}
                      isCurrentPlayer={currentPlayer?.id === player.id}
                      size="sm"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Current Player Stats */}
      {currentPlayer && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-4 game-panel p-3 pointer-events-auto"
        >
          <div className="text-xs text-neon-cyan font-bold mb-2 uppercase">
            Your Stats
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Level:</span>
              <span className="text-neon-cyan font-bold">{currentPlayer.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">GORBA:</span>
              <span className="text-neon-yellow font-bold">{currentPlayer.gorbaBalance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Bribes:</span>
              <span className="text-neon-pink font-bold">{currentPlayer.bribes || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className={`font-bold ${
                currentPlayer.status === 'active' ? 'text-neon-green' :
                currentPlayer.status === 'winner' ? 'text-neon-yellow' :
                'text-red-400'
              }`}>
                {currentPlayer.status.toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default GameHUD