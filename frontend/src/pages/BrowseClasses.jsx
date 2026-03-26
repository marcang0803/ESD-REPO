import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  ClassCard,
  BottomNav,
  FilterTabs,
  EmptyState,
} from '../components';
import { mockClasses } from '../data/mockData';

export default function BrowseClasses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const categories = ['yoga', 'cardio', 'strength', 'recovery'];

  let filteredClasses = mockClasses;

  if (activeCategory) {
    filteredClasses = filteredClasses.filter((c) => c.category === activeCategory);
  }

  if (searchTerm) {
    filteredClasses = filteredClasses.filter(
      (c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen bg-navy pb-24">
      {/* Header */}
      <div className="bg-navy-dark px-4 pt-4 pb-6 border-b border-navy-light">
        <h1 className="text-2xl font-bold text-white mb-4">Browse Classes</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search classes or trainers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-navy border border-navy-light rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan"
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <FilterTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {filteredClasses.length === 0 ? (
          <EmptyState
            title="No classes found"
            description="Try adjusting your filters or search term"
            icon={Search}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredClasses.map((classData) => (
              <ClassCard key={classData.id} classData={classData} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
