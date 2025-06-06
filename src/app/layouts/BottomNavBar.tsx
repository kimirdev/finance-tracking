import { Link, useLocation } from 'react-router-dom';
import { Home, User } from 'lucide-react';

const nav = [
  { to: '/', icon: Home, label: 'Main' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNavBar() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background flex justify-around items-center z-50">
      {nav.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            aria-label={label}
            className={`flex flex-col items-center gap-1 text-xs ${active ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon size={24} />
          </Link>
        );
      })}
    </nav>
  );
} 