// CDP driver: visual confirmation of PRESS ANY KEY removal (PR #285 build).
// Usage: node cdp_presskey.mjs <outdir>
// Chrome is launched externally (CDP on 9224, fresh profile, --allow-file-access-from-files).
// Serves the local dist of the EXACT live build via file:// (VM Chromium cannot load
// the live site over network). Preset selection via the same localStorage key Settings writes.
import { writeFileSync } from 'node:fs';

const OUT = process.argv[2] || '/home/hatch/workspace/presskey-repro';
const DIST = 'file:///home/hatch/workspace/mochiichao-work/pages-build/main-clone-preset/dist/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const logs = [];
const exceptions = [];

async function getWs() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch('http://localhost:9224/json/list');
      const j = await res.json();
      const page = (Array.isArray(j) ? j : []).find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(500);
  }
  throw new Error('CDP endpoint never came up');
}
const ws = new WebSocket(await getWs());
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
  if (msg.method === 'Log.entryAdded') logs.push(`[log.${msg.params.entry.level}] ${msg.params.entry.text}`);
};
function send(method, params = {}) {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve) => pending.set(id, { resolve }));
}
async function ev(expression) {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.result?.exceptionDetails) return 'EVAL-EXC: ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300);
  return r.result?.result?.value;
}
async function shot(name) {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  const data = r.result?.data;
  if (data) writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, 'base64'));
  return !!data;
}
async function pressEnter() {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter' });
}
async function stepToTitle(label) {
  for (let i = 0; i < 24; i++) {
    const txt = await ev(`document.body ? document.body.innerText.slice(0, 500) : ''`);
    if (typeof txt === 'string' && txt.includes('DIAMOND VERSION')) {
      console.log(`[${label}] title reached at step ${i}`);
      return txt;
    }
    await ev(`[...document.querySelectorAll('button')].find(b => /SKIP|NEXT|CONTINUE/.test(b.textContent))?.click()`);
    await pressEnter();
    await sleep(1000);
  }
  return await ev(`document.body ? document.body.innerText.slice(0, 500) : ''`);
}
async function probe() {
  return await ev(`(() => {
    const txt = document.body ? document.body.innerText : '';
    const exact = [...document.querySelectorAll('body *')].filter(e => e.children.length === 0 && e.textContent.trim() === 'PRESS ANY KEY').map(e => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return { tag: e.tagName, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), display: cs.display, visibility: cs.visibility, opacity: cs.opacity };
    });
    const videos = [...document.querySelectorAll('video')].map(v => ({ readyState: v.readyState, error: v.error ? v.error.code : null, paused: v.paused, src: (v.currentSrc || v.src || '').split('/').pop() }));
    const imgs = [...document.querySelectorAll('img')].map(im => im.alt || '').filter(Boolean);
    return JSON.stringify({
      innerText: txt.slice(0, 1200),
      hasPressAnyKeyText: txt.includes('PRESS ANY KEY'),
      hasPressStartText: txt.includes('PRESS START'),
      exactPressAnyKeyElements: exact,
      fallbackNote: txt.includes('Preset failed to load'),
      resetBtn: [...document.querySelectorAll('button')].some(b => b.textContent.includes('RESET TITLE')),
      videos, imgAlts: imgs,
    });
  })()`);
}

await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });

console.log('navigating:', DIST);
await send('Page.navigate', { url: DIST });
await sleep(4000);
await stepToTitle('locked');
await sleep(2500);
console.log('--- LOCKED probe ---');
console.log(await probe());
console.log('locked screenshot:', await shot('locked-no-presskey'));

console.log('setting snow preset via localStorage...');
console.log('set:', await ev(`try { localStorage.setItem('mochiichao_player_title_screen_preset', 'title-snow-yogiferno'); 'set-ok:' + localStorage.getItem('mochiichao_player_title_screen_preset') } catch (e) { 'LS-ERR:' + e.message }`));
await send('Page.reload');
await sleep(4000);
const afterReloadKey = await ev(`try { localStorage.getItem('mochiichao_player_title_screen_preset') } catch (e) { 'LS-ERR:' + e.message }`);
console.log('key after reload:', afterReloadKey);
if (afterReloadKey !== 'title-snow-yogiferno') {
  console.log('localStorage did not persist across file:// reload; injecting on new document and reloading');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('mochiichao_player_title_screen_preset', 'title-snow-yogiferno'); } catch (e) {}` });
  await send('Page.reload');
  await sleep(4000);
  console.log('key after injected reload:', await ev(`try { localStorage.getItem('mochiichao_player_title_screen_preset') } catch (e) { 'LS-ERR:' + e.message }`));
}
await stepToTitle('snow');
await sleep(4000);
console.log('--- SNOW probe ---');
console.log(await probe());
console.log('snow screenshot:', await shot('snow-no-presskey'));
await pressEnter();
await sleep(1500);
console.log('--- after Enter on snow title ---');
console.log(await ev(`document.body ? document.body.innerText.slice(0, 600) : ''`));

console.log('--- console messages ---');
for (const l of logs) console.log(l);
console.log('--- exceptions ---');
for (const e of exceptions) console.log(e);
ws.close();
process.exit(0);
