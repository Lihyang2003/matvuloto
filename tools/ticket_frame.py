"""Vector lô tô ticket frame, measured from the client's reference (docx image2.png, card 485x612 px)
and scaled to 792x1000. Writes assets/img/ticket_frame.svg (used by the web game and imported into Figma).
    python tools/ticket_frame.py
"""
import pathlib

S = 792 / 485                        # reference px -> our px
W, H = 792, 1000
RED, CARD, PANEL, LINE = '#DB2234', '#FFCB92', '#FFDAAD', '#5E3205'

def clover(cx, cy):                  # rounded "plus" made of 5 circles, ~12x10 ref px
    out = []
    for dx, dy, r in ((0, 0, 4.7), (-5.5, 0, 4.3), (5.5, 0, 4.3), (0, -4.0, 4.1), (0, 4.0, 4.1)):
        x, y = cx + dx, cy + dy
        out.append(f'M{x - r:.2f} {y:.2f}a{r} {r} 0 1 0 {2 * r} 0a{r} {r} 0 1 0 {-2 * r} 0Z')
    return ''.join(out)

def seg(a, b, n): return [a + (b - a) * i / (n - 1) for i in range(n)]

# reference coordinates relative to the card's top-left corner
rows_y = (26.5, 587.4)
row_x = seg(28.6, 206.0, 14) + seg(278.5, 455.5, 14)
cols_x = (28.6, 455.5)
col_y = seg(26.5, 199.4, 15) + seg(256.0, 357.0, 9) + seg(414.5, 587.4, 15)
pts = {(x, y) for y in rows_y for x in row_x} | {(x, y) for x in cols_x for y in col_y}
d = ''.join(clover(x * S, y * S) for x, y in sorted(pts))

px, py, pw, ph = 48 * S, 41 * S, 388 * S, 532 * S          # inner panel
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<rect x="2" y="2" width="{W - 4}" height="{H - 4}" rx="22" fill="#C9513F" stroke="#6B2A1C" stroke-width="3"/>
<rect x="11" y="11" width="{W - 22}" height="{H - 22}" rx="15" fill="{CARD}"/>
<path d="{d}" fill="{RED}"/>
<rect x="{px:.1f}" y="{py:.1f}" width="{pw:.1f}" height="{ph:.1f}" rx="9" fill="{PANEL}" stroke="{LINE}" stroke-width="2.5"/>
</svg>'''
root = pathlib.Path(__file__).resolve().parent.parent
(root / 'assets/img/ticket_frame.svg').write_text(svg, encoding='utf8')
print('clovers', len(pts), 'bytes', len(svg))
# layout helpers for the HTML/Figma content (our px)
print('grid x', round(61 * S, 1), 'w', round(363 * S, 1), 'grid1 y', round(54 * S, 1), 'grid2 y', round(227 * S, 1), 'grid h', round(160 * S, 1), 'hint y', round(400 * S, 1), 'hint h', round(161 * S, 1))
