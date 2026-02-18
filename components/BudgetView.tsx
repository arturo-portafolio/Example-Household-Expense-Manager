
import React, { useMemo } from 'react';
import { Transaction, Category } from '../types';
import Icon from './Icon';
import { isThisMonth, parseISO } from 'date-fns';

interface BudgetViewProps {
  transactions: Transaction[];
  categories: Category[];
}

const BudgetView: React.FC<BudgetViewProps> = ({ transactions, categories }) => {
  const monthExpenses = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense' && isThisMonth(parseISO(t.date)));
    return expenses.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  // Fix: Explicitly type reduce arguments to resolve 'unknown' type errors (Lines 22-23)
  const totalBudget = categories.reduce((sum: number, c: Category) => sum + c.limit, 0);
  const totalSpent = Object.values(monthExpenses).reduce((sum: number, val: number) => sum + val, 0);
  const totalPercent = Math.min((totalSpent / totalBudget) * 100, 100);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Budget Overview</h1>
        <p className="text-xs text-slate-400 mt-1">August 2024 • Local Storage</p>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">
        {/* Main Summary Card */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Spend</p>
              <p className="text-2xl font-bold mt-1">${totalSpent.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ ${totalBudget.toLocaleString()}</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full inline-block">{totalPercent.toFixed(0)}% Used</p>
            </div>
          </div>
          <div className="w-full bg-surface-border h-3 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${totalPercent}%` }}></div>
          </div>
          <div className="flex justify-between mt-4 items-center">
            <div className="flex items-center gap-2">
              <Icon name="event" className="text-primary text-sm" />
              <span className="text-xs text-slate-500">12 days remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="cloud_off" className="text-primary text-sm" />
              <span className="text-xs text-slate-500">Offline-first</span>
            </div>
          </div>
        </div>

        {/* Category Limits */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Categories</h2>
            <button className="text-primary text-sm font-medium">Edit limits</button>
          </div>

          <div className="space-y-6">
            {categories.map((cat) => {
              const spent = monthExpenses[cat.id] || 0;
              const limit = cat.limit || 0;
              const percent = limit > 0 ? (spent / limit) * 100 : 0;
              const isOver = spent > limit;
              const isNear = percent > 85 && percent <= 100;

              let statusColor = 'text-primary';
              let bgColor = 'bg-primary';
              let statusText = 'Safe';

              if (isOver) {
                statusColor = 'text-danger';
                bgColor = 'bg-danger';
                statusText = 'Over Budget';
              } else if (isNear) {
                statusColor = 'text-warning';
                bgColor = 'bg-warning';
                statusText = 'Near Limit';
              }

              return (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-surface-card flex items-center justify-center" style={{ color: cat.color }}>
                        <Icon name={cat.icon} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{cat.name}</p>
                        <p className={`text-xs ${isOver ? 'text-danger' : 'text-slate-400'}`}>
                          {isOver ? `-$${(spent - limit).toLocaleString()} over` : `$${(limit - spent).toLocaleString()} left`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${spent.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ ${limit.toLocaleString()}</span></p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>{percent.toFixed(0)}% - {statusText}</p>
                    </div>
                  </div>
                  <div className="w-full bg-surface-border h-2 rounded-full overflow-hidden">
                    <div className={`${bgColor} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BudgetView;
