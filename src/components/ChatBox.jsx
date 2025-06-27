import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, X } from 'lucide-react'

const ChatBox = ({ messages, onSendMessage, currentPlayer, isMinimized, onToggleMinimize }) => {
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat is opened
  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isMinimized])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() && currentPlayer) {
      onSendMessage(newMessage.trim(), currentPlayer)
      setNewMessage('')
      setIsTyping(false)
    }
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    setIsTyping(e.target.value.length > 0)
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getMessageColor = (playerColor) => {
    switch (playerColor) {
      case 'blue': return 'text-blue-400'
      case 'red': return 'text-red-400'
      case 'green': return 'text-green-400'
      default: return 'text-neon-cyan'
    }
  }

  if (isMinimized) {
    return (
      <motion.button
        className="fixed bottom-4 right-4 neon-button retro-border shadow-2xl p-4 z-50 flex items-center justify-center animate-glow-flicker"
        onClick={onToggleMinimize}
        whileHover={{ scale: 1.13, rotate: 2 }}
        whileTap={{ scale: 0.97 }}
        style={{ boxShadow: '0 0 32px #00ffff, 0 0 16px #ff00ff, 0 0 2px #fff' }}
      >
        <MessageCircle className="w-7 h-7 text-neon-cyan drop-shadow-neon animate-pulse" />
        {messages.length > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 bg-neon-pink text-white text-xs rounded-full w-6 h-6 flex items-center justify-center pixel-text shadow-lg border-2 border-neon-cyan animate-glow-flicker"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            {messages.length > 9 ? '9+' : messages.length}
          </motion.div>
        )}
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-80 h-96 retro-border neon-panel bg-gradient-to-b from-black/95 via-deep-purple/95 to-space-blue/90 shadow-2xl z-50 flex flex-col animate-crt-flicker"
      style={{ boxShadow: '0 0 48px #00ffff, 0 0 24px #ff00ff, 0 0 8px #fff' }}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-neon-cyan/30 bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-neon-cyan drop-shadow-neon animate-pulse" />
          <span className="text-neon-cyan font-bold text-sm pixel-text retro-glow tracking-widest">GAME CHAT</span>
        </div>
        <button
          onClick={onToggleMinimize}
          className="text-neon-cyan hover:text-neon-pink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-neon-cyan/50 bg-black/20">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="chat-message pixel-text retro-glow bg-black/40 border border-neon-cyan/30 rounded-lg px-3 py-2 shadow-md animate-crt-flicker"
              style={{ filter: 'drop-shadow(0 0 8px #00ffff) drop-shadow(0 0 4px #ff00ff)' }}
            >
              {message.type === 'system' ? (
                <div className="text-center text-neon-yellow text-xs italic pixel-text animate-glow">
                  {message.text}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs pixel-text retro-glow ${getMessageColor(message.player?.color)}`}>
                      {message.player?.name || 'Unknown'}
                    </span>
                    <span className="text-xs text-neon-cyan/70 pixel-text">
                      {formatTime(message.ts || message.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm text-white bg-black/30 rounded-lg p-2 break-words pixel-text animate-glow-flicker">
                    {message.message || message.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-neon-cyan/30 bg-black/40 backdrop-blur-md">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder={currentPlayer ? 'Type a message...' : 'Connect wallet to chat'}
            disabled={!currentPlayer}
            className="flex-1 bg-black/60 border-2 border-neon-cyan/80 rounded-lg px-3 py-2 text-sm text-neon-cyan pixel-text placeholder-neon-pink focus:outline-none focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 transition-all shadow-lg"
            maxLength={200}
            autoComplete="off"
          />
          <motion.button
            type="submit"
            disabled={!newMessage.trim() || !currentPlayer}
            className={`neon-button px-4 py-2 text-base pixel-text retro-glow transition-all ${
              newMessage.trim() && currentPlayer
                ? 'bg-neon-cyan text-black hover:bg-neon-pink hover:text-white animate-glow-flicker'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed opacity-60'
            }`}
            whileHover={newMessage.trim() && currentPlayer ? { scale: 1.08 } : {}}
            whileTap={newMessage.trim() && currentPlayer ? { scale: 0.96 } : {}}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        {/* Character Counter */}
        <div className="text-xs text-neon-cyan/70 mt-1 text-right pixel-text">
          {newMessage.length}/200
        </div>
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-neon-cyan mt-1 pixel-text animate-glow"
          >
            Typing...
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}

export default ChatBox