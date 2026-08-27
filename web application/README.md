# AI-Powered Precision Crop Disease Detection and Smart Agro Monitoring System

A full-stack AgriTech SaaS platform for smart farm operations, disease diagnosis, weather-aware monitoring, and data-driven crop insights.

## Architecture

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts, React Leaflet
- Backend: Node.js, Express, MongoDB Atlas, JWT Authentication, Cloudinary, Multer
- AI Service: Python Flask, TensorFlow, OpenCV
- Deployment: Docker, GitHub Actions, intended hosting on Vercel / Render / Railway / MongoDB Atlas

## Folder structure

- `frontend/` — Vite-based React application
- `backend/` — Express API with authentication, reporting, farms, sensor telemetry, admin routes
- `ai/` — Flask microservice for crop disease detection
- `.github/workflows/ci.yml` — CI pipeline for frontend, backend, and AI service
- `docker-compose.yml` — Local container orchestration for the full stack

## Setup

1. Copy `.env.example` to `.env` in `backend/` and fill MongoDB Atlas, JWT, Cloudinary, and email configuration.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Install dependencies:
   - `cd backend && npm install`
   - `cd frontend && npm install`
   - `cd ai && pip install -r requirements.txt`
4. Run frontend: `cd frontend && npm run dev`
5. Run backend: `cd backend && npm run dev`
6. Run AI service: `cd ai && python app.py`

## Notes

- Uses production-ready authentication and role-based authorization.
- Includes premium UI patterns, glassmorphism, animated charts, and map visualizations.
- Designed for MongoDB Atlas and cloud deployment.
