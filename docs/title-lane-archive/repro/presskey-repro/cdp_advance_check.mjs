// Follow-up: try click + Enter + Space advance from the snow preset title.
import { writeFileSync } from 'node:fs';
const OUT = '/home/hatch/workspace/presskey-repro';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getWs() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:9224/json/list');
      const j = await res.json();
      const page = (Array.isArray(j) ? j : []).find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch { await sleep(500); }
  }
  throw new Error('CDP endpoint never came up');
}
const ws = new WebSocket(await getWs());
await new Promise((r) => { ws.onopen = r; });
let seq = 0; const pending = new Map();
ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id).resolve(msg); pending.delete(msg.id); } };
function send(method, params = {}) { const id = ++seq; ws.send(JSON.stringify({ id, method, params })); return new Promise((resolve) => pending.set(id, { resolve })); }
async function ev(e) { const r = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); return r.result?.result?.value; }
async function shot(name) { const r = await send('Page.captureScreenshot', { format: 'png' }); if (r.result?.data) writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.result.data, 'base64')); return !!r.result?.data; }
async function key(k, code, text) {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, text, unmodifiedText: text });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code });
}
await send('Page.enable'); await send('Runtime.enable');
console.log('before:', await ev(`document.body.innerText.slice(0, 300)`));
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 640, y: 400, button: 'left', clickCount: 1 });
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 640, y: 400, button: 'left', clickCount: 1 });
await sleep(1500);
console.log('after click:', await ev(`document.body.innerText.slice(0, 300)`));
await key('Enter', 'Enter', '\r'); await sleep(1500);
console.log('after Enter:', await ev(`document.body.innerText.slice(0, 300)`));
await key(' ', 'Space', ' '); await sleep(1500);
console.log('after Space:', await ev(`document.body.innerText.slice(0, 300)`));
console.log('screenshot:', await shot('snow-after-advance-attempt'));
ws.close(); process.exit(0);
