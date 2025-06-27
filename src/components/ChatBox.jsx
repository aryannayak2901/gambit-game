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
      onSendMessage(newMessage.trim())
      setNewMessage('')
      setIsTyping(false)
    }
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    setIsTyping(e.target.value.length > 0)
  }

  const formatTime = (timestamp) => {
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
        className="fixed bottom-4 right-4 bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 border-2 border-neon-cyan rounded-full p-3 backdrop-blur-sm z-40"
        onClick={onToggleMinimize}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6 text-neon-cyan" />
        {messages.length > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 bg-neon-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
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
      className="fixed bottom-4 right-4 w-80 h-96 bg-gradient-to-b from-space-blue/90 to-deep-purple/90 border-2 border-neon-cyan rounded-lg backdrop-blur-sm z-40 flex flex-col"
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-neon-cyan/30">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-neon-cyan" />
          <span className="text-neon-cyan font-bold text-sm">GAME CHAT</span>
        </div>
        <button
          onClick={onToggleMinimize}
          className="text-neon-cyan hover:text-neon-pink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-neon-cyan/50">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="chat-message-enter"
            >
              {message.type === 'system' ? (
                <div className="text-center text-neon-yellow text-xs italic">
                  {message.text}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${getMessageColor(message.player?.color)}`}>
                      {message.player?.name || 'Unknown'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm text-white bg-black/20 rounded-lg p-2 break-words">
                    {message.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-neon-cyan/30">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder={currentPlayer ? "Type a message..." : "Connect wallet to chat"}
            disabled={!currentPlayer}
            className="flex-1 bg-black/30 border border-neon-cyan/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
            maxLength={200}
          />
          <motion.button
            type="submit"
            disabled={!newMessage.trim() || !currentPlayer}
            className={`px-3 py-2 rounded-lg transition-all ${
              newMessage.trim() && currentPlayer
                ? 'bg-neon-cyan text-black hover:bg-neon-pink hover:text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={newMessage.trim() && currentPlayer ? { scale: 1.05 } : {}}
            whileTap={newMessage.trim() && currentPlayer ? { scale: 0.95 } : {}}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        
        {/* Character Counter */}
        <div className="text-xs text-gray-400 mt-1 text-right">
          {newMessage.length}/200
        </div>
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-neon-cyan mt-1"
          >
            Typing...
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}

export default ChatBox