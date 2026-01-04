
import React, { useMemo, useState } from 'react';
import { Transaction, Student, TransactionType, AppSettings } from '../types';

interface ReportsProps {
  transactions: Transaction[];
  students: Student[];
  settings: AppSettings;
}

const Reports: React.FC<ReportsProps> = ({ transactions, students, settings }) => {
  const [reportType, setReportType] = useState<'kas' | 'tabungan'>('kas');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const result = [];
    for (let y = 2023; y <= currentYear + 1; y++) {
      result.push(y);
    }
    return result;
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const fridaysInMonth = useMemo(() => {
    const fridays: number[] = [];
    const date = new Date(selectedYear, selectedMonth, 1);
    while (date.getMonth() === selectedMonth) {
      if (date.getDay() === 5) {
        fridays.push(date.getDate());
      }
      date.setDate(date.getDate() + 1);
    }
    return fridays;
  }, [selectedMonth, selectedYear]);

  const kasMatrix = useMemo(() => {
    return students.map(student => {
      const studentKas = transactions.filter(t => {
        const d = new Date(t.date);
        return t.studentId === student.id && 
               t.type === TransactionType.KAS &&
               d.getMonth() === selectedMonth &&
               d.getFullYear() === selectedYear;
      });

      const weeksPaid = new Array(fridaysInMonth.length).fill(false);
      
      studentKas.forEach(t => {
        const day = new Date(t.date).getDate();
        for (let i = 0; i < fridaysInMonth.length; i++) {
          const currentFriday = fridaysInMonth[i];
          const prevFriday = i > 0 ? fridaysInMonth[i - 1] : 0;
          
          if (day > prevFriday && day <= currentFriday) {
            weeksPaid[i] = true;
            break;
          }
          if (i === fridaysInMonth.length - 1 && day > currentFriday) {
             weeksPaid[i] = true;
          }
        }
      });

      return {
        ...student,
        weeksPaid,
        totalMonth: studentKas.reduce((sum, t) => sum + t.amount, 0)
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [students, transactions, selectedMonth, selectedYear, fridaysInMonth]);

  const tabunganSummary = useMemo(() => {
    return students.map(student => {
      const balance = transactions
        .filter(t => t.studentId === student.id)
        .reduce((sum, t) => {
          if (t.type === TransactionType.TABUNGAN) return sum + t.amount;
          if (t.type === TransactionType.OUT_TABUNGAN) return sum - t.amount;
          return sum;
        }, 0);
      return { ...student, total: balance };
    }).sort((a, b) => b.total - a.total);
  }, [students, transactions]);

  const totalClassExpense = useMemo(() => {
    return transactions
      .filter(t => t.type === TransactionType.OUT_KAS && 
                   new Date(t.date).getMonth() === selectedMonth && 
                   new Date(t.date).getFullYear() === selectedYear)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, selectedMonth, selectedYear]);

  const currentKasBalance = settings.initialKasBalance + transactions.reduce((sum, t) => {
    if (t.type === TransactionType.KAS) return sum + t.amount;
    if (t.type === TransactionType.OUT_KAS) return sum - t.amount;
    return sum;
  }, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Laporan</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Rekapitulasi Keuangan</p>
        </div>

        <div className="bg-slate-100 p-1 rounded-2xl flex items-center shadow-inner">
          <button
            onClick={() => setReportType('kas')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              reportType === 'kas' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'
            }`}
          >
            Kas Rutin
          </button>
          <button
            onClick={() => setReportType('tabungan')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              reportType === 'tabungan' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'
            }`}
          >
            Tabungan
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bulan</label>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 py-2 px-3 outline-none"
          >
            {months.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tahun</label>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 py-2 px-3 outline-none"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {reportType === 'kas' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Matriks Pembayaran</h3>
              <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">{fridaysInMonth.length} Minggu</span>
            </div>
            
            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="px-4 py-4 sticky left-0 z-20 bg-slate-50 min-w-[120px]">Nama Siswa</th>
                    {fridaysInMonth.map((day, idx) => (
                      <th key={idx} className="px-4 py-4 text-center min-w-[70px]">W{idx + 1}<br/><span className="text-[8px] font-normal opacity-60">Tgl {day}</span></th>
                    ))}
                    <th className="px-4 py-4 text-right min-w-[100px]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {kasMatrix.map((student) => (
                    <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-4 py-4 sticky left-0 z-10 bg-white group-hover:bg-indigo-50/30 font-bold text-slate-700 text-xs truncate max-w-[120px]">
                        {student.name}
                      </td>
                      {student.weeksPaid.map((paid, idx) => (
                        <td key={idx} className="px-2 py-4 text-center">
                          <div className="flex justify-center">
                            {paid ? (
                              <div className="w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-slate-100 rounded-lg border border-slate-200"></div>
                            )}
                          </div>
                        </td>
                      ))}
                      <td className="px-4 py-4 text-right font-black text-slate-900 text-xs">
                        {formatCurrency(student.totalMonth).replace('Rp', '')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-black text-red-800 uppercase text-[10px] tracking-widest">Pengeluaran Kas</h4>
              <span className="text-red-600 font-black text-lg">{formatCurrency(totalClassExpense)}</span>
            </div>
            <div className="space-y-2">
              {transactions
                .filter(t => t.type === TransactionType.OUT_KAS && 
                             new Date(t.date).getMonth() === selectedMonth && 
                             new Date(t.date).getFullYear() === selectedYear)
                .map(t => (
                  <div key={t.id} className="flex justify-between text-xs text-red-700 bg-white/60 p-3 rounded-2xl border border-red-100">
                    <span className="font-bold line-clamp-1">{t.notes}</span>
                    <span className="font-black whitespace-nowrap ml-2">{formatCurrency(t.amount)}</span>
                  </div>
                ))
              }
              {totalClassExpense === 0 && <p className="text-[10px] text-red-400 font-bold uppercase text-center py-4">Tidak ada pengeluaran</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-emerald-50/30">
            <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest">Saldo Tabungan</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {tabunganSummary.map((student) => (
              <div key={student.id} className="p-4 flex justify-between items-center hover:bg-emerald-50/20 transition-colors">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NIS: {student.nis}</p>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${student.total < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {formatCurrency(student.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="grid grid-cols-1 gap-4 px-1">
        <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
          <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Kas Bersih Saat Ini</p>
          <h4 className="text-3xl font-black">{formatCurrency(currentKasBalance)}</h4>
        </div>
        <div className="bg-emerald-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100">
          <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest mb-1">Total Tabungan Kelas</p>
          <h4 className="text-3xl font-black">
            {formatCurrency(tabunganSummary.reduce((sum, s) => sum + s.total, 0))}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Reports;
