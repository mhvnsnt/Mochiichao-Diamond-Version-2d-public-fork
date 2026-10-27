"""Bake v2 for Dorowani/Gabu: stronger fill+rim lighting, walk pose variants,
distinct battle poses. Args after "--": glb_path out_dir slug
Honest limit: the Tripo models are unrigged statics. Walk/battle 'poses' are
whole-body transforms of the baked root (bob, lean, tilt, shift) — NOT skeletal
limb animation. Outputs are labelled as such; never claim limb animation.

View mapping (Dorowani/Gabu, NOT Megalochrome): front=angle90, back=angle270,
side=angle0, other-side=angle180 (profile facing the other way).
"""
import bpy, sys, os, math, mathutils

argv = sys.argv[sys.argv.index("--") + 1:]
glb_path, out_dir, slug = argv[0], argv[1], argv[2]
os.makedirs(out_dir, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.eevee.taa_render_samples = 16
scene.render.resolution_x = 256
scene.render.resolution_y = 256
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'

bpy.ops.import_scene.gltf(filepath=glb_path)
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
if not meshes:
    raise RuntimeError("No mesh objects imported from " + glb_path)
print(f"Imported meshes: {len(meshes)}")

mins = [float('inf')] * 3
maxs = [float('-inf')] * 3
for o in meshes:
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mins[i] = min(mins[i], w[i])
            maxs[i] = max(maxs[i], w[i])
size = [maxs[i] - mins[i] for i in range(3)]
max_dim = max(size)
center = [(mins[i] + maxs[i]) / 2 for i in range(3)]
print(f"BBox size={size} max_dim={max_dim} center={center}")

root = bpy.data.objects.new("BAKE_ROOT", None)
scene.collection.objects.link(root)
for o in list(scene.objects):
    if o.type in ('MESH', 'EMPTY') and o != root and o.parent is None:
        o.parent = root
scale = 2.0 / max_dim if max_dim > 0 else 1.0
root.scale = (scale, scale, scale)
base_loc = (-center[0] * scale, -center[1] * scale, -mins[2] * scale)
root.location = base_loc
bpy.context.view_layer.update()
print(f"Scale={scale} base_loc={base_loc}")

# --- Lighting v2: stronger fill + rim so back/side are no longer dark ---
# Ambient world light (film stays transparent; world still lights the model)
world = bpy.data.worlds.new("BAKE_WORLD")
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs[0].default_value = (1.0, 1.0, 1.0, 1.0)
    bg.inputs[1].default_value = 0.45
scene.world = world

def add_sun(energy, rot_deg):
    bpy.ops.object.light_add(type='SUN', location=(0, 0, 5))
    sun = bpy.context.active_object
    sun.data.energy = energy
    sun.rotation_euler = tuple(math.radians(a) for a in rot_deg)
    return sun

add_sun(3.5, (35, 10, 20))      # key (as v1, stronger)
add_sun(2.2, (-60, 0, 140))     # v1 secondary, stronger
add_sun(2.2, (50, 0, -160))     # fill from behind-left (lights the back)
add_sun(2.0, (-20, 0, -60))     # fill from the far side
add_sun(2.8, (85, 0, 0))        # top rim
add_sun(1.5, (10, 0, 180))      # low back rim

target = bpy.data.objects.new("TARGET", None)
target.location = (0, 0, 1.0)
scene.collection.objects.link(target)
cam_data = bpy.data.cameras.new("BAKE_CAM")
cam_data.type = 'ORTHO'
cam_data.ortho_scale = 2.3
cam = bpy.data.objects.new("BAKE_CAM", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
con = cam.constraints.new(type='TRACK_TO')
con.target = target
con.track_axis = 'TRACK_NEGATIVE_Z'
con.up_axis = 'UP_Y'

CAM = {
    "angle0": (0, -5, 1.0),
    "angle90": (5, 0, 1.0),
    "angle180": (0, 5, 1.0),
    "angle270": (-5, 0, 1.0),
}

def render(name, angle, rot_deg=(0, 0, 0), loc_off=(0, 0, 0)):
    # rot_deg rotates the whole root about X/Y/Z in degrees; Z-rotation is
    # NOT used for walk/battle variants (it would change the facing view).
    root.rotation_euler = tuple(math.radians(a) for a in rot_deg)
    root.location = (base_loc[0] + loc_off[0], base_loc[1] + loc_off[1],
                     base_loc[2] + loc_off[2])
    cam.location = CAM[angle]
    bpy.context.view_layer.update()
    out = os.path.join(out_dir, f"{slug}_{name}.png")
    scene.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print(f"Rendered {out} rot={rot_deg} off={loc_off}")

# Neutral views (all 4 angles)
for ang in ("angle0", "angle90", "angle180", "angle270"):
    render(ang, ang)

# Walk variants: 4 frames per direction, whole-body bob/lean/tilt/shift only.
# Rotation is about Y (forward/back lean in the model's facing plane) and X
# (sideways tilt); Z-rotation is never used (it would change the facing view).
# Note: the camera is orthographic, so shifts along the view axis do not
# change the image — pose changes come from lean/tilt/bob, not depth shifts.
WALK = [
    ("w0", (0, 0, 0), (0, 0, 0)),
    ("w1", (0, 8, 0), (0, 0, 0.06)),
    ("w2", (4, -3, 0), (0.04, 0, -0.05)),
    ("w3", (-3, -8, 0), (-0.04, 0, 0.02)),
]
for direction, ang in (("front", "angle90"), ("back", "angle270"), ("side", "angle0")):
    for wname, rot, off in WALK:
        render(f"walk_{direction}_{wname}", ang, rot, off)

# Battle poses, front + back views: ready (slight forward lean), attack
# (deep forward lean + crouch bob), recoil (lean back + tilt + rise).
BATTLE = [
    ("battle_ready", (0, 10, 0), (0, 0, 0.03)),
    ("battle_attack", (5, 24, 0), (0, 0, -0.12)),
    ("battle_recoil", (-8, -20, 0), (0, 0, 0.08)),
]
for direction, ang in (("front", "angle90"), ("back", "angle270")):
    for bname, rot, off in BATTLE:
        render(f"{bname}_{direction}", ang, rot, off)

print("BAKE_V2_DONE")
