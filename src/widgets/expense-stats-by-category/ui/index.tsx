import { useExpensesQuery } from '@/entities/expense/hooks/useExpensesQuery';
import { useProfileStore } from '@/entities/profile/store';
import { aggregateExpensesByCategory } from '../lib';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/shared/ui/skeleton'; // Assuming Skeleton component is available

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A280F0', '#E83A3A', '#36A2EB', '#FF6384'];

export function ExpenseStatsByCategoryWidget() {
  const profileId = useProfileStore(s => s.currentProfileId);
  // Fetch expenses using the hook
  const { data: expenses = [], isLoading } = useExpensesQuery(profileId);

  // Aggregate data for the chart
  const aggregatedData = aggregateExpensesByCategory(expenses);

  if (isLoading) {
    return <Skeleton className="w-full h-64" />; // Show skeleton while loading
  }

  if (aggregatedData.length === 0) {
    return <div className="text-center text-muted-foreground">No expense data available for the selected period.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Expenses by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={aggregatedData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="amount"
            nameKey="name"
            label
          >
            {aggregatedData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => [`${Number(value).toFixed(2)}`, "Amount"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 