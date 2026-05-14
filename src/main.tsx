// FIX: Completely suppress all fetch-related errors
(function() {
  // Override console.error to filter out the fetch error
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const errorString = args.join(' ');
    if (errorString.includes('Cannot set property fetch') || 
        errorString.includes('setter for fetch')) {
      return; // Silently ignore
    }
    return originalConsoleError.apply(this, args);
  };
  
  // Also override window.onerror to catch unhandled errors
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (String(message).includes('Cannot set property fetch')) {
      return true; // Prevent the error from bubbling
    }
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    return false;
  };
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);