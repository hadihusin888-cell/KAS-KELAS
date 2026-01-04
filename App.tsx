
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
    // Jika sudah ada data di cache, kita tampilkan dulu (optimistic UI)
    if (students.length > 0) {
      setIsLoading(false);
    }

    try {
      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('macros/s/')) {
        const response = await fetch(GOOGLE_SCRIPT_URL, { 
          method: 'GET',
          cache: 'no-cache'
        });
        
        if (!response.ok) throw new Error("Server error");
        
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
          const formattedSettings = {
            ...result.settings,
            initialKasBalance: Number(result.settings.initialKasBalance) || 0
          };
          setSettings(formattedSettings);
          localStorage.setItem('app_settings', JSON.stringify(formattedSettings));
        }
        setIsOnline(true);
      }
    } catch (error) {
      console.warn("Gagal sinkronisasi cloud, menggunakan data offline.", error);
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
    syncToSheets('UPDATE_STUDENT', s);
  };

  const deleteStudent = (id: string) => {
    if (window.confirm("Hapus siswa ini?")) {
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
        <p className="text-indigo-900 font-bold">Memuat Data...</p>
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
                  <span>Mode Offline: Menggunakan data tersimpan.</span>
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
