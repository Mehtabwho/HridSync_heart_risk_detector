import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard } from 'lucide-react'
import { useToast } from '../utils/toast'
import api from '../utils/api'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<'bKash' | 'Nagad' | null>(null)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const amount = 299

  const handlePayment = async () => {
    if (!selectedProvider) {
      showToast('Please select a payment method', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/premium/payment', {
        provider: selectedProvider,
        amount
      })
      showToast('Payment successful! Premium features unlocked.', 'success')
      localStorage.setItem('isPremium', 'true')
      localStorage.setItem('premiumUntil', new Date(response.data.data.validUntil).toISOString())
      onSuccess()
      onClose()
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Payment failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upgrade to Premium
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900 rounded-lg">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                ৳{amount} BDT
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                30 days of premium access
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSelectedProvider('bKash')}
                className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedProvider === 'bKash'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">bKash</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mobile banking payment
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedProvider('Nagad')}
                className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedProvider === 'Nagad'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Nagad</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mobile banking payment
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={loading || !selectedProvider}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay ৳299'}
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              This is a mock payment. No actual transaction will occur.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

