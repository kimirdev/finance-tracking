import { act } from '@testing-library/react';
import { useExpensesFilterStore, type ExpensesPeriod } from '../index';

describe('useExpensesFilterStore', () => {
  // Helper to get state and actions within tests
  const getStore = () => useExpensesFilterStore.getState();

  beforeEach(() => {
    // Reset the store state before each test (optional, but good practice)
    // Zustand stores can be reset by getting the state and calling actions, or by a specific reset action if you add one.
    // For simple stores, directly manipulating the state might be acceptable in tests.
    // A more robust way is to add a reset action to the store itself.
    // Since we don't have a reset action, we'll rely on the default state being set on creation,
    // or manually manipulate the state if needed.
    // For this simple store, just accessing the state should be fine for isolating tests.
  });

  it('should have initial state', () => {
    const state = getStore();
    expect(state.period).toBe('day');
    expect(state.category).toBe('');
    expect(state.showAddModal).toBe(false);
  });

  it('should set period', () => {
    const { setPeriod } = getStore();
    const newPeriod: ExpensesPeriod = 'month';

    act(() => {
      setPeriod(newPeriod);
    });

    expect(getStore().period).toBe(newPeriod);
  });

  it('should set category', () => {
    const { setCategory } = getStore();
    const newCategory = 'Transport';

    act(() => {
      setCategory(newCategory);
    });

    expect(getStore().category).toBe(newCategory);
  });

  it('should set showAddModal', () => {
    const { setShowAddModal } = getStore();

    act(() => {
      setShowAddModal(true);
    });

    expect(getStore().showAddModal).toBe(true);

    act(() => {
      setShowAddModal(false);
    });

    expect(getStore().showAddModal).toBe(false);
  });
}); 