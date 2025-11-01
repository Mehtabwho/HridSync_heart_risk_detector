import express, { Request, Response } from 'express'
import Doctor from '../models/Doctor'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find().sort({ rating: -1, experience: -1 })
    console.log(`Found ${doctors.length} doctors`)
    res.json({
      success: true,
      data: doctors
    })
  } catch (error: any) {
    console.error('Error fetching doctors:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    })
  }
})

export default router

