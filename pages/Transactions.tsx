
import React, { useState } from 'react';
import { Student, Transaction, TransactionType } from '../types';

interface TransactionsProps {
  students: Student[];
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ students, transactions, onAdd, onDelete }) => {
  const [direction, setDirection] = useState<'IN' | 'OUT'>('IN');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [inType, setInType] = useState<TransactionType>(TransactionType.KAS);
  const [outType, setOutType] = useState<TransactionType>(TransactionType.OUT_KAS);
  const [notes, setNotes] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const isTabunganRelated = (direction === 'IN' && inType === TransactionType.TABUNGAN) || 
                              (direction === 'OUT' && outType === TransactionType.OUT_TABUNGAN);
    
    if ((direction === 'IN' || outType === TransactionType.OUT_TABUNGAN) && !selectedStudent && isTabunganRelated) {
        alert("Silakan pilih siswa terlebih dahulu.");
        return;
    }

    const finalDate = new Date(transactionDate);
    const now = new Date();
    finalDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    onAdd({
      studentId: selectedStudent || undefined,
      amount: parseInt(amount),
      type: direction === 'IN' ? inType : outType,
      date: finalDate.toISOString(),
      notes,
    });

    setSelectedStudent('');
    setAmount('');
    setNotes('');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      <header className="px-1">
        <h1 className="text-2xl font-black text-slate-900">Input Data</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Catat Transaksi Baru</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
              <button
                onClick={() => setDirection('IN')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  direction === 'IN' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setDirection('OUT')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  direction === 'OUT' ? 'bg-white text-red-600 shadow-md' : 'text-slate-400'
                }`}
              >
                Pengeluaran
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal</label>
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Dana</label>
                <div className="grid grid-cols-2 gap-3">
                  {direction === 'IN' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setInType(TransactionType.KAS)}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          inType === TransactionType.KAS ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-100'
                        }`}
                      >
                        Kas Rutin
                      </button>
                      <button
                        type="button"
                        onClick={() => setInType(TransactionType.TABUNGAN)}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          inType === TransactionType.TABUNGAN ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' : 'bg-white text-slate-400 border-slate-100'
                        }`}
                      >
                        Tabungan
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setOutType(TransactionType.OUT_KAS)}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          outType === TransactionType.OUT_KAS ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-100' : 'bg-white text-slate-400 border-slate-100'
                        }`}
                      >
                        Kas Kelas
                      </button>
                      <button
                        type="button"
                        onClick={() => setOutType(TransactionType.OUT_TABUNGAN)}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          outType === TransactionType.OUT_TABUNGAN ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-100' : 'bg-white text-slate-400 border-slate-100'
                        }`}
                      >
                        Tabungan
                      </button>
                    </>
                  )}
                </div>
              </div>

              {(direction === 'IN' || (direction === 'OUT' && outType === TransactionType.OUT_TABUNGAN)) && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Siswa</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none appearance-none"
                    required={direction === 'IN' || outType === TransactionType.OUT_TABUNGAN}
                  >
                    <option value="">Pilih Siswa...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nominal (Rp)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-none font-black text-lg text-slate-800 outline-none"
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keterangan</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none h-24 resize-none"
                  placeholder="Tulis catatan..."
                  required={direction === 'OUT'}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl active:scale-95 ${
                  direction === 'IN' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-red-600 shadow-red-100'
                }`}
              >
                Simpan
              </button>
            </form>
          </div>
        </div>

        {/* Transaction History - Card List for mobile */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Riwayat Terbaru</h3>
          <div className="space-y-3">
            {transactions.map((t) => {
              const student = students.find(s => s.id === t.studentId);
              const isExpense = t.type === TransactionType.OUT_KAS || t.type === TransactionType.OUT_TABUNGAN;
              
              return (
                <div key={t.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs ${
                      isExpense ? 'bg-red-100 text-red-600' : 
                      (t.type === TransactionType.KAS ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600')
                    }`}>
                      {isExpense ? '-' : (t.type === TransactionType.KAS ? 'K' : 'T')}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm line-clamp-1">
                        {isExpense ? (t.notes || 'Pengeluaran') : (student?.name || 'Kas Kelas')}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(t.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})} • {t.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <p className={`font-black text-sm whitespace-nowrap ${isExpense ? 'text-red-500' : 'text-slate-800'}`}>
                      {isExpense ? '-' : ''}{formatCurrency(t.amount)}
                    </p>
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="p-2 text-slate-300 hover:text-red-500 bg-slate-50 rounded-xl transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              );
            })}
            {transactions.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Belum ada transaksi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
