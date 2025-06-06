import { useQuery } from '@tanstack/react-query';
import { getExpenses } from '../api';
import { useExpensesFilterStore } from '../store';
import type { Expense } from '../model';
import type { ExpensesPeriod } from '../store'; // Import ExpensesPeriod type

function filterByPeriod(expenses: Expense[], period: ExpensesPeriod): Expense[] {
  const now = new Date();
  if (period === 'all-time') {
    return expenses; // Return all expenses for all-time period
  }

  return expenses.filter(exp => {
    const expDate = new Date(exp.date);
    // Ensure expDate is valid before comparing
    if (isNaN(expDate.getTime())) {
        return false;
    }

    if (period === 'day') {
      return expDate.toDateString() === now.toDateString();
    }
    
    const startOfPeriod = new Date(now);
    startOfPeriod.setHours(0, 0, 0, 0); // Reset time to beginning of the day for consistent comparison

    if (period === 'week') {
      startOfPeriod.setDate(now.getDate() - 7);
    }
    if (period === 'month') {
      startOfPeriod.setMonth(now.getMonth() - 1);
    }
    if (period === 'year') {
      startOfPeriod.setFullYear(now.getFullYear());
      startOfPeriod.setMonth(0, 1);
    }
    
    // Include expenses from the start of the period up to the end of today
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    
    return expDate >= startOfPeriod && expDate <= endOfToday;
  });
}

export function useExpensesQuery(profileId: string | null) {
  const period = useExpensesFilterStore(s => s.period);
  const queryResult = useQuery({
    queryKey: ['expenses', profileId, period], // Add period to queryKey to refetch when period changes
    queryFn: () => getExpenses(profileId!),
    enabled: !!profileId,
  });

  // Filter data by period
  const filteredData = queryResult.data ? filterByPeriod(queryResult.data, period) : [];

  // Total amount calculation now uses filteredData
  const totalAmount = filteredData.reduce((sum, exp) => sum + exp.amount, 0);

  return {
    ...queryResult,
    data: filteredData, // Return filtered data (already sorted by API)
    totalAmount,      // Return calculated total
  };
} 