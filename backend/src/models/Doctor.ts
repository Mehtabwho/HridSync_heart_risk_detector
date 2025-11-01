import mongoose, { Schema, Document } from 'mongoose'

export interface IDoctor extends Document {
  name: string
  specialization: string
  experience: number
  rating: number
  image?: string
}

const DoctorSchema = new Schema<IDoctor>({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  image: {
    type: String
  }
})

export default mongoose.model<IDoctor>('Doctor', DoctorSchema)

