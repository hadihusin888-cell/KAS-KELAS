
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: 'blue' | 'emerald' | 'amber' | 'indigo';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
