import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (password !== confirmPassword) {
      setErr('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    try {
      await api.post('/auth/register', { email, password });
      toast.success('Registration successful. Please log in.');
      navigate('/login');
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Registration failed';
      setErr(msg);
      toast.error(msg);
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
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full border p-2 pr-10 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                value={password} onChange={e => setPassword(e.target.value)} minLength={6} required 
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                className="w-full border p-2 pr-10 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={6} required 
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
