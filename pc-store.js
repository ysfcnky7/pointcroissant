(() => {
const SETTINGS_KEY = "pc_settings_v3";
const LEGACY_SETTINGS_KEY = "pc_settings_v2";
const CATALOG_KEY = "pc_catalog_v1";
const GALLERY_KEY = "pc_gallery_v1";
const EVENTS_KEY = "pc_events_v1";
const BLOG_KEY = "pc_blog_v1";
const MENU_CATS_KEY = "pc_menu_cats_v1";

const DEFAULT_LOGO = "assets/logo-point-croissant.webp";
const PRODUCT_PHOTOS = {
  p1: "assets/croissant-chocolate.png",
  p2: "assets/croissant-pistachio.png",
  p3: "assets/croissant-blueberry.png",
  p4: "assets/croissant-truffle.png"
};
const isLogoPlaceholder = (src) => /logo-point-croissant/i.test(String(src || ""));
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
  return normalized[lang] || normalized.tr || "";
};

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const DEFAULT_NAV = [
  { id: "home", href: "index.html", label: toLocalized("Anasayfa", "Home", "Главная", "الرئيسية", "Startseite"), visible: true },
  { id: "story", href: "hikayemiz.html", label: toLocalized("Hikayemiz", "Our Story", "Наша история", "قصتنا", "Unsere Geschichte"), visible: true },
  { id: "flavors", href: "lezzetler.html", label: toLocalized("Lezzetler", "Flavors", "Вкусы", "النكهات", "Sorten"), visible: true },
  { id: "gallery", href: "index.html#galeri", label: toLocalized("Galeri", "Gallery", "Галерея", "المعرض", "Galerie"), visible: true },
  { id: "blog", href: "blog.html", label: toLocalized("Tarifler", "Recipes", "Рецепты", "الوصفات", "Rezepte"), visible: true },
  { id: "contact", href: "index.html#siparis", label: toLocalized("İletişim", "Contact", "Контакты", "تواصل", "Kontakt"), visible: true }
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
  ctaHref: "reservation.html"
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
    signature: true
  },
  {
    id: "p2",
    name: toLocalized("Fıstık Supreme"),
    description: toLocalized("Antep fıstık kreması, çıtır fıstık parçası ve tereyağlı hamur."),
    price: 225,
    tag: toLocalized("Şef Önerisi"),
    image: PRODUCT_PHOTOS.p2,
    category: "sweet",
    signature: true
  },
  {
    id: "p3",
    name: toLocalized("Yaban Mersinli Danish"),
    description: toLocalized("İpeksi krema ve meyve dolgusu ile ferah, dengeli tat."),
    price: 215,
    tag: toLocalized("Yeni"),
    image: PRODUCT_PHOTOS.p3,
    category: "sweet",
    signature: true
  },
  {
    id: "p4",
    name: toLocalized("Trüf Mantarlı Tuzlu"),
    description: toLocalized("Trüf mantarlı tuzlu kruvasan."),
    price: 235,
    tag: toLocalized("Premium"),
    image: PRODUCT_PHOTOS.p4,
    category: "savory",
    signature: true
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
  { id: "g5", src: "assets/croissant-coffee.png", alt: toLocalized("Kahve eşleşmesi", "Coffee pairing", "Сочетание с кофе"), categories: ["tatli"] },
  { id: "g6", src: "assets/interior-main.webp", alt: toLocalized("Point Croissant mekan arka planı"), categories: ["premium"] }
];

const DEFAULT_EVENTS = [
  {
    id: "e1",
    title: toLocalized("Barista Workshop", "Barista Workshop", "Воркшоп бариста"),
    description: toLocalized("Her cumartesi 11:00 - 13:00.", "Every Saturday 11:00 - 13:00.", "Каждую субботу 11:00 - 13:00.")
  },
  {
    id: "e2",
    title: toLocalized("Kruvasan Atölyesi", "Croissant Workshop", "Мастер-класс по круассанам"),
    description: toLocalized("Ayda iki kez profesyonel eğitim.", "Professional training twice a month.", "Профессиональное обучение дважды в месяц.")
  },
  {
    id: "e3",
    title: toLocalized("Private Brunch", "Private Brunch", "Закрытый бранч"),
    description: toLocalized("10-30 kişilik kurumsal organizasyon.", "Corporate events for 10-30 guests.", "Корпоративные мероприятия на 10–30 гостей.")
  }
];

const DEFAULT_BLOG = [
  {
    id: "imza-kruvasan",
    href: "blog-imza-kruvasan.html",
    image: BLOG_PHOTOS["imza-kruvasan"],
    tag: toLocalized("İmza kruvasan", "Signature croissant", "Фирменный круассан"),
    title: toLocalized("İmza Kruvasan Nasıl Yapılır?", "How to Make a Signature Croissant?", "Как готовить фирменный круассан?"),
    excerpt: toLocalized(
      "Kat kat dokusunu koruyan, hacimli ve dengeli hamur tekniğinin püf noktaları.",
      "Key techniques for layered texture and balanced dough.",
      "Ключевые приёмы слоёной текстуры и сбалансированного теста."
    ),
    body: toLocalized(
      "İmza kruvasanın temelinde üç şey vardır: doğru hamur yapısı, kontrollü katlama ve sabırlı mayalama. Dışının çıtır, içinin hafif ve katmanlı olması için sürecin her adımı dikkat ister.\n\nKruvasanın en kritik adımı hamurun soğuk zincirde dinlenmesidir. Hamur ısındığında tereyağı katmanlara doğru şekilde dağılmaz; bu da pişince kabarmayı ve katman netliğini düşürür.\n\nTereyağı katlarını eşit dağıtmak için her katlamadan sonra hamuru ortalama 25-30 dakika buzdolabında dinlendirin. Bu kısa dinlenme, hamurun tekrar toparlanmasını sağlar ve açma sırasında yırtılmayı azaltır.\n\nSon mayalamada ortam sıcaklığının 24-26 derece aralığında olması önerilir. Çok düşük sıcaklıkta hacim yavaş gelişir, çok yüksek sıcaklıkta ise tereyağı katmanlardan taşarak yapıyı bozabilir.\n\nPişirme aşamasında önceden ısıtılmış fırın kullanın ve ilk dakikalarda kapağı açmamaya özen gösterin. Bu sayede kruvasanlar güçlü bir ilk kabarma alır ve dış yüzeyde dengeli bir renk oluşur.\n\nServis öncesi kruvasanları kısa bir süre tel ızgara üzerinde dinlendirmek, alt yüzeydeki nemi azaltır ve çıtırlığı korur. Özellikle dolgu eklenecekse bu adım lezzet kadar doku için de fark yaratır."
    )
  },
  {
    id: "kahve-eslesmesi",
    href: "blog-kahve-eslesmesi.html",
    image: BLOG_PHOTOS["kahve-eslesmesi"],
    tag: toLocalized("Kahve eşleşmesi", "Coffee pairing", "Сочетание с кофе"),
    title: toLocalized("Kahve ile Kruvasan Eşleşmesi", "Coffee and Croissant Pairing", "Круассан и кофе"),
    excerpt: toLocalized(
      "Damak zevkine uygun en doğru kahve ve kruvasan uyumunu keşfedin.",
      "Discover the right coffee and croissant match for your taste.",
      "Подберите идеальную пару кофе и круассана по своему вкусу."
    ),
    body: toLocalized(
      "Sade tereyağlı kruvasanla filtre kahve daha dengeli bir tat verir.\n\nÇikolatalı lezzetlerde orta kavrum espresso bazlı içecekler öne çıkar.\n\nMeyveli kruvasanlar için soğuk demleme kahveler ferah bir seçimdir."
    )
  }
];

const DEFAULT_MENU_CATS = [
  {
    id: "sweet",
    title: toLocalized("Tatlı Kruvasanlar", "Sweet Croissants", "Сладкие круассаны"),
    note: toLocalized(
      "Meyveli, çikolatalı ve özel dolgulu tatlı seçenekler.",
      "Fruity, chocolate, and special-filled sweet options.",
      "Фруктовые, шоколадные и авторские сладкие варианты."
    )
  },
  {
    id: "savory",
    title: toLocalized("Tuzlu Kruvasanlar", "Savory Croissants", "Солёные круассаны"),
    note: toLocalized(
      "Dengeli tuzlu tarifler ve brunch için ideal seçenekler.",
      "Balanced savory recipes and ideal options for brunch.",
      "Сбалансированные солёные рецепты, идеальные для бранча."
    )
  },
  {
    id: "signature",
    title: toLocalized("İmza ve Özel Seçkiler", "Signature and Special Selections", "Фирменные и особые позиции"),
    note: toLocalized(
      "Şef önerileri, premium tarifler ve vitrinin yıldızları.",
      "Chef recommendations, premium recipes, and showcase stars.",
      "Рекомендации шефа, премиум-рецепты и звёзды витрины."
    )
  }
];

const inferProductMeta = (item) => {
  const name = normalizeLocalized(item.name);
  const desc = normalizeLocalized(item.description);
  const tag = normalizeLocalized(item.tag);
  const blob = `${name.tr} ${desc.tr}`;
  const savory = /tuzlu|peynir|trüf|truf/i.test(blob);
  const signature = /premium|şef|sef|en çok satan|en cok satan|yeni/i.test(tag.tr || "");
  return {
    category: item.category === "savory" || savory ? "savory" : "sweet",
    signature: typeof item.signature === "boolean" ? item.signature : signature
  };
};

const normalizeProduct = (item) => {
  const meta = inferProductMeta(item || {});
  const id = item.id || `p_${Date.now()}`;
  const fallbackPhoto = PRODUCT_PHOTOS[id] || PRODUCT_PHOTOS.p1;
  const image = normalizeLocalized(item.image, fallbackPhoto);
  ["tr", "en", "ru", "ar", "de"].forEach((lang) => {
    if (!image[lang] || isLogoPlaceholder(image[lang])) image[lang] = fallbackPhoto;
  });
  return {
    id,
    name: normalizeLocalized(item.name),
    description: normalizeLocalized(item.description),
    price: Number(item.price || 0),
    tag: normalizeLocalized(item.tag),
    image,
    category: meta.category,
    signature: meta.signature
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
    ctaHref: String(merged.ctaHref || "reservation.html").trim() || "reservation.html"
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
  description: normalizeLocalized(item.description)
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
    body: normalizeLocalized(item.body)
  };
};

const normalizeMenuCat = (item, index) => {
  const fallback = DEFAULT_MENU_CATS[index] || DEFAULT_MENU_CATS[0];
  return {
    id: item.id || fallback.id,
    title: normalizeLocalized(item.title, fallback.title.tr),
    note: normalizeLocalized(item.note, fallback.note.tr)
  };
};

const loadSettings = () => {
  const current = readJson(SETTINGS_KEY, null);
  if (current) return normalizeSettings(current);
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
  const parsed = readJson(CATALOG_KEY, null);
  const source = Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_PRODUCTS;
  const hadPlaceholder = source.some((item) => {
    const image = item?.image;
    if (typeof image === "string") return isLogoPlaceholder(image);
    if (image && typeof image === "object") {
      return ["tr", "en", "ru", "ar", "de"].some((lang) => isLogoPlaceholder(image[lang]));
    }
    return false;
  });
  const normalized = source.map(normalizeProduct);
  if (parsed && hadPlaceholder) writeJson(CATALOG_KEY, normalized);
  return normalized;
};

const saveProducts = (products) => writeJson(CATALOG_KEY, products.map(normalizeProduct));

const loadGallery = () => {
  const parsed = readJson(GALLERY_KEY, null);
  const source = Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_GALLERY;
  const hadPlaceholder = source.some((item) => isLogoPlaceholder(item?.src));
  const filtered = source.filter((item, index) => {
    if (index < DEFAULT_GALLERY.length) return true;
    const src = String(item?.src || "");
    return Boolean(src) && !isLogoPlaceholder(src);
  });
  const normalized = filtered.map(normalizeGalleryItem);
  if (parsed && (hadPlaceholder || filtered.length !== source.length)) writeJson(GALLERY_KEY, normalized);
  return normalized;
};

const saveGallery = (items) => writeJson(GALLERY_KEY, items.map(normalizeGalleryItem));

const loadEvents = () => {
  const parsed = readJson(EVENTS_KEY, null);
  const source = Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_EVENTS;
  return source.map(normalizeEvent);
};

const saveEvents = (items) => writeJson(EVENTS_KEY, items.map(normalizeEvent));

const loadBlog = () => {
  const parsed = readJson(BLOG_KEY, null);
  const source = Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_BLOG;
  const hadPlaceholder = source.some((item) => isLogoPlaceholder(item?.image));
  const normalized = source.map(normalizeBlog);
  if (parsed && hadPlaceholder) writeJson(BLOG_KEY, normalized);
  return normalized;
};

const saveBlog = (items) => writeJson(BLOG_KEY, items.map(normalizeBlog));

const loadMenuCats = () => {
  const parsed = readJson(MENU_CATS_KEY, null);
  const source = Array.isArray(parsed) && parsed.length === 3 ? parsed : DEFAULT_MENU_CATS;
  return DEFAULT_MENU_CATS.map((fallback, index) => normalizeMenuCat(source[index] || fallback, index));
};

const saveMenuCats = (items) => writeJson(MENU_CATS_KEY, items.map(normalizeMenuCat));

window.PCStore = {
  DEFAULT_LOGO,
  DEFAULT_SETTINGS,
  DEFAULT_PRODUCTS,
  DEFAULT_GALLERY,
  DEFAULT_EVENTS,
  DEFAULT_BLOG,
  DEFAULT_MENU_CATS,
  DEFAULT_NAV,
  DEFAULT_SEO,
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
  saveMenuCats
};
})();
