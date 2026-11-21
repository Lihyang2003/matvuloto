"""Cache-busting: append ?v=<content hash> to every css/js reference in index.html.
Run before each commit/push so browsers never keep an old game.js / style.css.
    python tools/stamp.py
"""
import hashlib, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
idx = root / 'index.html'
html = idx.read_text(encoding='utf8')

def stamp(m):
    attr, path = m.group(1), m.group(2)
    f = root / path
    if not f.exists():
        print('missing', path); return m.group(0)
    v = hashlib.md5(f.read_bytes()).hexdigest()[:8]
    return f'{attr}="{path}?v={v}"'

new = re.sub(r'(href|src)="((?:css|js)/[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"', stamp, html)
if new != html:
    idx.write_text(new, encoding='utf8'); print('index.html stamped')
else:
    print('index.html already up to date')
for line in new.splitlines():
    if '?v=' in line: print(' ', line.strip()[:110])
sys.exit(0)
