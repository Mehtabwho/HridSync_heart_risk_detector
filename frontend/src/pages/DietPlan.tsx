import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useToast } from '../utils/toast'
import api from '../utils/api'
import DietCard from '../components/DietCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { UtensilsCrossed } from 'lucide-react'

interface DietPlanResult {
  id: string
  planText: string
  createdAt: string
}

interface Assessment {
  _id: string
  riskScore: string
  createdAt: string
}

export default function DietPlan() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [riskAssessmentId, setRiskAssessmentId] = useState('')
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAssessments, setLoadingAssessments] = useState(true)
  const [dietPlan, setDietPlan] = useState<DietPlanResult | null>(null)
  const { showToast } = useToast()

  // Get assessments and check URL params
  useEffect(() => {
    const assessmentIdFromUrl = searchParams.get('assessmentId')
    
    const fetchAssessments = async () => {
      try {
        const response = await api.get('/user/assessments')
        const assessmentList = response.data.data || []
        setAssessments(assessmentList)
        
        // Use URL param if available, otherwise use latest assessment
        if (assessmentIdFromUrl) {
          setRiskAssessmentId(assessmentIdFromUrl)
        } else if (assessmentList.length > 0) {
          setRiskAssessmentId(assessmentList[0]._id)
        }
      } catch (error: any) {
        showToast('Failed to load assessments', 'error')
      } finally {
        setLoadingAssessments(false)
      }
    }

    fetchAssessments()
  }, [searchParams])

  const handleGenerate = async () => {
    if (!riskAssessmentId.trim()) {
      showToast('Please enter a risk assessment ID', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/diet/generate', {
        riskAssessmentId
      })
      setDietPlan(response.data.data)
      showToast('Diet plan generated successfully!', 'success')
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to generate diet plan', 'error')
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
          <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Personalized Diet Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate a comprehensive 3-month heart-healthy diet plan based on your risk assessment
          </p>
        </motion.div>

        {!dietPlan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
          >
            {loadingAssessments ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : assessments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No assessments found. Please complete an assessment first.
                </p>
                <button
                  onClick={() => navigate('/assessment')}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Take Assessment
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Assessment *
                </label>
                <select
                  value={riskAssessmentId}
                  onChange={(e) => setRiskAssessmentId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {assessments.map((assessment) => (
                    <option key={assessment._id} value={assessment._id}>
                      {assessment.riskScore} Risk - {new Date(assessment.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Select the assessment to generate a 3-month diet plan
                </p>
              </div>
            )}

            {assessments.length > 0 && (
              <button
                onClick={handleGenerate}
                disabled={loading || !riskAssessmentId.trim()}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Generating 3-Month Diet Plan...</span>
                  </span>
                ) : (
                  'Generate 3-Month Diet Plan'
                )}
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <DietCard planText={dietPlan.planText} createdAt={dietPlan.createdAt} />
            <button
              onClick={() => setDietPlan(null)}
              className="mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              Generate New Plan
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

