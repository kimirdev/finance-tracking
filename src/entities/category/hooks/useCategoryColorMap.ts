import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api';

interface CategoryColorMapResult {
  categoryColorMap: Record<string, string>;
  isLoading: boolean;
}

export function useCategoryColorMap(): CategoryColorMapResult {
  const { data: categories = [], isLoading } = useQuery({
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
  };
} 