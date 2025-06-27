import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import toast from 'react-hot-toast'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

// Game state reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GAME':
      return {
        ...state,
        currentGame: action.payload,
      }
    case 'SET_PLAYER':
      return {
        ...state,
        currentPlayer: action.payload,
      }
    case 'UPDATE_PLAYERS':
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          players: action.payload,
        },
      }
    case 'SET_GAME_STATUS':
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          status: action.payload,
        },
      }
    case 'UPDATE_PLAYER_POSITION':
      const updatedPlayers = state.currentGame.players.map(player =>
        player.id === action.payload.playerId
          ? { ...player, position: action.payload.position }
          : player
      )
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          players: updatedPlayers,
        },
      }
    case 'ELIMINATE_PLAYER':
      const eliminatedPlayers = state.currentGame.players.map(player =>
        player.id === action.payload.playerId
          ? { ...player, status: 'eliminated' }
          : player
      )
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          players: eliminatedPlayers,
        },
      }
    case 'SET_WINNER':
      const winnerPlayers = state.currentGame.players.map(player =>
        player.id === action.payload.playerId
          ? { ...player, status: 'winner' }
          : player
      )
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          players: winnerPlayers,
          status: 'finished',
          winner: action.payload.playerId,
        },
      }
    case 'UPDATE_POT':
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          pot: action.payload,
        },
      }
    case 'USE_BRIBE':
      const bribedPlayers = state.currentGame.players.map(player =>
        player.id === action.payload.playerId
          ? { 
              ...player, 
              gorbaBalance: player.gorbaBalance - 1,
              bribes: (player.bribes || 0) + 1 
            }
          : player
      )
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          players: bribedPlayers,
        },
      }
    case 'RESET_GAME':
      return {
        ...state,
        currentGame: null,
        currentPlayer: null,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}

const initialState = {
  currentGame: null,
  currentPlayer: null,
  loading: false,
  error: null,
}

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const { publicKey, connected } = useWallet()

  // Game actions
  const createGame = async (playerName) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return null
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // In a real implementation, this would interact with the smart contract
      const gameId = Math.random().toString(36).substring(2, 15)
      const player = {
        id: publicKey.toString(),
        name: playerName,
        address: publicKey.toString(),
        color: 'blue',
        position: 1,
        status: 'active',
        gorbaBalance: 10, // Mock balance
        bribes: 0,
        selectedDoor: null,
      }

      const game = {
        id: gameId,
        players: [player],
        status: 'waiting',
        currentLevel: 1,
        pot: 3, // Entry fee
        safeDoors: generateSafeDoors(),
        createdAt: Date.now(),
      }

      dispatch({ type: 'SET_GAME', payload: game })
      dispatch({ type: 'SET_PLAYER', payload: player })
      
      toast.success('Game created successfully!')
      return gameId
    } catch (error) {
      console.error('Error creating game:', error)
      toast.error('Failed to create game')
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return null
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const joinGame = async (gameId, playerName) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return false
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Mock joining game logic
      const player = {
        id: publicKey.toString(),
        name: playerName,
        address: publicKey.toString(),
        color: 'red', // Will be assigned by server
        position: 1,
        status: 'active',
        gorbaBalance: 10,
        bribes: 0,
        selectedDoor: null,
      }

      dispatch({ type: 'SET_PLAYER', payload: player })
      toast.success('Joined game successfully!')
      return true
    } catch (error) {
      console.error('Error joining game:', error)
      toast.error('Failed to join game')
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const selectDoor = async (doorIndex, level) => {
    if (!state.currentGame || !state.currentPlayer) {
      toast.error('No active game')
      return false
    }

    try {
      // Mock door selection logic
      const safeDoor = state.currentGame.safeDoors[level]
      const isCorrect = doorIndex === safeDoor
      
      if (isCorrect) {
        dispatch({ 
          type: 'UPDATE_PLAYER_POSITION', 
          payload: { 
            playerId: state.currentPlayer.id, 
            position: level + 1 
          } 
        })
        
        if (level + 1 > 10) {
          dispatch({ 
            type: 'SET_WINNER', 
            payload: { playerId: state.currentPlayer.id } 
          })
          toast.success('🎉 You won the game!')
        } else {
          toast.success(`Level ${level} completed!`)
        }
      } else {
        dispatch({ 
          type: 'ELIMINATE_PLAYER', 
          payload: { playerId: state.currentPlayer.id } 
        })
        toast.error('💀 You hit a trap! Game over.')
      }
      
      return isCorrect
    } catch (error) {
      console.error('Error selecting door:', error)
      toast.error('Failed to select door')
      return false
    }
  }

  const useBribe = async (level) => {
    if (!state.currentPlayer || state.currentPlayer.gorbaBalance < 1) {
      toast.error('Insufficient GORBA balance')
      return false
    }

    try {
      dispatch({ 
        type: 'USE_BRIBE', 
        payload: { playerId: state.currentPlayer.id } 
      })
      toast.success('Bribe used! +10% safe door chance')
      return true
    } catch (error) {
      console.error('Error using bribe:', error)
      toast.error('Failed to use bribe')
      return false
    }
  }

  const leaveGame = () => {
    dispatch({ type: 'RESET_GAME' })
    toast.success('Left game')
  }

  // Helper function to generate safe doors
  const generateSafeDoors = () => {
    const doors = {}
    for (let level = 1; level <= 10; level++) {
      doors[level] = Math.floor(Math.random() * 3) // 0, 1, or 2
    }
    return doors
  }

  // Get player statistics
  const getPlayerStats = () => {
    // Mock player statistics
    return {
      gamesPlayed: 25,
      wins: 8,
      losses: 17,
      winRate: 32.0,
      gorbaWon: 156,
      gorbaLost: 234,
      totalBribes: 42,
      highestLevel: 10,
      averageLevel: 6.2,
    }
  }

  const value = {
    ...state,
    createGame,
    joinGame,
    selectDoor,
    useBribe,
    leaveGame,
    getPlayerStats,
    dispatch,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}