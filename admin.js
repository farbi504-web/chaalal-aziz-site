(async function () {
  'use strict';
  const SUPABASE_URL = "https://dnpejlvzcefollynnixy.supabase.co";
  const SUPABASE_KEY = "sb_publishable_94yxuQMMiyWmjUwjgU3tuA_UOijez7q";
  const OWNER_ID = "e9598f29-ba5b-4360-a315-ac48671ff34c";
  const OWNER_EMAIL = 'aziz@gmail.com';
  const cloud = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  let authSession = null;
  try {
    const auth = await cloud.auth.getSession();
    authSession = auth.data && auth.data.session;
  } catch (error) {}
  if (!authSession || authSession.user.id !== OWNER_ID) {
    document.body.innerHTML = '<main style="max-width:420px;margin:10vh auto;padding:28px;font-family:system-ui;background:#fff;border-radius:18px;box-shadow:0 12px 40px #071d3520;direction:rtl"><h1 style="color:#071D35">دخول المالك</h1><p>سجّل الدخول لإدارة موقع CHAÂLAL AZIZ.</p><form id="ownerLogin"><label>اسم المستخدم<input name="username" autocomplete="username" required value="aziz" style="display:block;width:100%;padding:12px;margin:8px 0 16px;box-sizing:border-box"></label><label>كلمة المرور<input name="password" type="password" autocomplete="current-password" required style="display:block;width:100%;padding:12px;margin:8px 0 16px;box-sizing:border-box"></label><button style="width:100%;padding:13px;background:#C8202A;color:#fff;border:0;border-radius:10px;font-weight:700">دخول</button><p id="loginError" role="alert" style="color:#C8202A"></p></form><a href="index.html">العودة للموقع</a></main>';
    document.getElementById('ownerLogin').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget, button = form.querySelector('button'), error = document.getElementById('loginError');
      button.disabled = true; error.textContent = 'جارٍ التحقق…';
      if (form.elements.username.value.trim().toLowerCase() !== 'aziz') { error.textContent = 'اسم المستخدم غير صحيح.'; button.disabled = false; return; }
      const result = await cloud.auth.signInWithPassword({ email: OWNER_EMAIL, password: form.elements.password.value });
      if (result.error || !result.data.user || result.data.user.id !== OWNER_ID) {
        if (result.data && result.data.session) await cloud.auth.signOut();
        error.textContent = 'تعذّر تسجيل الدخول. تحقق من كلمة المرور وحساب المالك.';
        button.disabled = false; return;
      }
      location.reload();
    });
    return;
  }
  const cloudRow = await cloud.from('site_content').select('content').eq('id', 1).maybeSingle();
  if (!cloudRow.error && cloudRow.data && cloudRow.data.content && cloudRow.data.content.business && Array.isArray(cloudRow.data.content.vehicles)) {
    window.BUSINESS = Object.assign({}, window.BUSINESS, cloudRow.data.content.business);
    window.VEHICLES = cloudRow.data.content.vehicles;
    window.REVIEWS = cloudRow.data.content.reviews || [];
  }
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const CATS = { citadine: 'سيارة مدينة (Citadine)', berline: 'سيدان (Berline)', suv: 'SUV / 4×4', utilitaire: 'نفعية (Utilitaire)' };
  const FUELS = { petrol: 'بنزين', diesel: 'ديزل', hybrid: 'هجينة', electric: 'كهربائية' };
  const KEY = 'caz_draft';

  /* ---------- state: published data (data.js) overlaid by the local draft ---------- */
  const published = { business: clone(window.BUSINESS), vehicles: clone(window.VEHICLES), reviews: clone(window.REVIEWS || []) };
  let state = clone(published), hasDraft = false;
  try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && d.business && Array.isArray(d.vehicles)) { state = { business: Object.assign(clone(published.business), d.business), vehicles: d.vehicles, reviews: d.reviews || [] }; hasDraft = true; } } catch (e) {}
  let tab = 'vehicles', editing = null /* {mode,index,data} */, msg = null, delPending = null;

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); hasDraft = true; return true; }
    catch (e) { msg = { t: 'err', m: 'تعذّر الحفظ في المتصفح (المساحة ممتلئة). احذف بعض الصور ثم أعد المحاولة.' }; return false; }
  }
  const setStatus = () => { $('#status').textContent = hasDraft ? 'مسودة محفوظة في هذا المتصفح · غير منشورة بعد' : 'مطابق للنسخة المنشورة'; };

  /* ---------- helpers ---------- */
  const num = (v, min, max) => { if (v === '' || v == null) return null; const n = Number(v); return Number.isFinite(n) && n >= min && n <= max ? n : NaN; };
  const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'vehicule';
  const uniqueId = base => { let id = base, i = 2; while (state.vehicles.some(v => v.id === id)) id = base + '-' + i++; return id; };
  const urlOk = s => !s || /^https?:\/\/[^\s]+$/i.test(s);
  function resize(file, max) {
    return new Promise((res, rej) => {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return rej(new Error('الصيغة غير مدعومة (JPG, PNG, WebP فقط)'));
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => { const k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.8)); };
      img.onerror = () => rej(new Error('تعذّر قراءة الصورة')); img.src = url;
    });
  }
  // Upload images immediately so base64 image data never fills browser localStorage.
  async function uploadDataImage(dataUrl, folder) {
    const blob = await (await fetch(dataUrl)).blob();
    const path = folder + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 10) + '.jpg';
    const result = await cloud.storage.from('site-images').upload(path, blob, {
      upsert: false, contentType: 'image/jpeg'
    });
    if (result.error) throw result.error;
    return cloud.storage.from('site-images').getPublicUrl(path).data.publicUrl;
  }
  const field = (id, label, val, o = {}) => `<div class="f ${o.full ? 'full' : ''}"><label for="${id}">${label}</label>${o.area ? `<textarea id="${id}" ${o.dir ? `dir="${o.dir}"` : ''}>${esc(val)}</textarea>` : `<input id="${id}" type="${o.type || 'text'}" value="${esc(val)}" ${o.ph ? `placeholder="${esc(o.ph)}"` : ''} ${o.dir ? `dir="${o.dir}"` : ''} ${o.attrs || ''}>`}${o.hint ? `<span class="hint">${o.hint}</span>` : ''}</div>`;
  const sel = (id, label, opts, val) => `<div class="f"><label for="${id}">${label}</label><select id="${id}">${Object.entries(opts).map(([k, v]) => `<option value="${esc(k)}" ${String(val) === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></div>`;
  const banner = () => { const m = msg; msg = null; return m ? `<div class="${m.t}" role="status">${esc(m.m)}</div>` : ''; };

  /* ---------- tabs ---------- */
  const TABS = [['vehicles', 'السيارات'], ['business', 'معلومات الوكالة'], ['reviews', 'التقييمات'], ['publish', 'نشر التعديلات']];
  function render() {
    $('#tabs').innerHTML = TABS.map(t => `<button role="tab" aria-selected="${tab === t[0]}" data-tab="${t[0]}">${t[1]}</button>`).join('');
    const v = $('#view');
    v.innerHTML = tab === 'vehicles' ? (editing ? vehicleForm() : vehicleList()) : tab === 'business' ? businessForm() : tab === 'reviews' ? (editing ? reviewForm() : reviewList()) : publishView();
    setStatus();
  }

  /* ---------- vehicles ---------- */
  function vehicleList() {
    const rows = state.vehicles.map((x, i) => `<tr>
      <td>${x.images && x.images[0] ? `<img class="thumb" src="${esc(x.images[0])}" alt="">` : '<span class="thumb"></span>'}</td>
      <td><b dir="auto">${esc(x.name)}</b><br><span class="hint" dir="auto">${esc(x.nameAr || '')}</span></td>
      <td>${esc(CATS[x.cat] || x.cat)}</td>
      <td>${x.price != null ? esc(Number(x.price).toLocaleString('fr-DZ')) + ' دج' : '—'}</td>
      <td>${x.available === true ? '<span class="pill ok">متوفرة</span>' : x.available === false ? '<span class="pill">غير متوفرة</span>' : '<span class="hint">غير محدد</span>'}</td>
      <td style="white-space:nowrap"><button class="btn sm" data-act="edit-v" data-i="${i}">تعديل</button>
        ${delPending === 'v' + i ? `<button class="btn sm danger" data-act="del-v-ok" data-i="${i}">تأكيد الحذف</button><button class="btn sm ghost" data-act="del-cancel">إلغاء</button>` : `<button class="btn sm danger" data-act="del-v" data-i="${i}">حذف</button>`}</td></tr>`).join('');
    return `${banner()}<div class="card"><div class="toolbar"><h2>السيارات (${state.vehicles.length})</h2><button class="btn red" data-act="add-v">+ إضافة سيارة</button></div>
      <div class="scroll"><table class="tbl"><thead><tr><th></th><th>السيارة</th><th>الفئة</th><th>السعر/اليوم</th><th>التوفر</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="6">لا توجد سيارات.</td></tr>'}</tbody></table></div></div>`;
  }
  const blankV = () => ({ id: '', demo: false, featured: false, name: '', nameAr: '', brand: '', model: '', year: null, cat: 'citadine', trans: 'manual', fuel: 'petrol', seats: 5, price: null, available: null, images: [], conditions: null, desc: { fr: '', ar: '' } });
  function vehicleForm() {
    const x = editing.data, c = x.conditions || { fr: '', ar: '' };
    return `${banner()}<div class="card"><h2>${editing.mode === 'new' ? 'إضافة سيارة' : 'تعديل: ' + esc(x.name)}</h2><div id="formErr"></div>
      <div class="row">
        ${field('v-name', 'الاسم (فرنسي) *', x.name, { dir: 'ltr', ph: 'Renault Clio' })}${field('v-nameAr', 'الاسم (عربي)', x.nameAr, { ph: 'رينو كليو' })}
        ${field('v-brand', 'العلامة', x.brand, { dir: 'ltr' })}${field('v-model', 'الطراز', x.model, { dir: 'ltr' })}
        ${field('v-year', 'سنة الصنع', x.year ?? '', { type: 'number', attrs: 'min="1980" max="2100"' })}
        ${sel('v-cat', 'الفئة', CATS, x.cat)}${sel('v-trans', 'ناقل الحركة', { manual: 'يدوي', auto: 'أوتوماتيك' }, x.trans)}${sel('v-fuel', 'الوقود', FUELS, x.fuel)}
        ${field('v-seats', 'عدد المقاعد *', x.seats, { type: 'number', attrs: 'min="1" max="60"' })}
        ${field('v-price', 'السعر لليوم (دج)', x.price ?? '', { type: 'number', attrs: 'min="0" step="100"', hint: 'اتركه فارغاً إن لم يكن مؤكداً' })}
        ${sel('v-avail', 'التوفر', { '': 'غير محدد (اتصل بنا)', '1': 'متوفرة', '0': 'غير متوفرة' }, x.available === true ? '1' : x.available === false ? '0' : '')}
        <div class="f chk"><input type="checkbox" id="v-featured" ${x.featured ? 'checked' : ''}><label for="v-featured">عرضها في الصفحة الرئيسية</label></div>
        ${field('v-descFr', 'الوصف (فرنسي)', x.desc.fr, { area: 1, full: 1, dir: 'ltr' })}${field('v-descAr', 'الوصف (عربي)', x.desc.ar, { area: 1, full: 1 })}
        ${field('v-condFr', 'شروط الإيجار (فرنسي)', c.fr, { area: 1, full: 1, dir: 'ltr', hint: 'اتركه فارغاً إن لم تكن مؤكدة' })}${field('v-condAr', 'شروط الإيجار (عربي)', c.ar, { area: 1, full: 1 })}
      </div>
      <h3>الصور</h3><div class="imgs">${x.images.map((s, i) => `<figure><img src="${esc(s)}" alt=""><button class="btn sm danger" data-act="rm-img" data-i="${i}">حذف</button></figure>`).join('') || '<span class="hint">لا توجد صور: سيظهر رسم بديل «الصورة قريباً».</span>'}</div>
      <div class="f" style="margin-top:10px"><label for="v-file">إضافة صور (JPG / PNG / WebP، تُصغَّر تلقائياً)</label><input id="v-file" type="file" accept="image/jpeg,image/png,image/webp" multiple></div>
      <div class="btns"><button class="btn red" data-act="save-v">حفظ</button><button class="btn ghost" data-act="cancel">إلغاء</button></div></div>`;
  }
  function readVehicleForm() {
    const g = id => $('#' + id).value.trim(), x = editing.data, errs = [];
    const name = g('v-name'); if (!name) errs.push('الاسم الفرنسي مطلوب.');
    const year = num(g('v-year'), 1980, 2100), seats = num(g('v-seats'), 1, 60), price = num(g('v-price'), 0, 100000000);
    if (Number.isNaN(year)) errs.push('سنة الصنع غير صحيحة.'); if (seats == null || Number.isNaN(seats)) errs.push('عدد المقاعد بين 1 و60.'); if (Number.isNaN(price)) errs.push('السعر غير صحيح.');
    if (errs.length) return { errs };
    const av = g('v-avail'), cf = g('v-condFr'), ca = g('v-condAr');
    Object.assign(x, { name, nameAr: g('v-nameAr'), brand: g('v-brand'), model: g('v-model'), year, cat: $('#v-cat').value, trans: $('#v-trans').value, fuel: $('#v-fuel').value, seats, price,
      available: av === '1' ? true : av === '0' ? false : null, featured: $('#v-featured').checked, demo: false,
      desc: { fr: g('v-descFr'), ar: g('v-descAr') }, conditions: cf || ca ? { fr: cf, ar: ca } : null });
    if (!x.id) x.id = uniqueId(slug(name));
    return { ok: true };
  }
  function readVehicleFormLoose() { const g = id => ($('#' + id) ? $('#' + id).value.trim() : ''), x = editing.data;
    Object.assign(x, { name: g('v-name'), nameAr: g('v-nameAr'), brand: g('v-brand'), model: g('v-model'), year: num(g('v-year'), 1980, 2100) || null, cat: $('#v-cat').value, trans: $('#v-trans').value, fuel: $('#v-fuel').value, seats: num(g('v-seats'), 1, 60) || 5, price: num(g('v-price'), 0, 1e8) || null,
      available: g('v-avail') === '1' ? true : g('v-avail') === '0' ? false : null, featured: $('#v-featured').checked, demo: false, desc: { fr: g('v-descFr'), ar: g('v-descAr') }, conditions: g('v-condFr') || g('v-condAr') ? { fr: g('v-condFr'), ar: g('v-condAr') } : null }); }

  /* ---------- business ---------- */
  function businessForm() {
    const b = state.business, h = b.openingHours || { fr: '', ar: '' };
    return `${banner()}<div class="card"><h2>معلومات الوكالة</h2><div id="formErr"></div>
      <div class="row">
        ${field('b-phoneDisplay', 'الهاتف (للعرض)', b.phoneDisplay, { dir: 'ltr' })}${field('b-phoneIntl', 'الهاتف (دولي)', b.phoneHref.replace('tel:', ''), { dir: 'ltr', hint: 'مثال: +213550496905' })}
        ${field('b-wa', 'رقم واتساب (دولي بلا +)', b.whatsappNumber, { dir: 'ltr', hint: 'مثال: 213550496905' })}
        ${field('b-addrFr', 'العنوان (فرنسي)', b.address.fr, { dir: 'ltr' })}${field('b-addrAr', 'العنوان (عربي)', b.address.ar)}
        ${field('b-hoursFr', 'ساعات العمل (فرنسي)', h.fr, { dir: 'ltr', hint: 'اتركه فارغاً إن لم تكن مؤكدة' })}${field('b-hoursAr', 'ساعات العمل (عربي)', h.ar)}
        ${field('b-fb', 'رابط فيسبوك', b.facebookUrl || '', { dir: 'ltr', ph: 'https://facebook.com/…' })}${field('b-ig', 'رابط إنستغرام', b.instagramUrl || '', { dir: 'ltr', ph: 'https://instagram.com/…' })}
        ${field('b-rating', 'تقييم Google', b.googleRating, { type: 'number', attrs: 'min="0" max="5" step="0.1"' })}${field('b-count', 'عدد تقييمات Google', b.googleReviewCount, { type: 'number', attrs: 'min="0" step="1"' })}
        ${field('b-map', 'موقع الخريطة (رمز الموقع أو العنوان)', b.mapsQuery, { dir: 'ltr', full: 1 })}
        ${field('b-site', 'عنوان الموقع (نطاقك)', b.siteUrl, { dir: 'ltr', hint: 'يُستعمل في sitemap وOpen Graph' })}
      </div>
      <h3>صورة الغلاف (Hero)</h3>${b.heroImage ? `<div class="imgs"><figure><img src="${esc(b.heroImage)}" alt=""><button class="btn sm danger" data-act="rm-hero">حذف</button></figure></div>` : '<p class="hint">لا توجد صورة: يظهر التدرج الأزرق الافتراضي.</p>'}
      <div class="f" style="margin-top:10px"><label for="b-file">رفع صورة الغلاف</label><input id="b-file" type="file" accept="image/jpeg,image/png,image/webp"></div>
      <div class="btns"><button class="btn red" data-act="save-b">حفظ</button></div></div>`;
  }
  function saveBusiness() {
    const g = id => $('#' + id).value.trim(), errs = [], b = state.business;
    const intl = g('b-phoneIntl').replace(/[\s-]/g, ''), wa = g('b-wa').replace(/[\s+-]/g, '');
    if (!g('b-phoneDisplay')) errs.push('رقم الهاتف مطلوب.'); if (!/^\+\d{8,15}$/.test(intl)) errs.push('الهاتف الدولي يبدأ بـ + ثم 8–15 رقماً.'); if (!/^\d{8,15}$/.test(wa)) errs.push('رقم واتساب أرقام فقط (8–15).');
    if (!urlOk(g('b-fb')) || !urlOk(g('b-ig'))) errs.push('روابط التواصل يجب أن تبدأ بـ https://');
    const rating = num(g('b-rating'), 0, 5), count = num(g('b-count'), 0, 1e7); if (rating == null || Number.isNaN(rating)) errs.push('التقييم بين 0 و5.'); if (count == null || Number.isNaN(count)) errs.push('عدد التقييمات غير صحيح.');
    if (errs.length) return errs;
    const hf = g('b-hoursFr'), ha = g('b-hoursAr');
    Object.assign(b, { phoneDisplay: g('b-phoneDisplay'), phoneHref: 'tel:' + intl, whatsappNumber: wa, whatsappHref: 'https://wa.me/' + wa, address: { fr: g('b-addrFr'), ar: g('b-addrAr') }, openingHours: hf || ha ? { fr: hf, ar: ha } : null,
      facebookUrl: g('b-fb') || null, instagramUrl: g('b-ig') || null, googleRating: rating, googleReviewCount: count, mapsQuery: g('b-map'), siteUrl: g('b-site') || b.siteUrl });
    return [];
  }

  /* ---------- reviews ---------- */
  function reviewList() {
    const rows = state.reviews.map((r, i) => `<tr><td><b dir="auto">${esc(r.author)}</b></td><td>${'★'.repeat(r.rating)}</td><td dir="auto" style="max-width:420px">${esc(r.text.slice(0, 110))}${r.text.length > 110 ? '…' : ''}</td>
      <td style="white-space:nowrap"><button class="btn sm" data-act="edit-r" data-i="${i}">تعديل</button> ${delPending === 'r' + i ? `<button class="btn sm danger" data-act="del-r-ok" data-i="${i}">تأكيد الحذف</button><button class="btn sm ghost" data-act="del-cancel">إلغاء</button>` : `<button class="btn sm danger" data-act="del-r" data-i="${i}">حذف</button>`}</td></tr>`).join('');
    return `${banner()}<div class="card"><div class="toolbar"><h2>التقييمات المعروضة (${state.reviews.length})</h2><button class="btn red" data-act="add-r">+ إضافة تقييم</button></div>
      <p class="note">أضف فقط تقييمات حقيقية منشورة على Google. لا تكتب تقييمات من عندك.</p>
      <div class="scroll"><table class="tbl"><thead><tr><th>الاسم</th><th>النجوم</th><th>النص</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="4">لا توجد تقييمات.</td></tr>'}</tbody></table></div></div>`;
  }
  function reviewForm() {
    const r = editing.data;
    return `${banner()}<div class="card"><h2>${editing.mode === 'new' ? 'إضافة تقييم' : 'تعديل التقييم'}</h2><div id="formErr"></div><div class="row">
      ${field('r-author', 'اسم صاحب التقييم كما يظهر في Google *', r.author, { dir: 'auto' })}${field('r-rating', 'النجوم (1–5) *', r.rating, { type: 'number', attrs: 'min="1" max="5" step="1"' })}
      ${field('r-text', 'نص التقييم *', r.text, { area: 1, full: 1, dir: 'auto' })}</div>
      <div class="btns"><button class="btn red" data-act="save-r">حفظ</button><button class="btn ghost" data-act="cancel">إلغاء</button></div></div>`;
  }

  /* ---------- publish ---------- */
  function publishView() {
    return `${banner()}<div class="card"><h2>نشر التعديلات للزوار</h2>
      <p class="note">المسودة الحالية محفوظة في هذا المتصفح. عند النشر تُحفظ البيانات والصور في Supabase لتظهر لجميع الزوار.</p>
      <p class="hint">السيارات: ${state.vehicles.length} · التقييمات: ${state.reviews.length}</p>
      <div class="btns"><button class="btn red" data-act="publish-cloud">نشر التعديلات الآن</button></div>
    </div>`;
  }
  async function publishCloud() {
    const button = document.querySelector('[data-act="publish-cloud"]');
    if (button) { button.disabled = true; button.textContent = 'جارٍ النشر…'; }
    try {
      const out = clone(state);
      for (const vehicle of out.vehicles) {
        vehicle.images = await Promise.all((vehicle.images || []).map(src =>
          src && src.startsWith('data:') ? uploadDataImage(src, 'vehicles') : src));
      }
      if (out.business.heroImage && out.business.heroImage.startsWith('data:')) {
        out.business.heroImage = await uploadDataImage(out.business.heroImage, 'hero');
      }
      const saved = await cloud.from('site_content').upsert({
        id: 1, content: out, updated_at: new Date().toISOString(), updated_by: authSession.user.id
      }, { onConflict: 'id' });
      if (saved.error) throw saved.error;
      state = out; Object.assign(window.BUSINESS, out.business);
      window.VEHICLES = out.vehicles; window.REVIEWS = out.reviews;
      localStorage.removeItem(KEY); hasDraft = false;
      msg = { t: 'ok', m: 'تم النشر بنجاح. التعديلات أصبحت متاحة لجميع الزوار.' };
      tab = 'publish'; render();
    } catch (error) {
      console.error(error);
      msg = { t: 'err', m: 'تعذّر النشر: ' + (error.message || 'تحقق من الاتصال وصلاحيات Supabase.') };
      render();
    }
  }
  /* ---------- events ---------- */
  document.addEventListener('click', async e => {
    const t = e.target.closest('[data-tab],[data-act]'); if (!t) return;
    if (t.dataset.tab) { tab = t.dataset.tab; editing = null; delPending = null; return render(); }
    const a = t.dataset.act, i = +t.dataset.i, err = list => { $('#formErr').innerHTML = `<div class="err" role="alert">${list.map(esc).join('<br>')}</div>`; window.scrollTo({ top: 0, behavior: 'smooth' }); };
    if (a === 'del-cancel') { delPending = null; return render(); }
    if (a === 'cancel') { editing = null; return render(); }
    if (a === 'add-v') { editing = { mode: 'new', data: blankV() }; return render(); }
    if (a === 'edit-v') { editing = { mode: 'edit', index: i, data: clone(state.vehicles[i]) }; if (!editing.data.desc) editing.data.desc = { fr: '', ar: '' }; return render(); }
    if (a === 'del-v') { delPending = 'v' + i; return render(); }
    if (a === 'del-v-ok') { state.vehicles.splice(i, 1); delPending = null; persist(); msg = { t: 'ok', m: 'تم حذف السيارة.' }; return render(); }
    if (a === 'rm-img') { readVehicleFormLoose(); editing.data.images.splice(i, 1); return render(); }
    if (a === 'save-v') { const r = readVehicleForm(); if (r.errs) return err(r.errs);
      if (editing.mode === 'new') state.vehicles.push(editing.data); else state.vehicles[editing.index] = editing.data;
      editing = null; if (persist()) msg = { t: 'ok', m: 'تم الحفظ في المسودة.' }; return render(); }
    if (a === 'save-b') { const errs = saveBusiness(); if (errs.length) return err(errs); if (persist()) msg = { t: 'ok', m: 'تم حفظ معلومات الوكالة في المسودة.' }; return render(); }
    if (a === 'rm-hero') { state.business.heroImage = null; persist(); return render(); }
    if (a === 'add-r') { editing = { mode: 'new', data: { author: '', rating: 5, text: '' } }; return render(); }
    if (a === 'edit-r') { editing = { mode: 'edit', index: i, data: clone(state.reviews[i]) }; return render(); }
    if (a === 'del-r') { delPending = 'r' + i; return render(); }
    if (a === 'del-r-ok') { state.reviews.splice(i, 1); delPending = null; persist(); msg = { t: 'ok', m: 'تم حذف التقييم.' }; return render(); }
    if (a === 'save-r') { const r = editing.data, author = $('#r-author').value.trim(), rating = num($('#r-rating').value, 1, 5), text = $('#r-text').value.trim();
      const errs = []; if (!author) errs.push('الاسم مطلوب.'); if (rating == null || Number.isNaN(rating) || !Number.isInteger(rating)) errs.push('النجوم رقم صحيح من 1 إلى 5.'); if (!text) errs.push('نص التقييم مطلوب.'); if (errs.length) return err(errs);
      Object.assign(r, { author, rating, text }); if (editing.mode === 'new') state.reviews.push(r); else state.reviews[editing.index] = r; editing = null; if (persist()) msg = { t: 'ok', m: 'تم الحفظ.' }; return render(); }
    if (a === 'publish-cloud') { await publishCloud(); return; }
  });
  document.addEventListener('change', async e => {
    const f = e.target;
    try {
      if (f.id === 'v-file' && f.files.length) {
        readVehicleFormLoose();
        for (const file of f.files) {
          const resized = await resize(file, 1200);
          editing.data.images.push(await uploadDataImage(resized, 'vehicles'));
        }
        return render();
      }
      if (f.id === 'b-file' && f.files[0]) {
        const errors = saveBusiness();
        if (errors.length) { msg = { t: 'err', m: errors.join(' ') }; return render(); }
        const resized = await resize(f.files[0], 1920);
        state.business.heroImage = await uploadDataImage(resized, 'hero');
        persist();
        return render();
      }
    } catch (x) { msg = { t: 'err', m: x.message || 'حدث خطأ' }; render(); }
  });
  render();
})();
