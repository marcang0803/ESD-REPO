import { useState } from 'react';
import { Bell, Settings } from 'lucide-react';
import {
  MobileHeader,
  ClassCard,
  FeaturedClassCard,
  TrainerCard,
  FilterTabs,
  BottomNav,
} from '../components';
import { mockUser, mockClasses } from '../data/mockData';

const trainers = [
  mockClasses[0].provider,
  mockClasses[1].provider,
  mockClasses[2].provider,
  mockClasses[3].provider,
];

export default function UserDashboard() {
  const [activeCategory, setActiveCategory] = useState(null);
  const categories = ['yoga', 'cardio', 'strength', 'recovery'];

  const filteredClasses = activeCategory
    ? mockClasses.filter((c) => c.category === activeCategory)
    : mockClasses;

  const upcomingClasses = mockClasses.slice(0, 2);
  const featuredClass = mockClasses[0];

  return (
    <div className="min-h-screen bg-navy pb-24">
      {/* Header */}
      <div className="bg-navy-dark px-4 pt-6 pb-6 border-b border-navy-light">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-gray-400 text-sm">Welcome back</p>
            <h1 className="text-3xl font-bold text-white">{mockUser.name}</h1>
          </div>
          <button className="p-2 hover:bg-navy-light rounded-lg transition-colors">
            <Bell size={24} className="text-cyan" />
          </button>
        </div>

        {/* Credit Card */}
        <div className="bg-gradient-to-br from-cyan via-cyan-light to-cyan rounded-2xl p-4 text-navy-dark">
          <p className="text-sm font-semibold opacity-90">Available Credits</p>
          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="text-4xl font-bold">{mockUser.credits}</p>
              <p className="text-sm opacity-75">of {mockUser.totalCredits}</p>
            </div>
            <button className="px-4 py-2 bg-navy-dark text-cyan rounded-lg font-semibold hover:bg-navy transition-colors">
              + Buy More
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Featured Class */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Featured Class</h2>
          <FeaturedClassCard classData={featuredClass} />
        </div>

        {/* Recommended Trainers */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Top Trainers</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="min-w-[120px]">
                <TrainerCard trainer={trainer} compact={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Browse Classes</h2>
          <FilterTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Class List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredClasses.map((classData) => (
            <ClassCard key={classData.id} classData={classData} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
