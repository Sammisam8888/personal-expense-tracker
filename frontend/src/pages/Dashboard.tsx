import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const queryClient = useQueryClient();

  const { data: summary, isLoading: sumLoading } = useQuery({
    queryKey: ['summary', month],
    queryFn: async () => {
      const res = await api.get(`/summary${month ? `?month=${month}` : ''}`);
      return res.data;
    }
  });

  const { data: txs, isLoading: txLoading } = useQuery({
    queryKey: ['transactions', month],
    queryFn: async () => {
      const res = await api.get(`/transactions${month ? `?month=${month}` : ''}`);
      return res.data;
    }
  });

  const deleteTx = useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction deleted');
    },
    onError: () => {
      toast.error('Failed to delete transaction');
    }
  });

  if (sumLoading || txLoading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  const chartData = summary?.category_breakdown 
    ? Object.entries(summary.category_breakdown).map(([name, value]) => ({ name, value }))
    : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6B6B'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow transition-colors">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filter:</span>
            <input 
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
            />
            <button 
              onClick={() => setMonth('')}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 underline"
            >
              All Time
            </button>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border-l-4 border-blue-500 transition-colors">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Balance</h3>
            <p className="text-3xl font-bold mt-2 dark:text-white">₹{summary?.balance?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border-l-4 border-green-500 transition-colors">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Income</h3>
            <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">₹{summary?.total_income?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border-l-4 border-red-500 transition-colors">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Expense</h3>
            <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">₹{summary?.total_expense?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow md:col-span-1 border border-gray-100 dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Expenses by Category</h3>
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `₹${Number(value).toFixed(2)}`} contentStyle={{ backgroundColor: '#1F2937', color: '#F9FAFB', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#F9FAFB' }} />
                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-center mt-10">No expense data yet.</p>
            )}
          </div>

          {/* Transactions List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow md:col-span-2 border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Transactions</h3>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                + Add New
              </button>
            </div>
            
            <div className="space-y-4">
              {txs?.length === 0 ? (
                <p className="text-gray-400 dark:text-gray-500 text-center py-4">No transactions found.</p>
              ) : (
                txs?.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                        {tx.type === 'income' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-200">{tx.category}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()} {tx.description && `• ${tx.description}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                      </span>
                      <button onClick={() => deleteTx.mutate(tx.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition">
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
