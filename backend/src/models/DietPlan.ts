import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IDietPlan extends Document {
  userId: Types.ObjectId
  riskAssessmentRef: Types.ObjectId
  planText: string
  durationMonths: number
  createdAt: Date
}

const DietPlanSchema = new Schema<IDietPlan>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  riskAssessmentRef: {
    type: Schema.Types.ObjectId,
    ref: 'RiskAssessment',
    required: true
  },
  planText: {
    type: String,
    required: true
  },
  durationMonths: {
    type: Number,
    default: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model<IDietPlan>('DietPlan', DietPlanSchema)

