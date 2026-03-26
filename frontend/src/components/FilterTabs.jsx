import { Users } from 'lucide-react';

export default function FilterTabs({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-colors ${
          activeCategory === null
            ? 'bg-cyan text-navy-dark'
            : 'bg-navy-light text-gray-300 hover:text-white'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-colors capitalize ${
            activeCategory === category
              ? 'bg-cyan text-navy-dark'
              : 'bg-navy-light text-gray-300 hover:text-white'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
