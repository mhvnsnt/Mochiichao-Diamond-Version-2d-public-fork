#!/usr/bin/env python3
"""BATCH-E PIPELINE-V2 REWORK, EYES ONLY (2026-10-26), tag artic-v2rework-20261026.
MOUTH HOLD (Mars 2026-10-26 ~10:50 CDT): NO mouth overlay is drawn here at all.
V3 contour-fit mouths land separately; these frames are eyes-only intermediates,
labelled eyesonly in every filename. When V3 lands, mouths are added on top
and this script's mouth column is replaced by the V3 module (no rectangular
crop / clear-box ever).

V2 rules applied to eyes: corrected anchors from true feature clusters
(re-measured, NOT copied from old marker crosses), overlay drawn AFTER the
cell transform in final-frame coordinates, every dimension x (sx,sy),
ellipses under squash, NO clear-box rectangles anywhere, size caps from
measured true features, pre+post gates ON the final frame (fail = base).
Impact eye states follow Batch C's corrected table: physical widened,
special glance, signature widened, heavy widened (NOT half-lid: half-lid
bars read as face paint on punchkid's red band / pyromonk's red-white box).
Teeth: NO for both (no teeth visible on either front cell).
Scope: punchkid + pyromonk attacks only, cell-03 impact frame per set,
Mode A. Hurts untouched (base, face-changing). pixilite/shellguard untouched.
New filenames only; batch-e originals, Batch B, pilots, approved hurts untouched. No PR.
"""
import json, ast, os
import numpy as np
from PIL import Image, ImageDraw

BASE = os.path.expanduser('~/workspace/mochiichao-work/sprite-art/animation/expanded-scope')
SRC = os.path.join(BASE, 'articulation-batch-cd/batch-e')
OUT = os.path.join(BASE, 'articulation-v2-rework/batch-e')
TAG = 'artic-v2rework-20261026'

# corrected anchors (64px source coords), re-measured 2026-10-26:
# punchkid: blue/dark-blue cluster centroids, 2 predicates agree within 0.2px,
#   grounding check (26.8,16.8)/(36.8,16.6) within 0.9/0.4px. True eye bbox
#   3 wide x 6 tall (vertical ovals) -> half (1.5, 3.0).
# pyromonk: left white (25,13)+dark pupil (26,13) -> (25.5,13.0); right dark
#   (31,12)+grey (32,12)+light (33,12) -> (32.0,12.0), grounding (31.4,12.3);
#   adopted (31.7,12.2). True eye ~2-3 wide x 1 tall -> half (1,1) floor.
CORR = {
 'punchkid': {'eyes': [(25.9,16.7),(37.2,16.2)], 'half': (1.5,3.0),
              'disc': (50,120,210,255), 'inner': (255,255,255,255),
              'old': [(27.1,18.8),(38.1,18.8)], 'old_r': 5,
              'mouth_candidate': (32.5,21.0)},
 'pyromonk': {'eyes': [(25.5,13.0),(31.7,12.2)], 'half': (1.0,1.0),
              'disc': (255,255,255,255), 'inner': (15,15,15,255),
              'old': [(27.2,13.0),(35.0,13.0)], 'old_r': 5,
              'mouth_candidate': None},
}
IMPACT_EYES = {'physical': 'widened', 'special': 'glance',
               'signature': 'widened', 'heavy': 'widened'}

def trf(cell):
    t = cell.get('transform', {})
    return ast.literal_eval(t) if isinstance(t, str) else (t or {})

def propagate(p, t):
    sx=t.get('sx',1.0); sy=t.get('sy',1.0); dx=t.get('dx',0); dy=t.get('dy',0); rot=t.get('rot',0)
    X,Y = p[0]*4, p[1]*4
    qx = 128 + (X-128)*sx + dx; qy = 232 + (Y-256)*sy + dy
    if rot:
        import math
        th=math.radians(rot); cx,cy=128,200
        rx=cx+(qx-cx)*math.cos(th)+(qy-cy)*math.sin(th)
        ry=cy-(qx-cx)*math.sin(th)+(qy-cy)*math.cos(th)
        qx,qy=rx,ry
    return (qx/4, qy/4)

def feat_present(im, cx, cy, creature):
    n=0
    for y in range(max(0,int(cy)-3), min(64,int(cy)+4)):
        for x in range(max(0,int(cx)-3), min(64,int(cx)+4)):
            p=im.getpixel((x,y))
            if p[3]<128: continue
            r,g,b=p[0],p[1],p[2]
            if creature=='punchkid':
                if (b-r>20 and b>90) or (b-r>10 and r<150 and b>50): n+=1
            else:
                # Widened predicate (measured, same case as pipev2 Reaperdile):
                # LANCZOS-blended eye highlight on the heavy squash falls to
                # (196,193,179) -- below the strict all>200 white test, while
                # skin (lum ~150-170, channel range 70-90) and gold pattern
                # stay out via the low-saturation + lum>180 clause.
                lum=0.299*r+0.587*g+0.114*b
                if (r>200 and g>200 and b>200) or (r<80 and g<80 and b<80) or (60<=r<=75 and 20<=g<=35 and 25<=b<=40) or (max(r,g,b)-min(r,g,b)<30 and lum>180): n+=1
    return n

def draw_eyes(d, anchors, state, creature, sx, sy):
    g=CORR[creature]; hx,hy=g['half']
    for (cx,cy) in anchors:
        if state=='widened':
            rx=max(1,round(2*hx*sx)); ry=max(1,round(max(hy,2*hy*0.5)*sy)) if creature=='punchkid' else max(1,round(2*hy*sy))
            # punchkid widened: width 2x true half (3), height = true half (3) -- widen, don't grow tall
            if creature=='punchkid': ry=max(1,round(hy*sy))
        elif state=='glance':
            rx=max(1,round(hx*sx)); ry=max(1,round(hy*sy)); cx=cx+max(1,round(1*sx))
        else:
            rx=max(1,round(hx*sx)); ry=max(1,round(hy*sy))
        d.ellipse((cx-rx,cy-ry,cx+rx,cy+ry), fill=g['disc'])
        d.ellipse((cx,cy,cx,cy), fill=g['inner'])

def family_of(s):
    for k in ('physical','special','signature','heavy'):
        if k in s: return k
    return 'special'

report={'tag':TAG,'method':'PIPELINE-V2 eyes only; MOUTH HELD for V3 contour-fit (no mouth drawn)',
        'creatures':{}}
for creature in ('punchkid','pyromonk'):
    man=json.load(open(os.path.join(SRC,creature,f'{creature}-artic-batchc-20261026-base-manifest.json')))
    odir=os.path.join(OUT,creature); os.makedirs(odir,exist_ok=True)
    crep={'sets':{}}; gif_frames=[]; gif_durs=[]
    for setname,s in man['sets'].items():
        if s['kind']!='attack': continue
        fam=family_of(setname); estate=IMPACT_EYES[fam]
        files=[]; states=[]
        for i,cell in enumerate(s['cells']):
            base=Image.open(os.path.join(SRC,creature,'base',cell['file'])).convert('RGBA')
            t=trf(cell); sx,sy=t.get('sx',1.0),t.get('sy',1.0)
            action='base'; info={}
            if i==3:
                eye_a=[propagate(e,t) for e in CORR[creature]['eyes']]
                eye_i=[(int(round(x)),int(round(y))) for x,y in eye_a]
                counts=[feat_present(base,ex,ey,creature) for ex,ey in eye_i]
                info={'prop_eyes':[(round(x,1),round(y,1)) for x,y in eye_a],
                      'sx':sx,'sy':sy,'eye_state':estate,'feature_counts':counts,'mouth':'HELD-V3-not-drawn'}
                if all(c>=1 for c in counts):
                    im=base.copy(); d=ImageDraw.Draw(im)
                    draw_eyes(d, eye_i, estate, creature, sx, sy)
                    ba=np.array(base)[:,:,3]>=128
                    diff=(np.abs(np.array(im).astype(int)-np.array(base).astype(int)).sum(axis=2)>0)
                    dys,dxs=np.where(diff); inside=True
                    if len(dxs):
                        ok=ba.copy()
                        for _ in range(2):
                            sh=np.zeros_like(ok); sh[1:,:]|=ok[:-1,:]; sh[:-1,:]|=ok[1:,:]; sh[:,1:]|=ok[:,:-1]; sh[:,:-1]|=ok[:,1:]; ok=ok|sh
                        inside=bool(ok[dys,dxs].all())
                    info['diff_bbox']=(int(dxs.min()),int(dxs.max()),int(dys.min()),int(dys.max()),int(len(dxs))) if len(dxs) else None
                    info['diff_inside_base_silhouette']=inside
                    if inside: base=im; action=f'eyesonly-v2-{estate}'
                    else: action='base-skipped-postgate-outside-silhouette'
                else: action='base-skipped-pregate-no-feature'
            fn=f"{creature}-{TAG}-eyesonly-{setname}-cell-{i:02d}.png"
            base.save(os.path.join(odir,fn)); files.append(fn)
            states.append({'frame':i,'action':action,**info})
            gif_frames.append((fn,odir)); gif_durs.append(cell['duration_ms'])
        gif_durs[-1]+=250
        crep['sets'][setname]={'kind':'attack','family':fam,'files':files,'frames':states}
        print(creature,setname,[f['action'] for f in states])
    fr,du=[],[]
    for (fn,od),ms in zip(gif_frames,gif_durs):
        im=Image.open(os.path.join(od,fn)).convert('RGBA').resize((256,256),Image.NEAREST)
        bg=Image.new('RGBA',(256,256),(24,28,40,255)); bg.paste(im,(0,0),im)
        fr.append(bg.convert('P',palette=Image.ADAPTIVE)); du.append(ms)
    gif_name=f'{creature}-attacks-{TAG}-eyesonly.gif'
    fr[0].save(os.path.join(OUT,gif_name),save_all=True,append_images=fr[1:],duration=du,loop=0)
    print(creature,gif_name,len(fr),'frames')
    # enlarged triplets base / old / eyesonly per impact frame
    for setname,s in man['sets'].items():
        if s['kind']!='attack': continue
        cell=s['cells'][3]
        b=Image.open(os.path.join(SRC,creature,'base',cell['file'])).convert('RGBA').resize((256,256),Image.NEAREST)
        o=Image.open(os.path.join(SRC,creature,cell['file'])).convert('RGBA').resize((256,256),Image.NEAREST)
        v=Image.open(os.path.join(odir,f"{creature}-{TAG}-eyesonly-{setname}-cell-03.png")).convert('RGBA').resize((256,256),Image.NEAREST)
        strip=Image.new('RGBA',(768,256),(24,28,40,255))
        for k,im in enumerate((b,o,v)):
            strip.paste(im,(k*256,0),im)
        strip.save(os.path.join(odir,f"{creature}-{TAG}-eyesonly-triplet-{setname}.png"))
    report['creatures'][creature]=crep
json.dump(report,open(os.path.join(OUT,f'manifest-{TAG}-eyesonly.json'),'w'),indent=1)
print('manifest written')
