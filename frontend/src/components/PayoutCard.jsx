import StatusBadge from './StatusBadge';

export default function PayoutCard({ payout }) {
  return (
    <div className="bg-navy-light rounded-2xl p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-400 mb-1">Period</p>
          <p className="font-semibold text-white">{payout.period}</p>
        </div>
        <StatusBadge status={payout.status} size="sm" />
      </div>

      <div className="space-y-2 mb-4 pb-4 border-b border-navy">
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Gross Earnings</span>
          <span className="font-semibold text-white">${payout.grossEarnings.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Commission (10%)</span>
          <span className="font-semibold text-red-400">${payout.commission.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-cyan">Net Payout</span>
        <span className="text-2xl font-bold text-cyan">${payout.amount.toFixed(2)}</span>
      </div>
    </div>
  );
}
