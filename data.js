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
  { id:'renault-clio', demo:true, featured:true, name:'Renault Clio', nameAr:'رينو كليو', brand:'Renault', model:'Clio',
    year:2022, cat:'citadine', trans:'manual', fuel:'petrol', seats:5, price:null, available:null, images:[], conditions:null,
    desc:{ fr:'Citadine pratique pour les déplacements en ville et sur la côte.', ar:'سيارة مدينة عملية للتنقل في المدينة وعلى الساحل.' } },
  { id:'dacia-logan', demo:true, featured:true, name:'Dacia Logan', nameAr:'داسيا لوغان', brand:'Dacia', model:'Logan',
    year:2023, cat:'berline', trans:'manual', fuel:'petrol', seats:5, price:null, available:null, images:[], conditions:null,
    desc:{ fr:'Berline spacieuse, adaptée aux trajets en famille.', ar:'سيارة سيدان واسعة مناسبة للرحلات العائلية.' } },
  { id:'peugeot-208', demo:true, featured:false, name:'Peugeot 208', nameAr:'بيجو 208', brand:'Peugeot', model:'208',
    year:2022, cat:'citadine', trans:'manual', fuel:'petrol', seats:5, price:null, available:null, images:[], conditions:null,
    desc:{ fr:'Citadine moderne et agile.', ar:'سيارة مدينة عصرية وسهلة القيادة.' } },
  { id:'hyundai-tucson', demo:true, featured:true, name:'Hyundai Tucson', nameAr:'هيونداي توسان', brand:'Hyundai', model:'Tucson',
    year:2023, cat:'suv', trans:'auto', fuel:'diesel', seats:5, price:null, available:null, images:[], conditions:null,
    desc:{ fr:'SUV confortable, boîte automatique.', ar:'سيارة SUV مريحة بناقل حركة أوتوماتيكي.' } },
  { id:'toyota-hilux', demo:true, featured:false, name:'Toyota Hilux', nameAr:'تويوتا هيلوكس', brand:'Toyota', model:'Hilux',
    year:2022, cat:'utilitaire', trans:'manual', fuel:'diesel', seats:5, price:null, available:null, images:[], conditions:null,
    desc:{ fr:'Pick-up robuste pour le transport et les terrains difficiles.', ar:'بيك أب قوي للنقل والطرق الوعرة.' } },
  { id:'kia-sportage', demo:true, featured:false, name:'Kia Sportage', nameAr:'كيا سبورتاج', brand:'Kia', model:'Sportage',
    year:2023, cat:'suv', trans:'auto', fuel:'petrol', seats:5, price:null, available:null, images:[], conditions:null,
    desc:{ fr:'SUV moderne, boîte automatique.', ar:'سيارة SUV عصرية بناقل حركة أوتوماتيكي.' } }
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
