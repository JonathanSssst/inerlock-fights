(function () {
  'use strict';

  /* ---------- 时间节点（+08:00） ---------- */
  var TIMES = {
    regStart:  new Date('2026-09-25T12:00:00+08:00'),
    regEnd:    new Date('2026-10-01T12:00:00+08:00'),
    schedule:  new Date('2026-10-01T21:00:00+08:00'),
    eventStart:new Date('2026-10-03T19:00:00+08:00'),
    eventEnd:  new Date('2026-10-04T22:30:00+08:00')
  };

  /* ---------- 状态 ---------- */
  function getStatus(now) {
    if (now < TIMES.regStart) return { key: 'soon',  text: '报名即将开始' };
    if (now < TIMES.regEnd)   return { key: 'open',  text: '报名进行中' };
    if (now < TIMES.eventStart) return { key: 'closed', text: '报名已截止' };
    if (now < TIMES.eventEnd) return { key: 'live',  text: '比赛进行中' };
    return { key: 'ended', text: '比赛已结束' };
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
      { t: TIMES.schedule,   label: '赛程公布' },
      { t: TIMES.eventStart, label: '比赛开始' },
      { t: TIMES.eventEnd,   label: '比赛结束' }
    ];
    var next = null;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].t && now < targets[i].t) { next = targets[i]; break; }
    }
    if (!next) {
      cdEl.innerHTML = '<div class="cd-label">比赛已结束，感谢参与！</div>';
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
})();
