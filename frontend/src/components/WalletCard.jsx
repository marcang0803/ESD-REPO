export default function WalletCard() {
  return (
    <div className="bg-gradient-to-br from-cyan to-cyan-light rounded-3xl p-6 text-navy-dark shadow-premium">
      <p className="text-sm font-semibold opacity-80 mb-2">Available Credits</p>
      <h1 className="text-5xl font-bold mb-6">45</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-xs opacity-80">Total Credits</p>
          <p className="font-bold text-xl">100</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-xs opacity-80">Used This Month</p>
          <p className="font-bold text-xl">55</p>
        </div>
      </div>
    </div>
  );
}
