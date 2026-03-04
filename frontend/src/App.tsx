import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

const queryClient = new QueryClient()

function App() {
  const token = localStorage.getItem('token')

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen font-sans bg-gray-50 text-gray-900">
          <Toaster position="top-center" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={token ? <Dashboard /> : <Navigate to="/login" replace />} 
            />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
