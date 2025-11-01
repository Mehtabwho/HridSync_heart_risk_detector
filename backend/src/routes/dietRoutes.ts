import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import DietPlan from '../models/DietPlan'
import RiskAssessment from '../models/RiskAssessment'
import { generateDietPlan } from '../utils/aiService'
import { authenticate } from '../middleware/auth'

const router = express.Router()

router.post('/generate', authenticate, [
  body('riskAssessmentId').isMongoId().withMessage('Invalid risk assessment ID')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { riskAssessmentId } = req.body
    const userId = req.userId!

    // Find the risk assessment (must belong to the user)
    const assessment = await RiskAssessment.findOne({ 
      _id: riskAssessmentId.trim(),
      userId: userId
    })
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Risk assessment not found or access denied'
      })
    }

    // Check if 3-month diet plan already exists
    let dietPlan = await DietPlan.findOne({ 
      riskAssessmentRef: riskAssessmentId,
      userId: userId,
      durationMonths: 3
    })
    
    if (!dietPlan) {
      // Generate new 3-month diet plan
      const planText = await generateDietPlan(
        assessment.riskScore,
        {
          age: assessment.age,
          gender: assessment.gender,
          diabetes: assessment.diabetes
        },
        3 // 3 months
      )

      dietPlan = new DietPlan({
        userId: userId,
        riskAssessmentRef: assessment._id,
        planText,
        durationMonths: 3
      })

      await dietPlan.save()
    }

    res.json({
      success: true,
      data: {
        id: dietPlan._id,
        planText: dietPlan.planText,
        createdAt: dietPlan.createdAt
      }
    })
  } catch (error: any) {
    console.error('Error generating diet plan:', error)
    res.status(500).json({
      success: false,
      message: 'Error generating diet plan',
      error: error.message
    })
  }
})

export default router

