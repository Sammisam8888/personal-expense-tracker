import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password });
      navigate('/login');
    } catch (error: any) {
      setErr(error.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {err && <div className="bg-red-50 text-red-500 p-2 text-sm rounded mb-4">{err}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
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
              value={password} onChange={e => setPassword(e.target.value)} minLength={6} required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700 transition">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
