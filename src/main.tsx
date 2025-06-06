
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { ReactQueryProvider } from './app/providers/ReactQueryProvider';
import { ProfileGuard } from '@/entities/profile/ui/ProfileGuard';

// Set dark theme by default before React renders
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('theme');
  if (!theme || theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ProfileGuard>
        <App />
      </ProfileGuard>
    </ReactQueryProvider>
  </StrictMode>
); 