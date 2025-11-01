import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../utils/toast'
import api from '../utils/api'
import ChatBubble from '../components/ChatBubble'
import LoadingSpinner from '../components/LoadingSpinner'
import { Send, MessageCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI heart health assistant. How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await api.post('/chat', {
        message: userMessage,
        context: {
          previousMessages: messages.slice(-5) // Send last 5 messages as context
        }
      })

      if (response.data.success && response.data.message) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.message
        }])
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error: any) {
      console.error('Error in chat:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get response from AI'
      showToast(errorMessage, 'error')
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or check if the backend server is running.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Health Chat
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ask me anything about heart health
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[600px] flex flex-col"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Disclaimer:</strong> AI-generated advice. Consult a real doctor before following.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatBubble
                key={index}
                message={message.content}
                isUser={message.role === 'user'}
              />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <LoadingSpinner size="sm" />
                <span>AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

