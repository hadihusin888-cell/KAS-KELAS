import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Transactions from './pages/Transactions.tsx';
import Students from './pages/Students.tsx';
import Reports from './pages/Reports.tsx';
import Settings from './pages/Settings.tsx';
import Sidebar from './components/Sidebar.tsx';
import { User, Student, Transaction, AppSettings } from './types.ts';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzw3CXbcNftSKWdCCDc5a_RnEw7ntPRFwzEbmZXJoHKPwekdxnemPU6HNxfO_UbMASf_w/exec';

const DEFAULT_SETTINGS: AppSettings = {
  loginTitle: 'E-Kas & Tabungan',
  loginDescription: 'Sistem manajemen keuangan kelas terintegrasi Cloud.',
  initialKasBalance: 0
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('app_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('students_cache');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('transactions_cache');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const fetchData = useCallback(async () => {
    if (students.length === 0) setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(GOOGLE_SCRIPT_URL, { 
        method: 'GET',
        cache: 'no-cache',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Server Error");
      const result = await response.json();
      if (result.students) {
        setStudents(result.students);
        localStorage.setItem('students_cache', JSON.stringify(result.students));
      }
      if (result.transactions) {
        setTransactions(result.transactions);
        localStorage.setItem('transactions_cache', JSON.stringify(result.transactions));
      }
      if (result.settings) {
        const formattedSettings = {
          ...DEFAULT_SETTINGS,
          ...result.settings,
          initialKasBalance: Number(result.settings.initialKasBalance) || 0
        };
        setSettings(formattedSettings);
        localStorage.setItem('app_settings', JSON.stringify(formattedSettings));
      }
      setIsOnline(true);
    } catch (error) {
      console.warn("Offline mode active.");
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, [students.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const syncToSheets = async (action: string, data: any) => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      });
      setIsOnline(true);
    } catch (error) {
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
    syncToSheets('UPDATE_STUDENT', s);
  };

  const deleteStudent = (id: string) => {
    if (window.confirm("Hapus data siswa ini secara permanen?")) {
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
        <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-indigo-900 font-bold text-lg animate-pulse">Menghubungkan ke Cloud...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50">
        {user && <Sidebar onLogout={handleLogout} isOnline={isOnline} onRetry={fetchData} />}
        <main className={`flex-1 transition-all duration-300 ${user ? 'md:ml-64' : ''}`}>
          {/* pt-20 on mobile to clear the fixed top header bar */}
          <div className={`container mx-auto max-w-7xl px-4 md:px-8 ${user ? 'pt-20 pb-32 md:pt-8 md:pb-8' : ''}`}>
            {isOnline === false && user && (
              <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-3xl flex items-center justify-between text-amber-800 text-sm font-bold animate-fadeIn shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></div>
                  <span>Mode Offline.</span>
                </div>
                <button onClick={fetchData} className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs shadow-sm">Sinkronkan</button>
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