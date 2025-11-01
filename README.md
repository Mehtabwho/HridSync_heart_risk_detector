# HridSync - AI Heart Health Assistant

An AI-powered web application for heart health assessment, personalized diet planning, and health monitoring. Built with React, Node.js, MongoDB, and OpenRouter AI.

## Features

- 🩺 **Heart Risk Assessment**: AI-powered risk analysis based on health metrics
- 🥗 **Personalized Diet Plans**: 7-day heart-healthy meal plans tailored to your risk profile
- 💬 **AI Health Chat**: Interactive chatbot for heart health questions
- 👨‍⚕️ **Doctor Appointments**: Browse and book appointments with cardiology specialists
- 📊 **Progress Tracking**: Visual charts showing your health metrics over time
- ⭐ **Premium Features**: Unlock advanced features with premium membership

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- Chart.js for data visualization
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- OpenRouter API for AI integration
- Express Validator for input validation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- OpenRouter API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai_detection
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_ORIGIN=http://localhost:5173
```

Seed the database with sample doctors:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Risk Assessment
- `POST /api/risk/assess` - Create a new risk assessment

### Diet Plans
- `POST /api/diet/generate` - Generate a diet plan based on risk assessment

### Doctors
- `GET /api/doctors` - Get list of all doctors

### Appointments
- `POST /api/appointments` - Book a new appointment

### Premium
- `POST /api/premium/payment` - Process premium payment (mock)

### Progress
- `GET /api/progress?limit=10` - Get recent risk assessments

### Chat
- `POST /api/chat` - Send message to AI chat

## Project Structure

```
ai_detection/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utilities (API, theme, toast)
│   │   ├── types.ts        # TypeScript types
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utilities (AI service)
│   │   ├── scripts/        # Database seeding scripts
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Usage

1. **Risk Assessment**: Navigate to `/assessment` and fill in your health metrics to get an AI-powered risk analysis.

2. **Diet Plans**: After completing an assessment, use the assessment ID to generate a personalized 7-day diet plan at `/diet`.

3. **AI Chat**: Visit `/chat` to ask questions about heart health and get AI-powered responses.

4. **Doctors**: Browse available cardiologists at `/doctors` and book appointments.

5. **Progress**: View your health metrics over time with interactive charts at `/progress`.

6. **Premium**: Upgrade to premium at `/premium` to unlock advanced features.

## Development

### Backend Development

```bash
cd backend
npm run dev    # Start development server with hot reload
npm run build  # Build for production
npm start      # Run production build
```

### Frontend Development

```bash
cd frontend
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## Important Notes

⚠️ **Medical Disclaimer**: This application provides AI-generated health information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

