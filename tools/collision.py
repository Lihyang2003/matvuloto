"""Build assets/img/collision.png from the world art.
Grid cell = 20 world px (world 5120x6134 -> 256x307). Value: 0 free, 255 wall, 128 steps (must jump to get up).
Walls = the flat tan wall-top colour (205,169,107) + the lighter wall-face colour (241,195,145) of the house plan.
    python tools/collision.py
"""
import pathlib
import numpy as np
from PIL import Image

root = pathlib.Path(__file__).resolve().parent.parent
art = Image.open(root / 'assets/img/world.jpg').convert('RGB')
WW, WH, CELL = 5120, 6134, 20
GW, GH = WW // CELL, -(-WH // CELL)
im = np.asarray(art.resize((WW, WH), Image.NEAREST)).astype(np.int16)

def near(c, t): return np.abs(im - np.array(c)).max(-1) <= t
wall = near((205, 169, 107), 10) | near((241, 195, 145), 8)

P = WW / 1000  # helper: rectangles below are given in 1000-px-wide preview coordinates
def rect(x0, y0, x1, y1): return slice(int(y0 * P), int(y1 * P)), slice(int(x0 * P), int(x1 * P))

wall[rect(523, 286, 898, 384)] = True     # kitchen back wall incl. the cabinets / stoves standing against it
wall[rect(370, 146, 898, 162)] = True     # brick wall behind the wash area
wall[rect(368, 146, 383, 290)] = True     # brick wall, left side of the wash area
wall[rect(597, 515, 687, 588)] = False    # doorway kitchen -> front hall
steps = np.zeros_like(wall)
steps[rect(398, 1028, 864, 1117)] = True  # front porch steps
wall[steps] = False

grid = np.zeros((GH, GW), np.uint8)
for gy in range(GH):
    ys = slice(gy * CELL, min(WH, (gy + 1) * CELL))
    for gx in range(GW):
        xs = slice(gx * CELL, (gx + 1) * CELL)
        if wall[ys, xs].mean() > .35: grid[gy, gx] = 255
        elif steps[ys, xs].mean() > .5: grid[gy, gx] = 128
Image.fromarray(grid, 'L').save(root / 'assets/img/collision.png', optimize=True)
print('grid', GW, 'x', GH, 'walls', int((grid == 255).sum()), 'steps', int((grid == 128).sum()))
