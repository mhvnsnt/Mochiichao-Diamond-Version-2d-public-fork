#!/usr/bin/env python3
"""Headless phone render of the cloud-swap build (390x844), seeded so all 4 slots show.
Adapted from the proven round2 render_phone.py CDP route (file:// load)."""
import json, subprocess, sys, time, urllib.request, os, shutil
DIST = '/home/hatch/workspace/mochiichao-work/cloud-swap-tree/dist'
OUT_PNG = '/home/hatch/workspace/mochiichao-work/ui-art/perfect-menu-render-cloudswap-seeded-20261026.png'
OUT_JSON = '/home/hatch/workspace/mochiichao-work/ui-art/cloudswap-measure-20261026.json'
chrome = subprocess.Popen(['/opt/meta-chromium/chrome', '--headless=new', '--no-sandbox',
                           '--disable-gpu', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--window-size=390,844',
                           '--remote-debugging-port=9224', '--user-data-dir=/tmp/chrome-cloudswap',
                           'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for _ in range(30):
    try:
        urllib.request.urlopen('http://127.0.0.1:9224/json/list', timeout=2); break
    except Exception:
        time.sleep(1)
driver = r'''
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const res = await fetch('http://127.0.0.1:9224/json/list');
  const pages = await res.json();
  const ws = new WebSocket(pages[0].webSocketDebuggerUrl);
  let id = 0; const pend = {};
  ws.onmessage = m => { const o = JSON.parse(m.data); if (o.id && pend[o.id]) { pend[o.id](o); delete pend[o.id]; } };
  await new Promise(r => ws.onopen = r);
  const send = (method, params={}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({id: i, method, params})); });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: true});
  const seed = JSON.stringify([{id: 'seed1', slotId: 1, timestamp: 1761500000000, type: 'manual', label: 'Seed', data: {playerName: 'Mars', currentMap: 'Core Fragment', badges: []}}]);
  await send('Page.addScriptToEvaluateOnNewDocument', {source: `try { localStorage.setItem('mochii_saves_1', ${JSON.stringify(seed)}); } catch(e) {}`});
  await send('Page.navigate', {url: 'file:///home/hatch/workspace/mochiichao-work/cloud-swap-tree/dist/index.html'});
  await sleep(2500);
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', {expression: expr, returnByValue: true});
    return r.result && r.result.result ? r.result.result.value : null;
  };
  const dump = async (label) => {
    const t = await ev(`document.body.innerText.slice(0,400).replace(/\n/g,' | ')`);
    console.log(label, '::', t);
  };
  await dump('boot');
  for (let i = 0; i < 10; i++) {
    const done = await ev(`!![...document.querySelectorAll('button')].find(b => /NEW GAME/.test(b.innerText))`);
    if (done) break;
    const clicked = await ev(`!![...document.querySelectorAll('button')].find(b => /NEXT SCENE|TO TITLE/i.test(b.innerText))?.click()`);
    await sleep(900);
    await dump('click' + i + (clicked ? '' : ' (no scene btn)'));
    if (!clicked) break;
  }
  for (let i = 0; i < 5; i++) {
    const onMenu = await ev(`!![...document.querySelectorAll('button')].find(b => /NEW GAME/.test(b.innerText))`);
    if (onMenu) break;
    const clicked = await ev(`!![...document.querySelectorAll('button')].find(b => /PRESS|START|TO TITLE/i.test(b.innerText))?.click()`);
    if (!clicked) {
      await send('Input.dispatchKeyEvent', {type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r'});
      await send('Input.dispatchKeyEvent', {type: 'keyUp', key: 'Enter', code: 'Enter'});
    }
    await sleep(1500);
    await dump('title' + i);
  }
  await dump('menu');
  await sleep(100);
  const shot = await send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: false});
  require('fs').writeFileSync(process.env.OUT_PNG, Buffer.from(shot.result.data, 'base64'));
  const meas = await ev(`(() => {
    const qs = s => [...document.querySelectorAll(s)];
    const box = el => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
    const btns = {};
    qs('button').forEach(b => { const t = b.innerText.trim().split('\\n')[0]; if (t) btns[t] = box(b); });
    const imgs = qs('img').map(el => ({box: box(el), src: (el.getAttribute('src')||'').slice(0,80), alt: el.getAttribute('alt')||''}));
    return {buttons: btns, imgs, svgGroups: qs('svg g').length};
  })()`);
  console.log('MEAS', JSON.stringify(meas));
  process.exit(0);
})();
'''
env = dict(os.environ, OUT_PNG=OUT_PNG)
r = subprocess.run(['node', '-e', driver], env=env, capture_output=True, text=True, timeout=240)
print(r.stdout[-3000:])
print(r.stderr[-1000:], file=sys.stderr)
chrome.terminate()
json.dump({'png': OUT_PNG, 'log': r.stdout}, open(OUT_JSON, 'w'), indent=1)
print('wrote', OUT_PNG, OUT_JSON)
