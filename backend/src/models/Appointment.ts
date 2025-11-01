import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IAppointment extends Document {
  doctorRef: Types.ObjectId
  patientName: string
  contact: string
  date: Date
  notes?: string
  createdAt: Date
}

const AppointmentSchema = new Schema<IAppointment>({
  doctorRef: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema)

