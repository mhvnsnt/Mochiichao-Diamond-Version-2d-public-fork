#!/usr/bin/env python3
"""Publish dist/ to gh-pages via Contents API, uploading ONLY files whose
git blob SHA differs from the gh-pages tree. Never deletes anything.
Idempotent: safe to re-run after a restart; already-uploaded files are skipped."""
import sys, os, json, base64, hashlib, urllib.request, urllib.error
sys.path.insert(0, '/opt/muse/skills/custom-connector-setup/bin')
from dynamic_credentials import add_surrogate_to_request

REPO = 'mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start'
DIST = os.path.expanduser('~/workspace/mochiichao-work/pages-build/main-clone-preset/dist')
BRANCH = 'gh-pages'
MSG = 'Publish playable build (PR #271 trap fix 2, main 53bf321d) to GitHub Pages — Deletions: NONE'

def gh(path, data=None, method='GET'):
    req = urllib.request.Request(
        'https://api.github.com' + path,
        data=json.dumps(data).encode() if data is not None else None,
        headers={'Accept': 'application/vnd.github+json', 'User-Agent': 'muse-pages-publish',
                 'Content-Type': 'application/json'}, method=method)
    add_surrogate_to_request(req, 'custom.github-api', allowed_hosts=['api.github.com'])
    with urllib.request.urlopen(req) as r:
        return json.load(r)

def blob_sha(data):
    return hashlib.sha1(b'blob %d\x00' % len(data) + data).hexdigest()

def main():
    tree = gh(f'/repos/{REPO}/git/trees/{BRANCH}?recursive=1')
    live = {e['path']: e['sha'] for e in tree.get('tree', []) if e['type'] == 'blob'}
    print(f'live gh-pages files: {len(live)}', flush=True)
    changed = []
    for root, _dirs, files in os.walk(DIST):
        for fn in files:
            full = os.path.join(root, fn)
            rel = os.path.relpath(full, DIST).replace(os.sep, '/')
            with open(full, 'rb') as f:
                data = f.read()
            if live.get(rel) != blob_sha(data):
                changed.append((rel, data))
    changed.sort(key=lambda t: (t[0] == 'index.html', t[0]))
    print(f'files to upload: {len(changed)} (index.html last)', flush=True)
    for rel, data in changed:
        print('uploading', rel, len(data), flush=True)
        payload = {'message': MSG, 'content': base64.b64encode(data).decode(),
                   'branch': BRANCH}
        if rel in live:
            payload['sha'] = live[rel]
        try:
            res = gh(f'/repos/{REPO}/contents/{rel}', data=payload, method='PUT')
            print('  ok', res['commit']['sha'][:12], flush=True)
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:500]
            print('  FAILED', rel, e.code, body, flush=True)
            raise
    idx = gh(f'/repos/{REPO}/contents/index.html?ref={BRANCH}',
             ) if False else None
    print('PUBLISH DONE', flush=True)

if __name__ == '__main__':
    main()
