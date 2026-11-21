(function () {
  'use strict';
  const B = window.BUSINESS, V = window.VEHICLES, I = window.I18N, t = I.t;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = n => Number(n).toLocaleString('fr-DZ');

  /* ---------- icons ---------- */
  const ICON = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88zM20.5 3.49A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.34-1.66a11.88 11.88 0 0 0 5.7 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.44-8.41z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    fuel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M3 22h12M15 10h2a2 2 0 0 1 2 2v4a2 2 0 0 0 4 0V9l-3-3"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'
  };
  window.ICON = ICON;

  /* ---------- link builders ---------- */
  const waLink = text => B.whatsappHref + (text ? '?text=' + encodeURIComponent(text) : '');
  const mapsDir = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(B.mapsQuery);
  const mapsPlace = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(B.mapsQuery);
  const mapsEmbed = 'https://www.google.com/maps?q=' + encodeURIComponent(B.mapsQuery) + '&output=embed';
  const btnCall = (cls, label) => `<a class="btn btn-call ${cls || ''}" href="${B.phoneHref}">${ICON.phone}<span>${label || t('cta.call')}</span></a>`;
  const btnWa = (cls, text, label) => `<a class="btn btn-wa ${cls || ''}" href="${esc(waLink(text))}" target="_blank" rel="noopener">${ICON.wa}<span>${label || t('cta.wa')}</span></a>`;

  /* ---------- placeholder artwork (used until real photos are supplied) ---------- */
  function placeholder(v) {
    return `<svg viewBox="0 0 400 250" role="img" aria-label="${esc(I.vName(v))}" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="250" fill="#0D2D4F"/><rect y="170" width="400" height="80" fill="#071D35"/>
      <path d="M70 160 Q72 135 105 131 L135 121 L165 92 L250 90 L290 121 L320 131 Q350 135 352 160 L352 180 L70 180Z" fill="#F5F7FA"/>
      <path d="M150 120 L172 96 L248 94 L275 120Z" fill="#9fb4c9"/>
      <path d="M60 188 Q210 140 360 178" stroke="#C8202A" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle cx="140" cy="180" r="21" fill="#071D35" stroke="#F5F7FA" stroke-width="4"/><circle cx="285" cy="180" r="21" fill="#071D35" stroke="#F5F7FA" stroke-width="4"/>
      <text x="200" y="228" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#9fb4c9">${esc(t('photo.soon'))}</text></svg>`;
  }
  function vImg(v, idx, lazy) {
    const src = v.images && v.images[idx || 0];
    return src ? `<img src="${esc(src)}" alt="${esc(I.vName(v))}" ${lazy ? 'loading="lazy"' : ''} decoding="async" onerror="this.replaceWith(document.createRange().createContextualFragment(window.__ph(${JSON.stringify(v.id)})))">` : placeholder(v);
  }
  window.__ph = id => placeholder(V.find(x => x.id === id));

  /* ---------- vehicle helpers ---------- */
  const detailHref = v => 'vehicule.html?id=' + encodeURIComponent(v.id);
  const availBadge = v => v.available === true ? `<span class="badge ok">${t('badge.avail')}</span>` : v.available === false ? `<span class="badge no">${t('badge.unavail')}</span>` : '';
  const priceHtml = v => v.price != null ? `<div class="v-price">${num(v.price)} DA <small>${t('price.perDay')}</small></div>` : `<div class="v-price call">${t('price.call')}</div>`;
  const waVehicleText = v => t('detail.waText', { name: I.vName(v) });

  function card(v) {
    return `<article class="v-card">
      <a class="v-img" href="${detailHref(v)}" aria-label="${esc(I.vName(v))}">${vImg(v, 0, true)}
        <div class="v-badges">${availBadge(v)}</div></a>
      <div class="v-body">
        <div><h3 class="v-title">${esc(I.vName(v))}</h3><div class="v-sub">${esc(v.model || '')} · ${esc(t('cat.' + v.cat))}</div></div>
        <div class="v-specs">
          <span>${ICON.cal}${v.year != null ? esc(v.year) : '—'}</span>
          <span>${ICON.gear}${esc(t('trans.' + v.trans))}</span>
          <span>${ICON.fuel}${esc(t('fuel.' + v.fuel))}</span>
          <span>${ICON.users}${esc(t('seats.n', { n: v.seats }))}</span>
        </div>
        ${priceHtml(v)}
        <div class="v-actions">
          ${btnCall('full')}
          <a class="btn btn-outline" href="${detailHref(v)}">${t('cta.details')}</a>
          ${btnWa('', waVehicleText(v))}
        </div></div></article>`;
  }

  /* ---------- shared layout components ---------- */
  const page = document.body.dataset.page;
  const nav = [['index.html', 'nav.home', 'Accueil'], ['catalogue.html', 'nav.vehicles', 'Nos véhicules'], ['index.html#reservation', 'nav.how', 'Comment réserver'], ['index.html#avis', 'nav.reviews', 'Avis Google'], ['index.html#contact', 'nav.contact', 'Contact']];
  const logo = cls => `<picture><source srcset="logo.webp" type="image/webp"><img src="logo.png" alt="Chaâlal Aziz — Location de voiture" width="${cls ? 168 : 116}" height="${cls ? 84 : 58}"></picture>`;

  function renderHeader() {
    const el = $('#site-header'); if (!el) return;
    const links = nav.map(n => `<a href="${n[0]}" data-i18n="${n[1]}" ${((page === 'home' && n[0] === 'index.html') || (page === 'catalogue' && n[0] === 'catalogue.html')) ? 'aria-current="page"' : ''}>${n[2]}</a>`).join('');
    const mlinks = nav.map(n => `<a class="link" href="${n[0]}" data-i18n="${n[1]}">${n[2]}</a>`).join('');
    el.innerHTML = `<header class="site-header"><div class="container header-inner">
      <a class="logo-link" href="index.html" data-i18n-attr="aria-label:aria.home" aria-label="Chaâlal Aziz — Accueil">${logo()}</a>
      <nav class="main-nav" aria-label="Navigation principale">${links}</nav>
      <div class="header-actions">
        <a class="header-phone" href="${B.phoneHref}">${ICON.phone}<span dir="ltr">${esc(B.phoneDisplay)}</span></a>
        <button class="btn-lang" id="langToggle" type="button" data-i18n-attr="aria-label:aria.lang" aria-label="Changer de langue" lang="ar">عربي</button>
        <button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="mobileNav" data-i18n-attr="aria-label:aria.menu" aria-label="Menu">${ICON.menu}</button>
      </div></div></header>
      <div class="mobile-nav" id="mobileNav">${mlinks}<div style="display:grid;gap:10px;margin-top:12px">${btnCall('btn-block')}${btnWa('btn-block')}</div></div>`;
    $('#langToggle').addEventListener('click', () => I.setLang(I.lang === 'fr' ? 'ar' : 'fr'));
    const mt = $('#menuToggle'), mn = $('#mobileNav');
    mt.addEventListener('click', () => { const o = mn.classList.toggle('open'); mt.setAttribute('aria-expanded', o); });
    mn.addEventListener('click', e => { if (e.target.closest('a.link')) { mn.classList.remove('open'); mt.setAttribute('aria-expanded', 'false'); } });
  }

  function renderFooter() {
    const el = $('#site-footer'); if (!el) return;
    const hours = B.openingHours ? `<p>${ICON.clock.replace('<svg', '<svg width="14" height="14" style="display:inline;vertical-align:-2px"')} ${esc(I.bText(B.openingHours))}</p>` : '';
    const social = [B.facebookUrl && ['Facebook', B.facebookUrl], B.instagramUrl && ['Instagram', B.instagramUrl]].filter(Boolean).map(s => `<a href="${esc(s[1])}" target="_blank" rel="noopener">${s[0]}</a>`).join(' · ');
    el.innerHTML = `<footer class="site-footer"><div class="container"><div class="f-grid">
      <div><div class="f-logo">${logo(true)}</div>
        <p data-i18n="foot.about">Location de voitures à Bou Ismaïl, Tipaza. Réservation par téléphone.</p>
        <p style="margin-top:10px"><span class="stars">★★★★★</span> <span dir="ltr">${B.googleRating}/5</span> — <span data-i18n="foot.reviews">${B.googleReviewCount} avis Google</span></p></div>
      <div><h3 data-i18n="foot.nav">Navigation</h3><div class="f-links">${nav.map(n => `<a href="${n[0]}" data-i18n="${n[1]}">${n[2]}</a>`).join('')}</div></div>
      <div><h3 data-i18n="nav.contact">Contact</h3><div class="f-links">
        <a href="${B.phoneHref}" dir="ltr" style="font-weight:800;color:#fff">☎ ${esc(B.phoneDisplay)}</a>
        <a href="${esc(waLink())}" target="_blank" rel="noopener">WhatsApp : <span dir="ltr">${esc(B.phoneDisplay)}</span></a>
        <span>${esc(I.bText(B.address))}</span>${hours}
        <a href="${mapsDir}" target="_blank" rel="noopener" data-i18n="cta.directions">Itinéraire Google Maps</a>${social ? `<span>${social}</span>` : ''}</div></div></div>
      <div class="f-bottom"><span>© ${new Date().getFullYear()} Chaâlal Aziz — Location de voiture</span><span data-i18n="foot.rights">Réservation par téléphone uniquement.</span></div></div></footer>
      <a class="wa-float" href="${esc(waLink(t('wa.general')))}" target="_blank" rel="noopener" data-i18n-attr="aria-label:cta.wa" aria-label="WhatsApp">${ICON.wa}</a>
      <div class="call-bar" role="region" data-i18n-attr="aria-label:aria.callbar" aria-label="Contact rapide">${btnCall('', '')}${btnWa('', t('wa.general'))}</div>`;
    // text inside buttons that are rebuilt on language change is handled by rerender()
  }

  /* ---------- page: home ---------- */
  function initHome() {
    const hero = $('.hero');
    if (B.heroImage) { hero.classList.add('has-photo'); $('.hero-bg').style.backgroundImage = `url("${B.heroImage}")`; }
    $('#featuredGrid').innerHTML = V.filter(v => v.featured).slice(0, 3).map(card).join('') || V.slice(0, 3).map(card).join('');
    $('#rep-link').href = mapsPlace;
    $('#reviewsGrid').innerHTML = (window.REVIEWS || []).map(r => `<figure class="review"><div class="stars" role="img" aria-label="${esc(r.rating)}/5">${'★'.repeat(r.rating)}<span class="off">${'★'.repeat(5 - r.rating)}</span></div><blockquote lang="ar" dir="rtl">${esc(r.text)}</blockquote><figcaption dir="ltr">${esc(r.author)} · Google</figcaption></figure>`).join('');
    $('#directions').href = mapsDir;
    $('#mapFrame').src = mapsEmbed;
    $('#c-phone').href = B.phoneHref; $('#c-phone').textContent = B.phoneDisplay;
    $('#c-wa').href = waLink(t('wa.general')); $('#c-wa').textContent = B.phoneDisplay;
    $('#c-addr').textContent = I.bText(B.address);
    $('#c-hours').textContent = B.openingHours ? I.bText(B.openingHours) : '';
    $('#c-hours-row').hidden = !B.openingHours;
    $('#c-hours-call').hidden = !!B.openingHours;
    $('#heroCall').href = B.phoneHref;
    $('#cardCall').href = B.phoneHref;
    $('#repCall').href = B.phoneHref;
    $('#contactCall').href = B.phoneHref; $('#contactWa').href = waLink(t('wa.general'));
  }

  /* ---------- page: catalogue ---------- */
  function initCatalogue() {
    const st = { q: '', cat: 'all', trans: 'all', min: '', max: '', avail: 'all' };
    const hasPrice = V.some(v => v.price != null), hasAvail = V.some(v => v.available != null);
    const grid = $('#catalogGrid'), count = $('#count');
    const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    function filtered() {
      const q = norm(st.q.trim());
      return V.filter(v => {
        if (q && !norm([v.name, v.nameAr, v.brand, v.model].join(' ')).includes(q)) return false;
        if (st.cat !== 'all' && v.cat !== st.cat) return false;
        if (st.trans !== 'all' && v.trans !== st.trans) return false;
        const min = st.min === '' ? null : Number(st.min), max = st.max === '' ? null : Number(st.max);
        if (min != null && !isNaN(min) && (v.price == null || v.price < min)) return false;
        if (max != null && !isNaN(max) && (v.price == null || v.price > max)) return false;
        if (st.avail === 'yes' && v.available !== true) return false;
        if (st.avail === 'no' && v.available !== false) return false;
        return true;
      });
    }
    function draw() {
      const list = filtered();
      count.textContent = t('filter.count', { n: list.length });
      grid.innerHTML = list.length ? list.map(card).join('') : `<div class="empty" style="grid-column:1/-1">${t('filter.empty')}</div>`;
    }
    function buildFilters() {
      const cats = ['citadine', 'berline', 'suv', 'utilitaire'];
      $('#filters').innerHTML = `
        <div class="field"><label for="f-q">${t('filter.search')}</label><input id="f-q" type="search" maxlength="60" placeholder="${esc(t('filter.searchPh'))}" value="${esc(st.q)}"></div>
        <div class="field"><label for="f-cat">${t('filter.cat')}</label><select id="f-cat"><option value="all">${t('cat.all')}</option>${cats.map(c => `<option value="${c}" ${st.cat === c ? 'selected' : ''}>${t('cat.' + c)}</option>`).join('')}</select></div>
        <div class="field"><label for="f-trans">${t('filter.trans')}</label><select id="f-trans"><option value="all">${t('filter.transAll')}</option><option value="manual" ${st.trans === 'manual' ? 'selected' : ''}>${t('trans.manual')}</option><option value="auto" ${st.trans === 'auto' ? 'selected' : ''}>${t('trans.auto')}</option></select></div>
        <div class="field"><label for="f-min">${t('filter.price')}</label><div class="price-row"><input id="f-min" type="number" min="0" step="500" inputmode="numeric" placeholder="${esc(t('filter.min'))}" value="${esc(st.min)}" ${hasPrice ? '' : 'disabled'}><input id="f-max" type="number" min="0" step="500" inputmode="numeric" placeholder="${esc(t('filter.max'))}" value="${esc(st.max)}" ${hasPrice ? '' : 'disabled'}></div>${hasPrice ? '' : `<div class="hint">${t('filter.priceNone')}</div>`}</div>
        ${hasAvail ? `<div class="field"><label for="f-av">${t('filter.avail')}</label><select id="f-av"><option value="all">${t('filter.availAll')}</option><option value="yes" ${st.avail === 'yes' ? 'selected' : ''}>${t('filter.availYes')}</option><option value="no" ${st.avail === 'no' ? 'selected' : ''}>${t('filter.availNo')}</option></select></div>` : ''}
        <div class="field"><button type="button" class="link-btn" id="f-reset">${t('filter.reset')}</button></div>`;
      const on = (id, key, ev) => { const e = $(id); if (e) e.addEventListener(ev || 'input', () => { st[key] = e.value; draw(); }); };
      on('#f-q', 'q'); on('#f-cat', 'cat', 'change'); on('#f-trans', 'trans', 'change'); on('#f-min', 'min'); on('#f-max', 'max'); on('#f-av', 'avail', 'change');
      $('#f-reset').addEventListener('click', () => { Object.assign(st, { q: '', cat: 'all', trans: 'all', min: '', max: '', avail: 'all' }); buildFilters(); draw(); });
    }
    const p = new URLSearchParams(location.search); if (p.get('cat')) st.cat = p.get('cat');
    buildFilters(); draw();
    document.addEventListener('langchange', () => { buildFilters(); draw(); });
  }

  /* ---------- page: vehicle details ---------- */
  function initDetail() {
    const id = new URLSearchParams(location.search).get('id');
    const v = V.find(x => x.id === id);
    const root = $('#detail');
    function draw() {
      if (!v) { root.innerHTML = `<div class="empty">${t('detail.notFound')}<p style="margin-top:14px"><a class="btn btn-outline" href="catalogue.html">${t('cta.backCatalogue')}</a></p></div>`; return; }
      const name = I.vName(v);
      document.title = name + ' — ' + (I.lang === 'ar' ? 'تأجير سيارات شعلال عزيز، بوإسماعيل' : 'Location de voiture Chaâlal Aziz, Bou Ismaïl');
      const metaD = $('meta[name="description"]'); if (metaD) metaD.content = name + ' — ' + I.vDesc(v);
      const imgs = (v.images && v.images.length) ? v.images : [null];
      const rows = [['spec.model', v.model], ['spec.year', v.year], ['spec.cat', t('cat.' + v.cat)], ['spec.trans', t('trans.' + v.trans)], ['spec.fuel', t('fuel.' + v.fuel)], ['spec.seats', v.seats]]
        .filter(r => r[1] != null && r[1] !== '').map(r => `<tr><th>${t(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('');
      const similar = V.filter(x => x.id !== v.id).sort((a, b) => (b.cat === v.cat) - (a.cat === v.cat)).slice(0, 3);
      root.innerHTML = `
        <div class="crumbs"><a href="catalogue.html">${t('cta.backCatalogue')}</a></div>
        <div class="detail">
          <div><div class="gallery-main" id="gMain">${vImg(v, 0, false)}<div class="v-badges">${availBadge(v)}</div></div>
            ${imgs.length > 1 ? `<div class="thumbs" role="group" aria-label="${esc(t('aria.gallery'))}">${imgs.map((s, i) => `<button type="button" data-i="${i}" aria-current="${i === 0}" aria-label="${esc(name)} ${i + 1}"><img src="${esc(s)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}</div>
          <div><h1>${esc(name)}</h1>
            ${v.price != null ? `<div class="price-big">${num(v.price)} DA <small>${t('price.perDay')}</small></div>` : `<div class="v-price call">${t('price.call')}</div>`}
            ${v.available == null ? `<div class="v-sub" style="margin-top:4px">${t('badge.check')}</div>` : ''}
            <h2>${t('detail.specs')}</h2><table class="spec-table">${rows}</table>
            ${I.vDesc(v) ? `<h2>${t('detail.desc')}</h2><p>${esc(I.vDesc(v))}</p>` : ''}
            <h2>${t('detail.conditions')}</h2><p>${v.conditions ? esc(I.bText(v.conditions)) : t('detail.condCall')}</p>
            ${v.demo ? `<p class="v-sub" style="margin-top:12px">⚠ ${t('demo.note')}</p>` : ''}
            <div class="call-note" style="margin-top:20px">${t('msg.interested')}</div>
            <div class="btns">${btnCall('btn-lg btn-block')}${btnWa('btn-block', waVehicleText(v))}</div></div>
        </div>
        <section style="padding-bottom:50px"><div class="sec-head"><h2 style="font-size:1.5rem;color:var(--navy)">${t('detail.similar')}</h2></div><div class="grid-v">${similar.map(card).join('')}</div></section>`;
      const gm = $('#gMain');
      root.querySelectorAll('.thumbs button').forEach(b => b.addEventListener('click', () => {
        root.querySelectorAll('.thumbs button').forEach(x => x.setAttribute('aria-current', 'false')); b.setAttribute('aria-current', 'true');
        gm.querySelector('img,svg').replaceWith(document.createRange().createContextualFragment(vImg(v, +b.dataset.i, false)));
      }));
    }
    draw(); document.addEventListener('langchange', draw);
  }

  /* ---------- boot ---------- */
  function boot() {
    renderHeader(); renderFooter();
    if (page === 'home') initHome();
    if (page === 'catalogue') initCatalogue();
    if (page === 'detail') initDetail();
    I.applyStatic();
    // Rebuild JS-rendered, language-dependent pieces
    document.addEventListener('langchange', () => {
      renderHeader(); renderFooter(); I.applyStatic();
      if (page === 'home') initHome();
      $('#langToggle').textContent = t('lang.switch');
    });
    $('#langToggle').textContent = t('lang.switch');
  }
  boot();
})();
