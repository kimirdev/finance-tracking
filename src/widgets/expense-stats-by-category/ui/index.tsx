import { useExpensesQuery } from '@/entities/expense/hooks/useExpensesQuery';
import { useProfileStore } from '@/entities/profile/store';
import { aggregateExpensesByCategory } from '../lib';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/shared/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { getCategories, useCategoryColorMap } from '@/entities/category';

// No longer need a hardcoded COLORS array
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A280F0', '#E83A3A', '#36A2EB', '#FF6384'];

export function ExpenseStatsByCategoryWidget() {
  const profileId = useProfileStore(s => s.currentProfileId);

  const { categoryColorMap, isLoading: isLoadingCategories } = useCategoryColorMap();

  // Fetch expenses using the hook
  const { data: expenses = [], isLoading: isLoadingExpenses } = useExpensesQuery(profileId);

  // Aggregate data for the chart
  const aggregatedData = aggregateExpensesByCategory(expenses);

  const isLoading = isLoadingCategories || isLoadingExpenses; // Consider both data sources loading

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
            {aggregatedData.map((entry, index) => (
              // Use color from the fetched categories, fallback to a default if not found
              <Cell key={`cell-${index}`} fill={categoryColorMap[entry.name] || '#C9CBCF'} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any, name) => [`${Number(value).toFixed(2)}`, name]} /> {/* name is already category name */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 