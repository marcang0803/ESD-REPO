import { useState } from 'react';
import { LogOut, Edit, Settings } from 'lucide-react';
import {
  BottomNav,
  StatsPanel,
  FilterTabs,
} from '../components';
import { mockUser } from '../data/mockData';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('stats');
  const tabs = ['stats', 'achievements', 'settings'];

  const stats = [
    { label: 'Classes Taken', value: 24 },
    { label: 'Total Credits Used', value: 142 },
    { label: 'Streak (days)', value: 7 },
    { label: 'Avg Rating', value: '4.8' },
  ];

  return (
    <div className="min-h-screen bg-cyan-light pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-cyan-light to-cyan-light px-4 pt-8 pb-24 relative">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-navy-dark">Profile</h1>
          <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
            <Settings size={24} className="text-navy-dark" />
          </button>
        </div>

        {/* Avatar & Info Card */}
        <div className="absolute left-4 right-4 -bottom-16 bg-white rounded-3xl p-6 shadow-premium">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-cyan"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-navy-dark">{mockUser.name}</h2>
              <p className="text-sm text-gray-500">Member since Jan 2024</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-24 space-y-6">
        {/* Stats Section */}
        <div>
          <h3 className="text-lg font-bold text-navy-dark mb-3">Your Stats</h3>
          <StatsPanel stats={stats} />
        </div>

        {/* Tabs */}
        <FilterTabs
          categories={tabs}
          activeCategory={activeTab}
          onSelect={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === 'stats' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <p className="text-sm text-gray-500 mb-1">Classes This Month</p>
              <p className="text-3xl font-bold text-cyan">12</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <p className="text-sm text-gray-500 mb-1">Credits Balance</p>
              <p className="text-3xl font-bold text-cyan">{mockUser.credits}</p>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3">
              <span className="text-4xl">🎯</span>
              <div>
                <p className="font-bold text-navy-dark">First Class</p>
                <p className="text-sm text-gray-500">Unlocked Jan 15, 2024</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3">
              <span className="text-4xl">🔥</span>
              <div>
                <p className="font-bold text-navy-dark">7-Day Streak</p>
                <p className="text-sm text-gray-500">Unlocked Mar 24, 2024</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3">
              <span className="text-4xl">⭐</span>
              <div>
                <p className="font-bold text-navy-dark">Top Reviewer</p>
                <p className="text-sm text-gray-500">Unlocked Mar 10, 2024</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-3">
            <button className="w-full bg-white rounded-2xl p-4 text-left hover:shadow-card transition-shadow">
              <p className="font-semibold text-navy-dark">Notifications</p>
              <p className="text-sm text-gray-500 mt-1">Manage push & email alerts</p>
            </button>
            <button className="w-full bg-white rounded-2xl p-4 text-left hover:shadow-card transition-shadow">
              <p className="font-semibold text-navy-dark">Privacy</p>
              <p className="text-sm text-gray-500 mt-1">Control your privacy settings</p>
            </button>
            <button className="w-full bg-white rounded-2xl p-4 text-left hover:shadow-card transition-shadow">
              <p className="font-semibold text-navy-dark">Help & Support</p>
              <p className="text-sm text-gray-500 mt-1">Contact us anytime</p>
            </button>
            <button className="w-full bg-red-50 rounded-2xl p-4 text-left hover:shadow-card transition-shadow flex items-center gap-3">
              <LogOut size={20} className="text-red-500" />
              <div>
                <p className="font-semibold text-red-600">Logout</p>
              </div>
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
