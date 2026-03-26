export default function ProviderClassItem({ classItem, onComplete, onEdit, onDelete }) {
  return (
    <div className="bg-navy-light rounded-2xl p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-white">{classItem.title}</h3>
          <p className="text-sm text-gray-400">
            {classItem.date} at {classItem.time}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          classItem.status === 'completed' ? 'bg-green-900 text-green-200' : 'bg-cyan-900 text-cyan-200'
        }`}>
          {classItem.status === 'completed' ? 'Completed' : 'Upcoming'}
        </span>
      </div>

      <div className="flex gap-2 mb-3 text-sm text-gray-400">
        <span>{classItem.duration}m</span>
        <span>•</span>
        <span>{classItem.booked}/{classItem.maxSlots} booked</span>
        <span>•</span>
        <span>{classItem.creditsRequired} credits</span>
      </div>

      {classItem.status === 'upcoming' && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(classItem)}
            className="flex-1 px-3 py-2 bg-navy text-cyan rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onComplete?.(classItem)}
            className="flex-1 px-3 py-2 bg-cyan text-navy-dark rounded-lg text-sm font-semibold hover:bg-cyan-light transition-colors"
          >
            Mark Complete
          </button>
          <button
            onClick={() => onDelete?.(classItem)}
            className="px-3 py-2 bg-navy text-red-400 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
