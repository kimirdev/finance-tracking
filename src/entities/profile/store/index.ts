import { create } from 'zustand';

const STORAGE_KEY = 'currentProfileId';

interface ProfileStore {
  currentProfileId: string | null;
  setCurrentProfileId: (id: string) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  currentProfileId: typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null,
  setCurrentProfileId: (id) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, id);
    }
    set({ currentProfileId: id });
  },
})); 