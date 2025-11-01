import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../utils/toast'
import api from '../utils/api'
import DoctorCard from '../components/DoctorCard'
import AppointmentModal from '../components/AppointmentModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { IDoctor } from '../types'
import { Stethoscope } from 'lucide-react'

export default function Doctors() {
  const [doctors, setDoctors] = useState<IDoctor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors')
      if (response.data.success && response.data.data) {
        setDoctors(response.data.data)
      } else {
        showToast('No doctors found. Please seed the database.', 'info')
      }
    } catch (error: any) {
      console.error('Error fetching doctors:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load doctors'
      showToast(errorMessage, 'error')
      console.error('Full error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = (doctor: IDoctor) => {
    setSelectedDoctor(doctor)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Stethoscope className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Expert Doctors
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Book an appointment with our experienced cardiology specialists
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DoctorCard
                  doctor={doctor}
                  onBookAppointment={handleBookAppointment}
                />
              </motion.div>
            ))}
          </div>
        )}

        {doctors.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">
              No doctors available at the moment. Please check back later.
            </p>
          </div>
        )}

        <AppointmentModal
          doctor={selectedDoctor}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedDoctor(null)
          }}
        />
      </div>
    </div>
  )
}

