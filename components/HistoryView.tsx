
import React, { useMemo, useState } from 'react';
import { Transaction, Category } from '../types';
import Icon from './Icon';
import { format, parseISO, isToday, isYesterday, compareDesc } from 'date-fns';

interface HistoryViewProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (t: Transaction) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ transactions, categories, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const groupedTransactions = useMemo(() => {
    const filtered = transactions
      .filter(t => 
        t.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));

    const groups: Record<string, { dateLabel: string, items: Transaction[], total: number }> = {};

    filtered.forEach(t => {
      const date = parseISO(t.date);
      let label = format(date, 'MMM d, yyyy');
      if (isToday(date)) label = 'Today, ' + format(date, 'MMM d');
      else if (isYesterday(date)) label = 'Yesterday, ' + format(date, 'MMM d');

      if (!groups[label]) {
        groups[label] = { dateLabel: label, items: [], total: 0 };
      }
      groups[label].items.push(t);
      groups[label].total += t.type === 'expense' ? -t.amount : t.amount;
    });

    return Object.values(groups);
  }, [transactions, searchTerm, categories]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="sticky top-0 z-30 bg-surface-dark/80 backdrop-blur-md px-6 pt-12 pb-4">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Transactions</h1>
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search notes or categories..."
            className="w-full bg-surface-card border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 text-white placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="flex-1 px-6 overflow-y-auto pb-32 no-scrollbar">
        {groupedTransactions.map((group, gIdx) => (
          <section key={gIdx} className="mt-6 first:mt-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{group.dateLabel}</h2>
              <span className={`text-sm font-bold ${group.total >= 0 ? 'text-secondary' : 'text-primary'}`}>
                {group.total >= 0 ? '+' : '-'}${Math.abs(group.total).toLocaleString()}
              </span>
            </div>
            <div className="space-y-3">
              {group.items.map((item) => {
                const category = categories.find(c => c.id === item.categoryId);
                return (
                  <div 
                    key={item.id}
                    onClick={() => onEdit(item)}
                    className="bg-surface-card p-4 rounded-xl flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${category?.color}20`, color: category?.color }}>
                      <Icon name={category?.icon || 'help'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base truncate">{item.notes || category?.name || 'Untitled'}</p>
                      <p className="text-xs text-slate-500">{category?.name} • {format(parseISO(item.date), 'h:mm a')}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-base ${item.type === 'expense' ? 'text-white' : 'text-secondary'}`}>
                        {item.type === 'expense' ? '-' : '+'}${item.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase font-medium">{item.paymentMethod}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {groupedTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Icon name="history" className="text-5xl mb-4 opacity-20" />
            <p>No transactions found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryView;
