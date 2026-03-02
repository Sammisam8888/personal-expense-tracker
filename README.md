# Personal Expense & Income Tracker

A minimal full-stack web application designed for personal finance tracking. Features include categorizing transactions, viewing summaries, and managing incomes and expenses securely.

## Tech Stack
- **Backend**: FastAPI, MongoDB (Motor + Beanie ODM), PyJWT setup for secure authentication.
- **Frontend**: React, Vite, TypeScript, TailwindCSS, React Query, Recharts.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB server running locally (or adjust the MongoDB URI in `backend/database.py`).

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi "uvicorn[standard]" pydantic "pydantic[email]" motor beanie "passlib[bcrypt]" pyjwt python-multipart
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The API will be available at `http://localhost:8000` and docs at `http://localhost:8000/docs`.*

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

## Known Limitations
- Dark mode toggle is currently unhandled.
- Monthly filtering UI is not fully present in the dashboard (transactions are returned starting from newest).
- Basic error toasts instead of robust toast libraries.

## AI Usage Documentation
This project was implemented with the assistance of an AI coding agent. The AI was used for reasoning through boilerplate setup, component structure generation, and basic API endpoints as per the rule allowances. The logic and component layouts were constructed with standard minimal implementations that match modern paradigms without excessive abstraction.
