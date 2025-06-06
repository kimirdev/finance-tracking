import { useExpensesQuery } from '@/entities/expense/hooks/useExpensesQuery';
import { useProfileStore } from '@/entities/profile/store';
import { useExpensesFilterStore } from '@/entities/expense/store'; // To get the selected period
import { aggregateExpensesForTimeSeriesBarChart } from '../lib';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/shared/ui/skeleton';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { getCategories, useCategoryColorMap } from '@/entities/category'; // Import getCategories

// No longer need a hardcoded CATEGORY_COLORS object
// const CATEGORY_COLORS: Record<string, string> = {
//   'Food': '#FF6384',
//   'Transport': '#36A2EB',
//   'Shopping': '#FFCE56',
//   'Bills': '#4BC0C0',
//   'Entertainment': '#9966CC',
//   'Utilities': '#FF9F40',
//   'Other': '#C9CBCF',
// };

export function ExpenseTimeSeriesBarChartWidget() {
  const profileId = useProfileStore(s => s.currentProfileId);

  const { categoryColorMap, isLoading: isLoadingCategories } = useCategoryColorMap();

  // Fetch expenses using the hook
  const period = useExpensesFilterStore(s => s.period);
  const { data: expenses = [], isLoading: isLoadingExpenses } = useExpensesQuery(profileId);

  // Aggregate data for the chart based on the selected period
  const { data: aggregatedData, categories: aggregatedCategories } = aggregateExpensesForTimeSeriesBarChart(expenses, period);

  const isLoading = isLoadingCategories || isLoadingExpenses; // Consider both data sources loading

  if (isLoading) {
    return <Skeleton className="w-full h-64" />; // Show skeleton while loading
  }

  if (aggregatedData.length === 0) {
    return <div className="text-center text-muted-foreground">No expense data available for the selected period.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Expenses Over Time ({period})</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* XAxis shows the time interval (day, week, month, year) */}
          <XAxis dataKey="time" />
          {/* YAxis shows the total amount */}
          <YAxis />
          <Tooltip formatter={(value, name) => [`${Number(value).toFixed(2)}`, name]} />
          <Legend />
          {/* Render a stacked bar for each category */}
          {/* Use aggregatedCategories from the data, but colors from the fetched categories */}
          {aggregatedCategories.map(categoryName => (
            <Bar
              key={categoryName}
              dataKey={categoryName}
              stackId="a"
              fill={categoryColorMap[categoryName] || '#C9CBCF'} // Use color from map
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 