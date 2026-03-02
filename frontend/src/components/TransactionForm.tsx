import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export default function TransactionForm({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [desc, setDesc] = useState('');
  
  const queryClient = useQueryClient();

  const addTx = useMutation({
    mutationFn: (newTx: any) => api.post('/transactions', newTx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTx.mutate({
      type,
      amount: parseFloat(amount),
      category,
      description: desc
    });
  };

  const categories = ['Food', 'Transport', 'Rent', 'Entertainment', 'Salary', 'Freelance', 'Other'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              className={`flex-1 py-2 rounded font-medium ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
              onClick={() => setType('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded font-medium ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
              onClick={() => setType('income')}
            >
              Income
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input 
              type="number" step="0.01" min="0" required
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              value={amount} onChange={(e) => setAmount(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={category} onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              value={desc} onChange={(e) => setDesc(e.target.value)} 
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" disabled={addTx.isPending} className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {addTx.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
