
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface LoginProps {
  onLogin: (username: string) => void;
  settings: AppSettings;
}

const Login: React.FC<LoginProps> = ({ onLogin, settings }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin(username);
    } else {
      setError('Username atau Password salah (hint: admin / admin123)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="bg-indigo-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              {settings.loginTitle.charAt(0) || 'K'}
            </div>
            <h2 className="text-2xl font-black tracking-tight">{settings.loginTitle}</h2>
            <p className="text-indigo-100 mt-2 text-sm opacity-90">{settings.loginDescription}</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center space-x-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  placeholder="Masukkan username"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  placeholder="Masukkan password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black hover:bg-indigo-700 transform active:scale-95 transition-all shadow-xl shadow-indigo-100"
              >
                Masuk ke Dashboard
              </button>
            </form>
            
            <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-8">
              &copy; 2024 E-Kas Kelas System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
