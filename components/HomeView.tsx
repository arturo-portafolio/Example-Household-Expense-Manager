
import React, { useMemo } from 'react';
import { Transaction, Category, AppSettings } from '../types';
import Icon from './Icon';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { format, isToday, isThisMonth, isThisYear, parseISO, subMonths, isWithinInterval } from 'date-fns';

interface HomeViewProps {
  transactions: Transaction[];
  categories: Category[];
  settings: AppSettings;
}

const HomeView: React.FC<HomeViewProps> = ({ transactions, categories, settings }) => {
  const totals = useMemo(() => {
    return {
      today: transactions
        .filter(t => t.type === 'expense' && isToday(parseISO(t.date)))
        .reduce((sum, t) => sum + t.amount, 0),
      month: transactions
        .filter(t => t.type === 'expense' && isThisMonth(parseISO(t.date)))
        .reduce((sum, t) => sum + t.amount, 0),
      year: transactions
        .filter(t => t.type === 'expense' && isThisYear(parseISO(t.date)))
        .reduce((sum, t) => sum + t.amount, 0),
    };
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense' && isThisMonth(parseISO(t.date)));
    const grouped = expenses.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return categories.map(cat => ({
      name: cat.name,
      value: grouped[cat.id] || 0,
      color: cat.color,
    })).filter(c => c.value > 0);
  }, [transactions, categories]);

  const insight = useMemo(() => {
    const currentMonth = transactions.filter(t => t.type === 'expense' && isThisMonth(parseISO(t.date)));
    const lastMonthStart = subMonths(new Date(), 1);
    const lastMonthTransactions = transactions.filter(t => {
      const date = parseISO(t.date);
      return t.type === 'expense' && isWithinInterval(date, { 
        start: new Date(lastMonthStart.getFullYear(), lastMonthStart.getMonth(), 1),
        end: new Date(lastMonthStart.getFullYear(), lastMonthStart.getMonth() + 1, 0)
      });
    });

    const currentTotal = currentMonth.reduce((s, t) => s + t.amount, 0);
    const lastTotal = lastMonthTransactions.reduce((s, t) => s + t.amount, 0);

    if (lastTotal === 0) return { text: "Keep tracking to see insights next month!", isGood: true };
    
    const diff = lastTotal - currentTotal;
    const percent = Math.abs((diff / lastTotal) * 100).toFixed(0);

    if (diff > 0) {
      return { text: `${percent}% less spending compared to last month. Great job!`, isGood: true };
    } else {
      return { text: `Spent ${percent}% more than last month. Consider reviewing your budget.`, isGood: false };
    }
  }, [transactions]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full border-2 border-primary/20 p-1 bg-surface-card flex items-center justify-center">
            <Icon name="account_circle" className="text-primary text-3xl" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Welcome back,</p>
            <h1 className="text-lg font-bold leading-tight">Alex Johnson</h1>
          </div>
        </div>
        <button className="flex size-10 items-center justify-center rounded-full bg-surface-card border border-surface-border text-slate-400">
          <Icon name="notifications" className="text-xl" />
        </button>
      </div>

      {/* Summary Row */}
      <section className="px-6 grid grid-cols-3 gap-3">
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex flex-col justify-between aspect-square">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Today</span>
          <div>
            <p className="text-lg font-bold leading-tight">${totals.today.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-surface-card border border-surface-border p-4 rounded-xl flex flex-col justify-between aspect-square">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Month</span>
          <div>
            <p className="text-lg font-bold leading-tight">${totals.month.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-surface-card border border-surface-border p-4 rounded-xl flex flex-col justify-between aspect-square">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Year</span>
          <div>
            <p className="text-lg font-bold leading-tight">${(totals.year / 1000).toFixed(1)}k</p>
          </div>
        </div>
      </section>

      {/* Insight Card */}
      <section className="px-6">
        <div className={`relative overflow-hidden rounded-2xl border p-5 ${insight.isGood ? 'bg-primary border-primary/20' : 'bg-danger/20 border-danger/40'}`}>
          <div className="relative z-10 flex justify-between items-center">
            <div className="space-y-1">
              <p className={`${insight.isGood ? 'text-white/80' : 'text-danger'} text-xs font-medium uppercase tracking-widest`}>Monthly Insight</p>
              <h3 className={`${insight.isGood ? 'text-white' : 'text-slate-100'} text-lg font-bold`}>{insight.text}</h3>
            </div>
            <div className={`${insight.isGood ? 'bg-white/20' : 'bg-danger/40'} p-3 rounded-full`}>
              <Icon name={insight.isGood ? "trending_down" : "trending_up"} className="text-white text-2xl" />
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="px-6">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold">Category Breakdown</h2>
            <button className="text-primary text-sm font-semibold">This Month</button>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-48 w-full relative flex items-center justify-center">
              {categoryBreakdown.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center text-center">
                    <span className="text-[10px] text-slate-500 font-medium">TOTAL</span>
                    <span className="text-xl font-bold">${totals.month.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="text-slate-500 text-center">No data for this month</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 w-full">
              {categoryBreakdown.slice(0, 4).map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{cat.name}</span>
                    <span className="text-[10px] text-slate-500">${cat.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
