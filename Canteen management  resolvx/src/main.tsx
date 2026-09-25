import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CanteenProvider } from './context/CanteenContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CanteenProvider>
      <App />
    </CanteenProvider>
  </React.StrictMode>
);
