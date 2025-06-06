export type Expense = {
  id: string;
  profileId: string;
  title: string;
  category: string;
  amount: number;
  date: string; // ISO string
  comment?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}; 