#!/usr/bin/env python3
"""Moving render of the Section O menu tree: capture real frames via CDP, then
assemble 80 frames x 70ms = 5.6s seamless loop GIF (390x844, seeded, all 4 slots).
Frames are real browser captures at real motion phases (nearest captured frame to
each 70ms phase step); no bouncing/scaling of a still, no synthetic motion.
"""
import json, os, subprocess, sys, time, urllib.request

DIST = '/home/hatch/workspace/mochiichao-work/section-o-pr/dist'
FRAMES_DIR = '/home/hatch/workspace/mochiichao-work/ui-art/menu-moving-sectiono-frames-20261026'
OUT_GIF = '/home/hatch/workspace/mochiichao-work/ui-art/menu-moving-sectiono-20261026.gif'
OUT_JSON = '/home/hatch/workspace/mochiichao-work/ui-art/menu-moving-sectiono-20261026.json'
N_CAPTURE = 220
PORT = 9224
os.makedirs(FRAMES_DIR, exist_ok=True)

chrome = subprocess.Popen(['/opt/meta-chromium/chrome', '--headless=new', '--no-sandbox',
                           '--disable-gpu', '--disable-dev-shm-usage', '--allow-file-access-from-files',
                           '--window-size=390,844', f'--remote-debugging-port={PORT}',
                           '--user-data-dir=/tmp/chrome-mm3', 'about:blank'],
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    listening = False
    for _ in range(60):
        try:
            urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json/list', timeout=2); listening = True; break
        except Exception:
            time.sleep(1)
    if not listening:
        raise RuntimeError('chrome never started listening on port %d' % PORT)
    driver = r'''
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const res = await fetch('http://127.0.0.1:PORT_PLACEHOLDER/json/list');
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
  await send('Page.navigate', {url: 'file:///home/hatch/workspace/mochiichao-work/section-o-pr/dist/index.html'});
  await sleep(2500);
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', {expression: expr, returnByValue: true});
    return r.result && r.result.result ? r.result.result.value : null;
  };
  for (let i = 0; i < 10; i++) {
    const done = await ev(`!![...document.querySelectorAll('button')].find(b => /NEW GAME/.test(b.innerText))`);
    if (done) break;
    const clicked = await ev(`!![...document.querySelectorAll('button')].find(b => /NEXT SCENE|TO TITLE/i.test(b.innerText))?.click()`);
    await sleep(900);
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
  }
  const onMenu = await ev(`!![...document.querySelectorAll('button')].find(b => /NEW GAME/.test(b.innerText))`);
  console.log('ON_MENU', onMenu);
  const fs = require('fs');
  const stamps = [];
  for (let i = 0; i < N_PLACEHOLDER; i++) {
    const t0 = Date.now();
    const shot = await send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: false});
    fs.writeFileSync(process.env.FRAMES_DIR + '/frame-' + String(i).padStart(3, '0') + '.png', Buffer.from(shot.result.data, 'base64'));
    stamps.push(Date.now() - t0);
    if (i % 20 === 0) console.log('captured', i);
  }
  console.log('STAMPS', JSON.stringify(stamps));
  process.exit(0);
})();
'''.replace('PORT_PLACEHOLDER', str(PORT)).replace('N_PLACEHOLDER', str(N_CAPTURE))
    env = dict(os.environ, FRAMES_DIR=FRAMES_DIR)
    r = subprocess.run(['node', '-e', driver], env=env, capture_output=True, text=True, timeout=600)
    print(r.stdout[-2000:])
    print(r.stderr[-1000:], file=sys.stderr)
finally:
    chrome.terminate()
    try: chrome.wait(timeout=10)
    except Exception: chrome.kill()
print('frames dir:', FRAMES_DIR, 'count:', len([f for f in os.listdir(FRAMES_DIR) if f.endswith('.png')]))
