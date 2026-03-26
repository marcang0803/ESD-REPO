import { Clock, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClassCard({ classData, compact = false }) {
  if (compact) {
    return (
      <Link
        to={`/class/${classData.id}`}
        className="bg-navy-light rounded-2xl overflow-hidden hover:shadow-premium transition-shadow"
      >
        <div className="aspect-video overflow-hidden">
          <img src={classData.image} alt={classData.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm">{classData.title}</h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <Clock size={14} />
            {classData.time}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/class/${classData.id}`}
      className="bg-navy-light rounded-3xl overflow-hidden shadow-card hover:shadow-premium transition-shadow"
    >
      <div className="aspect-video overflow-hidden">
        <img src={classData.image} alt={classData.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white mb-2">{classData.title}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <img src={classData.provider.avatar} alt={classData.provider.name} className="w-8 h-8 rounded-full" />
          <span className="text-sm text-gray-400">{classData.provider.name}</span>
        </div>

        <div className="flex gap-3 mb-3 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {classData.duration}min
          </div>
          <div className="flex items-center gap-1">
            <Zap size={16} />
            {classData.creditsRequired} credits
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            {classData.remainingSlots} slots
          </div>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 bg-navy rounded-full text-xs text-cyan font-semibold capitalize">
            {classData.difficulty}
          </span>
          <span className="px-3 py-1 bg-navy rounded-full text-xs text-gray-300 capitalize">
            {classData.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
