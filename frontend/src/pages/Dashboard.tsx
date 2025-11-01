import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../utils/auth'
import { useToast } from '../utils/toast'
import api from '../utils/api'
import RiskCard from '../components/RiskCard'
import DietCard from '../components/DietCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Link } from 'react-router-dom'
import { Heart, FileText, UtensilsCrossed, TrendingUp, Plus } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Assessment {
  _id: string
  riskScore: 'Low' | 'Medium' | 'High'
  aiSummary: string
  createdAt: string
  age: number
  gender: string
}

interface DietPlan {
  _id: string
  planText: string
  createdAt: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
  const [progressData, setProgressData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [assessmentsRes, dietRes, progressRes] = await Promise.all([
        api.get('/user/assessments'),
        api.get('/user/diet-plan').catch(() => ({ data: { success: false } })),
        api.get('/progress')
      ])

      setAssessments(assessmentsRes.data.data || [])
      if (dietRes.data.success) {
        setDietPlan(dietRes.data.data)
      }
      setProgressData(progressRes.data.data || [])
    } catch (error: any) {
      showToast('Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const riskData = {
    labels: progressData.map(a => new Date(a.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Risk Score',
        data: progressData.map(a => {
          switch (a.riskScore) {
            case 'Low': return 1
            case 'Medium': return 2
            case 'High': return 3
            default: return 0
          }
        }),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const latestAssessment = assessments[0]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your heart health journey
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/assessment"
            className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
          >
            <Plus className="w-6 h-6 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-white">New Assessment</span>
          </Link>
          {!dietPlan && latestAssessment && (
            <Link
              to={`/diet?assessmentId=${latestAssessment._id}`}
              className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
            >
              <UtensilsCrossed className="w-6 h-6 text-primary-600" />
              <span className="font-medium text-gray-900 dark:text-white">Generate Diet Plan</span>
            </Link>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Latest Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Latest Assessment
              </h2>
            </div>
            {latestAssessment ? (
              <RiskCard
                riskScore={latestAssessment.riskScore}
                summary={latestAssessment.aiSummary}
                createdAt={latestAssessment.createdAt}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No assessments yet
                </p>
                <Link
                  to="/assessment"
                  className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Take Assessment
                </Link>
              </div>
            )}
          </motion.div>

          {/* 3-Month Diet Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <UtensilsCrossed className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                3-Month Diet Plan
              </h2>
            </div>
            {dietPlan ? (
              <DietCard
                planText={dietPlan.planText}
                createdAt={dietPlan.createdAt}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No diet plan generated yet
                </p>
                {latestAssessment && (
                  <Link
                    to={`/diet?assessmentId=${latestAssessment._id}`}
                    className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Generate Plan
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Progress Chart */}
        {progressData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Progress Overview
              </h2>
            </div>
            <Line data={riskData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' as const }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }} />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              1=Low, 2=Medium, 3=High
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

