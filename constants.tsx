
import { Category, PaymentMethod } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Housing', icon: 'home', color: '#13b6ec', limit: 1200 },
  { id: '2', name: 'Groceries', icon: 'shopping_cart', color: '#ffb020', limit: 500 },
  { id: '3', name: 'Utilities', icon: 'bolt', color: '#13b6ec', limit: 300 },
  { id: '4', name: 'Transport', icon: 'directions_car', color: '#a855f7', limit: 200 },
  { id: '5', name: 'Entertainment', icon: 'movie', color: '#ff4842', limit: 200 },
  { id: '6', name: 'Dining', icon: 'restaurant', color: '#f97316', limit: 150 },
  { id: '7', name: 'Health', icon: 'ecg_heart', color: '#ef4444', limit: 100 },
  { id: '8', name: 'Others', icon: 'more_horiz', color: '#64748b', limit: 100 },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Debit Card',
  'Credit Card',
  'Bank Transfer',
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];
