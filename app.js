(function () {
  'use strict';

  /* ---------- 时间节点（+08:00） ---------- */
  var TIMES = {
    regStart:  new Date('2026-09-25T12:00:00+08:00'),
    regEnd:    new Date('2026-09-30T23:59:00+08:00'),
    eventStart:new Date('2026-10-03T18:30:00+08:00'),
    eventEnd:  new Date('2026-10-04T23:00:00+08:00')
  };

  /* ---------- 状态 ---------- */
  function getStatus(now) {
    if (now < TIMES.regStart) return { key: 'soon',  text: '报名即将开始' };
    if (now < TIMES.regEnd)   return { key: 'open',  text: '报名进行中' };
    if (now < TIMES.eventStart) return { key: 'closed', text: '报名已截止' };
    if (now < TIMES.eventEnd) return { key: 'live',  text: '比赛进行中' };
    return { key: 'ended', text: '活动已结束' };
  }

  var statusBadge = document.getElementById('statusBadge');
  var statusText  = document.getElementById('statusText');

  function renderStatus(now) {
    if (!statusBadge) return;
    var st = getStatus(now);
    statusBadge.className = 'badge is-' + st.key;
    if (statusText) statusText.textContent = st.text;
  }

  /* ---------- 倒计时 ---------- */
  var cdEl = document.getElementById('countdown');
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function renderCountdown(now) {
    if (!cdEl) return;
    var targets = [
      { t: TIMES.regStart,   label: '报名开启' },
      { t: TIMES.regEnd,     label: '报名截止' },
      { t: TIMES.eventStart, label: '比赛开始' },
      { t: TIMES.eventEnd,   label: '比赛结束' }
    ];
    var next = null;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].t && now < targets[i].t) { next = targets[i]; break; }
    }
    if (!next) {
      cdEl.innerHTML = '<div class="cd-label">活动已结束，感谢参与！</div>';
      return;
    }
    var diff = next.t - now;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor(diff % 86400000 / 3600000);
    var m = Math.floor(diff % 3600000 / 60000);
    var s = Math.floor(diff % 60000 / 1000);
    cdEl.innerHTML =
      '<div class="cd-label">倒计时 · ' + next.label + '</div>' +
      '<div class="cd-box"><b>' + d + '</b><span>天</span></div>' +
      '<div class="cd-box"><b>' + pad(h) + '</b><span>时</span></div>' +
      '<div class="cd-box"><b>' + pad(m) + '</b><span>分</span></div>' +
      '<div class="cd-box"><b>' + pad(s) + '</b><span>秒</span></div>';
  }

  function tick() {
    var now = new Date();
    renderStatus(now);
    renderCountdown(now);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  /* ---------- 顶部进度条 ---------- */
  var bar = document.getElementById('progress');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
    if (bar) bar.style.width = p + '%';
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 进入视口淡入 ---------- */
  var secs = document.querySelectorAll('.section, .hero-inner');
  if ('IntersectionObserver' in window) {
    secs.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    secs.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 项目详情弹窗 ---------- */
  var PROJECTS = {
    bedwars: {
      tag: '01 · 混战 · 4v4v4v4', accent: '#E05252', title: '起床战争', en: 'Bed Wars',
      secs: [
        { h: '床与复活', li: ['己方床未被破坏时，阵亡后在<b>基地复活</b>。', '己方床被破坏后，阵亡即<b>最终击杀</b>，不再复活。'] },
        { h: '资源生成', li: ['各队基地设 铁、金 生成器。', '地图中央设 钻石、绿宝石 生成器，随对局进程分阶段加速。'] },
        { h: '商店与队伍升级', li: ['基地商店可购买方块、武器、盔甲、道具。', '可进行队伍升级：熔炉锻造、治疗池、急迫、锐利、保护、陷阱等。'] },
        { h: '道具与战术', li: ['火球、TNT、末影珍珠、隐身、魔法牛奶、搭桥蛋、铁傀儡、蠹虫、海绵等。', '支持拆床、抱团推进、偷家等战术。'] },
        { h: '胜利条件', li: ['一支队伍成员全部被最终击杀即被淘汰；最后存活的队伍获胜。', '掉入虚空即死亡。'] }
      ],
      cfg: [['模式', '普通 4v4v4v4'], ['队伍', '红 / 蓝 / 绿 / 黄 各 4 人'], ['开局倒计时', '30 秒'], ['击退', 'Classic Knockback']]
    },
    desert: {
      tag: '02 · 混战 · 4v4v4v4', accent: '#E0A83B', title: '荒芜沙漠', en: 'Desolate Desert',
      secs: [
        { h: '出生与和平时间', li: ['同队相邻站在独立玻璃平台上，<b>15 秒</b>倒计时后解除。', '比赛开始后 <b>30 秒和平时间</b>内无法造成伤害。'] },
        { h: '物资与宝箱', li: ['宝箱分 普通 / 稀有 / 罕见 / 史诗 / 传说 / 富饶。', '每 <b>600 秒</b>补充一次，仅补充富饶宝箱。', '材料模式：到<b>地图预置工作台</b>自行合成装备（配方已解锁）。'] },
        { h: '世界边界与死亡竞赛', li: ['初始边界边长 <b>1000</b>，静止 300 秒后在 600 秒内收缩到 <b>40</b>。', '边界外持续受伤；死亡竞赛 <b>120 秒</b>（90s 中毒 I / 45s 中毒 II）。'] },
        { h: '地图特色', li: ['火山口灼烧、甜甜圈结构变化、神庙深坑、图书馆（需钥匙）。', '出界有凋零提示，特定坠落区直接阵亡。'] },
        { h: '胜利条件', li: ['最后存活的队伍获胜；队友存活不影响全队共享胜利。', '时间耗尽仍多队存活为平局（由裁判裁定名次）。'] }
      ],
      cfg: [['每队人数', '4'], ['初始和平', '30 秒'], ['边界', '1000 → 40'], ['死亡竞赛', '120 秒'], ['宝箱补充', '600 秒'], ['反作弊', '开启']]
    },
    siege: {
      tag: '03 · 竞技 · 4v4 · 非淘汰积分制', accent: '#8E7CE0', title: '空岛围攻', en: 'Island Siege',
      secs: [
        { h: '攻防与建造', li: ['红队（进攻）搭桥突袭，蓝队（防守）构筑工事。', '蓝队拥有 <b>4 分钟</b>建造期（可按蓝色按钮跳过）。'] },
        { h: '红队小游戏', li: ['红队等待期射气球，按数量（8 / 18 / 32）发放更好的开局奖励。'] },
        { h: '发起进攻', li: ['游戏到 <b>8 分钟</b>（或蓝队按按钮）后，红队获得方块并必须搭桥抵达蓝队基地。'] },
        { h: '三个目标（3 选 2）', li: ['<b>摧毁旗帜</b>：红队在旗帜区域持续站立直至折断。', '<b>偷取金色头骨</b>：破坏铁笼铁栏，带头骨回基地稻草人。', '<b>击败「剑」</b>：靠近雕像激活，击破至 0 血掉落特殊剑。'] },
        { h: '地图特性', li: ['两队之间生成两座中立空岛（物资桶）。', '每完成一个目标 +2 分钟；击杀获得「玩家的灵魂」。', '头骨携带者加速 / 抗性但攻击削弱；蓝队重生 5 秒，弓冷却蓝 3s / 红 5s。', '蓝队不能进入红队一侧。'] }
      ],
      cfg: [['每队人数', '4'], ['蓝队建造', '4 分钟'], ['红队进攻', '8 分钟'], ['目标', '3 选 2'], ['每目标加时', '+2 分钟'], ['每轮局数', '2（互换攻守）']]
    },
    frostbite: {
      tag: '04 · 竞技 · 4v4 · 非淘汰积分制', accent: '#4FA3E0', title: '霜冻狂潮', en: 'Frostbite Frenzy',
      secs: [
        { h: '冻结与解冻', li: ['近战攻击敌人即可<b>冻结</b>；近战攻击被冻队友可<b>解冻</b>。', '冻结状态下无法移动，也无法冻结 / 解冻他人。'] },
        { h: '重生', li: ['冻结过久因体温过低死亡，在本队基地重生。', '重生后获得<b>热溢</b>，期间无法被冻结。'] },
        { h: '控制点得分', li: ['站在控制点内持续得分；同队 <b>3 名</b>时效率最快。', '点内存在不同队伍则双方都不得分；被冻结的玩家不算数。', '先达到胜利分数的一方获胜；同时到达进入加时。'] },
        { h: '道具', li: ['走到金色“?”方块拾取；只能持有一件，被冻结会失去。', '共 16 种（雪崩、冰镐、冰锥、隐匿、凤凰涅槃、冷酷狙击等）。'] },
        { h: '其他', li: ['超过 50% 队员同意可投降（对方胜）。', '个人开关：/trigger toggle_death_messages、toggle_mute_music。'] }
      ],
      cfg: [['胜利分数', '500'], ['冻结时间', '10 秒'], ['热溢时间', '10 秒'], ['加时惩罚', '100'], ['控制点', '瞭望塔 / 黄金矿井 / 冰封湖泊']]
    }
  };

  var modal = document.getElementById('modal');
  var modalBody = document.getElementById('modalBody');
  var lastFocus = null;

  function openProject(id) {
    var p = PROJECTS[id];
    if (!p || !modal) return;
    var secsHtml = p.secs.map(function (s) {
      return '<div class="modal-sec"><h4>' + s.h + '</h4><ul>' +
        s.li.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
    }).join('');
    var cfgHtml = '<div class="modal-cfg">' + p.cfg.map(function (c) {
      return '<div class="row"><span>' + c[0] + '</span><b>' + c[1] + '</b></div>';
    }).join('') + '</div>';
    modalBody.innerHTML =
      '<div class="modal-head"><span class="m-tag" style="background:' + p.accent + '">' + p.tag + '</span>' +
      '<h3 id="modalTitle">' + p.title + '</h3><div class="m-en">' + p.en + '</div></div>' +
      secsHtml +
      '<div class="modal-sec"><h4>比赛配置</h4>' + cfgHtml + '</div>';
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var btn = modal.querySelector('.modal-close');
    if (btn) btn.focus();
  }
  function closeProject() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('.pcard[data-project]').forEach(function (card) {
    card.addEventListener('click', function () { openProject(card.getAttribute('data-project')); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card.getAttribute('data-project')); }
    });
  });
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeProject(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeProject(); });
  }
})();
