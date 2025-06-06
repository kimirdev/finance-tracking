import { useExpensesFilterStore } from '@/entities/expense/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import type { ExpensesPeriod } from '@/entities/expense/store';

const periodOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'all-time', label: 'All Time' },
];

export function SelectExpensesPeriod() {
  const period = useExpensesFilterStore(s => s.period);
  const setPeriod = useExpensesFilterStore(s => s.setPeriod);

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">Period:</span>
      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periodOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 