export default function StatusBadge({ status, size = 'md' }) {
  const baseClasses = 'font-semibold inline-block rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const statusStyles = {
    confirmed: 'bg-green-900 text-green-200',
    pending: 'bg-yellow-900 text-yellow-200',
    cancelled: 'bg-red-900 text-red-200',
    completed: 'bg-blue-900 text-blue-200',
    ready: 'bg-cyan-900 text-cyan-200',
    initiated: 'bg-indigo-900 text-indigo-200',
    paid: 'bg-emerald-900 text-emerald-200',
    failed: 'bg-rose-900 text-rose-200',
    retrying: 'bg-orange-900 text-orange-200',
    debit: 'bg-red-900 text-red-200',
    refund: 'bg-green-900 text-green-200',
    forfeit: 'bg-orange-900 text-orange-200',
    purchase: 'bg-cyan-900 text-cyan-200',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${statusStyles[status] || 'bg-gray-700 text-gray-200'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
