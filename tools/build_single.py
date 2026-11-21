"""Pack the whole web game into ONE offline HTML file (double-click to play, no server / internet needed).
- CSS + JS inlined, every file under assets/ embedded (turned into blob: URLs at start-up)
- Google Fonts (Be Vietnam Pro, Russo One) downloaded once and embedded as woff2
    python tools/build_single.py            -> ../dist/MatVuLoTo.html (+ MatVuLoTo.zip)
"""
import base64, json, mimetypes, pathlib, re, urllib.request, zipfile

root = pathlib.Path(__file__).resolve().parent.parent
dist = root.parent / 'dist'; dist.mkdir(exist_ok=True)
MIME = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml'}
b64 = lambda b: base64.b64encode(b).decode()
html = (root / 'index.html').read_text(encoding='utf8')

# ---- fonts: fetch the Google Fonts css with a modern UA (woff2 + unicode-range), keep latin / latin-ext / vietnamese ----
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}
font_href = re.search(r'<link href="(https://fonts\.googleapis\.com/[^"]+)" rel="stylesheet">', html).group(1).replace('&amp;', '&')
gcss = urllib.request.urlopen(urllib.request.Request(font_href, headers=UA)).read().decode()
faces = re.findall(r'/\* ([\w-]+) \*/\s*(@font-face \{.*?\})', gcss, re.S)
font_css, cache = [], {}
for subset, face in faces:
    if subset not in ('latin', 'latin-ext', 'vietnamese'): continue
    url = re.search(r'url\((https://[^)]+)\)', face).group(1)
    if url not in cache: cache[url] = b64(urllib.request.urlopen(urllib.request.Request(url, headers=UA)).read())
    font_css.append(face.replace(url, 'data:font/woff2;base64,' + cache[url]))
html = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', html)
html = re.sub(r'<link href="https://fonts\.googleapis\.com/[^"]+" rel="stylesheet">', '<style>' + '\n'.join(font_css) + '</style>', html)

# ---- assets map (path -> data URI); turned into blob: URLs before the game scripts run ----
assets = {}
for f in sorted((root / 'assets').rglob('*')):
    if f.is_file() and f.suffix.lower() in MIME:
        assets[f.relative_to(root).as_posix()] = 'data:' + MIME[f.suffix.lower()] + ';base64,' + b64(f.read_bytes())
boot = ('<script>window.__A=' + json.dumps(assets, separators=(',', ':')) + ';'
        "(function(){for(const k in __A){if(/collision\\.png$/.test(k))continue;const d=__A[k],i=d.indexOf(','),bin=atob(d.slice(i+1)),u=new Uint8Array(bin.length);"
        "for(let j=0;j<bin.length;j++)u[j]=bin.charCodeAt(j);__A[k]=URL.createObjectURL(new Blob([u],{type:d.slice(5,d.indexOf(';'))}));}"
        "const r=document.documentElement.style;r.setProperty('--a-world','url(\"'+__A['assets/img/world.jpg']+'\")');r.setProperty('--a-worldsm','url(\"'+__A['assets/img/world_small.jpg']+'\")');})();</script>")

# ---- css ----
def css_inline(m):
    css = (root / m.group(1)).read_text(encoding='utf8')
    css = css.replace('url(../assets/img/world.jpg)', 'var(--a-world)').replace('url(../assets/img/world_small.jpg)', 'var(--a-worldsm)')
    assert '../assets/' not in css, 'unhandled asset url in ' + m.group(1)
    return '<style>' + css + '</style>'
html = re.sub(r'<link rel="stylesheet" href="(css/[^"?]+)(?:\?v=[^"]*)?">', css_inline, html)

# ---- js: asset helpers read from the embedded map ----
PATCH = {
    "const charImg = k => `assets/chars/${k}.webp`;": "const charImg = k => __A[`assets/chars/${k}.webp`];",
    "const charNS = k => `assets/chars_ns/${k}.webp`;": "const charNS = k => __A[`assets/chars_ns/${k}.webp`];",
    "const IMG = k => `assets/img/${k}`;": "const IMG = k => __A[`assets/img/${k}`] || `assets/img/${k}`;",
    'src="assets/rig/${k}_${n}.webp"': 'src="${__A[`assets/rig/${k}_${n}.webp`]}"',
}
applied = set()
def js_inline(m):
    js = (root / m.group(1)).read_text(encoding='utf8')
    for a, b in PATCH.items():
        if a in js: js = js.replace(a, b); applied.add(a)
    return '<script>' + js.replace('</script', '<\\/script') + '</script>'
html = re.sub(r'<script src="(js/[^"?]+)(?:\?v=[^"]*)?"></script>', js_inline, html)
html = html.replace("i.src = src;", "i.src = __A[src] || src;")
html = html.replace('<link rel="icon" href="assets/img/coin.webp">', '<link rel="icon" href="' + assets['assets/img/coin.webp'] + '">')
html = html.replace('<head>', '<head>\n' + boot, 1) if False else html.replace('</head>', boot + '\n</head>', 1)
assert applied == set(PATCH), 'patch missing: ' + str(set(PATCH) - applied)
left = re.findall(r'["\'(]assets/[^"\')]+', html.split('window.__A=')[0] + html.split('</script>', 1)[1])
out = dist / 'MatVuLoTo.html'; out.write_text(html, encoding='utf8')
readme = ('MẬT VỤ LÔ TÔ – bản chơi offline\n\n'
          '1. Giải nén (nếu nhận file .zip).\n2. Bấm đúp file MatVuLoTo.html – mở bằng Chrome hoặc Edge (khuyên dùng).\n'
          '3. Chơi ngang màn hình; trên máy tính dùng WASD/mũi tên, Space nhảy, E lụm, F làm nhiệm vụ, B túi, M bản đồ.\n\n'
          'Không cần mạng, không cần cài đặt. Dữ liệu chơi thử lưu ngay trong trình duyệt.\n'
          'Bản online: https://lihyang2003.github.io/matvuloto/\n')
(dist / 'HUONG_DAN.txt').write_text(readme, encoding='utf8')
with zipfile.ZipFile(dist / 'MatVuLoTo.zip', 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    z.write(out, 'MatVuLoTo/MatVuLoTo.html'); z.write(dist / 'HUONG_DAN.txt', 'MatVuLoTo/HUONG_DAN.txt')
print('assets', len(assets), 'fonts', len(font_css), 'html MB', round(out.stat().st_size / 1e6, 2), 'zip MB', round((dist / 'MatVuLoTo.zip').stat().st_size / 1e6, 2), 'leftover refs', left[:5])
