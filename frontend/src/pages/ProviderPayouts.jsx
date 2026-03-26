import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BottomNav,
  PayoutCard,
  StatsPanel,
} from '../components';
import { mockPayouts } from '../data/mockData';

export default function ProviderPayouts() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Earned', value: '$950' },
    { label: 'Pending', value: '$500' },
    { label: 'This Month', value: '$450' },
    { label: 'Avg per Class', value: '$62' },
  ];

  return (
    <div className="min-h-screen bg-navy pb-24">
      {/* Header */}
      <div className="bg-navy-dark px-4 pt-4 pb-4 border-b border-navy-light flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-navy-light rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Payouts</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Summary</h2>
          <StatsPanel stats={stats} />
        </div>

        {/* Payout History */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Payout History</h2>
          <div className="space-y-3">
            {mockPayouts.map((payout) => (
              <PayoutCard key={payout.id} payout={payout} />
            ))}
          </div>
        </div>

        {/* Bank Account Info */}
        <div className="bg-navy-light rounded-2xl p-4">
          <h3 className="font-semibold text-white mb-3">Linked Bank Account</h3>
          <div className="bg-navy rounded-xl p-3 mb-3">
            <p className="text-sm text-gray-400 mb-1">Account</p>
            <p className="font-mono text-white">•••• •••• •••• 4829</p>
          </div>
          <button className="text-cyan text-sm hover:text-cyan-light font-semibold">
            Change Account
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
