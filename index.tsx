
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');

if (!container) {
    throw new Error("Root element not found");
}

try {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} catch (err) {
    console.error("Render Error:", err);
    container.innerHTML = `<div style="padding:20px; color:red;">Gagal merender aplikasi. Silakan cek konsol browser.</div>`;
}
