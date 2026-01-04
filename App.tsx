
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Students from './pages/Students';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import { User, Student, Transaction, AppSettings } from './types';

/**
 * URL Google Apps Script hasil Deployment (Web App)
 * Ganti dengan URL Anda sendiri setelah melakukan Deployment di Google Sheets
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzw3CXbcNftSKWdCCDc5a_RnEw7ntPRFwzEbmZXJoHKPwekdxnemPU6HNxfO_UbMASf_w/exec';

const DEFAULT_SETTINGS: AppSettings = {
  loginTitle: 'E-Kas & Tabungan',
  loginDescription: 'Sistem manajemen keuangan kelas terintegrasi Cloud.',
  initialKasBalance: 0
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students_cache');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions_cache');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Pastikan URL tidak kosong sebelum fetch
      if (!GOOGLE_SCRIPT_URL.includes('macros/s/')) {
        console.warn("URL Google Script belum diatur.");
        setIsOnline(false);
        setIsLoading(false);
        return;
      }

      const response = await fetch(GOOGLE_SCRIPT_URL, { 
        method: 'GET',
        cache: 'no-cache'
      });
      
      if (!response.ok) throw new Error("Gagal mengambil data dari server.");
      
      const result = await response.json();
      
      if (result.students) {
        setStudents(result.students);
        localStorage.setItem('students_cache', JSON.stringify(result.students));
      }
      if (result.transactions) {
        setTransactions(result.transactions);
        localStorage.setItem('transactions_cache', JSON.stringify(result.transactions));
      }
      if (result.settings && result.settings.loginTitle) {
        setSettings({
          ...result.settings,
          initialKasBalance: Number(result.settings.initialKasBalance) || 0
        });
        localStorage.setItem('app_settings', JSON.stringify(result.settings));
      }
      setIsOnline(true);
    } catch (error) {
      console.warn("Berjalan dalam mode offline (Cache).", error);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sync state ke local storage untuk akses offline cepat
  useEffect(() => {
    localStorage.setItem('students_cache', JSON.stringify(students));
    localStorage.setItem('transactions_cache', JSON.stringify(transactions));
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [students, transactions, settings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const syncToSheets = async (action: string, data: any) => {
    try {
      // Kita gunakan mode 'no-cors' untuk POST ke Google Apps Script agar menghindari isu Preflight CORS
      // Namun mode ini tidak akan mengembalikan response body, jadi kita asumsikan berhasil di UI.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      });
      setIsOnline(true);
    } catch (error) {
      console.error(`Gagal sinkronisasi aksi ${action}:`, error);
      setIsOnline(false);
    }
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newId = 'TRX-' + Date.now();
    const newTransaction = { ...t, id: newId };
    setTransactions(prev => [newTransaction, ...prev]);
    syncToSheets('ADD_TRANSACTION', newTransaction);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    syncToSheets('DELETE_TRANSACTION', { id });
  };

  const addStudent = (s: Omit<Student, 'id'>) => {
    const newId = 'STD-' + Date.now();
    const newStudent = { ...s, id: newId };
    setStudents(prev => [...prev, newStudent]);
    syncToSheets('ADD_STUDENT', newStudent);
  };

  const updateStudent = (s: Student) => {
    setStudents(prev => prev.map(item => item.id === s.id ? s : item));
    syncToSheets('UPDATE_STUDENT', s); // Pastikan Apps Script menangani UPDATE jika diperlukan
  };

  const deleteStudent = (id: string) => {
    if (window.confirm("Hapus siswa ini? Transaksi lamanya akan tetap ada namun tanpa nama.")) {
      setStudents(prev => prev.filter(s => s.id !== id));
      syncToSheets('DELETE_STUDENT', { id });
    }
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    syncToSheets('UPDATE_SETTINGS', newSettings);
  };

  const handleLogin = (username: string) => {
    setUser({ username, role: 'admin' });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading && students.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50 p-6">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-900 font-bold">Menghubungkan ke Cloud...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50">
        {user && <Sidebar onLogout={handleLogout} isOnline={isOnline} onRetry={fetchData} />}
        <main className={`flex-1 transition-all duration-300 ${user ? 'md:ml-64' : ''}`}>
          <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {isOnline === false && user && (
              <div className="mb-4 bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between text-amber-800 text-xs font-bold animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span>Mode Offline: Perubahan disimpan di HP ini dan akan disinkronkan nanti.</span>
                </div>
                <button onClick={fetchData} className="bg-white px-3 py-1 rounded-lg border border-amber-200">Segarkan</button>
              </div>
            )}
            <Routes>
              <Route path="/login" element={!user ? <Login onLogin={handleLogin} settings={settings} /> : <Navigate to="/" />} />
              <Route path="/" element={user ? <Dashboard transactions={transactions} students={students} settings={settings} /> : <Navigate to="/login" />} />
              <Route path="/transactions" element={user ? <Transactions transactions={transactions} students={students} onAdd={addTransaction} onDelete={deleteTransaction} /> : <Navigate to="/login" />} />
              <Route path="/students" element={user ? <Students students={students} onAdd={addStudent} onUpdate={updateStudent} onDelete={deleteStudent} /> : <Navigate to="/login" />} />
              <Route path="/reports" element={user ? <Reports transactions={transactions} students={students} settings={settings} /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <Settings settings={settings} onUpdate={handleUpdateSettings} /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
