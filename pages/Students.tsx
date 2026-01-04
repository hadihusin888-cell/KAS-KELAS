
import React, { useState, useMemo } from 'react';
import { Student } from '../types';

interface StudentsProps {
  students: Student[];
  onAdd: (s: Omit<Student, 'id'>) => void;
  onUpdate: (s: Student) => void;
  onDelete: (id: string) => void;
}

const Students: React.FC<StudentsProps> = ({ students, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({ name: '', nis: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.nis.includes(searchTerm)
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [students, searchTerm]);

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({ name: '', nis: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({ name: student.name, nis: student.nis });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.nis.trim()) {
      alert("Nama dan NIS wajib diisi.");
      return;
    }

    if (editingStudent) {
      onUpdate({ ...editingStudent, ...formData });
    } else {
      onAdd({ ...formData });
    }
    
    setIsModalOpen(false);
    setFormData({ name: '', nis: '' });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Data Siswa</h1>
          <p className="text-slate-500">Kelola informasi anggota kelas secara rutin.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Tambah Siswa</span>
        </button>
      </header>

      {/* Search & Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="Cari nama atau NIS siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm outline-none"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <span className="text-slate-500 text-sm font-medium">Total Terdaftar</span>
          <span className="text-2xl font-black text-indigo-600">{students.length}</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest text-left">
                <th className="px-6 py-4">Informasi Siswa</th>
                <th className="px-6 py-4">NIS</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm uppercase">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{student.nis}</code>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 tracking-wider">Aktif</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-1">
                      <button 
                        onClick={() => openEditModal(student)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Edit Data"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => onDelete(student.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Hapus"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-slate-400 italic">Tidak ada siswa ditemukan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-slideUp my-auto">
            <div className="bg-indigo-600 p-8 text-white relative">
              <h3 className="text-2xl font-black">{editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
              <p className="text-indigo-100 text-sm mt-1">Pastikan data NIS sudah benar.</p>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 p-2 bg-indigo-500/50 hover:bg-indigo-500 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-800"
                  placeholder="Masukkan nama lengkap..."
                  autoFocus
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">NIS (Nomor Induk)</label>
                <input
                  type="text"
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-mono text-slate-800"
                  placeholder="Contoh: 1001"
                  required
                />
              </div>
              
              <div className="pt-4 flex flex-col space-y-3">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Daftarkan Siswa'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition-all"
                >
                  Batalkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
