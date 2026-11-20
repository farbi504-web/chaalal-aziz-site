/* Loaded on public pages after data.js. If the owner edited data in admin.html
   on THIS browser, a draft exists and is previewed here. Visitors never have one. */
(function () {
  try {
    const d = JSON.parse(localStorage.getItem('caz_draft') || 'null');
    if (!d || !d.business || !Array.isArray(d.vehicles)) return;
    Object.assign(window.BUSINESS, d.business);
    window.VEHICLES = d.vehicles; window.REVIEWS = d.reviews || [];
    document.addEventListener('DOMContentLoaded', () => {
      const a = document.createElement('a');
      a.href = 'admin.html'; a.textContent = 'Brouillon admin (non publié) · مسودة غير منشورة';
      a.style.cssText = 'position:fixed;top:calc(var(--header-h,70px) + 8px);inset-inline-start:8px;z-index:1200;background:#C8202A;color:#fff;padding:6px 12px;border-radius:999px;font:700 12px/1.3 system-ui,sans-serif;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.25)';
      document.body.appendChild(a);
    });
  } catch (e) {}
})();
