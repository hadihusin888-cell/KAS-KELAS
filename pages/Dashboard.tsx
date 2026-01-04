
import React from 'react';
import { Transaction, Student, TransactionType, AppSettings } from '../types';
import StatsCard from '../components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  students: Student[];
  settings: AppSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, students, settings }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const totalKas = settings.initialKasBalance + transactions.reduce((sum, t) => {
    if (t.type === TransactionType.KAS) return sum + t.amount;
    if (t.type === TransactionType.OUT_KAS) return sum - t.amount;
    return sum;
  }, 0);

  const totalTabungan = transactions.reduce((sum, t) => {
    if (t.type === TransactionType.TABUNGAN) return sum + t.amount;
    if (t.type === TransactionType.OUT_TABUNGAN) return sum - t.amount;
    return sum;
  }, 0);

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const thisWeekCollection = transactions
    .filter(t => new Date(t.date) >= thisWeek && (t.type === TransactionType.KAS || t.type === TransactionType.TABUNGAN))
    .reduce((sum, t) => sum + t.amount, 0);

  const chartData = [
    { name: 'Kas', value: Math.max(0, totalKas) },
    { name: 'Tabungan', value: Math.max(0, totalTabungan) },
  ];

  const COLORS = ['#6366f1', '#10b981'];
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <header className="px-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Beranda</h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{todayStr}</p>
      </header>

      {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatsCard
          label="Saldo Kas"
          value={formatCurrency(totalKas)}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7" /></svg>}
          color="indigo"
        />
        <StatsCard
          label="Tabungan"
          value={formatCurrency(totalTabungan)}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2" /></svg>}
          color="emerald"
        />
        <StatsCard
          label="Pemasukan 7h"
          value={formatCurrency(thisWeekCollection)}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8" /></svg>}
          color="blue"
        />
        <StatsCard
          label="Siswa"
          value={students.length.toString()}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1" /></svg>}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Porsi Dana</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions - Card list is better for mobile */}
        <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Aktivitas Terkini</h3>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((t) => {
                const isExpense = t.type === TransactionType.OUT_KAS || t.type === TransactionType.OUT_TABUNGAN;
                const student = t.studentId ? students.find(s => s.id === t.studentId) : null;
                
                return (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isExpense ? 'bg-red-100 text-red-600' : 
                        (t.type === TransactionType.KAS ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600')
                      }`}>
                        {isExpense ? '-' : (t.type === TransactionType.KAS ? 'K' : 'T')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm line-clamp-1">
                          {isExpense ? (t.type === TransactionType.OUT_KAS ? 'Keluar Kas' : `Tarik: ${student?.name || 'Siswa'}`) : (student?.name || 'Kas Kelas')}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(t.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</p>
                      </div>
                    </div>
                    <p className={`font-black text-sm whitespace-nowrap ${isExpense ? 'text-red-500' : 'text-slate-800'}`}>
                      {isExpense ? '-' : ''}{formatCurrency(t.amount)}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 text-sm font-bold uppercase">Belum ada aktivitas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
