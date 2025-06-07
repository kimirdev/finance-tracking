import { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } from '../index';
import type { Expense } from '../../model';
import { vi, type Mock } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    length: vi.fn(() => Object.keys(store).length),
    key: vi.fn((i: number) => Object.keys(store)[i]),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock simulateDelay to return the result immediately
vi.mock('../index', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../index')>();
  return {
    ...actual,
    simulateDelay: (result: any) => Promise.resolve(result),
  };
});

// Mock uuid module and its v4 function
vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

// Get the mocked v4 function
const mockedUuidv4 = uuidv4 as Mock;

const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    profileId: 'profile-1',
    title: 'Groceries',
    amount: 100,
    date: new Date('2023-10-01').toISOString(),
    category: 'Food',
    comment: '',
    createdAt: new Date('2023-10-01').toISOString(),
    updatedAt: new Date('2023-10-01').toISOString(),
  },
  {
    id: 'exp-2',
    profileId: 'profile-1',
    title: 'Bus ticket',
    amount: 20,
    date: new Date('2023-10-05').toISOString(),
    category: 'Transport',
    comment: 'To work',
    createdAt: new Date('2023-10-05').toISOString(),
    updatedAt: new Date('2023-10-05').toISOString(),
  },
  {
    id: 'exp-3',
    profileId: 'profile-2',
    title: 'Dinner',
    amount: 50,
    date: new Date('2023-10-03').toISOString(),
    category: 'Food',
    comment: '',
    createdAt: new Date('2023-10-03').toISOString(),
    updatedAt: new Date('2023-10-03').toISOString(),
  },
];

describe('API расходов', () => {

  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorageMock.clear();
    // Заполняем localStorage мок-данными
    localStorageMock.setItem('expenses', JSON.stringify(mockExpenses));
    // Сбрасываем мок uuidv4 с реализацией по умолчанию (случайные ID)
    mockedUuidv4.mockImplementation(() => `mock-id-${Math.random().toString(36).substring(7)}`);
  });

  afterEach(() => {
    // Очищаем localStorage и сбрасываем моки после каждого теста
    localStorageMock.clear();
    vi.restoreAllMocks();
  });

  // --- Тесты getExpenses ---
  it('getExpenses должен возвращать расходы для конкретного профиля, отсортированные по дате убывания', async () => {
    const expenses = await getExpenses('profile-1');

    expect(expenses).toBeDefined();
    expect(Array.isArray(expenses)).toBe(true);
    expect(expenses.length).toBe(2);
    expect(expenses.every(exp => exp.profileId === 'profile-1')).toBe(true);

    // Проверяем сортировку (последние первыми)
    expect(new Date(expenses[0].date).getTime()).toBeGreaterThanOrEqual(new Date(expenses[1].date).getTime());
    expect(expenses[0].id).toBe('exp-2'); // Окт 5
    expect(expenses[1].id).toBe('exp-1'); // Окт 1
  });

  it('getExpenses должен возвращать пустой массив, если для профиля нет расходов', async () => {
    const expenses = await getExpenses('profile-nonexistent');
    expect(expenses).toBeDefined();
    expect(Array.isArray(expenses)).toBe(true);
    expect(expenses.length).toBe(0);
  });

  // --- Тесты getExpenseById ---
  it('getExpenseById должен возвращать расход, если найден для профиля', async () => {
    const expense = await getExpenseById('profile-1', 'exp-1');
    expect(expense).toBeDefined();
    expect(expense?.id).toBe('exp-1');
    expect(expense?.profileId).toBe('profile-1');
  });

  it('getExpenseById должен возвращать undefined, если не найден', async () => {
    const expense = await getExpenseById('profile-1', 'exp-nonexistent');
    expect(expense).toBeUndefined();
  });

   it('getExpenseById должен возвращать undefined, если найден для другого профиля', async () => {
    const expense = await getExpenseById('profile-2', 'exp-1');
    expect(expense).toBeUndefined();
  });

  // --- Тесты createExpense ---
  it('createExpense должен добавлять новый расход в localStorage и возвращать его', async () => {
    const newExpenseData = {
      title: 'Кофе',
      amount: 5,
      date: new Date('2023-10-06').toISOString(),
      category: 'Food',
      comment: 'Утренний кофе',
    };
    const profileId = 'profile-1';

    mockedUuidv4.mockImplementationOnce(() => 'new-exp-id'); // Имитируем UUID для этого конкретного вызова

    const createdExpense = await createExpense(profileId, newExpenseData);

    expect(createdExpense).toBeDefined();
    expect(createdExpense.id).toBe('new-exp-id');
    expect(createdExpense.profileId).toBe(profileId);
    expect(createdExpense.title).toBe(newExpenseData.title);
    expect(createdExpense.amount).toBe(newExpenseData.amount);
    expect(createdExpense.date).toBe(newExpenseData.date);
    expect(createdExpense.category).toBe(newExpenseData.category);
    expect(createdExpense.comment).toBe(newExpenseData.comment);
    expect(createdExpense.createdAt).toBeDefined();
    expect(createdExpense.updatedAt).toBeDefined();

    // Проверяем, что localStorage обновлен
    const storedExpenses = JSON.parse(localStorageMock.getItem('expenses') || '[]');
    expect(storedExpenses.length).toBe(mockExpenses.length + 1);
    expect(storedExpenses.find((exp: Expense) => exp.id === 'new-exp-id')).toEqual(createdExpense);
  });

  // --- Тесты updateExpense ---
  it('updateExpense должен обновлять существующий расход и возвращать его', async () => {
    const expenseIdToUpdate = 'exp-1';
    const profileId = 'profile-1';
    const updateData = {
      amount: 150,
      comment: 'Обновленный комментарий к продуктам',
    };

    const updatedExpense = await updateExpense(profileId, expenseIdToUpdate, updateData);

    expect(updatedExpense).toBeDefined();
    expect(updatedExpense?.id).toBe(expenseIdToUpdate);
    expect(updatedExpense?.profileId).toBe(profileId);
    expect(updatedExpense?.amount).toBe(updateData.amount);
    expect(updatedExpense?.comment).toBe(updateData.comment);
    expect(new Date(updatedExpense!.updatedAt) > new Date(mockExpenses[0].updatedAt)).toBe(true); // Проверяем, что updatedAt новее

    // Проверяем, что localStorage обновлен
    const storedExpenses: Expense[] = JSON.parse(localStorageMock.getItem('expenses') || '[]');
    const storedUpdatedExpense = storedExpenses.find(exp => exp.id === expenseIdToUpdate);
    expect(storedUpdatedExpense).toEqual(updatedExpense);
  });

  it('updateExpense должен возвращать undefined, если расход для обновления не найден', async () => {
    const updatedExpense = await updateExpense('profile-1', 'exp-nonexistent', { amount: 10 });
    expect(updatedExpense).toBeUndefined();
  });

  it('updateExpense должен возвращать undefined, если расход найден для другого профиля', async () => {
    const updatedExpense = await updateExpense('profile-2', 'exp-1', { amount: 10 });
    expect(updatedExpense).toBeUndefined();
  });

  // --- Тесты deleteExpense ---
  it('deleteExpense должен удалять расход из localStorage и возвращать true при успешном удалении', async () => {
    const expenseIdToDelete = 'exp-1';
    const profileId = 'profile-1';

    const success = await deleteExpense(profileId, expenseIdToDelete);

    expect(success).toBe(true);

    // Проверяем, что localStorage обновлен
    const storedExpenses: Expense[] = JSON.parse(localStorageMock.getItem('expenses') || '[]');
    expect(storedExpenses.length).toBe(mockExpenses.length - 1);
    expect(storedExpenses.find(exp => exp.id === expenseIdToDelete)).toBeUndefined();
  });

  it('deleteExpense должен возвращать false, если расход для удаления не найден', async () => {
    const success = await deleteExpense('profile-1', 'exp-nonexistent');
    expect(success).toBe(false);

    // Проверяем, что localStorage не изменился
    const storedExpenses: Expense[] = JSON.parse(localStorageMock.getItem('expenses') || '[]');
    expect(storedExpenses.length).toBe(mockExpenses.length);
  });

   it('deleteExpense должен возвращать false, если расход найден для другого профиля', async () => {
    const success = await deleteExpense('profile-2', 'exp-1');
    expect(success).toBe(false);

    // Проверяем, что localStorage не изменился
    const storedExpenses: Expense[] = JSON.parse(localStorageMock.getItem('expenses') || '[]');
    expect(storedExpenses.length).toBe(mockExpenses.length);
  });
}); 