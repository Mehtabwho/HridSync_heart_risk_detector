export interface IDoctor {
  _id: string
  name: string
  specialization: string
  experience: number
  rating: number
  image?: string
}

export interface IRiskAssessment {
  _id: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  systolicBP: number
  diastolicBP: number
  cholesterol: number
  diabetes: boolean
  riskScore: 'Low' | 'Medium' | 'High'
  aiSummary: string
  createdAt: string
}

export interface IDietPlan {
  _id: string
  planText: string
  createdAt: string
}

