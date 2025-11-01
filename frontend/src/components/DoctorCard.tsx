import { motion } from 'framer-motion'
import { Star, Calendar } from 'lucide-react'
import { IDoctor } from '../types'

interface DoctorCardProps {
  doctor: IDoctor
  onBookAppointment: (doctor: IDoctor) => void
}

export default function DoctorCard({ doctor, onBookAppointment }: DoctorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {doctor.name}
          </h3>
          <p className="text-primary-600 dark:text-primary-400 font-medium">
            {doctor.specialization}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{doctor.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{doctor.experience} years</span>
        </div>
      </div>
      <button
        onClick={() => onBookAppointment(doctor)}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Book Appointment
      </button>
    </motion.div>
  )
}

