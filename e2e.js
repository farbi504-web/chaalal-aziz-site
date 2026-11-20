const { chromium, devices } = require('playwright');
const B = 'http://localhost:8765/';
const results = []; const ok = (n, c, extra='') => { results.push([c?'PASS':'FAIL', n, extra]); };
(async () => {
  const br = await chromium.launch();
  const errors = [];
  async function ctx(opts){ const c = await br.newContext(opts); const p = await c.newPage();
    p.on('pageerror', e => errors.push('pageerror: '+e.message));
    p.on('console', m => { if (m.type()==='error' && !/fonts\.g|ERR_|Failed to load resource/.test(m.text()+m.location().url)) errors.push('console: '+m.text()); });
    p.on('requestfailed', r => { const u=r.url(); if(!/fonts\.g|google\.com\/maps/.test(u)) errors.push('reqfail '+u); });
    return p; }
  const p = await ctx({ viewport:{width:1366,height:800} });
  await p.goto(B+'index.html'); await p.waitForLoadState('load');
  ok('Homepage loads', (await p.title()).includes('Chaâlal Aziz'));
  ok('Logo loaded (naturalWidth>0)', await p.$eval('.logo-link img', i => i.naturalWidth>0));
  ok('Header phone tel link', await p.$eval('.header-phone', a => a.getAttribute('href')==='tel:+213550496905'));
  const html = await p.content();
  ok('No booking forms/date inputs', !(await p.$('input[type=date]')) && !/submitBooking|bookingModal|CAZ-/.test(html));
  ok('Hero call CTA', await p.$eval('#heroCall', a => a.href==='tel:+213550496905' && /Appeler pour réserver/.test(a.textContent)));
  ok('WhatsApp links use wa.me/213550496905', await p.$$eval('a[href*="wa.me"]', as => as.length>=3 && as.every(a=>a.href.startsWith('https://wa.me/213550496905'))));
  ok('Directions link is Google Maps dir', await p.$eval('#directions', a => a.href.startsWith('https://www.google.com/maps/dir/')));
  ok('Featured cards = 3 with call + details + WA', await p.$$eval('#featuredGrid .v-card', cs => cs.length===3 && cs.every(c => c.querySelector('a[href="tel:+213550496905"]') && c.querySelector('a[href^="vehicule.html?id="]') && c.querySelector('a[href^="https://wa.me/"]'))));
  ok('No old fake reviews / 7j/7 claims', !/Karim B\.|Sofiane M|7j\/7/i.test(await p.innerText('body')));
  ok('6 real Google reviews shown, RTL Arabic text', await p.$$eval('#reviewsGrid .review', rs => rs.length===6 && rs.every(r=>r.querySelector('blockquote').dir==='rtl')));
  ok('Footer has phone', await p.$eval('footer', f => f.innerText.includes('0550 49 69 05')));
  ok('SEO meta (desc, og:title, canonical, JSON-LD)', !!(await p.$('meta[name=description]')) && !!(await p.$('meta[property="og:title"]')) && !!(await p.$('link[rel=canonical]')) && !!(await p.$('script[type="application/ld+json"]')));
  // nav links
  const hrefs = await p.$$eval('nav.main-nav a', as => as.map(a=>a.getAttribute('href')));
  let navOk = true; for (const h of hrefs) { const u = h.split('#')[0]; const r = await p.request.get(B+u); if (r.status()!==200) navOk=false; if (h.includes('#')) { const id=h.split('#')[1]; if(u==='index.html' && !(await p.$('#'+id))) navOk=false; } }
  ok('Nav links resolve ('+hrefs.length+')', navOk);
  ok('FAQ section removed', !(await p.$('#faq')) && !(await p.$('#faqList')));
  // language
  await p.click('#langToggle');
  ok('AR: dir=rtl, lang=ar', await p.evaluate(()=>document.documentElement.dir==='rtl' && document.documentElement.lang==='ar'));
  ok('AR: hero CTA translated', (await p.innerText('#heroCall')).includes('اتصل للحجز'));
  ok('AR: cards translated', (await p.innerText('#featuredGrid')).includes('رينو'));
  const arText = await p.innerText('main');
  ok('AR: no leftover French UI in sections', !/Pourquoi choisir|Questions fréquentes|Réserver par téléphone/.test(arText));
  await p.screenshot({path:'/tmp/claude-0/shots/home-ar.png', fullPage:true});
  ok('AR: no horizontal overflow', await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  await p.click('#langToggle');
  ok('FR restored', await p.evaluate(()=>document.documentElement.dir==='ltr') && (await p.innerText('#heroCall')).includes('Appeler'));
  await p.screenshot({path:'/tmp/claude-0/shots/home-fr.png', fullPage:true});

  // catalogue
  await p.goto(B+'catalogue.html');
  ok('Catalogue shows 6 vehicles', (await p.$$('#catalogGrid .v-card')).length===6);
  await p.fill('#f-q','clio'); ok('Search "clio" -> 1', (await p.$$('#catalogGrid .v-card')).length===1);
  await p.fill('#f-q','tucsön'.replace('ö','o')); ok('Search "tucson" -> 1', (await p.$$('#catalogGrid .v-card')).length===1);
  await p.fill('#f-q','xyz'); ok('Empty state', (await p.innerText('#catalogGrid')).includes('Aucun véhicule'));
  await p.click('#f-reset'); await p.selectOption('#f-cat','suv'); ok('Category SUV -> 2', (await p.$$('#catalogGrid .v-card')).length===2);
  await p.selectOption('#f-trans','manual'); ok('SUV+manual -> 0', (await p.$$('#catalogGrid .v-card')).length===0);
  await p.click('#f-reset'); await p.selectOption('#f-trans','auto'); ok('Auto -> 2', (await p.$$('#catalogGrid .v-card')).length===2);
  ok('Price filter disabled when no verified price', await p.$eval('#f-min', e=>e.disabled));
  ok('Availability filter hidden (no data)', !(await p.$('#f-av')));
  await p.click('#f-reset');
  // vehicle details
  await p.click('#catalogGrid .v-card:first-child .btn-outline');
  await p.waitForSelector('.detail h1');
  ok('Detail page opens', (await p.innerText('.detail h1')).includes('Renault Clio'));
  ok('Detail: call + WhatsApp (prefilled) + specs + similar', await p.evaluate(()=>!!document.querySelector('.detail a[href="tel:+213550496905"]') && !!document.querySelector('.detail a[href*="wa.me/213550496905?text="]') && document.querySelectorAll('.spec-table tr').length>=5 && document.querySelectorAll('#detail .grid-v .v-card').length===3));
  ok('Detail: demo flag + price on call', (await p.innerText('#detail')).includes('Démo') && (await p.innerText('#detail')).includes('Tarif : nous appeler'));
  await p.screenshot({path:'/tmp/claude-0/shots/detail-fr.png', fullPage:true});
  await p.click('#langToggle'); ok('Detail AR translated', (await p.innerText('.detail h1')).includes('رينو') && (await p.innerText('#detail')).includes('السعر: اتصل بنا'));
  await p.click('#langToggle');
  await p.goto(B+'vehicule.html?id=nope'); ok('Unknown vehicle handled', (await p.innerText('#detail')).includes('introuvable'));
  await p.goto(B+'vehicule.html?id=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E'); ok('XSS id not rendered as HTML', !(await p.$('#detail img[src="x"]')));
  // every vehicle detail + every image
  const ids = await (async()=>{await p.goto(B+'catalogue.html'); return p.evaluate(()=>window.VEHICLES.map(v=>v.id));})();
  let allDet = true; for (const id of ids){ await p.goto(B+'vehicule.html?id='+id); if(!(await p.$('.detail h1'))) allDet=false; }
  ok('All '+ids.length+' vehicle detail pages render', allDet);
  // mobile
  for (const [name, dev] of [['iphone', devices['iPhone 13']], ['android', devices['Pixel 5']]]) {
    const m = await ctx({ ...dev });
    for (const [pg, sel] of [['index.html','#heroCall'],['catalogue.html','#catalogGrid .v-card'],['vehicule.html?id=kia-sportage','.detail h1']]) {
      await m.goto(B+pg); await m.waitForSelector(sel);
      ok(`${name} ${pg}: no horizontal overflow`, await m.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
    }
    await m.goto(B+'index.html');
    ok(`${name}: fixed call bar visible`, await m.$eval('.call-bar', e=>getComputedStyle(e).display!=='none' && getComputedStyle(e).position==='fixed' ));
    await m.click('#menuToggle'); ok(`${name}: mobile menu opens`, await m.$eval('#mobileNav', e=>e.classList.contains('open')));
    await m.screenshot({path:`/tmp/claude-0/shots/${name}-menu.png`});
    await m.click('#mobileNav a.link:nth-child(2)'); await m.waitForURL(/catalogue/);
    await m.goto(B+'index.html'); await m.click('#langToggle');
    ok(`${name} AR: no overflow`, await m.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
    await m.screenshot({path:`/tmp/claude-0/shots/${name}-home-ar.png`, fullPage:true});
    await m.close();
  }
  ok('No JS/console errors or failed local requests', errors.length===0, errors.join(' | '));
  for (const r of results) console.log(r.join(' | '));
  console.log('FAILS:', results.filter(r=>r[0]==='FAIL').length);
  await br.close();
})();
