import { createExpense } from '@/entities/expense/api/index';
import type { Expense } from '@/entities/expense/model';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start: Date, end: Date): Date {
  const time = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(time);
}

const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Other'];
const titles = {
    Food: ['Groceries', 'Restaurant', 'Cafe'],
    Transport: ['Bus', 'Train', 'Taxi', 'Fuel'],
    Shopping: ['Clothes', 'Electronics', 'Books'],
    Entertainment: ['Cinema', 'Concert', 'Game'],
    Utilities: ['Rent', 'Electricity', 'Water'],
    Other: ['Misc', 'Health'],
};

export async function generateRandomExpenses(profileId: string): Promise<void> {
  if (!profileId) return;

  const expensesToGenerate = 100; // Generate 100 expenses
  const now = new Date();
  const twoYearsAgo = new Date(now);
  twoYearsAgo.setFullYear(now.getFullYear() - 2);

  // Data structure required by the createExpense API function
  type ExpenseDataForApi = Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'profileId'>;

  for (let i = 0; i < expensesToGenerate; i++) {
    const randomCategory = categories[getRandomInt(0, categories.length - 1)];
    const randomTitleOptions = titles[randomCategory as keyof typeof titles];
    const randomTitle = randomTitleOptions[getRandomInt(0, randomTitleOptions.length - 1)];
    const randomAmount = parseFloat((Math.random() * 100 + 5).toFixed(2)); // Amounts between 5 and 105
    const randomDate = getRandomDate(twoYearsAgo, now);
    const randomComment = Math.random() > 0.7 ? `Random comment ${i + 1}` : ''; // Add comment sometimes

    const expenseData: ExpenseDataForApi = {
      title: randomTitle,
      category: randomCategory,
      amount: randomAmount,
      date: randomDate.toISOString(),
      comment: randomComment,
    };

    // Call the API to create the expense, passing profileId separately
    await createExpense(profileId, expenseData);
  }
} 