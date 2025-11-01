import mongoose, { Schema, Document } from 'mongoose'

export interface IPremiumPayment extends Document {
  provider: 'bKash' | 'Nagad'
  amount: number
  transactionId: string
  validUntil: Date
  createdAt: Date
}

const PremiumPaymentSchema = new Schema<IPremiumPayment>({
  provider: {
    type: String,
    enum: ['bKash', 'Nagad'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model<IPremiumPayment>('PremiumPayment', PremiumPaymentSchema)

