import type { Category } from '../model';
import { v4 as uuidv4 } from 'uuid'; // Using uuid for consistent fake IDs

// Helper to simulate network delay
function simulateDelay<T>(result: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

// Hardcoded list of categories with colors
const hardcodedCategories: Category[] = [
  {
    id: 'cat-food',
    name: 'Food',
    color: '#FF6384', // Reddish
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-transport',
    name: 'Transport',
    color: '#36A2EB', // Blueish
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-shopping',
    name: 'Shopping',
    color: '#FFCE56', // Yellowish
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-bills',
    name: 'Bills',
    color: '#4BC0C0', // greenish-blue
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-entertainment',
    name: 'Entertainment',
    color: '#9966CC', // Purplish
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-utilities',
    name: 'Utilities',
    color: '#FF9F40', // Orangish
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
   {
    id: 'cat-other',
    name: 'Other',
    color: '#C9CBCF', // Grayish
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// API function to get all categories
export async function getCategories(): Promise<Category[]> {
  // Simulate a network request delay and return the hardcoded categories
  return simulateDelay(hardcodedCategories);
} 