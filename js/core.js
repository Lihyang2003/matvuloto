/* ===== Core: icons, stage scaling, router, overlays, toasts, state, sound, helpers ===== */
const ICONS = {
  'log-in':'<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>',
  'user-plus':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  ticket:'<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
  'arrow-left':'<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>', 'arrow-right':'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  shuffle:'<path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-7.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', plus:'<path d="M5 12h14"/><path d="M12 5v14"/>', minus:'<path d="M5 12h14"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  map:'<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  copy:'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c0-1.1.9-2 2-2h2"/><path d="M4 12V6a2 2 0 0 1 2-2h6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  message:'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  bell:'<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  'log-out':'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  play:'<polygon points="6 3 20 12 6 21 6 3"/>',
  crown:'<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
  hash:'<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
  pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  delete:'<path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><path d="m12 9 6 6"/><path d="m18 9-6 6"/>',
  volume:'<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
  zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  'chevron-left':'<path d="m15 18-6-6 6-6"/>', 'chevron-right':'<path d="m9 18 6-6-6-6"/>',
  send:'<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  star:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  calendar:'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  home:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  eye:'<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>'
};
const ic = (name, color = 'currentColor', size = null) =>
  `<svg viewBox="0 0 24 24" ${size ? `width="${size}" height="${size}"` : ''} fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;

/* ---------- JunkDog text ---------- */
function jd(text, { h = 100, fill = 'var(--cream)', stroke = 'var(--brown)', sw = 6, shadow = true } = {}) {
  const J = window.JUNKDOG; let d, w;
  if (J.phrases[text]) { d = J.phrases[text].d; w = J.phrases[text].w; }
  else { let x = 0; const parts = []; for (const ch of String(text)) { const g = J.glyphs[ch] || J.glyphs[' ']; if (g.d) parts.push(`<path transform="translate(${x} 0)" d="${g.d}"/>`); x += g.adv; } w = x; d = null;
    const sc = h / J.size; return `<svg class="jd" width="${(w * sc).toFixed(0)}" height="${(J.h * sc).toFixed(0)}" viewBox="0 ${-J.top} ${w} ${J.h}" style="${shadow ? 'filter:drop-shadow(0 ' + (h * .07).toFixed(1) + 'px 0 var(--brown9))' : ''}"><g fill="${fill}" stroke="${stroke}" stroke-width="${sw * J.size / h * 1.6}">${parts.join('').replaceAll('<path ', '<path paint-order="stroke" stroke-linejoin="round" ')}</g></svg>`; }
  const sc = h / J.size;
  return `<svg class="jd" width="${(w * sc).toFixed(0)}" height="${(J.h * sc).toFixed(0)}" viewBox="0 ${-J.top} ${w} ${J.h}" style="${shadow ? 'filter:drop-shadow(0 ' + (h * .07).toFixed(1) + 'px 0 var(--brown9))' : ''}"><path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw * J.size / h * 1.6}" paint-order="stroke" stroke-linejoin="round"/></svg>`;
}

/* ---------- Data ---------- */
const CHARS = [
  ['chuot','Chuột','Nhanh nhẹn, lanh lợi – dò số siêu nhanh!'],['trau','Trâu','Bền bỉ, chắc chắn – không bao giờ bỏ cuộc.'],
  ['ho','Hổ','Mạnh mẽ, gan dạ – thủ lĩnh của cả đội.'],['meo','Mèo','Tinh mắt, khéo tay – nhặt số không sót.'],
  ['rong','Rồng','Uy dũng, may mắn – hay trúng số đẹp.'],['ran','Rắn','Bí ẩn, mưu trí – mật vụ đúng chất.'],
  ['ngua','Ngựa','Phi nhanh như gió – chạy map cực đỉnh.'],['de','Dê','Hiền lành, chăm chỉ – lụm số đều tay.'],
  ['khi','Khỉ','Lém lỉnh, nhanh trí – nhảy cao nhất đội.'],['ga','Gà','Siêng năng, dậy sớm – gáy là có số.'],
  ['cho','Chó','Trung thành, thính mũi – đánh hơi số hay.'],['heo','Heo','Phúc hậu, tròn trịa – ăn no lụm nhiều.']];
const charImg = k => `assets/chars/${k}.webp`;
const IMG = k => `assets/img/${k}`;
const ITEMS = { ao:['Áo dài Tết','ao_dai_tet.webp',0], nonla:['Nón lá','non_la.webp',500], khan:['Khăn rằn','khan_ran.webp',800], kinh:['Kính mật vụ','kinh_mat_vu.webp',1200] };

/* ---------- State (localStorage) ---------- */
const DEFAULT = { name:'Mật vụ Dê Con', char:'de', coins:6022, xp:2026, level:27, owned:['ao'], wearing:'ao', sound:true, music:true, notif:false, lang:'vi', gfx:'Vừa',
  quests:{}, daily:3, lvProg:54, mails:{}, logged:false, guest:false, stats:{games:312, wins:187, picked:4208, kinh:96} };
let S = (() => { try { return Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem('mvlt') || '{}')); } catch { return { ...DEFAULT }; } })();
const save = () => { try { localStorage.setItem('mvlt', JSON.stringify(S)); } catch {} };
const fmt = n => n.toLocaleString('vi-VN');
const xpNeed = lv => 60 + lv * 2;

/* ---------- Stage scaling ---------- */
const stage = document.getElementById('stage');
function fit() { const s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px,${(innerHeight - 1080 * s) / 2}px) scale(${s})`; }
addEventListener('resize', fit); fit();
const toStage = (cx, cy) => { const r = stage.getBoundingClientRect(); const s = r.width / 1920; return [(cx - r.left) / s, (cy - r.top) / s]; };

/* ---------- Sound (tiny WebAudio synth) ---------- */
let AC = null;
function beep(type = 'click') {
  if (!S.sound) return; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  const seq = { click:[[660,.05]], pick:[[880,.07],[1320,.09]], bad:[[220,.12]], call:[[520,.08],[780,.1]], win:[[523,.1],[659,.1],[784,.1],[1047,.25]], coin:[[1200,.05],[1600,.06]], jump:[[400,.06],[600,.06]] }[type] || [[600,.05]];
  let t = AC.currentTime;
  for (const [f, d] of seq) { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02); t += d * .9; }
}

/* ---------- Router ---------- */
const SCREENS = {}; const hist = []; let cur = null; let curParams = {};
function go(name, params = {}, { push = true } = {}) {
  closeAllOverlays(); if (cur && SCREENS[cur].leave) SCREENS[cur].leave();
  if (push && cur) hist.push([cur, curParams]); cur = name; curParams = params;
  const el = document.createElement('div'); el.className = 'screen'; el.dataset.screen = name;
  el.innerHTML = SCREENS[name].html(params);
  stage.querySelector('.screen')?.remove(); stage.prepend(el);
  SCREENS[name].mount?.(el, params);
  try { history.replaceState(null, '', '#' + name); } catch {}
}
function back(fallback = 'lobby') { const p = hist.pop(); if (p) go(p[0], p[1], { push: false }); else go(fallback, {}, { push: false }); }

/* ---------- Overlays & toasts ---------- */
const ovRoot = document.getElementById('overlays'), toastRoot = document.getElementById('toasts');
function overlay({ title, color = 'red', width = 820, body = '', close = true, dimClose = true, onClose } = {}) {
  const o = document.createElement('div'); o.className = 'ov';
  o.innerHTML = `<div class="dim"></div><div class="box panel" style="width:${width}px">${title ? `<div class="banner ${color}"><div class="in">${title}</div></div>` : ''}${close ? `<div class="x">${ic('x', '#fff')}</div>` : ''}${body}</div>`;
  ovRoot.appendChild(o);
  const shut = () => { o.remove(); onClose?.(); };
  o.close = shut;
  if (close) o.querySelector('.x').onclick = () => { beep(); shut(); };
  if (dimClose) o.querySelector('.dim').onclick = shut;
  return o;
}
function closeAllOverlays() { ovRoot.querySelectorAll('.ov').forEach(o => o.remove()); }
function toast(msg, kind = 'ok', icon = null) {
  const t = document.createElement('div'); t.className = 'toast ' + (kind === 'ok' ? '' : kind);
  t.innerHTML = `<div class="ic">${ic(icon || (kind === 'bad' ? 'x' : kind === 'info' ? 'bell' : 'check'), '#fff')}</div><div>${msg}</div>`;
  while (toastRoot.children.length >= 3) toastRoot.firstChild.remove(); toastRoot.appendChild(t); if (kind === 'bad') beep('bad');
  setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = 0; setTimeout(() => t.remove(), 320); }, 1900);
}
function confirmBox({ title, text, yes = 'ĐỒNG Ý', no = 'HUỶ', yesColor = 'red', onYes }) {
  const o = overlay({ title, width: 760, body: `<div style="font-weight:600;font-size:30px;text-align:center;white-space:pre-line">${text}</div>
    <div class="row" style="gap:20px;width:100%"><button class="btn btn-m green" data-no style="flex:1">${no}</button><button class="btn btn-m ${yesColor}" data-yes style="flex:1">${yes}</button></div>` });
  o.querySelector('[data-no]').onclick = () => { beep(); o.close(); };
  o.querySelector('[data-yes]').onclick = () => { beep(); o.close(); onYes?.(); };
  return o;
}
function reward({ img = 'li_xi.webp', amount = 500, text = 'Lì xì đầu năm đã vào ví của bạn!' }) {
  S.coins += amount; save(); beep('coin');
  const o = overlay({ title: 'PHẦN THƯỞNG', width: 700, close: false, body: `<div style="position:relative;width:300px;height:280px"><div style="position:absolute;inset:-10px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,230,115,1),rgba(255,230,115,0))"></div><img src="${IMG(img)}" style="position:absolute;inset:20px;width:260px;height:240px;object-fit:contain"></div>
    <div style="font-weight:900;font-size:64px;color:var(--red)">+${fmt(amount)} XU</div><div style="font-weight:600;font-size:28px">${text}</div><button class="btn btn-l green" style="width:100%">NHẬN</button>` });
  o.querySelector('.btn').onclick = () => { beep(); o.close(); refreshCoins(); };
}
function refreshCoins() { document.querySelectorAll('[data-coins]').forEach(e => e.textContent = fmt(S.coins)); }

/* ---------- UI helpers ---------- */
const btn = (label, { color = 'red', size = 'l', icon = null, attrs = '', style = '' } = {}) => {
  const ink = (color === 'yellow' || color === 'white') ? 'var(--brown)' : '#fff';
  return `<button class="btn btn-${size} ${color}" ${attrs} style="${style}">${icon ? ic(icon, ink) : ''}<span>${label}</span></button>`;
};
const navbtn = (label = 'QUAY LẠI', dir = 'left', attrs = 'data-back') => `<button class="navbtn" ${attrs}><span class="c">${ic(dir === 'left' ? 'arrow-left' : 'arrow-right', 'var(--brown)')}</span>${label}</button>`;
const banner = (title, color = 'red', sub = '') => `<div class="banner ${color}"><div class="in">${title}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;
const ball = (n, cls = '') => `<div class="ball ${cls} ${n > 45 ? 'g' : ''}">${n}</div>`;
const podium = (green = false, style = '') => `<div class="podium ${green ? 'g' : ''}" style="${style}"><div class="b"></div><div class="m"></div><div class="t"></div><div class="r"></div><div class="s"></div></div>`;
const coinPill = (attrs = '') => `<div class="pill" ${attrs}><img src="${IMG('coin.webp')}" width="60" height="60"><span data-coins style="font-size:30px;color:var(--textd)">${fmt(S.coins)}</span></div>`;
const bgGame = () => `<div class="bg-game"><div class="in">${fadedBalls(22, 99, 0.22)}</div></div>`;
function fadedBalls(n, seed, op) { let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; let h = ''; const placed = [];
  for (let t = 0; placed.length < n && t < 3000; t++) { const x = r() * 1850 - 30, y = r() * 1000 - 30; if (placed.some(([a, b]) => Math.hypot(a - x, b - y) < 210)) continue; placed.push([x, y]);
    h += `<div class="fball" style="left:${x}px;top:${y}px;transform:rotate(${r() * 80 - 40}deg) scale(${.6 + r() * .35});opacity:${op}">${String(1 + Math.floor(r() * 90)).padStart(2, '0')}</div>`; } return h; }
function bgOnb() { let seeds = ''; const kinds = [['22px','40px','var(--red)'],['24px','24px','var(--or5)'],['22px','40px','var(--green)'],['24px','24px','var(--blue)']]; let i = 0;
  const put = (x, y, rot) => { const [w, h, c] = kinds[i++ % 4]; seeds += `<div class="seed" style="left:${x}px;top:${y}px;width:${w};height:${h};background:${c};transform:translate(-50%,-50%) rotate(${h === '40px' ? 30 + rot : 0}deg)"></div>`; };
  for (let x = 120; x <= 1820; x += 112) { put(x, 54, 0); } for (let y = 150; y <= 960; y += 112) put(1866, y + 56, 90);
  for (let x = 1820; x >= 120; x -= 112) put(x - 56, 1026, 0); for (let y = 960; y >= 150; y -= 112) put(54, y, 90);
  return `<div class="bg-onb"><div class="band"></div><div class="dash"></div>${seeds}<div class="panel-o">${fadedBalls(34, 7, .55)}</div><div class="panel-b"></div></div>`; }
const logo = (scale = 1) => `<div class="col" style="align-items:center">${jd('MẬT VỤ', { h: 130 * scale, sw: 7 })}<div style="margin-top:${-55 * scale}px">${jd('LÔ TÔ', { h: 200 * scale, fill: 'var(--red)', sw: 8 })}</div></div>`;
function on(root, sel, fn) { root.querySelectorAll(sel).forEach(el => el.addEventListener('click', e => { beep(); fn(e, el); })); }
function wireCommon(root) { on(root, '[data-back]', () => back()); on(root, '[data-go]', (e, el) => go(el.dataset.go)); }
function confetti(root, n = 60) { const cols = ['#D63B2F', '#F7C531', '#2FA24A', '#3A5797', '#F4B550']; for (let i = 0; i < n; i++) { const c = document.createElement('div'); c.className = 'confetti';
  c.style.cssText = `left:${Math.random() * 1920}px;top:${-40 - Math.random() * 400}px;background:${cols[i % 5]};animation-duration:${2.5 + Math.random() * 2.5}s;animation-delay:${Math.random()}s;transform:rotate(${Math.random() * 180}deg)`; root.appendChild(c); } }
