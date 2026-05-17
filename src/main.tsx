import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// GLOBAL ERROR CAPTURE
window.onerror = function(message, source, lineno, colno, error) {
  console.error("GLOBAL_ERROR_DETECTED:", {
    message,
    source,
    lineno,
    colno,
    error: error?.message || error
  });
  return false;
};

window.onunhandledrejection = function(event) {
  console.error("UNHANDLED_REJECTION_DETECTED:", {
    reason: event.reason?.message || event.reason,
    stack: event.reason?.stack
  });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
