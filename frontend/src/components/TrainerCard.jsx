import { Star } from 'lucide-react';

export default function TrainerCard({ trainer, compact = false }) {
  if (compact) {
    return (
      <div className="flex flex-col items-center gap-2 px-3">
        <img
          src={trainer.avatar}
          alt={trainer.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-cyan"
        />
        <div className="text-center">
          <p className="font-semibold text-white text-xs">{trainer.name}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Star size={12} className="text-cyan fill-cyan" />
            <span className="text-xs text-gray-400">{trainer.rating}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-light rounded-2xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={trainer.avatar}
          alt={trainer.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-bold text-white">{trainer.name}</h3>
          <p className="text-xs text-gray-400">{trainer.bio}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Star size={16} className="text-cyan fill-cyan" />
          <span className="font-semibold text-white">{trainer.rating}</span>
        </div>
        <span className="text-xs text-gray-400">({trainer.reviews} reviews)</span>
      </div>
    </div>
  );
}
