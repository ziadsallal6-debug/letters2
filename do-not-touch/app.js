/* =====================================================================
   THE BEHAVIOUR  —  builds the envelopes and plays the opening animation
   >>> You never need to edit this file. <<<
   Your words live in  content/settings.js  and  content/letters.js
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- tiny helpers ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- friendly message if a content file has a typo ---------- */
  /* (SETTINGS and LETTERS are plain "const" values from the content files, so we read them like this) */
  var S = typeof SETTINGS !== 'undefined' ? SETTINGS : undefined;
  var L = typeof LETTERS !== 'undefined' ? LETTERS : undefined;
  if (!S || typeof S !== 'object' || !Array.isArray(L)) {
    document.body.innerHTML =
      '<div style="max-width:560px;margin:12vh auto;padding:28px;font:20px/1.55 Georgia,serif;color:#3a2519;background:#f3e9d4;border:1px solid #b8934a;border-radius:6px">' +
      '<h2 style="margin:0 0 10px;font-weight:normal;color:#6e1f2e">Oops: a little typo</h2>' +
      '<p>The website could not read one of your content files. This almost always means a quote mark, backtick, comma or bracket was deleted by accident in ' +
      '<b>content/letters.js</b> or <b>content/settings.js</b>.</p>' +
      '<p>Undo your last change (or compare with the original file), save, and refresh the page.</p></div>';
    return;
  }

  /* ---------- settings (missing lines fall back to these) ---------- */
  var DEFAULTS = {
    pageTitle: 'Twenty-Three Letters', photo: 'images/birthday-person.jpg', photoAlt: '', photoFocus: '50% 30%',
    age: 23, eyebrow: '', greeting: 'Happy Birthday', name: '', intro: '', beginText: 'break the first seal',
    collectionLabel: 'The Collection', collectionTitle: 'The letters', collectionIntro: '',
    progressText: '{opened} of {total} letters opened', envelopeAddress: 'For {name}', showTitleOnEnvelope: false,
    signoff: '', signature: '', closeText: 'fold the letter away',
    footerMessage: '', allOpenedMessage: '', backToTopText: 'back to the beginning'
  };
  var cfg = Object.assign({}, DEFAULTS, S);
  var fmt = function (str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) { return vars && k in vars ? vars[k] : m; });
  };

  /* ---------- the letters ---------- */
  var letters = L.map(function (l) {
    if (typeof l === 'string') l = { title: '', text: l };
    l = l || {};
    return { title: String(l.title == null ? '' : l.title).trim(), text: String(l.text == null ? '' : l.text) };
  });
  var total = letters.length;

  /* ---------- remembers which letters were opened (on this device only) ---------- */
  var STORE = 'twenty-three-letters:opened';
  var opened = new Set();
  try { JSON.parse(localStorage.getItem(STORE) || '[]').forEach(function (i) { if (i < total) opened.add(i); }); } catch (e) {}
  var saveOpened = function () { try { localStorage.setItem(STORE, JSON.stringify(Array.from(opened))); } catch (e) {} };

  /* =====================================================================
     DRAWING PARTS
     ===================================================================== */
  function sealHTML(inner, gold) {
    var face = '<span class="seal__face">' + inner + '</span>';
    return '<span class="seal' + (gold ? ' seal--gold' : '') + '">' +
      '<span class="seal__half seal__half--l">' + face + '</span>' +
      '<span class="seal__half seal__half--r">' + face + '</span></span>';
  }
  var ICON_ROSE = '<svg aria-hidden="true"><use href="#rose"/></svg>';
  var ICON_X = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>';

  function stampSVG(n) {
    var v = (n - 1) % 4;
    var bg = ['#6e1f2e', '#5f6440', '#b98585', '#2f2a3a'][v];
    var art = [
      '<use href="#rose" x="8" y="9" width="24" height="24" style="color:#f0d9b5"/>',
      '<use href="#sprig" x="11" y="5.5" width="18" height="27" style="color:#efe3bf"/>',
      '<use href="#heart" x="8" y="9" width="24" height="24" style="color:#fbf0e0"/>',
      '<path d="M24 11 a9.5 9.5 0 1 0 5 16.5 a7.5 7.5 0 0 1 -5 -16.5z" fill="#dcc486"/>' +
        '<circle cx="12" cy="13" r="1" fill="#dcc486"/><circle cx="28" cy="31" r=".8" fill="#dcc486"/><circle cx="14" cy="29" r=".7" fill="#dcc486"/>'
    ][v];
    return '<svg viewBox="0 0 70 50" aria-hidden="true">' +
      '<g transform="translate(30 0)">' +
        '<rect x="1" y="1" width="38" height="48" fill="#f7eedb"/>' +
        '<rect x="1" y="1" width="38" height="48" fill="none" style="stroke:var(--env-paper)" stroke-width="2.6" stroke-dasharray="0 4.2" stroke-linecap="round"/>' +
        '<rect x="5" y="5" width="30" height="33" fill="' + bg + '"/>' +
        '<rect x="6.2" y="6.2" width="27.6" height="30.6" fill="none" stroke="#dcc486" stroke-opacity=".6" stroke-width=".5"/>' +
        art +
        '<text x="20" y="45.2" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="5.6" font-weight="600" fill="#6e1f2e" letter-spacing=".4">' + n + 'd</text>' +
      '</g>' +
      '<g fill="none" stroke="#3a2519" stroke-opacity=".5" stroke-width=".9">' +
        '<circle cx="27" cy="27" r="13"/><circle cx="27" cy="27" r="9.8" stroke-width=".5"/>' +
        '<path stroke-width=".7" d="M0 21q3-3 6 0t6 0M0 26q3-3 6 0t6 0M0 31q3-3 6 0t6 0M0 36q3-3 6 0t6 0"/>' +
      '</g>' +
      '<text x="27" y="29.2" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="6.2" font-weight="600" fill="#3a2519" fill-opacity=".62">' + n + '/' + total + '</text>' +
    '</svg>';
  }

  var LINERS = ['liner-burg', 'liner-olive', 'liner-wine', 'liner-rose'];
  var TILTS = [-1.6, 1.2, -0.8, 1.7, -1.2, 0.9, -1.8, 1.4];

  function buildEnvelope(i, stage) {
    var n = i + 1, num = pad(n), isFinal = n === total, liner = LINERS[i % 4];
    var el = document.createElement(stage ? 'div' : 'button');
    if (!stage) el.type = 'button';
    el.className = 'env' + (stage ? ' env--stage' : '') + (isFinal ? ' env--final' : '');
    el.style.setProperty('--tilt', (stage ? 0 : TILTS[i % TILTS.length]) + 'deg');
    if (stage) {
      /* the big envelope takes on the same paper colour as the small one */
      var cs = getComputedStyle(stage === true ? document.body : stage);
      ['--env-paper', '--env-paper2', '--env-flap'].forEach(function (k) {
        var v = cs.getPropertyValue(k); if (v) el.style.setProperty(k, v);
      });
    }
    el.innerHTML =
      '<span class="env__body">' +
        '<span class="env__shadow"></span>' +
        '<svg class="env__back" viewBox="0 0 142 100" preserveAspectRatio="none" aria-hidden="true"><rect width="142" height="100" fill="url(#' + liner + ')"/></svg>' +
        '<span class="env__letter"></span>' +
        '<svg class="env__front" viewBox="0 0 142 100" preserveAspectRatio="none" aria-hidden="true">' +
          '<polygon class="p" points="0,0 71,54 0,100"/><polygon class="p" points="142,0 71,54 142,100"/><polygon class="p p--b" points="0,100 71,54 142,100"/>' +
          '<polygon fill="url(#g-side-l)" points="0,0 71,54 0,100"/><polygon fill="url(#g-side-r)" points="142,0 71,54 142,100"/><polygon fill="url(#g-bottom)" points="0,100 71,54 142,100"/>' +
        '</svg>' +
        '<span class="env__flap">' +
          '<span class="env__face env__face--front"><svg viewBox="0 0 142 62" preserveAspectRatio="none" aria-hidden="true"><polygon class="f" points="0,0 142,0 71,62"/><polygon fill="url(#g-flap)" points="0,0 142,0 71,62"/></svg></span>' +
          '<span class="env__face env__face--back"><svg viewBox="0 0 142 62" preserveAspectRatio="none" aria-hidden="true"><polygon class="f" fill="url(#' + liner + ')" points="0,0 142,0 71,62"/></svg></span>' +
        '</span>' +
        '<span class="env__stamp">' + stampSVG(n) + '</span>' +
        '<span class="env__addr" dir="auto"></span>' +
        '<span class="env__seal">' + sealHTML(num, isFinal) + '</span>' +
      '</span>';
    var addr = cfg.showTitleOnEnvelope && letters[i].title ? letters[i].title : fmt(cfg.envelopeAddress, { name: cfg.name });
    el.querySelector('.env__addr').textContent = addr;
    if (!stage) {
      el.setAttribute('aria-label', 'Open letter ' + n + ' of ' + total + (letters[i].title ? ': ' + letters[i].title : ''));
      el.dataset.index = i;
      if (opened.has(i)) el.classList.add('is-read');
    }
    return el;
  }

  /* =====================================================================
     OPENING SCREEN
     ===================================================================== */
  document.title = cfg.pageTitle;
  var photo = $('#photo');
  photo.alt = cfg.photoAlt || '';
  photo.style.setProperty('--focus', cfg.photoFocus);
  photo.addEventListener('error', function () { photo.alt = ''; photo.style.visibility = 'hidden'; });
  photo.src = cfg.photo;

  $('#eyebrow').textContent = cfg.eyebrow;
  $('#greeting').textContent = cfg.greeting;
  $('#name').textContent = cfg.name;
  $('#intro').textContent = cfg.intro;
  $('#beginText').textContent = cfg.beginText;
  $('#ageSeal').innerHTML = sealHTML(String(cfg.age));
  $('#beginSeal').innerHTML = sealHTML(ICON_ROSE);
  ['#eyebrow', '#intro', '#name'].forEach(function (s) { if (!$(s).textContent) $(s).style.display = 'none'; });

  $('#collectionLabel').textContent = cfg.collectionLabel;
  $('#collectionTitle').textContent = cfg.collectionTitle;
  $('#collectionIntro').textContent = cfg.collectionIntro;
  $('#footerMessage').textContent = cfg.footerMessage;
  $('#finale').textContent = cfg.allOpenedMessage;
  $('#backToTop').textContent = cfg.backToTopText;
  $('#closeText').textContent = cfg.closeText;
  $('#closeSeal').innerHTML = sealHTML(ICON_X);
  if (!cfg.collectionIntro) $('#collectionIntro').style.display = 'none';

  /* smooth scrolling between the two pages */
  function glideTo(id) {
    var t = document.getElementById(id);
    if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
  $('#begin').addEventListener('click', function (e) { e.preventDefault(); glideTo('collection'); });
  $('#backToTop').addEventListener('click', function (e) { e.preventDefault(); glideTo('top'); });

  /* start the entrance once fonts and photo are ready (never wait more than ~2.5s) */
  var photoReady = new Promise(function (res) {
    if (photo.complete) return res();
    photo.addEventListener('load', res); photo.addEventListener('error', res);
  });
  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.race([Promise.all([photoReady, fontsReady]), wait(2500)]).then(function () {
    requestAnimationFrame(function () { document.documentElement.classList.add('is-ready'); });
  });

  /* =====================================================================
     THE 23 ENVELOPES
     ===================================================================== */
  var grid = $('#grid');
  var progressEl = $('#progress');
  var finaleEl = $('#finale');

  letters.forEach(function (_, i) {
    var li = document.createElement('li');
    li.appendChild(buildEnvelope(i, false));
    grid.appendChild(li);
  });

  function updateProgress() {
    progressEl.textContent = fmt(cfg.progressText, { opened: opened.size, total: total });
    finaleEl.classList.toggle('is-on', total > 0 && opened.size >= total && !!cfg.allOpenedMessage);
  }
  updateProgress();

  /* envelopes drift into view as you scroll */
  var envs = Array.prototype.slice.call(grid.querySelectorAll('.env'));
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, idx = envs.indexOf(el);
        el.style.transitionDelay = ((idx % 3) * 90) + 'ms';
        el.classList.add('is-in');
        setTimeout(function () { el.style.transitionDelay = ''; }, 1200);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    envs.forEach(function (el) { io.observe(el); });
  } else {
    envs.forEach(function (el) { el.classList.add('is-in'); });
  }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.env');
    if (btn && grid.contains(btn)) openLetter(parseInt(btn.dataset.index, 10), btn);
  });

  /* =====================================================================
     THE STAGE: opening and reading a letter
     ===================================================================== */
  var page = $('#page'), stage = $('#stage'), envHost = $('#envHost'), layout = $('#stageLayout');
  var sheet = $('#sheet'), scrollEl = $('#sheetScroll'), bodyEl = $('#sheetBody'), contentEl = $('.sheet__content');
  var closeBtn = $('#closeBtn'), petals = $('#petals');
  var busy = false, current = null, sheetAnim = null, safety = null;

  var EASE = 'cubic-bezier(.22,.8,.24,1)';

  function fillSheet(i) {
    var l = letters[i];
    $('#sheetNo').textContent = 'Nº ' + pad(i + 1);
    $('#sheetTitle').textContent = l.title;
    $('#sheetSignoff').textContent = cfg.signoff;
    $('#sheetSignature').textContent = cfg.signature;
    $('#sheetSignoff').style.display = cfg.signoff ? '' : 'none';
    $('#sheetSignature').style.display = cfg.signature ? '' : 'none';
    $('.sheet__sign').style.display = (cfg.signoff || cfg.signature) ? '' : 'none';

    bodyEl.replaceChildren();
    var paras = l.text.replace(/\r\n?/g, '\n').split(/\n[ \t]*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    paras.forEach(function (p, k) {
      var el = document.createElement('p');
      el.dir = 'auto';
      el.textContent = p.split('\n').map(function (s) { return s.trim(); }).join('\n');
      el.style.setProperty('--i', k);
      bodyEl.appendChild(el);
    });
    var first = paras[0] || '';
    bodyEl.classList.toggle('has-dropcap', first.length >= 90 && /^[A-Za-zÀ-ɏ]/.test(first));

    Array.prototype.forEach.call(contentEl.children, function (c, k) { c.style.setProperty('--i', k); });
    scrollEl.scrollTop = 0;
    sheet.classList.remove('is-scrollable', 'at-end', 'is-reading');
    sheet.setAttribute('aria-label', 'Letter ' + (i + 1));
  }

  function checkScroll() {
    var scrollable = scrollEl.scrollHeight - scrollEl.clientHeight > 8;
    sheet.classList.toggle('is-scrollable', scrollable);
    sheet.classList.toggle('at-end', scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 8);
  }
  scrollEl.addEventListener('scroll', checkScroll, { passive: true });
  window.addEventListener('resize', function () { if (sheet.classList.contains('is-shown')) checkScroll(); });

  function sprinkle() {
    if (reduceMotion) return;
    petals.replaceChildren();
    for (var k = 0; k < 9; k++) {
      var p = document.createElement('span');
      p.className = 'petal';
      var sign = Math.random() < 0.5 ? -1 : 1;
      p.style.setProperty('--x', (Math.random() * 96) + 'vw');
      p.style.setProperty('--s', (9 + Math.random() * 9) + 'px');
      p.style.setProperty('--t', (6.5 + Math.random() * 4) + 's');
      p.style.setProperty('--dl', (Math.random() * 1.6) + 's');
      p.style.setProperty('--dx', (sign * (30 + Math.random() * 110)) + 'px');
      p.style.setProperty('--r', (sign * (200 + Math.random() * 340)) + 'deg');
      petals.appendChild(p);
    }
    setTimeout(function () { petals.replaceChildren(); }, 12500);
  }

  function showSheet(fromRect) {
    var finalRect = sheet.getBoundingClientRect();
    sheet.classList.add('is-shown', 'is-reading');
    closeBtn.classList.add('is-shown');
    if (fromRect && finalRect.width) {
      var sx = fromRect.width / finalRect.width, sy = fromRect.height / finalRect.height;
      var dx = (fromRect.left + fromRect.width / 2) - (finalRect.left + finalRect.width / 2);
      var dy = (fromRect.top + fromRect.height / 2) - (finalRect.top + finalRect.height / 2);
      sheetAnim = sheet.animate(
        [{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')' }, { transform: 'none' }],
        { duration: 950, easing: EASE }
      );
    } else if (!reduceMotion) {
      sheetAnim = sheet.animate([{ opacity: 0, transform: 'translateY(18px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: EASE });
    }
    sprinkle();
    checkScroll();
    setTimeout(checkScroll, 1000);
    try { sheet.focus({ preventScroll: true }); } catch (e) {}
  }

  async function openLetter(i, btn) {
    if (busy || !letters[i]) return;
    busy = true; current = { i: i, btn: btn };
    fillSheet(i);

    page.inert = true;
    document.documentElement.classList.add('is-locked');
    stage.classList.add('is-on');
    stage.setAttribute('aria-hidden', 'false');

    var env = buildEnvelope(i, btn);          /* the big copy of the clicked envelope */
    envHost.replaceChildren(env);
    var letterEl = env.querySelector('.env__letter');

    var failsafe = setTimeout(function () { if (!sheet.classList.contains('is-shown')) showSheet(null); busy = false; }, 7000);

    try {
      if (reduceMotion) {
        btn.style.visibility = 'hidden';
        await wait(150);
        showSheet(null);
      } else {
        var srcRect = btn.querySelector('.env__body').getBoundingClientRect();
        var dstRect = env.querySelector('.env__body').getBoundingClientRect();
        var tilt = parseFloat(btn.style.getPropertyValue('--tilt')) || 0;
        var s = srcRect.width / dstRect.width;
        var dx = (srcRect.left + srcRect.width / 2) - (dstRect.left + dstRect.width / 2);
        var dy = (srcRect.top + srcRect.height / 2) - (dstRect.top + dstRect.height / 2);
        btn.style.visibility = 'hidden';

        /* 1. the envelope floats from the shelf to the middle of the screen */
        var fly = env.animate(
          [{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ') rotate(' + tilt + 'deg)' },
           { transform: 'translate(0,0) scale(1) rotate(0deg)' }],
          { duration: 820, easing: EASE }
        );
        await fly.finished.catch(function () {});
        await wait(160);

        /* 2. the wax seal cracks */
        env.classList.add('is-breaking');
        await wait(760);

        /* 3. the flap opens */
        env.classList.add('is-open');
        await wait(760);

        /* 4. the letter slides out */
        env.classList.add('is-up');
        await wait(1150);

        /* 5. the letter unfolds into a full page, the envelope slips away */
        var mini = letterEl.getBoundingClientRect();
        letterEl.style.visibility = 'hidden';
        env.animate(
          [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(80px) scale(.94)' }],
          { duration: 750, easing: 'ease-in', fill: 'forwards' }
        );
        showSheet(mini);
      }
      await wait(reduceMotion ? 0 : 900);
    } catch (err) {
      if (!sheet.classList.contains('is-shown')) showSheet(null);
    } finally {
      clearTimeout(failsafe);
      busy = false;
    }
  }

  async function closeLetter() {
    if (busy || !current || !sheet.classList.contains('is-shown')) return;
    busy = true;
    var c = current;
    closeBtn.classList.remove('is-shown');
    sheetAnim = sheet.animate(
      [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(40px) scale(.96)' }],
      { duration: reduceMotion ? 1 : 520, easing: 'ease-in', fill: 'forwards' }
    );
    stage.classList.remove('is-on');
    await wait(reduceMotion ? 20 : 560);

    sheet.classList.remove('is-shown', 'is-reading');
    if (sheetAnim) { sheetAnim.cancel(); sheetAnim = null; }
    envHost.replaceChildren();
    petals.replaceChildren();
    stage.setAttribute('aria-hidden', 'true');
    page.inert = false;
    document.documentElement.classList.remove('is-locked');

    opened.add(c.i); saveOpened();
    c.btn.style.visibility = '';
    c.btn.classList.add('is-read', 'is-settle');
    setTimeout(function () { c.btn.classList.remove('is-settle'); }, 1000);
    updateProgress();
    try { c.btn.focus({ preventScroll: true }); } catch (e) {}
    current = null;
    busy = false;
  }

  closeBtn.addEventListener('click', closeLetter);
  layout.addEventListener('click', function (e) { if (e.target === layout) closeLetter(); });
  document.addEventListener('keydown', function (e) {
    if (!stage.classList.contains('is-on')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLetter(); }
    else if (e.key === 'Tab' && sheet.classList.contains('is-shown')) {
      var order = [scrollEl, closeBtn];
      var at = order.indexOf(document.activeElement);
      var next = e.shiftKey ? (at <= 0 ? order.length - 1 : at - 1) : (at + 1) % order.length;
      e.preventDefault(); order[next].focus({ preventScroll: true });
    }
  });
})();
