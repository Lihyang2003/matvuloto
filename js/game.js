/* ===== Gameplay: secret teams · missions · carry / hide / store numbers · proximity chat ===== */
const WORLD = { w: 5120, h: 6134 };
const G = {};
const TEAM_NAME = { red: 'Đội Đỏ', green: 'Đội Xanh' }, TEAM_C = { red: 'var(--lred)', green: 'var(--lgreen)' };
const otherT = t => (t === 'red' ? 'green' : 'red');
const rr = (a, b) => a + Math.random() * (b - a);
const pickOne = a => a[Math.random() * a.length | 0];
const mmss = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
// team target sequences: the ticket only shows a riddle, players work out which 5 numbers belong to them
const SEQS = [
  { nums: [8, 20, 27, 83, 86], hint: ['NĂM ĐINH MÙI', 'PHÁT TÀI PHÁT LỘC'] },
  { nums: [1, 15, 39, 68, 79], hint: ['MÙNG MỘT, RẰM THÁNG GIÊNG', 'LỘC PHÁT, HAI ÔNG THẦN TÀI'] },
  { nums: [2, 9, 19, 45, 88], hint: ['NGÀY QUỐC KHÁNH ĐẦU TIÊN', 'PHÁT PHÁT'] }];
const ACTIONS = [{ id: 'jump2', label: 'NHẢY LÊN 2 LẦN' }, { id: 'sit2', label: 'NGỒI XUỐNG 2 LẦN' }];
const BOT_POOL = [['chuot', 'Chuột chít'], ['rong', 'Rồng vàng'], ['khi', 'Khỉ lém'], ['ngua', 'Ngựa ô'], ['heo', 'Heo ủn'], ['ho', 'Hổ con'], ['meo', 'Mèo mướp'], ['cho', 'Cún nhà'], ['ga', 'Gà gáy'], ['trau', 'Trâu vàng'], ['ran', 'Rắn lục'], ['de', 'Dê con']];
const STATIONS = [
  { id: 'bep', name: 'Nhóm bếp lửa', ico: '🔥', kind: 'solo', x: 4352, y: 2100 },
  { id: 'bantho', name: 'Lau bàn thờ', ico: '🕯️', kind: 'solo', x: 3290, y: 4380 },
  { id: 'ga', name: 'Cho gà ăn', ico: '🐔', kind: 'solo', x: 1430, y: 1950 },
  { id: 'mai', name: 'Tưới cây mai', ico: '🌼', kind: 'solo', x: 1010, y: 4990 },
  { id: 'banh', name: 'Gói bánh chưng', ico: '🍃', kind: 'team', x: 4019, y: 2406 }];
const KHO = { red: { x: 2280, y: 3260 }, green: { x: 4260, y: 3260 } };
const EVENT_AT = { x: 3226, y: 5960, r: 560 };
const MATCH_T = 480, CARRY_T = 60, START = [3226, 5880], ST_R = { solo: 200, team: 230 };
const RHYMES = ['Tháng Giêng là tháng ăn chơi, tháng Hai trồng đậu, trồng khoai, trồng cà…', 'Ai về Bình Định mà coi, con gái Bình Định bỏ roi đi quyền…',
  'Đi đâu cho thiếp theo cùng, đói no thiếp chịu, lạnh lùng thiếp cam…', 'Bầu ơi thương lấy bí cùng, tuy rằng khác giống nhưng chung một giàn…',
  'Công cha như núi Thái Sơn, nghĩa mẹ như nước trong nguồn chảy ra…', 'Thằng Bờm có cái quạt mo, phú ông xin đổi ba bò chín trâu…'];
const VOICE = ['Ai cùng đội thì làm ám hiệu coi!', 'Tui vừa làm xong nhiệm vụ nè 😎', 'Số {n} là của đội nào vậy ta?', 'Đừng tin {p} nha, lừa đó!', 'Tui cùng đội với bạn mà 😉',
  'Có ai thấy số rơi ở đâu không?', 'Giấu số ở chỗ cho gà ăn đi!', 'Ủa ai vừa nhảy 2 cái vậy?', 'Đội mình được mấy số rồi?', 'Tui đâu có giấu số của ai đâu…', 'Ra sân trước nghe hô số kìa!', 'Kho bên trái hay bên phải ta?'];

/* ---------- match setup (made in the countdown so it can reveal your secret team) ---------- */
let MATCH = null;
function makeMatch() {
  const N = Math.max(4, Math.min(12, (typeof ROOM !== 'undefined' && ROOM && ROOM.players) || 8));
  const roster = [{ k: S.char, n: 'Bạn', me: true }, ...BOT_POOL.filter(b => b[0] !== S.char).slice(0, N - 1).map(([k, n]) => ({ k, n }))].sort(() => Math.random() - .5);
  roster.forEach((p, i) => p.team = i % 2 ? 'green' : 'red');
  const seqs = [...SEQS].sort(() => Math.random() - .5), acts = [...ACTIONS].sort(() => Math.random() - .5), T = {};
  ['red', 'green'].forEach((t, i) => T[t] = { seq: [...seqs[i].nums], hint: seqs[i].hint, action: acts[i], size: roster.filter(p => p.team === t).length });
  const me = roster.find(p => p.me); T[me.team].card = makeCard(T[me.team].seq);
  const tm = (typeof ROOM !== 'undefined' && ROOM) ? ROOM.time : 4;
  MATCH = { roster, T, myTeam: me.team, evEvery: { 2: 75, 4: 105, 6: 135 }[tm] || 0 };
  return MATCH;
}
const curMatch = () => (!MATCH || MATCH.used ? makeMatch() : MATCH);
function makeCard(target) { // 2 blocks x 3 rows x 9 cols, 5 numbers a row; the team's numbers hide in one row
  const pool = Array.from({ length: 90 }, (_, i) => i + 1).filter(n => !target.includes(n)).sort(() => Math.random() - .5); let pi = 0;
  return Array.from({ length: 6 }, (_, r) => { const nums = (r === 4 ? [...target] : pool.slice(pi, pi += 5)).sort((a, b) => a - b);
    const cols = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - .5).slice(0, 5).sort((a, b) => a - b), row = Array(9).fill(0); cols.forEach((c, i) => row[c] = nums[i]); return row; });
}

/* ---------- collision: walls block, porch steps need a jump ---------- */
const GRID = { ready: false };
function loadGrid() { if (GRID.ready || GRID.loading) return; GRID.loading = true; const im = new Image();
  im.onload = () => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, im.width, im.height).data;
    const W = im.width, H = im.height, g = new Uint8Array(W * H); for (let i = 0; i < g.length; i++) g[i] = d[i * 4] > 200 ? 1 : d[i * 4] > 60 ? 2 : 0;
    const nav = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let x2 = 0; x2 < W; x2++) { let b = 0; for (let dy = -1; dy <= 1 && !b; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x2 + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H || g[yy * W + xx] === 1) { b = 1; break; } } nav[y * W + x2] = b; }
    Object.assign(GRID, { W, H, g, nav, ready: true }); };
  im.src = IMG('collision.png'); }
loadGrid();
const cellAt = (x, y) => { if (!GRID.ready) return 0; const gx = x / 20 | 0, gy = y / 20 | 0; return gx < 0 || gy < 0 || gx >= GRID.W || gy >= GRID.H ? 1 : GRID.g[gy * GRID.W + gx]; };
const FOOT = [[-22, 0], [22, 0], [0, -9], [0, 9]];
function canMove(e, nx, ny) {
  for (const [ox, oy] of FOOT) if (cellAt(nx + ox, ny + oy) === 1) return false;
  if (cellAt(nx, ny) === 2 && cellAt(e.x, e.y) !== 2 && !(e.jump > 0) && ny <= e.y) { e.stepBlock = true; return false; }  // stepping up the porch needs a jump
  return true;
}
const D8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
function navPath(sx, sy, tx, ty) {
  if (!GRID.ready) return [[tx, ty]];
  const { W, H, nav } = GRID, idx = (x, y) => Math.max(0, Math.min(H - 1, y / 20 | 0)) * W + Math.max(0, Math.min(W - 1, x / 20 | 0));
  const free = c => { if (!nav[c]) return c; const cx = c % W, cy = c / W | 0; for (let r = 1; r < 8; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const x = cx + dx, y = cy + dy; if (x >= 0 && y >= 0 && x < W && y < H && !nav[y * W + x]) return y * W + x; } return c; };
  const s = free(idx(sx, sy)), t = free(idx(tx, ty)), prev = new Int32Array(W * H).fill(-1), q = new Int32Array(W * H); let qh = 0, qt = 0; q[qt++] = s; prev[s] = s;
  while (qh < qt) { const c = q[qh++]; if (c === t) break; const cx = c % W, cy = c / W | 0;
    for (const [dx, dy] of D8) { const x = cx + dx, y = cy + dy; if (x < 0 || y < 0 || x >= W || y >= H) continue; const ni = y * W + x; if (prev[ni] !== -1 || nav[ni]) continue; if (dx && dy && (nav[cy * W + x] || nav[y * W + cx])) continue; prev[ni] = c; q[qt++] = ni; } }
  if (prev[t] === -1) return null;
  const path = []; for (let c = t; c !== s; c = prev[c]) path.push(c); path.reverse();
  const out = path.filter((_, i) => i % 4 === 3 || i === path.length - 1).map(c => [(c % W) * 20 + 10, (c / W | 0) * 20 + 10]); out.push([tx, ty]); return out;
}
function randomFree() { for (let i = 0; i < 200; i++) { const x = rr(400, 4700), y = rr(1000, 5900); if (!GRID.ready || !GRID.nav[(y / 20 | 0) * GRID.W + (x / 20 | 0)]) return [x, y]; } return START; }

/* ---------- screen ---------- */
SCREENS.game = {
  html: () => { const M = curMatch(), t = M.myTeam, T = M.T[t];
    return `<div class="abs" style="inset:0;background:#c97a5d;overflow:hidden" id="view"><div id="world"><div class="map"></div><div id="balls"></div></div></div>
    <div class="hud">
      <div class="abs teambar" data-ticket style="left:24px;top:24px"><div class="lbl">DÃY<br>SỐ<br>ĐỘI</div><div id="tbar" class="row" style="gap:12px"></div></div>
      <div class="abs secret" data-ticket style="left:24px;top:172px"><i style="background:${TEAM_C[t]}"></i><b>${TEAM_NAME[t].toUpperCase()}</b><span>· Ám hiệu: ${T.action.label.toLowerCase()} ·</span><u>Xem vé</u></div>
      <div class="abs pill" data-mission style="left:50%;transform:translateX(-50%);top:30px;gap:12px;padding:10px 24px 12px 18px;cursor:pointer">${ic('clock', 'var(--red)', 34)}<b id="timer" style="font-weight:900;font-size:32px;color:var(--red);min-width:84px">${mmss(MATCH_T)}</b><span style="width:3px;height:34px;background:var(--brown5)"></span>
        <span style="font-weight:700;font-size:22px">Kho đội:</span><span id="mine" class="tag" style="font-size:22px;background:${TEAM_C[t]};color:#fff">0/5</span><span style="font-weight:700;font-size:22px">Đối thủ:</span><span id="opp" class="tag" style="font-size:22px;background:${TEAM_C[otherT(t)]};color:#fff">0/5</span><span id="rinhTag" class="tag red hidden" style="font-size:20px">RÌNH!</span></div>
      <div class="abs evpill" id="evpill" style="left:50%;transform:translateX(-50%);top:120px">${ic('bell', 'var(--gold)', 26)}<span id="evtxt">Quản trò hô số sau…</span></div>
      <div class="abs iconbtn" data-mic id="mic" style="left:1388px;top:44px;width:100px;height:100px" title="Mic theo khoảng cách (V)">${ic('mic', 'var(--brown)', 54)}</div>
      <div class="abs iconbtn" data-settings style="left:1500px;top:44px;width:100px;height:100px">${ic('settings', 'var(--brown)', 60)}</div>
      <div class="abs minimap" data-minimap style="left:1630px;top:20px"><div class="mm" id="mm"></div></div><span class="abs tag cream" data-minimap style="left:1712px;top:272px;font-size:20px;cursor:pointer">BẢN ĐỒ</span>
      <div class="joy" id="joy"><div class="ring"></div>${[[168, 30], [168, 306], [30, 168], [306, 168]].map(([x, y]) => `<div class="clover" style="left:${x}px;top:${y}px"><i style="left:11px;top:0"></i><i style="left:11px;top:22px"></i><i style="left:0;top:11px"></i><i style="left:22px;top:11px"></i></div>`).join('')}<div class="knob" id="knob"></div></div>
      <div class="carry" id="carry" style="right:28px;top:548px"></div>
      <div class="hudbtn" data-bag style="left:1700px;top:636px;background:var(--or3)"><img src="${IMG('pouch.webp')}" style="width:166px;height:166px;border-radius:50%"><span class="dot-badge hidden" id="bagn">0</span></div>
      <div class="hudbtn sm" id="bSit" style="left:1508px;top:690px">${jd('NGỒI', { h: 70, fill: 'var(--or5)', sw: 4 })}</div>
      <div class="hudbtn" id="bJump" style="left:1466px;top:858px">${jd('NHẢY', { h: 92, fill: 'var(--or5)', sw: 5 })}</div>
      <div class="hudbtn" id="bPick" style="left:1700px;top:858px">${jd('LỤM', { h: 108, fill: 'var(--or5)', sw: 5 })}</div>
      <div class="ctx hidden" id="ctx"></div>
      <div class="abs" style="left:50%;transform:translateX(-50%);bottom:14px;background:rgba(59,26,18,.6);color:var(--cream);border-radius:999px;padding:8px 22px 10px;font-weight:700;font-size:19px;white-space:nowrap">WASD / joystick: đi · Space: nhảy · C: ngồi · E: lụm · F: nhiệm vụ · B: túi · M: bản đồ · V: mic</div>
    </div>`; },
  mount(el) { startGame(el); },
  leave() { G.running = false; cancelAnimationFrame(G.raf); removeEventListener('keydown', G.kd); removeEventListener('keyup', G.ku); }
};

function startGame(el) {
  const M = curMatch(); M.used = true;
  Object.assign(G, { el, M, running: true, t: MATCH_T, cx: 0, cy: 0, camInit: false, keys: {}, joy: [0, 0], last: performance.now(), done: false, jumps: 0, missions: 0, mic: true,
    myTeam: M.myTeam, T: M.T, N: {}, seen: { red: [], green: [] }, kho: { red: new Set(), green: new Set() }, rinh: {}, knownOpp: new Set(), ground: [], st: {}, myCool: {},
    ev: null, evNext: M.evEvery || rr(70, 120), oppTM: rr(95, 125), oppTMA: null, recruitT: 0, hintT: 0, warned: {}, ctxSig: '', carrySig: null, barSig: null });
  for (const t of ['red', 'green']) for (const n of G.T[t].seq) G.N[n] = { n, team: t, st: 'pool' };
  STATIONS.forEach(s => G.st[s.id] = { ...s, cool: 0, hidden: [] });
  const $ = s => el.querySelector(s);
  G.world = $('#world'); G.ballsEl = $('#balls'); G.mm = $('#mm');
  // world markers: mission stations (yellow), team stores, gathering zone
  G.ballsEl.insertAdjacentHTML('beforeend', STATIONS.map(s => `<div class="wst ${s.kind}" style="transform:translate(${s.x}px,${s.y}px);z-index:${s.y - 80}"><div class="ring"></div><div class="lb">${s.name}${s.kind === 'team' ? ' · NV chung' : ''}</div><div class="ico">${s.ico}</div></div>`).join('')
    + ['red', 'green'].map(t => `<div class="wst kho ${t}" style="transform:translate(${KHO[t].x}px,${KHO[t].y}px);z-index:${KHO[t].y - 80}"><div class="ring"></div><div class="lb">KHO ${TEAM_NAME[t].toUpperCase()}</div><div class="ico">${ic('home', TEAM_C[t])}</div></div>`).join('')
    + `<div class="wev off" id="wev" style="transform:translate(${EVENT_AT.x}px,${EVENT_AT.y}px);z-index:1"><div class="ring"></div><div class="lb">📢 TẬP HỢP NGHE QUẢN TRÒ HÔ SỐ</div></div>`);
  // entities: you + bots, teams are secret (neutral name tags)
  const others = M.roster.filter(p => !p.me);
  G.me = makeEnt(S.char, 'Bạn', 'me', START[0], START[1]); G.me.team = M.myTeam; G.me.isMe = true;
  Object.defineProperty(G, 'px', { configurable: true, get: () => G.me.x }); Object.defineProperty(G, 'py', { configurable: true, get: () => G.me.y });
  G.bots = others.map((p, i) => { const a = i / others.length * Math.PI * 2, e = makeEnt(p.k, p.n, 'x', START[0] + Math.cos(a) * rr(260, 600), START[1] + 40 + Math.sin(a) * rr(60, 120));
    Object.assign(e, { team: p.team, speedK: rr(.5, .72), wait: rr(.5, 2.5), voiceT: rr(3, 12), actCool: rr(4, 10), talk: 0, seq: [] }); return e; });
  G.mmS = 270 / 1700; G.mm.style.width = WORLD.w * G.mmS + 'px'; G.mm.style.height = WORLD.h * G.mmS + 'px';
  renderBar(); renderCarry();
  // input
  G.kd = e => { if (cur !== 'game') return; const k = e.key.toLowerCase(); G.keys[k] = true; if (e.repeat) return;
    if (k === ' ') { e.preventDefault(); doJump(); } if (k === 'e') doPick(); if (k === 'c') doSit(); if (k === 'f') ctxPrimary(); if (k === 'v') toggleMic();
    if (k === 'escape') openPause(); if (k === 'm') openMap(); if (k === 'b') openBag(); if (k === 't') openTicket(); };
  G.ku = e => { G.keys[e.key.toLowerCase()] = false; };
  addEventListener('keydown', G.kd); addEventListener('keyup', G.ku);
  const joy = $('#joy'), knob = $('#knob');
  const jmove = e => { const [x, y] = toStage(e.clientX, e.clientY); let dx = x - (70 + 190), dy = y - (660 + 190); const d = Math.hypot(dx, dy), m = 120; if (d > m) { dx *= m / d; dy *= m / d; } knob.style.transform = `translate(${dx}px,${dy}px)`; G.joy = [dx / m, dy / m]; };
  joy.addEventListener('pointerdown', e => { joy.setPointerCapture(e.pointerId); jmove(e); });
  joy.addEventListener('pointermove', e => { if (joy.hasPointerCapture(e.pointerId)) jmove(e); });
  const jend = () => { knob.style.transform = ''; G.joy = [0, 0]; }; joy.addEventListener('pointerup', jend); joy.addEventListener('pointercancel', jend);
  const press = (b, fn) => { b.addEventListener('pointerdown', e => { e.preventDefault(); b.classList.add('pressed'); fn(); }); b.addEventListener('pointerup', () => b.classList.remove('pressed')); b.addEventListener('pointerleave', () => b.classList.remove('pressed')); };
  press($('#bJump'), doJump); press($('#bPick'), doPick); press($('#bSit'), doSit);
  on(el, '[data-bag]', openBag); on(el, '[data-minimap]', openMap); on(el, '[data-settings]', openPause); on(el, '[data-ticket]', openTicket); on(el, '[data-mic]', toggleMic);
  on(el, '[data-mission]', () => toast('Tìm 5 số của đội (xem gợi ý trong VÉ) rồi cất vào KHO đội. Số lạ thì đem giấu!', 'info', 'ticket'));
  G.raf = requestAnimationFrame(loop);
  setTimeout(() => cur === 'game' && toast('Bấm vào DÃY SỐ ĐỘI (góc trái) để xem vé và gợi ý!', 'info', 'ticket'), 900);
}

function loop(now) {
  if (!G.running) return; G.raf = requestAnimationFrame(loop);
  const dt = Math.min(.05, (now - G.last) / 1000); G.last = now;
  if (ovRoot.children.length) return; // paused while a popup is open
  G.t -= dt; if (G.t <= 0 && !G.done) return timeUp();
  for (const e of [G.me, ...G.bots]) tickCarry(e, dt);
  for (const s of Object.values(G.st)) s.cool = Math.max(0, s.cool - dt);
  for (const k in G.myCool) G.myCool[k] = Math.max(0, G.myCool[k] - dt);
  tickEvent(dt); tickTeamMission(dt);
  if (G.done) return;
  let ix = (G.keys['arrowright'] || G.keys['d'] ? 1 : 0) - (G.keys['arrowleft'] || G.keys['a'] ? 1 : 0) + G.joy[0];
  let iy = (G.keys['arrowdown'] || G.keys['s'] ? 1 : 0) - (G.keys['arrowup'] || G.keys['w'] ? 1 : 0) + G.joy[1];
  const l = Math.hypot(ix, iy); if (l > 1) { ix /= l; iy /= l; }
  if (l > .2 && G.me.sitting) G.me.sitting = false; if (G.me.sitting) ix = iy = 0;
  animEnt(G.me, dt, now, ix, iy, 820);
  if (G.me.stepBlock && !(G.me.jump > 0)) stepHint();
  for (const e of G.bots) botThink(e, dt, now);
  const tx = Math.max(0, Math.min(WORLD.w - 1920, G.me.x + G.me.vx * .3 - 960)), ty = Math.max(0, Math.min(WORLD.h - 1080, G.me.y + G.me.vy * .3 - 620));
  if (!G.camInit) { G.cx = tx; G.cy = ty; G.camInit = true; } else { const ck = 1 - Math.exp(-dt * 6); G.cx += (tx - G.cx) * ck; G.cy += (ty - G.cy) * ck; }
  G.world.style.transform = `translate(${-G.cx.toFixed(1)}px,${-G.cy.toFixed(1)}px)`;
  G.mm.style.left = (135 - G.px * G.mmS) + 'px'; G.mm.style.top = (135 - G.py * G.mmS) + 'px';
  if (!G._hudT || now - G._hudT > 150) { G._hudT = now; hud(now); }
}

/* ---------- numbers ---------- */
const nonOwn = e => e.carry.filter(n => G.N[n].team !== e.team).length;
function rollNumber(e, guaranteed) {
  const t = e.team, ownLeft = G.T[t].seq.filter(n => G.N[n].st === 'pool'), oppLeft = G.T[otherT(t)].seq.filter(n => G.N[n].st === 'pool');
  let type; if (guaranteed) type = 'own'; else { const r = Math.random(), po = e.isMe ? .4 : .07, pp = e.isMe ? .28 : .2; type = r < po ? 'own' : r < po + pp ? 'opp' : 'noise'; }
  if (type === 'own' && !ownLeft.length) { if (guaranteed) return 0; type = oppLeft.length ? 'opp' : 'noise'; }
  if (type === 'opp' && !oppLeft.length) type = 'noise';
  if (type === 'own') return pickOne(ownLeft); if (type === 'opp') return pickOne(oppLeft);
  const free = []; for (let n = 1; n <= 90; n++) if (!G.N[n]) free.push(n); const n = pickOne(free); G.N[n] = { n, team: null, st: 'pool' }; return n;
}
function giveNumber(e, n) { const r = G.N[n]; Object.assign(r, { st: 'carry', who: e, at: null, t: CARRY_T }); if (!e.carry.includes(n)) e.carry.push(n);
  if (r.team === e.team && !G.seen[e.team].includes(n)) { G.seen[e.team].push(n); checkRinh(e.team); } G.warned[n] = false; }
function takeOut(e, n) { const i = e.carry.indexOf(n); if (i >= 0) e.carry.splice(i, 1); }
function storeNumber(e, n) { const r = G.N[n]; takeOut(e, n); Object.assign(r, { st: 'kho', who: null }); G.kho[e.team].add(n);
  if (!G.seen[e.team].includes(n)) G.seen[e.team].push(n);
  const isMine = e.team === G.myTeam, tag = G.el.querySelector(isMine ? '#mine' : '#opp'); tag.textContent = G.kho[e.team].size + '/5'; tag.classList.remove('bump'); void tag.offsetWidth; tag.classList.add('bump');
  if (e.isMe) toast(`Đã cất số ${n} vào kho – kho đội ${G.kho[e.team].size}/5`, 'ok', 'home'); else if (!isMine) beep('bad');
  if (G.kho[e.team].size >= 5) endGame(e.team); }
function hideNumber(e, n, s) { takeOut(e, n); Object.assign(G.N[n], { st: 'hidden', who: null, at: s.id }); s.hidden.push(n); }
function dropNumber(e, n) { takeOut(e, n); const x = e.x + rr(-60, 60), y = e.y + rr(10, 50); Object.assign(G.N[n], { st: 'ground', who: null, x, y });
  const b = { n, x, y, el: document.createElement('div') }; b.el.className = 'wball decoy drop'; b.el.style.left = x + 'px'; b.el.style.top = y + 'px'; b.el.style.zIndex = Math.round(y); b.el.innerHTML = `<div class="glow"></div>${ball(n, 'sm')}`;
  G.ballsEl.appendChild(b.el); G.ground.push(b); if (e.isMe) { toast(`Hết 60 giây – số ${n} đã rơi xuống đất!`, 'bad', 'clock'); beep('drop'); } }
function pickGround(e, b) { const i = G.ground.indexOf(b); if (i < 0) return; G.ground.splice(i, 1); b.el.classList.add('pop'); setTimeout(() => b.el.remove(), 360); giveNumber(e, b.n); }
function tickCarry(e, dt) { for (const n of [...e.carry]) { const r = G.N[n]; r.t -= dt;
  if (e.isMe && r.t <= 10 && !G.warned[n]) { G.warned[n] = true; toast(`Số ${n} sắp rơi – còn 10 giây!`, 'bad', 'clock'); }
  if (r.t <= 0) dropNumber(e, n); } }
function checkRinh(t) { if (G.rinh[t] || G.seen[t].length < 4) return; G.rinh[t] = true; const mine = t === G.myTeam;
  const d = document.createElement('div'); d.className = 'rinh'; d.innerHTML = `<div class="col center"><div class="w">${jd('RÌNH!', { h: 260, fill: 'var(--red)', sw: 12 })}</div><div class="s">${mine ? 'Đội bạn đã có 4 số – chỉ còn 1 số nữa!' : 'Một đội đã tìm được 4 số – coi chừng!'}</div></div>`;
  G.el.appendChild(d); setTimeout(() => d.remove(), 2700); shake(stage, 14); beep('kinh'); G.el.querySelector('#rinhTag').classList.remove('hidden'); }

/* ---------- player actions ---------- */
function doJump() { if (G.me.jump > 0 || ovRoot.children.length || G.done) return; G.me.sitting = false; G.me.jump = .5; G.jumps++; beep('jump'); noteMyAction('jump'); }
function doSit() { if (ovRoot.children.length || G.done) return; G.me.sitting = !G.me.sitting; beep('pop'); if (G.me.sitting) noteMyAction('sit'); }
function noteMyAction(kind) { const now = performance.now(); G.myActs = (G.myActs || []).filter(a => now - a.t < 1900 && a.kind === kind); G.myActs.push({ kind, t: now });
  if (G.myActs.length < 2) return; G.myActs = []; const act = kind === 'jump' ? 'jump2' : 'sit2';
  G.bots.filter(b => Math.hypot(b.x - G.me.x, b.y - G.me.y) < 760).forEach(b => { const theirs = act === G.T[b.team].action.id;
    if (Math.random() < (theirs ? .85 : .18)) setTimeout(() => { if (G.running && !b.seq.length) teamSignal(b, act); }, 500 + Math.random() * 900); }); }
function doPick() { if (ovRoot.children.length || G.done) return; const b = nearestGround();
  if (!b) return toast('Không có số nào rơi ở gần – làm nhiệm vụ ở các chấm vàng để nhận số!', 'bad');
  const own = G.N[b.n].team === G.myTeam; if (!own && nonOwn(G.me) >= 2) return toast('Túi đã có 2 số lạ – đem giấu bớt rồi mới lụm thêm!', 'bad', 'eye');
  pickGround(G.me, b); const sx = b.x - G.cx, sy = b.y - G.cy - 70; burst(sx, sy, { n: own ? 12 : 6, dist: 110 }); beep(own ? 'pick' : 'coin');
  floatText(sx, sy - 50, own ? 'SỐ CỦA ĐỘI!' : 'Số lạ…', own ? 'var(--gold)' : '#fff');
  toast(own ? `Lụm số ${b.n} – SỐ CỦA ĐỘI BẠN! Mang về kho.` : `Lụm số ${b.n} – không thuộc dãy của đội bạn. Đem giấu trong 60s!`, own ? 'ok' : 'info', own ? 'check' : 'eye'); renderBar(); renderCarry(); }
function nearestGround() { let best = null, bd = 150; for (const b of G.ground) { const d = Math.hypot(b.x - G.px, b.y - G.py); if (d < bd) { bd = d; best = b; } } return best; }
function stepHint() { const now = performance.now(); if (now - G.hintT < 3500) return; G.hintT = now; toast('Bậc thềm cao – bấm NHẢY (Space) để bước lên!', 'info', 'zap');
  const j = G.el.querySelector('#bJump'); j.classList.add('ready'); setTimeout(() => j.classList.remove('ready'), 1500); }
function toggleMic() { G.mic = !G.mic; const m = G.el.querySelector('#mic'); m.classList.toggle('off', !G.mic); m.innerHTML = ic(G.mic ? 'mic' : 'mic-off', 'var(--brown)', 54);
  toast(G.mic ? 'Đã bật mic – người ở gần sẽ nghe thấy bạn' : 'Đã tắt mic – bạn vẫn nghe người ở gần', 'info', G.mic ? 'mic' : 'mic-off'); }

/* ---------- context (what you can do where you stand) ---------- */
const inEvent = e => Math.hypot(e.x - EVENT_AT.x, (e.y - EVENT_AT.y) * 1.6) < EVENT_AT.r;
function ctxTarget() { const me = G.me;
  for (const s of Object.values(G.st)) if (Math.hypot(me.x - s.x, me.y - s.y) < ST_R[s.kind]) return { type: 'st', s };
  for (const t of ['red', 'green']) if (Math.hypot(me.x - KHO[t].x, me.y - KHO[t].y) < 230) return { type: 'kho', t };
  if (G.ev && inEvent(me)) return { type: 'ev' }; return null; }
const teamAt = (t, s) => [G.me, ...G.bots].filter(e => e.team === t && Math.hypot(e.x - s.x, e.y - s.y) < ST_R.team + 40).length;
const needOf = t => Math.ceil(G.T[t].size / 2);
function ctxHTML(c) { const sb = (l, o) => btn(l, { size: 's', ...o });
  if (c.type === 'st' && c.s.kind === 'solo') { const cd = G.myCool[c.s.id] || 0, no = nonOwn(G.me);
    return [`<div class="ci">${c.s.ico}</div><div class="ct"><b>${c.s.name}</b><span>Nhiệm vụ đơn · ${cd ? 'hồi lại sau ' + mmss(cd) : 'làm xong nhận 1 số'}</span></div>`
      + sb('LÀM NHIỆM VỤ', { color: cd ? 'white' : 'green', icon: 'play', attrs: `data-cx="do" ${cd ? 'disabled' : ''}` }) + sb('TÌM SỐ GIẤU', { color: 'yellow', icon: 'search', attrs: 'data-cx="search"' })
      + (no ? sb('GIẤU SỐ', { color: 'blue', icon: 'eye-off', attrs: 'data-cx="bag"' }) : ''), `s${c.s.id}${Math.ceil(cd)}${no}`]; }
  if (c.type === 'st') { const k = teamAt(G.myTeam, c.s), need = needOf(G.myTeam), ok = k >= need, cd = c.s.cool;
    return [`<div class="ci" style="background:#bcd0f5">${c.s.ico}</div><div class="ct"><b>${c.s.name} · NV CHUNG</b><span>Cần ít nhất ${need} người cùng đội có mặt</span></div><div class="cnt ${ok ? 'ok' : ''}">${k}/${need}</div>`
      + (cd ? sb('HỒI ' + mmss(cd), { color: 'white', icon: 'clock', attrs: 'data-cx="do" disabled' }) : sb(ok ? 'BẮT ĐẦU' : 'CHỜ ĐỒNG ĐỘI…', { color: ok ? 'green' : 'white', icon: ok ? 'play' : 'users', attrs: `data-cx="do" ${ok ? '' : 'disabled'}` }))
      + (nonOwn(G.me) ? sb('GIẤU SỐ', { color: 'blue', icon: 'eye-off', attrs: 'data-cx="bag"' }) : ''), `t${k}${Math.ceil(cd)}${nonOwn(G.me)}`]; }
  if (c.type === 'kho') { const mine = c.t === G.myTeam, own = G.me.carry.filter(n => G.N[n].team === G.myTeam).length;
    return [`<div class="ci" style="background:${TEAM_C[c.t]}">${ic('home', '#fff', 46)}</div><div class="ct"><b>KHO ${TEAM_NAME[c.t].toUpperCase()}</b><span>${mine ? `Cất số của đội vào đây · đủ 5 số là KINH!` : 'Kho của đội khác – không cất được'}</span></div>`
      + (mine ? sb(own ? `CẤT ${own} SỐ` : 'CHƯA CÓ SỐ', { color: own ? 'green' : 'white', icon: 'home', attrs: `data-cx="bag" ${own ? '' : 'disabled'}` }) : ''), `k${c.t}${own}`]; }
  return [`<div class="ci" style="background:#ffb3a3">📢</div><div class="ct"><b>SÂN TRƯỚC</b><span>Đứng đây chờ quản trò hô số · còn ${mmss(G.ev.t)}</span></div>`, `e${Math.ceil(G.ev.t)}`];
}
function ctxPrimary() { if (ovRoot.children.length || G.done) return; const b = G.el.querySelector('#ctx:not(.hidden) [data-cx]:not([disabled])'); if (b) b.click(); }
function ctxAct(a) { const c = ctxTarget(); if (!c) return;
  if (a === 'bag') return openBag();
  if (a === 'search' && c.type === 'st') return openSearch(c.s);
  if (a === 'do' && c.type === 'st') { if (c.s.kind === 'solo') { if (G.myCool[c.s.id]) return; if (nonOwn(G.me) >= 2) return toast('Túi đã có 2 số lạ – đem giấu bớt rồi mới làm nhiệm vụ!', 'bad', 'eye'); }
    else if (c.s.cool || teamAt(G.myTeam, c.s) < needOf(G.myTeam)) return; openMission(c.s); } }

/* ---------- HUD refresh ---------- */
function hud(now) {
  const te = G.el.querySelector('#timer'); te.textContent = mmss(G.t); te.classList.toggle('low', G.t <= 30);
  const ev = G.el.querySelector('#evpill'); ev.classList.toggle('hot', !!G.ev); G.el.querySelector('#evtxt').textContent = G.ev ? `NHIỆM VỤ CHUNG: tập hợp ở SÂN TRƯỚC · ${mmss(G.ev.t)}` : `Quản trò hô số sau ${mmss(G.evNext)}`;
  G.el.querySelector('#wev').classList.toggle('off', !G.ev);
  const c = ctxTarget(), box = G.el.querySelector('#ctx');
  if (!c) { if (G.ctxSig) { box.classList.add('hidden'); G.ctxSig = ''; } }
  else { const [h, sig] = ctxHTML(c); if (sig !== G.ctxSig) { G.ctxSig = sig; box.innerHTML = h; box.classList.remove('hidden'); box.querySelectorAll('[data-cx]').forEach(b => b.onclick = () => { beep(); ctxAct(b.dataset.cx); }); } }
  renderBar(); renderCarry();
  for (const e of G.carryEls || []) { const r = G.N[e.dataset.n]; if (!r) continue; e.style.setProperty('--p', Math.max(0, r.t / CARRY_T)); e.classList.toggle('warn', r.t < 15); e.querySelector('span').textContent = Math.max(0, Math.ceil(r.t)) + 's'; }
  G.el.querySelector('#bPick').classList.toggle('ready', !!nearestGround());
  for (const b of G.bots) { const d = Math.hypot(b.x - G.me.x, b.y - G.me.y), vol = b.talk > 0 ? Math.max(0, Math.min(1, 1 - (d - 380) / 620)) : 0; b.bub.style.opacity = vol.toFixed(2); b.nm.classList.toggle('on', vol > .05); }
  G.me.nm.classList.toggle('on', G.mic && G.me.vx * G.me.vx + G.me.vy * G.me.vy < 1 && Math.sin(now / 300) > .3);
  if (!G._mmT || now - G._mmT > 220) { G._mmT = now; const s = G.mmS, P = (x, y) => `left:${x * s}px;top:${y * s}px`;
    G.mm.innerHTML = STATIONS.map(t => `<i class="st ${t.kind}" style="${P(t.x, t.y)}"></i>`).join('') + ['red', 'green'].map(t => `<i class="kho ${t}" style="${P(KHO[t].x, KHO[t].y)}"></i>`).join('')
      + (G.ev ? `<i class="ev" style="${P(EVENT_AT.x, EVENT_AT.y)}"></i>` : '') + G.ground.map(b => `<i class="gb" style="${P(b.x, b.y)}"></i>`).join('')
      + G.bots.map(e => `<i class="bot" style="${P(e.x, e.y)}"></i>`).join('') + `<i class="me" style="${P(G.px, G.py)}"></i>`; }
}
function slotsHTML(team, big) { const seen = G.seen[team]; return Array.from({ length: 5 }, (_, i) => { const n = seen[i]; if (!n) return '<div class="slot"></div>';
  const r = G.N[n], st = r.st === 'kho' ? 'kho' : r.st === 'carry' && r.who && r.who.team === team ? 'carry' : 'lost'; return `<div class="slot ${st}" title="${st === 'kho' ? 'Đã cất kho' : st === 'carry' ? 'Đang được mang về kho' : 'Đang bị rơi / bị giấu'}">${ball(n, big ? '' : 'sm')}</div>`; }).join(''); }
function renderBar() { const sig = G.seen[G.myTeam].map(n => n + G.N[n].st + (G.N[n].who ? G.N[n].who.team : '')).join(); if (sig === G.barSig) return; G.barSig = sig; G.el.querySelector('#tbar').innerHTML = slotsHTML(G.myTeam); }
function renderCarry() { const sig = G.me.carry.join(); const bn = G.el.querySelector('#bagn'); bn.textContent = G.me.carry.length; bn.classList.toggle('hidden', !G.me.carry.length); if (sig === G.carrySig) return; G.carrySig = sig;
  const box = G.el.querySelector('#carry'); box.innerHTML = G.me.carry.map(n => `<div class="cball ${G.N[n].team === G.myTeam ? 'own' : ''}" data-n="${n}" title="Bấm để mở túi">${ball(n, 'xs')}<span></span></div>`).join('');
  G.carryEls = [...box.children]; G.carryEls.forEach(e => e.onclick = () => { beep(); openBag(); }); }

/* ---------- shared events: lô tô caller + team mission ---------- */
function tickEvent(dt) {
  if (!G.ev) { G.evNext -= dt; if (G.evNext <= 0) startEvent(); return; }
  G.ev.t -= dt; if (G.ev.t <= 0) resolveEvent(); }
function startEvent() { G.ev = { t: 22 }; beep('call'); toast('📢 Nhiệm vụ chung! Tập hợp ở SÂN TRƯỚC để nghe quản trò hô số!', 'info', 'bell');
  G.bots.forEach(b => { b.goEvent = Math.random() < .75; if (b.goEvent && !b.seq.length) { b.goal = null; b.wait = 0; b.onArrive = null; } }); }
function resolveEvent() {
  const present = [G.me, ...G.bots].filter(inEvent), meIn = present.includes(G.me);
  G.ev = null; G.evNext = G.M.evEvery || rr(70, 130); G.bots.forEach(b => { if (b.goEvent) { b.goEvent = false; b.goal = null; b.wait = 0; } });
  if (!present.length) return;
  const w = meIn && Math.random() < Math.max(.45, 1 / present.length) ? G.me : pickOne(present.filter(p => p !== G.me).length ? present.filter(p => p !== G.me) : present);
  if (w === G.me) { const oppT = otherT(G.myTeam), cand = G.T[oppT].seq.filter(n => G.N[n].st !== 'kho' && !G.knownOpp.has(n)); const n = pickOne(cand.length ? cand : G.T[oppT].seq); G.knownOpp.add(n); openCaller(n); }
  else toast(meIn ? 'Quản trò đã thì thầm một số cho người chơi khác…' : 'Bạn đã lỡ buổi hô số ở Sân trước!', 'info', 'bell');
}
function tickTeamMission(dt) {
  const s = G.st.banh, meAt = Math.hypot(G.me.x - s.x, G.me.y - s.y) < ST_R.team + 40;
  G.recruitT -= dt;
  if (meAt && !s.cool && G.recruitT <= 0) { G.recruitT = 1.4; if (teamAt(G.myTeam, s) < needOf(G.myTeam)) {
    const b = G.bots.filter(b => b.team === G.myTeam && !b.call && !b.goEvent && !b.carry.some(n => G.N[n].team === b.team)).sort((a, c) => Math.hypot(a.x - s.x, a.y - s.y) - Math.hypot(c.x - s.x, c.y - s.y))[0];
    if (b) { b.call = { wait: 18 }; b.goal = null; b.wait = 0; b.onArrive = null; } } }
  // the other team runs its own team mission now and then
  const oT = otherT(G.myTeam);
  if (!G.oppTMA) { G.oppTM -= dt; if (G.oppTM <= 0 && !s.cool) { G.oppTMA = { t: 30, hold: 0 }; G.bots.filter(b => b.team === oT && !b.goEvent).slice(0, needOf(oT) + 1).forEach(b => { b.call = { wait: 30 }; b.goal = null; b.wait = 0; b.onArrive = null; }); } return; }
  const A = G.oppTMA; A.t -= dt;
  if (teamAt(oT, s) >= needOf(oT)) A.hold += dt;
  if (A.hold > 4 && !s.cool) { const there = G.bots.filter(b => b.team === oT && Math.hypot(b.x - s.x, b.y - s.y) < ST_R.team + 40); const w = pickOne(there); const n = rollNumber(w, true); if (n) giveNumber(w, n); s.cool = 45; A.t = 0; }
  if (A.t <= 0) { G.oppTMA = null; G.oppTM = rr(100, 130); G.bots.forEach(b => { if (b.team === oT && b.call) { b.call = null; b.goal = null; b.wait = 0; } }); }
}

/* ---------- bots ---------- */
function goTo(e, x, y, wait, then) { e.goal = { x, y }; e.path = navPath(e.x, e.y, x, y) || [[x, y]]; e.pi = 0; e.arrWait = wait || 0; e.then = then || null; e.stuckT = 0; e.stuckN = 0; e.sx = e.x; e.sy = e.y; }
function planBot(e) {
  const own = e.carry.filter(n => G.N[n].team === e.team), oth = e.carry.filter(n => G.N[n].team !== e.team);
  if (G.ev && e.goEvent) { const a = rr(0, 6.28), r = rr(0, 380); return goTo(e, EVENT_AT.x + Math.cos(a) * r, EVENT_AT.y + Math.sin(a) * r * .45, 40); }
  if (e.call) { const s = G.st.banh; return goTo(e, s.x + rr(-150, 150), s.y + rr(-80, 80), e.call.wait, b => { b.call = null; }); }
  if (own.length) return goTo(e, KHO[e.team].x + rr(-80, 80), KHO[e.team].y + rr(-50, 50), .6, b => own.forEach(n => b.carry.includes(n) && storeNumber(b, n)));
  if (oth.length) { const s = pickStation(e.lastSt); return goTo(e, s.x + rr(-60, 60), s.y + rr(-40, 40), 1.2, b => oth.forEach(n => b.carry.includes(n) && hideNumber(b, n, s))); }
  const g = G.ground.find(b => Math.hypot(b.x - e.x, b.y - e.y) < 1200 && !G.bots.some(o => o !== e && o.goalBall === b));
  if (g && Math.random() < .7) { e.goalBall = g; return goTo(e, g.x, g.y, .2, b => { b.goalBall = null; if (G.ground.includes(g) && (G.N[g.n].team === b.team || nonOwn(b) < 2)) pickGround(b, g); }); }
  if (Math.random() < .55) { const s = pickStation(); return goTo(e, s.x + rr(-70, 70), s.y + rr(-40, 40), rr(3, 5), b => botMission(b, s)); }
  const p = randomFree(); goTo(e, p[0], p[1], rr(1, 4));
}
function pickStation(not) { return G.st[pickOne(STATIONS.filter(s => s.kind === 'solo' && s.id !== not)).id]; }
function botMission(e, s) { e.lastSt = s.id; e.cool = e.cool || {};
  if (s.hidden.length && Math.random() < .5) for (const n of [...s.hidden]) if (G.N[n].team === e.team) { s.hidden.splice(s.hidden.indexOf(n), 1); giveNumber(e, n); }
  if (e.cool[s.id] !== undefined && G.t > e.cool[s.id]) return; e.cool[s.id] = G.t - 25;
  if (nonOwn(e) >= 2) return; const n = rollNumber(e); if (n) giveNumber(e, n); }
function teamSignal(e, act) { act = act || (Math.random() < .15 ? G.T[otherT(e.team)].action.id : G.T[e.team].action.id); e.actCool = rr(9, 17);
  e.seq = act === 'jump2' ? [['jump'], ['wait', .62], ['jump'], ['wait', .7]] : [['sit'], ['wait', .4], ['stand'], ['wait', .28], ['sit'], ['wait', .4], ['stand']]; }
function botSpeak(e) { e.voiceT = rr(8, 20); const o = G.bots.filter(b => b !== e); e.bub.textContent = pickOne(VOICE).replace('{n}', 1 + Math.random() * 90 | 0).replace('{p}', (pickOne(o) || G.me).name); e.talk = 3; }
function botThink(e, dt, now) {
  let ix = 0, iy = 0; e.voiceT -= dt; e.talk -= dt; e.actCool -= dt; if (e.voiceT <= 0) botSpeak(e);
  if (e.seq.length) { const s = e.seq[0]; if (s[0] === 'wait') { s[1] -= dt; if (s[1] <= 0) e.seq.shift(); } else { if (s[0] === 'jump') e.jump = .5; else e.sitting = s[0] === 'sit'; e.seq.shift(); } }
  else if (e.actCool <= 0 && Math.hypot(e.x - G.me.x, e.y - G.me.y) < 700 && Math.random() < dt * .3) teamSignal(e);
  else if (e.wait > 0) { e.wait -= dt; if (e.wait <= 0 && e.onArrive) { const f = e.onArrive; e.onArrive = null; f(e); } }
  else { if (!e.goal) planBot(e);
    if (e.goal) { const wp = e.path[e.pi];
      if (!wp) { const f = e.then; e.goal = null; e.wait = e.arrWait; if (f) { if (e.wait > 0) e.onArrive = f; else f(e); } }
      else { const dx = wp[0] - e.x, dy = wp[1] - e.y, d = Math.hypot(dx, dy); if (d < 34) e.pi++; else { ix = dx / d * e.speedK; iy = dy / d * e.speedK; }
        e.stuckT += dt; if (e.stuckT > .9) { if (Math.hypot(e.x - e.sx, e.y - e.sy) < 14) { if (++e.stuckN > 3) { e.goal = null; e.wait = .3; } else { e.path = navPath(e.x, e.y, e.goal.x, e.goal.y) || e.path; e.pi = 0; e.jump = .5; } } else e.stuckN = 0; e.sx = e.x; e.sy = e.y; e.stuckT = 0; } } } }
  if (e.sitting) ix = iy = 0;
  animEnt(e, dt, now, ix, iy, 820);
  if (e.stepBlock && !(e.jump > 0)) e.jump = .5;  // bots hop up the porch steps
}

/* ---------- end ---------- */
function timeUp() { const m = G.myTeam, o = otherT(m), a = G.kho[m].size, b = G.kho[o].size, win = a > b || (a === b && G.seen[m].length > G.seen[o].length);
  toast(`Hết giờ! ${win ? 'Đội bạn cất được nhiều số hơn.' : 'Đối thủ cất được nhiều số hơn.'}`, win ? 'ok' : 'bad', 'clock'); endGame(win ? m : o); }
function endGame(winTeam) { if (G.done) return; G.done = true; G.running = false; cancelAnimationFrame(G.raf); closeAllOverlays();
  const win = winTeam === G.myTeam, p = { win, winTeam, myTeam: G.myTeam, roster: G.M.roster.map(r => ({ k: r.k, team: r.team, me: !!r.me })), got: G.kho[G.myTeam].size, extras: G.missions, jumps: G.jumps };
  const fl = document.createElement('div'); fl.className = 'flash'; G.el.appendChild(fl);
  const k = document.createElement('div'); k.className = 'kinh-splash'; k.innerHTML = `<div class="rays"></div><div class="word">${jd(win ? 'KINH!' : (winTeam === 'red' ? 'ĐỎ' : 'XANH') + ' KINH!', { h: win ? 330 : 240, fill: TEAM_C[winTeam], sw: 14 })}</div>`; G.el.appendChild(k);
  if (win) { confetti(k, 90); beep('kinh'); burst(960, 540, { n: 30, dist: 700, size: 28 }); } else beep('bad'); shake(stage, 22);
  setTimeout(() => go('result', p, { push: false }), win ? 1900 : 1600); }

/* ---------- popups ---------- */
function openTicket() { if (ovRoot.children.length || G.done) return; const T = G.T[G.myTeam], seen = G.seen[G.myTeam];
  const cell = n => n ? `<div>${jd(String(n), { h: 72, fill: '#2A1C1C', sw: 0, shadow: false })}${seen.includes(n) ? '<i class="stamp-o"></i>' : ''}</div>` : '<div class="r"></div>';
  const J = (t, lab) => jd(t, { h: 48, fill: lab ? '#F88400' : '#F8AC48', stroke: '#A65A1A', sw: 2.5, shadow: false });
  const o = overlay({ title: '', close: false, width: 792, cls: 'ticketov', body: `<div class="lticket2"><img class="ltf" src="${IMG('ticket_frame.svg')}" alt="" draggable="false"><div class="lt-x" data-x>${ic('x', '#fff', 44)}</div>
    <div class="lt-grid2" style="top:88px">${T.card.slice(0, 3).flat().map(cell).join('')}</div><div class="lt-grid2" style="top:371px">${T.card.slice(3).flat().map(cell).join('')}</div>
    <div class="lt-hint2"><div class="hw"><div class="hr">${J('HINT SỐ:', 1)}<div class="hc">${T.hint.map(h => J(h)).join('')}</div></div><div class="hr">${J('HINT ĐỘI:', 1)}${J(T.action.label)}</div></div></div></div>` });
  const hb = o.querySelector('.lt-hint2'), hw = hb.querySelector('.hw'), need = hw.scrollWidth, room = hb.clientWidth - 60; if (need > room) hw.style.zoom = (room / need).toFixed(3);  // long riddles shrink to fit
  on(o, '[data-x]', () => o.close()); }
function showReward(n) { const own = G.N[n].team === G.myTeam, opp = G.knownOpp.has(n);
  const o = overlay({ title: 'NHẬN ĐƯỢC SỐ!', color: own ? 'red' : 'blue', width: 920, cls: 'reward', body: `<div class="rw-stage" style="height:240px"><div class="rays"></div><div class="glow"></div>${'<i class="tw"></i>'.repeat(own ? 6 : 0)}<div style="transform:scale(1.7)">${ball(n)}</div></div>
    ${own ? `<span class="tag green" style="font-size:30px;padding:8px 26px 10px">✓ THUỘC DÃY SỐ CỦA ĐỘI BẠN!</span><div class="rw-txt">Mang về <b>KHO ${TEAM_NAME[G.myTeam].toUpperCase()}</b> trong <b>60 giây</b>: tới kho, mở túi rồi kéo số vào kho.</div>`
      : `<span class="tag" style="font-size:30px;padding:8px 26px 10px;background:var(--brown5);color:#fff">✗ KHÔNG THUỘC DÃY CỦA ĐỘI BẠN</span><div class="rw-txt">${opp ? 'Quản trò đã hô – đây là <b>số của đội đối thủ</b>!' : 'Có thể là số của đối thủ, cũng có thể chỉ là số nhiễu.'} Đem <b>giấu ở một trạm nhiệm vụ</b> (chấm vàng) trong <b>60 giây</b>, không thì số sẽ rơi xuống đất!</div>`}
    ${btn('CẤT VÀO TÚI', { color: 'green', icon: 'check', attrs: 'data-ok', style: 'width:100%' })}` });
  on(o, '[data-ok]', () => o.close()); beep(own ? 'win' : 'coin'); if (own) confetti(o, 40); renderBar(); renderCarry(); }
function openCaller(n) { beep('call');
  const o = overlay({ title: 'QUẢN TRÒ HÔ SỐ', color: 'red', width: 1000, cls: 'reward', body: `<div class="row" style="gap:30px;align-items:center"><div class="center" style="width:150px;height:150px;border-radius:50%;background:var(--gold);border:6px solid var(--brown);flex:none">${ic('megaphone', 'var(--brown)', 84)}</div>
    <div style="font-weight:700;font-style:italic;font-size:32px;line-height:1.4">“${pickOne(RHYMES)}”<br><b style="font-style:normal;color:var(--red)">…là con số ${n}!</b></div></div>
    <div class="rw-stage" style="height:200px"><div class="rays"></div><div class="glow"></div><div style="transform:scale(1.5)">${ball(n)}</div></div>
    <span class="tag red" style="font-size:28px;padding:8px 24px 10px">SỐ ${n} THUỘC DÃY CỦA ĐỘI ĐỐI THỦ</span><div class="rw-txt">🤫 Chỉ mình bạn nghe được! Gặp số này thì đem giấu, hoặc lừa đối thủ khỏi nó.</div>
    ${btn('ĐÃ NHỚ!', { color: 'green', icon: 'check', attrs: 'data-ok', style: 'width:100%' })}` });
  on(o, '[data-ok]', () => o.close()); }
function openSearch(s) { const o = overlay({ title: 'TÌM SỐ BỊ GIẤU', width: 820, body: `<div class="mg-stage" style="height:220px"><div class="mg-fire" style="animation:wigs .35s infinite">🔍</div></div><div id="srt" style="font-weight:800;font-size:28px;text-align:center">Đang lục quanh chỗ ${s.name.toLowerCase()}…</div>` });
  setTimeout(() => { if (!o.isConnected) return; const found = [], left = [];
    for (const n of [...s.hidden]) { if (G.N[n].team !== G.myTeam && nonOwn(G.me) >= 2) { left.push(n); continue; } s.hidden.splice(s.hidden.indexOf(n), 1); giveNumber(G.me, n); found.push(n); }
    o.querySelector('#srt').innerHTML = found.length ? `<div class="col center" style="gap:14px">Tìm thấy số bị giấu!<div class="row" style="gap:14px">${found.map(n => ball(n, 'sm')).join('')}</div><span style="font-size:22px;color:var(--brown5)">${found.map(n => `${n}: ${G.N[n].team === G.myTeam ? 'của đội bạn' : 'số lạ'}`).join(' · ')}</span></div>` : (left.length ? 'Có số giấu ở đây nhưng túi đã đủ 2 số lạ!' : 'Không thấy số nào được giấu ở đây.');
    beep(found.length ? 'pick' : 'bad'); renderBar(); renderCarry(); }, 1300); }
function openMission(s) { const m = MG[s.id]; let stop = null;
  const o = overlay({ title: s.name.toUpperCase(), color: s.kind === 'team' ? 'blue' : 'red', width: 980, body: `<div style="font-weight:700;font-size:28px;text-align:center">${m.txt}</div>${m.html()}`, onClose: () => stop && stop() });
  let fin = false; stop = m.mount(o, () => { if (fin) return; fin = true; if (stop) stop(); stop = null; o.style.pointerEvents = 'none'; beep('win'); setTimeout(() => { o.close(); setTimeout(() => finishMission(s), 230); }, 380); }); }
function finishMission(s) { G.missions++;
  if (s.kind === 'solo') { G.myCool[s.id] = 20; const n = rollNumber(G.me); giveNumber(G.me, n); return showReward(n); }
  s.cool = 45; const there = [G.me, ...G.bots].filter(e => e.team === G.myTeam && Math.hypot(e.x - s.x, e.y - s.y) < ST_R.team + 40), w = pickOne(there.length ? there : [G.me]), n = rollNumber(w, true);
  G.bots.forEach(b => { if (b.team === G.myTeam && b.call) { b.call = null; b.goal = null; b.wait = 0; } });
  if (!n) return toast('Đội bạn đã nhận hết số từ nhiệm vụ – đi lục tìm các số bị giấu!', 'info', 'search');
  giveNumber(w, n); if (w === G.me) showReward(n); else { toast('Xong nhiệm vụ chung! Một đồng đội vừa nhận 1 số của đội.', 'ok', 'users'); renderBar(); } }
const holdTask = (o, sel, barSel, speed, done, onP) => { let p = 0, hold = false; const b = o.querySelector(sel), bar = o.querySelector(barSel);
  b.addEventListener('pointerdown', e => { e.preventDefault(); hold = true; b.classList.add('pressed'); }); const up = () => { hold = false; b.classList.remove('pressed'); }; addEventListener('pointerup', up);
  const iv = setInterval(() => { p = Math.max(0, Math.min(1, p + (hold ? speed : -.03))); bar.style.width = p * 100 + '%'; onP && onP(p); if (p >= 1) { clearInterval(iv); done(); } }, 50);
  return () => { clearInterval(iv); removeEventListener('pointerup', up); }; };
const MG = {
  bep: { txt: 'Bấm QUẠT thật nhanh cho bếp lửa bùng lên!', html: () => `<div class="mg-stage"><div class="mg-fire" id="fire">🔥</div><div class="mg-bar"><i id="mgb"></i></div></div>${btn('QUẠT!', { color: 'yellow', attrs: 'data-fan', style: 'width:420px' })}`,
    mount(o, done) { let p = 0; const bar = o.querySelector('#mgb'), fire = o.querySelector('#fire'), upd = () => { bar.style.width = p * 100 + '%'; fire.style.transform = `scale(${.55 + p * 1.1})`; };
      const iv = setInterval(() => { p = Math.max(0, p - .015); upd(); }, 100); upd();
      on(o, '[data-fan]', () => { p = Math.min(1, p + .13); upd(); if (p >= 1) { clearInterval(iv); done(); } }); return () => clearInterval(iv); } },
  bantho: { txt: 'Giữ chuột (hoặc ngón tay) rồi lau sạch bụi trên bàn thờ!', html: () => `<div class="mg-stage" id="mgs" style="background:#7a3b22;touch-action:none"><div style="font-size:120px">🕯️🍊🕯️</div><div class="mg-dust">${'<i></i>'.repeat(40)}</div></div>`,
    mount(o, done) { const st = o.querySelector('#mgs'), tiles = [...st.querySelectorAll('.mg-dust i')]; let down = false;
      const wipe = e => { if (!down) return; const t = document.elementFromPoint(e.clientX, e.clientY); if (t && t.parentElement && t.parentElement.classList.contains('mg-dust') && !t.classList.contains('c')) { t.classList.add('c'); if (tiles.filter(x => x.classList.contains('c')).length >= tiles.length * .9) { down = false; done(); } } };
      st.addEventListener('pointerdown', e => { down = true; wipe(e); }); st.addEventListener('pointermove', wipe); const up = () => down = false; addEventListener('pointerup', up); return () => removeEventListener('pointerup', up); } },
  ga: { txt: 'Bấm vào từng nắm thóc để rải cho gà ăn (6 nắm)!', html: () => `<div class="mg-stage" id="mgs" style="background:#9cc36b"><div style="position:absolute;left:30px;bottom:10px;font-size:110px">🐔</div><b id="mgc" style="position:absolute;right:30px;top:20px;font:40px var(--num)">0/6</b></div>`,
    mount(o, done) { const st = o.querySelector('#mgs'); let k = 0; const spawn = () => { const g = document.createElement('div'); g.className = 'mg-grain'; g.textContent = '🌾'; g.style.left = rr(160, 700) + 'px'; g.style.top = rr(40, 260) + 'px'; st.appendChild(g);
        g.onpointerdown = () => { g.remove(); beep('coin'); k++; o.querySelector('#mgc').textContent = k + '/6'; if (k >= 6) done(); else spawn(); }; }; spawn(); return () => {}; } },
  mai: { txt: 'Nhấn GIỮ nút TƯỚI cho tới khi đầy nước cho cây mai!', html: () => `<div class="mg-stage" style="background:#ffe9a8"><div class="mg-fire" id="tree">🌼</div><div class="mg-bar"><i id="mgb" style="background:linear-gradient(90deg,#8fd3ff,#3a8ee0)"></i></div></div>${btn('GIỮ ĐỂ TƯỚI', { color: 'blue', attrs: 'data-hold', style: 'width:460px;touch-action:none' })}`,
    mount(o, done) { return holdTask(o, '[data-hold]', '#mgb', .035, done, p => o.querySelector('#tree').style.transform = `scale(${.6 + p})`); } },
  banh: { txt: 'Cả đội cùng GIỮ nút GÓI để buộc lạt bánh chưng!', html: () => `<div class="mg-stage" style="background:#cfe7b0"><div class="mg-fire" id="banh">🍃</div><div class="row" id="mates" style="position:absolute;top:20px;gap:10px"></div><div class="mg-bar"><i id="mgb" style="background:linear-gradient(90deg,#7bc96f,#2f8f3a)"></i></div></div>${btn('GIỮ ĐỂ GÓI', { color: 'green', attrs: 'data-hold', style: 'width:460px;touch-action:none' })}`,
    mount(o, done) { const s = G.st.banh, mates = [G.me, ...G.bots].filter(e => e.team === G.myTeam && Math.hypot(e.x - s.x, e.y - s.y) < ST_R.team + 40);
      o.querySelector('#mates').innerHTML = mates.map(e => `<div style="width:76px;height:76px;border-radius:50%;border:4px solid ${TEAM_C[G.myTeam]};background:var(--cream) url(${charImg(e.k)}) center/contain no-repeat"></div>`).join('');
      return holdTask(o, '[data-hold]', '#mgb', .028, done, p => o.querySelector('#banh').style.transform = `scale(${.6 + p}) rotate(${p * 360}deg)`); } } };

// Bag: the HUD pouch flies to the centre and opens; your numbers sit inside, press-hold & drag one onto the hide spot / team store
function bagPile(list) {
  const n = list.length, s = n <= 3 ? 150 : n <= 6 ? 128 : 112, caps = n <= 3 ? [3] : n <= 6 ? [3, 3] : [4, 3, 2], gap = s * .84, out = []; let i = 0;
  caps.forEach((cap, row) => { const k = Math.min(cap, n - i);
    for (let j = 0; j < k; j++, i++) out.push({ ...list[i], s, row, x: 386 + (j - (k - 1) / 2) * gap + (row % 2 ? s * .14 : 0), y: 440 - s / 2 - row * s * .6, r: (list[i].n * 37) % 31 - 15 }); });
  return out.sort((p, q) => q.row - p.row); }
function openBag() { const open = ovRoot.querySelector('.ov.bag'); if (open) return open.close(); if (ovRoot.children.length || G.done) return;
  const list = G.me.carry.map(n => ({ n, own: G.N[n].team === G.myTeam, opp: G.knownOpp.has(n) })).sort((a, b) => b.own - a.own), pile = bagPile(list.slice(0, 9)), more = list.length - pile.length;
  const hb = G.el.querySelector('[data-bag]'), icon = hb && hb.querySelector('img'), hr = hb ? rectOf(hb) : { cx: 1795, cy: 731 };
  const PX = 580, PY = 262, PW = 760, PH = 711, dx = hr.cx - (PX + PW / 2), dy = hr.cy - (PY + PH * .6), FROM = `translate(${dx}px,${dy}px) scale(.24) rotate(-10deg)`;
  const c = ctxTarget(), zone = c && c.type === 'st' ? 'hide' : c && c.type === 'kho' && c.t === G.myTeam ? 'kho' : '';
  const o = document.createElement('div'); o.className = 'ov bag'; beep('pop');
  o.innerHTML = `<div class="dim"></div>
    <div class="teambar big bag-head" data-tk><div class="lbl">DÃY<br>SỐ<br>ĐỘI</div><div class="row" style="gap:14px">${slotsHTML(G.myTeam, true)}</div><span class="bh-n">Kho: ${G.kho[G.myTeam].size}/5</span></div>
    <div class="bag-pouch" style="left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px"><img src="${IMG('pouch_open.webp')}" draggable="false" alt="Túi lô tô">
      ${pile.length ? '' : '<div class="bag-empty">Túi còn trống!<small>Làm nhiệm vụ ở các chấm vàng để nhận số</small></div>'}
      ${pile.map(p => `<div class="ball ${p.n > 45 ? 'g' : ''} ${p.own ? 'tk' : p.opp ? 'op' : 'unk'}" data-n="${p.n}" data-r="${p.r}" style="left:${p.x - p.s / 2}px;top:${p.y - p.s / 2}px;width:${p.s}px;height:${p.s}px;border-width:${Math.round(p.s * .083)}px;font-size:${Math.round(p.s * .44)}px;transform:rotate(${p.r}deg)">${p.n}<em class="bt">${Math.ceil(G.N[p.n].t)}s</em></div>`).join('')}
      ${more > 0 ? `<span class="tag gold bag-more">+${more} số nữa trong túi</span>` : ''}</div>
    ${pile.length ? `<div class="bag-legend"><b>Nhấn giữ một số rồi kéo sang ô bên phải</b><span class="row" style="gap:10px"><i class="lg tk"></i>Số của đội → cất vào KHO đội</span><span class="row" style="gap:10px"><i class="lg unk"></i>Số lạ → đem GIẤU ở trạm nhiệm vụ</span>${G.knownOpp.size ? '<span class="row" style="gap:10px"><i class="lg op"></i>Số đối thủ (quản trò đã hô)</span>' : ''}<span style="opacity:.8">Mỗi số chỉ giữ được 60 giây · tối đa 2 số lạ</span></div>` : ''}
    <div class="bag-drop ${zone || 'off'}" data-zone="${zone}">${zone === 'kho' ? `${ic('home', 'var(--gold)')}<span>KÉO VÀO ĐÂY ĐỂ CẤT<br>KHO ${TEAM_NAME[G.myTeam].toUpperCase()}</span>` : zone === 'hide' ? `${ic('eye-off', '#8fd3ff')}<span>KÉO VÀO ĐÂY ĐỂ GIẤU<br>Ở ${c.s.name.toUpperCase()}</span>` : `${ic('map', 'var(--cream)')}<span>Đến trạm nhiệm vụ (chấm vàng) để giấu số lạ, hoặc về kho đội để cất số của đội</span>`}</div>
    <div class="bag-hint">Chạm ra ngoài để đóng túi · phím B</div>`;
  ovRoot.appendChild(o);
  const pouch = o.querySelector('.bag-pouch'), balls = [...pouch.querySelectorAll('.ball')], fade = ['.bag-head', '.bag-hint', '.bag-more', '.bag-empty', '.bag-legend', '.bag-drop'].map(s => o.querySelector(s)).filter(Boolean);
  if (icon) icon.style.opacity = 0;
  if (!REDUCED) {
    pouch.animate([{ transform: FROM, opacity: .5 }, { transform: 'translateY(-16px) scale(1.04) rotate(1deg)', opacity: 1, offset: .68 }, { transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.3,.8,.4,1)' });
    balls.forEach((b, i) => { const r = +b.dataset.r, d = 360 + i * 75;
      b.animate([{ transform: `translateY(-320px) rotate(${r - 40}deg)`, opacity: 0 }, { opacity: 1, offset: .25 }, { transform: `translateY(0) rotate(${r}deg)`, offset: .7, easing: 'ease-out' }, { transform: `translateY(-18px) rotate(${r}deg)`, offset: .85, easing: 'ease-in' }, { transform: `translateY(0) rotate(${r}deg)` }], { duration: 560, delay: d, easing: 'ease-in', fill: 'backwards' });
      if (i < 6) setTimeout(() => o.isConnected && !o.closing && beep('tick'), d + 390); });
    fade.forEach(f => f.animate([{ opacity: 0, translate: '0 -18px' }, { opacity: 1, translate: '0 0' }], { duration: 280, delay: 260, easing: 'ease-out', fill: 'backwards' }));
  }
  o.close = () => { if (o.closing || o.dragging) return; o.closing = true; beep();
    const done = () => { o.remove(); if (icon) { icon.style.opacity = ''; if (!REDUCED) icon.animate([{ scale: 1.25 }, { scale: 1 }], { duration: 260, easing: 'cubic-bezier(.2,1.6,.4,1)' }); } renderCarry(); renderBar(); };
    if (REDUCED) return done();
    [...pouch.querySelectorAll('.ball'), ...fade].forEach(b => b.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' }));
    o.querySelector('.dim').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 330, fill: 'forwards' });
    pouch.animate([{ transform: 'none', opacity: 1 }, { transform: FROM, opacity: .35 }], { duration: 300, delay: 60, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' }).onfinish = done; };
  [o.querySelector('.dim'), pouch.querySelector('img'), o.querySelector('.bag-hint')].forEach(x => x.onclick = () => o.close());
  o.querySelector('[data-tk]').onclick = () => { o.close(); setTimeout(openTicket, 420); };
  balls.forEach(b => b.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); let started = false;
    const t = setTimeout(() => { started = true; bagDrag(o, b, +b.dataset.n, ev); }, 130);
    const up = () => { clearTimeout(t); removeEventListener('pointerup', up); if (!started) toast(G.N[b.dataset.n].team === G.myTeam ? 'Số của đội – nhấn giữ rồi kéo vào KHO đội' : 'Số lạ – nhấn giữ rồi kéo vào chỗ GIẤU ở trạm nhiệm vụ', 'info', 'eye'); };
    addEventListener('pointerup', up); }));
}
function bagDrag(o, ballEl, n, ev) {
  const zone = o.querySelector('.bag-drop'), ghost = document.createElement('div'); ghost.className = 'bag-ghost'; ghost.innerHTML = ball(n); o.appendChild(ghost);
  const place = (cx, cy) => { const [x, y] = toStage(cx, cy); ghost.style.left = x + 'px'; ghost.style.top = y + 'px'; return [x, y]; };
  const inside = (x, y) => { const r = rectOf(zone); return x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h; };
  place(ev.clientX, ev.clientY); ballEl.style.opacity = .25; o.dragging = true; beep('pop');
  const move = e => { const [x, y] = place(e.clientX, e.clientY); zone.classList.toggle('hot', inside(x, y)); };
  const up = e => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); o.dragging = false; zone.classList.remove('hot');
    const [x, y] = toStage(e.clientX, e.clientY), res = inside(x, y) ? dropInto(zone.dataset.zone, n) : null;
    if (res === true) { ghost.animate([{ transform: 'translate(-50%,-50%) scale(1.1)' }, { transform: 'translate(-50%,-50%) scale(.2)', opacity: 0 }], { duration: 260, fill: 'forwards' }).onfinish = () => ghost.remove(); ballEl.remove();
      const bar = o.querySelector('.bag-head .row'); if (bar) bar.innerHTML = slotsHTML(G.myTeam, true); const bn = o.querySelector('.bh-n'); if (bn) bn.textContent = `Kho: ${G.kho[G.myTeam].size}/5`; }
    else { if (typeof res === 'string') toast(res, 'bad'); const br = rectOf(ballEl); ghost.animate([{ left: x + 'px', top: y + 'px' }, { left: br.cx + 'px', top: br.cy + 'px' }], { duration: 220, fill: 'forwards' }).onfinish = () => { ghost.remove(); ballEl.style.opacity = ''; }; } };
  addEventListener('pointermove', move); addEventListener('pointerup', up); }
function dropInto(zone, n) { const own = G.N[n].team === G.myTeam, c = ctxTarget();
  if (zone === 'kho') { if (!own) return 'Kho chỉ nhận số thuộc dãy của đội bạn!'; beep('coin'); storeNumber(G.me, n); return true; }
  if (zone === 'hide' && c && c.type === 'st') { if (own) return 'Số của đội mình thì mang về kho nhé!'; hideNumber(G.me, n, c.s); beep('drop'); toast(`Đã giấu số ${n} ở chỗ ${c.s.name.toLowerCase()}`, 'ok', 'eye-off'); return true; }
  return 'Đến trạm nhiệm vụ hoặc kho đội để cất / giấu số'; }
function openMap() { if (ovRoot.children.length || G.done) return; const s = 640 / WORLD.w, P = (x, y) => `left:${x * s}px;top:${y * s}px`;
  overlay({ title: 'BẢN ĐỒ · ' + MAPS[ROOM.map][0].toUpperCase(), width: 760, dimClose: false, body: `<div class="bigmap" style="position:relative;width:640px;height:${WORLD.h * s}px;border:5px solid var(--brown);border-radius:14px;overflow:hidden;background:url(${IMG('world_small.jpg')}) 0 0/100% 100%">
    ${STATIONS.map(t => `<div class="bm-st ${t.kind}" style="${P(t.x, t.y)}"><i></i><span>${t.name}</span></div>`).join('')}${['red', 'green'].map(t => `<div class="bm-st kho ${t}" style="${P(KHO[t].x, KHO[t].y)}"><i></i><span>Kho ${TEAM_NAME[t].slice(4)}</span></div>`).join('')}
    ${G.ev ? `<div class="bm-ev" style="${P(EVENT_AT.x, EVENT_AT.y)}"></div>` : ''}${G.ground.map(b => `<div class="bm-g" style="${P(b.x, b.y)}"></div>`).join('')}
    <div style="position:absolute;${P(G.px, G.py)};width:28px;height:28px;margin:-14px;border-radius:50%;background:var(--red);border:4px solid #fff"></div><span class="tag red" style="position:absolute;left:${G.px * s - 50}px;top:${G.py * s + 18}px;font-size:16px">Bạn ở đây</span></div>
    <div class="row" style="gap:22px;font-weight:700;font-size:20px;flex-wrap:wrap;justify-content:center"><span class="row" style="gap:8px"><i class="lgd st"></i>Nhiệm vụ đơn</span><span class="row" style="gap:8px"><i class="lgd team"></i>Nhiệm vụ chung</span><span class="row" style="gap:8px"><i class="lgd kho"></i>Kho đội</span><span class="row" style="gap:8px"><i class="lgd g"></i>Số rơi</span></div>` }); }
function openPause() { if (ovRoot.children.length || G.done) return; const o = overlay({ title: 'CÀI ĐẶT', color: 'blue', width: 900, body: `${[['Âm thanh', 'sound'], ['Nhạc nền', 'music']].map(([l, k]) => `<div class="row subcard" style="width:100%;padding:12px 20px 12px 26px"><b style="flex:1;font-weight:800;font-size:30px">${l}</b><div class="switch ${S[k] ? 'on' : ''}" data-sw="${k}"></div></div>`).join('')}
  ${btn('TIẾP TỤC', { color: 'green', size: 'm', attrs: 'data-cont', style: 'width:100%' })}<div class="row" style="gap:18px;width:100%">${btn('ĐẦU HÀNG', { color: 'yellow', size: 'm', attrs: 'data-give', style: 'flex:1' })}${btn('VỀ SẢNH', { size: 'm', attrs: 'data-exit', style: 'flex:1' })}</div>` });
  on(o, '[data-sw]', (e, s) => { const k = s.dataset.sw; S[k] = !S[k]; s.classList.toggle('on', S[k]); save(); if (k === 'music') music(S[k]); });
  on(o, '[data-cont]', () => o.close());
  on(o, '[data-give]', () => { o.close(); toast('Bạn đã đầu hàng.', 'bad'); endGame(otherT(G.myTeam)); });
  on(o, '[data-exit]', () => { o.close(); confirmBox({ title: 'THOÁT TRẬN?', text: 'Thoát bây giờ sẽ bị tính thua\nvà mất số đang giữ trong túi!', no: 'CHƠI TIẾP', yes: 'THOÁT', onYes: () => { G.done = true; go('lobby'); } }); }); }

/* ---- result & summary ---- */
SCREENS.result = {
  html: ({ win, winTeam = win ? 'red' : 'green', roster = [] }) => { const R = roster.length ? roster : [{ k: S.char, team: winTeam, me: true }];
    const winners = R.filter(p => p.team === winTeam), losers = R.filter(p => p.team !== winTeam), g = winTeam === 'green', sz = R.length > 8 ? 100 : 116;
    return `<div class="abs" style="inset:0;background:var(--brown)"><div class="abs" style="inset:14px;overflow:hidden;background:linear-gradient(#FCC59A,#F8EDD9)">
      <div class="abs beam" style="left:0;top:0;width:1892px;height:1052px;clip-path:polygon(560px 0,1332px 0,100% 100%,0 100%);background:${g ? 'rgba(233,227,160,.45)' : 'rgba(255,244,232,.45)'}"></div><div id="cf"></div>
      <div class="abs row" style="left:0;right:0;top:56px;justify-content:center;gap:${R.length > 8 ? 18 : 28}px">${winners.concat(losers).map((p, i) => `<div style="position:relative;width:${sz}px;height:${sz}px;border-radius:50%;border:7px solid ${TEAM_C[p.team]};background:var(--cream) url(${charImg(p.k)}) center/contain no-repeat;${i >= winners.length ? 'opacity:.6' : ''}">${p.me ? '<span class="tag gold" style="position:absolute;left:50%;bottom:-14px;transform:translateX(-50%);font-size:14px">BẠN</span>' : ''}</div>`).join('')}</div>
      <div class="abs center stamp" style="left:0;right:0;top:200px;animation-delay:.25s">${jd(g ? 'XANH THÌ KINH RỒI !!!' : 'ĐỎ THÌ KINH RỒI !!!', { h: 175, stroke: TEAM_C[winTeam], sw: 9 })}</div>
      <div class="abs" style="left:0;right:0;top:505px;text-align:center;font-weight:800;font-size:30px">${win ? `🎉 Đội bạn (${TEAM_NAME[winTeam]}) đã cất đủ số – KINH!` : `Tiếc quá! ${TEAM_NAME[winTeam]} về đích trước. Bạn ở ${TEAM_NAME[otherT(winTeam)]}.`} <span style="opacity:.7">· Chạm để xem tổng kết →</span></div>
      ${winners.slice(0, 4).map((p, i) => { const x = [150, 590, 1030, 1470][i], y = [770, 812, 812, 770][i]; return `<div class="abs podium-rise" style="left:0;top:0;animation-delay:${.5 + i * .15}s">${podiumAt(g, x + 160, y)}</div><div class="abs char-jump" style="left:0;top:0;width:1px;height:1px;animation-delay:${.9 + i * .18}s,${2 + i * .2}s">${charOn(p.k, x + 160, y + 52, 245)}</div>`; }).join('')}</div></div>`; },
  mount(el, p) { beep(p.win ? 'win' : 'bad'); if (p.win) confetti(el.querySelector('#cf')); const nx = () => cur === 'result' && go('summary', p, { push: false }); el.onclick = () => { beep(); nx(); }; setTimeout(nx, 4500); }
};

// XP bar like Figma: the track starts under the level shield, so the visible part begins at its edge
const xpW = f => `calc(40px + (100% - 40px) * ${Math.max(0, Math.min(1, f)).toFixed(3)})`;
const xpLabel = f => `Lv.${S.level} → Lv.${S.level + 1} · ${Math.round(Math.max(0, Math.min(1, f)) * 100)}%`;
SCREENS.summary = {
  html: ({ win, got, extras }) => `<div class="abs" style="inset:0;background:var(--brown)"><div class="abs" style="inset:14px;overflow:hidden;background:linear-gradient(#FCC59A,#F8EDD9)">
    <div class="abs row" style="left:136px;top:140px;gap:24px"><img src="${IMG('coin.webp')}" width="180"><div style="margin-top:10px">${jd('X', { h: 110, sw: 7 })}</div><div id="cn">${jd('0', { h: 190, sw: 9 })}</div></div>
    ${podiumAt(false, 390, 690)}${charOn(S.char, 390, 742, 290, { cls: 'breath' })}
    <div class="abs pill" style="left:230px;top:870px;padding:10px 30px 12px 14px"><img src="${IMG('coin.webp')}" width="80"><span id="tc" data-coins style="font-weight:900;font-size:44px;color:var(--textd)">${fmt(S.coins)}</span></div>
    <div class="abs panel" style="left:966px;top:150px;width:820px;height:690px">
      <span class="tag red" style="position:absolute;left:50%;top:-28px;transform:translateX(-50%);font-size:28px;font-weight:800;padding:8px 30px 10px;border-width:5px">${win ? 'THẮNG' : 'THUA'} · KẾT QUẢ TRẬN ĐẤU</span>
      <div class="abs row" style="left:60px;top:60px;gap:16px">${jd('XP GỐC', { h: 80, fill: 'var(--brown)', sw: 0, shadow: false })}${jd(': ' + S.xp, { h: 80, fill: 'var(--brown)', sw: 0, shadow: false })}</div>
      <div class="abs row" style="left:60px;top:160px;gap:16px">${jd('THƯỞNG THÊM', { h: 80, fill: 'var(--brown)', sw: 0, shadow: false })}<span id="bonus">${jd(': +0', { h: 80, fill: 'var(--green5)', sw: 0, shadow: false })}</span></div>
      <div class="abs" style="left:60px;top:282px;width:700px;height:8px;border-radius:4px;background:var(--brown)"></div>
      <div class="abs row" style="left:60px;top:316px;gap:16px">${jd('TỔNG SỐ XP', { h: 88, fill: 'var(--gold)', stroke: 'var(--textd)', sw: 7 })}<span id="tx">${jd(': ' + S.xp, { h: 88, fill: 'var(--gold)', stroke: 'var(--textd)', sw: 7 })}</span></div>
      <div class="abs center" style="left:54px;top:488px;width:130px;height:150px;z-index:2;clip-path:polygon(0 0,100% 0,100% 63%,50% 100%,0 63%);background:var(--textd)"><div class="center" style="width:116px;height:136px;margin-top:-4px;clip-path:polygon(0 0,100% 0,100% 63%,50% 100%,0 63%);background:var(--gold)"><div class="center" id="lv" style="width:82px;height:100px;margin-top:-12px;clip-path:polygon(0 0,100% 0,100% 63%,50% 100%,0 63%);background:var(--cream1)">${jd(String(S.level), { h: 64, fill: 'var(--textd)', sw: 0, shadow: false })}</div></div></div>
      <div class="abs xpbar" style="left:146px;top:506px;width:615px;height:70px"><div id="bar" class="xpfill" style="width:${xpW((S.lvProg || 0) / xpNeed(S.level))}"></div></div>
      <span id="lvl" class="abs" style="right:115px;top:610px;font-weight:700;font-size:22px;color:var(--brown5)">${xpLabel((S.lvProg || 0) / xpNeed(S.level))}</span></div>
    <div class="abs row" style="left:966px;top:900px;gap:40px">${btn('VỀ SẢNH', { color: 'white', size: 'm', attrs: 'data-home', style: 'width:390px' })}${btn('CHƠI LẠI', { size: 'm', attrs: 'data-again', style: 'width:390px' })}</div></div></div>`,
  mount(el, p) { const earned = p.got * 4 + p.extras + (p.win ? 7 : 0), gain = p.win ? 35 : 12; const x0 = S.xp;
    S.coins += earned; S.xp += gain; S.stats.games++; if (p.win) { S.stats.wins++; S.stats.kinh++; } S.stats.picked += p.got + p.extras;
    QUESTS[0][2] = Math.min(QUESTS[0][3], QUESTS[0][2] + p.got + p.extras); QUESTS[3][2] = Math.min(QUESTS[3][3], QUESTS[3][2] + (p.jumps || 0)); if (p.win) QUESTS[1][2] = 1;
    let prog = (S.lvProg || 0) + gain, lvUp = false; while (prog >= xpNeed(S.level)) { prog -= xpNeed(S.level); S.level++; lvUp = true; } S.lvProg = prog; save();
    const cn = el.querySelector('#cn'), tx = el.querySelector('#tx'), tc = el.querySelector('#tc'); let i = 0; const steps = 24;
    setTimeout(() => { const iv = setInterval(() => { i++; const k = i / steps; cn.innerHTML = jd(String(Math.round(earned * k)), { h: 190, sw: 9 }); if (i % 3 === 0) beep('tick');
      if (i >= steps) { clearInterval(iv); const rc = rectOf(cn); burst(rc.cx, rc.cy, { n: 14, dist: 160 }); coinFly(rc.cx, rc.cy, earned, { n: 12 }); el.querySelector('#bonus').innerHTML = jd(': +' + gain, { h: 80, fill: 'var(--green5)', sw: 0, shadow: false });
        let j = 0; const iv2 = setInterval(() => { j++; tx.innerHTML = jd(': ' + Math.round(x0 + gain * j / 15), { h: 88, fill: 'var(--gold)', stroke: 'var(--textd)', sw: 7 }); if (j >= 15) { clearInterval(iv2); el.querySelector('#bar').style.width = xpW(lvUp ? 1 : prog / xpNeed(S.level)); if (!lvUp) el.querySelector('#lvl').textContent = xpLabel(prog / xpNeed(S.level));
          if (lvUp) setTimeout(() => { if (cur !== 'summary') return; el.querySelector('#lv').innerHTML = jd(String(S.level), { h: 64, fill: 'var(--textd)', sw: 0, shadow: false }); el.querySelector('#bar').style.transition = 'none'; el.querySelector('#bar').style.width = xpW(prog / xpNeed(S.level)); el.querySelector('#lvl').textContent = xpLabel(prog / xpNeed(S.level)); levelUp(); }, 1200); } }, 45); } }, 45); }, 600);
    on(el, '[data-home]', () => go('lobby')); on(el, '[data-again]', () => { WAIT_READY = { 'Rồng vàng': true, 'Hổ con': true, 'Mèo mướp': true, 'Ngựa ô': true, 'Gà gáy': true, 'Trâu vàng': true, 'Rắn lục': true }; go('waiting'); }); }
};
function levelUp() { beep('win'); S.coins += 300; save(); const o = overlay({ title: 'CHÚC MỪNG', close: false, width: 760, cls: 'reward', body: `<div class="rw-stage" style="height:250px"><div class="rays"></div><div class="glow"></div>${'<i class="tw"></i>'.repeat(6)}<div style="position:relative;width:180px;height:210px;clip-path:polygon(0 0,100% 0,100% 63%,50% 100%,0 63%);background:var(--textd)" class="center"><div class="center" style="width:160px;height:190px;clip-path:polygon(0 0,100% 0,100% 63%,50% 100%,0 63%);background:var(--gold)">${jd(String(S.level), { h: 90, fill: 'var(--textd)', sw: 0, shadow: false })}</div></div></div>
  <div class="rw-amt">LÊN CẤP ${S.level}!</div><div style="font-weight:600;font-size:28px">Mở khoá khung avatar Tết + 300 xu</div>${btn('TUYỆT VỜI!', { color: 'green', icon: 'check', style: 'width:100%' })}` });
  confetti(o, 60); o.querySelector('.btn').onclick = () => { const r = rectOf(o.querySelector('.rw-stage')); o.close(); S.coins -= 300; setTimeout(() => { S.coins += 300; save(); coinFly(r.cx, r.cy, 300, { n: 10 }); }, 120); }; }

/* ===== Entities: Goose-Goose-Duck style waddle movement (+ walls, porch steps, sitting, speech bubble) ===== */
function makeEnt(k, name, cls, x, y) {
  const R = RIG[k], h = 220, s = h / R.h, w = R.w * s, [ax, ay] = R.anchor, sw = (R.shadowW || R.w * .6) * s;
  const el = document.createElement('div'); el.className = 'ent';
  el.innerHTML = `<div class="sh" style="left:${(-sw / 2).toFixed(1)}px;top:-15px;width:${sw.toFixed(1)}px;height:30px"></div>
    <div class="sp rig" style="left:${(-ax * s).toFixed(1)}px;top:${(-ay * s).toFixed(1)}px;width:${w.toFixed(1)}px;height:${h}px;transform-origin:${(ax * s).toFixed(1)}px ${(ay * s).toFixed(1)}px">${rigLayers(k)}</div>
    <div class="nm ${cls}" style="top:${(-ay * s - 44).toFixed(1)}px">${name}<i class="spk"></i></div><div class="bub" style="bottom:${(ay * s + 58).toFixed(1)}px"></div>`;
  G.ballsEl.appendChild(el);
  const parts = {}; el.querySelectorAll('[data-part]').forEach(p => parts[p.dataset.part] = p);
  return { k, name, team: cls, x, y, vx: 0, vy: 0, face: 1, fs: 1, phase: 0, jump: 0, blend: 0, sitB: 0, sitting: false, wasUp: false, seed: Math.random() * 6, carry: [], seq: [],
    el, parts, sp: el.querySelector('.sp'), sh: el.querySelector('.sh'), nm: el.querySelector('.nm'), bub: el.querySelector('.bub') };
}
function animEnt(e, dt, now, ix, iy, maxSp) {
  const k = 1 - Math.exp(-dt * 14);                       // snappy accel / decel
  e.vx += (ix * maxSp - e.vx) * k; e.vy += (iy * maxSp - e.vy) * k;
  // move with collision: axis by axis so you slide along walls; the porch needs a jump to step up
  const ox = e.x, oy = e.y; e.stepBlock = false;
  const nx = Math.max(120, Math.min(WORLD.w - 120, e.x + e.vx * dt)), ny = Math.max(560, Math.min(WORLD.h - 60, e.y + e.vy * dt));
  if (nx !== e.x) { if (canMove(e, nx, e.y)) e.x = nx; else e.vx *= .35; }
  if (ny !== e.y) { if (canMove(e, e.x, ny)) e.y = ny; else e.vy *= .35; }
  const mvx = (e.x - ox) / Math.max(dt, 1e-3), mvy = (e.y - oy) / Math.max(dt, 1e-3);
  const spd = Math.hypot(mvx, mvy), moving = spd > 50, amt = Math.min(1, spd / 820);
  if (mvx < -35) e.face = -1; else if (mvx > 35) e.face = 1;
  e.fs += (e.face - e.fs) * (1 - Math.exp(-dt * 26));    // quick flip through 0 (paper-turn)
  e.blend += ((moving ? 1 : 0) - e.blend) * (1 - Math.exp(-dt * 10));
  e.sitB += ((e.sitting ? 1 : 0) - e.sitB) * (1 - Math.exp(-dt * 16));
  e.phase += spd * dt / 92 * Math.PI;                     // one step every ~92px
  const s = Math.sin(e.phase), lift = Math.abs(s);
  const up = lift > .55; if (moving && e.wasUp && !up) stepFx(e); e.wasUp = up;
  const hop = lift * (5 + 7 * amt) * e.blend;             // body bounce per step (feet do the stepping)
  const waddle = s * 7 * e.blend + (mvx / 820) * 6;        // rock side to side + lean into run
  const squash = (1 - lift) * .08 * e.blend;               // squash on foot contact
  const breathe = Math.sin(now / 1000 * 3.2 + e.seed) * .022 * (1 - e.blend);
  if (e.jump > 0) e.jump = Math.max(0, e.jump - dt);
  const jt = e.jump > 0 ? 1 - e.jump / .5 : 0, jy = e.jump > 0 ? Math.sin(jt * Math.PI) * 150 : 0;
  const jsq = e.jump > 0 ? (jt < .12 ? -.12 : jt > .88 ? .12 : 0) : 0;
  const sit = e.sitB, sx = e.fs * (1 + squash + jsq * .8 + sit * .12), sy = (1 - squash + breathe - jsq + (1 - Math.abs(e.fs)) * .08) * (1 - sit * .26);
  e.sp.style.transform = `translateY(${-(hop + jy).toFixed(1)}px) rotate(${waddle.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
  e.sh.style.transform = `scale(${(1 - (hop + jy) / 420 + sit * .1).toFixed(3)})`; e.sh.style.opacity = (1 - jy / 300).toFixed(2);
  e.nm.style.transform = `translate(-50%,${-(hop * .4 + jy - sit * 52).toFixed(1)}px)`; e.bub.style.transform = `translate(-50%,${-(jy - sit * 52).toFixed(1)}px)`;
  // skeletal parts: alternate stepping feet, swinging arm, counter-balancing head, wagging tail
  const P = e.parts, b = e.blend, fl = Math.max(0, s), fr = Math.max(0, -s), c = Math.cos(e.phase), air = e.jump > 0;
  if (P.footL) P.footL.style.transform = air ? 'translateY(-10px) rotate(-14deg)' : `translate(${(c * 7 * b).toFixed(1)}px,${(-fl * 18 * b).toFixed(1)}px) rotate(${(-fl * 14 * b).toFixed(1)}deg)`;
  if (P.footR) P.footR.style.transform = air ? 'translateY(-10px) rotate(14deg)' : `translate(${(-c * 7 * b).toFixed(1)}px,${(-fr * 18 * b).toFixed(1)}px) rotate(${(fr * 14 * b).toFixed(1)}deg)`;
  const idleT = now / 1000 + e.seed;
  if (P.head) P.head.style.transform = `translateY(${(Math.sin(e.phase * 2) * 3 * b + Math.sin(idleT * 2.2) * 2 * (1 - b)).toFixed(1)}px) rotate(${(-waddle * .5 + Math.sin(idleT * 1.6) * 3 * (1 - b)).toFixed(2)}deg)`;
  if (P.arm) P.arm.style.transform = `rotate(${(air ? -35 : s * 24 * b + Math.sin(idleT * 3.4) * 12 * (1 - b)).toFixed(1)}deg)`;
  if (P.tail) P.tail.style.transform = `rotate(${(Math.sin(idleT * (b ? 9 : 4)) * (10 + 8 * b)).toFixed(1)}deg)`;
  if (P.body) P.body.style.transform = `scale(${(1 + squash * .3).toFixed(3)},${(1 - squash * .3 + breathe).toFixed(3)})`;
  e.el.style.transform = `translate(${e.x.toFixed(1)}px,${e.y.toFixed(1)}px)`; e.el.style.zIndex = Math.round(e.y) + 1;
}
function stepFx(e) {
  const d = document.createElement('div'); d.className = 'dust'; d.style.left = (e.x - 17 - e.face * 30 + (Math.random() - .5) * 30) + 'px'; d.style.top = (e.y - 12) + 'px'; d.style.zIndex = Math.round(e.y) - 1;
  G.ballsEl.appendChild(d); setTimeout(() => d.remove(), 620);
  if (e === G.me) beep('step');
}
