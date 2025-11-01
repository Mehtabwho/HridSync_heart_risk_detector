import { useState } from 'react'
import { motion } from 'framer-motion'
import PaymentModal from '../components/PaymentModal'
import { Crown, Check } from 'lucide-react'

const features = [
  'Unlimited AI chat consultations',
  'Advanced risk analysis reports',
  'Priority diet plan generation',
  'Extended progress tracking history',
  'Exclusive health insights',
  '24/7 premium support'
]

export default function Premium() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isPremium, setIsPremium] = useState(() => {
    const premium = localStorage.getItem('isPremium')
    const validUntil = localStorage.getItem('premiumUntil')
    if (premium === 'true' && validUntil) {
      const validDate = new Date(validUntil)
      if (validDate > new Date()) {
        return true
      } else {
        localStorage.removeItem('isPremium')
        localStorage.removeItem('premiumUntil')
        return false
      }
    }
    return false
  })

  const handlePaymentSuccess = () => {
    setIsPremium(true)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Crown className="w-16 h-16 mx-auto mb-4 text-primary-600" fill="currentColor" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Membership
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Unlock advanced features and personalized health insights
          </p>
        </motion.div>

        {isPremium ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-xl p-8 text-white text-center"
          >
            <Check className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">You're a Premium Member!</h2>
            <p className="text-lg mb-6">
              Enjoy all premium features and exclusive benefits.
            </p>
            <p className="text-sm opacity-90">
              Valid until: {localStorage.getItem('premiumUntil') ? 
                new Date(localStorage.getItem('premiumUntil')!).toLocaleDateString() : 
                'N/A'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Free Plan
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">৳0</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <Check className="w-5 h-5 text-primary-600 mr-2" />
                  Basic risk assessment
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <Check className="w-5 h-5 text-primary-600 mr-2" />
                  Limited AI chat (5 messages/day)
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <Check className="w-5 h-5 text-primary-600 mr-2" />
                  Basic diet plans
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-xl p-6 text-white relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                RECOMMENDED
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">৳299</span>
                <span className="opacity-90">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </motion.div>
        )}

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  )
}

