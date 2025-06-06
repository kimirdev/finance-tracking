import type { Expense } from '@/entities/expense/model';

interface CategoryStats {
  name: string;
  amount: number;
}

export function aggregateExpensesByCategory(expenses: Expense[]): CategoryStats[] {
  const statsMap: Record<string, number> = {};

  expenses.forEach(expense => {
    if (statsMap[expense.category]) {
      statsMap[expense.category] += expense.amount;
    } else {
      statsMap[expense.category] = expense.amount;
    }
  });

  // Convert map to array of objects
  const statsArray: CategoryStats[] = Object.keys(statsMap).map(category => ({
    name: category,
    amount: parseFloat(statsMap[category].toFixed(2)), // Ensure two decimal places
  }));

  // Sort by amount descending
  statsArray.sort((a, b) => b.amount - a.amount);

  return statsArray;
} 