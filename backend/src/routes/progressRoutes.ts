import express, { Request, Response } from 'express'
import RiskAssessment from '../models/RiskAssessment'
import { authenticate } from '../middleware/auth'

const router = express.Router()

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!
    const limit = parseInt(req.query.limit as string) || 10
    const assessments = await RiskAssessment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('age gender systolicBP diastolicBP cholesterol diabetes riskScore createdAt')

    res.json({
      success: true,
      data: assessments
    })
  } catch (error: any) {
    console.error('Error fetching progress:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching progress data',
      error: error.message
    })
  }
})

export default router

