/// <reference types="vitest/globals" />
// This file is used to set up your test environment.
// Read more about it here: https://vitest.dev/guide/setup

import '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Global mock for localStorage
const localStorageMock = { 
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string): string | null => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => { localStorageMock.store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete localStorageMock.store[key]; }),
  clear: vi.fn(() => { localStorageMock.store = {}; }),
};

// Make localStorageMock globally available
(global as any).localStorageMock = localStorageMock;

// Replace the global localStorage with our mock
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Reset the mock state and calls before each test
beforeEach(() => {
  localStorageMock.clear();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
});

// You can add other global setup here, like mocking modules or setting up fake timers.
// If you need to mock react-router-dom for component tests:
/*
import { vi } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/test' }),
    useParams: () => ({}),
    Link: ({ to, children, ...rest }: any) => <a href={to} {...rest}>{children}</a>,
  };
});
*/

// Add any other global mocks or configurations as needed. 