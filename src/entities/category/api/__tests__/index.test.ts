import { getCategories } from '../index';
import * as categoryApiOriginal from '../index';

// Mock the simulateDelay function
vi.mock('../index', async (importOriginal) => {
  const actual = await importOriginal<typeof categoryApiOriginal>();
  return {
    ...actual,
    // Override simulateDelay to return the result immediately
    simulateDelay: (result: any) => Promise.resolve(result),
  };
});

describe('Category API', () => {
  it('getCategories should return hardcoded categories', async () => {
    const categories = await getCategories();

    // You might want to assert against a specific structure or content
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    // Optionally, check for specific category names or properties
    expect(categories.some(cat => cat.name === 'Food')).toBe(true);
    expect(categories.some(cat => cat.color === '#FF6384')).toBe(true);
  });
}); 