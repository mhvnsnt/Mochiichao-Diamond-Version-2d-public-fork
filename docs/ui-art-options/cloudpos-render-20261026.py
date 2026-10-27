#!/usr/bin/env python3
"""Cloud-position renders (2026-10-26): phone + full-stage + moving frames.
Adapted from the proven cloudswap-render.py CDP route (file:// load).
Usage: cloudpos_render.py DIST_DIR OUT_PREFIX WIDTH HEIGHT MODE
  MODE = phone | stage | stage-frozen | moving
  moving: captures 28 frames x 200ms into OUT_PREFIX-frames/ + OUT_PREFIX-moving.gif
"""
import json, os, subprocess, sys, time, urllib.request

DIST, OUT, W, H, MODE = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
chrome = subprocess.Popen(['/opt/meta-chromium/chrome', '--headless=new', '--no-sandbox',
                           '--disable-gpu', '--disable-dev-shm-usage', '--allow-file-access-from-files',
                           f'--window-size={W},{H}', '--remote-debugging-port=9225',
                           f'--user-data-dir=/tmp/chrome-cloudpos-{MODE}-{W}x{H}',
                           'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for _ in range(30):
    try:
        urllib.request.urlopen('http://127.0.0.1:9225/json/list', timeout=2)
        break
    except Exception:
        time.sleep(1)

driver = r'''
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const res = await fetch('http://127.0.0.1:9225/json/list');
  const pages = await res.json();
  const ws = new WebSocket(pages[0].webSocketDebuggerUrl);
  let id = 0; const pend = {};
  ws.onmessage = m => { const o = JSON.parse(m.data); if (o.id && pend[o.id]) { pend[o.id](o); delete pend[o.id]; } };
  await new Promise(r => ws.onopen = r);
  const send = (method, params={}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({id: i, method, params})); });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {width: process.env.W, height: process.env.H, deviceScaleFactor: 1, mobile: true});
  const seed = JSON.stringify([{id: 'seed1', slotId: 1, timestamp: 1761500000000, type: 'manual', label: 'Seed', data: {playerName: 'Mars', currentMap: 'Core Fragment', badges: []}}]);
  await send('Page.addScriptToEvaluateOnNewDocument', {source: `try { localStorage.setItem('mochii_saves_1', ${JSON.stringify(seed)}); } catch(e) {}`});
  await send('Page.navigate', {url: 'file://' + process.env.DIST + '/index.html'});
  await sleep(2500);
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', {expression: expr, returnByValue: true});
    return r.result && r.result.result ? r.result.result.value : null;
  };
  for (let i = 0; i < 10; i++) {
    const done = await ev(`!![...document.querySelectorAll('button')].find(b => /NEW GAME/.test(b.innerText))`);
    if (done) break;
    await ev(`[...document.querySelectorAll('button')].find(b => /NEXT SCENE|TO TITLE/i.test(b.innerText))?.click()`);
    await sleep(900);
  }
  for (let i = 0; i < 5; i++) {
    const onMenu = await ev(`!![...document.querySelectorAll('button')].find(b => /NEW GAME/.test(b.innerText))`);
    if (onMenu) break;
    const clicked = await ev(`[...document.querySelectorAll('button')].find(b => /PRESS|START|TO TITLE/i.test(b.innerText))?.click()`);
    if (!clicked) {
      await send('Input.dispatchKeyEvent', {type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r'});
      await send('Input.dispatchKeyEvent', {type: 'keyUp', key: 'Enter', code: 'Enter'});
    }
    await sleep(1500);
  }
  const onMenu = await ev(`!![...document.querySelectorAll('button')].find(b => /NEW GAME/.test(b.innerText))`);
  console.log('ONMENU', onMenu);
  const meas = await ev(`(() => {
    const qs = s => [...document.querySelectorAll(s)];
    const box = el => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
    const btns = {};
    qs('button').forEach(b => { const t = b.innerText.trim().split('\n')[0]; if (t) btns[t] = box(b); });
    const imgs = qs('img').map(el => ({box: box(el), src: (el.getAttribute('src')||'').slice(0,60), alt: el.getAttribute('alt')||''}));
    return {buttons: btns, imgs, svgGroups: qs('svg g').length};
  })()`);
  console.log('MEAS', JSON.stringify(meas));
  const fs = require('fs');
  if (process.env.MODE === 'stage-frozen') {
    await send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-reduced-motion', value: 'reduce'}]});
    await sleep(600);
  }
  if (process.env.MODE === 'moving') {
    fs.mkdirSync(process.env.OUT + '-frames', {recursive: true});
    for (let f = 0; f < 28; f++) {
      const shot = await send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: false});
      fs.writeFileSync(process.env.OUT + '-frames/f' + String(f).padStart(2, '0') + '.png', Buffer.from(shot.result.data, 'base64'));
      await sleep(200);
    }
  } else {
    const shot = await send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: false});
    fs.writeFileSync(process.env.OUT + '.png', Buffer.from(shot.result.data, 'base64'));
  }
  process.exit(0);
})();
'''
env = dict(os.environ, DIST=DIST, OUT=OUT, W=str(W), H=str(H), MODE=MODE)
r = subprocess.run(['node', '-e', driver], env=env, capture_output=True, text=True, timeout=300)
print(r.stdout[-2500:])
print(r.stderr[-800:], file=sys.stderr)
chrome.terminate()
if MODE == 'moving':
    from PIL import Image
    import glob
    files = sorted(glob.glob(OUT + '-frames/f*.png'))
    imgs = [Image.open(f).convert('RGB') for f in files]
    imgs[0].save(OUT + '-moving.gif', save_all=True, append_images=imgs[1:], duration=200, loop=0)
    print('moving gif frames:', len(files), '->', OUT + '-moving.gif')
print('done', OUT, MODE)
