/* ===== Create / Join / Find / Waiting / Countdown ===== */
const MAPS = [['Nhà của ngoại', 'map_nha_ngoai.jpg'], ['Cống sông quê', 'map_song_que.jpg'], ['Miệt vườn', 'map_miet_vuon.jpg']];
let ROOM = { host: true, name: 'Phòng của bạn', code: '012-345-678', map: 0, players: 8, time: 4, priv: false };
const randCode = () => [0, 0, 0].map(() => String(Math.floor(Math.random() * 1000)).padStart(3, '0')).join('-');

SCREENS.create = {
  html: () => { const r = ROOM; return `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('TẠO PHÒNG', 'red', 'Thiết lập màn chơi')}
    <div class="abs pill" data-host style="right:110px;top:58px;padding:12px 28px 14px 14px;border-radius:22px;cursor:pointer"><div style="width:84px;height:84px;border-radius:16px;border:4px solid var(--brown);background:var(--or5) url(${charImg(S.char)}) center/contain no-repeat"></div><div class="col" style="gap:6px"><span class="tag or" style="font-size:18px;align-self:flex-start">CHỦ PHÒNG</span><b style="font-size:28px;font-weight:800">${S.name}</b></div></div>
    <div class="abs panel" style="left:110px;top:226px;width:790px;padding:30px 40px 36px">
      <div class="sec-head"><div class="numbadge g">01</div><span style="flex:1;font-size:40px">CHỌN MAP</span>${btn('Ngẫu nhiên', { color: 'yellow', size: 's', icon: 'shuffle', attrs: 'data-rand' })}</div>
      <div style="margin-top:24px;padding:12px;border-radius:26px;background:var(--brown);position:relative"><img src="${IMG(MAPS[r.map][1])}" style="display:block;width:100%;height:386px;object-fit:cover;border-radius:16px"><span class="tag" style="position:absolute;left:36px;bottom:34px;background:var(--green);color:var(--cream);border-color:var(--cream);font-size:26px">${MAPS[r.map][0].toUpperCase()}</span></div>
      <div class="row" style="gap:22px;margin-top:26px">${MAPS.map(([n, im], i) => `<div data-map="${i}" class="col" style="flex:1;gap:8px;padding:8px 8px 10px;border-radius:18px;align-items:center;cursor:pointer;background:${i === r.map ? 'var(--or5)' : 'var(--brown)'};${i === r.map ? 'outline:5px solid var(--red)' : ''}"><img src="${IMG(im)}" style="width:100%;height:112px;object-fit:cover;border-radius:12px;${i === r.map ? '' : 'opacity:.85'}"><b style="font-weight:700;font-size:20px;color:${i === r.map ? 'var(--brown)' : 'var(--cream)'}">${n}</b></div>`).join('')}</div></div>
    <div class="abs panel" style="left:1000px;top:226px;width:810px;padding:18px 26px 22px"><div class="sec-head"><div class="numbadge b" style="transform:scale(.8)">02</div>CÀI ĐẶT TRẬN ĐẤU</div>
      <div class="row" style="gap:18px;margin-top:14px;align-items:stretch">
        <div class="subcard col" style="flex:1;padding:16px 20px 22px;gap:16px;align-items:center;border-width:4px"><div class="row" style="gap:10px;width:100%">${ic('users', 'var(--brown)', 34)}<b style="flex:1;font-weight:800;font-size:22px">Số người chơi</b><span class="tag red" style="font-size:18px">${r.players} người</span></div>
          <div class="row" style="gap:18px"><div class="iconbtn" data-pl="-1" style="width:58px;height:58px;background:var(--or5);${r.players <= 2 ? 'opacity:.4' : ''}">${ic('minus', 'var(--brown)', 30)}</div><div class="center" style="width:110px;height:62px;border-radius:14px;border:4px solid var(--brown);background:var(--cream);font-weight:900;font-size:36px">${r.players}</div><div class="iconbtn" data-pl="1" style="width:58px;height:58px;background:var(--or5);${r.players >= 16 ? 'opacity:.4' : ''}">${ic('plus', 'var(--brown)', 30)}</div></div>
          <div class="row" style="gap:12px">${[4, 8, 12, 16].map(q => `<span class="chip ${q === r.players ? 'on' : ''}" data-plq="${q}">${q}</span>`).join('')}</div></div>
        <div class="subcard col" style="flex:1;padding:16px 20px 22px;gap:12px;align-items:center;border-width:4px"><div class="row" style="gap:10px;width:100%">${ic('clock', 'var(--brown)', 34)}<b style="flex:1;font-weight:800;font-size:22px">Nhiệm vụ chung</b><span class="tag blue" style="font-size:18px">${r.time === 0 ? 'Random' : r.time + ' phút'}</span></div>
          <span style="font-weight:700;font-size:20px;color:var(--brown5)">Thời gian ra nhiệm vụ chung</span><div class="row" style="gap:12px;flex-wrap:wrap;justify-content:center">${[2, 4, 6, 0].map(t => `<span class="chip ${t === r.time ? 'onb' : ''}" data-time="${t}">${t ? t + ' phút' : 'Random'}</span>`).join('')}</div></div></div></div>
    <div class="abs row" style="left:1000px;top:676px;gap:24px">
      <div class="panel col" style="width:393px;height:250px;padding:18px 26px;align-items:center;gap:14px"><div class="sec-head" style="font-size:34px"><div class="numbadge y" style="transform:scale(.8)">03</div>CHẾ ĐỘ</div>
        <div class="row" style="gap:20px">${[[true, 'RIÊNG TƯ', 'lock'], [false, 'CÔNG KHAI', 'globe']].map(([p, l, i]) => `<div data-priv="${p}" class="col center" style="width:150px;height:128px;gap:10px;border-radius:20px;cursor:pointer;border:${r.priv === p ? 5 : 4}px solid var(--brown);background:${r.priv === p ? 'var(--green)' : 'var(--cream)'};${r.priv === p ? 'box-shadow:var(--hard-s)' : ''}">${ic(i, r.priv === p ? 'var(--cream)' : 'var(--brown)', 40)}<b style="font-weight:800;font-size:20px;color:${r.priv === p ? 'var(--cream)' : 'var(--brown)'}">${l}</b></div>`).join('')}</div></div>
      <div class="panel orange col" style="width:393px;height:250px;padding:18px 26px;gap:16px;justify-content:center"><div class="sec-head" style="font-size:34px"><div class="numbadge r" style="transform:scale(.8)">04</div>CODE PHÒNG</div>
        <div class="row" data-copy style="justify-content:space-between;padding:20px 18px 22px 22px;border-radius:20px;border:5px solid var(--brown);background:var(--cream);cursor:pointer"><span style="font-weight:900;font-size:30px;white-space:nowrap">${r.code}</span>${ic('copy', 'var(--brown)', 34)}</div></div></div>
    <div class="abs" style="left:1105px;top:946px">${btn('TẠO PHÒNG', { attrs: 'data-create', style: 'width:600px' })}</div>`; },
  mount(el) { wireCommon(el); el.querySelector('[data-rand]')?.classList.add('nodash'); const re = () => go('create', {}, { push: false }); ROOM.host = true;
    on(el, '[data-map]', (e, d) => { ROOM.map = +d.dataset.map; re(); }); on(el, '[data-rand]', () => { ROOM.map = (ROOM.map + 1 + Math.floor(Math.random() * 2)) % 3; re(); });
    on(el, '[data-pl]', (e, d) => { ROOM.players = Math.max(2, Math.min(16, ROOM.players + +d.dataset.pl)); re(); }); on(el, '[data-plq]', (e, d) => { ROOM.players = +d.dataset.plq; re(); });
    on(el, '[data-time]', (e, d) => { ROOM.time = +d.dataset.time; re(); }); on(el, '[data-priv]', (e, d) => { ROOM.priv = d.dataset.priv === 'true'; re(); });
    on(el, '[data-copy]', () => { try { navigator.clipboard.writeText(ROOM.code); } catch {} toast('Đã sao chép mã phòng ' + ROOM.code, 'ok', 'copy'); });
    on(el, '[data-host]', () => toast('Bạn là chủ phòng – có thể đổi mọi cài đặt', 'info', 'crown'));
    on(el, '[data-create]', () => { Object.assign(ROOM, { host: true, name: 'Phòng của bạn' }); go('waiting'); }); }
};
SCREENS.create.html = (orig => p => { if (!ROOM.host || !ROOM._init) { ROOM = { host: true, name: 'Phòng của bạn', code: randCode(), map: 0, players: 8, time: 4, priv: false, _init: true }; } return orig(p); })(SCREENS.create.html);

SCREENS.join = {
  html: () => `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('VÀO PHÒNG', 'blue', 'Nhập mã phòng bạn bè gửi')}
    <div class="abs panel" style="left:510px;top:232px;width:900px;height:790px">
      <div class="abs row" style="left:60px;top:50px;width:780px;height:110px;padding:0 28px;gap:16px;border-radius:24px;border:6px solid var(--brown);background:#fff"><b style="font-weight:900;font-size:54px;color:var(--brown5)">#</b><span id="code" style="font:60px var(--num);color:var(--textd);letter-spacing:.06em"></span><span style="width:5px;height:60px;background:var(--red);animation:pulse 1s infinite"></span></div>
      <div class="abs" style="left:0;right:0;top:176px;text-align:center;font-weight:600;font-size:24px;color:var(--brown5)">Bấm phím số (hoặc gõ bàn phím) · ⌫ để xoá · thử mã 012345678</div>
      <div class="abs" style="left:170px;top:230px;width:560px;display:grid;grid-template-columns:repeat(3,173px);gap:18px 20px">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'].map(k => `<div data-key="${k}" class="center" style="height:96px;border-radius:24px;border:5px solid var(--brown);box-shadow:var(--hard-s);cursor:pointer;background:${k === 'OK' ? 'var(--green5)' : k === '⌫' ? 'var(--or5)' : 'var(--cream2)'};font:${k === 'OK' ? '900 34px var(--font)' : '48px var(--num)'};color:${k === 'OK' ? '#fff' : 'var(--brown)'}">${k === '⌫' ? ic('delete', 'var(--brown)', 44) : k === 'OK' ? 'VÀO' : k}</div>`).join('')}</div></div>`,
  mount(el) { wireCommon(el); let code = ''; const disp = el.querySelector('#code');
    const render = () => disp.textContent = code.replace(/(\d{3})(?=\d)/g, '$1-');
    const press = k => { if (k === '⌫') code = code.slice(0, -1); else if (k === 'OK') return submit(); else if (code.length < 9) code += k; render(); };
    const submit = () => { if (code.length < 6) return toast('Mã phòng cần ít nhất 6 số', 'bad'); if (code === '000000000') return toast('Không tìm thấy phòng – kiểm tra lại mã nhé', 'bad');
      ROOM = { host: false, name: 'Phòng bạn bè', code: code.replace(/(\d{3})(?=\d)/g, '$1-'), map: 2, players: 8, time: 4, priv: true }; go('waiting'); };
    on(el, '[data-key]', (e, d) => press(d.dataset.key));
    const kh = e => { if (cur !== 'join') return removeEventListener('keydown', kh); if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('⌫'); else if (e.key === 'Enter') press('OK'); };
    addEventListener('keydown', kh); }
};

const ROOMS = [['Hội Lô Tô Xóm Chợ', 0, 'chuot', 5, 'Nhà của ngoại', '4 phút', false], ['Tết này ai KINH?', 1, 'rong', 7, 'Cống sông quê', '2 phút', true], ['Phòng của Hổ con', 2, 'ho', 8, 'Miệt vườn', '6 phút', false],
  ['Mèo lười lụm số', 0, 'meo', 3, 'Nhà của ngoại', 'Random', false], ['Khỉ nhảy cao', 2, 'khi', 6, 'Miệt vườn', '4 phút', true], ['Heo ăn Tết', 1, 'heo', 8, 'Cống sông quê', '2 phút', false]];
SCREENS.find = {
  html: ({ filter = 'Tất cả', q = '' }) => { let list = ROOMS.map((r, i) => [...r, i]); if (filter === 'Còn chỗ') list = list.filter(r => r[3] < 8); if (filter === 'Có bạn bè') list = list.filter(r => r[6]); if (q) list = list.filter(r => r[0].toLowerCase().includes(q.toLowerCase()));
    return `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('TÌM PHÒNG', 'red', 'Phòng công khai đang mở')}
    <div class="abs row" style="left:110px;top:232px;gap:20px"><div class="row" style="width:560px;height:76px;padding:0 24px;gap:14px;border-radius:999px;border:5px solid var(--brown);background:#fff">${ic('search', 'var(--brown5)', 34)}<input id="q" value="${q}" placeholder="Tìm theo tên phòng..." style="flex:1;border:none;outline:none;font-size:24px;font-weight:700;color:var(--textd);background:none"></div>
      ${['Tất cả', 'Còn chỗ', 'Có bạn bè'].map(f => `<span class="chip ${f === filter ? 'on' : ''}" data-f="${f}" style="font-size:24px;font-weight:800;padding:10px 26px 12px;border-width:4px">${f}</span>`).join('')}
      <div class="iconbtn" data-refresh style="width:76px;height:76px;background:var(--or5)">${ic('refresh', 'var(--brown)', 38)}</div></div>
    <div class="abs" style="left:110px;top:340px;width:1700px;display:flex;flex-wrap:wrap;gap:26px 30px">${list.length ? list.map(([n, m, h, c, mp, tm, fr, i]) => `<div class="row panel" data-room="${i}" style="width:835px;gap:20px;padding:16px 20px 16px 16px;border-radius:28px;border-width:5px;box-shadow:var(--hard-s);cursor:pointer;${c >= 8 ? 'opacity:.8' : ''}">
      <img src="${IMG(MAPS[m][1])}" style="width:190px;height:120px;object-fit:cover;border-radius:16px;border:4px solid var(--brown)"><div class="col" style="flex:1;gap:8px"><b style="font-weight:800;font-size:28px">${n}</b><div class="row" style="gap:10px"><img src="${charImg(h)}" width="40" height="40" style="border-radius:50%;border:3px solid var(--brown);background:var(--or5);object-fit:contain">
      <span class="tag ${c >= 8 ? 'red' : 'green'}" style="font-size:18px">${c}/8 người</span><span class="tag cream" style="font-size:18px">${tm}</span>${fr ? '<span class="tag blue" style="font-size:18px">Có bạn bè</span>' : ''}</div></div>${btn(c >= 8 ? 'ĐẦY' : 'VÀO', { color: c >= 8 ? 'white' : 'green', size: 'm' })}</div>`).join('') : '<div class="panel" style="padding:40px;font-weight:800;font-size:30px">Không có phòng phù hợp – thử bộ lọc khác nhé!</div>'}</div>`; },
  mount(el, p) { wireCommon(el);
    on(el, '[data-f]', (e, d) => go('find', { filter: d.dataset.f, q: p.q || '' }, { push: false }));
    const qi = el.querySelector('#q'); qi.onchange = () => go('find', { filter: p.filter || 'Tất cả', q: qi.value }, { push: false });
    on(el, '[data-refresh]', () => { ROOMS.forEach(r => { if (r[3] < 8 || Math.random() < .3) r[3] = Math.max(2, Math.min(8, r[3] + Math.round(Math.random() * 2 - 1))); }); toast('Đã làm mới danh sách phòng', 'ok', 'refresh'); go('find', p, { push: false }); });
    on(el, '[data-room]', (e, d) => { const [n, m, h, c, mp, tm] = ROOMS[+d.dataset.room]; if (c >= 8) return toast('Phòng này đã đủ người – thử phòng khác nhé!', 'bad');
      ROOM = { host: false, name: n, code: randCode(), map: m, players: 8, time: parseInt(tm) || 0, priv: false, hostChar: h }; go('waiting'); }); }
};

SCREENS.waiting = {
  html: () => { const r = ROOM; const me = ['me', S.char, S.name.split(' ').slice(-2).join(' '), r.host];
    const others = [['chuot', 'Chuột chít', !r.host && !r.hostChar], ['rong', 'Rồng vàng'], ['khi', 'Khỉ lém'], ['ho', 'Hổ con'], ['meo', 'Mèo mướp'], ['cho', 'Cún nhà']];
    if (r.hostChar) others[0] = [r.hostChar, 'Chủ phòng', true];
    const ready = WAIT_READY;
    const card = (p, team) => { if (!p) return `<div class="center" data-invite style="width:368px;height:200px;border-radius:24px;border:4px dashed var(--brown5);background:var(--cream);gap:12px;cursor:pointer;font-weight:800;font-size:26px;color:var(--brown5)">${ic('plus', 'var(--brown5)', 44)}Mời bạn bè</div>`;
      const isMe = p[0] === 'me'; const [k, n, host] = isMe ? [p[1], p[2], p[3]] : p; const rd = isMe ? ready.me : ready[n];
      return `<div class="row" ${isMe ? '' : `data-player="${n}"`} style="width:368px;height:200px;padding:12px 16px 12px 12px;gap:14px;border-radius:24px;cursor:pointer;background:var(--cream2);border:${rd ? 5 : 4}px solid ${rd ? (team ? 'var(--lgreen)' : 'var(--lred)') : 'var(--brown)'}">
        <div style="width:160px;height:160px;border-radius:20px;border:3px solid var(--brown);background:var(--or3) url(${charImg(k)}) center/contain no-repeat;flex:none"></div>
        <div class="col" style="gap:8px;min-width:0"><b style="font-weight:800;font-size:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</b><span class="tag ${rd ? 'green' : 'cream'}" style="font-size:16px;align-self:flex-start">${rd ? '✓ Sẵn sàng' : 'Đang chọn đồ…'}</span>
          ${isMe ? '<span class="tag blue" style="font-size:15px;align-self:flex-start">BẠN</span>' : ''}${host ? '<span class="tag gold" style="font-size:15px;align-self:flex-start">👑 CHỦ PHÒNG</span>' : ''}</div></div>`; };
    const red = [me, others[0], others[1], others[2]], green = [others[3], others[4], others[5], null];
    return `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn('RỜI PHÒNG', 'left', 'data-leave')}</div>${banner('PHÒNG CHỜ', 'red', (r.host ? 'Phòng của bạn' : r.name) + ' · Mã ' + r.code)}
    <div class="abs pill" style="right:110px;top:70px;padding:10px 24px 12px 18px">${ic('map', 'var(--brown)', 30)}<span style="font-weight:800;font-size:22px">${MAPS[r.map][0]} · 7/${r.players} người · ${r.time ? r.time + ' phút' : 'Random'}</span></div>
    ${[['ĐỎ', 'var(--lred)', red, 0, 110], ['XANH', 'var(--lgreen)', green, 1, 990]].map(([t, c, list, ti, x]) => `<div class="abs panel" style="left:${x}px;top:232px;width:820px;padding:22px 26px 26px">
      <div class="row" style="gap:14px;margin-bottom:18px"><span class="tag" style="background:${c};color:#fff;font-size:30px;font-weight:900;padding:6px 22px 8px;border-width:4px">ĐỘI ${t}</span><b style="font-weight:800;font-size:26px;color:var(--brown5)">${list.filter(Boolean).length}/4</b></div>
      <div style="display:grid;grid-template-columns:368px 368px;gap:16px">${list.map(p => card(p, ti)).join('')}</div></div>`).join('')}
    <div class="abs row" style="left:0;right:0;top:880px;justify-content:center;gap:22px">${btn('ĐỔI NHÂN VẬT', { color: 'white', size: 'm', icon: 'refresh', attrs: 'data-go="character"' })}${btn('CHAT', { color: 'yellow', size: 'm', icon: 'message', attrs: 'data-chat' })}${btn('MỜI', { color: 'blue', size: 'm', icon: 'plus', attrs: 'data-invite' })}
      ${btn(ready.me ? 'ĐÃ SẴN SÀNG' : 'SẴN SÀNG?', { color: ready.me ? 'lgreen' : 'yellow', size: 'm', icon: ready.me ? 'check' : 'clock', attrs: 'data-ready' })}
      ${r.host ? btn('BẮT ĐẦU', { size: 'm', icon: 'play', attrs: 'data-start' }) : btn(ready.me ? 'ĐANG CHỜ CHỦ PHÒNG…' : 'CHỜ CHỦ PHÒNG', { color: 'white', size: 'm', icon: 'clock', attrs: 'data-wait' })}</div>`; },
  mount(el) { wireCommon(el); clearTimeout(WAIT_T);
    WAIT_T = setTimeout(function tick() { if (cur !== 'waiting') return; const k = ['Khỉ lém', 'Cún nhà', 'Chuột chít'].find(n => !WAIT_READY[n]); if (k) { WAIT_READY[k] = true; go('waiting', {}, { push: false }); } }, 2200);
    on(el, '[data-leave]', () => confirmBox({ title: 'RỜI PHÒNG?', text: 'Bạn có chắc muốn rời phòng?\nĐội Đỏ sẽ thiếu một mật vụ đó!', no: 'Ở LẠI', yes: 'RỜI PHÒNG', onYes: () => { WAIT_READY = { 'Rồng vàng': true, 'Hổ con': true, 'Mèo mướp': true }; go('lobby'); } }));
    on(el, '[data-player]', (e, d) => toast('Đã gửi lời mời kết bạn tới ' + d.dataset.player, 'ok', 'users'));
    on(el, '[data-ready]', () => { WAIT_READY.me = !WAIT_READY.me; go('waiting', {}, { push: false }); if (!ROOM.host && WAIT_READY.me) setTimeout(() => { if (cur === 'waiting' && WAIT_READY.me) { toast('Chủ phòng đã bắt đầu trận!', 'info', 'play'); setTimeout(() => cur === 'waiting' && go('countdown'), 900); } }, 2500); });
    on(el, '[data-wait]', () => toast(WAIT_READY.me ? 'Chủ phòng sắp bắt đầu…' : 'Bấm SẴN SÀNG để báo chủ phòng nhé!', 'info', 'clock'));
    on(el, '[data-start]', () => { if (!WAIT_READY.me) return toast('Bấm SẴN SÀNG trước đã nhé!', 'bad'); go('countdown'); });
    on(el, '[data-chat]', () => { const msgs = ['Chào cả nhà! 👋', 'Nhanh lên nào, sắp bắt đầu rồi!', 'Ai có số 45 không?', 'Đội Đỏ quyết thắng! 🔥', 'Chúc mừng năm mới! 🧧', 'GG, chơi hay lắm!'];
      const o = overlay({ title: 'CHAT NHANH', width: 900, body: `<div class="row" style="flex-wrap:wrap;gap:16px;justify-content:center">${msgs.map(m => `<div class="row subcard" data-msg="${m}" style="gap:10px;padding:14px 22px 16px;border-width:4px;cursor:pointer;box-shadow:var(--hard-s);font-weight:800;font-size:24px">${ic('message', 'var(--brown)', 28)}${m}</div>`).join('')}</div>` });
      on(o, '[data-msg]', (e, d) => { o.close(); toast('Bạn: ' + d.dataset.msg, 'info', 'message'); setTimeout(() => cur === 'waiting' && toast('Rồng vàng: Chơi thôi! 🐉', 'info', 'message'), 1400); }); });
    on(el, '[data-invite]', () => { const o = overlay({ title: 'MỜI BẠN', color: 'blue', width: 920, body: `<b style="font-weight:800;font-size:26px;color:var(--brown5)">Bạn bè đang online</b>${FRIENDS.slice(0, 5).map(f => friendRow(f, 820)).join('')}` }); wireInvites(o); }); }
};
let WAIT_READY = { 'Rồng vàng': true, 'Hổ con': true, 'Mèo mướp': true }; let WAIT_T = 0;

SCREENS.countdown = {
  html: () => `<div class="abs" style="inset:0;background:url(${IMG('bg_kitchen.jpg')}) center/cover"></div><div class="abs" style="inset:0;background:rgba(31,10,5,.5)"></div>
    <div id="cd" class="abs center" style="inset:0"></div><div id="cds" class="abs" style="left:0;right:0;top:900px;text-align:center;font-weight:800;font-size:40px;color:var(--cream)">Chuẩn bị... đi lụm số nào!</div>`,
  mount(el) { const cd = el.querySelector('#cd'); let n = 3;
    const step = () => { if (cur !== 'countdown') return; if (n > 0) { cd.innerHTML = `<div style="transform:scale(3.4)"><div class="ball ${n === 2 ? 'g' : ''}" style="animation:spinIn .45s cubic-bezier(.2,1.5,.4,1)">${n}</div></div>`; burst(960, 540, { n: 12, dist: 300, size: 22 }); beep('call'); n--; setTimeout(step, 850); }
      else { cd.innerHTML = `<div class="stamp">${jd('BẮT ĐẦU!', { h: 220, sw: 10 })}</div>`; shake(stage, 18); burst(960, 520, { n: 24, dist: 520, size: 26 }); el.querySelector('#cds').textContent = 'Lụm đủ 5 số trên vé để KINH!'; beep('win'); setTimeout(() => cur === 'countdown' && go('game', {}, { push: false }), 900); } };
    step(); }
};
