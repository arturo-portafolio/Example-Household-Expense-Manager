
import { AppState } from '../types';
import { INITIAL_CATEGORIES } from '../constants';

const STORAGE_KEY = 'zenspend_local_data';

export const saveState = (state: AppState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return {
        transactions: [],
        categories: INITIAL_CATEGORIES,
        settings: {
          currency: 'USD',
          isDarkMode: true,
          monthStartDay: 1,
        },
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state', err);
    return {
      transactions: [],
      categories: INITIAL_CATEGORIES,
      settings: {
        currency: 'USD',
        isDarkMode: true,
        monthStartDay: 1,
      },
    };
  }
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};
