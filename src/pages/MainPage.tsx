import type { Expense } from '@/entities/expense/model';
import { useProfileStore } from '@/entities/profile/store';
import { useExpensesQuery } from '@/entities/expense/hooks/useExpensesQuery';
import { useExpensesFilterStore } from '@/entities/expense/store';
import type { ExpensesPeriod } from '@/entities/expense/store';
import { AddExpenseDialog, SelectExpensesPeriod } from '@/features/expense';
import { Skeleton } from '@/shared/ui/skeleton';
import { useCategoryColorMap } from '@/entities/category';

const periodLabels: Record<ExpensesPeriod, string> = {
  day: 'Today',
  week: 'Last 7 days',
  month: 'Last 30 days',
  year: 'This Year',
  'all-time': 'All Time',
};

export default function MainPage() {
  const profileId = useProfileStore(s => s.currentProfileId);

  const { categoryColorMap, isLoading: isLoadingCategories } = useCategoryColorMap();

  const { data: expenses = [], isLoading: isLoadingExpenses, totalAmount } = useExpensesQuery(profileId);
  const period = useExpensesFilterStore(s => s.period);

  const isLoading = isLoadingCategories || isLoadingExpenses;

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      <div className="flex items-center justify-between mb-4">
        <AddExpenseDialog />
        <SelectExpensesPeriod />
      </div>

      <div className="border rounded p-4 text-center">
        <div className="text-muted-foreground">Total ({periodLabels[period]}):</div>
        <div className="text-3xl font-bold">{totalAmount.toFixed(2)}</div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center text-muted-foreground">No expenses found for this period.</div>
      ) : (
        <ul className="space-y-2">
          {expenses.map((exp: Expense) => (
            <li key={exp.id} className="border rounded p-2 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="block w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColorMap[exp.category] || '#C9CBCF' }}
                  ></span>
                  <span>
                    <b>{exp.title}</b> ({exp.category}) — {exp.amount}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(exp.date).toLocaleDateString()}</span>
              </div>
              {exp.comment && <div className="text-xs text-muted-foreground">{exp.comment}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 