
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleInitialBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFormData({ ...formData, initialKasBalance: value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">Pengaturan Aplikasi</h1>
        <p className="text-slate-500">Sesuaikan tampilan login dan data awal keuangan kelas.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl flex items-center space-x-3 animate-slideDown">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="font-bold">Pengaturan Berhasil Disimpan!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section: Login Customization */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest text-sm">Tampilan Login</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Judul Aplikasi</label>
                <input
                  type="text"
                  value={formData.loginTitle}
                  onChange={(e) => setFormData({ ...formData, loginTitle: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-800"
                  placeholder="Contoh: E-Kas Kelas X-IPA"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Keterangan Singkat</label>
                <textarea
                  value={formData.loginDescription}
                  onChange={(e) => setFormData({ ...formData, loginDescription: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-600 h-28 resize-none"
                  placeholder="Keterangan yang muncul di halaman login..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Financial Data */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
             <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest text-sm">Data Keuangan Awal</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Saldo Kas Awal (Rp)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={formData.initialKasBalance}
                    onChange={handleInitialBalanceChange}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-800"
                    placeholder="0"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic px-1">
                  * Gunakan jika sudah ada saldo dari semester sebelumnya.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center space-x-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
