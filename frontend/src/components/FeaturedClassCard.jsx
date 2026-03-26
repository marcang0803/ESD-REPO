import { Clock, MapPin, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturedClassCard({ classData }) {
  return (
    <div className="bg-navy-light rounded-3xl overflow-hidden shadow-premium">
      <div className="aspect-video relative overflow-hidden">
        <img src={classData.image} alt={classData.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent"></div>
      </div>

      <div className="p-4 pt-0">
        <h2 className="text-xl font-bold text-white mb-3 -mt-2 relative z-10">{classData.title}</h2>

        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-navy">
          <img src={classData.provider.avatar} alt={classData.provider.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-white text-sm">{classData.provider.name}</p>
            <p className="text-xs text-gray-400">Instructor</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-navy rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">
              <Clock size={20} className="text-cyan" />
            </div>
            <p className="text-sm font-semibold text-white">{classData.duration}m</p>
            <p className="text-xs text-gray-400">Duration</p>
          </div>
          <div className="bg-navy rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">
              <Zap size={20} className="text-cyan" />
            </div>
            <p className="text-sm font-semibold text-white">{classData.creditsRequired}</p>
            <p className="text-xs text-gray-400">Credits</p>
          </div>
          <div className="bg-navy rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1">
              <Users size={20} className="text-cyan" />
            </div>
            <p className="text-sm font-semibold text-white">{classData.remainingSlots}</p>
            <p className="text-xs text-gray-400">Spots</p>
          </div>
        </div>

        <Link
          to={`/class/${classData.id}`}
          className="w-full bg-cyan text-navy-dark font-bold py-3 rounded-xl hover:bg-cyan-light transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
