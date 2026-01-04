
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');

if (!container) {
    throw new Error("Root element 'root' tidak ditemukan di DOM.");
}

try {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} catch (err) {
    console.error("Gagal melakukan render aplikasi:", err);
    container.innerHTML = `
        <div style="padding:40px; text-align:center;">
            <h2 style="color:red;">Render Error</h2>
            <p>Aplikasi gagal dijalankan. Silakan cek konsol developer untuk detailnya.</p>
        </div>
    `;
}
