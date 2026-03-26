import { Plus } from 'lucide-react';

export default function FloatingActionButton({ onClick, icon: Icon = Plus, label }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 w-14 h-14 bg-cyan text-navy-dark rounded-full flex items-center justify-center shadow-premium hover:bg-cyan-light transition-colors"
      title={label}
    >
      <Icon size={28} />
    </button>
  );
}
