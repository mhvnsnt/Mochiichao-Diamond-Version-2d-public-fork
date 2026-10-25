import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadStoredSettings } from './lib/gameSettings';
import { applyFontRoles } from './lib/fonts';

// Apply the saved Settings Font row before first paint, so a
// returning player's font choice is not lost on reload.
applyFontRoles(loadStoredSettings());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
