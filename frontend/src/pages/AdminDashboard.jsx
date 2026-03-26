import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  StatsPanel,
  ChartCard,
} from '../components';
import { mockAdminData } from '../data/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Classes', value: mockAdminData.stats.totalClasses },
    { label: 'Active Users', value: mockAdminData.stats.activeUsers },
    { label: 'Providers', value: mockAdminData.stats.activeProviders },
    { label: 'Total Bookings', value: mockAdminData.stats.totalBookings },
  ];

  const completionData = mockAdminData.completionStatus.map((item) => ({
    period: item.period,
    completed: item.completed,
    percentage: Math.round((item.completed / item.total) * 100),
  }));

  return (
    <div className="min-h-screen bg-navy pb-8">
      {/* Header */}
      <div className="bg-navy-dark px-4 pt-4 pb-4 border-b border-navy-light flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white flex-1">Operations Dashboard</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Key Stats */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Key Metrics</h2>
          <StatsPanel stats={stats} />
        </div>

        {/* Credits Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-navy-light rounded-2xl p-4">
            <p className="text-sm text-gray-400 mb-1">Credits Issued</p>
            <p className="text-2xl font-bold text-cyan">{mockAdminData.stats.totalCreditsIssued}</p>
          </div>
          <div className="bg-navy-light rounded-2xl p-4">
            <p className="text-sm text-gray-400 mb-1">Credits Used</p>
            <p className="text-2xl font-bold text-cyan">{mockAdminData.stats.totalCreditsUsed}</p>
          </div>
        </div>

        {/* Completion Rate Chart */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Class Completion Rate</h2>
          <ChartCard
            title="Daily Completion"
            data={completionData}
            dataKey="completed"
          />
        </div>

        {/* Payout Status */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Payout Status Distribution</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-navy-light rounded-2xl p-4">
              <p className="text-sm text-gray-400">Ready</p>
              <p className="text-3xl font-bold text-cyan">{mockAdminData.payoutStatus.ready}</p>
            </div>
            <div className="bg-navy-light rounded-2xl p-4">
              <p className="text-sm text-gray-400">Initiated</p>
              <p className="text-3xl font-bold text-cyan">{mockAdminData.payoutStatus.initiated}</p>
            </div>
            <div className="bg-navy-light rounded-2xl p-4">
              <p className="text-sm text-gray-400">Paid</p>
              <p className="text-3xl font-bold text-cyan">{mockAdminData.payoutStatus.paid}</p>
            </div>
            <div className="bg-navy-light rounded-2xl p-4">
              <p className="text-sm text-gray-400">Failed</p>
              <p className="text-3xl font-bold text-red-400">{mockAdminData.payoutStatus.failed}</p>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Recent Bookings</h2>
          <div className="space-y-2">
            {mockAdminData.recentBookings.map((booking) => (
              <div key={booking.id} className="bg-navy-light rounded-xl p-3 flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{booking.class}</p>
                  <p className="text-xs text-gray-400">{booking.user}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'confirmed'
                      ? 'bg-green-900 text-green-200'
                      : 'bg-red-900 text-red-200'
                  }`}>
                    {booking.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{booking.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">System Health</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-navy-light rounded-xl p-3">
              <span className="text-white font-semibold text-sm">API Status</span>
              <span className="px-3 py-1 bg-green-900 text-green-200 text-xs font-semibold rounded-full">
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center bg-navy-light rounded-xl p-3">
              <span className="text-white font-semibold text-sm">Database</span>
              <span className="px-3 py-1 bg-green-900 text-green-200 text-xs font-semibold rounded-full">
                Healthy
              </span>
            </div>
            <div className="flex justify-between items-center bg-navy-light rounded-xl p-3">
              <span className="text-white font-semibold text-sm">Payment Service</span>
              <span className="px-3 py-1 bg-green-900 text-green-200 text-xs font-semibold rounded-full">
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
