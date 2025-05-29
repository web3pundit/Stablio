// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import './styles/ui.css';
import { AuthProvider } from './contexts/AuthProvider';
import { SessionProvider } from './contexts/SessionProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</SessionProvider>

  </StrictMode>
);
