/* Garna call page · garna.io/{en,ru}/call
   window.bkInit(root) wires one .bk-page; runs once on load for the first visible page.
   Link params (from the outreach message): ?n=<first name>&c=<company>&p=<eor|cor|pay> plus any utm_*.
   BACKEND window.BK_CONFIG = { bookUrl, landUrl? } - Google Apps Script web app under rbl@mediacube.io:
     GET  bookUrl?a=busy -> {ok, busy:[[startISO,endISO],...]}  busy time is hidden from the grid
     POST bookUrl (Content-Type text/plain, JSON body) {start, email, name, company, product, lang, tz, variant, custom, utm, page, ref, hp}
          -> {ok, id, meet}  event with Google Meet + invite to the lead, email to Ruslan, row in the requests sheet
   Without bookUrl the booking is faked (preview). The globe comes from globe.js (window.bkGlobe). */
(function () {
  var CFG = Object.assign({
    bookUrl: null,
    hostOffsetH: 3,                    // grid is in Moscow time (UTC+3, no DST)
    fromH: 10, toH: 18, stepMin: 30,   // 10:00 ... 17:30 Moscow
    days: 5,                           // working days to offer
    minLeadH: 2,                       // no slots sooner than this
    durationMin: 30                    // calendar slot; the page says «short call»
  }, window.BK_CONFIG || {});

  var T = {
    en: { today: 'Today', tomorrow: 'Tomorrow', none: 'No free time this day', title: 'Short call with Garna', details: 'The Google Meet link is in the invite.',
      fail: 'We couldn\'t book it right now. Try again in a minute or reply in our chat.', limit: 'This email already booked a call today. Reply in our chat to change it.', range: 'This time is no longer available, pick another one.' },
    ru: { today: 'Сегодня', tomorrow: 'Завтра', none: 'В этот день всё занято', title: 'Короткий звонок с Garna', details: 'Ссылка на Google Meet в приглашении.',
      fail: 'Сейчас записать не получилось. Попробуйте ещё раз через минуту или напишите нам в переписке.', limit: 'С этой почты сегодня уже есть запись. Чтобы поменять, напишите нам в переписке.', range: 'Это время уже недоступно, выберите другое.' }
  };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(pointer: fine)').matches;
  document.documentElement.classList.add('bk-js');

  function $(r, s) { return r.querySelector(s); }
  function $$(r, s) { return Array.prototype.slice.call(r.querySelectorAll(s)); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function readParams() {
    var src = window.bkParams !== undefined ? window.bkParams : location.search;
    var q = new URLSearchParams(src || '');
    function clean(v, max) { return (v || '').replace(/[^\p{L}\p{N} .'&-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, max); }
    var p = (q.get('p') || '').toLowerCase();
    var utm = {}, live = new URLSearchParams(location.search);
    live.forEach(function (v, k) { if (/^utm_/.test(k)) utm[k] = v.slice(0, 120); });
    q.forEach(function (v, k) { if (/^utm_/.test(k)) utm[k] = v.slice(0, 120); });
    return { n: clean(q.get('n'), 30), c: clean(q.get('c'), 40), p: /^(eor|cor|pay)$/.test(p) ? p : 'any', utm: utm };
  }

  /* ---------- slots ---------- */
  var busyP = null;
  function loadBusy() {
    if (!CFG.bookUrl) return Promise.resolve([]);
    if (!busyP) {
      busyP = Promise.race([
        fetch(CFG.bookUrl + '?a=busy').then(function (r) { return r.json(); })
          .then(function (j) { return (j && j.busy || []).map(function (b) { return [Date.parse(b[0]), Date.parse(b[1])]; }); }),
        new Promise(function (r) { setTimeout(function () { r([]); }, 15000); })
      ]).catch(function () { return []; });
    }
    return busyP;
  }
  function gridSlots(busy) {
    var out = [], now = Date.now(), off = CFG.hostOffsetH * 3600e3, d = new Date(now + off), got = 0, guard = 0, dur = CFG.durationMin * 60e3;
    while (got < CFG.days && guard++ < 21) {
      var wd = d.getUTCDay();
      if (wd && wd < 6) {
        var any = false;
        for (var m = CFG.fromH * 60; m < CFG.toH * 60; m += CFG.stepMin) {
          var t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, m) - off;
          if (t < now + CFG.minLeadH * 3600e3) continue;
          if (busy.some(function (b) { return t < b[1] && t + dur > b[0]; })) continue;
          out.push(new Date(t)); any = true;
        }
        if (any) got++;
      }
      d = new Date(d.getTime() + 86400e3);
    }
    return out;
  }
  function dayKey(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- calendar files ---------- */
  function stamp(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function gcalUrl(s, t) {
    var e = new Date(s.getTime() + CFG.durationMin * 60e3);
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(t.title) +
      '&dates=' + stamp(s) + '/' + stamp(e) + '&details=' + encodeURIComponent(t.details);
  }
  function ics(s, t) {
    var e = new Date(s.getTime() + CFG.durationMin * 60e3);
    var body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Garna//call//EN', 'BEGIN:VEVENT', 'UID:' + stamp(s) + '@garna.io',
      'DTSTAMP:' + stamp(new Date()), 'DTSTART:' + stamp(s), 'DTEND:' + stamp(e), 'SUMMARY:' + t.title, 'DESCRIPTION:' + t.details, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
    a.download = 'garna-call.ics'; document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- init ---------- */
  window.bkInit = function (root) {
    if (!root || root.dataset.bkReady) return;
    root.dataset.bkReady = '1';
    var lang = root.dataset.lang === 'ru' ? 'ru' : 'en', t = T[lang], v = root.dataset.bkVariant;
    var P = readParams(), st = { slot: null, email: '', custom: false };
    var fDay = { weekday: 'short' }, fNum = { day: 'numeric' }, fMon = { month: 'short' };
    var fTime = { hour: 'numeric', minute: '2-digit' };
    var fWhen = { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' };
    var fShort = { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' };
    function fmt(d, o) { return new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-US', o).format(d); }
    var hooks = { slot: [], done: [], busy: [] };
    function emit(k, x) { hooks[k].forEach(function (f) { try { f(x); } catch (e) { console.warn(e); } }); }

    // personalisation
    $$(root, '[data-bk-n]').forEach(function (el) { el.textContent = P.n; });
    $$(root, '[data-bk-c]').forEach(function (el) { el.textContent = P.c; });
    $$(root, '[data-bk-named]').forEach(function (el) { el.hidden = !P.n; });
    $$(root, '[data-bk-plain]').forEach(function (el) { el.hidden = !!P.n; });
    $$(root, '[data-bk-has-c]').forEach(function (el) { el.hidden = !P.c; });
    $$(root, '[data-bk-p]').forEach(function (el) { el.hidden = el.dataset.bkP !== P.p; });
    $$(root, '[data-bk-initials]').forEach(function (el) { el.textContent = P.n ? P.n.charAt(0).toUpperCase() : 'G'; });
    $$(document, '.bk-hlang a').forEach(function (a) { var h = a.getAttribute('href'); if (h.charAt(0) === '/') a.href = h.split('?')[0] + location.search; });
    var tzFull = ''; try { tzFull = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    var tz = tzFull.replace(/_/g, ' ').split('/').pop();
    $$(root, '[data-bk-tz]').forEach(function (el) { el.textContent = tz; });

    // reveal
    var rv = $$(root, '.bk-rv');
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { threshold: .12 });
      rv.forEach(function (el, i) { el.style.transitionDelay = (i * 90) + 'ms'; io.observe(el); });
    } else rv.forEach(function (el) { el.classList.add('is-in'); });

    var pick = $(root, '[data-bk-pick]');
    var stepSlot = $(pick, '[data-bk-step=slot]'), form = $(pick, '[data-bk-mail]'), stepDone = $(pick, '[data-bk-step=done]');
    var daysEl = $(pick, '[data-bk-days]'), timesEl = $(pick, '[data-bk-times]');
    var input = $(form, 'input[type=email]'), err = $(form, '[data-bk-err]'), fail = $(form, '[data-bk-fail]'), submit = $(form, 'button[type=submit]');
    var groups = [];

    function choose(s, custom) {
      st.slot = s; st.custom = !!custom;
      $$(root, '[data-bk-when]').forEach(function (el) { el.textContent = cap(fmt(s, fWhen)); });
      emit('slot', s);
      setTimeout(function () { onSlot(s); }, reduce ? 0 : 220);
    }
    function renderTimes(g) {
      timesEl.innerHTML = '';
      if (!g || !g.slots.length) { timesEl.innerHTML = '<p class="bk-none">' + t.none + '</p>'; return; }
      g.slots.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'bk-time'; b.style.setProperty('--i', i);
        b.textContent = fmt(s, fTime); b.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-label', fmt(s, fWhen));
        b.addEventListener('click', function () {
          $$(timesEl, '.bk-time').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          choose(s, false);
        });
        timesEl.appendChild(b);
      });
    }
    function renderDays(slots) {
      var keep = groups.length ? Math.max(0, $$(daysEl, '.bk-day').findIndex(function (x) { return x.getAttribute('aria-pressed') === 'true'; })) : 0;
      var map = {}, today = dayKey(new Date()), tom = dayKey(new Date(Date.now() + 86400e3));
      groups = [];
      slots.forEach(function (s) { var k = dayKey(s); if (!map[k]) { map[k] = { k: k, d: s, slots: [] }; groups.push(map[k]); } map[k].slots.push(s); });
      groups = groups.slice(0, CFG.days);
      daysEl.innerHTML = '';
      groups.forEach(function (g, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'bk-day'; b.setAttribute('aria-pressed', String(i === Math.min(keep, groups.length - 1)));
        var top = g.k === today ? t.today : g.k === tom ? t.tomorrow : fmt(g.d, fDay);
        b.innerHTML = '<small></small><strong></strong><span></span>';
        b.children[0].textContent = top.replace('.', '');
        b.children[1].textContent = fmt(g.d, fNum);
        b.children[2].textContent = fmt(g.d, fMon).replace('.', '');
        b.setAttribute('aria-label', cap(fmt(g.d, { weekday: 'long', day: 'numeric', month: 'long' })));
        b.addEventListener('click', function () {
          $$(daysEl, '.bk-day').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          renderTimes(g);
        });
        daysEl.appendChild(b);
      });
      renderTimes(groups[Math.min(keep, groups.length - 1)]);
    }
    // Apps Script can take a few seconds on a cold start: show the grid after 2.5 s anyway, hide busy time when it arrives
    var shown = false, got = false;
    setTimeout(function () { if (!got) { shown = true; renderDays(gridSlots([])); } }, 2500);
    loadBusy().then(function (busy) { got = true; if (!shown || (busy.length && !st.slot)) renderDays(gridSlots(busy)); });

    // own time
    var ownT = $(pick, '[data-bk-own-toggle]'), own = $(pick, '[data-bk-own]');
    if (ownT) {
      var od = $(own, '[data-bk-own-date]'), ot = $(own, '[data-bk-own-time]'), oe = $(own, '[data-bk-own-err]');
      var now = new Date(); od.min = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
      ownT.addEventListener('click', function () {
        own.hidden = !own.hidden; ownT.setAttribute('aria-expanded', String(!own.hidden));
        if (!own.hidden) { if (!od.value) { var tm = new Date(Date.now() + 864e5); od.value = tm.getFullYear() + '-' + pad(tm.getMonth() + 1) + '-' + pad(tm.getDate()); } if (!ot.value) ot.value = '12:00'; od.focus(); }
      });
      $(own, '[data-bk-own-go]').addEventListener('click', function () {
        var d = od.value && ot.value ? new Date(od.value + 'T' + ot.value) : null;
        var ok = d && !isNaN(d) && d.getTime() > Date.now() + 3600e3 && d.getTime() < Date.now() + 60 * 864e5;
        oe.hidden = !!ok; if (!ok) return;
        $$(timesEl, '.bk-time').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        choose(d, true);
      });
    }

    function payload() {
      return { start: st.slot.toISOString(), email: st.email, name: P.n, company: P.c, product: P.p, lang: lang, tz: tzFull,
        variant: v, custom: st.custom, utm: P.utm, page: location.origin + location.pathname, ref: document.referrer.slice(0, 200), hp: '' };
    }
    // one id per click: a retry of the same click gets the same answer from the server, never a second event
    function rid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
    function post(body) {
      var ctl = window.AbortController ? new AbortController() : null, timer = ctl && setTimeout(function () { ctl.abort(); }, 25000);
      return fetch(CFG.bookUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body, signal: ctl ? ctl.signal : undefined })
        .then(function (r) { return r.text().then(function (x) { clearTimeout(timer); try { return JSON.parse(x); } catch (e) { var er = new Error('parse ' + r.status + ' ' + x.slice(0, 120)); er.why = 'parse'; throw er; } }); },
              function (e) { clearTimeout(timer); e.why = e.name === 'AbortError' ? 'timeout' : 'network'; throw e; });
    }
    function report(why, detail) { // failed booking -> sheet «Ошибки» next to the requests sheet
      if (!CFG.bookUrl) return;
      try {
        var q = new URLSearchParams({ a: 'log', why: why, detail: String(detail || '').slice(0, 300), email: st.email, start: st.slot ? st.slot.toISOString() : '', variant: v, lang: lang, page: location.href.slice(0, 200), ua: navigator.userAgent.slice(0, 160) });
        fetch(CFG.bookUrl + '?' + q.toString(), { mode: 'no-cors', keepalive: true });
      } catch (e) {}
    }
    function book() {
      if (!CFG.bookUrl) return wait(2600).then(function () { return { ok: true, meet: '' }; });
      var p = payload(); p.rid = rid(); var body = JSON.stringify(p);
      return post(body).catch(function (e) { // a lost answer is retried once with the same id
        return wait(1200).then(function () { return post(body); }).catch(function (e2) { report(e2.why || 'error', e2.message); throw e2; });
      });
    }
    // «booking» state between the button and «You're booked»: steps light up one by one while the server works
    var busyEl = $(pick, '[data-bk-step=busy]'), busyT = [];
    function busyOn() {
      if (!busyEl) return;
      form.hidden = true; busyEl.hidden = false;
      var steps = $$(busyEl, '[data-bk-busy-step]');
      steps.forEach(function (s, i) { s.classList.remove('is-on', 'is-done'); });
      steps.forEach(function (s, i) {
        busyT.push(setTimeout(function () { if (i) steps[i - 1].classList.add('is-done'); s.classList.add('is-on'); }, reduce ? 0 : i * 1100));
      });
      busyEl.focus({ preventScroll: true });
    }
    function busyOff(ok) {
      busyT.forEach(clearTimeout); busyT = [];
      if (!busyEl) return Promise.resolve();
      if (!ok) { busyEl.hidden = true; form.hidden = false; return Promise.resolve(); }
      $$(busyEl, '[data-bk-busy-step]').forEach(function (s) { s.classList.add('is-on', 'is-done'); });
      return wait(450).then(function () { busyEl.hidden = true; });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submit.getAttribute('aria-busy') === 'true') return;
      var val = (input.value || '').trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
      input.setAttribute('aria-invalid', String(!ok)); err.hidden = ok; fail.hidden = true;
      if (!ok) { input.focus(); return; }
      st.email = val; submit.setAttribute('aria-busy', 'true');
      $$(root, '[data-bk-email]').forEach(function (el) { el.textContent = val; });
      emit('busy');
      busyOn();
      book().then(function (res) {
        submit.removeAttribute('aria-busy');
        if (!res || !res.ok) {
          if (res && !/^(limit|range|email)$/.test(res.err)) report('server', res.err);
          return busyOff(false).then(function () { fail.textContent = res && res.err === 'limit' ? t.limit : res && res.err === 'range' ? t.range : t.fail; fail.hidden = false; });
        }
        $$(root, '[data-bk-gcal]').forEach(function (a) { a.href = gcalUrl(st.slot, t); a.hidden = !!res.meet; });
        $$(root, '[data-bk-ics]').forEach(function (a) { a.hidden = !!res.meet; });
        $$(root, '[data-bk-meet]').forEach(function (a) { if (res.meet) { a.href = res.meet; a.hidden = false; } });
        return busyOff(true).then(function () { emit('done', res); onDone(res); });
      }).catch(function () { submit.removeAttribute('aria-busy'); busyOff(false).then(function () { fail.textContent = t.fail; fail.hidden = false; }); });
    });
    input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') { input.removeAttribute('aria-invalid'); err.hidden = true; } });
    $$(root, '[data-bk-ics]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); if (st.slot) ics(st.slot, t); }); });
    var back = $(form, '[data-bk-back]');
    back.addEventListener('click', function () { form.hidden = true; stepSlot.hidden = false; fail.hidden = true; var b = $(timesEl, '[aria-pressed=true]') || $(daysEl, '.bk-day'); if (b) b.focus(); });

    // default flow, variants override
    function showMail() { stepSlot.hidden = true; form.hidden = false; setTimeout(function () { input.focus({ preventScroll: true }); }, 60); }
    function showDone() { form.hidden = true; stepDone.hidden = false; stepDone.focus({ preventScroll: true }); }
    var onSlot = showMail, onDone = showDone;

    /* ---- globe ---- */
    var globe = window.bkGlobe && window.bkGlobe($(root, '[data-bk-globe]'), { tz: tzFull, reduce: reduce, pinYou: $(root, '[data-bk-pin-you]'), pinUs: $(root, '[data-bk-pin-us]') });
    if (!globe) root.classList.add('bk-no-gl');
    else { hooks.slot.push(function () { globe.focus(); }); hooks.busy.push(function () { globe.focus(); }); hooks.done.push(function () { globe.fire(); }); }
    // lead's local time on the "You" pin, refreshed every 20 s
    var clock = $(root, '[data-bk-clock]');
    if (clock) { var tick = function () { clock.textContent = fmt(new Date(), fTime); }; tick(); setInterval(tick, 20e3); }
  };

  function boot() { var p = document.querySelector('main:not([hidden]) .bk-page') || document.querySelector('.bk-page'); window.bkInit(p); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
