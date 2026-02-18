
export type TabType = 'home' | 'history' | 'budget' | 'reports' | 'settings';

export type PaymentMethod = 'Cash' | 'Debit Card' | 'Credit Card' | 'Bank Transfer';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  limit: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  categoryId: string;
  date: string; // ISO String
  paymentMethod: PaymentMethod;
  notes: string;
  isRecurring: boolean;
  photoUrl?: string;
}

export interface AppSettings {
  currency: string;
  isDarkMode: boolean;
  monthStartDay: number;
  lastBackup?: string;
}

export interface AppState {
  transactions: Transaction[];
  categories: Category[];
  settings: AppSettings;
}
