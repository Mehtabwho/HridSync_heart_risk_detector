# Quick Start Guide

## Starting the Application

### 1. Start Backend Server
Open a terminal and run:
```bash
cd backend
npm run dev
```
Wait for: "✅ Connected to MongoDB" and "🚀 Server running on port 5000"

### 2. Seed Doctors (First Time Only)
In another terminal:
```bash
cd backend
npm run seed
```
This populates the database with sample doctors.

### 3. Start Frontend
Open another terminal and run:
```bash
cd frontend
npm run dev
```
The frontend will open at `http://localhost:5173`

## Troubleshooting

### Backend not connecting?
- Make sure backend is running on port 5000
- Check `.env` file in `backend/` directory exists
- Verify MongoDB connection in backend terminal

### Frontend errors?
- Check browser console (F12) for detailed errors
- Ensure backend is running first
- Verify API URL is `http://localhost:5000/api`

### Doctors not loading?
- Run `npm run seed` in the backend directory
- Check backend terminal for database errors

