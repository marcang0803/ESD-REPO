import {
  WalletCard,
  TransactionItem,
  BottomNav,
  MobileHeader,
  EmptyState,
} from '../components';
import { mockTransactions } from '../data/mockData';
import { CreditCard } from 'lucide-react';

export default function Wallet() {
  return (
    <div className="min-h-screen bg-navy pb-24">
      <MobileHeader
        title="Wallet"
        subtitle="Manage your credits"
      />

      <div className="px-4 py-6 space-y-6">
        {/* Credit Card */}
        <WalletCard />

        {/* Buy Credits Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Buy Credits</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { credits: 10, price: 9.99 },
              { credits: 30, price: 24.99, badge: 'Popular' },
              { credits: 60, price: 44.99, badge: 'Save 25%' },
              { credits: 100, price: 69.99, badge: 'Save 30%' },
            ].map((pkg) => (
              <button
                key={pkg.credits}
                className="bg-navy-light rounded-2xl p-4 text-left hover:shadow-card transition-shadow relative group"
              >
                {pkg.badge && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-cyan text-navy-dark text-xs font-bold rounded-lg">
                    {pkg.badge}
                  </span>
                )}
                <p className="text-2xl font-bold text-cyan">{pkg.credits}</p>
                <p className="text-sm text-gray-400">Credits</p>
                <p className="text-lg font-semibold text-white mt-2">${pkg.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Transaction History</h2>
          {mockTransactions.length === 0 ? (
            <EmptyState
              title="No transactions"
              description="Your transactions will appear here"
              icon={CreditCard}
            />
          ) : (
            <div className="space-y-2">
              {mockTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
