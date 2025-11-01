import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IRiskAssessment extends Document {
  userId: Types.ObjectId
  age: number
  gender: 'Male' | 'Female' | 'Other'
  systolicBP: number
  diastolicBP: number
  cholesterol: number
  diabetes: boolean
  riskScore: 'Low' | 'Medium' | 'High'
  aiSummary: string
  createdAt: Date
}

const RiskAssessmentSchema = new Schema<IRiskAssessment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 150
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  systolicBP: {
    type: Number,
    required: true,
    min: 50,
    max: 250
  },
  diastolicBP: {
    type: Number,
    required: true,
    min: 30,
    max: 200
  },
  cholesterol: {
    type: Number,
    required: true,
    min: 0
  },
  diabetes: {
    type: Boolean,
    required: true
  },
  riskScore: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  aiSummary: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model<IRiskAssessment>('RiskAssessment', RiskAssessmentSchema)

