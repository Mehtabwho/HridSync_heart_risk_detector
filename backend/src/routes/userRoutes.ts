import express, { Request, Response } from 'express'
import { authenticate } from '../middleware/auth'
import RiskAssessment from '../models/RiskAssessment'
import DietPlan from '../models/DietPlan'

const router = express.Router()

// Get user's assessments
router.get('/assessments', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!
    const assessments = await RiskAssessment.find({ userId })
      .sort({ createdAt: -1 })
      .select('riskScore aiSummary createdAt age gender')
    
    res.json({
      success: true,
      data: assessments
    })
  } catch (error: any) {
    console.error('Error fetching user assessments:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching assessments',
      error: error.message
    })
  }
})

// Get user's 3-month diet plan
router.get('/diet-plan', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!
    const dietPlan = await DietPlan.findOne({ userId, durationMonths: 3 })
      .sort({ createdAt: -1 })
      .populate('riskAssessmentRef', 'riskScore createdAt')
    
    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'No 3-month diet plan found. Please generate one after completing an assessment.'
      })
    }
    
    res.json({
      success: true,
      data: dietPlan
    })
  } catch (error: any) {
    console.error('Error fetching diet plan:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching diet plan',
      error: error.message
    })
  }
})

export default router

