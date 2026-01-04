import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
  isOnline: boolean | null;
  onRetry: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isOnline, onRetry }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Beranda', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/transactions', label: 'Input', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
    { path: '/students', label: 'Siswa', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { path: '/reports', label: 'Laporan', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z' },
  ];

  const moreItems = [
    { path: '/settings', label: 'Pengaturan', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37' },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-[60] flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">K</div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-tight">E-Kas</h2>
              <div className="flex items-center space-x-1.5">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : isOnline === false ? 'bg-amber-500' : 'bg-slate-300 animate-pulse'}`}></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{isOnline ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {[...menuItems, ...moreItems].map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-100">
          <button onClick={onLogout} className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all text-sm font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE TOP STATUS BAR --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-slate-100 z-[70] flex items-center justify-between px-4 pt-safe shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">K</div>
          <span className="font-black text-slate-800 text-sm tracking-tight uppercase">E-Kas Kelas</span>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${isOnline ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-[70] px-2 py-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-1.5 min-w-[60px] transition-all ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
              >
                <svg className={`w-6 h-6 mb-0.5 ${isActive ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
                </svg>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
              </Link>
            );
          })}
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center p-1.5 min-w-[60px] ${isMenuOpen ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-tighter opacity-60">Menu</span>
          </button>
        </div>
      </nav>

      {/* --- MOBILE MORE MENU DRAWER --- */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] md:hidden" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 pb-safe z-[90] animate-slideUp md:hidden">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
            <div className="space-y-4">
              <Link 
                to="/settings" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-4 p-5 bg-slate-50 rounded-2xl text-slate-700 font-bold active:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37" /></svg>
                </div>
                <span>Pengaturan Aplikasi</span>
              </Link>
              
              <button 
                onClick={() => { onRetry(); setIsMenuOpen(false); }}
                className="flex items-center space-x-4 p-5 w-full bg-slate-50 rounded-2xl text-slate-700 font-bold active:bg-slate-100 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9" /></svg>
                </div>
                <span>Sinkronisasi Awan</span>
              </button>

              <button 
                onClick={onLogout}
                className="flex items-center space-x-4 p-5 w-full bg-red-50 rounded-2xl text-red-600 font-bold active:bg-red-100 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                </div>
                <span>Keluar dari Akun</span>
              </button>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="mt-8 w-full py-4 text-slate-400 font-black uppercase tracking-widest text-[10px]">Tutup Panel</button>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;