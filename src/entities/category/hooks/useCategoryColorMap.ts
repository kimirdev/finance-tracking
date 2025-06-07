import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api';
import type { Category } from '../model'; // Import Category type

interface CategoryColorMapResult {
  categoryColorMap: Record<string, string>;
  isLoading: boolean;
  isError: boolean; // Add isError
  error: unknown; // Add error
  isSuccess: boolean; // Add isSuccess
}

export function useCategoryColorMap(): CategoryColorMapResult {
  const { data: categories = [], isLoading, isError, error, isSuccess } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categoryColorMap: Record<string, string> = categories.reduce((map, category) => {
    map[category.name] = category.color;
    return map;
  }, {} as Record<string, string>);

  return {
    categoryColorMap,
    isLoading,
    isError, // Return isError
    error, // Return error
    isSuccess, // Return isSuccess
  };
} 