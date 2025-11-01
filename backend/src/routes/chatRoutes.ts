import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { chatWithAI } from '../utils/aiService'

const router = express.Router()

router.post('/', [
  body('message').trim().isLength({ min: 1 }).withMessage('Message cannot be empty')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { message, context } = req.body

    console.log('[Chat] Processing message:', message.substring(0, 50) + '...')
    const response = await chatWithAI(message, context)
    console.log('[Chat] Response generated successfully')

    res.json({
      success: true,
      message: response
    })
  } catch (error: any) {
    console.error('[Chat] Error details:', error)
    console.error('[Chat] Error stack:', error.stack)
    res.status(500).json({
      success: false,
      message: `Error processing chat message: ${error.message}`,
      error: error.message
    })
  }
})

export default router

