import type { Profile } from '../model';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'profiles';

function getStoredProfiles(): Profile[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function setStoredProfiles(profiles: Profile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export async function getProfiles(): Promise<Profile[]> {
  return getStoredProfiles();
}

export async function createProfile(name: string): Promise<Profile> {
  const profile: Profile = { id: uuidv4(), name };
  const profiles = getStoredProfiles();
  profiles.push(profile);
  setStoredProfiles(profiles);
  return profile;
}

export async function deleteProfile(id: string): Promise<boolean> {
  let profiles = getStoredProfiles();
  const initialLength = profiles.length;
  profiles = profiles.filter(p => p.id !== id);
  setStoredProfiles(profiles);
  return profiles.length < initialLength;
} 