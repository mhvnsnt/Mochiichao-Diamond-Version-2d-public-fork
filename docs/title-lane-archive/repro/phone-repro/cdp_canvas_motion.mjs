// Isolate TitleScene canvas motion: pause all <video> elements, then screenshot
// the canvas region twice 2.5s apart. Any remaining diff is canvas motion only.
// Usage: node cdp_canvas_motion.mjs <reduced|normal> <preset-id> <outprefix>
import { writeFileSync } from 'node:fs';
const MODE = process.argv[2] || 'normal';
const PRESET = process.argv[3] || 'title-snow-yogiferno';
const OUT = process.argv[4] || 'motion';
const URL = process.env.PHONE_URL || 'file:///home/hatch/workspace/mochiichao-work/pages-build/main-clone-preset/dist/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getWs() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:9223/json/list');
      const j = await res.json();
      const page = (Array.isArray(j) ? j : []).find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* noop */ }
    await sleep(500);
  }
  throw new Error('CDP endpoint never came up');
}
const ws = new WebSocket(await getWs());
await new Promise((r) => { ws.onopen = r; });
let seq = 0; const pending = new Map();
ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } };
function send(method, params = {}) { const id = ++seq; ws.send(JSON.stringify({ id, method, params })); return new Promise((r) => pending.set(id, r)); }
async function ev(expression) { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); return r.result?.result?.value; }
async function shot(name, clip) { const r = await send('Page.captureScreenshot', { format: 'png', clip }); if (r.result?.data) writeFileSync(`${OUT}-${name}.png`, Buffer.from(r.result.data, 'base64')); }
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
if (MODE === 'reduced') await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
console.log('mode:', MODE, 'reduced-motion:', await ev(`matchMedia('(prefers-reduced-motion: reduce)').matches`));
await ev(`try { localStorage.setItem('mochiichao_player_title_screen_preset', '${PRESET}'); 'set-ok' } catch (e) { 'ERR:' + e.message }`);
await send('Page.navigate', { url: URL });
await sleep(5000);
for (let i = 0; i < 14; i++) {
  const txt = await ev(`document.body.innerText.slice(0, 300)`);
  if (/PRESS ANY KEY/.test(txt) || /Preset failed to load/.test(txt)) { console.log('at title:', JSON.stringify(txt)); break; }
  await ev(`[...document.querySelectorAll('button')].find(b => /NEXT SCENE|TO TITLE/.test(b.textContent))?.click()`);
  await sleep(900);
}
await sleep(3000);
console.log('videos before pause:', await ev(`[...document.querySelectorAll('video')].map(v => ({paused: v.paused, readyState: v.readyState}))`));
console.log('pause result:', await ev(`[...document.querySelectorAll('video')].forEach(v => v.pause()), document.querySelectorAll('video').length`));
await sleep(500);
const clip = await ev(`(() => { const c = document.querySelector('canvas'); if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, scale: 1 }; })()`);
console.log('canvas clip:', JSON.stringify(clip));
if (clip) { await shot('a', clip); await sleep(2500); await shot('b', clip); console.log('shots saved'); }
ws.close(); process.exit(0);
