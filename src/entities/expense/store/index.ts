import { create } from 'zustand';

interface ExpensesFilterState {
  category: string;
  setCategory: (category: string) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export const useExpensesFilterStore = create<ExpensesFilterState>((set) => ({
  category: '',
  setCategory: (category) => set({ category }),
  showAddModal: false,
  setShowAddModal: (show) => set({ showAddModal: show }),
})); 