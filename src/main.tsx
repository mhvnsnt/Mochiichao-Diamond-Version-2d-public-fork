import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadStoredSettings } from './lib/gameSettings';
import { applyFonts } from './lib/fonts';

// Apply the saved Settings Font row before first paint, so a
// returning player's font choice is not lost on reload.
const _s = loadStoredSettings();
applyFonts(_s.mainFont, _s.dialogueFont);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
