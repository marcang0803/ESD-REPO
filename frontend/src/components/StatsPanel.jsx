export default function StatsPanel({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-navy-light rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-cyan mb-1">{stat.value}</p>
          <p className="text-sm text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
