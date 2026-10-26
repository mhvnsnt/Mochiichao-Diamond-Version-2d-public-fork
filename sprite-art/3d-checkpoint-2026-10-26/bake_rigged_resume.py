"""Rig-baked sheets v2: NO depsgraph bbox sampling (that phase starved under
system load). Framing comes from the GLB's own POSITION accessor bounds,
parsed offline in seconds (see bake log header), converted glTF Y-up ->
Blender Z-up, with a 1.45-1.5x margin so faint falls / attack lunges
cannot clip. Front = camera at -Y, side = +X, matching the rig previews.

Usage: blender -b --python bake_rigged_v2.py -- <glb> <out_dir> <slug>
"""
import bpy, sys, os, math
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
GLB, OUT, SLUG = argv[0], argv[1], argv[2]
os.makedirs(OUT, exist_ok=True)

CLIPS = {
    "dorowani": {
        "idle": [0, 15, 30, 45], "walk": [0, 10, 20, 30],
        "ready": [0, 15, 29], "attack": [0, 8, 16, 23],
        "hit": [0, 5, 10, 20], "faint": [0, 10, 20, 30],
        # Blender-space rest bounds (from GLB POSITION min/max, Y-up->Z-up):
        # center (0, 0, 0.9), extents X 1.799, Y 1.336, Z 1.8
        "center": (0.0, 0.0, 0.9), "ortho": 2.7,
    },
    "gabu": {
        "idle": [1, 16, 31, 46], "walk": [1, 8, 16, 23],
        "ready": [1, 15, 30], "attack": [1, 8, 15, 22, 30],
        "hit": [1, 5, 10, 15], "faint": [1, 15, 30, 45],
        # Blender-space rest bounds: center (0, 0, 0.925),
        # extents X 2.749, Y 2.445, Z 1.85
        "center": (0.0, 0.0, 0.925), "ortho": 4.0,
    },
}[SLUG]
CENTER = CLIPS.pop("center"); ORTHO = CLIPS.pop("ortho")

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
arm = [o for o in bpy.context.scene.objects if o.type == 'ARMATURE'][0]
print(f"ARMATURE={arm.name}", flush=True)
ACTIONS = {}
for act in bpy.data.actions:
    for clip in CLIPS:
        if act.name.startswith(clip):
            ACTIONS[clip] = act.name
print(f"ACTIONS={ACTIONS}", flush=True)
assert all(ACTIONS.get(c) for c in CLIPS), f"missing actions: {ACTIONS}"

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

cam_data = bpy.data.cameras.new("BAKE_CAM")
cam_data.type = 'ORTHO'
cam_data.ortho_scale = ORTHO
cam = bpy.data.objects.new("BAKE_CAM", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
C = Vector(CENTER)
FRONT = (CENTER[0], CENTER[1] - 5, CENTER[2])
SIDE = (CENTER[0] + 5, CENTER[1], CENTER[2])

def render(clip, frame, view, name, res=256):
    # CHECKPOINT RESUME (2026-10-25): the 01:06 UTC bake died after
    # dorowani_walk_side_f0 with no crash line in its log (process
    # vanished, Blender + libEGL still present). Never re-render a
    # finished file: skip any output that already exists non-empty.
    _out = os.path.join(OUT, name)
    if os.path.exists(_out) and os.path.getsize(_out) > 0:
        print(f"SKIPPED {name} (already on disk)", flush=True)
        return
    set_action(clip)
    scene.frame_set(frame)
    scene.render.resolution_x = res
    scene.render.resolution_y = res
    loc = FRONT if view == 'front' else SIDE
    cam.location = loc
    cam.rotation_euler = (C - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
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
if SLUG == 'gabu':
    for fr in (8, 15, 22):
        render('attack', fr, 'side', f"gabu_attack_side_preview_f{fr}.png", res=512)
print("BAKE_DONE", SLUG, flush=True)
