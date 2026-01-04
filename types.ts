
export enum TransactionType {
  KAS = 'KAS',
  TABUNGAN = 'TABUNGAN',
  OUT_KAS = 'OUT_KAS',
  OUT_TABUNGAN = 'OUT_TABUNGAN'
}

export interface Student {
  id: string;
  name: string;
  nis: string;
}

export interface Transaction {
  id: string;
  studentId?: string; // Optional for general class expenses
  amount: number;
  type: TransactionType;
  date: string;
  notes?: string;
}

export interface User {
  username: string;
  role: 'admin' | 'viewer';
}

export interface AppSettings {
  loginTitle: string;
  loginDescription: string;
  initialKasBalance: number;
}

export interface ClassStats {
  totalKas: number;
  totalTabungan: number;
  totalStudents: number;
  thisWeekCollection: number;
}
