import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Doctor from '../models/Doctor'

dotenv.config()

const doctors = [
  {
    name: 'Dr. Ahmed Hasan',
    specialization: 'Cardiologist',
    experience: 15,
    rating: 4.8
  },
  {
    name: 'Dr. Fatima Rahman',
    specialization: 'Heart Surgeon',
    experience: 12,
    rating: 4.9
  },
  {
    name: 'Dr. Mohammad Ali',
    specialization: 'Cardiologist',
    experience: 10,
    rating: 4.7
  },
  {
    name: 'Dr. Ayesha Khan',
    specialization: 'Preventive Cardiology',
    experience: 8,
    rating: 4.6
  },
  {
    name: 'Dr. Karim Uddin',
    specialization: 'Cardiac Electrophysiologist',
    experience: 14,
    rating: 4.8
  },
  {
    name: 'Dr. Nusrat Jahan',
    specialization: 'Pediatric Cardiologist',
    experience: 11,
    rating: 4.7
  }
]

async function seedDoctors() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined')
    }

    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing doctors
    await Doctor.deleteMany({})
    console.log('🗑️  Cleared existing doctors')

    // Insert new doctors
    await Doctor.insertMany(doctors)
    console.log(`✅ Seeded ${doctors.length} doctors`)

    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding doctors:', error)
    process.exit(1)
  }
}

seedDoctors()

