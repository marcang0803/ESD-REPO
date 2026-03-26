import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BottomNav,
  MobileHeader,
  StatsPanel,
  FloatingActionButton,
  ProviderClassItem,
} from '../components';
import { mockProvider, mockProviderClasses, mockPayouts } from '../data/mockData';

export default function ProviderDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Classes', value: 8 },
    { label: 'Total Bookings', value: 156 },
    { label: 'Completed', value: 89 },
    { label: 'Avg Rating', value: '4.8' },
  ];

  const upcomingClasses = mockProviderClasses.filter((c) => c.status === 'upcoming');

  return (
    <div className="min-h-screen bg-navy pb-28">
      <MobileHeader
        title="Dashboard"
        subtitle="Welcome back!"
        showNotification={true}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Provider Info */}
        <div className="bg-navy-light rounded-2xl p-4 flex items-center gap-3">
          <img
            src={mockProvider.avatar}
            alt={mockProvider.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="font-bold text-white">{mockProvider.name}</h2>
            <p className="text-sm text-gray-400">{mockProvider.bio}</p>
            <div className="flex gap-1 mt-1">
              <span className="text-sm text-cyan font-semibold">⭐ {mockProvider.rating}</span>
              <span className="text-sm text-gray-400">({mockProvider.reviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Quick Stats</h3>
          <StatsPanel stats={stats} />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/provider/classes')}
            className="bg-navy-light rounded-xl p-4 text-center hover:shadow-card transition-shadow"
          >
            <p className="text-2xl mb-2">📅</p>
            <p className="font-semibold text-white text-sm">Manage Classes</p>
          </button>
          <button
            onClick={() => navigate('/provider/payouts')}
            className="bg-navy-light rounded-xl p-4 text-center hover:shadow-card transition-shadow"
          >
            <p className="text-2xl mb-2">💰</p>
            <p className="font-semibold text-white text-sm">Payouts</p>
          </button>
        </div>

        {/* Upcoming Classes */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-white">Upcoming Classes</h3>
            <button
              onClick={() => navigate('/provider/classes')}
              className="text-cyan text-sm hover:text-cyan-light"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {upcomingClasses.slice(0, 2).map((cls) => (
              <ProviderClassItem key={cls.id} classItem={cls} />
            ))}
          </div>
        </div>

        {/* Recent Payouts */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Recent Payouts</h3>
          <div className="space-y-3">
            {mockPayouts.slice(0, 2).map((payout) => (
              <div key={payout.id} className="bg-navy-light rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white text-sm">{payout.period}</p>
                  <p className="text-xs text-gray-400">{payout.status}</p>
                </div>
                <p className="font-bold text-cyan">${payout.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FloatingActionButton
        onClick={() => navigate('/provider/create-class')}
        label="Create new class"
      />

      <BottomNav />
    </div>
  );
}
