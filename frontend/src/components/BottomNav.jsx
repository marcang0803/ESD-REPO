import { Link, useLocation } from 'react-router-dom';
import { Home, Search, BookOpen, Wallet, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/browse', label: 'Browse', icon: Search },
    { path: '/bookings', label: 'Bookings', icon: BookOpen },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-navy border-t border-navy-light shadow-lg max-w-md mx-auto">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
              isActive(path)
                ? 'text-cyan border-t-2 border-cyan'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
