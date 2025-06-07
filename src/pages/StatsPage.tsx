import { ExpenseStatsByCategoryWidget } from '@/widgets/expense-stats-by-category';
import { ExpenseTimeSeriesBarChartWidget } from '@/widgets/expense-time-series-bar-chart';
import { SelectExpensesPeriod } from '@/features/expense/select-expenses-period';

export default function StatsPage() {
  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>

      {/* Period selection */}
      <div className="flex justify-end mb-4">
        <SelectExpensesPeriod />
      </div>

      {/* Widgets will be added here */}
      <ExpenseStatsByCategoryWidget />
      <ExpenseTimeSeriesBarChartWidget />
    </div>
  );
} 