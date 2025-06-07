import React, { type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  // Настройки QueryClient для тестов (например, отключение автоматических повторных запросов)
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const TestQueryClientProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}; 