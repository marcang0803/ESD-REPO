import { Bell, ChevronRight } from 'lucide-react';

export default function MobileHeader({ title, subtitle, showNotification = false }) {
  return (
    <div className="bg-navy-dark px-4 pt-4 pb-3 border-b border-navy-light">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        {showNotification && (
          <button className="relative p-2 text-gray-400 hover:text-cyan transition-colors">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        )}
      </div>
    </div>
  );
}
