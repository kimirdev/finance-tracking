import { v4 as uuidv4 } from 'uuid';
import type { Expense } from '../model';

const STORAGE_KEY = 'expenses';

function getStoredExpenses(): Expense[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function setStoredExpenses(expenses: Expense[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function simulateDelay<T>(result: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export async function getExpenses(profileId: string): Promise<Expense[]> {
  const expenses = getStoredExpenses().filter(e => e.profileId === profileId);
  // Sort expenses by date descending (latest first)
  expenses.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Sort descending
  });
  return simulateDelay(expenses);
}

export async function getExpenseById(profileId: string, id: string): Promise<Expense | undefined> {
  const expenses = getStoredExpenses().filter(e => e.profileId === profileId);
  return simulateDelay(expenses.find(e => e.id === id));
}

export async function createExpense(profileId: string, data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'profileId'>): Promise<Expense> {
  const expense: Expense = {
    ...data,
    profileId,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const expenses = getStoredExpenses();
  expenses.push(expense);
  setStoredExpenses(expenses);
  return simulateDelay(expense);
}

export async function updateExpense(profileId: string, id: string, data: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'profileId'>>): Promise<Expense | undefined> {
  const expenses = getStoredExpenses();
  const idx = expenses.findIndex(e => e.id === id && e.profileId === profileId);
  if (idx === -1) return simulateDelay(undefined);
  expenses[idx] = {
    ...expenses[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  setStoredExpenses(expenses);
  return simulateDelay(expenses[idx]);
}

export async function deleteExpense(profileId: string, id: string): Promise<boolean> {
  let expenses = getStoredExpenses();
  const initialLength = expenses.length;
  expenses = expenses.filter(e => !(e.id === id && e.profileId === profileId));
  setStoredExpenses(expenses);
  return simulateDelay(expenses.length < initialLength);
} 