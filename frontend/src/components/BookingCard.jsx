import { Clock, Calendar, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function BookingCard({ booking, onCancel }) {
  const canCancel = booking.status === 'confirmed';
  const classDate = new Date(booking.date);
  const hoursUntilClass = (classDate - new Date()) / (1000 * 60 * 60);
  const canGetRefund = hoursUntilClass > 12;

  return (
    <div className="bg-navy-light rounded-2xl p-4 flex gap-3">
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <img src={booking.classImage} alt={booking.className} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-white">{booking.className}</h3>
            <p className="text-sm text-gray-400">{booking.provider}</p>
          </div>
          <StatusBadge status={booking.status} size="sm" />
        </div>

        <div className="flex gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(booking.date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {booking.time}
          </div>
        </div>

        {canCancel && (
          <button
            onClick={() => onCancel?.(booking, canGetRefund)}
            className="mt-2 text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <X size={14} />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
