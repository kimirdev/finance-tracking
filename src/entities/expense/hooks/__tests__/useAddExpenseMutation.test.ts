import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
// Remove unused imports: QueryClient, QueryClientProvider
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddExpenseMutation } from '../useAddExpenseMutation';
import { createExpense } from '../../api';
import { type Expense } from '../../model';
import { TestQueryClientProvider } from '@/test-utils';

// Mock the createExpense API function
vi.mock('../../api', () => ({
  createExpense: vi.fn(),
}));

const mockCreateExpense = createExpense as Mock;

describe('useAddExpenseMutation', () => {

  beforeEach(() => {
    // Reset mocks before each test
    mockCreateExpense.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should add an expense successfully and call the API with profileId', async () => {
    const testProfileId = 'test-profile-id';
    const newExpenseData = {
      title: 'Groceries',
      amount: 150,
      category: 'Food',
      date: new Date().toISOString(),
      comment: 'Weekly shop',
      // id, profileId, createdAt, updatedAt will be added by the API mock
    };
    // Mock the API to return a successful response with a complete expense object
    const mockAddedExpense: Expense = {
        ...newExpenseData,
        id: 'generated-id',
        profileId: testProfileId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockCreateExpense.mockResolvedValue(mockAddedExpense);

    // Render the hook with the TestQueryClientProvider wrapper
    const { result } = renderHook(() => useAddExpenseMutation(testProfileId), {
      wrapper: TestQueryClientProvider,
    });

    // Initially, mutation should not be pending or successful
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    // Perform the mutation and wait for it to complete within act
    await act(async () => {
      await result.current.mutate(newExpenseData);
    });

    // Wait for the mutation to finish successfully
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that the API was called with the correct arguments (profileId, new expense data)
    expect(mockCreateExpense).toHaveBeenCalledWith(
        testProfileId,
        expect.objectContaining(newExpenseData)
    );

    // Check the mutation state after success
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    // Check the returned data from the mutation (should be the mockAddedExpense)
    expect(result.current.data).toEqual(mockAddedExpense);
  });

  it('should handle API errors when adding an expense', async () => {
    const testProfileId = 'test-profile-id';
    const newExpenseData = {
      title: 'Shopping',
      amount: 300,
      category: 'Shopping',
      date: new Date().toISOString(),
      comment: 'New shoes',
    };

    // Configure the mock API to throw an error
    const errorMessage = 'Failed to add expense';
    mockCreateExpense.mockRejectedValue(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => useAddExpenseMutation(testProfileId), {
      wrapper: TestQueryClientProvider,
    });

    // Initially, state should be clean
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    // Perform the mutation and await it within act, catching the expected error
    await act(async () => {
      try {
        await result.current.mutate(newExpenseData);
      } catch { // Removed unused 'e' parameter
        // Catch the error so it doesn't cause an unhandled promise rejection in act
      }
    });

    // Wait for the mutation to finish with an error
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Check that the API was called with the correct arguments
    expect(mockCreateExpense).toHaveBeenCalledWith(
        testProfileId,
        expect.objectContaining(newExpenseData)
    );

    // Check the mutation state after error
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    // Check the error object
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  // Add tests for disabled mutation if profileId is null, etc.
}); 