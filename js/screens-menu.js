/* ===== Splash / Onboard / Login / Register / Tutorial / Lobby / Character / Shop ===== */
SCREENS.splash = {
  html: () => `${bgOnb()}<div class="abs center stamp" style="left:0;right:0;top:150px">${logo(1)}</div>
    <div class="abs" style="left:510px;top:700px;width:900px;height:56px;border-radius:28px;background:var(--cream);border:6px solid var(--brown);overflow:hidden"><div id="lb" class="shimmer" style="height:100%;width:0;background:var(--red);border-radius:28px;transition:width .3s ease-out"></div></div>
    <div id="lt" class="abs" style="left:0;right:0;top:780px;text-align:center;font-weight:800;font-size:30px">Đang tải bản đồ nhà ngoại...</div>
    <div class="abs" style="left:0;right:0;top:840px;text-align:center;font-weight:600;font-size:24px;color:var(--brown5)">Mẹo: làm nhiệm vụ ở các chấm vàng để nhận số – số lạ thì nhớ đem giấu trong 60 giây!</div>`,
  mount(el) { const t0 = performance.now(); let ready = false; const lb = el.querySelector('#lb');
    const next = () => { if (cur === 'splash') go(S.logged ? 'lobby' : 'onboard', {}, { push: false }); };
    const iv = setInterval(() => { const p = window.PRE ? PRE.n / PRE.total : 1; const tp = Math.min(1, (performance.now() - t0) / 1400); lb.style.width = Math.round(Math.min(p, tp) * 100) + '%';
      if (p >= 1 && tp >= 1 && !ready) { ready = true; clearInterval(iv); el.querySelector('#lt').textContent = 'Sẵn sàng! Chạm để vào game'; el.onclick = () => { beep(); next(); }; setTimeout(next, 1400); } }, 80); }
};

SCREENS.onboard = {
  html: () => `${bgOnb()}<div class="abs center wiggle-slow" style="left:0;right:0;top:72px">${logo(.82)}</div>
    ${ball(27, 'abs').replace('class="ball abs', 'style="left:430px;top:250px;transform:rotate(14deg) scale(1.2)" class="ball abs')}
    ${ball(86, 'abs').replace('class="ball abs', 'style="left:1370px;top:200px;transform:rotate(-12deg) scale(1.2)" class="ball abs')}
    <div class="abs col" style="left:580px;top:512px;width:760px;gap:34px">
      ${btn('Đăng nhập', { icon: 'log-in', attrs: 'data-go="login"' })}${btn('Đăng ký', { color: 'blue', icon: 'user-plus', attrs: 'data-go="register"' })}${btn('Chế độ khách', { color: 'yellow', icon: 'ticket', attrs: 'data-guest' })}</div>`,
  mount(el) { wireCommon(el); on(el, '[data-guest]', () => { S.logged = true; S.guest = true; S.name = 'Khách ' + (1000 + Math.floor(Math.random() * 9000)); save(); go('lobby'); }); }
};

const field = (label, ph, icon, type = 'text', val = '') => `<div class="field"><label>${label}</label><div class="fbox">${ic(icon, 'var(--brown5)')}<input type="${type}" placeholder="${ph}" value="${val}"></div></div>`;
const checkbox = (label, onv = false) => `<div class="check ${onv ? 'on' : ''}" data-check><div class="bx">${ic('check', 'var(--brown)')}</div><span>${label}</span></div>`;

SCREENS.login = {
  html: () => `${bgOnb()}<div class="abs" style="left:130px;top:118px">${navbtn('QUAY LẠI')}</div>
    <div class="abs panel col" style="left:550px;top:205px;width:820px;padding:100px 64px 44px;gap:22px">
      <div class="banner red" style="top:-60px;transform:translateX(-50%) scale(.78)"><div class="in">ĐĂNG NHẬP</div></div>
      ${field('Tên đăng nhập', 'Nhập tên đăng nhập...', 'user', 'text', S.guest ? '' : 'chuotchutchit')}${field('Mật khẩu', '••••••••', 'lock', 'password', '12345678')}
      <div class="row" style="justify-content:space-between">${checkbox('Ghi nhớ đăng nhập', true)}<span class="link" data-forgot style="font-size:24px">Quên mật khẩu?</span></div>
      ${btn('Đăng nhập', { icon: 'log-in', attrs: 'data-submit' })}
      <div style="text-align:center;font-weight:600;font-size:26px">Chưa có tài khoản? <span class="link" data-go="register">Đăng ký ngay</span></div></div>`,
  mount(el) { wireCommon(el); on(el, '[data-check]', (e, c) => c.classList.toggle('on'));
    on(el, '[data-submit]', () => { const u = el.querySelector('input').value.trim(); if (!u) return toast('Nhập tên đăng nhập đã nhé!', 'bad'); S.logged = true; S.guest = false; save(); go('lobby'); });
    on(el, '[data-forgot]', () => { const o = overlay({ title: 'QUÊN MẬT KHẨU', width: 820, body: `<div style="font-weight:600;font-size:26px;text-align:center">Nhập email đã đăng ký, Mật Vụ Lô Tô sẽ gửi link đặt lại mật khẩu cho bạn.</div>${field('Email', 'ten@email.com', 'mail', 'email')}${btn('GỬI LINK', { attrs: 'data-send', style: 'width:100%' })}` });
      on(o, '[data-send]', () => { const v = o.querySelector('input').value; if (!/.+@.+\..+/.test(v)) return toast('Email chưa đúng định dạng', 'bad'); o.close(); toast('Đã gửi link đặt lại mật khẩu vào ' + v, 'ok', 'mail'); }); }); }
};

SCREENS.register = {
  html: () => `${bgOnb()}<div class="abs" style="left:130px;top:118px">${navbtn('QUAY LẠI')}</div>
    <div class="abs panel col" style="left:300px;top:240px;width:1320px;padding:96px 64px 40px;gap:20px">
      <div class="banner blue" style="top:-60px;transform:translateX(-50%) scale(.78)"><div class="in">ĐĂNG KÝ</div></div>
      <div class="row" style="gap:40px">${field('Tên hiển thị', 'Ví dụ: Chuột chút chít', 'user')}${field('Email', 'ten@email.com', 'mail', 'email')}</div>
      <div class="row" style="gap:40px">${field('Mật khẩu', 'Tối thiểu 6 ký tự', 'lock', 'password')}${field('Nhập lại mật khẩu', 'Nhập lại mật khẩu', 'lock', 'password')}</div>
      ${checkbox('Tôi đồng ý với điều khoản sử dụng của Mật Vụ Lô Tô')}
      ${btn('Tạo tài khoản', { color: 'blue', icon: 'user-plus', attrs: 'data-submit' })}
      <div style="text-align:center;font-weight:600;font-size:26px">Đã có tài khoản? <span class="link" style="color:var(--red)" data-go="login">Đăng nhập</span></div></div>`,
  mount(el) { wireCommon(el); on(el, '[data-check]', (e, c) => c.classList.toggle('on'));
    on(el, '[data-submit]', () => { const [n, m, p, p2] = [...el.querySelectorAll('input')].map(i => i.value.trim());
      if (!n) return toast('Nhập tên hiển thị nhé!', 'bad'); if (!/.+@.+\..+/.test(m)) return toast('Email chưa đúng định dạng', 'bad');
      if (p.length < 6) return toast('Mật khẩu tối thiểu 6 ký tự', 'bad'); if (p !== p2) return toast('Mật khẩu nhập lại chưa khớp', 'bad');
      if (!el.querySelector('[data-check]').classList.contains('on')) return toast('Bạn cần đồng ý điều khoản', 'bad');
      S.name = n; S.logged = true; S.guest = false; save(); toast('Tạo tài khoản thành công!'); go('tutorial', { step: 0, then: 'lobby' }); }); }
};

const TUT = [['HAI ĐỘI BÍ MẬT', 'Mỗi trận chia làm 2 đội bí mật. Tờ VÉ của bạn có gợi ý dãy 5 số của đội và ÁM HIỆU (vd: nhảy 2 lần) để nhận ra đồng đội. Không ai biết ai cùng phe!'],
  ['LÀM NHIỆM VỤ – NHẬN SỐ', 'Đi tới các chấm vàng để làm nhiệm vụ và nhận 1 số. Số của đội thì mang về KHO; số lạ thì đem GIẤU ở trạm nhiệm vụ trong 60 giây, không thì số sẽ rơi! Tường thì phải đi vòng, bậc thềm thì phải NHẢY.'],
  ['CẤT ĐỦ 5 SỐ LÀ KINH!', 'Cất đủ 5 số của đội vào kho trước đối thủ. Đội nào có 4 số sẽ bị cảnh báo RÌNH! Ra Sân trước khi có nhiệm vụ chung để nghe quản trò hô số.']];
SCREENS.tutorial = {
  html: ({ step = 0 }) => `${bgGame()}${banner('HƯỚNG DẪN', 'blue')}<div class="abs" style="right:110px;top:60px">${navbtn('BỎ QUA', 'right', 'data-skip')}</div>
    <div class="abs panel" style="left:210px;top:230px;width:1500px;height:700px">
      <div class="abs" style="left:50px;top:70px;width:640px;height:560px;border-radius:30px;border:5px solid var(--brown);overflow:hidden;background:var(--or3)">${[
        `<img src="${charImg('chuot')}" class="abs" style="left:10px;top:200px;width:240px"><img src="${charImg(S.char)}" class="abs" style="left:200px;top:140px;width:250px"><img src="${charImg('rong')}" class="abs" style="left:390px;top:200px;width:240px">`,
        `<img src="${IMG('bg_kitchen.jpg')}" style="width:100%;height:100%;object-fit:cover"><img src="${charImg(S.char)}" class="abs" style="left:150px;top:250px;width:230px">${ball(45, 'abs').replace('class="ball abs', 'style="left:380px;top:330px" class="ball abs')}`,
        `<img src="${IMG('trophy.webp')}" class="abs" style="left:160px;top:50px;width:320px">${[[27, 60], [86, 260], [45, 460]].map(([n, x]) => ball(n, 'abs').replace('class="ball abs', `style="left:${x}px;top:410px" class="ball abs`)).join('')}`][step]}</div>
      <div class="abs col" style="left:760px;top:90px;width:680px;gap:24px"><span class="tag or" style="align-self:flex-start;font-size:24px">BƯỚC ${step + 1} / 3</span>
        <div style="font-weight:900;font-size:52px;line-height:1.15">${TUT[step][0]}</div><div style="font-weight:600;font-size:30px;line-height:1.4">${TUT[step][1]}</div></div>
      <div class="abs row" style="left:50px;width:640px;top:652px;gap:14px;justify-content:center">${[0, 1, 2].map(k => `<span style="width:${k === step ? 44 : 20}px;height:20px;border-radius:10px;border:3px solid var(--brown);background:${k === step ? 'var(--red)' : 'var(--cream2)'}"></span>`).join('')}</div>
      <div class="abs row" style="right:50px;top:556px;gap:24px">${step > 0 ? btn('LÙI', { color: 'white', size: 'm', icon: 'chevron-left', attrs: 'data-prev' }) : ''}${btn(step === 2 ? 'BẮT ĐẦU CHƠI' : 'TIẾP', { color: step === 2 ? 'green' : 'red', size: 'm', icon: step === 2 ? 'play' : 'chevron-right', attrs: 'data-next' })}</div></div>`,
  mount(el, p) { const step = p.step || 0; const then = p.then || 'lobby';
    const done = () => { const prev = hist[hist.length - 1]; if (prev && prev[0] === then) back(); else go(then); };  // came from `then` -> pop back to it, never stack a loop
    on(el, '[data-skip]', done); on(el, '[data-prev]', () => go('tutorial', { step: step - 1, then }, { push: false }));
    on(el, '[data-next]', () => step < 2 ? go('tutorial', { step: step + 1, then }, { push: false }) : done()); }
};

SCREENS.lobby = {
  html: () => `${bgGame()}
    <div class="abs pill" data-go="profile" style="left:60px;top:44px;padding:10px 28px 12px 12px;cursor:pointer"><div style="width:88px;height:88px;border-radius:50%;background:var(--or5) url(${charImg(S.char)}) center/contain no-repeat;border:4px solid var(--brown)"></div>
      <div class="col" style="gap:6px"><span style="font-size:28px;font-weight:800">${S.name}</span><div class="row" style="gap:10px"><span class="tag gold" style="font-size:18px">Lv.${S.level}</span>
      <div style="width:160px;height:16px;border-radius:8px;border:2px solid var(--brown);background:var(--cream2);overflow:hidden"><div style="height:100%;width:${Math.min(100, (S.lvProg || 0) / xpNeed(S.level) * 100)}%;background:var(--green5)"></div></div></div></div></div>
    <div class="abs wiggle-slow" style="left:540px;top:26px;pointer-events:none">${logo(.64)}</div>
    <div class="abs row" style="right:60px;top:48px;gap:18px">${coinPill('data-go="shopxu" style="cursor:pointer"')}
      <div class="iconbtn" data-go="mail">${ic('mail', 'var(--brown)')}${unreadMails() ? `<span class="dot-badge">${unreadMails()}</span>` : ''}</div>
      <div class="iconbtn" data-help>${ic('help', 'var(--brown)')}</div><div class="iconbtn" data-go="settings">${ic('settings', 'var(--brown)')}</div></div>
    <div class="abs" style="left:130px;top:230px;width:620px;height:700px;cursor:pointer" data-go="character">${podiumAt(false, 310, 420, 1.4)}
      ${charOn(S.char, 310, 492, 380, { cls: 'breath' })}
      <div class="abs" style="left:0;right:0;top:650px;display:flex;justify-content:center"><span class="tag blue" style="font-size:22px;padding:8px 22px 10px;box-shadow:var(--hard-s)">${ic('refresh', '#fff', 26)} ĐỔI NHÂN VẬT</span></div></div>
    <div class="abs col" style="left:1030px;top:250px;width:720px;gap:30px">${btn('CHƠI NHANH', { icon: 'zap', attrs: 'data-go="find"' })}${btn('TẠO PHÒNG', { color: 'blue', icon: 'plus', attrs: 'data-go="create"' })}${btn('VÀO PHÒNG', { color: 'yellow', icon: 'hash', attrs: 'data-go="join"' })}
      <div class="row wiggle-slow" style="align-self:center;gap:16px;background:var(--red);border:5px solid var(--brown);border-radius:24px;padding:12px 26px 14px 16px;box-shadow:var(--hard-s);cursor:pointer" data-go="quests"><img src="${IMG('coin_chest.webp')}" width="80"><div class="col" style="color:var(--cream)"><b style="font-size:28px;font-weight:900">SỰ KIỆN TẾT</b><span style="font-weight:700;font-size:20px">Lụm 50 số – nhận Rương xu!</span></div></div></div>
    <div class="abs row panel" style="right:70px;bottom:60px;gap:22px;padding:18px 28px 20px;border-radius:36px">
      ${[['Nhân vật', 'character', `<img src="${charImg('chuot')}" width="72">`], ['Shop', 'shop', `<img src="${IMG('ao_dai_tet.webp')}" width="72">`], ['Nhiệm vụ', 'quests', `<img src="${IMG('li_xi.webp')}" width="72">`, questsReady()],
        ['Xếp hạng', 'leaderboard', `<img src="${IMG('trophy.webp')}" width="72">`], ['Bạn bè', 'friends', `<img src="${IMG('ban_be.webp')}" width="72">`], ['Điểm danh', 'daily', `<img src="${IMG('gift.webp')}" width="72">`, S.daily < 7 && !S.claimedToday ? '!' : 0]]
        .map(([n, g, art, b]) => `<div class="col center subcard" style="position:relative;width:118px;height:118px;background:var(--or3);border-width:4px;cursor:pointer;gap:2px" data-dock="${g}">${art}<span style="font-weight:800;font-size:18px">${n}</span>${b ? `<span class="dot-badge" style="top:-10px;right:-10px">${b}</span>` : ''}</div>`).join('')}</div>`,
  mount(el) { wireCommon(el); on(el, '[data-help]', () => go('tutorial', { step: 0, then: 'lobby' }));
    on(el, '[data-dock]', (e, d) => d.dataset.dock === 'daily' ? openDaily() : go(d.dataset.dock));
    if (!S.claimedToday && !S.dailyShown) { S.dailyShown = true; setTimeout(() => cur === 'lobby' && openDaily(), 600); } }
};
const unreadMails = () => MAILS.filter((m, i) => !S.mails[i]).length;
const questsReady = () => QUESTS.filter((q, i) => q[2] >= q[3] && !S.quests[i]).length;

function openDaily() {
  const days = [['coin.webp', '100 xu', 100], ['coin.webp', '150 xu', 150], ['li_xi.webp', 'Lì xì', 300], ['coin_stack.webp', '300 xu', 300], ['coin.webp', '200 xu', 200], ['non_la.webp', 'Nón lá', 0], ['coin_chest.webp', 'Rương xu', 2000]];
  const today = S.daily; const o = overlay({ title: 'ĐIỂM DANH', width: 1300, body: `<div style="font-weight:600;font-size:26px;color:var(--brown5)">Đăng nhập mỗi ngày để nhận quà Tết – ngày 7 có Rương xu!</div>
    <div class="row" style="gap:16px">${days.map(([im, lab], i) => { const st = i < today ? 'done' : i === today && !S.claimedToday ? 'today' : '';
      return `<div class="col center" data-day="${i}" style="gap:6px;width:${i === 6 ? 190 : 148}px;height:230px;border-radius:22px;border:${st === 'today' ? 6 : 4}px solid ${st === 'today' ? 'var(--red)' : 'var(--brown)'};background:${st === 'today' ? 'var(--or5)' : st === 'done' ? 'var(--cream2)' : 'var(--cream)'};cursor:pointer;${st === 'today' ? 'box-shadow:var(--hard-s)' : ''}">
        <b style="font-weight:900;font-size:20px">NGÀY ${i + 1}</b><img src="${IMG(im)}" width="${i === 6 ? 120 : 96}" style="${st === 'done' ? 'opacity:.45' : ''}"><b style="font-weight:800;font-size:20px">${lab}</b>${st === 'done' ? ic('check', 'var(--green5)', 28) : st === 'today' ? '<b style="color:var(--red);font-weight:900;font-size:20px">NHẬN!</b>' : ''}</div>`; }).join('')}</div>` });
  on(o, '[data-day]', (e, d) => { const i = +d.dataset.day; if (i < today || (i === today && S.claimedToday)) return toast('Đã nhận quà ngày này rồi', 'info');
    if (i > today) return toast('Quay lại vào ngày ' + (i + 1) + ' để nhận nhé!', 'info');
    S.claimedToday = true; S.daily = Math.min(7, today + 1); if (days[i][2] === 0) { S.owned = [...new Set([...S.owned, 'nonla'])]; } save(); o.close();
    days[i][2] ? reward({ img: days[i][0], amount: days[i][2], text: 'Quà điểm danh ngày ' + (i + 1) + ' đã vào ví!' }) : toast('Nhận Nón lá – vào Nhân vật để mặc thử!', 'ok', 'gift'); if (cur === 'lobby') go('lobby', {}, { push: false }); });
}

SCREENS.character = {
  html: () => { const sel = S.char; const c = CHARS.find(x => x[0] === sel); const idx = CHARS.indexOf(c);
    return `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('NHÂN VẬT', 'blue')}<div class="abs" style="right:110px;top:60px">${navbtn('SHOP', 'right', 'data-go="shop"')}</div>
    <div class="abs panel" style="left:110px;top:232px;width:780px;padding:22px 26px 30px">
      <div class="sec-head" style="margin-bottom:22px"><div class="numbadge g">01</div>CHỌN NHÂN VẬT<span class="tag or">Đã mở 12/12</span></div>
      <div class="grid-cards" style="grid-template-columns:repeat(3,220px)">${CHARS.map(([k, n]) => `<div data-char="${k}" style="position:relative;height:140px;border-radius:20px;background:var(--brown);padding:7px;cursor:pointer;${k === sel ? 'outline:5px solid var(--red);outline-offset:2px' : ''}">
        <div style="position:relative;height:100%;border-radius:14px;background:${k === sel ? 'var(--or5)' : 'var(--cream)'} url(${charImg(k)}) right 6px top 6px/118px no-repeat"><span class="tag ${k === sel ? '' : 'cream'}" style="position:absolute;left:10px;top:10px;font-size:22px;${k === sel ? 'background:var(--brown);color:var(--cream)' : ''}">${n}</span></div></div>`).join('')}</div></div>
    <div class="abs panel" style="left:1000px;top:232px;width:810px;height:452px;padding:24px"><div style="position:relative;height:100%;border-radius:26px;overflow:hidden;background:radial-gradient(circle at 45% 40%,#FFEEC7,#F5C77D)">
      <span class="abs" style="left:400px;top:34px;font-weight:800;font-size:22px;letter-spacing:.12em;color:var(--brown5)">PREVIEW</span>
      ${podiumAt(false, 210, 250)}${charOn(sel, 210, 302, 285, { cls: 'breath char-sel-pop' })}
      ${S.wearing && S.wearing !== 'ao' ? `<img src="${IMG(ITEMS[S.wearing][1])}" class="abs" style="left:${S.wearing === 'kinh' ? 150 : S.wearing === 'nonla' ? 110 : 140}px;top:${S.wearing === 'kinh' ? 100 : S.wearing === 'nonla' ? -10 : 170}px;width:${S.wearing === 'nonla' ? 200 : 130}px">` : ''}
      <div class="abs col" style="left:400px;top:70px;width:340px;gap:14px"><span class="tag blue" style="align-self:flex-start">Con giáp #${idx + 1}</span><div style="font-weight:900;font-size:84px;line-height:1">${c[1].toUpperCase()}</div>
        <div style="font-weight:600;font-size:26px">${c[2]}</div><div class="row" style="gap:10px"><span class="tag cream" style="font-size:18px">Tốc độ ★★★</span><span class="tag cream" style="font-size:18px">May mắn ★★</span></div></div></div></div>
    <div class="abs panel" style="left:1000px;top:706px;width:810px;padding:22px 26px 24px"><div class="sec-head" style="margin-bottom:14px"><div class="numbadge b">02</div>TRANG PHỤC</div>
      <div class="row" style="gap:14px">${Object.entries(ITEMS).map(([k, [n, im]]) => { const own = S.owned.includes(k), w = S.wearing === k;
        return `<div data-item="${k}" class="row" style="flex:1;gap:4px;padding:6px 8px;border-radius:18px;cursor:pointer;background:${w ? 'var(--or5)' : 'var(--cream2)'};border:${w ? '5px solid var(--red)' : '4px solid var(--brown)'};${own ? '' : 'opacity:.6'}"><img src="${IMG(im)}" width="44" height="44"><b style="font-weight:800;font-size:16px;white-space:nowrap">${own ? '' : '🔒 '}${n}</b></div>`; }).join('')}</div></div>
    <div class="abs" style="left:1105px;top:946px">${btn('XÁC NHẬN', { color: 'green', icon: 'check', attrs: 'data-ok', style: 'width:600px' })}</div>`; },
  mount(el) { wireCommon(el);
    on(el, '[data-char]', (e, d) => { S.char = d.dataset.char; save(); beep('pick'); go('character', {}, { push: false }); });
    on(el, '[data-item]', (e, d) => { const k = d.dataset.item; if (!S.owned.includes(k)) { toast('Chưa có ' + ITEMS[k][0] + ' – mua trong Shop nhé!', 'info', 'gift'); return; } S.wearing = k; save(); beep('pick'); go('character', {}, { push: false }); });
    on(el, '[data-ok]', () => { toast('Đã chọn ' + CHARS.find(c => c[0] === S.char)[1] + '!'); back(); }); }
};

const SHOP = { 'Phụ kiện': [['ao', 'Áo đỏ hoa mai – may mắn cả năm', 'MỚI'], ['nonla', 'Che nắng, che luôn cả… số'], ['khan', 'Chất miền Tây, đi đâu cũng chất', 'HOT'], ['kinh', 'Mật vụ thứ thiệt phải có kính']],
  'Gói xu': [['Quà mỗi ngày', 'coin.webp', 'Đăng nhập mỗi ngày nhận 100 xu', 'Miễn phí', 100, 'FREE'], ['Túi xu nhỏ', 'coin_stack.webp', '+1.000 xu', '19.000đ', 1000], ['Đống xu', 'coin_pile.webp', '+5.000 xu · tặng thêm 10%', '79.000đ', 5500, 'HOT'], ['Rương xu Tết', 'coin_chest.webp', '+20.000 xu · tặng thêm 25%', '199.000đ', 25000, 'LỜI NHẤT']] };
function shopHtml(tab) {
  const card = (img, name, desc, price, action, badge, owned) => `<div class="panel col" style="width:400px;padding:22px 22px 24px;gap:14px;border-radius:36px">
    <div style="position:relative;height:290px;border-radius:24px;background:var(--or3);border:4px solid var(--brown);display:grid;place-items:center"><img src="${IMG(img)}" width="250" height="250" style="object-fit:contain">${badge ? `<span class="tag ${badge === 'FREE' ? 'green' : 'red'}" style="position:absolute;left:14px;top:14px">${badge}</span>` : ''}</div>
    <b style="font-weight:800;font-size:32px">${name}</b><span style="font-weight:600;font-size:20px;color:var(--brown5);min-height:52px">${desc}</span>
    <div class="row" style="gap:10px;font-weight:900;font-size:30px;color:${owned ? 'var(--green5)' : 'var(--textd)'}">${price}</div>${action}</div>`;
  const items = tab === 'Phụ kiện' ? SHOP[tab].map(([k, desc, badge]) => { const [n, im, p] = ITEMS[k]; const own = S.owned.includes(k);
      return card(im, n, desc, own ? 'Đã sở hữu' : `<img src="${IMG('coin.webp')}" width="44">${fmt(p)}`, own ? btn('ĐÃ CÓ', { color: 'white', size: 'm', attrs: `data-wear="${k}"`, style: 'width:100%' }) : btn('MUA', { color: 'green', size: 'm', attrs: `data-buy="${k}"`, style: 'width:100%' }), badge, own); })
    : SHOP[tab].map(([n, im, desc, price, amt, badge], i) => card(im, n, desc, price, btn(i === 0 ? 'NHẬN' : 'MUA', { color: i === 0 ? 'blue' : 'green', size: 'm', attrs: `data-pack="${i}"`, style: 'width:100%' }), badge));
  return `${bgGame()}<div class="abs" style="left:110px;top:60px">${navbtn()}</div>${banner('SHOP', 'red')}<div class="abs" style="right:110px;top:66px">${coinPill()}</div>
    <div class="abs row" style="left:100px;top:228px;gap:18px">${Object.keys(SHOP).map(t => `<div class="chip ${t === tab ? 'on' : ''}" data-tab="${t}" style="font-size:30px;font-weight:800;padding:12px 34px 16px;border-radius:18px;border-width:5px;${t === tab ? 'box-shadow:var(--hard-s)' : ''}">${t.toUpperCase()}</div>`).join('')}</div>
    <div class="abs row" style="left:100px;top:330px;gap:40px;align-items:flex-start">${items.join('')}</div>`;
}
function mountShop(el, tab) { wireCommon(el);
  on(el, '[data-tab]', (e, d) => go(d.dataset.tab === 'Gói xu' ? 'shopxu' : 'shop', {}, { push: false }));
  on(el, '[data-wear]', () => go('character'));
  on(el, '[data-buy]', (e, d) => { const k = d.dataset.buy, p = ITEMS[k][2]; if (S.coins < p) return toast('Không đủ xu – nạp thêm ở tab Gói xu!', 'bad');
    confirmBox({ title: 'MUA ĐỒ', text: `Mua ${ITEMS[k][0]} với giá ${fmt(p)} xu?`, yes: 'MUA', yesColor: 'green', onYes: () => { S.coins -= p; S.owned.push(k); S.wearing = k; save(); beep('coin');
      beep('win'); const o = overlay({ title: 'MUA THÀNH CÔNG!', width: 720, cls: 'reward', body: `<div class="rw-stage"><div class="rays"></div><div class="glow"></div><img class="rw-img" src="${IMG(ITEMS[k][1])}">${'<i class="tw"></i>'.repeat(6)}</div><div style="font-weight:600;font-size:26px;text-align:center">${ITEMS[k][0]} đã vào tủ đồ và đang được mặc!</div>${btn('TUYỆT VỜI!', { color: 'green', style: 'width:100%' })}` });
      o.querySelector('.btn').onclick = () => { o.close(); refreshCoins(); go(cur, {}, { push: false }); }; setTimeout(() => { const r = rectOf(o.querySelector('.rw-img')); burst(r.cx, r.cy, { n: 16, size: 20, dist: 220 }); }, 250); } }); });
  on(el, '[data-pack]', (e, d) => { const [n, im, , price, amt] = SHOP['Gói xu'][+d.dataset.pack];
    if (+d.dataset.pack === 0) { if (S.freeToday) return toast('Hôm nay bạn đã nhận rồi, mai quay lại nhé!', 'info'); S.freeToday = true; save(); return reward({ img: im, amount: amt, text: 'Quà miễn phí hôm nay!' }); }
    confirmBox({ title: 'NẠP XU', text: `${n}: ${price}\n(Prototype – không trừ tiền thật)`, yes: 'THANH TOÁN', yesColor: 'green', onYes: () => reward({ img: im, amount: amt, text: n + ' đã vào ví!' }) }); }); }
SCREENS.shop = { html: () => shopHtml('Phụ kiện'), mount: el => mountShop(el, 'Phụ kiện') };
SCREENS.shopxu = { html: () => shopHtml('Gói xu'), mount: el => mountShop(el, 'Gói xu') };
