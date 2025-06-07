/// <reference types="vitest" />
/// <reference types="vitest/globals" />
import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import { useCreateProfileMutation } from '../useCreateProfileMutation';
import { createProfile } from '../../api';
import { type Profile } from '../../model';
import { TestQueryClientProvider } from '@/test-utils';

// Mock the createProfile API function
vi.mock('../../api', () => ({
  createProfile: vi.fn(),
  // Keep other exports if needed in future tests within this file
}));

const mockCreateProfile = createProfile as Mock;

describe('useCreateProfileMutation', () => {

  beforeEach(() => {
    // Reset mock before each test
    mockCreateProfile.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a profile successfully and call the API', async () => {
    const newProfileData = { name: 'New Test Profile' };
    const mockCreatedProfile: Profile = { id: 'profile-3', ...newProfileData };

    // Configure the mock API to return the created profile
    mockCreateProfile.mockResolvedValue(mockCreatedProfile);

    // Render the hook with the TestQueryClientProvider wrapper
    const { result } = renderHook(() => useCreateProfileMutation(), {
      wrapper: TestQueryClientProvider,
    });

    // Initially, mutation should not be pending or successful
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    // Perform the mutation, passing only the name string
    await act(async () => {
      result.current.mutate(newProfileData.name); // Pass name string
    });

    // Wait for the mutation to finish successfully
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that the API was called with the correct arguments (only the name string)
    expect(mockCreateProfile).toHaveBeenCalledWith(newProfileData.name); // Expect name string

    // Check the mutation state after success
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    // Check the returned data from the mutation
    expect(result.current.data).toEqual(mockCreatedProfile);
  });

  it('should handle API errors when creating a profile', async () => {
    const newProfileData = { name: 'Error Profile' };

    // Configure the mock API to throw an error
    const errorMessage = 'Failed to create profile';
    mockCreateProfile.mockRejectedValue(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => useCreateProfileMutation(), {
      wrapper: TestQueryClientProvider,
    });

    // Initially, state should be clean
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    // Perform the mutation and await it within act, catching the expected error
    await act(async () => {
      try {
        await result.current.mutate(newProfileData.name); // Pass name string
      } catch { // Removed unused 'e' parameter
        // Catch the error so it doesn't cause an unhandled promise rejection in act
      }
    });

    // Wait for the mutation to finish with an error
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Check that the API was called with the correct arguments (only the name string)
    expect(mockCreateProfile).toHaveBeenCalledWith(newProfileData.name); // Expect name string

    // Check the mutation state after error
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    // Check the error object
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  // Add tests for disabled mutation if needed
}); 