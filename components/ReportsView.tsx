
import React, { useMemo } from 'react';
import { Transaction, Category } from '../types';
import Icon from './Icon';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { format, subDays, eachDayOfInterval, isSameDay, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, isSameMonth, subMonths } from 'date-fns';

interface ReportsViewProps {
  transactions: Transaction[];
  categories: Category[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ transactions, categories }) => {
  // Last 30 Days Trend
  const trendData = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 29);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dailyTotal = transactions
        .filter(t => t.type === 'expense' && isSameDay(parseISO(t.date), day))
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date: format(day, 'MMM d'),
        amount: dailyTotal,
      };
    });
  }, [transactions]);

  // Last 6 Months Comparison
  const monthlyData = useMemo(() => {
    const end = new Date();
    const start = subMonths(end, 5);
    const months = eachMonthOfInterval({ start, end });

    return months.map(month => {
      const monthlyTotal = transactions
        .filter(t => t.type === 'expense' && isSameMonth(parseISO(t.date), month))
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, 'MMM').toUpperCase(),
        amount: monthlyTotal,
        isCurrent: isSameMonth(month, new Date()),
      };
    });
  }, [transactions]);

  const totalMonthly = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && isSameMonth(parseISO(t.date), new Date()))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-card border border-surface-border">
          <Icon name="tune" className="text-xl" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">
        {/* Time Tabs */}
        <div className="bg-surface-card p-1 rounded-xl flex items-center mb-6">
          <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-primary text-white shadow-lg">Monthly</button>
          <button className="flex-1 py-2 text-xs font-semibold text-slate-500">Yearly</button>
          <button className="flex-1 py-2 text-xs font-semibold text-slate-500">Daily</button>
        </div>

        {/* High-level Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Spent</p>
            <p className="text-xl font-bold mt-1">${totalMonthly.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-primary text-[10px] font-bold mt-2">
              <Icon name="trending_up" className="text-xs" />
              <span>12.5%</span>
            </div>
          </div>
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily Avg</p>
            <p className="text-xl font-bold mt-1">${(totalMonthly / 30).toFixed(2)}</p>
            <div className="flex items-center gap-1 text-secondary text-[10px] font-bold mt-2">
              <Icon name="trending_down" className="text-xs" />
              <span>4.2%</span>
            </div>
          </div>
        </div>

        {/* 30 Day Trend Area Chart */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Spending Trend</h2>
            <span className="text-xs text-primary font-medium">Last 30 Days</span>
          </div>
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13b6ec" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#13b6ec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#233f48" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  interval={7}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#192d33', border: 'none', borderRadius: '10px', fontSize: '12px' }}
                  itemStyle={{ color: '#13b6ec' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#13b6ec" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 6 Month Comparison Bar Chart */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Monthly Comparison</h2>
            <span className="text-xs text-slate-500 font-medium">6 Months</span>
          </div>
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#192d33', border: 'none', borderRadius: '10px', fontSize: '12px' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#13b6ec' : '#233f48'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReportsView;
