import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BottomNav,
  ProviderClassItem,
  FilterTabs,
  FloatingActionButton,
} from '../components';
import { mockProviderClasses } from '../data/mockData';

export default function ManageClasses() {
  const navigate = useNavigate();
  const [filter, setFilter] = ['upcoming', 'completed'];

  const upcoming = mockProviderClasses.filter((c) => c.status === 'upcoming');
  const completed = mockProviderClasses.filter((c) => c.status === 'completed');

  return (
    <div className="min-h-screen bg-navy pb-28">
      {/* Header */}
      <div className="bg-navy-dark px-4 pt-4 pb-4 border-b border-navy-light flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-navy-light rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Manage Classes</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Upcoming Classes */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Upcoming Classes</h2>
          <div className="space-y-3">
            {upcoming.length > 0 ? (
              upcoming.map((cls) => (
                <ProviderClassItem key={cls.id} classItem={cls} />
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No upcoming classes</p>
            )}
          </div>
        </div>

        {/* Completed Classes */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Completed Classes</h2>
          <div className="space-y-3">
            {completed.length > 0 ? (
              completed.map((cls) => (
                <ProviderClassItem key={cls.id} classItem={cls} />
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No completed classes</p>
            )}
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
