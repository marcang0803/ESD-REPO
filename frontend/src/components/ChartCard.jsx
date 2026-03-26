import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ChartCard({ title, data, dataKey = 'value' }) {
  return (
    <div className="bg-navy-light rounded-2xl p-4">
      <h3 className="font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="period" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Bar dataKey={dataKey} fill="#06b6d4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
