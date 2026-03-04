# Personal Expense & Income Tracker

A minimal full-stack web application designed for personal finance tracking. Features include categorizing transactions, viewing summaries, and managing incomes and expenses securely.

## Tech Stack

- **Backend**: FastAPI, MongoDB (Motor + Beanie ODM), PyJWT setup for secure authentication.
- **Frontend**: React, Vite, TypeScript, TailwindCSS, React Query, Recharts.

## Setup Instructions

### Quick Start (Recommended)

You can run both the frontend and backend concurrently using the provided runner scripts:

**Linux / macOS:**

```bash
./run.sh
```

**Windows:**

```powershell
.\run.ps1
```

Once running, the application will be accessible at:

- **Frontend App**: `http://localhost:5173`
- **Backend API Docs**: `http://localhost:8000/docs`

### Manual Setup

#### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- MongoDB server running locally (or adjust the MongoDB URI in `backend/database.py`).

#### Backend Setup

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
   ./venv/bin/pip install fastapi "uvicorn[standard]" pydantic "pydantic[email]" motor beanie "passlib[bcrypt]" "bcrypt<4.0.0" pyjwt python-multipart httpx pytest pytest-asyncio
   # On Windows: .\venv\Scripts\pip install ...
   ```
4. Run the FastAPI server:
   ```bash
   ./venv/bin/python -m uvicorn main:app --reload --port 8000
   # On Windows: .\venv\Scripts\python -m uvicorn ...
   ```

#### Frontend Setup

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

## API Documentation

The backend provides a RESTful API built with FastAPI. All endpoints (except `/auth/*`) require a valid JWT Bearer token in the `Authorization` header.

### Authentication

#### `POST /auth/register`

Creates a new user account.

- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  { "msg": "User created" }
  ```

#### `POST /auth/login`

Authenticates a user and returns a JWT token. Uses OAuth2 form data.

- **Request Body (Form Data):**
  - `username`: user@example.com
  - `password`: securepassword123
- **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "token_type": "bearer"
  }
  ```

### Transactions

#### `GET /transactions`

Retrieves a list of transactions for the authenticated user, sorted by newest first.

- **Query Parameters:**
  - `month` (Optional): String in `YYYY-MM` format to filter transactions (e.g., `2023-10`).
- **Response (200 OK):**
  ```json
  [
    {
      "id": "651a...a3f",
      "user_id": "6519...d2e",
      "type": "expense",
      "amount": 45.5,
      "currency": "INR",
      "category": "Food",
      "description": "Lunch",
      "date": "2023-10-02T12:00:00Z",
      "created_at": "2023-10-02T12:05:00Z",
      "updated_at": "2023-10-02T12:05:00Z"
    }
  ]
  ```

#### `POST /transactions`

Creates a new transaction.

- **Request Body:**
  ```json
  {
    "type": "expense",
    "amount": 1200,
    "currency": "INR",
    "category": "Utilities",
    "description": "Electric Bill",
    "date": "2023-10-01T09:00:00Z" // Optional, defaults to now
  }
  ```
- **Response (200 OK):** Returns the created transaction object including its new `id`.

#### `GET /transactions/{id}`

Retrieves a specific transaction by its ID.

- **Response (200 OK):** Returns the transaction object.
- **Response (404 Not Found):** If the transaction does not exist or belongs to another user.

#### `PUT /transactions/{id}`

Updates an existing transaction.

- **Request Body:** (Include only fields you wish to update)
  ```json
  {
    "amount": 1300,
    "description": "Updated Electric Bill"
  }
  ```
- **Response (200 OK):** Returns the updated transaction object.

#### `DELETE /transactions/{id}`

Deletes a specific transaction.

- **Response (200 OK):**
  ```json
  { "msg": "Deleted successfully" }
  ```

### Summary

#### `GET /summary`

Returns an aggregated summary of transactions for the authenticated user.

- **Query Parameters:**
  - `month` (Optional): String in `YYYY-MM` format to filter the summary by month (e.g., `2023-10`). Defaults to all-time if not provided.
- **Response (200 OK):**
  ```json
  {
    "total_income": 50000,
    "total_expense": 15000,
    "balance": 35000,
    "category_breakdown": {
      "Food": 5000,
      "Utilities": 2000,
      "Rent": 8000
    }
  }
  ```

## Known Limitations

- Basic error toasts instead of robust toast libraries.

## AI Usage statement

Please see [`AI-Usage-Documentation.md`](./AI-Usage-Documentation.md) for full context regarding the use of AI in this project.
