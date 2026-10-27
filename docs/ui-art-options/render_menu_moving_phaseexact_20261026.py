#!/usr/bin/env python3
"""Phase-exact moving render of the Section O menu tree.

Technique (honest, real app rendering): before page scripts run, override
performance.now() and requestAnimationFrame timestamps with a script-controlled
clock (window.__vt, ms). The menu's own MainMenuBackground loop computes
dt from those timestamps, so t advances exactly 70ms per capture step and the
browser renders the REAL app code at exact phases. No synthetic motion, no
interpolation, no bouncing/scaling of a still. Cloud/Mochii CSS bob still runs
on wall clock (noted in the report); the symbol field is phase-exact.
"""
import os, subprocess, sys, time, urllib.request

FRAMES_DIR = '/home/hatch/workspace/mochiichao-work/ui-art/menu-moving-sectiono-vtframes-20261026'
PORT = 9224
os.makedirs(FRAMES_DIR, exist_ok=True)

chrome = subprocess.Popen(['/opt/meta-chromium/chrome', '--headless=new', '--no-sandbox',
                           '--disable-gpu', '--disable-dev-shm-usage', '--allow-file-access-from-files',
                           '--window-size=390,844', f'--remote-debugging-port={PORT}',
                           '--user-data-dir=/tmp/chrome-vt2', 'about:blank'],
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    listening = False
    for _ in range(60):
        try:
            urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json/list', timeout=2); listening = True; break
        except Exception:
            time.sleep(1)
    if not listening:
        raise RuntimeError('chrome never started listening')
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
  await send('Page.addScriptToEvaluateOnNewDocument', {source: `
    window.__vt = 0;
    try {
      const _raf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => _raf(() => cb(window.__vt));
      performance.now = () => window.__vt;
    } catch(e) {}
  `});
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
  for (let i = 0; i < 80; i++) {
    await ev(`window.__vt = ${i * 70}`);
    await sleep(200);
    const shot = await send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: false});
    fs.writeFileSync(process.env.FRAMES_DIR + '/frame-' + String(i).padStart(3, '0') + '.png', Buffer.from(shot.result.data, 'base64'));
    if (i % 10 === 0) console.log('phase frame', i, 'vt', i * 70);
  }
  process.exit(0);
})();
'''.replace('PORT_PLACEHOLDER', str(PORT))
    env = dict(os.environ, FRAMES_DIR=FRAMES_DIR)
    r = subprocess.run(['node', '-e', driver], env=env, capture_output=True, text=True, timeout=900)
    print(r.stdout[-2000:])
    print(r.stderr[-1000:], file=sys.stderr)
finally:
    chrome.terminate()
    try: chrome.wait(timeout=10)
    except Exception: chrome.kill()
print('frames:', len([f for f in os.listdir(FRAMES_DIR) if f.endswith('.png')]))
