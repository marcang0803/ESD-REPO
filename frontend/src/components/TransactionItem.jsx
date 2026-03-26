import StatusBadge from './StatusBadge';

export default function TransactionItem({ transaction }) {
  const icon = {
    purchase: '⬇️',
    debit: '➖',
    refund: '↩️',
    forfeit: '❌',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-navy-light rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-lg">
          {icon[transaction.type] || '💳'}
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{transaction.description}</p>
          <p className="text-xs text-gray-400">{transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-white'}`}>
          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
        </p>
        <StatusBadge status={transaction.type} size="sm" />
      </div>
    </div>
  );
}
