(() => {
const SETTINGS_KEY = "pc_settings_v3";
const LEGACY_SETTINGS_KEY = "pc_settings_v2";
const CATALOG_KEY = "pc_catalog_v1";
const GALLERY_KEY = "pc_gallery_v1";
const EVENTS_KEY = "pc_events_v1";
const BLOG_KEY = "pc_blog_v1";
const MENU_CATS_KEY = "pc_menu_cats_v1";
const FAQ_KEY = "pc_faq_v1";
const PAGES_KEY = "pc_pages_v1";
const INBOX_KEY = "pc_inbox_v1";
const GALLERY_FILTERS_KEY = "pc_gallery_filters_v1";

const DEFAULT_LOGO = "assets/logo-point-croissant.webp";
const PRODUCT_PHOTOS = {
  p1: "assets/croissant-chocolate.png",
  p2: "assets/croissant-pistachio.png",
  p3: "assets/croissant-blueberry.png",
  p4: "assets/croissant-truffle.png"
};
const isLogoPlaceholder = (src) => /logo-point-croissant/i.test(String(src || ""));
const LANGS = ["tr", "en", "ru", "ar", "de"];
const toLocalized = (tr = "", en = "", ru = "", ar = "", de = "") => ({ tr, en, ru, ar, de });

const normalizeLocalized = (value, fallback = "") => {
  if (value && typeof value === "object") {
    return {
      tr: String(value.tr || fallback || "").trim(),
      en: String(value.en || "").trim(),
      ru: String(value.ru || "").trim(),
      ar: String(value.ar || "").trim(),
      de: String(value.de || "").trim()
    };
  }
  const tr = typeof value === "string" ? value.trim() : String(fallback || "").trim();
  return toLocalized(tr, "", "", "", "");
};

const getLang = () =>
  (typeof window.__pcGetLang === "function" && window.__pcGetLang()) ||
  (typeof localStorage !== "undefined" && localStorage.getItem("pc_lang_v1")) ||
  document.documentElement.lang ||
  "tr";

const getLocalized = (value, lang = getLang()) => {
  const normalized = normalizeLocalized(value);
  const requested = LANGS.includes(lang) ? lang : "tr";
  return String(normalized[requested] || "").trim() || String(normalized.tr || "").trim();
};

const remotePack = () =>
  window.__pcRemoteData && typeof window.__pcRemoteData === "object" ? window.__pcRemoteData : null;

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const pickStoredList = (key, remoteKey, fallback) => {
  const parsed = readJson(key, null);
  if (Array.isArray(parsed) && parsed.length) return parsed;
  const remote = remotePack();
  if (remote && Array.isArray(remote[remoteKey]) && remote[remoteKey].length) return remote[remoteKey];
  return fallback;
};

const pickStoredObject = (key, remoteKey, fallback) => {
  const parsed = readJson(key, null);
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  const remote = remotePack();
  if (remote && remote[remoteKey] && typeof remote[remoteKey] === "object" && !Array.isArray(remote[remoteKey])) {
    return remote[remoteKey];
  }
  return fallback;
};

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    const quota =
      error &&
      (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED" || error.code === 22);
    const wrapped = new Error(quota ? "STORAGE_QUOTA" : "STORAGE_WRITE");
    wrapped.cause = error;
    throw wrapped;
  }
};

const DEFAULT_NAV = [
  { id: "home", href: "index.html", label: toLocalized("Anasayfa", "Home", "Главная", "الرئيسية", "Startseite"), visible: true },
  { id: "story", href: "hikayemiz.html", label: toLocalized("Hikayemiz", "Our Story", "Наша история", "قصتنا", "Unsere Geschichte"), visible: true },
  { id: "flavors", href: "lezzetler.html", label: toLocalized("Lezzetler", "Flavors", "Вкусы", "النكهات", "Sorten"), visible: true },
  { id: "gallery", href: "index.html#galeri", label: toLocalized("Galeri", "Gallery", "Галерея", "المعرض", "Galerie"), visible: true },
  { id: "blog", href: "blog.html", label: toLocalized("Tarifler", "Recipes", "Рецепты", "الوصفات", "Rezepte"), visible: true },
  { id: "contact", href: "index.html#siparis", label: toLocalized("İletişim", "Contact", "Контакты", "تواصل", "Kontakt"), visible: true }
];

const DEFAULT_FOOTER = {
  explore: [
    { id: "f_home", href: "index.html", label: toLocalized("Anasayfa", "Home", "Главная", "الرئيسية", "Startseite"), visible: true },
    { id: "f_story", href: "hikayemiz.html", label: toLocalized("Hikayemiz", "Our Story", "Наша история", "قصتنا", "Unsere Geschichte"), visible: true },
    { id: "f_flavors", href: "lezzetler.html", label: toLocalized("Lezzetler", "Flavors", "Вкусы", "النكهات", "Sorten"), visible: true },
    { id: "f_menu", href: "menu.html", label: toLocalized("Menü", "Menu", "Меню", "القائمة", "Menü"), visible: true },
    { id: "f_blog", href: "blog.html", label: toLocalized("Blog", "Blog", "Блог", "مدونة", "Blog"), visible: true },
    { id: "f_events", href: "events.html", label: toLocalized("Etkinlikler", "Events", "Мероприятия", "فعاليات", "Veranstaltungen"), visible: true }
  ],
  services: [
    { id: "f_res", href: "reservation.html", label: toLocalized("Rezervasyon", "Reservation", "Бронирование", "حجز", "Reservierung"), visible: true },
    { id: "f_del", href: "delivery.html", label: toLocalized("Teslimat", "Delivery", "Доставка", "توصيل", "Lieferung"), visible: true },
    { id: "f_wh", href: "wholesale.html", label: toLocalized("Toptan", "Wholesale", "Оптом", "جملة", "Großhandel"), visible: true },
    { id: "f_faq", href: "faq.html", label: toLocalized("SSS", "FAQ", "FAQ", "أسئلة", "FAQ"), visible: true }
  ],
  legal: [
    { id: "f_priv", href: "privacy.html", label: toLocalized("Gizlilik Politikası", "Privacy Policy", "Политика конфиденциальности", "سياسة الخصوصية", "Datenschutz"), visible: true },
    { id: "f_terms", href: "terms.html", label: toLocalized("Kullanım Şartları", "Terms of Use", "Условия использования", "شروط الاستخدام", "Nutzungsbedingungen"), visible: true },
    { id: "f_cook", href: "cookies.html", label: toLocalized("Çerez Politikası", "Cookie Policy", "Политика cookie", "سياسة ملفات تعريف الارتباط", "Cookie-Richtlinie"), visible: true }
  ]
};

const DEFAULT_MARQUEE = [
  toLocalized("Tereyağlı", "Buttery", "Сливочный", "بالزبدة", "Butter"),
  toLocalized("Çikolatalı", "Chocolate", "Шоколадный", "بالشوكولاتة", "Schokolade"),
  toLocalized("Fıstıklı", "Pistachio", "Фисташковый", "بالفستق", "Pistazie"),
  toLocalized("Meyveli", "Fruity", "Фруктовый", "بالفواكه", "Fruchtig"),
  toLocalized("Premium", "Premium", "Премиум", "مميز", "Premium"),
  toLocalized("Brunch", "Brunch", "Бранч", "برانش", "Brunch"),
  toLocalized("Espresso", "Espresso", "Эспрессо", "إسبريسو", "Espresso"),
  toLocalized("Katman katman, her sabah taze", "Layer by layer, fresh every morning", "Слой за слоем, свежо каждое утро", "طبقة بعد طبقة، طازج كل صباح", "Schicht für Schicht, jeden Morgen frisch")
];

const DEFAULT_GALLERY_FILTERS = [
  { id: "tatli", label: toLocalized("Tatlı", "Sweet", "Сладкое", "حلو", "Süß") },
  { id: "meyveli", label: toLocalized("Meyveli", "Fruity", "Фруктовое", "فاكهي", "Fruchtig") },
  { id: "premium", label: toLocalized("Premium", "Premium", "Премиум", "مميز", "Premium") }
];

const DEFAULT_SEO = {
  "index.html": {
    title: toLocalized(
      "Point Croissant Antalya | Cafe, Bakery & İmza Kruvasan",
      "Point Croissant Antalya | Cafe, Bakery & Signature Croissant",
      "Point Croissant Анталья | Кафе, пекарня и фирменный круассан"
    ),
    description: toLocalized(
      "Point Croissant Antalya resmi web sitesi. Güzeloba, Muratpaşa’da cafe ve bakery: imza kruvasanlar, menü, rezervasyon ve iletişim.",
      "Official website of Point Croissant Antalya. Cafe and bakery in Guzeloba, Muratpasa: signature croissants, menu, reservation and contact.",
      "Официальный сайт Point Croissant Анталья. Кафе и пекарня в Гюзелоба, Муратпаша: фирменные круассаны, меню, бронь и контакты."
    )
  },
  "hikayemiz.html": {
    title: toLocalized("Hikayemiz | Point Croissant", "Our Story | Point Croissant", "Наша история | Point Croissant"),
    description: toLocalized("Point Croissant hikayesi, üretim anlayışı ve marka yolculuğu.")
  },
  "lezzetler.html": {
    title: toLocalized("Lezzetler | Point Croissant", "Flavors | Point Croissant", "Вкусы | Point Croissant"),
    description: toLocalized("Point Croissant Antalya lezzetleri: imza kruvasanlar, öne çıkan ürünler ve sipariş için iletişim bilgileri.")
  },
  "menu.html": {
    title: toLocalized("Menü | Point Croissant", "Menu | Point Croissant", "Меню | Point Croissant"),
    description: toLocalized("Point Croissant Antalya menü: güncel fiyatlar, kategorili kruvasan ve cafe ürünleri.")
  },
  "blog.html": {
    title: toLocalized("Blog | Point Croissant", "Blog | Point Croissant", "Блог | Point Croissant"),
    description: toLocalized("Kruvasan, kahve ve servis önerileri için Point Croissant blog içerikleri.")
  },
  "blog-imza-kruvasan.html": {
    title: toLocalized("İmza Kruvasan Rehberi | Point Croissant", "Signature Croissant Guide | Point Croissant", "Гид по фирменному круассану | Point Croissant"),
    description: toLocalized("İmza kruvasan hazırlama rehberi, püf noktaları ve üretim önerileri.")
  },
  "blog-kahve-eslesmesi.html": {
    title: toLocalized("Kahve Eşleşmesi | Point Croissant", "Coffee Pairing | Point Croissant", "Сочетание с кофе | Point Croissant"),
    description: toLocalized("Kahve ve kruvasan eşleşmesi için pratik öneriler ve lezzet uyumları.")
  },
  "events.html": {
    title: toLocalized("Etkinlikler | Point Croissant", "Events | Point Croissant", "Мероприятия | Point Croissant"),
    description: toLocalized("Point Croissant etkinlikleri ve özel gün organizasyon bilgileri.")
  },
  "corporate.html": {
    title: toLocalized("Kurumsal | Point Croissant", "Corporate | Point Croissant", "Корпоративным клиентам | Point Croissant"),
    description: toLocalized("Kurumsal iş birliği, marka bilgisi ve Point Croissant hakkında detaylar.")
  },
  "faq.html": {
    title: toLocalized("SSS | Point Croissant", "FAQ | Point Croissant", "FAQ | Point Croissant"),
    description: toLocalized("Sıkça sorulan sorular: rezervasyon, teslimat, toplu sipariş ve daha fazlası.")
  },
  "reservation.html": {
    title: toLocalized("Rezervasyon | Point Croissant", "Reservation | Point Croissant", "Бронирование | Point Croissant"),
    description: toLocalized("Point Croissant masa rezervasyonu için WhatsApp ve telefonla hızlı iletişim.")
  },
  "delivery.html": {
    title: toLocalized("Teslimat | Point Croissant", "Delivery | Point Croissant", "Доставка | Point Croissant"),
    description: toLocalized("Antalya içi teslimat saatleri, sipariş detayları ve iletişim seçenekleri.")
  },
  "wholesale.html": {
    title: toLocalized("Toptan | Point Croissant", "Wholesale | Point Croissant", "Оптом | Point Croissant"),
    description: toLocalized("Toptan ve kurumsal tedarik çözümleri için teklif ve iletişim bilgileri.")
  },
  "privacy.html": {
    title: toLocalized("Gizlilik Politikası | Point Croissant", "Privacy Policy | Point Croissant", "Политика конфиденциальности | Point Croissant"),
    description: toLocalized("Point Croissant Gizlilik Politikası metni ve kişisel veri işleme esasları.")
  },
  "terms.html": {
    title: toLocalized("Kullanım Şartları | Point Croissant", "Terms of Use | Point Croissant", "Условия использования | Point Croissant"),
    description: toLocalized("Point Croissant Kullanım Şartları ve site kullanımına ilişkin kurallar.")
  },
  "cookies.html": {
    title: toLocalized("Çerez Politikası | Point Croissant", "Cookie Policy | Point Croissant", "Политика cookie | Point Croissant"),
    description: toLocalized("Point Croissant Çerez Politikası ve çerez tercihleri hakkında bilgiler.")
  },
  "blog-post.html": {
    title: toLocalized("Blog | Point Croissant", "Blog | Point Croissant", "Блог | Point Croissant"),
    description: toLocalized("Point Croissant blog yazısı.")
  }
};

const DEFAULT_SETTINGS = {
  phoneDisplay: "+90 532 315 07 77",
  phoneTel: "+905323150777",
  whatsappDisplay: "+90 532 315 07 77",
  whatsappNumber: "905323150777",
  email: "hello@pointcroissant.com",
  address: toLocalized(
    "Güzeloba Mah. Çağlayangil Cad. No:38 / B, Muratpaşa / Antalya",
    "Guzeloba Neighborhood, Caglayangil Street No:38 / B, Muratpasa / Antalya",
    "Гюзелоба, ул. Чаглаянгиль, No:38 / B, Муратпаша / Анталья",
    "حي غوزيلوبا، شارع تشاغلايانغيل رقم 38 / ب، مراد باشا / أنطاليا",
    "Güzeloba Mah., Çağlayangil Cad. Nr. 38 / B, Muratpaşa / Antalya"
  ),
  mapQuery: toLocalized(
    "Güzeloba Mah. Çağlayangil Cad. No:38 / B, Muratpaşa / Antalya",
    "Guzeloba Neighborhood, Caglayangil Street No:38 / B, Muratpasa / Antalya",
    "Гюзелоба, ул. Чаглаянгиль, No:38 / B, Муратпаша / Анталья",
    "حي غوزيلوبا، شارع تشاغلايانغيل رقم 38 / ب، مراد باشا / أنطاليا",
    "Güzeloba Mah., Çağlayangil Cad. Nr. 38 / B, Muratpaşa / Antalya"
  ),
  logo: DEFAULT_LOGO,
  heroImage: "assets/dizayn.jpeg",
  instagram: "",
  facebook: "",
  tiktok: "",
  youtube: "",
  twitter: "",
  mapEmbed: "",
  ogImage: "assets/og-share.jpg",
  formWebhook: "",
  workingHours: toLocalized(
    "Her gün 09:00 - 22:00",
    "Every day 09:00 - 22:00",
    "Ежедневно 09:00 - 22:00",
    "كل يوم 09:00 - 22:00",
    "Täglich 09:00 - 22:00"
  ),
  openingHoursSpec: "Mo-Su 09:00-22:00",
  whatsappGreeting: toLocalized(
    "Merhaba Point Croissant, bilgi almak istiyorum.",
    "Hello Point Croissant, I would like to get information.",
    "Здравствуйте, Point Croissant, я хотел(а) бы получить информацию.",
    "مرحباً Point Croissant، أود الحصول على معلومات.",
    "Hallo Point Croissant, ich möchte Informationen erhalten."
  ),
  brandName: "Point Croissant",
  brandTagline: toLocalized("Cafe & Bakery", "Cafe & Bakery", "Кафе и пекарня", "مقهى ومخبز", "Café & Bäckerei"),
  footerText: toLocalized(
    "Günün en keyifli molası için taptaze kruvasanlar ve özenli kahve.",
    "Fresh croissants and carefully brewed coffee for the best break of your day.",
    "Свежие круассаны и тщательно приготовленный кофе для лучшей паузы дня.",
    "كرواسون طازج وقهوة محضّرة بعناية لأجمل استراحة في يومك.",
    "Frische Croissants und sorgfältig zubereiteter Kaffee für die schönste Pause Ihres Tages."
  ),
  schemaStreet: "Güzeloba Mah. Çağlayangil Cad. No:38 / B",
  schemaLocality: "Muratpaşa",
  schemaRegion: "Antalya",
  schemaPostal: "07230",
  heroStats: {
    years: 12,
    recipes: 40,
    daily: 1200,
    yearsLabel: toLocalized("Yıllık Ustalık", "Years of Craft", "Лет мастерства", "سنوات من الحرفة", "Jahre Handwerk"),
    recipesLabel: toLocalized("Özel Tarif", "Signature Recipe", "Авторский рецепт", "وصفة مميزة", "Signaturrezept"),
    dailyLabel: toLocalized("Günlük Servis", "Daily Service", "Порций в день", "خدمة يومية", "Täglicher Service")
  },
  navLinks: DEFAULT_NAV.map((item) => ({ ...item, label: { ...item.label } })),
  seo: JSON.parse(JSON.stringify(DEFAULT_SEO)),
  ctaLabel: toLocalized("Sipariş Ver", "Order Now", "Заказать", "اطلب الآن", "Jetzt bestellen"),
  ctaHref: "reservation.html",
  flavorMarquee: DEFAULT_MARQUEE.map((item) => ({ ...item })),
  footerLinks: JSON.parse(JSON.stringify(DEFAULT_FOOTER))
};

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: toLocalized("Double Chocolate"),
    description: toLocalized("Belçika çikolatası dolgusu ve kakao glaze ile yoğun lezzet."),
    price: 205,
    tag: toLocalized("En Çok Satan"),
    image: PRODUCT_PHOTOS.p1,
    category: "sweet",
    signature: true,
    visible: true,
    sortOrder: 1,
    stock: null
  },
  {
    id: "p2",
    name: toLocalized("Fıstık Supreme"),
    description: toLocalized("Antep fıstık kreması, çıtır fıstık parçası ve tereyağlı hamur."),
    price: 225,
    tag: toLocalized("Şef Önerisi"),
    image: PRODUCT_PHOTOS.p2,
    category: "sweet",
    signature: true,
    visible: true,
    sortOrder: 2,
    stock: null
  },
  {
    id: "p3",
    name: toLocalized("Yaban Mersinli Danish"),
    description: toLocalized("İpeksi krema ve meyve dolgusu ile ferah, dengeli tat."),
    price: 215,
    tag: toLocalized("Yeni"),
    image: PRODUCT_PHOTOS.p3,
    category: "sweet",
    signature: true,
    visible: true,
    sortOrder: 3,
    stock: null
  },
  {
    id: "p4",
    name: toLocalized("Trüf Mantarlı Tuzlu"),
    description: toLocalized("Trüf mantarlı tuzlu kruvasan."),
    price: 235,
    tag: toLocalized("Premium"),
    image: PRODUCT_PHOTOS.p4,
    category: "savory",
    signature: true,
    visible: true,
    sortOrder: 4,
    stock: null
  }
];

const BLOG_PHOTOS = {
  "imza-kruvasan": "assets/croissant-layers.png",
  "kahve-eslesmesi": "assets/croissant-coffee.png"
};

const DEFAULT_GALLERY = [
  { id: "g1", src: "assets/croissant-layers.png", alt: toLocalized("Katman detayı", "Layer detail", "Деталь слоёв", "تفاصيل الطبقات", "Schichtdetail"), categories: ["premium"] },
  { id: "g2", src: "assets/croissant-chocolate.png", alt: toLocalized("Double Chocolate"), categories: ["tatli", "premium"] },
  { id: "g3", src: "assets/croissant-pistachio.png", alt: toLocalized("Fıstık Supreme"), categories: ["tatli", "premium"] },
  { id: "g4", src: "assets/croissant-blueberry.png", alt: toLocalized("Yaban Mersinli Danish"), categories: ["meyveli"] },
  { id: "g5", src: "assets/croissant-coffee.png", alt: toLocalized("Kahve eşleşmesi", "Coffee pairing", "Сочетание с кофе", "تناسق القهوة", "Kaffeekombination"), categories: ["tatli"] },
  { id: "g6", src: "assets/interior-main.webp", alt: toLocalized("Point Croissant mekan arka planı", "Point Croissant interior", "Интерьер Point Croissant", "ديكور Point Croissant", "Point Croissant Innenraum"), categories: ["premium"] }
];

const DEFAULT_EVENTS = [
  {
    id: "e1",
    title: toLocalized("Barista Workshop", "Barista Workshop", "Воркшоп бариста", "ورشة باريستا", "Barista-Workshop"),
    description: toLocalized(
      "Her cumartesi 11:00 - 13:00.",
      "Every Saturday 11:00 - 13:00.",
      "Каждую субботу 11:00 - 13:00.",
      "كل سبت من 11:00 إلى 13:00.",
      "Jeden Samstag 11:00 - 13:00."
    ),
    date: "",
    time: "11:00",
    location: toLocalized("Point Croissant", "Point Croissant", "Point Croissant", "Point Croissant", "Point Croissant")
  },
  {
    id: "e2",
    title: toLocalized("Kruvasan Atölyesi", "Croissant Workshop", "Мастер-класс по круассанам", "ورشة الكرواسان", "Croissant-Workshop"),
    description: toLocalized(
      "Ayda iki kez profesyonel eğitim.",
      "Professional training twice a month.",
      "Профессиональное обучение дважды в месяц.",
      "تدريب احترافي مرتين شهرياً.",
      "Professionelles Training zweimal im Monat."
    ),
    date: "",
    time: "",
    location: toLocalized("Point Croissant", "Point Croissant", "Point Croissant", "Point Croissant", "Point Croissant")
  },
  {
    id: "e3",
    title: toLocalized("Private Brunch", "Private Brunch", "Закрытый бранч", "برانش خاص", "Privater Brunch"),
    description: toLocalized(
      "10-30 kişilik kurumsal organizasyon.",
      "Corporate events for 10-30 guests.",
      "Корпоративные мероприятия на 10–30 гостей.",
      "فعاليات شركات لـ 10 إلى 30 ضيفاً.",
      "Firmenveranstaltungen für 10–30 Gäste."
    ),
    date: "",
    time: "",
    location: toLocalized("Point Croissant", "Point Croissant", "Point Croissant", "Point Croissant", "Point Croissant")
  }
];

const DEFAULT_BLOG = [
  {
    id: "imza-kruvasan",
    href: "blog-imza-kruvasan.html",
    image: BLOG_PHOTOS["imza-kruvasan"],
    tag: toLocalized("İmza kruvasan", "Signature croissant", "Фирменный круассан", "كرواسان التوقيع", "Signatur-Croissant"),
    title: toLocalized(
      "İmza Kruvasan Nasıl Yapılır?",
      "How to Make a Signature Croissant?",
      "Как готовить фирменный круассан?",
      "كيف يُحضَّر كرواسان التوقيع؟",
      "Wie backt man ein Signatur-Croissant?"
    ),
    excerpt: toLocalized(
      "Kat kat dokusunu koruyan, hacimli ve dengeli hamur tekniğinin püf noktaları.",
      "Key techniques for layered texture and balanced dough.",
      "Ключевые приёмы слоёной текстуры и сбалансированного теста.",
      "أسرار العجينة المتوازنة والطبقات الهشة.",
      "Wichtige Techniken für blättrige Textur und ausgewogenen Teig."
    ),
    body: toLocalized(
      "İmza kruvasanın temelinde üç şey vardır: doğru hamur yapısı, kontrollü katlama ve sabırlı mayalama. Dışının çıtır, içinin hafif ve katmanlı olması için sürecin her adımı dikkat ister.\n\nKruvasanın en kritik adımı hamurun soğuk zincirde dinlenmesidir. Hamur ısındığında tereyağı katmanlara doğru şekilde dağılmaz; bu da pişince kabarmayı ve katman netliğini düşürür.\n\nTereyağı katlarını eşit dağıtmak için her katlamadan sonra hamuru ortalama 25-30 dakika buzdolabında dinlendirin. Bu kısa dinlenme, hamurun tekrar toparlanmasını sağlar ve açma sırasında yırtılmayı azaltır.\n\nSon mayalamada ortam sıcaklığının 24-26 derece aralığında olması önerilir. Çok düşük sıcaklıkta hacim yavaş gelişir, çok yüksek sıcaklıkta ise tereyağı katmanlardan taşarak yapıyı bozabilir.\n\nPişirme aşamasında önceden ısıtılmış fırın kullanın ve ilk dakikalarda kapağı açmamaya özen gösterin. Bu sayede kruvasanlar güçlü bir ilk kabarma alır ve dış yüzeyde dengeli bir renk oluşur.\n\nServis öncesi kruvasanları kısa bir süre tel ızgara üzerinde dinlendirmek, alt yüzeydeki nemi azaltır ve çıtırlığı korur. Özellikle dolgu eklenecekse bu adım lezzet kadar doku için de fark yaratır.",
      "A signature croissant rests on three things: the right dough structure, controlled folding, and patient proofing. Every step matters if you want a crisp shell and a light, layered interior.\n\nThe most critical step is resting the dough in a cold chain. When the dough warms up, butter does not spread evenly through the layers, which reduces oven spring and layer definition.\n\nTo keep butter layers even, refrigerate the dough for about 25-30 minutes after each fold. This short rest lets the dough recover and reduces tearing while you roll.\n\nFinal proofing works best around 24-26°C. Too cold and volume develops slowly; too hot and butter can leak out of the layers and collapse the structure.\n\nBake in a preheated oven and avoid opening the door in the first minutes. That gives a strong first rise and an even color on the crust.\n\nBefore serving, rest the croissants briefly on a wire rack. This reduces moisture on the base and keeps the crunch, especially if you add a filling.",
      "Фирменный круассан держится на трёх вещах: правильной структуре теста, контролируемой слоёности и терпеливой расстойке. Каждый шаг важен, если нужна хрустящая корочка и лёгкая слоёная середина.\n\nСамый важный этап — отдых теста в холоде. Когда тесто нагревается, масло распределяется неравномерно, и при выпечке теряется подъём и чёткость слоёв.\n\nЧтобы слои масла оставались ровными, после каждой складки охлаждайте тесто 25–30 минут. Короткий отдых восстанавливает тесто и снижает разрывы при раскатке.\n\nФинальная расстойка лучше всего проходит при 24–26°C. Слишком холодно — объём растёт медленно, слишком жарко — масло может вытечь и разрушить структуру.\n\nВыпекайте в заранее разогретой духовке и не открывайте дверцу в первые минуты. Так круассаны получают сильный первый подъём и ровный цвет.\n\nПеред подачей дайте круассанам немного остыть на решётке. Это снижает влагу снизу и сохраняет хруст, особенно если внутри будет начинка.",
      "يقوم كرواسان التوقيع على ثلاثة أمور: بنية العجين الصحيحة، والطي المنضبط، والتخمير بصبر. كل خطوة مهمة للحصول على قشرة مقرمشة ولب خفيف متعدد الطبقات.\n\nأهم خطوة هي إراحة العجين في سلسلة باردة. إذا سخن العجين لا يتوزع الزبدة بشكل متساوٍ بين الطبقات، فيقل الانتفاخ ووضوح الطبقات عند الخبز.\n\nللحفاظ على طبقات الزبدة متساوية، برّد العجين 25–30 دقيقة بعد كل طي. هذه الاستراحة القصيرة تعيد تماسك العجين وتقلل التمزق أثناء الفرد.\n\nالتخمير النهائي أفضل عند 24–26 درجة مئوية. البرودة الزائدة تبطئ الحجم، والحرارة الزائدة قد تُخرج الزبدة من الطبقات وتُفسد البنية.\n\nاخبز في فرن مسخّن مسبقاً وتجنب فتح الباب في الدقائق الأولى. هكذا يحصل الكرواسان على انتفاخ أولي قوي ولون متوازن.\n\nقبل التقديم أرح الكرواسان قليلاً على شبكة معدنية. هذا يقلل الرطوبة من الأسفل ويحافظ على القرمشة، خاصة إذا أضفت حشوة.",
      "Ein Signatur-Croissant basiert auf drei Dingen: der richtigen Teigstruktur, kontrolliertem Tourieren und geduldigem Gehen. Jeder Schritt zählt, wenn die Kruste knusprig und das Innere leicht und blättrig sein soll.\n\nDer wichtigste Schritt ist das Ruhen des Teigs in der Kältekette. Wird der Teig warm, verteilt sich die Butter ungleichmäßig in den Schichten – Ofentrieb und Schichtdefinition leiden.\n\nDamit die Butterschichten gleichmäßig bleiben, kühlen Sie den Teig nach jedem Falz etwa 25–30 Minuten. Diese kurze Pause lässt den Teig sich erholen und reduziert Risse beim Ausrollen.\n\nDie Endgare gelingt am besten bei 24–26 °C. Zu kalt entwickelt sich das Volumen langsam, zu heiß kann Butter aus den Schichten laufen und die Struktur zerstören.\n\nBacken Sie im vorgeheizten Ofen und öffnen Sie die Tür in den ersten Minuten nicht. So entsteht ein kräftiger Ofentrieb und eine gleichmäßige Krustenfarbe.\n\nLassen Sie die Croissants vor dem Servieren kurz auf einem Gitterrost ruhen. Das reduziert Feuchtigkeit an der Unterseite und erhält die Knusprigkeit – besonders, wenn eine Füllung folgt."
    )
  },
  {
    id: "kahve-eslesmesi",
    href: "blog-kahve-eslesmesi.html",
    image: BLOG_PHOTOS["kahve-eslesmesi"],
    tag: toLocalized("Kahve eşleşmesi", "Coffee pairing", "Сочетание с кофе", "تناسق القهوة", "Kaffeekombination"),
    title: toLocalized(
      "Kahve ile Kruvasan Eşleşmesi",
      "Coffee and Croissant Pairing",
      "Круассан и кофе",
      "توافق القهوة والكرواسان",
      "Kaffee und Croissant kombinieren"
    ),
    excerpt: toLocalized(
      "Damak zevkine uygun en doğru kahve ve kruvasan uyumunu keşfedin.",
      "Discover the right coffee and croissant match for your taste.",
      "Подберите идеальную пару кофе и круассана по своему вкусу.",
      "اكتشف التوافق الأنسب بين القهوة والكرواسان لذوقك.",
      "Entdecken Sie die passende Kaffee- und Croissant-Kombination für Ihren Geschmack."
    ),
    body: toLocalized(
      "Sade tereyağlı kruvasanla filtre kahve daha dengeli bir tat verir.\n\nÇikolatalı lezzetlerde orta kavrum espresso bazlı içecekler öne çıkar.\n\nMeyveli kruvasanlar için soğuk demleme kahveler ferah bir seçimdir.",
      "A plain butter croissant pairs more evenly with filter coffee.\n\nChocolate flavors shine with medium-roast espresso drinks.\n\nFruity croissants feel fresher with cold brew.",
      "Сливочный круассан без начинки лучше всего сочетается с фильтр-кофе.\n\nШоколадные вкусы раскрываются с напитками на основе эспрессо средней обжарки.\n\nДля фруктовых круассанов освежающий выбор — колд брю.",
      "الكرواسان بالزبدة فقط يتناغم أكثر مع القهوة المقطرة.\n\nالنكهات الشوكولاتية تبرز مع مشروبات الإسبريسو متوسطة التحميص.\n\nللكرواسان بالفواكه، التبريد البارد اختيار منعش.",
      "Ein schlichtes Buttercroissant harmoniert ausgewogener mit Filterkaffee.\n\nSchokoladige Sorten kommen mit Espressogetränken mittlerer Röstung besonders gut zur Geltung.\n\nZu fruchtigen Croissants passt Cold Brew als frische Wahl."
    )
  }
];

const DEFAULT_MENU_CATS = [
  {
    id: "sweet",
    title: toLocalized("Tatlı Kruvasanlar", "Sweet Croissants", "Сладкие круассаны", "كرواسان حلو", "Süße Croissants"),
    note: toLocalized(
      "Meyveli, çikolatalı ve özel dolgulu tatlı seçenekler.",
      "Fruity, chocolate, and special-filled sweet options.",
      "Фруктовые, шоколадные и авторские сладкие варианты.",
      "خيارات حلوة بالفواكه والشوكولاتة والحشوات الخاصة.",
      "Fruchtige, schokoladige und speziell gefüllte süße Optionen."
    )
  },
  {
    id: "savory",
    title: toLocalized("Tuzlu Kruvasanlar", "Savory Croissants", "Солёные круассаны", "كرواسان مالح", "Herzhafte Croissants"),
    note: toLocalized(
      "Dengeli tuzlu tarifler ve brunch için ideal seçenekler.",
      "Balanced savory recipes and ideal options for brunch.",
      "Сбалансированные солёные рецепты, идеальные для бранча.",
      "وصفات مالحة متوازنة وخيارات مثالية للبرانش.",
      "Ausgewogene herzhafte Rezepte und ideale Optionen für den Brunch."
    )
  },
  {
    id: "signature",
    title: toLocalized("İmza ve Özel Seçkiler", "Signature and Special Selections", "Фирменные и особые позиции", "اختيارات التوقيع والخاصة", "Signatur- und Spezialauswahl"),
    note: toLocalized(
      "Şef önerileri, premium tarifler ve vitrinin yıldızları.",
      "Chef recommendations, premium recipes, and showcase stars.",
      "Рекомендации шефа, премиум-рецепты и звёзды витрины.",
      "توصيات الشيف ووصفات مميزة ونجوم الواجهة.",
      "Empfehlungen des Chefs, Premium-Rezepte und die Stars der Vitrine."
    )
  }
];

const DEFAULT_FAQ = [
  {
    id: "faq1",
    question: toLocalized(
      "Rezervasyon gerekli mi?",
      "Is reservation required?",
      "Нужно ли бронировать?",
      "هل الحجز ضروري؟",
      "Ist eine Reservierung nötig?"
    ),
    answer: toLocalized(
      "Zorunlu değil, ancak hafta sonu ve akşam saatlerinde rezervasyon önerilir.",
      "It is not mandatory, but reservation is recommended on weekends and in evening hours.",
      "Не обязательно, но в выходные и вечером рекомендуем бронировать.",
      "ليس إلزامياً، لكن يُفضّل الحجز في عطلة نهاية الأسبوع والمساء.",
      "Nicht Pflicht, aber an Wochenenden und abends empfohlen."
    )
  },
  {
    id: "faq2",
    question: toLocalized(
      "Rezervasyon nasıl yapabilirim?",
      "How can I make a reservation?",
      "Как забронировать?",
      "كيف أحجز؟",
      "Wie reserviere ich?"
    ),
    answer: toLocalized(
      "Rezervasyon sayfasından WhatsApp veya telefon üzerinden hızlıca rezervasyon oluşturabilirsiniz.",
      "You can quickly make a reservation via WhatsApp or phone from the reservation page.",
      "Бронь можно быстро оформить через WhatsApp или по телефону на странице бронирования.",
      "يمكنكم الحجز بسرعة عبر واتساب أو الهاتف من صفحة الحجز.",
      "Über die Reservierungsseite per WhatsApp oder Telefon schnell reservieren."
    )
  },
  {
    id: "faq3",
    question: toLocalized(
      "Toplu sipariş alıyor musunuz?",
      "Do you take bulk orders?",
      "Принимаете ли вы оптовые заказы?",
      "هل تقبلون الطلبات بالجملة؟",
      "Nehmt ihr Sammelbestellungen an?"
    ),
    answer: toLocalized(
      "Evet. Etkinlik, ofis ve özel günler için toplu sipariş alıyoruz.",
      "Yes. We take bulk orders for events, offices, and special days.",
      "Да. Мы принимаем крупные заказы на мероприятия, офисы и особые дни.",
      "نعم. نستقبل طلبات بالجملة للمناسبات والمكاتب والأيام الخاصة.",
      "Ja. Wir nehmen Sammelbestellungen für Events, Büros und besondere Tage an."
    )
  },
  {
    id: "faq4",
    question: toLocalized(
      "Toplu sipariş için ne kadar önce iletişime geçmeliyim?",
      "How far in advance should I contact you for bulk orders?",
      "За сколько дней предупреждать о крупном заказе?",
      "قبل كم يجب التواصل للطلبات الكبيرة؟",
      "Wie früh sollte ich bei Sammelbestellungen Bescheid geben?"
    ),
    answer: toLocalized(
      "Yoğun günlerde en az 1 gün, büyük siparişlerde 2-3 gün önce iletişime geçmeniz önerilir.",
      "On busy days at least 1 day ahead; for large orders 2-3 days is recommended.",
      "В загруженные дни минимум за 1 день, для крупных заказов — за 2–3 дня.",
      "في الأيام المزدحمة قبل يوم واحد على الأقل، وللطلبات الكبيرة قبل 2–3 أيام.",
      "An vollen Tagen mindestens 1 Tag vorher, bei großen Bestellungen 2–3 Tage."
    )
  },
  {
    id: "faq5",
    question: toLocalized(
      "Teslimat hizmetiniz var mı?",
      "Do you offer delivery?",
      "Есть ли доставка?",
      "هل لديكم توصيل؟",
      "Bietet ihr Lieferung an?"
    ),
    answer: toLocalized(
      "Evet. Bölgesel teslimat saatleri içinde adrese teslim hizmet sunuyoruz.",
      "Yes. We provide home delivery within regional delivery hours.",
      "Да. Мы доставляем по адресу в часы региональной доставки.",
      "نعم. نقدّم التوصيل إلى العنوان ضمن ساعات التوصيل الإقليمية.",
      "Ja. Innerhalb der regionalen Lieferzeiten liefern wir nach Hause."
    )
  },
  {
    id: "faq6",
    question: toLocalized(
      "Ödeme seçenekleri nelerdir?",
      "What payment options do you accept?",
      "Какие способы оплаты?",
      "ما طرق الدفع؟",
      "Welche Zahlungsarten gibt es?"
    ),
    answer: toLocalized(
      "Nakit ve kart ile ödeme yapabilirsiniz. Online yönlendirmelerde ilgili platformun ödeme seçenekleri geçerlidir.",
      "You can pay with cash or card. For online redirects, the platform’s payment options apply.",
      "Можно платить наличными или картой. Для онлайн-переходов действуют способы оплаты платформы.",
      "يمكن الدفع نقداً أو بالبطاقة. في التوجيهات عبر الإنترنت تسري خيارات المنصة.",
      "Bar und Karte sind möglich. Bei Online-Weiterleitungen gelten die Zahlungsarten der Plattform."
    )
  },
  {
    id: "faq7",
    question: toLocalized(
      "Glutensiz seçenek var mı?",
      "Do you have gluten-free options?",
      "Есть ли безглютеновые варианты?",
      "هل توجد خيارات خالية من الغلوتين؟",
      "Gibt es glutenfreie Optionen?"
    ),
    answer: toLocalized(
      "Belirli günlerde sınırlı sayıda glutensiz ürün sunuyoruz.",
      "On certain days we offer a limited number of gluten-free products.",
      "В отдельные дни предлагаем ограниченное число безглютеновых изделий.",
      "في أيام محددة نقدّم عدداً محدوداً من المنتجات الخالية من الغلوتين.",
      "An bestimmten Tagen gibt es eine begrenzte glutenfreie Auswahl."
    )
  },
  {
    id: "faq8",
    question: toLocalized(
      "Alerjen bilgisi alabilir miyim?",
      "Can I get allergen information?",
      "Можно ли узнать об аллергенах?",
      "هل يمكنني معرفة معلومات مسببات الحساسية؟",
      "Kann ich Allergeninformationen bekommen?"
    ),
    answer: toLocalized(
      "Evet. Ürün içerikleri ve alerjen bilgileri için ekibimizden detaylı bilgi alabilirsiniz.",
      "Yes. You can get detailed ingredient and allergen information from our team.",
      "Да. Подробности по составу и аллергенам можно узнать у нашей команды.",
      "نعم. يمكنكم الحصول على تفاصيل المكونات ومسببات الحساسية من فريقنا.",
      "Ja. Zutaten und Allergene erfahren Sie bei unserem Team."
    )
  },
  {
    id: "faq9",
    question: toLocalized(
      "Menü ve fiyatlar güncel mi?",
      "Are the menu and prices current?",
      "Актуально ли меню и цены?",
      "هل القائمة والأسعار محدّثة؟",
      "Sind Speisekarte und Preise aktuell?"
    ),
    answer: toLocalized(
      "Menü sayfası düzenli olarak güncellenir. Güncel ürün ve fiyat bilgisi için menü sayfasını takip edebilirsiniz.",
      "The menu page is updated regularly. Follow the menu page for current products and prices.",
      "Страница меню регулярно обновляется. Актуальные позиции и цены смотрите там.",
      "تُحدَّث صفحة القائمة بانتظام. تابعوا صفحة القائمة للمنتجات والأسعار الحالية.",
      "Die Menüseite wird regelmäßig aktualisiert. Aktuelle Produkte und Preise stehen dort."
    )
  }
];

const PAGE_IDS = [
  "hikayemiz.html",
  "corporate.html",
  "reservation.html",
  "delivery.html",
  "wholesale.html",
  "faq.html",
  "privacy.html",
  "terms.html",
  "cookies.html"
];

const emptyPage = (eyebrow, title, lead) => ({
  eyebrow: toLocalized(eyebrow),
  title: toLocalized(title),
  lead: toLocalized(lead),
  body: toLocalized("")
});

const DEFAULT_PAGES = {
  "hikayemiz.html": emptyPage("Hikayemiz", "Point Croissant’in Yolculuğu", "Bir tariften fazlası: özenle inşa edilen bir lezzet kültürü."),
  "corporate.html": emptyPage("Kurumsal", "Point Croissant Hakkında", ""),
  "reservation.html": emptyPage("Rezervasyon", "Masa Rezervasyonu", ""),
  "delivery.html": emptyPage("Teslimat", "Antalya İçine Hızlı Teslimat", ""),
  "wholesale.html": emptyPage("Toptan", "Kurumsal Tedarik Çözümleri", ""),
  "faq.html": emptyPage("SSS", "Sıkça Sorulan Sorular", ""),
  "privacy.html": emptyPage("Yasal", "Gizlilik Politikası", "Boş bırakırsanız sitedeki mevcut yasal metin kalır."),
  "terms.html": emptyPage("Yasal", "Kullanım Şartları", "Boş bırakırsanız sitedeki mevcut yasal metin kalır."),
  "cookies.html": emptyPage("Yasal", "Çerez Politikası", "Boş bırakırsanız sitedeki mevcut yasal metin kalır.")
};

const inferProductMeta = (item) => {
  const name = normalizeLocalized(item.name);
  const desc = normalizeLocalized(item.description);
  const tag = normalizeLocalized(item.tag);
  const blob = `${name.tr} ${desc.tr}`;
  const savory = /tuzlu|peynir|trüf|truf/i.test(blob);
  const signature = /premium|şef|sef|en çok satan|en cok satan|yeni/i.test(tag.tr || "");
  const rawCat = String(item.category || "").trim();
  return {
    category: rawCat || (savory ? "savory" : "sweet"),
    signature: typeof item.signature === "boolean" ? item.signature : signature
  };
};

const normalizeProduct = (item, index = 0) => {
  const meta = inferProductMeta(item || {});
  const id = item.id || `p_${Date.now()}`;
  const fallbackPhoto = PRODUCT_PHOTOS[id] || PRODUCT_PHOTOS.p1;
  const image = normalizeLocalized(item.image, "");
  if (!image.tr || isLogoPlaceholder(image.tr)) image.tr = fallbackPhoto;
  LANGS.forEach((lang) => {
    if (lang !== "tr" && isLogoPlaceholder(image[lang])) image[lang] = "";
  });
  const stockRaw = item.stock;
  const stock =
    stockRaw === "" || stockRaw == null || Number.isNaN(Number(stockRaw)) ? null : Math.max(0, Number(stockRaw));
  return {
    id,
    name: normalizeLocalized(item.name),
    description: normalizeLocalized(item.description),
    price: Number(item.price || 0),
    tag: normalizeLocalized(item.tag),
    image,
    category: meta.category,
    signature: meta.signature,
    visible: item.visible !== false,
    sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : index + 1,
    stock
  };
};

const normalizeNav = (item, index) => {
  const fallback = DEFAULT_NAV[index] || DEFAULT_NAV[0];
  return {
    id: item.id || fallback.id || `nav_${index}`,
    href: String(item.href || fallback.href || "index.html").trim(),
    label: normalizeLocalized(item.label, fallback.label.tr),
    visible: item.visible !== false
  };
};

const normalizeFooterLink = (item, index, fallback) => ({
  id: item?.id || fallback?.id || `fl_${index}`,
  href: String(item?.href || fallback?.href || "index.html").trim(),
  label: normalizeLocalized(item?.label, fallback?.label?.tr || ""),
  visible: item?.visible !== false
});

const normalizeFooterLinks = (raw) => {
  const source = raw && typeof raw === "object" ? raw : DEFAULT_FOOTER;
  return {
    explore: (Array.isArray(source.explore) && source.explore.length ? source.explore : DEFAULT_FOOTER.explore).map(
      (item, index) => normalizeFooterLink(item, index, DEFAULT_FOOTER.explore[index])
    ),
    services: (Array.isArray(source.services) && source.services.length ? source.services : DEFAULT_FOOTER.services).map(
      (item, index) => normalizeFooterLink(item, index, DEFAULT_FOOTER.services[index])
    ),
    legal: (Array.isArray(source.legal) && source.legal.length ? source.legal : DEFAULT_FOOTER.legal).map(
      (item, index) => normalizeFooterLink(item, index, DEFAULT_FOOTER.legal[index])
    )
  };
};

const normalizeMarquee = (raw) => {
  const source = Array.isArray(raw) && raw.length ? raw : DEFAULT_MARQUEE;
  return source.map((item) => normalizeLocalized(item)).filter((item) => item.tr);
};

const normalizeSeoEntry = (value, fallback) => ({
  title: normalizeLocalized(value?.title, fallback?.title?.tr || ""),
  description: normalizeLocalized(value?.description, fallback?.description?.tr || "")
});

const normalizeSettings = (raw) => {
  const merged = { ...DEFAULT_SETTINGS, ...(raw || {}) };
  const seo = { ...DEFAULT_SEO };
  Object.keys(seo).forEach((page) => {
    seo[page] = normalizeSeoEntry((raw && raw.seo && raw.seo[page]) || {}, DEFAULT_SEO[page]);
  });
  if (raw && raw.seo) {
    Object.keys(raw.seo).forEach((page) => {
      if (!seo[page]) seo[page] = normalizeSeoEntry(raw.seo[page], { title: toLocalized(""), description: toLocalized("") });
    });
  }
  const navSource = Array.isArray(merged.navLinks) && merged.navLinks.length ? merged.navLinks : DEFAULT_NAV;
  const stats = { ...DEFAULT_SETTINGS.heroStats, ...(merged.heroStats || {}) };
  return {
    ...merged,
    address: normalizeLocalized(merged.address, DEFAULT_SETTINGS.address.tr),
    mapQuery: normalizeLocalized(merged.mapQuery, DEFAULT_SETTINGS.mapQuery.tr),
    workingHours: normalizeLocalized(merged.workingHours, DEFAULT_SETTINGS.workingHours.tr),
    whatsappGreeting: normalizeLocalized(merged.whatsappGreeting, DEFAULT_SETTINGS.whatsappGreeting.tr),
    brandTagline: normalizeLocalized(merged.brandTagline, DEFAULT_SETTINGS.brandTagline.tr),
    footerText: normalizeLocalized(merged.footerText, DEFAULT_SETTINGS.footerText.tr),
    ctaLabel: normalizeLocalized(merged.ctaLabel, DEFAULT_SETTINGS.ctaLabel.tr),
    logo: String(merged.logo || DEFAULT_LOGO).trim() || DEFAULT_LOGO,
    heroImage: String(merged.heroImage || DEFAULT_SETTINGS.heroImage).trim() || DEFAULT_SETTINGS.heroImage,
    instagram: String(merged.instagram || "").trim(),
    facebook: String(merged.facebook || "").trim(),
    tiktok: String(merged.tiktok || "").trim(),
    youtube: String(merged.youtube || "").trim(),
    twitter: String(merged.twitter || "").trim(),
    mapEmbed: String(merged.mapEmbed || "").trim(),
    ogImage: String(merged.ogImage || DEFAULT_SETTINGS.ogImage).trim() || DEFAULT_SETTINGS.ogImage,
    formWebhook: String(merged.formWebhook || "").trim(),
    openingHoursSpec: String(merged.openingHoursSpec || DEFAULT_SETTINGS.openingHoursSpec).trim(),
    brandName: String(merged.brandName || DEFAULT_SETTINGS.brandName).trim() || DEFAULT_SETTINGS.brandName,
    schemaStreet: String(merged.schemaStreet || DEFAULT_SETTINGS.schemaStreet).trim(),
    schemaLocality: String(merged.schemaLocality || DEFAULT_SETTINGS.schemaLocality).trim(),
    schemaRegion: String(merged.schemaRegion || DEFAULT_SETTINGS.schemaRegion).trim(),
    schemaPostal: String(merged.schemaPostal || DEFAULT_SETTINGS.schemaPostal).trim(),
    heroStats: {
      years: Number(stats.years || 0),
      recipes: Number(stats.recipes || 0),
      daily: Number(stats.daily || 0),
      yearsLabel: normalizeLocalized(stats.yearsLabel, DEFAULT_SETTINGS.heroStats.yearsLabel.tr),
      recipesLabel: normalizeLocalized(stats.recipesLabel, DEFAULT_SETTINGS.heroStats.recipesLabel.tr),
      dailyLabel: normalizeLocalized(stats.dailyLabel, DEFAULT_SETTINGS.heroStats.dailyLabel.tr)
    },
    navLinks: navSource.map(normalizeNav),
    seo,
    ctaHref: String(merged.ctaHref || "reservation.html").trim() || "reservation.html",
    flavorMarquee: normalizeMarquee(merged.flavorMarquee),
    footerLinks: normalizeFooterLinks(merged.footerLinks)
  };
};

const normalizeGalleryItem = (item, index) => {
  const cats = Array.isArray(item.categories)
    ? item.categories
    : String(item.category || item.categories || "")
        .split(/[\s,]+/)
        .filter(Boolean);
  const fallback =
    DEFAULT_GALLERY.find((entry) => entry.id && entry.id === item.id) ||
    DEFAULT_GALLERY[index] ||
    DEFAULT_GALLERY[0];
  let src = String(item.src || fallback.src || DEFAULT_LOGO).trim() || fallback.src;
  if (isLogoPlaceholder(src)) src = fallback.src;
  return {
    id: item.id || `g_${index}_${Date.now()}`,
    src,
    alt: normalizeLocalized(item.alt, fallback.alt.tr || "Point Croissant galeri"),
    categories: cats.length ? cats : fallback.categories || ["tatli"]
  };
};

const normalizeEvent = (item, index) => ({
  id: item.id || `e_${index}_${Date.now()}`,
  title: normalizeLocalized(item.title),
  description: normalizeLocalized(item.description),
  image: String(item.image || "").trim(),
  date: String(item.date || "").trim(),
  time: String(item.time || "").trim(),
  location: normalizeLocalized(item.location)
});

const slugify = (value) =>
  String(value || "")
    .toLocaleLowerCase("tr")
    .replace(/[^a-z0-9ğüşöçı\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || `yazi-${Date.now()}`;

const normalizeBlog = (item, index) => {
  const id = item.id || slugify(item.title && item.title.tr) || `post_${index}`;
  const reserved = {
    "imza-kruvasan": "blog-imza-kruvasan.html",
    "kahve-eslesmesi": "blog-kahve-eslesmesi.html"
  };
  const fallbackPhoto = BLOG_PHOTOS[id] || BLOG_PHOTOS["imza-kruvasan"];
  let image = String(item.image || fallbackPhoto).trim() || fallbackPhoto;
  if (isLogoPlaceholder(image)) image = fallbackPhoto;
  return {
    id,
    href: String(item.href || reserved[id] || `blog-post.html?id=${id}`).trim(),
    image,
    tag: normalizeLocalized(item.tag),
    title: normalizeLocalized(item.title),
    excerpt: normalizeLocalized(item.excerpt),
    body: normalizeLocalized(item.body),
    published: item.published !== false,
    publishedAt: String(item.publishedAt || "").trim()
  };
};

const normalizeMenuCat = (item, index) => {
  const fallback = DEFAULT_MENU_CATS[index] || DEFAULT_MENU_CATS[0];
  const id = String(item.id || fallback.id || slugify(item.title && item.title.tr) || `cat_${index}`).trim();
  return {
    id,
    kind: item.kind === "signature" || id === "signature" ? "signature" : "standard",
    title: normalizeLocalized(item.title, fallback.title.tr),
    note: normalizeLocalized(item.note, fallback.note?.tr || "")
  };
};

const normalizeFaq = (item, index) => ({
  id: item.id || `faq_${index}_${Date.now()}`,
  question: normalizeLocalized(item.question),
  answer: normalizeLocalized(item.answer)
});

const normalizePage = (pageId, raw) => {
  const fallback = DEFAULT_PAGES[pageId] || emptyPage("", "", "");
  const value = raw || {};
  return {
    eyebrow: normalizeLocalized(value.eyebrow, fallback.eyebrow.tr),
    title: normalizeLocalized(value.title, fallback.title.tr),
    lead: normalizeLocalized(value.lead, fallback.lead.tr),
    body: normalizeLocalized(value.body, fallback.body.tr)
  };
};

const normalizeGalleryFilter = (item, index) => {
  const fallback = DEFAULT_GALLERY_FILTERS[index] || { id: `f_${index}`, label: toLocalized("") };
  return {
    id: String(item.id || fallback.id || slugify(item.label && item.label.tr) || `filter_${index}`).trim(),
    label: normalizeLocalized(item.label, fallback.label.tr)
  };
};

const normalizeInbox = (item, index) => ({
  id: item.id || `msg_${index}_${Date.now()}`,
  name: String(item.name || "").trim(),
  email: String(item.email || "").trim(),
  phone: String(item.phone || "").trim(),
  message: String(item.message || "").trim(),
  lang: String(item.lang || "tr").trim(),
  createdAt: String(item.createdAt || new Date().toISOString())
});

const loadSettings = () => {
  const current = readJson(SETTINGS_KEY, null);
  if (current) return normalizeSettings(current);
  const remote = remotePack();
  if (remote && remote.settings) return normalizeSettings(remote.settings);
  const legacy = readJson(LEGACY_SETTINGS_KEY, null);
  if (legacy) {
    const migrated = normalizeSettings(legacy);
    writeJson(SETTINGS_KEY, migrated);
    return migrated;
  }
  return normalizeSettings(DEFAULT_SETTINGS);
};

const saveSettings = (settings) => writeJson(SETTINGS_KEY, normalizeSettings(settings));

const loadProducts = () => {
  const source = pickStoredList(CATALOG_KEY, "products", DEFAULT_PRODUCTS);
  const hadPlaceholder = source.some((item) => {
    const image = item?.image;
    if (typeof image === "string") return isLogoPlaceholder(image);
    if (image && typeof image === "object") {
      return ["tr", "en", "ru", "ar", "de"].some((lang) => isLogoPlaceholder(image[lang]));
    }
    return false;
  });
  const normalized = source.map(normalizeProduct);
  const parsed = readJson(CATALOG_KEY, null);
  if (parsed && hadPlaceholder) writeJson(CATALOG_KEY, normalized);
  return normalized;
};

const saveProducts = (products) => writeJson(CATALOG_KEY, products.map(normalizeProduct));

const loadGallery = () => {
  const source = pickStoredList(GALLERY_KEY, "gallery", DEFAULT_GALLERY);
  const hadPlaceholder = source.some((item) => isLogoPlaceholder(item?.src));
  const filtered = source.filter((item, index) => {
    if (index < DEFAULT_GALLERY.length) return true;
    const src = String(item?.src || "");
    return Boolean(src) && !isLogoPlaceholder(src);
  });
  const normalized = filtered.map(normalizeGalleryItem);
  const parsed = readJson(GALLERY_KEY, null);
  if (parsed && (hadPlaceholder || filtered.length !== source.length)) writeJson(GALLERY_KEY, normalized);
  return normalized;
};

const saveGallery = (items) => writeJson(GALLERY_KEY, items.map(normalizeGalleryItem));

const loadEvents = () => pickStoredList(EVENTS_KEY, "events", DEFAULT_EVENTS).map(normalizeEvent);

const saveEvents = (items) => writeJson(EVENTS_KEY, items.map(normalizeEvent));

const loadBlog = () => {
  const source = pickStoredList(BLOG_KEY, "blog", DEFAULT_BLOG);
  const hadPlaceholder = source.some((item) => isLogoPlaceholder(item?.image));
  const normalized = source.map(normalizeBlog);
  const parsed = readJson(BLOG_KEY, null);
  if (parsed && hadPlaceholder) writeJson(BLOG_KEY, normalized);
  return normalized;
};

const saveBlog = (items) => writeJson(BLOG_KEY, items.map(normalizeBlog));

const loadMenuCats = () => {
  const parsed = readJson(MENU_CATS_KEY, null);
  const remote = remotePack();
  const source =
    Array.isArray(parsed) && parsed.length
      ? parsed
      : remote && Array.isArray(remote.menuCats) && remote.menuCats.length
        ? remote.menuCats
        : DEFAULT_MENU_CATS;
  return source.map(normalizeMenuCat);
};

const saveMenuCats = (items) => writeJson(MENU_CATS_KEY, items.map(normalizeMenuCat));

const loadFaq = () => pickStoredList(FAQ_KEY, "faq", DEFAULT_FAQ).map(normalizeFaq);
const saveFaq = (items) => writeJson(FAQ_KEY, items.map(normalizeFaq));

const loadPages = () => {
  const source = pickStoredObject(PAGES_KEY, "pages", DEFAULT_PAGES);
  const pages = {};
  PAGE_IDS.forEach((id) => {
    pages[id] = normalizePage(id, source[id]);
  });
  Object.keys(source || {}).forEach((id) => {
    if (!pages[id]) pages[id] = normalizePage(id, source[id]);
  });
  return pages;
};

const getPageOverride = (pageId) => {
  const parsed = readJson(PAGES_KEY, null);
  const remote = remotePack();
  const source =
    parsed && typeof parsed === "object" && parsed[pageId]
      ? parsed[pageId]
      : remote && remote.pages && typeof remote.pages === "object" && remote.pages[pageId]
        ? remote.pages[pageId]
        : null;
  if (!source) return null;
  return {
    eyebrow: normalizeLocalized(source.eyebrow),
    title: normalizeLocalized(source.title),
    lead: normalizeLocalized(source.lead),
    body: normalizeLocalized(source.body)
  };
};

const savePages = (pages) => {
  const next = {};
  Object.keys(pages || {}).forEach((id) => {
    next[id] = normalizePage(id, pages[id]);
  });
  writeJson(PAGES_KEY, next);
};

const loadInbox = () => {
  const parsed = readJson(INBOX_KEY, null);
  const source = Array.isArray(parsed) ? parsed : [];
  return source.map(normalizeInbox);
};

const saveInbox = (items) => writeJson(INBOX_KEY, items.map(normalizeInbox));

const loadGalleryFilters = () =>
  pickStoredList(GALLERY_FILTERS_KEY, "galleryFilters", DEFAULT_GALLERY_FILTERS).map(normalizeGalleryFilter);

const saveGalleryFilters = (items) => writeJson(GALLERY_FILTERS_KEY, items.map(normalizeGalleryFilter));

const LOCAL_KEYS = [
  SETTINGS_KEY,
  CATALOG_KEY,
  GALLERY_KEY,
  EVENTS_KEY,
  BLOG_KEY,
  MENU_CATS_KEY,
  FAQ_KEY,
  PAGES_KEY,
  INBOX_KEY,
  GALLERY_FILTERS_KEY,
  "pc_cms_content_v1"
];

const exportPack = () => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  settings: loadSettings(),
  products: loadProducts(),
  gallery: loadGallery(),
  events: loadEvents(),
  blog: loadBlog(),
  menuCats: loadMenuCats(),
  faq: loadFaq(),
  pages: loadPages(),
  inbox: loadInbox(),
  galleryFilters: loadGalleryFilters(),
  cms: readJson("pc_cms_content_v1", {})
});

const importPack = (pack) => {
  if (!pack || typeof pack !== "object") throw new Error("INVALID_PACK");
  if (pack.settings) writeJson(SETTINGS_KEY, normalizeSettings(pack.settings));
  if (Array.isArray(pack.products)) writeJson(CATALOG_KEY, pack.products.map(normalizeProduct));
  if (Array.isArray(pack.gallery)) writeJson(GALLERY_KEY, pack.gallery.map(normalizeGalleryItem));
  if (Array.isArray(pack.events)) writeJson(EVENTS_KEY, pack.events.map(normalizeEvent));
  if (Array.isArray(pack.blog)) writeJson(BLOG_KEY, pack.blog.map(normalizeBlog));
  if (Array.isArray(pack.menuCats)) writeJson(MENU_CATS_KEY, pack.menuCats.map(normalizeMenuCat));
  if (Array.isArray(pack.faq)) writeJson(FAQ_KEY, pack.faq.map(normalizeFaq));
  if (pack.pages) savePages(pack.pages);
  if (Array.isArray(pack.inbox)) writeJson(INBOX_KEY, pack.inbox.map(normalizeInbox));
  if (Array.isArray(pack.galleryFilters)) writeJson(GALLERY_FILTERS_KEY, pack.galleryFilters.map(normalizeGalleryFilter));
  if (pack.cms && typeof pack.cms === "object") writeJson("pc_cms_content_v1", pack.cms);
};

const clearLocalOverrides = () => {
  LOCAL_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
};

const MEDIA_PREFIX = "pcimg:";
const MEDIA_DB_NAME = "pc_media_v1";
const MEDIA_STORE = "images";
const MEDIA_MAX_BYTES = 8 * 1024 * 1024;
const mediaUrlCache = new Map();

const isMediaKey = (src) => String(src || "").startsWith(MEDIA_PREFIX);

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsDataURL(blob);
  });

const loadHtmlImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Görsel açılamadı. JPG, PNG veya WEBP seçin."));
    img.src = src;
  });

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Görsel sıkıştırılamadı."));
        else resolve(blob);
      },
      type,
      quality
    );
  });

const compressImageFile = async (file) => {
  if (!(file instanceof Blob)) {
    throw new Error("Geçerli bir görsel seçin (JPG, PNG veya WEBP).");
  }
  const type = String(file.type || "").toLowerCase();
  if (type && !type.startsWith("image/")) {
    throw new Error("Geçerli bir görsel seçin (JPG, PNG veya WEBP).");
  }
  if (file.size > MEDIA_MAX_BYTES) {
    throw new Error("Görsel çok büyük. 8 MB altı bir fotoğraf seçin.");
  }
  const dataUrl = await blobToDataUrl(file);
  const img = await loadHtmlImage(dataUrl);
  const keepAlpha = /png|webp|gif/i.test(type);
  const maxEdge = keepAlpha ? 1200 : 1600;
  const scale = Math.min(1, maxEdge / Math.max(img.width || 1, img.height || 1));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d");
  if (!keepAlpha) {
    ctx.fillStyle = "#fff7f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  if (keepAlpha) {
    const png = await canvasToBlob(canvas, "image/png");
    if (png.size <= 450000) return png;
  }
  return canvasToBlob(canvas, "image/jpeg", 0.88);
};

const openMediaDb = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(MEDIA_DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(MEDIA_STORE)) {
        req.result.createObjectStore(MEDIA_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Fotoğraf deposu açılamadı."));
  });

const putMediaBlob = async (id, blob) => {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, "readwrite");
    tx.objectStore(MEDIA_STORE).put(blob, id);
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error || new Error("Fotoğraf kaydedilemedi."));
  });
};

const getMediaBlob = async (id) => {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, "readonly");
    const req = tx.objectStore(MEDIA_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error || new Error("Fotoğraf okunamadı."));
  });
};

const resolveMediaSrc = async (src) => {
  const value = String(src || "").trim();
  if (!isMediaKey(value)) return value;
  if (mediaUrlCache.has(value)) return mediaUrlCache.get(value);
  const blob = await getMediaBlob(value.slice(MEDIA_PREFIX.length));
  if (!blob) return value;
  const url = URL.createObjectURL(blob);
  mediaUrlCache.set(value, url);
  return url;
};

const saveMediaBlob = async (blob) => {
  if (!(blob instanceof Blob)) throw new Error("Geçerli bir görsel seçin (JPG, PNG veya WEBP).");
  try {
    const id = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    await putMediaBlob(id, blob);
    const key = `${MEDIA_PREFIX}${id}`;
    mediaUrlCache.set(key, URL.createObjectURL(blob));
    return key;
  } catch {
    return blobToDataUrl(blob);
  }
};

const saveMediaFile = async (file) => saveMediaBlob(await compressImageFile(file));

const hydrateMedia = async (root = document) => {
  const scope = root instanceof Element || root instanceof Document ? root : document;
  const nodes = scope instanceof Element && scope.matches?.("img") ? [scope] : [...scope.querySelectorAll("img")];
  await Promise.all(
    nodes.map(async (el) => {
      const raw = el.getAttribute("src") || "";
      if (!isMediaKey(raw) || el.dataset.pcHydrated === raw) return;
      el.dataset.pcHydrated = raw;
      el.dataset.pcSrc = raw;
      try {
        const resolved = await resolveMediaSrc(raw);
        if (resolved && resolved !== raw) el.setAttribute("src", resolved);
      } catch {
        // Keep the stored key; a missing blob should not retry forever.
      }
    })
  );
};

const observeMedia = () => {
  if (window.__pcMediaObserver) return;
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.target instanceof HTMLImageElement) {
        const src = mutation.target.getAttribute("src") || "";
        if (isMediaKey(src)) hydrateMedia(mutation.target);
      }
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) hydrateMedia(node);
        else if (node instanceof HTMLElement) hydrateMedia(node);
      });
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"]
  });
  window.__pcMediaObserver = observer;
};

window.PCMedia = {
  PREFIX: MEDIA_PREFIX,
  isMediaKey,
  compressFile: compressImageFile,
  saveBlob: saveMediaBlob,
  saveFile: saveMediaFile,
  resolveSrc: resolveMediaSrc,
  hydrate: hydrateMedia
};

const bootMedia = () => {
  hydrateMedia(document);
  observeMedia();
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootMedia);
else bootMedia();

window.PCStore = {
  LANGS,
  DEFAULT_LOGO,
  DEFAULT_SETTINGS,
  DEFAULT_PRODUCTS,
  DEFAULT_GALLERY,
  DEFAULT_EVENTS,
  DEFAULT_BLOG,
  DEFAULT_MENU_CATS,
  DEFAULT_NAV,
  DEFAULT_SEO,
  DEFAULT_FAQ,
  DEFAULT_PAGES,
  DEFAULT_FOOTER,
  DEFAULT_GALLERY_FILTERS,
  DEFAULT_MARQUEE,
  PAGE_IDS,
  toLocalized,
  normalizeLocalized,
  getLang,
  getLocalized,
  slugify,
  loadSettings,
  saveSettings,
  normalizeSettings,
  loadProducts,
  saveProducts,
  normalizeProduct,
  loadGallery,
  saveGallery,
  loadEvents,
  saveEvents,
  loadBlog,
  saveBlog,
  loadMenuCats,
  saveMenuCats,
  loadFaq,
  saveFaq,
  loadPages,
  getPageOverride,
  savePages,
  loadInbox,
  saveInbox,
  loadGalleryFilters,
  saveGalleryFilters,
  exportPack,
  importPack,
  clearLocalOverrides
};
})();
