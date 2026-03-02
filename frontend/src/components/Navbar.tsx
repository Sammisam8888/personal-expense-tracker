import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">ExpenseTracker</h1>
      <button 
        onClick={handleLogout}
        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition"
      >
        Logout
      </button>
    </nav>
  );
}
