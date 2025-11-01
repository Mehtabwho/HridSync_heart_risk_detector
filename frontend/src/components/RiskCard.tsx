import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface RiskCardProps {
  riskScore: 'Low' | 'Medium' | 'High'
  summary: string
  createdAt: string
}

export default function RiskCard({ riskScore, summary, createdAt }: RiskCardProps) {
  const getRiskColor = () => {
    switch (riskScore) {
      case 'Low':
        return 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-400 dark:text-green-200'
      case 'Medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-400 dark:text-yellow-200'
      case 'High':
        return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-400 dark:text-red-200'
    }
  }

  const getRiskIcon = () => {
    switch (riskScore) {
      case 'Low':
        return <CheckCircle className="w-8 h-8" />
      case 'Medium':
        return <AlertTriangle className="w-8 h-8" />
      case 'High':
        return <XCircle className="w-8 h-8" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 rounded-lg p-6 ${getRiskColor()}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {getRiskIcon()}
        <h3 className="text-2xl font-bold">Risk Level: {riskScore}</h3>
      </div>
      <p className="mb-4 leading-relaxed">{summary}</p>
      <p className="text-sm opacity-75">
        Assessed on: {new Date(createdAt).toLocaleDateString()}
      </p>
    </motion.div>
  )
}

