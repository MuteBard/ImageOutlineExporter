import bpy, csv

path = r"C:\Users\carls\Desktop\dev\scripts\outputFiles\out_0.csv" 

with open(path) as csvfile:
    content = csv.reader(csvfile, delimiter=',', dialect='excel')
    for i,row in enumerate(content):
        if i == 0: continue            # skip header
        x,y,z = row [0], row[1], row[2]
        bpy.ops.mesh.primitive_cube_add(location = (float(x), float(y) ,float(z)))