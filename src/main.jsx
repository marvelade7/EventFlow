import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './mobile.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// Unregister any existing service workers to prevent workbox warnings
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
