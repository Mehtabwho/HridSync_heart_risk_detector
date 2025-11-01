import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import RiskAssessment from '../models/RiskAssessment'
import { generateRiskSummary } from '../utils/aiService'
import { authenticate } from '../middleware/auth'

const router = express.Router()

router.post('/assess', authenticate, [
  body('age').isInt({ min: 1, max: 150 }).withMessage('Age must be between 1 and 150'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('systolicBP').isInt({ min: 50, max: 250 }).withMessage('Systolic BP must be between 50 and 250'),
  body('diastolicBP').isInt({ min: 30, max: 200 }).withMessage('Diastolic BP must be between 30 and 200'),
  body('cholesterol').isFloat({ min: 0 }).withMessage('Cholesterol must be a positive number'),
  body('diabetes').isBoolean().withMessage('Diabetes must be a boolean value')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { age, gender, systolicBP, diastolicBP, cholesterol, diabetes } = req.body

    // Generate AI risk assessment
    const { riskScore, summary } = await generateRiskSummary({
      age,
      gender,
      systolicBP,
      diastolicBP,
      cholesterol,
      diabetes
    })

    // Save to database
    const assessment = new RiskAssessment({
      userId: req.userId!,
      age,
      gender,
      systolicBP,
      diastolicBP,
      cholesterol,
      diabetes,
      riskScore,
      aiSummary: summary
    })

    await assessment.save()

    res.status(201).json({
      success: true,
      data: {
        id: assessment._id,
        riskScore,
        summary,
        createdAt: assessment.createdAt
      }
    })
  } catch (error: any) {
    console.error('Error in risk assessment:', error)
    res.status(500).json({
      success: false,
      message: 'Error processing risk assessment',
      error: error.message
    })
  }
})

export default router

