import type { ReactNode } from 'react';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { useProfileStore } from '@/entities/profile/store';
import { getProfiles } from '@/entities/profile/api';
import { useEffect, useState } from 'react';
import BottomNavBar from './BottomNavBar';

export default function MainLayout({ children }: { children: ReactNode }) {
  const currentProfileId = useProfileStore(s => s.currentProfileId);
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    if (!currentProfileId) return;
    getProfiles().then(profiles => {
      setProfileName(profiles.find(p => p.id === currentProfileId)?.name || '');
    });
  }, [currentProfileId]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b flex items-center justify-between px-4 py-2">
        <span className="font-semibold text-lg truncate max-w-[60vw]">{profileName}</span>
        <ThemeToggle />
      </header>
      <main className="flex-1 pb-16">{children}</main>
      <BottomNavBar />
    </div>
  );
} 