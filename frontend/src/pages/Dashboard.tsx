import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Trash2, Edit2 } from 'lucide-react';

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: summary, isLoading: sumLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      const res = await api.get('/summary');
      return res.data;
    }
  });

  const { data: txs, isLoading: txLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await api.get('/transactions');
      return res.data;
    }
  });

  const deleteTx = useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  if (sumLoading || txLoading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  const chartData = summary?.category_breakdown 
    ? Object.entries(summary.category_breakdown).map(([name, value]) => ({ name, value }))
    : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6B6B'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
            <p className="text-3xl font-bold mt-2">₹{summary?.balance.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Income</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">₹{summary?.total_income.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Expense</h3>
            <p className="text-3xl font-bold mt-2 text-red-600">₹{summary?.total_expense.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow md:col-span-1 border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Expenses by Category</h3>
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-400 text-center mt-10">No expense data yet.</p>
            )}
          </div>

          {/* Transactions List */}
          <div className="bg-white p-6 rounded-xl shadow md:col-span-2 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                + Add New
              </button>
            </div>
            
            <div className="space-y-4">
              {txs?.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No transactions found.</p>
              ) : (
                txs?.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-50 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.category}</p>
                        <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()} {tx.description && `• ${tx.description}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                      </span>
                      <button onClick={() => deleteTx.mutate(tx.id)} className="text-gray-400 hover:text-red-500 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
