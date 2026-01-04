
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Kesalahan saat merender aplikasi:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h2>Gagal Memuat Aplikasi</h2>
      <p>Terjadi kesalahan teknis. Silakan coba segarkan halaman.</p>
      <button onclick="location.reload()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Segarkan Halaman
      </button>
    </div>
  `;
}
