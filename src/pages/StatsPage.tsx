import React from 'react';
import { ExpenseStatsByCategoryWidget } from '@/widgets/expense-stats-by-category';

export default function StatsPage() {
  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>
      {/* Widgets will be added here */}
      <ExpenseStatsByCategoryWidget />
    </div>
  );
} 