import { create } from 'zustand';

export type ExpensesPeriod = 'day' | 'week' | 'month' | 'year' | 'all-time';

interface ExpensesFilterState {
  period: ExpensesPeriod;
  setPeriod: (period: ExpensesPeriod) => void;
  category: string;
  setCategory: (category: string) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export const useExpensesFilterStore = create<ExpensesFilterState>((set) => ({
  period: 'day',
  setPeriod: (period) => set({ period }),
  category: '',
  setCategory: (category) => set({ category }),
  showAddModal: false,
  setShowAddModal: (show) => set({ showAddModal: show }),
})); 