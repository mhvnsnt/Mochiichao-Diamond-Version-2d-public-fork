// CDP driver: phone 390x844 + reduced-motion verification of LIVE preset titles.
// Usage: node cdp_phone.mjs <phone|reduced> <preset-id|locked> <outprefix>
// Chrome is launched externally (CDP on 9223, fresh profile) — this script only drives it.
// Preset selection: localStorage key, the exact key Settings writes (setSelectedTitleStartScreenId);
// Settings-row navigation itself was already proven live on desktop, and is not re-proven here.
import { writeFileSync } from 'node:fs';

const MODE = process.argv[2] || 'phone';
const PRESET = process.argv[3] || 'title-snow-yogiferno';
const OUT = process.argv[4] || 'run';
const LIVE = process.env.PHONE_URL || 'https://mhvnsnt.github.io/Mochiichao-Diamond-Version-2d-fresh-start/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const logs = [];
const exceptions = [];

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
async function shot(name, clip) {
  const params = { format: 'png' };
  if (clip) params.clip = clip;
  const r = await send('Page.captureScreenshot', params);
  const data = r.result?.data;
  if (data) writeFileSync(`${OUT}-${name}.png`, Buffer.from(data, 'base64'));
  return !!data;
}
await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
if (MODE === 'reduced') {
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
}
console.log('mode:', MODE, 'reduced-motion emulated:', MODE === 'reduced');
console.log('matchMedia reduced-motion:', await ev(`matchMedia('(prefers-reduced-motion: reduce)').matches`));

async function stepToTitle(label) {
  for (let i = 0; i < 14; i++) {
    const txt = await ev(`document.body.innerText.slice(0, 400)`);
    console.log(`[${label} step ${i}] ${JSON.stringify(txt)}`);
    if (/PRESS ANY KEY/.test(txt) || /Preset failed to load/.test(txt)) return txt;
    const clicked = await ev(`[...document.querySelectorAll('button')].find(b => /NEXT SCENE|TO TITLE|SKIP|PRESS ANY KEY/.test(b.textContent))?.click(), 'clicked'`);
    await sleep(900);
    const txt2 = await ev(`document.body.innerText.slice(0, 400)`);
    if (txt2 === txt) {
      // No button progress: try a real Enter key via CDP Input.
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r' });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter' });
      await sleep(900);
    }
  }
  return await ev(`document.body.innerText.slice(0, 400)`);
}
async function geometry() {
  return await ev(`(() => {
    const rectOf = (el) => el ? {x: Math.round(el.getBoundingClientRect().x), y: Math.round(el.getBoundingClientRect().y), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height)} : null;
    const byText = (t) => [...document.querySelectorAll('button,div,span,p')].find(e => e.textContent && e.textContent.trim() === t) || [...document.querySelectorAll('button')].find(b => b.textContent.includes(t));
    const videos = [...document.querySelectorAll('video')].map(v => ({ rect: rectOf(v), readyState: v.readyState, error: v.error ? v.error.code : null, paused: v.paused }));
    const canvases = [...document.querySelectorAll('canvas')].map(c => rectOf(c));
    const imgs = [...document.querySelectorAll('img')].map(im => rectOf(im)).filter(Boolean);
    return JSON.stringify({
      innerW: window.innerWidth, innerH: window.innerHeight,
      scrollW: document.documentElement.scrollWidth, scrollH: document.documentElement.scrollHeight,
      bodyScrollW: document.body ? document.body.scrollWidth : null,
      pressKey: rectOf(byText('PRESS ANY KEY')),
      resetBtn: rectOf(byText('RESET TITLE')),
      fallbackNote: document.body.innerText.includes('Preset failed to load'),
      videos, canvases, imgCount: imgs.length, largestImg: imgs.sort((a,b) => b.w*b.h - a.w*a.h)[0] || null,
    });
  })()`);
}
async function canvasClip() {
  return await ev(`(() => { const c = document.querySelector('canvas'); if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, scale: 1 }; })()`);
}

await send('Page.navigate', { url: LIVE });
await sleep(5000);
let snap = await stepToTitle('locked');
console.log('--- TITLE locked (phone) ---');
console.log(snap);
console.log('--- geometry locked ---');
console.log(await geometry());
await shot('locked', null);

if (PRESET !== 'locked') {
  console.log('setting preset via localStorage (same key Settings writes):', PRESET);
  console.log(await ev(`try { localStorage.setItem('mochiichao_player_title_screen_preset', '${PRESET}'); 'set-ok' } catch (e) { 'LS-SET-ERR:' + e.message }`));
  await send('Page.reload');
  await sleep(5000);
  snap = await stepToTitle('preset');
  await sleep(3000);
  console.log(`--- TITLE preset ${PRESET} (${MODE}) ---`);
  console.log(await ev(`document.body.innerText.slice(0, 1200)`));
  console.log('--- geometry preset ---');
  console.log(await geometry());
  await shot('preset', null);
  // Motion check: canvas clip twice, 2.5s apart (TitleScene canvas; video is separate).
  const clip = await canvasClip();
  console.log('canvas clip:', JSON.stringify(clip));
  if (clip) {
    await shot('canvas-a', clip);
    await sleep(2500);
    await shot('canvas-b', clip);
    console.log('canvas screenshots saved for diff');
  }
  // Press advance: Enter should reach main menu.
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter' });
  await sleep(1500);
  console.log('--- after Enter (menu check) ---');
  console.log(await ev(`document.body.innerText.slice(0, 600)`));
}
console.log('--- console messages ---');
for (const l of logs) console.log(l);
console.log('--- exceptions ---');
for (const e of exceptions) console.log(e);
ws.close();
process.exit(0);
