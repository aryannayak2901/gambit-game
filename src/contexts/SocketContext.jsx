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
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'
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


    // LOBBY & GAME EVENTS (sync with backend)
    newSocket.on('lobby_update', (game) => {
      dispatch({ type: 'SET_GAME', payload: game })
    })
    newSocket.on('game_start', (game) => {
      dispatch({ type: 'SET_GAME', payload: game })
      dispatch({ type: 'SET_GAME_STATUS', payload: 'playing' })
      toast.success('Game started!')
    })
    newSocket.on('game_update', (game) => {
      dispatch({ type: 'SET_GAME', payload: game })
      if (game.status === 'finished') {
        toast.success('Game finished!')
      }
    })
    newSocket.on('chat_message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    // Legacy/compat events (optional)
    newSocket.on('gameCreated', (data) => {
      dispatch({ type: 'SET_GAME', payload: data.game })
    })
    newSocket.on('playerJoined', (data) => {
      dispatch({ type: 'UPDATE_PLAYERS', payload: data.game.players })
      toast.success(`${data.player.name} joined the game`)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [dispatch])

  // Socket actions

  // Multiplayer actions (sync with backend server)
  const createGame = (gameId, player) => {
    if (!socket || !connected) {
      toast.error('Not connected to server')
      return
    }
    socket.emit('join_lobby', { gameId, player })
  }
  const joinGame = (gameId, player) => {
    if (!socket || !connected) {
      toast.error('Not connected to server')
      return
    }
    socket.emit('join_lobby', { gameId, player })
  }
  const selectDoor = (gameId, playerId, level, doorIndex) => {
    if (!socket || !connected) {
      toast.error('Not connected to server')
      return
    }
    socket.emit('select_door', { gameId, playerId, level, doorIndex })
  }
  const useBribe = (gameId, playerId, level) => {
    if (!socket || !connected) {
      toast.error('Not connected to server')
      return
    }
    socket.emit('use_bribe', { gameId, playerId, level })
  }
  const sendMessage = (gameId, player, message) => {
    if (!socket || !connected) {
      toast.error('Not connected to server')
      return
    }
    if (message.trim()) {
      socket.emit('send_message', { gameId, player, message: message.trim() })
    }
  }
  const leaveGame = (gameId, playerId) => {
    if (!socket || !connected) {
      return
    }
    socket.emit('leave_game', { gameId, playerId })
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