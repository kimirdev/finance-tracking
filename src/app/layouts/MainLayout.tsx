import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b flex items-center justify-between px-4 py-2">
        <nav className="flex gap-4">
          <Link to="/">Main</Link>
          <Link to="/about">About</Link>
        </nav>
        <ThemeToggle />
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 