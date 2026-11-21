/* ===== Leaderboard / Quests / Profile / Friends / Mail / Settings ===== */
const MAILS = [['li_xi.webp', 'Lì xì đầu năm từ Mật Vụ Lô Tô', 'Chúc mật vụ một năm mới lụm số thật nhiều, KINH thật nhanh! Ban quản trị gửi tặng bạn bao lì xì.', 500],
  ['gift.webp', 'Quà bảo trì máy chủ', 'Cảm ơn bạn đã kiên nhẫn chờ đợi – tặng bạn 200 xu.', 200],
  ['trophy.webp', 'Thưởng Top tuần trước', 'Bạn đứng #5 bảng xếp hạng tuần – nhận 300 xu.', 300],
  ['coin.webp', 'Chào mừng mật vụ mới!', 'Mỗi ngày đăng nhập để nhận quà điểm danh, làm nhiệm vụ để có thêm xu nhé.', 0]];
const QUESTS = [['Lụm 10 quả lô tô', 'coin.webp', 7, 10, 200], ['Thắng 1 trận', 'li_xi.webp', 1, 1, 300], ['Chơi 3 trận cùng bạn bè', 'coin_stack.webp', 3, 3, 500], ['Nhảy 20 lần trong trận', 'coin.webp', 12, 20, 100], ['Mặc trang phục nón lá', 'non_la.webp', 0, 1, 50]];

const lbData = tab => { const me = [S.char, S.name + ' (Bạn)'];
  return { 'Tuần': [['ho', 'Hổ con', 2480], ['rong', 'Rồng vàng', 2315], ['chuot', 'Chuột chút chít', 2190], ['meo', 'Mèo mướp', 1980], [...me, 1875], ['khi', 'Khỉ lém', 1720], ['cho', 'Cún nhà', 1650]],
    'Tháng': [['rong', 'Rồng vàng', 9820], [...me, 9410], ['ga', 'Gà gáy sớm', 9005], ['ho', 'Hổ con', 8770], ['heo', 'Heo ủn ỉn', 8320], ['ngua', 'Ngựa phi', 8100], ['trau', 'Trâu cày', 7950]] }[tab]; };
SCREENS.leaderboard = {
  html: ({ tab = 'Tuần' }) => { const D = lbData(tab);
    const pod = [[1, 260, 190, 1.15], [0, 10, 280, 1], [2, 520, 300, 1]].map(([i, x, y, sc]) => { const [k, n, xp] = D[i];
      const ps = .78 * sc, pcx = x + 160 * ps; return `${podiumAt(i > 0, pcx, y + 190 * sc, ps)}${charOn(k, pcx, y + 190 * sc + 50 * ps + 2, 205 * sc, { cls: 'breath' })}
        <div class="abs center" style="left:${x + 125 * .78 * sc - 30}px;top:${y - 30}px;width:60px;height:60px;border-radius:50%;border:4px solid var(--brown);background:${['var(--gold)', 'var(--cream2)', 'var(--or5)'][i]};font:32px var(--num);color:var(--textd)">${i + 1}</div>
        <div class="abs" style="left:${x - 20}px;width:${250 * .78 * sc + 40}px;top:${y + 190 * sc + 125 * sc}px;text-align:center"><b style="font-weight:800;font-size:24px;display:block">${n}</b><b style="font-weight:900;font-size:22px;color:var(--red)">${fmt(xp)} XP</b></div>
        <div class="abs" data-rank="${n.includes('(Bạn)') ? 'me' : n}" style="left:${x - 20}px;top:${y - 40}px;width:${250 * .78 * sc + 40}px;height:${(190 + 175) * sc + 40}px;cursor:pointer"></div>`; }).join('');
    return `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('XẾP HẠNG', 'blue')}
      <div class="abs row" style="left:110px;top:232px;gap:16px">${['Tuần', 'Tháng'].map(t => `<div class="chip ${t === tab ? 'on' : ''}" data-tab="${t}" style="font-size:28px;font-weight:800;padding:12px 34px 16px;border-radius:18px;border-width:5px">TOP ${t.toUpperCase()}</div>`).join('')}</div>
      <div class="abs" style="left:110px;top:320px;width:780px;height:720px"><img src="${IMG('trophy.webp')}" class="abs" style="left:315px;top:-10px;width:150px">${pod}</div>
      <div class="abs panel col" style="right:110px;top:232px;width:900px;padding:24px 26px 26px;gap:14px">${D.slice(3).map(([k, n, xp], i) => { const mine = n.includes('(Bạn)');
        return `<div class="row" data-rank="${mine ? 'me' : n}" style="gap:18px;padding:12px 24px 12px 18px;border-radius:22px;cursor:pointer;background:${mine ? 'var(--or5)' : 'var(--cream2)'};border:${mine ? '5px solid var(--red)' : '3px solid var(--brown)'}">
          <span style="font:34px var(--num)">#${i + 4}</span><img src="${charImg(k)}" width="78" height="78" style="border-radius:50%;border:3px solid var(--brown);background:var(--or3);object-fit:contain"><b style="flex:1;font-weight:800;font-size:26px">${n}</b><b style="font-weight:900;font-size:24px;color:var(--red)">${fmt(xp)} XP</b></div>`; }).join('')}
        <div class="row" style="gap:14px;padding:12px 20px;border-radius:20px;background:var(--blue);border:3px solid var(--brown);color:#fff;font-weight:700;font-size:22px"><img src="${IMG('coin_chest.webp')}" width="64">Top 3 ${tab.toLowerCase()} nhận Rương xu Tết – còn 2 ngày 14 giờ!</div></div>`; },
  mount(el) { wireCommon(el); on(el, '[data-tab]', (e, d) => go('leaderboard', { tab: d.dataset.tab }, { push: false }));
    on(el, '[data-rank]', (e, d) => { if (d.dataset.rank === 'me') return go('profile'); const tab = (curParams && curParams.tab) || 'Tuần', D = lbData(tab), i = D.findIndex(r => r[1] === d.dataset.rank); playerCard({ k: D[i][0], n: D[i][1], xp: D[i][2], rank: i + 1, xpLabel: 'XP ' + tab.toLowerCase() }); }); }
};

SCREENS.quests = {
  html: () => `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('NHIỆM VỤ', 'red', 'Làm mới sau 08:24:16')}<div class="abs" style="right:110px;top:66px">${coinPill()}</div>
    <div class="abs col" style="left:310px;top:240px;width:1300px;gap:18px">${QUESTS.map(([n, im, c, m, r], i) => { const ready = c >= m, done = S.quests[i];
      return `<div class="row panel" style="gap:24px;padding:16px 24px 16px 20px;border-radius:28px;border-width:5px;box-shadow:var(--hard-s)"><div class="center" style="width:100px;height:100px;border-radius:20px;background:var(--or3);border:3px solid var(--brown)"><img src="${IMG(im)}" width="80"></div>
        <div class="col" style="flex:1;gap:10px"><b style="font-weight:800;font-size:28px">${n}</b><div class="row" style="gap:14px"><div style="width:520px;height:26px;border-radius:13px;border:3px solid var(--brown);background:var(--cream2);overflow:hidden"><div style="height:100%;width:${c / m * 100}%;background:var(--green5)"></div></div><b style="font-weight:900;font-size:22px;color:var(--brown5)">${c}/${m}</b></div></div>
        <span class="tag or" style="font-size:22px">+${r} xu</span>${done ? `<div class="center" style="width:220px;height:80px;border-radius:18px;border:5px solid var(--brown);background:var(--cream2);font-weight:900;font-size:28px;color:var(--brown5);gap:8px">${ic('check', 'var(--green5)', 30)}ĐÃ NHẬN</div>`
        : ready ? btn('NHẬN', { color: 'lgreen', size: 'm', attrs: `data-claim="${i}"`, style: 'width:220px' }) : btn('ĐI LÀM', { color: 'white', size: 'm', attrs: 'data-do', style: 'width:220px' })}</div>`; }).join('')}</div>`,
  mount(el) { wireCommon(el); on(el, '[data-claim]', (e, d) => { const i = +d.dataset.claim; S.quests[i] = true; save(); reward({ img: QUESTS[i][1], amount: QUESTS[i][4], text: 'Hoàn thành: ' + QUESTS[i][0] }); go('quests', {}, { push: false }); });
    on(el, '[data-do]', () => go('find')); }
};

SCREENS.profile = {
  html: () => `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('HỒ SƠ', 'blue')}
    <div class="abs panel col" style="left:110px;top:232px;width:620px;padding:24px 30px 30px;align-items:center;gap:16px">
      <div style="position:relative;width:560px;height:430px;cursor:pointer" data-go="character">${podiumAt(false, 280, 270)}${charOn(S.char, 280, 322, 300, { cls: 'breath' })}</div>
      <div class="row" style="gap:14px"><b style="font-weight:900;font-size:40px">${S.name}</b><div class="center" data-rename style="width:56px;height:56px;border-radius:50%;background:var(--or5);border:4px solid var(--brown);box-shadow:var(--hard-s);cursor:pointer">${ic('pencil', 'var(--brown)', 28)}</div></div>
      <span style="font-weight:600;font-size:22px;color:var(--brown5)">ID: 2027-0612 · ${S.guest ? 'Tài khoản khách' : 'Tham gia từ Tết 2026'}</span>
      <div class="row" style="gap:14px"><span class="tag gold" style="font-size:24px">Lv.${S.level}</span><div style="width:380px;height:26px;border-radius:13px;border:3px solid var(--brown);background:var(--cream2);overflow:hidden"><div style="height:100%;width:${(S.lvProg || 0) / xpNeed(S.level) * 100}%;background:var(--green5)"></div></div></div></div>
    <div class="abs col" style="left:770px;top:232px;width:1040px;gap:24px">
      <div class="panel" style="padding:26px 30px 30px"><b style="font-weight:900;font-size:32px">THỐNG KÊ</b><div class="row" style="gap:18px;margin-top:16px">${[['Trận đã chơi', S.stats.games, 'var(--blue)'], ['Trận thắng', S.stats.wins, 'var(--green5)'], ['Số đã lụm', S.stats.picked, 'var(--red)'], ['Lần KINH', S.stats.kinh, 'var(--gold6)']].map(([l, v, c]) => `<div class="subcard col center" style="width:230px;padding:16px 0 18px;gap:6px"><span style="font:48px var(--num);color:${c}">${fmt(v)}</span><b style="font-weight:800;font-size:22px">${l}</b></div>`).join('')}</div></div>
      <div class="panel" style="padding:26px 30px 30px"><b style="font-weight:900;font-size:32px">THÀNH TÍCH</b><div class="row" style="gap:18px;margin-top:16px">${[['trophy.webp', 'Vua lô tô', S.stats.kinh >= 50], ['li_xi.webp', 'Lì xì đầu năm', true], ['kinh_mat_vu.webp', 'Mật vụ thứ thiệt', S.owned.includes('kinh')], ['ao_dai_tet.webp', 'Fashion Tết', S.owned.length >= 3], ['coin_chest.webp', 'Đại gia xu', S.coins >= 20000]].map(([im, l, g]) => `<div class="subcard col center" data-ach="${l}|${g}" style="width:180px;padding:12px 0 14px;gap:6px;background:${g ? 'var(--or3)' : 'var(--cream2)'};cursor:pointer"><img src="${IMG(im)}" width="96" style="${g ? '' : 'opacity:.35'}"><b style="font-weight:800;font-size:18px;color:${g ? 'var(--brown)' : 'var(--brown5)'}">${l}</b></div>`).join('')}</div></div></div>`,
  mount(el) { wireCommon(el);
    on(el, '[data-ach]', (e, d) => { const [l, g] = d.dataset.ach.split('|'); toast(g === 'true' ? 'Đã đạt: ' + l : 'Chưa mở khoá: ' + l, g === 'true' ? 'ok' : 'info', 'trophy'); });
    on(el, '[data-rename]', () => { const o = overlay({ title: 'ĐỔI TÊN', color: 'blue', body: `${field('Tên hiển thị mới', 'Nhập tên mới...', 'user', 'text', S.name)}<div style="font-weight:600;font-size:22px;color:var(--brown5)">Đổi tên lần đầu miễn phí · lần sau 100 xu</div>${btn('LƯU TÊN', { color: 'green', icon: 'check', attrs: 'data-save', style: 'width:100%' })}` });
      const inp = o.querySelector('input'); inp.focus(); inp.select();
      on(o, '[data-save]', () => { const v = inp.value.trim(); if (v.length < 2) return toast('Tên quá ngắn', 'bad'); if (S.renamed) { if (S.coins < 100) return toast('Không đủ 100 xu', 'bad'); S.coins -= 100; } S.renamed = true; S.name = v.slice(0, 24); save(); o.close(); toast('Đã đổi tên thành ' + S.name, 'ok', 'pencil'); go('profile', {}, { push: false }); }); }); }
};

const FRIENDS = [['chuot', 'Chuột chút chít', 'Đang chơi · Phòng Xóm Chợ', true], ['rong', 'Rồng vàng', 'Online', true], ['ho', 'Hổ con', 'Online', true], ['meo', 'Mèo mướp', 'Đang chơi', true], ['ga', 'Gà gáy sớm', 'Online', true], ['heo', 'Heo ủn ỉn', 'Offline 2 giờ trước', false], ['ngua', 'Ngựa phi', 'Offline hôm qua', false], ['trau', 'Trâu cày', 'Offline 3 ngày', false]];
const friendRow = ([k, n, st, onl], w = 837) => `<div class="row panel" style="width:${w}px;gap:16px;padding:14px 18px 14px 16px;border-radius:26px;border-width:5px;box-shadow:var(--hard-s);${onl ? '' : 'opacity:.8'}">
  <img src="${charImg(k)}" data-pcard="${k}|${n}|${st}" width="96" height="96" style="cursor:pointer;border-radius:50%;border:5px solid ${onl ? 'var(--green5)' : 'var(--brown5)'};background:var(--or3);object-fit:contain"><div class="col" data-pcard="${k}|${n}|${st}" style="flex:1;gap:6px;cursor:pointer"><b style="font-weight:800;font-size:28px">${n}</b><span style="font-weight:700;font-size:20px;color:${onl ? 'var(--green5)' : 'var(--brown5)'}">● ${st}</span></div>
  ${btn(onl ? 'MỜI' : 'NHẮN', { color: onl ? 'blue' : 'white', size: 'm', icon: 'send', attrs: `data-inv="${n}|${onl}"` })}</div>`;
SCREENS.friends = {
  html: () => `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('BẠN BÈ', 'red', '12 bạn · 5 đang online')}<div class="abs" style="right:110px;top:66px">${btn('THÊM BẠN', { color: 'green', size: 'm', icon: 'plus', attrs: 'data-add' })}</div>
    <div class="abs" style="left:110px;top:240px;width:1700px;display:flex;flex-wrap:wrap;gap:24px 26px">${FRIENDS.map(f => friendRow(f)).join('')}</div>`,
  mount(el) { wireCommon(el); wireInvites(el);
    on(el, '[data-add]', () => { const o = overlay({ title: 'THÊM BẠN', body: `${field('Nhập ID hoặc tên bạn bè', 'VD: 2027-0612', 'search')}${btn('GỬI LỜI MỜI', { color: 'green', icon: 'send', attrs: 'data-send', style: 'width:100%' })}` });
      o.querySelector('input').focus(); on(o, '[data-send]', () => { const v = o.querySelector('input').value.trim(); if (!v) return toast('Nhập ID hoặc tên trước nhé', 'bad'); o.close(); toast('Đã gửi lời mời kết bạn tới ' + v, 'ok', 'users'); }); }); }
};
function wireInvites(root) { on(root, '[data-pcard]', (e, d) => { const [k, n, st] = d.dataset.pcard.split('|'); playerCard({ k, n, status: st }); }); on(root, '[data-inv]', (e, b) => { const [n, onl] = b.dataset.inv.split('|'); if (onl === 'true') { b.classList.add('disabled'); b.querySelector('span').textContent = 'ĐÃ MỜI'; toast('Đã mời ' + n + ' vào phòng!', 'ok', 'send'); } else toast('Đã nhắn tin cho ' + n, 'info', 'message'); }); }

/* ---------- Player card: tap someone -> see who they are first, then choose to add them ---------- */
const FRIEND_REQ = new Set();
const isFriend = n => FRIENDS.some(f => f[1] === n);
function pStats(n) { let h = 7; for (const c of n) h = (h * 31 + c.charCodeAt(0)) >>> 0; const r = m => { h = (h * 1103515245 + 12345) >>> 0; return (h >>> 8) % m; };
  const games = 40 + r(260), wins = Math.round(games * (.3 + r(35) / 100)); return { lv: 8 + r(30), games, wins, kinh: Math.round(wins * (.5 + r(40) / 100)), id: `20${20 + r(8)}-${1000 + r(9000)}`, ach: 1 + r(5) }; }
const PC_ACH = [['trophy.webp', 'Vua lô tô'], ['li_xi.webp', 'Lì xì đầu năm'], ['kinh_mat_vu.webp', 'Mật vụ thứ thiệt'], ['ao_dai_tet.webp', 'Fashion Tết'], ['coin_chest.webp', 'Đại gia xu']];
const pcDone = label => btn(label, { color: 'white', size: 'm', icon: 'check', attrs: 'data-pc-none', style: 'pointer-events:none;opacity:.75' });
const pcActions = n => `${isFriend(n) ? pcDone('ĐÃ LÀ BẠN BÈ') : FRIEND_REQ.has(n) ? pcDone('ĐÃ GỬI LỜI MỜI') : btn('KẾT BẠN', { color: 'green', size: 'm', icon: 'user-plus', attrs: 'data-pc-add' })}${btn('NHẮN TIN', { color: 'blue', size: 'm', icon: 'message', attrs: 'data-pc-msg' })}`;
function playerCard({ k, n, xp, xpLabel = 'XP', rank, status = 'Online' }) {
  const st = pStats(n), ch = CHARS.find(c => c[0] === k) || CHARS[0], onl = !/Offline/.test(status);
  const body = `<div class="row" style="gap:30px;align-items:stretch;margin-top:6px">
    <div style="position:relative;width:300px;height:330px;flex:none;border-radius:24px;border:4px solid var(--brown);background:var(--or3);overflow:hidden">${podiumAt(false, 150, 212, .8)}${charOn(k, 150, 254, 220, { cls: 'breath' })}
      <span class="tag gold" style="position:absolute;left:12px;top:12px;font-size:20px">Lv.${st.lv}</span>${rank ? `<span class="tag red" style="position:absolute;right:12px;top:12px;font-size:20px">#${rank}</span>` : ''}</div>
    <div class="col" style="flex:1;gap:12px;min-width:0">
      <b style="font-weight:900;font-size:40px;line-height:1.15">${n}</b>
      <span style="font-weight:600;font-size:20px;color:var(--brown5)">ID: ${st.id} · Con giáp: ${ch[1]}</span>
      <span style="font-weight:700;font-size:21px;color:${onl ? 'var(--green5)' : 'var(--brown5)'}">● ${status}</span>
      <div class="row" style="gap:12px;margin-top:4px">${[['Trận', st.games, 'var(--blue)'], ['Thắng', st.wins, 'var(--green5)'], ['Lần KINH', st.kinh, 'var(--red)'], xp ? [xpLabel, xp, 'var(--gold6)'] : null].filter(Boolean).map(([l, v, c]) => `<div class="subcard col center" style="flex:1;padding:10px 0 12px;gap:2px"><span style="font:34px var(--num);color:${c}">${fmt(v)}</span><b style="font-weight:800;font-size:18px;white-space:nowrap">${l}</b></div>`).join('')}</div>
      <div class="row" style="gap:10px;align-items:center">${PC_ACH.map(([im, l], i) => `<div class="subcard center" title="${l}" style="width:62px;height:62px;padding:0;background:${i < st.ach ? 'var(--or3)' : 'var(--cream2)'}"><img src="${IMG(im)}" width="46" style="${i < st.ach ? '' : 'opacity:.3'}"></div>`).join('')}<span style="font-weight:700;font-size:18px;color:var(--brown5)">${st.ach}/5 thành tích</span></div>
    </div></div>
    <div class="row" data-pc-actions style="gap:18px;margin-top:22px;justify-content:center">${pcActions(n)}</div>`;
  const o = overlay({ title: 'THÔNG TIN NGƯỜI CHƠI', color: 'blue', width: 980, body });
  const wire = () => {
    on(o, '[data-pc-add]', (e, b) => { FRIEND_REQ.add(n); const r = rectOf(b); burst(r.x + r.w / 2, r.y + r.h / 2, { n: 12, dist: 120 }); beep('coin'); toast('Đã gửi lời mời kết bạn tới ' + n, 'ok', 'user-plus'); o.querySelector('[data-pc-actions]').innerHTML = pcActions(n); wire(); });
    on(o, '[data-pc-msg]', () => toast('Đã mở trò chuyện với ' + n, 'info', 'message')); };
  wire(); return o; }

SCREENS.mail = {
  html: () => `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('HỘP THƯ', 'blue', unreadMails() + ' thư chưa đọc')}<div class="abs" style="right:110px;top:66px">${coinPill()}</div>
    <div class="abs col" style="left:310px;top:240px;width:1300px;gap:18px">${MAILS.map(([im, t, d, amt], i) => { const read = S.mails[i];
      return `<div class="row panel" data-mail="${i}" style="gap:22px;padding:16px 26px 16px 20px;border-radius:28px;border:${read ? '3px' : '5px'} solid ${read ? 'var(--brown)' : 'var(--red)'};background:${read ? 'var(--cream2)' : 'var(--cream)'};box-shadow:var(--hard-s);cursor:pointer">
        <div class="center" style="width:100px;height:100px;border-radius:20px;background:var(--or3);border:3px solid var(--brown)"><img src="${IMG(im)}" width="80"></div><div class="col" style="flex:1;gap:8px"><b style="font-weight:800;font-size:28px">${t}</b><span style="font-weight:600;font-size:22px;color:var(--brown5)">${d.slice(0, 70)}${d.length > 70 ? '…' : ''}</span></div>
        ${read ? `<span class="tag cream">${amt ? 'Đã nhận quà' : 'Đã đọc'}</span>` : '<span class="tag red">MỚI</span>'}${ic('chevron-right', 'var(--brown5)', 40)}</div>`; }).join('')}</div>`,
  mount(el) { wireCommon(el); on(el, '[data-mail]', (e, d) => { const i = +d.dataset.mail; const [im, t, body, amt] = MAILS[i]; const read = S.mails[i];
    const o = overlay({ title: 'THƯ', color: 'blue', width: 900, body: `<img src="${IMG(im)}" width="200"><b style="font-weight:900;font-size:36px;text-align:center">${t}</b><div style="font-weight:600;font-size:26px;text-align:center">${body}</div>${amt && !read ? btn('NHẬN QUÀ', { icon: 'gift', attrs: 'data-claim', style: 'width:100%' }) : btn('ĐÓNG', { color: 'white', size: 'm', attrs: 'data-closeit', style: 'width:100%' })}` });
    on(o, '[data-closeit]', () => { S.mails[i] = true; save(); o.close(); go('mail', {}, { push: false }); });
    on(o, '[data-claim]', () => { S.mails[i] = true; save(); o.close(); reward({ img: im, amount: amt, text: t }); go('mail', {}, { push: false }); });
    if (!amt) { S.mails[i] = true; save(); } }); }
};

SCREENS.settings = {
  html: () => `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('CÀI ĐẶT', 'blue')}
    <div class="abs panel col" style="left:360px;top:232px;width:1200px;padding:30px 36px 34px;gap:16px">
      ${[['Âm thanh hiệu ứng', 'volume', `<div class="switch ${S.sound ? 'on' : ''}" data-sw="sound"></div>`], ['Nhạc nền Tết', 'volume', `<div class="switch ${S.music ? 'on' : ''}" data-sw="music"></div>`], ['Thông báo', 'bell', `<div class="switch ${S.notif ? 'on' : ''}" data-sw="notif"></div>`],
        ['Ngôn ngữ', 'globe', `<div class="seg" data-seg="lang">${[['vi', 'Tiếng Việt'], ['en', 'English']].map(([v, l]) => `<span data-v="${v}" class="${S.lang === v ? 'on' : ''}">${l}</span>`).join('')}</div>`],
        ['Chất lượng đồ hoạ', 'zap', `<div class="seg" data-seg="gfx">${['Thấp', 'Vừa', 'Cao'].map(v => `<span data-v="${v}" class="${S.gfx === v ? 'on' : ''}">${v}</span>`).join('')}</div>`]]
        .map(([l, i, c]) => `<div class="row subcard" style="gap:18px;padding:12px 20px 12px 22px">${ic(i, 'var(--brown)', 36)}<b style="flex:1;font-weight:800;font-size:28px">${l}</b>${c}</div>`).join('')}
      <div class="row" style="gap:18px">${btn('HỖ TRỢ', { color: 'white', size: 'm', icon: 'help', attrs: 'data-support', style: 'flex:1' })}${btn('HƯỚNG DẪN', { color: 'yellow', size: 'm', attrs: 'data-tut', style: 'flex:1' })}${btn('ĐĂNG XUẤT', { size: 'm', attrs: 'data-logout', style: 'flex:1' })}</div>
      <div class="row" style="justify-content:space-between;font-weight:600;font-size:20px;color:var(--brown5)"><span>Phiên bản 1.0.0 (web prototype) · © Mật Vụ Lô Tô</span><span class="link" data-reset style="color:var(--brown5)">Xoá dữ liệu chơi thử</span></div></div>`,
  mount(el) { wireCommon(el);
    on(el, '[data-sw]', (e, s) => { const k = s.dataset.sw; S[k] = !S[k]; s.classList.toggle('on', S[k]); save(); if (k === 'music') music(S[k]); });
    el.querySelectorAll('[data-seg] span').forEach(sp => sp.onclick = () => { beep(); const seg = sp.parentElement; S[seg.dataset.seg] = sp.dataset.v; save(); seg.querySelectorAll('span').forEach(x => x.classList.toggle('on', x === sp)); if (seg.dataset.seg === 'lang' && sp.dataset.v === 'en') toast('English đang được dịch – sắp ra mắt!', 'info', 'globe'); });
    on(el, '[data-support]', () => toast('Đã gửi yêu cầu hỗ trợ – CSKH sẽ liên hệ bạn sớm!', 'ok', 'help'));
    on(el, '[data-tut]', () => go('tutorial', { step: 0, then: 'settings' }));
    on(el, '[data-logout]', () => confirmBox({ title: 'ĐĂNG XUẤT', text: `Bạn muốn đăng xuất khỏi\n“${S.name}”?`, yes: 'ĐĂNG XUẤT', onYes: () => { S.logged = false; save(); hist.length = 0; go('onboard', {}, { push: false }); } }));
    on(el, '[data-reset]', () => confirmBox({ title: 'XOÁ DỮ LIỆU', text: 'Xoá xu, đồ đã mua, tiến độ\nđể chơi thử lại từ đầu?', yes: 'XOÁ', onYes: () => { localStorage.removeItem('mvlt'); location.reload(); } })); }
};
