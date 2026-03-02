import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      localStorage.setItem('token', res.data.access_token);
      // Reload or navigate
      window.location.href = '/dashboard';
    } catch (error: any) {
      setErr(error.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        {err && <div className="bg-red-50 text-red-500 p-2 text-sm rounded mb-4">{err}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700 transition">
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
