import bpy, sys, os, math

# Args after "--": glb_path out_dir slug
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

# Import GLB
bpy.ops.import_scene.gltf(filepath=glb_path)

meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
if not meshes:
    raise RuntimeError("No mesh objects imported from " + glb_path)
print(f"Imported meshes: {len(meshes)}")

# World bounding box
import mathutils
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

# Normalize: parent all to an empty, scale so max_dim -> 2.0, center at origin, base at z=0
root = bpy.data.objects.new("BAKE_ROOT", None)
scene.collection.objects.link(root)
for o in list(scene.objects):
    if o.type in ('MESH', 'EMPTY') and o != root and o.parent is None:
        # Only top-level imported objects; lights/cameras not yet added
        o.parent = root
scale = 2.0 / max_dim if max_dim > 0 else 1.0
root.scale = (scale, scale, scale)
# After scaling, shift so center maps to origin and bottom sits at z=0
root.location = (-center[0] * scale, -center[1] * scale, -mins[2] * scale)
bpy.context.view_layer.update()
print(f"Scale={scale} root.location={root.location}")

# Lights
def add_sun(energy, loc, rot):
    bpy.ops.object.light_add(type='SUN', location=loc)
    sun = bpy.context.active_object
    sun.data.energy = energy
    sun.rotation_euler = rot
    return sun

add_sun(3.0, (0, 0, 5), (math.radians(35), math.radians(10), math.radians(20)))
add_sun(0.8, (0, 0, 5), (math.radians(-60), math.radians(0), math.radians(140)))

# Camera target at model mid-height (model now spans z 0..2 after normalize, approx)
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

# 4 orthogonal angles around Z: 0 = -Y side, 90 = +X, 180 = +Y, 270 = -X
angles = {
    "angle0": (0, -5, 1.0),
    "angle90": (5, 0, 1.0),
    "angle180": (0, 5, 1.0),
    "angle270": (-5, 0, 1.0),
}
for name, loc in angles.items():
    cam.location = loc
    bpy.context.view_layer.update()
    out = os.path.join(out_dir, f"{slug}_{name}.png")
    scene.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print(f"Rendered {out}")

print("BAKE_DONE")
