const { chromium } = require('playwright');
const base = 'http://127.0.0.1:8765/';
const failures = [];
const checks = [];
const check = (name, ok, detail = '') => {
  checks.push({ name, ok: !!ok, detail });
  if (!ok) failures.push(name + (detail ? ': ' + detail : ''));
};

(async () => {
  // Verify the live Supabase public-read policy and that anonymous clients cannot update content.
  const supabaseUrl = 'https://dnpejlvzcefollynnixy.supabase.co';
  const publishableKey = 'sb_publishable_94yxuQMMiyWmjUwjgU3tuA_UOijez7q';
  const restUrl = supabaseUrl + '/rest/v1/site_content?id=eq.1&select=id,content';
  const headers = { apikey: publishableKey, Authorization: 'Bearer ' + publishableKey };
  let sharedRows = [];
  try {
    const read = await fetch(restUrl, { headers });
    check('Supabase anonymous read policy responds', read.ok, 'HTTP ' + read.status);
    if (read.ok) sharedRows = await read.json();
    check('Supabase shared singleton row exists', Array.isArray(sharedRows) && sharedRows.some(row => row.id === 1));
    if (Array.isArray(sharedRows) && sharedRows.length) {
      const denied = await fetch(restUrl, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify({ content: sharedRows[0].content })
      });
      const responseText = await denied.text();
      let responseRows = [];
      try { responseRows = responseText ? JSON.parse(responseText) : []; } catch {}
      check('Supabase blocks anonymous content updates',
        [401, 403].includes(denied.status) || (denied.ok && Array.isArray(responseRows) && responseRows.length === 0),
        'HTTP ' + denied.status);
    } else {
      check('Supabase blocks anonymous content updates', false, 'Cannot test without singleton row');
    }
  } catch (error) {
    check('Supabase public access and RLS checks', false, error.message);
  }

  const browser = await chromium.launch({ headless: true });
  const widths = [320, 360, 390, 768, 1024, 1366];
  const routes = [
    ['home', 'index.html', '.hero'],
    ['catalogue', 'catalogue.html', '#catalogGrid'],
    ['vehicle', 'vehicule.html?id=renault-clio', '#detail'],
    ['admin', 'admin.html', '#ownerLogin']
  ];

  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const pageErrors = [];
    const localErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));
    page.on('response', response => {
      try {
        if (new URL(response.url()).origin === new URL(base).origin && response.status() >= 400) {
          localErrors.push(response.status() + ' ' + response.url());
        }
      } catch {}
    });

    for (const [label, path, selector] of routes) {
      await page.goto(base + path, { waitUntil: 'load' });
      await page.waitForSelector(selector);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      const docWidth = overflow ? await page.evaluate(() => document.documentElement.scrollWidth) : '';
      check(width + 'px ' + label + ': no horizontal overflow', !overflow, overflow ? 'document width ' + docWidth : '');
      check(width + 'px ' + label + ': no page JavaScript errors', pageErrors.length === 0, pageErrors.join(' | '));
    }

    await page.goto(base + 'index.html', { waitUntil: 'load' });
    if (width <= 980) {
      await page.waitForSelector('#menuToggle', { state: 'visible', timeout: 20000 });
      const menu = await page.$('#menuToggle');
      check(width + 'px mobile navigation control exists', !!menu);
      if (menu) {
        await menu.click();
        check(width + 'px mobile navigation opens', await page.$eval('#mobileNav', e => e.classList.contains('open')));
      }
    }
    if (width <= 768) {
      await page.waitForSelector('.call-bar a[href^="tel:"], .call-bar a[href*="wa.me"]', { timeout: 10000 });
      check(width + 'px quick contact links exist', !!(await page.$('.call-bar a[href^="tel:"], .call-bar a[href*="wa.me"]')));
    }
    await page.click('#langToggle');
    check(width + 'px Arabic layout remains within viewport',
      await page.evaluate(() => document.documentElement.dir === 'rtl' && document.documentElement.scrollWidth <= window.innerWidth + 1));

    await page.goto(base + 'admin.html', { waitUntil: 'load' });
    await page.waitForSelector('#ownerLogin', { timeout: 20000 });
    check(width + 'px owner login form renders', (await page.$('#ownerLogin input[name="username"], #ownerLogin input[name="password"]')).length === 2);
    check(width + 'px dashboard has no page overflow',
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    check(width + 'px dashboard has no JavaScript errors', pageErrors.length === 0, pageErrors.join(' | '));
    check(width + 'px no missing local assets', localErrors.length === 0, localErrors.join(' | '));
    await context.close();
  }

  await browser.close();
  for (const c of checks) console.log((c.ok ? 'PASS' : 'FAIL') + ' | ' + c.name + (c.detail ? ' | ' + c.detail : ''));
  console.log('TOTAL: ' + checks.length + ' | PASSED: ' + (checks.length - failures.length) + ' | FAILED: ' + failures.length);
  if (failures.length) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
