/// <reference types="vitest" />
/// <reference types="vitest/globals" />
import { renderHook, waitFor } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import { useProfilesQuery } from '../useProfilesQuery';
import { getProfiles } from '../../api';
import { type Profile } from '../../model';
import { TestQueryClientProvider } from '@/test-utils';

// Mock the getProfiles API function
vi.mock('../../api', () => ({
  getProfiles: vi.fn(),
  // Keep other exports from ../../api if needed in future tests within this file
  // For now, only getProfiles is used by useProfilesQuery.
}));

const mockGetProfiles = getProfiles as Mock;

describe('useProfilesQuery', () => {

  beforeEach(() => {
    // Reset mock before each test
    mockGetProfiles.mockClear();
    // No need to clear QueryClient cache as TestQueryClientProvider creates a new client per renderHook
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch and return profiles successfully', async () => {
    const mockProfiles: Profile[] = [
      { id: 'profile-1', name: 'Profile One' },
      { id: 'profile-2', name: 'Profile Two' },
    ];

    // Configure the mock API to return test data
    mockGetProfiles.mockResolvedValue(mockProfiles);

    // Render the hook with the TestQueryClientProvider wrapper
    const { result } = renderHook(() => useProfilesQuery(), {
      wrapper: TestQueryClientProvider,
    });

    // Initially, data should be undefined and loading should be true
    // Note: Depending on react-query config, initial data might be [], adjust if necessary.
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);

    // Wait for the data to load
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that the API was called
    expect(mockGetProfiles).toHaveBeenCalledTimes(1);

    // Check that the hook returns the fetched data
    expect(result.current.data).toEqual(mockProfiles);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should handle API errors when fetching profiles', async () => {
    // Configure the mock API to throw an error
    const errorMessage = 'Failed to fetch profiles';
    mockGetProfiles.mockRejectedValue(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => useProfilesQuery(), {
      wrapper: TestQueryClientProvider,
    });


    // Wait for the query to finish with an error
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Check that the API was called
    expect(mockGetProfiles).toHaveBeenCalledTimes(1);

    // Check the hook state after error
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    // Check the error object
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  // Add tests for refetching, initial data, etc.
}); 