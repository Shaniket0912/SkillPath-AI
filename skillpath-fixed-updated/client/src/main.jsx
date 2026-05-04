// Set background IMMEDIATELY — before anything renders — prevents flicker
document.documentElement.style.cssText = 'background:#0a0f1e!important';
document.body.style.cssText = 'background:#0a0f1e!important';

import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
