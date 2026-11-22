/* ============================================================
   CHAÂLAL AZIZ — EDITABLE DATA FILE
   The owner (or a developer) edits ONLY this file to change
   business details and the vehicle catalogue.
   Anything set to null is "not verified yet" and is hidden or
   replaced by "call us" on the website. Never invent values.
   ============================================================ */

window.BUSINESS = {
  name: 'Location de voiture Chaâlal Aziz',
  phoneDisplay: '0550 49 69 05',
  phoneHref: 'tel:+213550496905',
  whatsappNumber: '213550496905',                 // used for https://wa.me/<number>
  whatsappHref: 'https://wa.me/213550496905',
  address: { fr: 'Bou Ismaïl, Tipaza, Algérie', ar: 'بوإسماعيل، تيبازة، الجزائر' },
  // Verified by the owner:
  googleRating: 4.8,
  googleReviewCount: 61,
  // Google Maps (search by business name — replace with the exact Google Maps share link when available)
  mapsQuery: 'JMRQ+RP Bou Ismaïl, Tipaza, Algérie',   // Plus Code shown on the Google Maps listing
  // NOT VERIFIED — leave null until the owner confirms (shown as "call us" on the site)
  openingHours: null,        // e.g. { fr: 'Tous les jours 8h–19h', ar: 'كل يوم 8–19' }
  facebookUrl: null,
  instagramUrl: null,
  // Hero photograph (put a real photo in /assets and set its path, e.g. 'assets/hero.jpg')
  heroImage: null,
  // Absolute site URL used for canonical/OG/sitemap (set when the domain is known)
  siteUrl: 'https://REPLACE-WITH-YOUR-DOMAIN'
};

/* ------------------------------------------------------------
   VEHICLE CATALOGUE
   demo: true  -> shown with a "Démo" badge (placeholder data).
   price: number in DA per day, or null if not verified.
   available: true | false | null (null = unknown, "call to check").
   images: array of file paths in /assets/vehicles/ (empty = placeholder).
   conditions: { fr, ar } or null.
   cat: 'citadine' | 'berline' | 'suv' | 'utilitaire'
   trans: 'manual' | 'auto'      fuel: 'petrol' | 'diesel' | 'hybrid' | 'electric'
   ------------------------------------------------------------ */
window.VEHICLES = [
  {
    id: 'demo-renault-clio',
    demo: true,
    featured: true,
    name: 'Renault Clio IV — Démo',
    nameAr: 'رينو كليو 4 — تجريبية',
    brand: 'Renault',
    model: 'Clio IV',
    year: null,
    cat: 'citadine',
    trans: 'manual',
    fuel: 'petrol',
    seats: 5,
    price: null,
    available: null,
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Renault_Clio_TCe_90_Luxe_%28IV%29_%E2%80%93_Frontansicht%2C_17._Mai_2013%2C_M%C3%BCnster.jpg/1200px-Renault_Clio_TCe_90_Luxe_%28IV%29_%E2%80%93_Frontansicht%2C_17._Mai_2013%2C_M%C3%BCnster.jpg'],
    conditions: null,
    desc: {
      fr: "Photo illustrative et fiche de démonstration uniquement — ce véhicule n'est pas confirmé dans la flotte de l'agence.",
      ar: 'صورة توضيحية وبطاقة تجريبية فقط — هذه السيارة غير مؤكدة ضمن أسطول الوكالة.'
    }
  },
  {
    id: 'demo-dacia-sandero',
    demo: true,
    featured: false,
    name: 'Dacia Sandero — Démo',
    nameAr: 'داسيا سانديرو — تجريبية',
    brand: 'Dacia',
    model: 'Sandero',
    year: null,
    cat: 'citadine',
    trans: 'manual',
    fuel: 'petrol',
    seats: 5,
    price: null,
    available: null,
    images: ['https://upload.wikimedia.org/wikipedia/commons/9/92/Dacia_Sandero_front_20090722.jpg'],
    conditions: null,
    desc: {
      fr: "Photo illustrative et fiche de démonstration uniquement — ce véhicule n'est pas confirmé dans la flotte de l'agence.",
      ar: 'صورة توضيحية وبطاقة تجريبية فقط — هذه السيارة غير مؤكدة ضمن أسطول الوكالة.'
    }
  },
  {
    id: 'demo-volkswagen-golf',
    demo: true,
    featured: false,
    name: 'Volkswagen Golf — Démo',
    nameAr: 'فولكسفاغن غولف — تجريبية',
    brand: 'Volkswagen',
    model: 'Golf',
    year: null,
    cat: 'berline',
    trans: 'manual',
    fuel: 'petrol',
    seats: 5,
    price: null,
    available: null,
    images: ['https://upload.wikimedia.org/wikipedia/commons/5/55/2017_Volkswagen_Golf_%285G_MY18%29_110TSI_Highline_hatchback_%282018-10-12%29.jpg'],
    conditions: null,
    desc: {
      fr: "Photo illustrative et fiche de démonstration uniquement — ce véhicule n'est pas confirmé dans la flotte de l'agence.",
      ar: 'صورة توضيحية وبطاقة تجريبية فقط — هذه السيارة غير مؤكدة ضمن أسطول الوكالة.'
    }
  }
];

/* ------------------------------------------------------------
   REAL GOOGLE REVIEWS (copied by the owner from the Google Maps listing).
   Text is Google's Arabic translation of the original French review.
   Only complete (non-truncated) reviews are listed. Add/remove freely.
   ------------------------------------------------------------ */
window.REVIEWS = [
  { author:'Nassim Djebli', rating:5, text:'لا تترددوا في التعامل معهم. تواصل ممتاز! السيارات مطابقة تمامًا للوصف. يتميزون بالمرونة والتعاون. أستأجر سياراتي منهم حصريًا منذ سنوات، وأنا راضٍ تمامًا. لم أشعر قط بخيبة أمل. أوصي بهم دون أدنى شك.' },
  { author:'Younes Abderraouf NEDJARI', rating:5, text:'استأجرت منهم مرتين وأنا راضٍ تمامًا. فريقهم محترف، سريع الاستجابة، ولطيف دائمًا. كل شيء سار بسلاسة في كل مرة: كانت السيارات في حالة ممتازة، وكانت العملية سريعة وسهلة. خدمة موثوقة وفعّالة؛ أنصح بهم بشدة!' },
  { author:'Issam Bensoltane', rating:5, text:'شكرًا جزيلًا لفريق شلال عزيز في بو إسماعيل على احترافيتهم وحسن استقبالهم. كانت السيارة في حالة ممتازة، والسعر واضحًا، والخدمة سريعة. أوصي بهم بشدة وسأعود إليهم بالتأكيد!' },
  { author:'Bouthaina Ghirane', rating:5, text:'شكراً جزيلاً، كانت الخدمة ممتازة، وبالطبع كان استقبالكم رائعاً، ما شاء الله.' },
  { author:'fouzia chennouf', rating:5, text:'أستأجر منهم منذ فترة، وعملية استلام السيارة وإعادتها سلسة للغاية. أنصح بشدة بهذه الوكالة لتأجير السيارات. احترافيتهم مثالية.' },
  { author:'Brahim Bedj73', rating:5, text:'فريق ممتاز، متفانٍ ومتعاون. أوصي بهم بشدة وسأستأجر منهم بالتأكيد مرة أخرى العام المقبل. مع أطيب التمنيات وإلى اللقاء.' }
];
