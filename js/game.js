/* ===== Real-time gameplay, result & summary ===== */
const WORLD = { w: 5120, h: 6134 };
const G = {};
SCREENS.game = {
  html: () => `<div class="abs" style="inset:0;background:#c97a5d;overflow:hidden" id="view"><div id="world"><div class="map"></div><div id="balls"></div></div></div>
    <div class="hud">
      <div class="abs calledboard" data-board style="left:24px;top:30px"><div class="lbl">SỐ<br>ĐÃ<br>GỌI</div><div id="called" class="row" style="gap:12px;min-width:430px;min-height:96px"></div></div>
      <div class="abs ticket" data-board style="left:24px;top:190px;cursor:pointer"><div class="col" style="font-weight:900;font-size:18px;line-height:1.15;color:var(--brown5)">VÉ<br>CỦA<br>BẠN</div><div id="ticket" class="row" style="gap:10px"></div></div>
      <div class="abs pill" data-mission style="left:50%;transform:translateX(-50%);top:40px;gap:14px;padding:10px 26px 12px 20px;cursor:pointer">${ic('clock', 'var(--red)', 36)}<b id="timer" style="font-weight:900;font-size:32px;color:var(--red);min-width:90px">2:45</b><span style="width:3px;height:34px;background:var(--brown5)"></span>
        <span style="font-weight:700;font-size:24px">Vé:</span><span id="mine" class="tag green" style="font-size:22px">0/5</span><span style="font-weight:700;font-size:24px">Đội Xanh:</span><span id="opp" class="tag" style="font-size:22px;background:var(--lgreen);color:#fff">0/5</span></div>
      <div class="abs iconbtn" data-settings style="left:1500px;top:44px;width:100px;height:100px">${ic('settings', 'var(--brown)', 60)}</div>
      <div class="abs minimap" data-minimap style="left:1630px;top:20px"><div class="mm" id="mm"></div></div><span class="abs tag cream" data-minimap style="left:1712px;top:272px;font-size:20px;cursor:pointer">BẢN ĐỒ</span>
      <div class="joy" id="joy"><div class="ring"></div>${[[168, 30], [168, 306], [30, 168], [306, 168]].map(([x, y]) => `<div class="clover" style="left:${x}px;top:${y}px"><i style="left:11px;top:0"></i><i style="left:11px;top:22px"></i><i style="left:0;top:11px"></i><i style="left:22px;top:11px"></i></div>`).join('')}<div class="knob" id="knob"></div></div>
      <div class="hudbtn" data-bag style="left:1700px;top:636px;background:var(--or3)"><img src="${IMG('pouch.webp')}" style="width:166px;height:166px;border-radius:50%"></div>
      <div class="hudbtn" id="bJump" style="left:1466px;top:858px">${jd('NHẢY', { h: 92, fill: 'var(--or5)', sw: 5 })}</div>
      <div class="hudbtn" id="bPick" style="left:1700px;top:858px">${jd('LỤM', { h: 108, fill: 'var(--or5)', sw: 5 })}</div>
      <div class="kinhbtn hidden" id="kinh"><button class="btn btn-l red" style="font-size:60px;padding:16px 70px 24px;animation:pulse 1s infinite" data-kinh>${ic('trophy', '#fff')}KINH!</button></div>
      <div class="abs" style="left:50%;transform:translateX(-50%);bottom:14px;background:rgba(59,26,18,.6);color:var(--cream);border-radius:999px;padding:8px 22px 10px;font-weight:700;font-size:20px;white-space:nowrap">Di chuyển: joystick / ←↑→↓ / WASD · Nhảy: Space · Lụm: E · KINH: K</div>
    </div>`,
  mount(el) { startGame(el); },
  leave() { G.running = false; cancelAnimationFrame(G.raf); removeEventListener('keydown', G.kd); removeEventListener('keyup', G.ku); }
};

function startGame(el) {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const nums = Array.from({ length: 90 }, (_, i) => i + 1).sort(() => Math.random() - .5);
  const ticket = nums.slice(0, 5).sort((a, b) => a - b);
  const rest = nums.slice(5);
  // calling order: ticket numbers interleaved early so a round lasts ~1.5–2 min
  const order = []; const slots = [1, 4, 8, 12, 17]; let ti = 0, ri = 0;
  for (let i = 0; i < 60; i++) order.push(slots.includes(i) ? ticket[ti++] : rest[ri++]);
  Object.assign(G, { el, running: true, t: 165, cx: 0, cy: 0, camInit: false, keys: {}, joy: [0, 0], ticket, got: [], called: [], order, oi: 0, nextCall: 1.2,
    balls: [], extras: [], opp: 0, oppNext: rnd(24, 34), last: performance.now(), done: false, jumps: 0 });
  const $ = s => el.querySelector(s);
  G.world = $('#world'); G.ballsEl = $('#balls'); G.mm = $('#mm');
  // entities: you + 7 bots (Goose-Goose-Duck style crowd)
  G.me = makeEnt(S.char, 'Bạn', 'me', 3644, 2304);
  Object.defineProperty(G, 'px', { configurable: true, get: () => G.me.x, set: v => { G.me.x = v; } });
  Object.defineProperty(G, 'py', { configurable: true, get: () => G.me.y, set: v => { G.me.y = v; } });
  const pool = [['chuot', 'Chuột chít', 'red'], ['rong', 'Rồng vàng', 'red'], ['khi', 'Khỉ lém', 'red'], ['ho', 'Hổ con', 'green'], ['meo', 'Mèo mướp', 'green'], ['cho', 'Cún nhà', 'green'], ['heo', 'Heo ủn ỉn', 'green'], ['ga', 'Gà gáy', 'red']].filter(p => p[0] !== S.char).slice(0, 7);
  G.bots = pool.map(([k, n, t], i) => { const e = makeEnt(k, n, t, 3644 + Math.cos(i * .9) * (420 + i * 60), 2304 + Math.sin(i * .9) * (300 + i * 40)); e.speedK = .5 + Math.random() * .3; e.wait = Math.random() * 1.5; return e; });
  renderTicket(); renderCalled();
  // minimap scale
  G.mmS = 270 / 1700; G.mm.style.width = WORLD.w * G.mmS + 'px'; G.mm.style.height = WORLD.h * G.mmS + 'px';
  // keyboard
  G.kd = e => { if (cur !== 'game') return; const k = e.key.toLowerCase(); G.keys[k] = true; if (k === ' ' ) { e.preventDefault(); doJump(); } if (k === 'e') doPick(); if (k === 'k' || k === 'enter') doKinh(); if (k === 'escape') openPause(); if (k === 'm') openMap(); if (k === 'b') openBag(); };
  G.ku = e => { G.keys[e.key.toLowerCase()] = false; };
  addEventListener('keydown', G.kd); addEventListener('keyup', G.ku);
  // joystick
  const joy = $('#joy'), knob = $('#knob');
  const jmove = e => { const [x, y] = toStage(e.clientX, e.clientY); let dx = x - (70 + 190), dy = y - (660 + 190); const d = Math.hypot(dx, dy), m = 120; if (d > m) { dx *= m / d; dy *= m / d; } knob.style.transform = `translate(${dx}px,${dy}px)`; G.joy = [dx / m, dy / m]; };
  joy.addEventListener('pointerdown', e => { joy.setPointerCapture(e.pointerId); jmove(e); });
  joy.addEventListener('pointermove', e => { if (joy.hasPointerCapture(e.pointerId)) jmove(e); });
  const jend = () => { knob.style.transform = ''; G.joy = [0, 0]; }; joy.addEventListener('pointerup', jend); joy.addEventListener('pointercancel', jend);
  const press = (b, fn) => { b.addEventListener('pointerdown', e => { e.preventDefault(); b.classList.add('pressed'); fn(); }); b.addEventListener('pointerup', () => b.classList.remove('pressed')); b.addEventListener('pointerleave', () => b.classList.remove('pressed')); };
  press($('#bJump'), doJump); press($('#bPick'), doPick);
  on(el, '[data-kinh]', doKinh); on(el, '[data-bag]', openBag); on(el, '[data-minimap]', openMap); on(el, '[data-settings]', openPause); on(el, '[data-board]', openBoard);
  on(el, '[data-mission]', () => toast('Nhiệm vụ: lụm đủ 5 số trên vé rồi bấm KINH trước Đội Xanh!', 'info', 'clock'));
  G.raf = requestAnimationFrame(loop);
}

function loop(now) {
  if (!G.running) return; G.raf = requestAnimationFrame(loop);
  let dt = Math.min(.05, (now - G.last) / 1000); G.last = now;
  if (ovRoot.children.length) return; // paused while a popup is open
  // timers
  G.t -= dt; if (G.t <= 0 && !G.done) return endGame(false, 'HẾT GIỜ!');
  G.nextCall -= dt; if (G.nextCall <= 0) { G.nextCall = 3.4; callNext(); }
  G.oppNext -= dt; if (G.oppNext <= 0 && !G.done) { G.opp++; G.oppNext = 22 + Math.random() * 14; const oe = G.el.querySelector('#opp'); oe.textContent = G.opp + '/5'; oe.classList.remove('bump'); void oe.offsetWidth; oe.classList.add('bump'); beep('bad'); if (G.opp >= 4) toast('Đội Xanh sắp KINH rồi – nhanh lên!', 'bad', 'zap'); if (G.opp >= 5) return endGame(false); }
  // movement (input → smooth velocity → waddle animation)
  let ix = (G.keys['arrowright'] || G.keys['d'] ? 1 : 0) - (G.keys['arrowleft'] || G.keys['a'] ? 1 : 0) + G.joy[0];
  let iy = (G.keys['arrowdown'] || G.keys['s'] ? 1 : 0) - (G.keys['arrowup'] || G.keys['w'] ? 1 : 0) + G.joy[1];
  const l = Math.hypot(ix, iy); if (l > 1) { ix /= l; iy /= l; }
  animEnt(G.me, dt, now, ix, iy, 820);
  for (const e of G.bots) botThink(e, dt, now);
  // camera: smooth follow with a little look-ahead
  const tx = Math.max(0, Math.min(WORLD.w - 1920, G.me.x + G.me.vx * .3 - 960)), ty = Math.max(0, Math.min(WORLD.h - 1080, G.me.y + G.me.vy * .3 - 620));
  if (!G.camInit) { G.cx = tx; G.cy = ty; G.camInit = true; } else { const ck = 1 - Math.exp(-dt * 6); G.cx += (tx - G.cx) * ck; G.cy += (ty - G.cy) * ck; }
  G.world.style.transform = `translate(${-G.cx.toFixed(1)}px,${-G.cy.toFixed(1)}px)`;
  // minimap
  G.mm.style.left = (135 - G.px * G.mmS) + 'px'; G.mm.style.top = (135 - G.py * G.mmS) + 'px';
  if (!G._mmT || now - G._mmT > 200) { G._mmT = now; G.mm.innerHTML = G.balls.map(b => `<i style="left:${b.x * G.mmS}px;top:${b.y * G.mmS}px;${b.kind === 'ticket' ? '' : 'background:#fff;width:9px;height:9px;margin:-4px'}"></i>`).join('') + G.bots.map(e => `<i class="bot ${e.team}" style="left:${e.x * G.mmS}px;top:${e.y * G.mmS}px"></i>`).join('') + `<i class="me" style="left:${G.px * G.mmS}px;top:${G.py * G.mmS}px"></i>`; }
  // timer text + nearby highlight
  const tt = Math.max(0, Math.ceil(G.t)); const te = G.el.querySelector('#timer'); te.textContent = Math.floor(tt / 60) + ':' + String(tt % 60).padStart(2, '0'); te.classList.toggle('low', tt <= 20);
  const near = nearestBall(); G.el.querySelector('#bPick').classList.toggle('ready', !!near);
}

function spawnBall(n, kind) {
  let x, y, t = 0; do { x = 470 + Math.random() * 4180; y = 900 + Math.random() * 4790; t++; const d = Math.hypot(x - G.px, y - G.py); if (d > 650 && d < (kind === 'ticket' ? 2300 : 3200)) break; } while (t < 80);
  const b = { n, kind, x, y, el: document.createElement('div') }; b.el.className = 'wball drop' + (kind === 'ticket' ? '' : ' decoy'); beep('drop'); b.el.style.left = x + 'px'; b.el.style.top = y + 'px';
  b.el.innerHTML = `${kind === 'ticket' ? '<div class="beam"></div>' : ''}<div class="glow"></div>${ball(n, 'sm')}`; b.el.style.zIndex = Math.round(y); G.ballsEl.appendChild(b.el); G.balls.push(b);
  if (G.balls.filter(x => x.kind !== 'ticket').length > 6) { const old = G.balls.find(x => x.kind !== 'ticket'); old.el.remove(); G.balls.splice(G.balls.indexOf(old), 1); }
}
function callNext() {
  if (G.oi >= G.order.length) return; const n = G.order[G.oi++]; G.called.push(n); renderCalled(); beep('call');
  const mine = G.ticket.includes(n); const co = document.createElement('div'); co.className = 'callout' + (mine ? ' mine' : ''); co.innerHTML = `${ball(n)}<span>SỐ ${n}!${mine ? ' <span style="color:var(--red)">CÓ TRONG VÉ</span>' : ''}</span>`; G.el.querySelector('.hud').appendChild(co); setTimeout(() => co.remove(), 2250);
  if (mine) { spawnBall(n, 'ticket'); }
  else if (Math.random() < .45) spawnBall(n, 'called');
  if (Math.random() < .3) { const u = G.order.slice(G.oi + 3).find(x => !G.ticket.includes(x)); if (u) spawnBall(u, 'uncalled'); }
}
function nearestBall() { let best = null, bd = 140; for (const b of G.balls) { const d = Math.hypot(b.x - G.px, b.y - G.py); if (d < bd) { bd = d; best = b; } } return best; }
function doJump() { if (G.me.jump > 0 || ovRoot.children.length) return; G.me.jump = .5; G.jumps++; beep('jump'); }
function doPick() {
  if (ovRoot.children.length || G.done) return; const b = nearestBall();
  if (!b) return toast('Không có quả lô tô nào ở gần – đi tới quả đang sáng!', 'bad');
  if (b.kind === 'uncalled' && !G.called.includes(b.n)) { toast(`Số ${b.n} chưa được gọi – không lụm được!`, 'bad'); b.el.animate([{ transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'none' }], { duration: 250 }); return; }
  b.el.classList.add('pop'); setTimeout(() => b.el.remove(), 360); G.balls.splice(G.balls.indexOf(b), 1);
  const sp = document.createElement('div'); sp.className = 'spark'; sp.style.left = (b.x - 30) + 'px'; sp.style.top = (b.y - 200) + 'px';
  const sx = b.x - G.cx, sy = b.y - G.cy - 70;
  if (G.ticket.includes(b.n) && !G.got.includes(b.n)) { G.got.push(b.n); beep('pick'); floatText(sx, sy - 60, '+1 VÉ!'); burst(sx, sy, { n: 12, dist: 140 });
    const slot = G.el.querySelectorAll('#ticket .ball')[G.ticket.indexOf(b.n)]; const r = rectOf(slot); const fly = document.createElement('div'); fly.innerHTML = ball(b.n, 'sm'); fly.style.cssText = `position:absolute;left:${sx}px;top:${sy}px;translate:-50% -50%`; fxRoot.appendChild(fly);
    fly.animate([{ transform: 'scale(1)' }, { transform: `translate(${(r.cx - sx) * .5}px, ${(r.cy - sy) * .5 - 160}px) scale(1.25)`, offset: .5 }, { transform: `translate(${r.cx - sx}px, ${r.cy - sy}px) scale(.72)` }], { duration: 650, easing: 'cubic-bezier(.4,0,.3,1)' }).onfinish = () => { fly.remove(); renderTicket(); burst(r.cx, r.cy, { n: 10, dist: 90 }); beep('coin');
      if (G.got.length === 5) { G.el.querySelector('#kinh').classList.remove('hidden'); toast('Đủ 5 số rồi! Bấm KINH ngay!', 'info', 'trophy'); beep('win'); } }; }
  else { G.extras.push(b.n); beep('coin'); floatText(sx, sy - 40, '+1 xu'); burst(sx, sy, { n: 6, dist: 80 }); }
}
function doKinh() { if (G.done || ovRoot.children.length) return; if (G.got.length < 5) return toast(`Chưa đủ số để KINH – vé mới ${G.got.length}/5!`, 'bad'); endGame(true); }
function renderTicket() { const e = G.el.querySelector('#ticket'); e.innerHTML = G.ticket.map(n => `<div class="ball xs ${n > 45 ? 'g' : ''} ${G.got.includes(n) ? 'got' : ''}">${n}</div>`).join(''); G.el.querySelector('#mine').textContent = G.got.length + '/5'; }
function renderCalled() { G.el.querySelector('#called').innerHTML = G.called.slice(-4).map(n => ball(n, 'sm')).join(''); }
function endGame(win, why) { if (G.done) return; G.done = true; G.running = false; cancelAnimationFrame(G.raf);
  const fl = document.createElement('div'); fl.className = 'flash'; G.el.appendChild(fl);
  if (win) { const k = document.createElement('div'); k.className = 'kinh-splash'; k.innerHTML = `<div class="rays"></div><div class="word">${jd('KINH!', { h: 330, fill: 'var(--red)', sw: 14 })}</div>`; G.el.appendChild(k); confetti(k, 90); shake(stage, 22); beep('kinh'); burst(960, 540, { n: 30, dist: 700, size: 28 });
    setTimeout(() => go('result', { win, got: G.got.length, extras: G.extras.length, jumps: G.jumps }, { push: false }), 1900); return; }
  if (!win && why) toast(why === 'HẾT GIỜ!' ? 'Hết giờ! Đội Xanh thắng.' : why, 'bad', 'clock');
  setTimeout(() => go('result', { win, got: G.got.length, extras: G.extras.length, jumps: G.jumps }, { push: false }), 900); }

/* ---- popups in game ---- */
function openBag() { if (ovRoot.children.length) return; overlay({ title: '', width: 980, body: `<div style="position:absolute;left:0;top:0;right:0;bottom:0;border-radius:30px;background:linear-gradient(#E5543A,#B8331F);z-index:-1"></div>
  <img src="${IMG('pouch.webp')}" style="position:absolute;left:50%;top:-110px;transform:translateX(-50%);width:190px;border-radius:50%;border:6px solid var(--brown)">${jd('TÚI CỦA BẠN', { h: 84, sw: 6 })}
  <b style="font-weight:700;font-size:28px;color:var(--cream)">Vé ${G.got.length}/5 · thêm ${G.extras.length} số ngoài vé</b>
  <div class="row" style="gap:28px;padding:28px 40px;border-radius:30px;background:var(--cream);border:6px solid var(--gold);flex-wrap:wrap;justify-content:center;max-width:880px">${G.ticket.map(n => G.got.includes(n) ? ball(n) : `<div class="ball empty">?</div>`).join('')}</div>
  ${G.extras.length ? `<div class="row" style="gap:12px;flex-wrap:wrap;justify-content:center">${G.extras.slice(-8).map(n => ball(n, 'xs')).join('')}</div>` : ''}<b style="font-weight:700;font-size:22px;color:var(--cream);opacity:.85">Chạm ra ngoài để đóng túi</b>`, close: false }); }
function openMap() { if (ovRoot.children.length) return; const s = 640 / WORLD.w; overlay({ title: 'BẢN ĐỒ · ' + MAPS[ROOM.map][0].toUpperCase(), width: 760, dimClose: false, body: `<div style="position:relative;width:640px;height:${WORLD.h * s}px;border:5px solid var(--brown);border-radius:14px;overflow:hidden;background:url(${IMG('world_small.jpg')}) 0 0/100% 100%">
  ${G.balls.map(b => `<div style="position:absolute;left:${b.x * s - 13}px;top:${b.y * s - 13}px;width:26px;height:26px;border-radius:50%;background:${b.kind === 'ticket' ? 'var(--gold)' : '#fff'};border:3px solid var(--brown)"></div>`).join('')}
  <div style="position:absolute;left:${G.px * s - 30}px;top:${G.py * s - 30}px;width:60px;height:60px;border-radius:50%;background:rgba(211,63,42,.3)"></div><div style="position:absolute;left:${G.px * s - 14}px;top:${G.py * s - 14}px;width:28px;height:28px;border-radius:50%;background:var(--red);border:4px solid #fff"></div>
  <span class="tag red" style="position:absolute;left:${G.px * s - 50}px;top:${G.py * s + 18}px;font-size:16px">Bạn ở đây</span></div>
  <div class="row" style="gap:24px;font-weight:700;font-size:22px"><span class="row" style="gap:8px"><i style="width:22px;height:22px;border-radius:50%;background:var(--gold);border:3px solid var(--brown)"></i>Số trong vé</span><span class="row" style="gap:8px"><i style="width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid var(--brown)"></i>Số khác</span></div>` }); }
function openBoard() { if (ovRoot.children.length) return; const o = overlay({ title: 'BẢNG SỐ LÔ TÔ', width: 1320, body: `<b style="font-weight:700;font-size:24px;color:var(--brown5)">Số đã gọi được tô màu · viền vàng là số trong vé của bạn</b>
  <div style="display:grid;grid-template-columns:repeat(10,109px);gap:10px">${Array.from({ length: 90 }, (_, i) => i + 1).map(n => { const c = G.called.includes(n), t = G.ticket.includes(n);
    return `<div class="center" style="height:50px;border-radius:14px;border:${t ? '5px solid var(--gold)' : (c ? '3px' : '2px') + ' solid var(--brown)'};background:${c ? (n > 45 ? 'var(--lgreen)' : 'var(--lred)') : 'var(--cream2)'};font:28px var(--num);color:${c ? '#fff' : 'var(--brown5)'};${c || t ? '' : 'opacity:.8'}">${String(n).padStart(2, '0')}</div>`; }).join('')}</div>
  ${btn('KINH!', { attrs: 'data-k', style: 'width:420px' })}` }); on(o, '[data-k]', () => { if (G.got.length < 5) return toast(`Chưa đủ số – vé mới ${G.got.length}/5!`, 'bad'); o.close(); doKinh(); }); }
function openPause() { if (ovRoot.children.length) return; const o = overlay({ title: 'CÀI ĐẶT', color: 'blue', width: 900, body: `${[['Âm thanh', 'sound'], ['Nhạc nền', 'music']].map(([l, k]) => `<div class="row subcard" style="width:100%;padding:12px 20px 12px 26px"><b style="flex:1;font-weight:800;font-size:30px">${l}</b><div class="switch ${S[k] ? 'on' : ''}" data-sw="${k}"></div></div>`).join('')}
  ${btn('TIẾP TỤC', { color: 'green', size: 'm', attrs: 'data-cont', style: 'width:100%' })}<div class="row" style="gap:18px;width:100%">${btn('ĐẦU HÀNG', { color: 'yellow', size: 'm', attrs: 'data-give', style: 'flex:1' })}${btn('VỀ SẢNH', { size: 'm', attrs: 'data-exit', style: 'flex:1' })}</div>` });
  on(o, '[data-sw]', (e, s) => { const k = s.dataset.sw; S[k] = !S[k]; s.classList.toggle('on', S[k]); save(); if (k === 'music') music(S[k]); });
  on(o, '[data-cont]', () => o.close());
  on(o, '[data-give]', () => { o.close(); endGame(false, 'Bạn đã đầu hàng – Đội Xanh thắng.'); });
  on(o, '[data-exit]', () => { o.close(); confirmBox({ title: 'THOÁT TRẬN?', text: 'Thoát bây giờ sẽ bị tính thua\nvà mất số đã lụm trong túi!', no: 'CHƠI TIẾP', yes: 'THOÁT', onYes: () => { G.done = true; go('lobby'); } }); }); }

/* ---- result & summary ---- */
SCREENS.result = {
  html: ({ win }) => { const mine = [S.char, 'chuot', 'rong', 'khi'], opp = ['ho', 'meo', 'cho', 'heo']; const winners = win ? mine : opp, losers = win ? opp : mine;
    return `<div class="abs" style="inset:0;background:var(--brown)"><div class="abs" style="inset:14px;overflow:hidden;background:linear-gradient(#FCC59A,#F8EDD9)">
      <div class="abs" style="left:560px;top:0;width:772px;height:1052px;clip-path:polygon(0 0,100% 0,173% 100%,-73% 100%);background:${win ? 'rgba(255,244,232,.5)' : 'rgba(233,227,160,.55)'}"></div><div id="cf"></div>
      <div class="abs row" style="left:0;right:0;top:56px;justify-content:center;gap:28px">${winners.concat(losers).map((k, i) => `<div style="width:116px;height:116px;border-radius:50%;border:7px solid ${(i < 4) === win ? 'var(--lred)' : 'var(--lgreen)'};background:var(--cream) url(${charImg(k)}) center/contain no-repeat;${i >= 4 ? 'opacity:.6' : ''}"></div>`).join('')}</div>
      <div class="abs center stamp" style="left:0;right:0;top:200px;animation-delay:.25s">${jd(win ? 'ĐỎ THÌ KINH RỒI !!!' : 'XANH THÌ KINH RỒI !!!', { h: 175, stroke: win ? 'var(--lred)' : 'var(--lgreen)', sw: 9 })}</div>
      <div class="abs" style="left:0;right:0;top:505px;text-align:center;font-weight:800;font-size:30px">${win ? '🎉 Bạn đã KINH! Đội Đỏ chiến thắng!' : 'Tiếc quá! Đội Xanh về đích trước.'} <span style="opacity:.7">· Chạm để xem tổng kết →</span></div>
      ${winners.map((k, i) => { const x = [150, 590, 1030, 1470][i], y = [770, 812, 812, 770][i]; return `<div class="abs podium-rise" style="left:0;top:0;animation-delay:${.5 + i * .15}s">${podiumAt(!win, x + 160, y)}</div><div class="abs char-jump" style="left:0;top:0;width:1px;height:1px;animation-delay:${.9 + i * .18}s,${2 + i * .2}s">${charOn(k, x + 160, y + 52, 245)}</div>`; }).join('')}</div></div>`; },
  mount(el, p) { beep(p.win ? 'win' : 'bad'); if (p.win) confetti(el.querySelector('#cf')); const nx = () => cur === 'result' && go('summary', p, { push: false }); el.onclick = () => { beep(); nx(); }; setTimeout(nx, 4500); }
};

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
      <div class="abs center" style="left:54px;top:488px;width:130px;height:150px;clip-path:polygon(0 0,100% 0,100% 63%,50% 100%,0 63%);background:var(--textd)"><div class="center" style="width:116px;height:136px;margin-top:-4px;clip-path:polygon(0 0,100% 0,100% 63%,50% 100%,0 63%);background:var(--gold)"><div class="center" id="lv" style="width:82px;height:100px;margin-top:-12px;clip-path:polygon(0 0,100% 0,100% 63%,50% 100%,0 63%);background:var(--cream1)">${jd(String(S.level), { h: 64, fill: 'var(--textd)', sw: 0, shadow: false })}</div></div></div>
      <div class="abs" style="left:164px;top:526px;width:600px;height:70px;border-radius:35px;border:6px solid var(--textd);background:#fff;overflow:hidden"><div id="bar" style="height:100%;width:${(S.lvProg || 0) / xpNeed(S.level) * 100}%;background:#5fd96b;border-right:6px solid var(--textd);border-radius:0 30px 30px 0;transition:width 1s ease-out"></div></div>
      <span id="lvl" class="abs" style="right:56px;top:610px;font-weight:700;font-size:22px;color:var(--brown5)">Lv.${S.level} → Lv.${S.level + 1}</span></div>
    <div class="abs row" style="left:966px;top:900px;gap:40px">${btn('VỀ SẢNH', { color: 'white', size: 'm', attrs: 'data-home', style: 'width:390px' })}${btn('CHƠI LẠI', { size: 'm', attrs: 'data-again', style: 'width:390px' })}</div></div></div>`,
  mount(el, p) { const earned = p.got * 4 + p.extras + (p.win ? 7 : 0), gain = p.win ? 35 : 12; const x0 = S.xp;
    S.coins += earned; S.xp += gain; S.stats.games++; if (p.win) { S.stats.wins++; S.stats.kinh++; } S.stats.picked += p.got + p.extras;
    QUESTS[0][2] = Math.min(QUESTS[0][3], QUESTS[0][2] + p.got + p.extras); QUESTS[3][2] = Math.min(QUESTS[3][3], QUESTS[3][2] + (p.jumps || 0)); if (p.win) QUESTS[1][2] = 1;
    let prog = (S.lvProg || 0) + gain, lvUp = false; while (prog >= xpNeed(S.level)) { prog -= xpNeed(S.level); S.level++; lvUp = true; } S.lvProg = prog; save();
    const cn = el.querySelector('#cn'), tx = el.querySelector('#tx'), tc = el.querySelector('#tc'); let i = 0; const steps = 24;
    setTimeout(() => { const iv = setInterval(() => { i++; const k = i / steps; cn.innerHTML = jd(String(Math.round(earned * k)), { h: 190, sw: 9 }); if (i % 3 === 0) beep('tick');
      if (i >= steps) { clearInterval(iv); const rc = rectOf(cn); burst(rc.cx, rc.cy, { n: 14, dist: 160 }); coinFly(rc.cx, rc.cy, earned, { n: 12 }); el.querySelector('#bonus').innerHTML = jd(': +' + gain, { h: 80, fill: 'var(--green5)', sw: 0, shadow: false });
        let j = 0; const iv2 = setInterval(() => { j++; tx.innerHTML = jd(': ' + Math.round(x0 + gain * j / 15), { h: 88, fill: 'var(--gold)', stroke: 'var(--textd)', sw: 7 }); if (j >= 15) { clearInterval(iv2); el.querySelector('#bar').style.width = (lvUp ? 100 : prog / xpNeed(S.level) * 100) + '%';
          if (lvUp) setTimeout(() => { if (cur !== 'summary') return; el.querySelector('#lv').innerHTML = jd(String(S.level), { h: 64, fill: 'var(--textd)', sw: 0, shadow: false }); el.querySelector('#bar').style.transition = 'none'; el.querySelector('#bar').style.width = prog / xpNeed(S.level) * 100 + '%'; el.querySelector('#lvl').textContent = `Lv.${S.level} → Lv.${S.level + 1}`; levelUp(); }, 1200); } }, 45); } }, 45); }, 600);
    on(el, '[data-home]', () => go('lobby')); on(el, '[data-again]', () => { WAIT_READY = { 'Rồng vàng': true, 'Hổ con': true, 'Mèo mướp': true, 'Ngựa ô': true, 'Gà gáy': true, 'Trâu vàng': true, 'Rắn lục': true }; go('waiting'); }); }
};
function levelUp() { beep('win'); S.coins += 300; save(); const o = overlay({ title: 'CHÚC MỪNG', close: false, width: 760, cls: 'reward', body: `<div class="rw-stage" style="height:250px"><div class="rays"></div><div class="glow"></div>${'<i class="tw"></i>'.repeat(6)}<div style="position:relative;width:180px;height:210px;clip-path:polygon(0 0,100% 0,100% 63%,50% 100%,0 63%);background:var(--textd)" class="center"><div class="center" style="width:160px;height:190px;clip-path:polygon(0 0,100% 0,100% 63%,50% 100%,0 63%);background:var(--gold)">${jd(String(S.level), { h: 90, fill: 'var(--textd)', sw: 0, shadow: false })}</div></div></div>
  <div class="rw-amt">LÊN CẤP ${S.level}!</div><div style="font-weight:600;font-size:28px">Mở khoá khung avatar Tết + 300 xu</div>${btn('TUYỆT VỜI!', { color: 'green', icon: 'check', style: 'width:100%' })}` });
  confetti(o, 60); o.querySelector('.btn').onclick = () => { const r = rectOf(o.querySelector('.rw-stage')); o.close(); S.coins -= 300; setTimeout(() => { S.coins += 300; save(); coinFly(r.cx, r.cy, 300, { n: 10 }); }, 120); }; }

/* ===== Entities: Goose-Goose-Duck style waddle movement ===== */
function makeEnt(k, name, team, x, y) {
  const R = RIG[k], h = 220, s = h / R.h, w = R.w * s, [ax, ay] = R.anchor, sw = (R.shadowW || R.w * .6) * s;
  const el = document.createElement('div'); el.className = 'ent';
  el.innerHTML = `<div class="sh" style="left:${(-sw / 2).toFixed(1)}px;top:-15px;width:${sw.toFixed(1)}px;height:30px"></div>
    <div class="sp rig" style="left:${(-ax * s).toFixed(1)}px;top:${(-ay * s).toFixed(1)}px;width:${w.toFixed(1)}px;height:${h}px;transform-origin:${(ax * s).toFixed(1)}px ${(ay * s).toFixed(1)}px">${rigLayers(k)}</div>
    <div class="nm ${team}" style="top:${(-ay * s - 44).toFixed(1)}px">${name}</div>`;
  G.ballsEl.appendChild(el);
  const parts = {}; el.querySelectorAll('[data-part]').forEach(p => parts[p.dataset.part] = p);
  return { k, name, team, x, y, vx: 0, vy: 0, face: 1, fs: 1, phase: 0, jump: 0, blend: 0, wasUp: false, seed: Math.random() * 6, el, parts, sp: el.querySelector('.sp'), sh: el.querySelector('.sh'), nm: el.querySelector('.nm') };
}
function animEnt(e, dt, now, ix, iy, maxSp) {
  const k = 1 - Math.exp(-dt * 14);                       // snappy accel / decel
  e.vx += (ix * maxSp - e.vx) * k; e.vy += (iy * maxSp - e.vy) * k;
  e.x = Math.max(120, Math.min(WORLD.w - 120, e.x + e.vx * dt)); e.y = Math.max(560, Math.min(WORLD.h - 60, e.y + e.vy * dt));
  const spd = Math.hypot(e.vx, e.vy), moving = spd > 50, amt = Math.min(1, spd / 820);
  if (e.vx < -35) e.face = -1; else if (e.vx > 35) e.face = 1;
  e.fs += (e.face - e.fs) * (1 - Math.exp(-dt * 26));    // quick flip through 0 (paper-turn)
  e.blend += ((moving ? 1 : 0) - e.blend) * (1 - Math.exp(-dt * 10));
  e.phase += spd * dt / 92 * Math.PI;                     // one step every ~92px
  const s = Math.sin(e.phase), lift = Math.abs(s);
  const up = lift > .55; if (moving && e.wasUp && !up) stepFx(e); e.wasUp = up;
  const hop = lift * (5 + 7 * amt) * e.blend;             // body bounce per step (feet do the stepping)
  const waddle = s * 7 * e.blend + (e.vx / 820) * 6;       // rock side to side + lean into run
  const squash = (1 - lift) * .08 * e.blend;               // squash on foot contact
  const breathe = Math.sin(now / 1000 * 3.2 + e.seed) * .022 * (1 - e.blend);
  if (e.jump > 0) e.jump = Math.max(0, e.jump - dt);
  const jt = e.jump > 0 ? 1 - e.jump / .5 : 0, jy = e.jump > 0 ? Math.sin(jt * Math.PI) * 150 : 0;
  const jsq = e.jump > 0 ? (jt < .12 ? -.12 : jt > .88 ? .12 : 0) : 0;
  const sx = e.fs * (1 + squash + jsq * .8), sy = 1 - squash + breathe - jsq + (1 - Math.abs(e.fs)) * .08;
  e.sp.style.transform = `translateY(${-(hop + jy).toFixed(1)}px) rotate(${waddle.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
  e.sh.style.transform = `scale(${(1 - (hop + jy) / 420).toFixed(3)})`; e.sh.style.opacity = (1 - jy / 300).toFixed(2);
  e.nm.style.transform = `translate(-50%,${-(hop * .4 + jy).toFixed(1)}px)`;
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
function botThink(e, dt, now) {
  let ix = 0, iy = 0;
  if (e.wait > 0) e.wait -= dt;
  else {
    if (!e.tx || Math.hypot(e.tx - e.x, e.ty - e.y) < 60) {
      if (e.tx && e.goal && G.balls.includes(e.goal)) { const b = e.goal; b.el.classList.add('pop'); setTimeout(() => b.el.remove(), 360); G.balls.splice(G.balls.indexOf(b), 1);
        const sx = e.x - G.cx, sy = e.y - G.cy - 200; if (sx > 0 && sx < 1920 && sy > 0 && sy < 1080) floatText(sx, sy, e.name.split(' ')[0] + ' lụm ' + b.n, e.team === 'red' ? 'var(--or5)' : '#7fe08a'); }
      e.goal = null; e.wait = .4 + Math.random() * 1.6;
      const decoys = G.balls.filter(b => b.kind !== 'ticket' && !G.bots.some(o => o.goal === b));
      if (decoys.length && Math.random() < .45) { const b = decoys[Math.floor(Math.random() * decoys.length)]; e.goal = b; e.tx = b.x; e.ty = b.y; }
      else { e.tx = Math.max(300, Math.min(WORLD.w - 300, e.x + (Math.random() - .5) * 2200)); e.ty = Math.max(800, Math.min(WORLD.h - 200, e.y + (Math.random() - .5) * 1800)); }
    } else { const dx = e.tx - e.x, dy = e.ty - e.y, d = Math.hypot(dx, dy); ix = dx / d * e.speedK; iy = dy / d * e.speedK; }
    if (Math.random() < dt * .08) e.jump = .5;
  }
  animEnt(e, dt, now, ix, iy, 820);
}
