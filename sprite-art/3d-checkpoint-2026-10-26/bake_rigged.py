"""Rig-baked sheets from v2-fixed GLBs (Dorowani/Gabu only).

Imports the rigged GLB once, samples the depsgraph-evaluated mesh bbox
across every clip (so faint falls / attack lunges cannot clip), frames an
ortho camera from that union bbox, then renders real skeletal-clip frames
-- NOT the old whole-body bob/tilt pose variants.

Usage: blender -b --python bake_rigged.py -- <glb> <out_dir> <slug>
  glb:     path to v2-fixed GLB
  out_dir: renders land here
  slug:    dorowani | gabu

Clip frames are per-creature (ranges verified from the GLB actions):
  dorowani: idle 0-60, walk 0-40, ready 0-30, attack 0-24, hit 0-20, faint 0-30
  gabu:     idle 1-60, walk 1-30, ready 1-30, attack 1-30, hit 1-15, faint 1-45
Views: front = camera at -Y (matches the rig previews' front), side = +X.
"""
import bpy, sys, os, math
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
GLB, OUT, SLUG = argv[0], argv[1], argv[2]
os.makedirs(OUT, exist_ok=True)

CLIPS = {
    "dorowani": {
        "idle": [0, 15, 30, 45],
        "walk": [0, 10, 20, 30],
        "ready": [0, 15, 29],
        "attack": [0, 8, 16, 23],
        "hit": [0, 5, 10, 20],
        "faint": [0, 10, 20, 30],
    },
    "gabu": {
        "idle": [1, 16, 31, 46],
        "walk": [1, 8, 16, 23],
        "ready": [1, 15, 30],
        "attack": [1, 8, 15, 22, 30],
        "hit": [1, 5, 10, 15],
        "faint": [1, 15, 30, 45],
    },
}[SLUG]
ACTIONS = {c: None for c in CLIPS}

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
arm = [o for o in bpy.context.scene.objects if o.type == 'ARMATURE'][0]
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
print(f"ARMATURE={arm.name} MESHES={[(m.name, len(m.data.vertices)) for m in meshes]}", flush=True)
for act in bpy.data.actions:
    for clip in CLIPS:
        if act.name.startswith(clip):
            ACTIONS[clip] = act.name
print(f"ACTIONS={ACTIONS}", flush=True)
assert all(ACTIONS.values()), f"missing actions: {ACTIONS}"

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.eevee.taa_render_samples = 16
scene.render.resolution_x = 256
scene.render.resolution_y = 256
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
world = bpy.data.worlds.new("BAKE_WORLD")
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs[0].default_value = (1, 1, 1, 1)
    bg.inputs[1].default_value = 0.45
scene.world = world

def add_sun(energy, rot):
    bpy.ops.object.light_add(type='SUN', location=(0, 0, 5))
    s = bpy.context.active_object
    s.data.energy = energy
    s.rotation_euler = tuple(math.radians(a) for a in rot)
add_sun(3.5, (35, 10, 20)); add_sun(2.2, (-60, 0, 140)); add_sun(2.2, (50, 0, -160))
add_sun(2.0, (-20, 0, -60)); add_sun(2.8, (85, 0, 0)); add_sun(1.5, (10, 0, 180))

def set_action(clip):
    if arm.animation_data is None:
        arm.animation_data_create()
    for t in arm.animation_data.nla_tracks:
        t.mute = True
    arm.animation_data.use_nla = False
    arm.animation_data.action = bpy.data.actions.get(ACTIONS[clip])

# --- Union bbox over all clips (depsgraph-evaluated, deformed verts) ---
mins = [float('inf')] * 3
maxs = [float('-inf')] * 3
for clip, frames in CLIPS.items():
    set_action(clip)
    lo = frames[0]; hi = frames[-1]
    for fr in range(lo, hi + 1, 5):
        scene.frame_set(fr)
        dg = bpy.context.evaluated_depsgraph_get()
        bpy.context.view_layer.update()
        for m in meshes:
            ev = m.evaluated_get(dg)
            mw = ev.matrix_world
            for v in ev.data.vertices:
                w = mw @ v.co
                for i in range(3):
                    mins[i] = min(mins[i], w[i]); maxs[i] = max(maxs[i], w[i])
size = [maxs[i] - mins[i] for i in range(3)]
center = [(mins[i] + maxs[i]) / 2 for i in range(3)]
print(f"UNION_BBOX mins={mins} maxs={maxs} size={size} center={center}", flush=True)
ortho = max(size) * 1.35
print(f"ORTHO_SCALE={ortho}", flush=True)

cam_data = bpy.data.cameras.new("BAKE_CAM")
cam_data.type = 'ORTHO'
cam_data.ortho_scale = ortho
cam = bpy.data.objects.new("BAKE_CAM", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
C = Vector(center)
def aim(loc):
    cam.location = loc
    cam.rotation_euler = (C - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
FRONT = (center[0], center[1] - 5, center[2])
SIDE = (center[0] + 5, center[1], center[2])

def render(clip, frame, view, name, res=256):
    set_action(clip)
    scene.frame_set(frame)
    scene.render.resolution_x = res
    scene.render.resolution_y = res
    aim(FRONT if view == 'front' else SIDE)
    bpy.context.view_layer.update()
    out = os.path.join(OUT, name)
    scene.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print(f"RENDERED {name} clip={clip} frame={frame} view={view}", flush=True)

for clip, frames in CLIPS.items():
    views = ('front', 'side') if clip == 'walk' else ('front',)
    for fr in frames:
        for v in views:
            render(clip, fr, v, f"{SLUG}_{clip}_{v}_f{fr}.png")
# Gabu side-view attack preview candidates at 512 (item 3 of the lane task)
if SLUG == 'gabu':
    for fr in (8, 15, 22):
        render('attack', fr, 'side', f"gabu_attack_side_preview_f{fr}.png", res=512)
print("BAKE_DONE", SLUG, flush=True)
