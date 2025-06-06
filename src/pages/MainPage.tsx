import type { Expense } from '@/entities/expense/model';
import { useProfileStore } from '@/entities/profile/store';
import { AddExpenseDialog } from '@/features/add-expense';
import { useExpensesQuery } from '@/entities/expense/hooks/useExpensesQuery';

export default function MainPage() {
  const profileId = useProfileStore(s => s.currentProfileId);
  const { data: expenses = [], isLoading } = useExpensesQuery(profileId);

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      <AddExpenseDialog />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {expenses.map((exp: Expense) => (
            <li key={exp.id} className="border rounded p-2 flex flex-col gap-1">
              <div className="flex justify-between">
                <span>
                  <b>{exp.title}</b> ({exp.category}) — {exp.amount}
                </span>
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