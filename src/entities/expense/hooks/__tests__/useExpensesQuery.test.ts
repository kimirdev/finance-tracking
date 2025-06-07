/// <reference types="vitest" />
/// <reference types="vitest/globals" />
import { renderHook, waitFor } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExpensesQuery } from '../useExpensesQuery';
import { getExpenses } from '../../api';
import { type Expense } from '../../model';
import { TestQueryClientProvider } from '@/test-utils';
import { useExpensesFilterStore } from '../../store';

// Mock the getExpenses API function
vi.mock('../../api', () => ({
  getExpenses: vi.fn(),
}));

const mockGetExpenses = getExpenses as Mock;

// Mock the useExpensesFilterStore hook to control the period
vi.mock('../../store', () => ({
    useExpensesFilterStore: vi.fn(() => ({ period: 'month' })) // Default mock period
}));

// The useExpensesFilterStore variable imported here is the mocked function
// Casting to any here as casting to Mock is incorrect for a hook mock.
const mockUseExpensesFilterStore = useExpensesFilterStore as any;

describe('useExpensesQuery', () => {

  beforeEach(() => {
    // Reset mocks before each test
    mockGetExpenses.mockClear();
    // Clear the mock implementation/return value for the store mock
    // and set a default for the test.
    // We don't need to clear the QueryClient cache here if we use the TestQueryClientProvider
    // which creates a new client for each renderHook implicitly.

    // Set a default period for the mock store for each test
    mockUseExpensesFilterStore.mockImplementation(() => ({ period: 'month' }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch and return expenses successfully filtered by the period from the store', async () => {
    const testProfileId = 'test-profile-id';
    const testPeriod = 'month'; // This value will be controlled by the store mock

    // Configure the store mock to return the desired period for this specific test
    mockUseExpensesFilterStore.mockImplementation(() => ({ period: testPeriod }));

    const mockExpenses: Expense[] = [
      // Add required fields: title, createdAt, updatedAt
      { id: '1', amount: 100, category: 'Food', date: new Date().toISOString(), comment: 'Lunch', profileId: testProfileId, title: 'Lunch', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', amount: 50, category: 'Transport', date: new Date().toISOString(), comment: 'Bus', profileId: testProfileId, title: 'Bus', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      // Add an expense for a different period that should be filtered out by the hook
      { id: '3', amount: 200, category: 'Shopping', date: new Date(2020, 0, 1).toISOString(), comment: 'Old item', profileId: testProfileId, title: 'Old Item', createdAt: new Date(2020, 0, 1).toISOString(), updatedAt: new Date(2020, 0, 1).toISOString() },
    ];

    // Configure the mock API to return test data (including items that will be filtered by the hook)
    mockGetExpenses.mockResolvedValue(mockExpenses);

    // Render the hook with the TestQueryClientProvider wrapper
    // Pass only profileId to the hook, period is read from the store
    const { result } = renderHook(() => useExpensesQuery(testProfileId), {
      wrapper: TestQueryClientProvider,
    });

    // Initially, data should be an empty array and loading should be true
    expect(result.current.data).toEqual([]); // Corrected expectation
    expect(result.current.isLoading).toBe(true);

    // Wait for the data to load and the query to be successful
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that the API was called with the correct arguments (only profileId)
    expect(mockGetExpenses).toHaveBeenCalledWith(testProfileId);

    // Check that the hook returns the fetched data, FILTERED by the mocked period
    // We expect only the first two expenses (within the 'month' period simulation)
    // Note: The filtering logic here should match the hook's filterByPeriod function for this test.
    const expectedFilteredExpenses = mockExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      const now = new Date();
      const startOfPeriod = new Date(now);
      startOfPeriod.setMonth(now.getMonth() - 1);
      startOfPeriod.setHours(0, 0, 0, 0);

      const endOfToday = new Date(now);
      endOfToday.setHours(23, 59, 59, 999);

      return expDate >= startOfPeriod && expDate <= endOfToday;
    });

    expect(result.current.data).toEqual(expectedFilteredExpenses);
    expect(result.current.data?.length).toBe(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.totalAmount).toBe(150); // Total for the filtered expenses
  });

  it('should return empty data and not fetch if profileId is null', async () => {
    // Render the hook with profileId set to null
    const { result } = renderHook(() => useExpensesQuery(null), {
      wrapper: TestQueryClientProvider,
    });

    // Since enabled is false, the query should not run immediately.
    // Data should be an empty array, loading should be false, isSuccess should be false.
    // We need to wait for the query state to settle (e.g., isLoading becomes false).
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([]); // Expect empty array when profileId is null
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false); // Corrected expectation for disabled query
    expect(mockGetExpenses).not.toHaveBeenCalled(); // API should not have been called
    expect(result.current.totalAmount).toBe(0);
  });

  // Add tests for different periods controlled by store mock, error handling, loading states, etc.
}); 