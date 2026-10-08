(function () {
  const NAV = [
    { id: 'home', label: 'Home', href: 'home.html' },
    { id: 'my-reports', label: 'My Reports', href: 'my-reports.html' },
    { id: 'media-trials', label: 'Media Trials', href: 'reports.html?type=media-trials' },
    { id: 'reports', label: 'Intelligence Reports', href: 'reports.html' },
    { id: 'data', label: 'Data', href: 'data.html' },
    { id: 'about', label: 'About', href: 'about.html' },
  ];
  const COOKIE_KEY = 'atlas-cookie-consent';

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const byId = (id) => (window.ATLAS_REPORTS || []).find((r) => r.id === id);

  const ph = (r, cls = 'r16x9', label) =>
    `<div class="ph ${cls}" style="--h:${r?.hue ?? 280}"><span class="ph-tag">IMAGE</span><span>${esc(label ?? r?.title ?? '')}</span></div>`;

  const reportHref = (r) => `reports.html?id=${encodeURIComponent(r.id)}`;

  let toastTimer;
  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function activeNav(page) {
    if (page !== 'reports') return page;
    return new URLSearchParams(location.search).get('type') === 'media-trials' ? 'media-trials' : 'reports';
  }

  function renderHeader(page) {
    const slot = document.getElementById('site-header');
    if (!slot) return;
    const active = activeNav(page);
    const q = new URLSearchParams(location.search).get('q') || '';
    slot.outerHTML = `
      <header class="site-header">
        <div class="container">
          <a class="brand" href="home.html" aria-label="ATLAS home">
            <img src="../om-logo.jpg" alt="Omnicom Media" />
            <span>ATLAS</span>
          </a>
          <nav class="nav">
            ${NAV.map((n) => `<a href="${n.href}" class="${n.id === active ? 'active' : ''}">${n.label}</a>`).join('')}
          </nav>
          <div class="header-tools">
            <form class="search" action="reports.html" method="get" role="search">
              <input name="q" type="search" placeholder="Search reports" value="${esc(q)}" aria-label="Search reports" />
              <button type="submit">SEARCH</button>
            </form>
            <a class="signout" href="index.html" title="Sign out">Sign out</a>
          </div>
        </div>
      </header>`;
    const header = document.querySelector('.site-header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function renderFooter() {
    const slot = document.getElementById('site-footer');
    if (!slot) return;
    slot.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-brand">
            <img src="../om-logo.jpg" alt="" />
            <span>ATLAS · Omnicom Media Global Intelligence</span>
          </div>
          <div class="footer-links">
            <a href="legal.html?doc=privacy">Privacy Policy</a>
            <a href="legal.html?doc=terms">Terms of Use</a>
            <a href="legal.html?doc=cookies">Cookie Policy</a>
            <button type="button" data-cookie-settings>Cookie settings</button>
          </div>
          <div>© 2026 Omnicom Media Group · Demo mock-up</div>
        </div>
      </footer>`;
  }

  function cookieBanner() {
    const el = document.createElement('div');
    el.className = 'cookie';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie consent');
    el.innerHTML = `
      <div class="cookie-main">
        <div>
          <h3>We value your privacy</h3>
          <p>ATLAS uses essential cookies to keep you signed in, and optional cookies to understand how the site is used and to improve it.
          You can accept all cookies, reject non-essential cookies, or choose which ones to allow. Read our <a href="legal.html?doc=cookies">Cookie Policy</a>.</p>
        </div>
        <div class="cookie-actions">
          <button class="btn ghost" data-act="manage">Manage</button>
          <button class="btn ghost" data-act="reject">Reject non-essential</button>
          <button class="btn" data-act="accept">Accept all</button>
        </div>
      </div>
      <div class="cookie-prefs"><div>
        <div class="pref-grid">
          <div class="pref"><div><strong>Strictly necessary</strong><small>Sign-in, security and load balancing. Always on.</small></div>
            <label class="switch"><input type="checkbox" checked disabled /><span></span></label></div>
          <div class="pref"><div><strong>Analytics</strong><small>Anonymous usage statistics to help us improve ATLAS.</small></div>
            <label class="switch"><input type="checkbox" data-pref="analytics" /><span></span></label></div>
          <div class="pref"><div><strong>Preferences</strong><small>Remember settings such as saved filters and markets.</small></div>
            <label class="switch"><input type="checkbox" data-pref="preferences" /><span></span></label></div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:14px">
          <button class="btn" data-act="save">Save preferences</button>
        </div>
      </div></div>`;
    document.body.appendChild(el);

    const store = (value) => {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...value, at: new Date().toISOString() }));
      el.classList.remove('show', 'manage');
      toast('Cookie preferences saved');
    };
    const open = () => {
      const saved = JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null');
      el.querySelectorAll('[data-pref]').forEach((i) => { i.checked = !!saved?.[i.dataset.pref]; });
      el.classList.add('show');
    };

    el.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'manage') el.classList.toggle('manage');
      if (act === 'accept') store({ analytics: true, preferences: true });
      if (act === 'reject') store({ analytics: false, preferences: false });
      if (act === 'save') {
        const v = {};
        el.querySelectorAll('[data-pref]').forEach((i) => { v[i.dataset.pref] = i.checked; });
        store(v);
      }
    });
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-cookie-settings]')) { el.classList.add('manage'); open(); }
    });
    if (!localStorage.getItem(COOKIE_KEY)) setTimeout(open, 900);
  }

  function reveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach((i) => i.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((i, idx) => {
      i.style.transitionDelay = `${Math.min(idx % 4, 3) * 70}ms`;
      io.observe(i);
    });
  }

  window.ATLAS = { esc, byId, ph, reportHref, toast, reveal };

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    renderHeader(page);
    renderFooter();
    cookieBanner();
    document.dispatchEvent(new Event('atlas:ready'));
    reveal();
  });
})();
