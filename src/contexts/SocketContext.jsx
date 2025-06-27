import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGame } from './GameContext'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const { publicKey } = useWallet()
  const { dispatch } = useGame()

  // Initialize socket connection
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
      setConnected(true)
      toast.success('Connected to game server')
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setConnected(false)
      toast.error('Disconnected from server')
    })

    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
      toast.error(error.message || 'Connection error')
    })

    // Game event listeners
    newSocket.on('gameCreated', (data) => {
      console.log('Game created:', data)
      dispatch({ type: 'SET_GAME', payload: data.game })
    })

    newSocket.on('playerJoined', (data) => {
      console.log('Player joined:', data)
      dispatch({ type: 'UPDATE_PLAYERS', payload: data.game.players })
      toast.success(`${data.player.name} joined the game`)
    })

    newSocket.on('gameStarted', (data) => {
      console.log('Game started:', data)
      dispatch({ type: 'SET_GAME_STATUS', payload: 'playing' })
      toast.success('Game started! Choose your doors wisely!')
    })

    newSocket.on('doorSelected', (data) => {
      console.log('Door selected:', data)
      const { playerId, doorIndex, level, result, game } = data
      
      dispatch({ type: 'SET_GAME', payload: game })
      
      if (result === 'advance') {
        toast.success(`Player advanced to level ${level + 1}!`)
      } else if (result === 'eliminated') {
        toast.error(`Player was eliminated!`)
      }
    })

    newSocket.on('gameFinished', (data) => {
      console.log('Game finished:', data)
      dispatch({ type: 'SET_GAME', payload: data.game })
      toast.success(`🎉 Game finished! Winner gets ${data.pot} GORBA!`)
    })

    newSocket.on('playerEliminated', () => {
      toast.error('💀 You were eliminated!')
    })

    newSocket.on('levelAdvanced', (data) => {
      toast.success(`🎯 Advanced to level ${data.nextLevel}!`)
    })

    newSocket.on('bribeUsed', (data) => {
      toast.success(`💰 Bribe used for level ${data.level}!`)
    })

    newSocket.on('playerUsedBribe', (data) => {
      const { playerId, level, game } = data
      dispatch({ type: 'SET_GAME', payload: game })
      toast.info(`Player used a bribe on level ${level}`)
    })

    newSocket.on('playerLeft', (data) => {
      console.log('Player left:', data)
      dispatch({ type: 'SET_GAME', payload: data.game })
      toast.info('A player left the game')
    })

    newSocket.on('playerDisconnected', (data) => {
      console.log('Player disconnected:', data)
      dispatch({ type: 'SET_GAME', payload: data.game })
      toast.warning('A player disconnected')
    })

    newSocket.on('newMessage', (message) => {
      console.log('New message:', message)
      setMessages(prev => [...prev, message])
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [dispatch])

  // Socket actions
  const createGame = (playerName, gorbaBalance = 10) => {
    if (!socket || !connected) {
      toast.error('Not connected to server')
      return
    }

    socket.emit('createGame', {
      playerName,
      walletAddress: publicKey?.toString(),
      gorbaBalance,
    })
  }

  const joinGame = (gameId, playerName, gorbaBalance = 10) => {
    if (!socket || !connected) {
      toast.error('Not connected to server')
      return
    }

    socket.emit('joinGame', {
      gameId,
      playerName,
      walletAddress: publicKey?.toString(),
      gorbaBalance,
    })
  }

  const selectDoor = (gameId, doorIndex, level) => {
    if (!socket || !connected) {
      toast.error('Not connected to server')
      return
    }

    socket.emit('selectDoor', {
      gameId,
      doorIndex,
      level,
    })
  }

  const useBribe = (gameId, level) => {
    if (!socket || !connected) {
      toast.error('Not connected to server')
      return
    }

    socket.emit('useBribe', {
      gameId,
      level,
    })
  }

  const sendMessage = (message) => {
    if (!socket || !connected) {
      toast.error('Not connected to server')
      return
    }

    if (message.trim()) {
      socket.emit('sendMessage', { message: message.trim() })
    }
  }

  const leaveGame = () => {
    if (!socket || !connected) {
      return
    }

    socket.emit('leaveGame')
    setMessages([])
  }

  const value = {
    socket,
    connected,
    messages,
    createGame,
    joinGame,
    selectDoor,
    useBribe,
    sendMessage,
    leaveGame,
    setMessages,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}