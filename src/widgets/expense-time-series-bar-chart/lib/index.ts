import type { Expense } from '@/entities/expense/model';
import type { ExpensesPeriod } from '@/entities/expense/store'; // Import ExpensesPeriod type

interface TimeSeriesDataPoint {
  time: string; // Formatted date/period string
  [category: string]: number | string; // Category amounts + 'time'
}

interface AggregatedTimeSeriesData {
  data: TimeSeriesDataPoint[];
  categories: string[]; // List of unique categories for rendering bars
}

// Helper to get the start of a period based on granularity
function startOfPeriod(date: Date, granularity: 'day' | 'month' | 'year'): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (granularity === 'year') {
    d.setMonth(0, 1);
  } else if (granularity === 'month') {
    d.setDate(1);
  }
  // For day, time is already set to start of day
  return d;
}

// Helper to add a period based on granularity
function addPeriod(date: Date, granularity: 'day' | 'month' | 'year', amount = 1): Date {
  const d = new Date(date);
  if (granularity === 'year') {
    d.setFullYear(d.getFullYear() + amount);
  } else if (granularity === 'month') {
    d.setMonth(d.getMonth() + amount);
  } else {
    d.setDate(d.getDate() + amount);
  }
  return d;
}

// Get a consistent key for aggregation based on granularity
function getAggregationKey(date: Date, granularity: 'day' | 'month' | 'year'): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 01-12
    const day = date.getDate().toString().padStart(2, '0'); // 01-31

    switch (granularity) {
        case 'year':
            return `${year}`;
        case 'month':
            return `${year}-${month}`;
        case 'day':
        default:
            return `${year}-${month}-${day}`;
    }
}

export function aggregateExpensesForTimeSeriesBarChart(expenses: Expense[], period: ExpensesPeriod): AggregatedTimeSeriesData {
  if (expenses.length === 0) {
    return { data: [], categories: [] };
  }

  // Determine aggregation granularity based on period
  const granularity: 'day' | 'month' | 'year' = (() => {
    switch (period) {
      case 'all-time':
        return 'year';
      case 'year':
        return 'month';
      default:
        return 'day';
    }
  })();

  // Find min and max dates among expenses
  let minDate = new Date(expenses[0].date);
  let maxDate = new Date(expenses[0].date);

  expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (isNaN(expenseDate.getTime())) return; // Skip invalid dates
      if (expenseDate < minDate) minDate = expenseDate;
      if (expenseDate > maxDate) maxDate = expenseDate;
  });

  // Adjust min/max dates to the start of their respective periods based on granularity
  minDate = startOfPeriod(minDate, granularity);
  maxDate = startOfPeriod(maxDate, granularity);

  // Generate all time interval keys between minDate and maxDate
  const timeKeys: string[] = [];
  let currentTime = new Date(minDate);

  // Ensure maxDate is included by iterating up to the *start* of the *next* period
  const endIterationDate = addPeriod(maxDate, granularity, 1);

  while (currentTime <= endIterationDate) {
      const key = getAggregationKey(currentTime, granularity);
      // Only add keys up to or equal to the maxDate's period key
      if (key <= getAggregationKey(maxDate, granularity)) {
           timeKeys.push(key);
      }
      currentTime = addPeriod(currentTime, granularity);
  }

  const aggregationMap: Record<string, Record<string, number>> = {}; // { timeKey: { category: amount } }
  const uniqueCategories = new Set<string>();

  expenses.forEach(expense => {
    const expenseDate = new Date(expense.date);
    if (isNaN(expenseDate.getTime())) return; // Skip invalid dates

    const timeKey = getAggregationKey(expenseDate, granularity);
    uniqueCategories.add(expense.category);

    if (!aggregationMap[timeKey]) {
      aggregationMap[timeKey] = {};
    }

    if (!aggregationMap[timeKey][expense.category]) {
      aggregationMap[timeKey][expense.category] = 0;
    }

    aggregationMap[timeKey][expense.category] += expense.amount;
  });

  // Create final data array, ensuring all time keys are present and fill in missing data with 0
  const finalData: TimeSeriesDataPoint[] = [];

  timeKeys.forEach(timeKey => {
      const dataPoint: TimeSeriesDataPoint = { time: timeKey };
      const categoryData = aggregationMap[timeKey] || {}; // Get data for this time key, or empty object

      // Add amounts for all unique categories present in the overall data set
      uniqueCategories.forEach(category => {
          dataPoint[category] = parseFloat((categoryData[category] || 0).toFixed(2));
      });

      finalData.push(dataPoint);
  });

  // Sort final data points by time key (already done by generating timeKeys in order)
  // finalData.sort((a, b) => a.time.localeCompare(b.time)); // This sort should not be necessary now

  return {
    data: finalData,
    categories: Array.from(uniqueCategories).sort(), // Sort categories alphabetically
  };
} 