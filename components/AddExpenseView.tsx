
import React, { useState, useEffect } from 'react';
import { Transaction, Category, PaymentMethod } from '../types';
import { PAYMENT_METHODS } from '../constants';
import Icon from './Icon';

interface AddExpenseViewProps {
  categories: Category[];
  onSave: (transaction: Partial<Transaction>) => void;
  onCancel: () => void;
  editingTransaction?: Transaction | null;
}

const AddExpenseView: React.FC<AddExpenseViewProps> = ({ categories, onSave, onCancel, editingTransaction }) => {
  const [amount, setAmount] = useState('0.00');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount.toString());
      setSelectedCategory(editingTransaction.categoryId);
      setPaymentMethod(editingTransaction.paymentMethod);
      setNotes(editingTransaction.notes);
      setDate(editingTransaction.date.split('T')[0]);
      setIsRecurring(editingTransaction.isRecurring);
    }
  }, [editingTransaction]);

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onSave({
      id: editingTransaction?.id,
      amount: numAmount,
      categoryId: selectedCategory,
      paymentMethod,
      notes,
      date: new Date(date).toISOString(),
      type: 'expense',
      isRecurring,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-dark flex flex-col no-scrollbar">
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-surface-dark/80 backdrop-blur-md">
        <button onClick={onCancel} className="text-primary font-medium">Cancel</button>
        <h1 className="text-lg font-bold">{editingTransaction ? 'Edit Expense' : 'Add Expense'}</h1>
        <button onClick={() => { setAmount('0.00'); setNotes(''); }} className="text-primary font-medium">Reset</button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Amount Hero */}
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-primary/60 text-[10px] font-bold uppercase tracking-widest mb-2">Amount</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-500">$</span>
            <input 
              autoFocus
              type="number"
              className="bg-transparent border-none text-6xl font-bold text-center w-full focus:ring-0 placeholder-slate-700"
              placeholder="0.00"
              value={amount === '0.00' ? '' : amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="text-slate-600 text-[10px] mt-4 font-bold uppercase tracking-widest">Tap to enter value</p>
        </div>

        {/* Categories */}
        <section className="px-6 mb-8">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Category</h3>
          <div className="grid grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all cursor-pointer ${selectedCategory === cat.id ? 'bg-primary/10 border border-primary/20' : 'bg-surface-card'}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCategory === cat.id ? 'text-primary' : 'text-slate-500'}`}
                >
                  <Icon name={cat.icon} />
                </div>
                <span className="text-[10px] font-bold truncate w-full text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Details List */}
        <div className="px-6 space-y-4">
          <div className="bg-surface-card rounded-2xl border border-surface-border divide-y divide-surface-border overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Icon name="calendar_today" className="text-slate-500" />
                <span className="text-sm font-medium">Date</span>
              </div>
              <input 
                type="date"
                className="bg-transparent border-none text-primary text-sm font-bold focus:ring-0"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Icon name="event_repeat" className="text-slate-500" />
                <span className="text-sm font-medium">Recurring Expense</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div className="bg-surface-card rounded-2xl p-4 border border-surface-border">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Payment Method</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {PAYMENT_METHODS.map((method) => (
                <button 
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold uppercase tracking-wider border transition-all ${paymentMethod === method ? 'bg-primary border-primary text-white' : 'bg-surface-border border-surface-border text-slate-500'}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-card rounded-2xl p-4 border border-surface-border">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="notes" className="text-slate-500" />
              <span className="text-sm font-medium">Notes</span>
            </div>
            <textarea 
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-200 text-sm resize-none"
              placeholder="What did you buy?"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button className="w-full py-4 border-2 border-dashed border-surface-border rounded-2xl text-slate-500 flex items-center justify-center gap-2 hover:bg-white/5 active:scale-[0.98] transition-all">
            <Icon name="add_a_photo" />
            <span className="text-xs font-bold uppercase tracking-widest">Attach Receipt</span>
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 w-full p-6 bg-surface-dark/90 backdrop-blur-md">
        <button 
          onClick={handleSave}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
        >
          {editingTransaction ? 'Update' : 'Save'} Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseView;
