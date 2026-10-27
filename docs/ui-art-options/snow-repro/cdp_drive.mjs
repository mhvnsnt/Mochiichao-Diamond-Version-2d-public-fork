// CDP driver: reproduce the Snow preset title in a REAL Chromium on the VM.
// Usage: node cdp_drive.mjs <preset-id|locked>
// Logs: console messages, exceptions, and DOM snapshots to stdout.
import { spawn } from 'node:child_process';

const PRESET = process.argv[2] || 'title-snow-yogiferno';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const logs = [];
const exceptions = [];

// Chrome is launched externally (CDP on 9223) — this script only drives it.
// (Spawning from inside node raced the profile lock on the first attempt.)

async function getWs() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:9223/json/list');
      const j = await res.json();
      const page = (Array.isArray(j) ? j : []).find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(500);
  }
  throw new Error('CDP endpoint never came up');
}

const wsUrl = await getWs();
const ws = new WebSocket(wsUrl);
await new Promise((r) => { ws.onopen = r; });
let seq = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) { const { resolve } = pending.get(msg.id); pending.delete(msg.id); resolve(msg); }
  if (msg.method === 'Runtime.consoleAPICalled') {
    const args = (msg.params.args || []).map((a) => a.value ?? a.description ?? a.type).join(' ');
    logs.push(`[console.${msg.params.type}] ${args}`);
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    exceptions.push(msg.params.exceptionDetails?.exception?.description || JSON.stringify(msg.params.exceptionDetails).slice(0, 500));
  }
  if (msg.method === 'Log.entryAdded') {
    logs.push(`[log.${msg.params.entry.level}] ${msg.params.entry.text}`);
  }
};
function send(method, params = {}) {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve) => pending.set(id, { resolve }));
}
async function ev(expression) {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return r.result?.result?.value;
}
await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
async function stepToTitle(label) {
  // Click the NEXT SCENE / TO TITLE button (fresh render closure).
  // Keyboard stepping is AVOIDED here: the window keydown handler
  // closes over a stale introScene (effect deps omit it), so key
  // presses can push introScene past 3 and crash the whole tree
  // (scenes[4].title throws) — that is a separate real bug, found
  // by this harness, not the Snow preset bug.
  for (let i = 0; i < 10; i++) {
    const txt = await ev(`document.body.innerText.slice(0, 300)`);
    console.log(`[${label} step ${i}] ${JSON.stringify(txt)}`);
    if (/PRESS ANY KEY/.test(txt) || /Preset failed to load/.test(txt)) return txt;
    if (process.env.KEYSTEP === '1') {
      await ev(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); 'pressed'`);
    } else {
      const clicked = await ev(`[...document.querySelectorAll('button')].find(b => /NEXT SCENE|TO TITLE/.test(b.textContent))?.click(), 'clicked'`);
    }
    await sleep(800);
  }
  return await ev(`document.body.innerText.slice(0, 300)`);
}
const DIST = process.env.SNOW_DIST || '/home/hatch/workspace/mochiichao-work/pages-build/main-clone-preset/dist';
await send('Page.navigate', { url: 'file://' + DIST + '/index.html' });
await sleep(4000); // boot (2.5s) -> INTRO
let snap = await stepToTitle('locked');
console.log('--- TITLE (locked, before preset) ---');
console.log(snap);
console.log('--- localStorage before ---');
console.log(await ev(`try { localStorage.getItem('mochiichao_player_title_screen_preset') } catch (e) { 'LS-ERR:' + e.message }`));

if (PRESET !== 'locked') {
  await ev(`try { localStorage.setItem('mochiichao_player_title_screen_preset', '${PRESET}'); 'set-ok' } catch (e) { 'LS-SET-ERR:' + e.message }`);
  await send('Page.reload');
  await sleep(4000);
  snap = await stepToTitle('preset');
  await sleep(3000); // video load + TitleScene mount
  snap = await ev(`document.body.innerText.slice(0, 1200)`);
  console.log(`--- TITLE (preset ${PRESET}) ---`);
  console.log(snap);
  console.log('--- DOM probes ---');
  console.log('fallback note present:', await ev(`document.body.innerText.includes('Preset failed to load')`));
  console.log('RESET TITLE button present:', await ev(`!![...document.querySelectorAll('button')].find(b => b.textContent.includes('RESET TITLE'))`));
  console.log('video elements:', await ev(`document.querySelectorAll('video').length`));
  console.log('video src:', await ev(`[...document.querySelectorAll('video')].map(v => (v.currentSrc || v.src || '').slice(-60))`));
  console.log('video readyState:', await ev(`[...document.querySelectorAll('video')].map(v => v.readyState)`));
  console.log('video error:', await ev(`[...document.querySelectorAll('video')].map(v => v.error ? v.error.code : null)`));
  console.log('canvas elements:', await ev(`document.querySelectorAll('canvas').length`));
  console.log('img count:', await ev(`document.querySelectorAll('img').length`));
}
console.log('--- console messages ---');
for (const l of logs) console.log(l);
console.log('--- exceptions ---');
for (const e of exceptions) console.log(e);
ws.close();
process.exit(0);
