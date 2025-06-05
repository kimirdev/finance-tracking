import { v4 as uuidv4 } from 'uuid';

export type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string; // ISO string
  comment?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

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

export async function getExpenses(): Promise<Expense[]> {
  return simulateDelay(getStoredExpenses());
}

export async function getExpenseById(id: string): Promise<Expense | undefined> {
  const expenses = getStoredExpenses();
  return simulateDelay(expenses.find(e => e.id === id));
}

export async function createExpense(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
  const expense: Expense = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const expenses = getStoredExpenses();
  expenses.push(expense);
  setStoredExpenses(expenses);
  return simulateDelay(expense);
}

export async function updateExpense(id: string, data: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Expense | undefined> {
  const expenses = getStoredExpenses();
  const idx = expenses.findIndex(e => e.id === id);
  if (idx === -1) return simulateDelay(undefined);
  expenses[idx] = {
    ...expenses[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  setStoredExpenses(expenses);
  return simulateDelay(expenses[idx]);
}

export async function deleteExpense(id: string): Promise<boolean> {
  let expenses = getStoredExpenses();
  const initialLength = expenses.length;
  expenses = expenses.filter(e => e.id !== id);
  setStoredExpenses(expenses);
  return simulateDelay(expenses.length < initialLength);
} 