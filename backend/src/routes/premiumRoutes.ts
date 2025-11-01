import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import PremiumPayment from '../models/PremiumPayment'

const router = express.Router()

router.post('/payment', [
  body('provider').isIn(['bKash', 'Nagad']).withMessage('Provider must be bKash or Nagad'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { provider, amount } = req.body

    // Mock payment processing - simulate 2 second delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate mock transaction ID
    const transactionId = `${provider.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // Calculate valid until date (30 days from now)
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30)

    // Save payment record
    const payment = new PremiumPayment({
      provider,
      amount,
      transactionId,
      validUntil
    })

    await payment.save()

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        transactionId: payment.transactionId,
        provider: payment.provider,
        amount: payment.amount,
        validUntil: payment.validUntil,
        createdAt: payment.createdAt
      }
    })
  } catch (error: any) {
    console.error('Error processing payment:', error)
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    })
  }
})

export default router

