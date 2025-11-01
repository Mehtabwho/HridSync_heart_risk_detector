import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import Appointment from '../models/Appointment'
import Doctor from '../models/Doctor'

const router = express.Router()

router.post('/', [
  body('doctorId').isMongoId().withMessage('Invalid doctor ID'),
  body('patientName').trim().isLength({ min: 2 }).withMessage('Patient name must be at least 2 characters'),
  body('contact').trim().isLength({ min: 10 }).withMessage('Contact must be at least 10 characters'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('notes').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { doctorId, patientName, contact, date, notes } = req.body

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      })
    }

    // Check if date is in the future
    const appointmentDate = new Date(date)
    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date must be in the future'
      })
    }

    const appointment = new Appointment({
      doctorRef: doctorId,
      patientName,
      contact,
      date: appointmentDate,
      notes: notes || ''
    })

    await appointment.save()

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        id: appointment._id,
        doctor: {
          id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization
        },
        patientName,
        contact,
        date: appointment.date,
        notes: appointment.notes,
        createdAt: appointment.createdAt
      }
    })
  } catch (error: any) {
    console.error('Error booking appointment:', error)
    res.status(500).json({
      success: false,
      message: 'Error booking appointment',
      error: error.message
    })
  }
})

export default router

