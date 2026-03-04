#!/bin/bash

# Function to clean up background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Trap SIGINT and SIGTERM signals
trap cleanup SIGINT SIGTERM

echo "Starting Backend Server..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment and installing backend dependencies..."
    python3 -m venv venv
    source venv/bin/activate
    pip install fastapi "uvicorn[standard]" pydantic "pydantic[email]" motor beanie "passlib[bcrypt]" "bcrypt<4.0.0" pyjwt python-multipart
else
    source venv/bin/activate
fi
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

echo "Starting Frontend Server..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "======================================================"
echo " Personal Expense & Income Tracker is running!"
echo "- **Frontend App**: \`http://localhost:5173\`"
echo "- **Backend API Docs**: \`http://localhost:8000/docs\`"
echo "======================================================"
echo "Press Ctrl+C to stop all servers."
echo ""

# Wait indefinitely
wait
