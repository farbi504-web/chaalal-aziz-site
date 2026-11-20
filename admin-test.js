const { chromium } = require('playwright'); const fs=require('fs'); const JSZip=require('/opt/npm-tools/node_modules/jszip');
const B='http://localhost:8765/'; const R=[]; const ok=(n,c,x='')=>R.push([c?'PASS':'FAIL',n,x]);
(async()=>{
 const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1280,height:900},acceptDownloads:true}); const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error'&&!/ERR_|Failed to load/.test(m.text()))errs.push(m.text())});
 await p.route('**/cdnjs.cloudflare.com/**/jszip.min.js', r=>r.fulfill({path:'/opt/npm-tools/node_modules/jszip/dist/jszip.min.js',contentType:'application/javascript'}));
 await p.goto(B+'admin.html');
 ok('Admin loads, lists 6 demo vehicles', (await p.$$('.tbl tbody tr')).length===6);
 // add vehicle with validation
 await p.click('[data-act=add-v]'); await p.click('[data-act=save-v]');
 ok('Validation blocks empty name', (await p.innerText('#formErr')).includes('الاسم الفرنسي'));
 await p.fill('#v-name','Skoda Fabia'); await p.fill('#v-nameAr','سكودا فابيا'); await p.fill('#v-year','2021'); await p.fill('#v-price','5000'); await p.selectOption('#v-avail','1');
 await p.fill('#v-seats','0'); await p.click('[data-act=save-v]'); ok('Validation blocks seats=0', (await p.innerText('#formErr')).includes('المقاعد'));
 await p.fill('#v-seats','5'); await p.setInputFiles('#v-file','/tmp/claude-0/shots/test.jpg'); await p.waitForSelector('.imgs img');
 ok('Photo upload keeps typed name', (await p.inputValue('#v-name'))==='Skoda Fabia');
 await p.check('#v-featured'); await p.click('[data-act=save-v]');
 ok('Vehicle added (7 rows)', (await p.$$('.tbl tbody tr')).length===7);
 // delete demo vehicle (2-step)
 await p.click('[data-act=del-v][data-i="0"]'); ok('Delete needs confirmation', !!(await p.$('[data-act=del-v-ok]'))); await p.click('[data-act=del-v-ok]');
 ok('Vehicle deleted (6 rows)', (await p.$$('.tbl tbody tr')).length===6);
 // edit business
 await p.click('[data-tab=business]'); await p.fill('#b-phoneDisplay','0661 00 00 00'); await p.fill('#b-phoneIntl','+213661000000'); await p.fill('#b-wa','213661000000'); await p.fill('#b-hoursFr','Tous les jours 8h-19h'); await p.fill('#b-hoursAr','كل يوم 8-19');
 await p.fill('#b-fb','javascript:alert(1)'); await p.click('[data-act=save-b]'); ok('Rejects non-http social link', (await p.innerText('#formErr')).includes('https://'));
 await p.fill('#b-fb','https://facebook.com/x'); await p.click('[data-act=save-b]'); ok('Business saved', (await p.innerText('#view')).includes('تم حفظ'));
 // review
 await p.click('[data-tab=reviews]'); await p.click('[data-act=add-r]'); await p.fill('#r-author','Test <b>X</b>'); await p.fill('#r-text','نص <img src=x onerror=alert(1)>'); await p.click('[data-act=save-r]');
 ok('Review added, HTML escaped', (await p.$$('.tbl tbody tr')).length===7 && !(await p.$('.tbl img[src="x"]')));
 // persists + public site reflects
 await p.reload(); ok('Draft persists after reload', (await p.innerText('#status')).includes('مسودة'));
 const s = await ctx.newPage(); s.on('pageerror',e=>errs.push('site '+e.message));
 await s.goto(B+'index.html'); await s.waitForSelector('#featuredGrid .v-card');
 ok('Site shows new phone', (await s.innerText('footer')).includes('0661 00 00 00') && await s.$eval('.header-phone',a=>a.href==='tel:+213661000000'));
 ok('Site shows draft badge', !!(await s.$('a[href="admin.html"]')));
 await s.goto(B+'catalogue.html'); ok('Catalogue: 6 vehicles incl. Skoda with photo + price', (await s.$$('#catalogGrid .v-card')).length===6 && (await s.innerText('#catalogGrid')).includes('Skoda') && (await s.innerText('#catalogGrid')).includes('5 000') && !!(await s.$('#catalogGrid img')));
 await s.selectOption('#f-cat','citadine'); await s.goto(B+'catalogue.html'); ok('Price filter enabled now', !(await s.$eval('#f-min',e=>e.disabled)));
 await s.fill('#f-min','4000'); ok('Price filter works', (await s.$$('#catalogGrid .v-card')).length===1);
 await s.goto(B+'index.html'); ok('Reviews on site (7) with no injected img', (await s.$$('#reviewsGrid .review')).length===7 && !(await s.$('#reviewsGrid img')));
 // export
 await p.click('[data-tab=publish]'); const [dl]=await Promise.all([p.waitForEvent('download'),p.click('[data-act=export-zip]')]); const path=await dl.path(); const z=await JSZip.loadAsync(fs.readFileSync(path));
 const names=Object.keys(z.files); ok('ZIP has js/data.js + vehicle image', names.includes('js/data.js') && names.some(n=>/^assets\/vehicles\/skoda-fabia-1\.jpg$/.test(n)), names.join(','));
 const js=await z.file('js/data.js').async('string'); const w={}; new Function('window',js)(w);
 ok('data.js valid, image path (not base64), new phone', w.VEHICLES.some(v=>v.id==='skoda-fabia'&&v.images[0]==='assets/vehicles/skoda-fabia-1.jpg') && !js.includes('data:image') && w.BUSINESS.whatsappHref==='https://wa.me/213661000000' && w.REVIEWS.length===7);
 // reset
 await p.click('[data-act=reset]'); await p.click('[data-act=reset-ok]'); await p.click('[data-tab=vehicles]'); ok('Reset restores published data', (await p.$$('.tbl tbody tr')).length===6 && (await p.innerText('#status')).includes('مطابق'));
 // mobile
 const m=await br.newContext({viewport:{width:390,height:800}}); const mp=await m.newPage(); await mp.goto(B+'admin.html'); await mp.click('[data-act=edit-v][data-i="0"]');
 ok('Admin mobile: no horizontal overflow (form)', await mp.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
 await mp.screenshot({path:'/tmp/claude-0/shots/admin-mobile.png'}); await p.click('[data-tab=vehicles]'); await p.screenshot({path:'/tmp/claude-0/shots/admin.png'});
 ok('No JS errors', errs.length===0, errs.join('|'));
 R.forEach(r=>console.log(r.join(' | '))); console.log('FAILS',R.filter(r=>r[0]==='FAIL').length); await br.close();
})();
