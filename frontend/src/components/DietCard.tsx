import { motion } from 'framer-motion'
import { UtensilsCrossed } from 'lucide-react'

interface DietCardProps {
  planText: string
  createdAt: string
}

export default function DietCard({ planText, createdAt }: DietCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-4">
        <UtensilsCrossed className="w-6 h-6 text-primary-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          7-Day Diet Plan
        </h3>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
          {planText}
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Generated on: {new Date(createdAt).toLocaleDateString()}
      </p>
    </motion.div>
  )
}

