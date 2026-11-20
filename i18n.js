/* Translations. Static HTML carries the French text (default + SEO);
   data-i18n="key" elements are swapped to Arabic from this dictionary. */
(function () {
  const B = window.BUSINESS;
  const dict = {
    fr: {
      'nav.home':'Accueil','nav.vehicles':'Nos véhicules','nav.how':'Comment réserver','nav.reviews':'Avis Google','nav.faq':'FAQ','nav.contact':'Contact',
      'cta.call':'Appeler pour réserver','cta.callShort':'Appeler','cta.wa':'WhatsApp','cta.details':'Voir les détails','cta.directions':'Itinéraire Google Maps',
      'cta.allVehicles':'Voir tous les véhicules','cta.backCatalogue':'← Retour au catalogue','cta.reviewsGoogle':'Voir les avis sur Google',
      'aria.menu':'Menu','aria.lang':'Changer de langue','aria.home':'Chaâlal Aziz — Accueil','aria.callbar':'Contact rapide','aria.gallery':'Galerie de photos',
      'lang.switch':'عربي',
      'badge.demo':'Démo','badge.avail':'Disponible','badge.unavail':'Indisponible','badge.check':'Disponibilité : nous appeler',
      'price.perDay':'/ jour','price.call':'Tarif : nous appeler',
      'spec.year':'Année','spec.trans':'Transmission','spec.fuel':'Carburant','spec.seats':'Places','spec.cat':'Catégorie','spec.model':'Modèle',
      'trans.manual':'Manuelle','trans.auto':'Automatique',
      'fuel.petrol':'Essence','fuel.diesel':'Diesel','fuel.hybrid':'Hybride','fuel.electric':'Électrique',
      'cat.all':'Toutes les catégories','cat.citadine':'Citadine','cat.berline':'Berline','cat.suv':'SUV / 4×4','cat.utilitaire':'Utilitaire',
      'seats.n':'{n} places',
      'photo.soon':'Photo à venir','demo.note':'Véhicule de démonstration : informations indicatives, à confirmer par l’agence.',
      'msg.interested':'Une voiture vous intéresse ? Appelez-nous pour vérifier sa disponibilité et connaître son tarif.',
      'filter.search':'Rechercher un véhicule','filter.searchPh':'Nom ou modèle…','filter.cat':'Catégorie','filter.trans':'Transmission','filter.transAll':'Toutes',
      'filter.price':'Prix par jour (DA)','filter.min':'Min','filter.max':'Max','filter.avail':'Disponibilité','filter.availAll':'Toutes','filter.availYes':'Disponibles','filter.availNo':'Indisponibles',
      'filter.priceNone':'Les tarifs sont communiqués par téléphone.','filter.reset':'Réinitialiser','filter.count':'{n} véhicule(s)',
      'filter.empty':'Aucun véhicule ne correspond à votre recherche.',
      'detail.notFound':'Véhicule introuvable.','detail.specs':'Caractéristiques','detail.desc':'Description','detail.conditions':'Conditions de location',
      'detail.condCall':'Les conditions de location vous seront précisées par téléphone.','detail.similar':'Véhicules similaires','detail.waText':'Bonjour, je suis intéressé par la {name}. Est-elle disponible ? Quel est le tarif ?',
      'wa.general':'Bonjour, je souhaite des informations sur la location de voiture.',
      'faq.a1.q':'Comment réserver une voiture ?','faq.a1.a':'La réservation se fait uniquement par téléphone. Appelez-nous au {phone} : nous vérifions la disponibilité du véhicule et vous indiquons le tarif. Vous pouvez aussi nous écrire sur WhatsApp.',
      'faq.a2.q':'Le site confirme-t-il ma réservation ?','faq.a2.a':'Non. Ce site ne propose aucune réservation en ligne. Une location n’est confirmée qu’après échange direct avec l’agence.',
      'faq.a3.q':'Comment connaître le prix et la disponibilité ?','faq.a3.a':'Les tarifs et la disponibilité varient selon le véhicule et la période. Appelez-nous ou écrivez-nous sur WhatsApp pour les obtenir.',
      'faq.a4.q':'Quels documents faut-il fournir ?','faq.a4.a':'Les documents nécessaires vous seront précisés par l’agence lors de votre appel.',
      'faq.a5.q':'Où se trouve l’agence ?','faq.a5.a':'L’agence est située à Bou Ismaïl, wilaya de Tipaza. Utilisez le bouton « Itinéraire Google Maps » pour y accéder.'
    },
    ar: {
      'nav.home':'الرئيسية','nav.vehicles':'سياراتنا','nav.how':'كيف تحجز','nav.reviews':'آراء Google','nav.faq':'الأسئلة الشائعة','nav.contact':'اتصل بنا',
      'cta.call':'اتصل للحجز','cta.callShort':'اتصل','cta.wa':'واتساب','cta.details':'عرض التفاصيل','cta.directions':'الاتجاهات على خرائط Google',
      'cta.allVehicles':'عرض كل السيارات','cta.backCatalogue':'← العودة إلى الكتالوج','cta.reviewsGoogle':'اطلع على التقييمات في Google',
      'aria.menu':'القائمة','aria.lang':'تغيير اللغة','aria.home':'شعلال عزيز — الرئيسية','aria.callbar':'اتصال سريع','aria.gallery':'معرض الصور',
      'lang.switch':'FR',
      'badge.demo':'تجريبي','badge.avail':'متوفرة','badge.unavail':'غير متوفرة','badge.check':'التوفر: اتصل بنا',
      'price.perDay':'/ اليوم','price.call':'السعر: اتصل بنا',
      'spec.year':'السنة','spec.trans':'ناقل الحركة','spec.fuel':'الوقود','spec.seats':'المقاعد','spec.cat':'الفئة','spec.model':'الطراز',
      'trans.manual':'يدوي','trans.auto':'أوتوماتيك',
      'fuel.petrol':'بنزين','fuel.diesel':'ديزل','fuel.hybrid':'هجينة','fuel.electric':'كهربائية',
      'cat.all':'كل الفئات','cat.citadine':'سيارة مدينة','cat.berline':'سيدان','cat.suv':'SUV / 4×4','cat.utilitaire':'سيارة نفعية',
      'seats.n':'{n} مقاعد',
      'photo.soon':'الصورة قريباً','demo.note':'سيارة تجريبية: المعلومات إرشادية وتؤكدها الوكالة.',
      'msg.interested':'مهتم بهذه السيارة؟ اتصل بنا للتأكد من توفرها ومعرفة السعر.',
      'filter.search':'ابحث عن سيارة','filter.searchPh':'الاسم أو الطراز…','filter.cat':'الفئة','filter.trans':'ناقل الحركة','filter.transAll':'الكل',
      'filter.price':'السعر لليوم (دج)','filter.min':'الأدنى','filter.max':'الأقصى','filter.avail':'التوفر','filter.availAll':'الكل','filter.availYes':'المتوفرة','filter.availNo':'غير المتوفرة',
      'filter.priceNone':'الأسعار تُقدَّم عبر الهاتف.','filter.reset':'إعادة تعيين','filter.count':'{n} سيارة',
      'filter.empty':'لا توجد سيارة تطابق بحثك.',
      'detail.notFound':'السيارة غير موجودة.','detail.specs':'المواصفات','detail.desc':'الوصف','detail.conditions':'شروط الإيجار',
      'detail.condCall':'سيتم توضيح شروط الإيجار عبر الهاتف.','detail.similar':'سيارات مشابهة','detail.waText':'السلام عليكم، أنا مهتم بالسيارة {name}. هل هي متوفرة؟ وما هو السعر؟',
      'wa.general':'السلام عليكم، أرغب في معلومات حول تأجير السيارات.',
      'faq.a1.q':'كيف أحجز سيارة؟','faq.a1.a':'الحجز يتم عبر الهاتف فقط. اتصل بنا على {phone}: نتحقق من توفر السيارة ونخبرك بالسعر. يمكنك أيضاً مراسلتنا عبر واتساب.',
      'faq.a2.q':'هل يؤكد الموقع حجزي؟','faq.a2.a':'لا. هذا الموقع لا يوفر أي حجز عبر الإنترنت. لا يتأكد الإيجار إلا بعد التواصل المباشر مع الوكالة.',
      'faq.a3.q':'كيف أعرف السعر والتوفر؟','faq.a3.a':'تختلف الأسعار والتوفر حسب السيارة والفترة. اتصل بنا أو راسلنا عبر واتساب لمعرفتها.',
      'faq.a4.q':'ما هي الوثائق المطلوبة؟','faq.a4.a':'ستوضح لك الوكالة الوثائق المطلوبة أثناء مكالمتك.',
      'faq.a5.q':'أين تقع الوكالة؟','faq.a5.a':'تقع الوكالة في بوإسماعيل، ولاية تيبازة. استخدم زر «الاتجاهات على خرائط Google» للوصول إليها.'
    }
  };
  // Static-page strings (Arabic only; French is the HTML text itself)
  Object.assign(dict.ar, window.__AR_STATIC || {});

  let lang = 'fr';
  try { const s = localStorage.getItem('lang'); if (s === 'ar' || s === 'fr') lang = s; } catch (e) {}

  function t(key, vars) {
    let s = (dict[lang] && dict[lang][key]) || dict.fr[key] || key;
    if (vars) Object.keys(vars).forEach(k => { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }
  function vName(v) { return lang === 'ar' && v.nameAr ? v.nameAr : v.name; }
  function vDesc(v) { return v.desc ? (v.desc[lang] || v.desc.fr) : ''; }
  function bText(o) { return o ? (o[lang] || o.fr) : ''; }

  function applyStatic() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('ar', lang === 'ar');
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (el.dataset.fr === undefined) el.dataset.fr = el.innerHTML;
      const key = el.dataset.i18n;
      el.innerHTML = lang === 'ar' && dict.ar[key] ? dict.ar[key] : el.dataset.fr;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        const store = 'data-fr-' + attr;
        if (!el.hasAttribute(store)) el.setAttribute(store, el.getAttribute(attr) || '');
        el.setAttribute(attr, lang === 'ar' && dict.ar[key] ? dict.ar[key] : el.getAttribute(store));
      });
    });
    const meta = window.PAGE_META;
    if (meta) {
      document.title = lang === 'ar' && meta.titleAr ? meta.titleAr : meta.title;
      const d = document.querySelector('meta[name="description"]');
      if (d) d.content = lang === 'ar' && meta.descAr ? meta.descAr : meta.desc;
    }
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    applyStatic();
    document.dispatchEvent(new CustomEvent('langchange'));
  }
  window.I18N = { t, vName, vDesc, bText, applyStatic, setLang, get lang() { return lang; }, dict };
})();
