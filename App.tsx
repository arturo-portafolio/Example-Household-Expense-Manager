
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, TabType, Transaction, AppSettings } from './types';
import { loadState, saveState } from './utils/storage';
import Icon from './components/Icon';
import HomeView from './components/HomeView';
import HistoryView from './components/HistoryView';
import BudgetView from './components/BudgetView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import AddExpenseView from './components/AddExpenseView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(loadState());
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addOrUpdateTransaction = useCallback((tx: Partial<Transaction>) => {
    setState(prev => {
      const isEdit = !!tx.id;
      let newTransactions = [...prev.transactions];

      if (isEdit) {
        newTransactions = newTransactions.map(t => t.id === tx.id ? { ...t, ...tx } as Transaction : t);
      } else {
        const newTx: Transaction = {
          ...tx,
          id: Math.random().toString(36).substr(2, 9),
          date: tx.date || new Date().toISOString(),
          type: tx.type || 'expense',
          categoryId: tx.categoryId || prev.categories[0].id,
          paymentMethod: tx.paymentMethod || 'Cash',
          notes: tx.notes || '',
          isRecurring: tx.isRecurring || false,
          amount: tx.amount || 0,
        } as Transaction;
        newTransactions.push(newTx);
      }

      return { ...prev, transactions: newTransactions };
    });
    setShowAddForm(false);
    setEditingTransaction(null);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView transactions={state.transactions} categories={state.categories} settings={state.settings} />;
      case 'history':
        return (
          <HistoryView 
            transactions={state.transactions} 
            categories={state.categories} 
            onEdit={(t) => {
              setEditingTransaction(t);
              setShowAddForm(true);
            }} 
          />
        );
      case 'budget':
        return <BudgetView transactions={state.transactions} categories={state.categories} />;
      case 'reports':
        return <ReportsView transactions={state.transactions} categories={state.categories} />;
      case 'settings':
        return <SettingsView settings={state.settings} updateSettings={updateSettings} />;
      default:
        return <HomeView transactions={state.transactions} categories={state.categories} settings={state.settings} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${state.settings.isDarkMode ? 'dark' : ''}`}>
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto no-scrollbar">
          {renderContent()}
        </div>
      </div>

      {showAddForm && (
        <AddExpenseView 
          categories={state.categories} 
          editingTransaction={editingTransaction}
          onSave={addOrUpdateTransaction} 
          onCancel={() => {
            setShowAddForm(false);
            setEditingTransaction(null);
          }} 
        />
      )}

      {/* Floating Action Button */}
      {!showAddForm && (
        <button 
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <Icon name="add" className="text-3xl font-bold" />
        </button>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-dark/95 backdrop-blur-xl border-t border-surface-border px-6 pb-8 pt-4 z-30">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <NavItem 
            isActive={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon="home" 
            label="Home" 
          />
          <NavItem 
            isActive={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon="history" 
            label="History" 
          />
          <div className="w-12"></div> {/* Spacer for FAB */}
          <NavItem 
            isActive={activeTab === 'budget'} 
            onClick={() => setActiveTab('budget')} 
            icon="account_balance_wallet" 
            label="Budget" 
          />
          <NavItem 
            isActive={activeTab === 'reports'} 
            onClick={() => setActiveTab('reports')} 
            icon="monitoring" 
            label="Reports" 
          />
        </div>
      </nav>
    </div>
  );
};

interface NavItemProps {
  isActive: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ isActive, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-500'}`}
  >
    <Icon name={icon} fill={isActive} className="text-2xl" />
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
