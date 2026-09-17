const NAV_LINKS = [
  { href: "index.html", label: "Anasayfa" },
  { href: "hikayemiz.html", label: "Hikayemiz" },
  { href: "lezzetler.html", label: "Lezzetler" },
  { href: "index.html#galeri", label: "Galeri" },
  { href: "blog.html", label: "Tarifler" },
  { href: "index.html#siparis", label: "İletişim" }
];

const getStoreSettings = () =>
  window.PCStore && typeof window.PCStore.loadSettings === "function" ? window.PCStore.loadSettings() : null;

const getStoreLocalized = (value, lang = activeLang) => {
  if (window.PCStore && typeof window.PCStore.getLocalized === "function") {
    return window.PCStore.getLocalized(value, lang);
  }
  if (value && typeof value === "object") return value[lang] || value.tr || "";
  return String(value || "");
};

const escapeChrome = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const I18N_STORAGE_KEY = "pc_lang_v1";
const SUPPORTED_LANGS = ["tr", "en", "ru", "ar", "de"];
const OG_LOCALES = {
  tr: "tr_TR",
  en: "en_US",
  ru: "ru_RU",
  ar: "ar_SA",
  de: "de_DE"
};
const ATTRS_TO_TRANSLATE = ["placeholder", "title", "aria-label", "alt"];
const originalTextNodes = new WeakMap();
const originalAttrValues = new WeakMap();
const originalTitle = document.title;
let activeLang = "tr";
let i18nObserver = null;
const SITE_ORIGIN = "https://pointcroissant.com";
const SOFTENWISE_ORIGIN = "https://softenwise.com";
const OG_IMAGE = `${SITE_ORIGIN}/assets/og-share.jpg`;
const OG_IMAGE_ALT = "Point Croissant Antalya cafe ve bakery";
const OG_ARTICLE_PAGES = new Set(["blog-imza-kruvasan.html", "blog-kahve-eslesmesi.html", "blog-post.html"]);
const SCHEMA_IDS = {
  website: `${SITE_ORIGIN}/#website`,
  localBusiness: `${SITE_ORIGIN}/#localbusiness`,
  softenwiseOrg: `${SOFTENWISE_ORIGIN}/#organization`
};
const SCHEMA_CONTACT = {
  telephone: "+905323150777",
  email: "hello@pointcroissant.com",
  streetAddress: "Güzeloba Mah. Çağlayangil Cad. No:38 / B",
  addressLocality: "Muratpaşa",
  addressRegion: "Antalya",
  postalCode: "07230",
  addressCountry: "TR"
};
/** Marka + arama yazımı varyantları (yalnızca şema / ana sayfa keywords; içerik doldurma değil). */
const BRAND_ALTERNATE_NAMES = [
  "Point Croissant Cafe & Bakery",
  "pointcroissant",
  "Point Croissant Antalya",
  "Point kruvasan",
  "point kruvasan",
  "Point kruvasan Antalya"
];

const SEO_HOME_KEYWORDS =
  "Point Croissant, Point Croissant Antalya, point kruvasan, Point kruvasan, point croissant, Antalya kruvasan cafe, Güzeloba Muratpaşa";

const BREADCRUMB_NAMES = {
  "hikayemiz.html": "Hikayemiz",
  "lezzetler.html": "Lezzetler",
  "menu.html": "Menü",
  "blog.html": "Blog",
  "blog-imza-kruvasan.html": "İmza Kruvasan Rehberi",
  "blog-kahve-eslesmesi.html": "Kahve Eşleşmesi",
  "blog-post.html": "Blog",
  "events.html": "Etkinlikler",
  "corporate.html": "Kurumsal",
  "faq.html": "Sıkça Sorulan Sorular",
  "reservation.html": "Rezervasyon",
  "delivery.html": "Teslimat",
  "wholesale.html": "Toptan Satış",
  "privacy.html": "Gizlilik Politikası",
  "terms.html": "Kullanım Şartları",
  "cookies.html": "Çerez Politikası"
};

const SEO_DESCRIPTIONS = {
  "index.html":
    "Point Croissant Antalya resmi web sitesi. Güzeloba, Muratpaşa’da cafe ve bakery: imza kruvasanlar, menü, rezervasyon ve iletişim.",
  "hikayemiz.html": "Point Croissant hikayesi, üretim anlayışı ve marka yolculuğu.",
  "lezzetler.html": "Point Croissant Antalya lezzetleri: imza kruvasanlar, öne çıkan ürünler ve sipariş için iletişim bilgileri.",
  "menu.html": "Point Croissant Antalya menü: güncel fiyatlar, kategorili kruvasan ve cafe ürünleri.",
  "blog.html": "Kruvasan, kahve ve servis önerileri için Point Croissant blog içerikleri.",
  "blog-imza-kruvasan.html": "İmza kruvasan hazırlama rehberi, püf noktaları ve üretim önerileri.",
  "blog-kahve-eslesmesi.html": "Kahve ve kruvasan eşleşmesi için pratik öneriler ve lezzet uyumları.",
  "blog-post.html": "Point Croissant blog yazısı.",
  "events.html": "Point Croissant etkinlikleri ve özel gün organizasyon bilgileri.",
  "corporate.html": "Kurumsal iş birliği, marka bilgisi ve Point Croissant hakkında detaylar.",
  "faq.html": "Sıkça sorulan sorular: rezervasyon, teslimat, toplu sipariş ve daha fazlası.",
  "reservation.html": "Point Croissant masa rezervasyonu için WhatsApp ve telefonla hızlı iletişim.",
  "delivery.html": "Antalya içi teslimat saatleri, sipariş detayları ve iletişim seçenekleri.",
  "wholesale.html": "Toptan ve kurumsal tedarik çözümleri için teklif ve iletişim bilgileri.",
  "privacy.html": "Point Croissant Gizlilik Politikası metni ve kişisel veri işleme esasları.",
  "terms.html": "Point Croissant Kullanım Şartları ve site kullanımına ilişkin kurallar.",
  "cookies.html": "Point Croissant Çerez Politikası ve çerez tercihleri hakkında bilgiler."
};

const I18N_TEXT = {
  en: {
    "Anasayfa": "Home",
    "Hikayemiz": "Our Story",
    "Lezzetler": "Flavors",
    "Galeri": "Gallery",
    "Tarifler": "Recipes",
    "İletişim": "Contact",
    "Sipariş Ver": "Order Now",
    "Keşfet": "Explore",
    "Menü": "Menu",
    "Etkinlikler": "Events",
    "Hizmetler": "Services",
    "Rezervasyon": "Reservation",
    "Teslimat": "Delivery",
    "Toptan": "Wholesale",
    "SSS": "FAQ",
    "Yasal": "Legal",
    "Gizlilik Politikası": "Privacy Policy",
    "Kullanım Şartları": "Terms of Use",
    "Çerez Politikası": "Cookie Policy",
    "Günün en keyifli molası için taptaze kruvasanlar ve özenli kahve.": "Fresh croissants and carefully brewed coffee for the best break of your day.",
    "Antalya, Türkiye": "Antalya, Turkey",
    "Menüyü aç/kapat": "Open/close menu",
    "Dil seçimi": "Language selection",
    "Güne Lezzetli Bir Başlangıç": "A Delicious Start to Your Day",
    "Çıtır katmanlar, özel reçeteler ve özenle hazırlanan sunumlar. Her lokmada kaliteyi hissedin.": "Crispy layers, signature recipes, and carefully crafted presentation. Feel quality in every bite.",
    "Antalya · Cafe & Bakery": "Antalya · Cafe & Bakery",
    "Keşfetmeye devam et": "Keep exploring",
    "Katman katman, her sabah taze": "Layer by layer, fresh every morning",
    "Tereyağlı": "Buttery",
    "Çikolatalı": "Chocolate",
    "Fıstıklı": "Pistachio",
    "Brunch": "Brunch",
    "Espresso": "Espresso",
    "Taze üretim her sabah": "Freshly made every morning",
    "Kat kat çıtır hamur": "Crispy laminated dough",
    "Özenle çekilmiş kahve": "Carefully brewed coffee",
    "Lara’da imza kruvasan deneyimi": "Signature croissant experience in Lara",
    "Lezzetleri Keşfet": "Explore Flavors",
    "Bize Ulaş": "Contact Us",
    "Yıllık Ustalık": "Years of Craft",
    "Özel Tarif": "Signature Recipe",
    "Günlük Servis": "Daily Service",
    "Lezzet Sayfası": "Flavor Page",
    "İmza kruvasanlarımız": "Our Signature Croissants",
    "Tüm ürünleri tek sayfada inceleyebilirsiniz.": "Browse all products on one page.",
    "Lezzet Sayfasına Git": "Go to Flavor Page",
    "Lezzet Galerisi": "Flavor Gallery",
    "Katman detayı": "Layer detail",
    "Kahve eşleşmesi": "Coffee pairing",
    "Tümü": "All",
    "Tatlı": "Sweet",
    "Meyveli": "Fruity",
    "Konum": "Location",
    "Telefon": "Phone",
    "E-posta": "E-mail",
    "WhatsApp": "WhatsApp",
    "Konuma Git": "Get Directions",
    "WhatsApp ile İletişim": "Contact via WhatsApp",
    "Hemen Ara": "Call Now",
    "Bize Yazın": "Write to Us",
    "İstek / Dilek / Öneri Formu": "Request / Suggestion Form",
    "Görüşlerinizi bizimle paylaşın": "Share your feedback with us",
    "Ad Soyad": "Full Name",
    "E-posta": "E-mail",
    "Telefon": "Phone",
    "Mesaj": "Message",
    "Gönder": "Send",
    "WhatsApp ile iletişime geç": "Contact via WhatsApp",
    "Öne Çıkanlar": "Featured",
    "İmza Kruvasanlarımız": "Our Signature Croissants",
    "Günün en sevilen ürünleri tek sayfada.": "Most loved products of the day on one page.",
    "Detay ve sipariş için hemen ulaş": "Get details and order now",
    "WhatsApp'tan Yaz": "Write on WhatsApp",
    "Bizi Arayın": "Call Us",
    "Masa Rezervasyonu": "Table Reservation",
    "Rezervasyon için bizi arayabilir veya WhatsApp ile yazabilirsiniz.": "You can call us or message us on WhatsApp for reservation.",
    "WhatsApp ile Rezerve Et": "Reserve via WhatsApp",
    "Antalya İçine Hızlı Teslimat": "Fast Delivery Within Antalya",
    "Bölgesel teslimat saatleri 09:00 - 22:00 arasındadır.": "Regional delivery hours are between 09:00 - 22:00.",
    "Toplu siparişlerde bir gün önce ön sipariş önerilir.": "For bulk orders, pre-ordering one day in advance is recommended.",
    "Kurumsal Tedarik Çözümleri": "Corporate Supply Solutions",
    "Oteller, butik cafeler ve restoranlar için özel gramaj ve paketleme seçenekleri.": "Custom grammage and packaging options for hotels, boutique cafes and restaurants.",
    "Detaylı teklif almak için talep formunu doldurabilirsiniz.": "You can fill out the request form to receive a detailed quote.",
    "Point Croissant’in Yolculuğu": "The Journey of Point Croissant",
    "Bir tariften fazlası: özenle inşa edilen bir lezzet kültürü.": "More than a recipe: a flavor culture built with care.",
    "Bir soruyla başlayan yolculuk": "A Journey Started with a Question",
    "Katman, sıcaklık ve sabrın dengesi": "The Balance of Layers, Temperature and Patience",
    "Sadece ürün değil, bütün bir deneyim": "Not Just a Product, a Full Experience",
    "Her gün aynı kalite, her sabah taze üretim": "Same Quality Every Day, Fresh Production Every Morning",
    "Blog & Rehber": "Blog & Guides",
    "Kruvasan, kahve ve servis önerileri": "Croissant, Coffee and Service Tips",
    "İmza kruvasan": "Signature Croissant",
    "İmza Kruvasan Nasıl Yapılır?": "How to Make a Signature Croissant?",
    "Kat kat dokusunu koruyan, hacimli ve dengeli hamur tekniğinin püf noktaları.": "Key techniques for layered texture and balanced dough.",
    "Devamını Oku": "Read More",
    "Kahve eşleşmesi": "Coffee Pairing",
    "Kahve ile Kruvasan Eşleşmesi": "Coffee and Croissant Pairing",
    "Damak zevkine uygun en doğru kahve ve kruvasan uyumunu keşfedin.": "Discover the right coffee and croissant match for your taste.",
    "Sıkça Sorulan Sorular": "Frequently Asked Questions",
    "Kahve ve Kruvasan Eşleşmesi": "Coffee and Croissant Pairing",
    "İmza Kruvasan Rehberi": "Signature Croissant Guide",
    "Blog listesine dön": "Back to blog list",
    "Yasal": "Legal",
    "Düzenleme modu açık - Shift + Tıkla düzenle": "Edit mode is on - Shift + Click to edit",
    "Kapat": "Close",
    "Bu sayfayı sıfırla": "Reset this page",
    "İçeriğe geç": "Skip to content",
    "Blog": "Blog",
    "Blog: İmza Kruvasan": "Blog: Signature Croissant",
    "Blog: Kahve Eşleşmesi": "Blog: Coffee Pairing",
    "İletişim & Konum Bilgileri": "Contact & Location Info",
    "Telefon ile ara": "Call by phone",
    "WhatsApp'tan yazabilir veya direkt arayabilirsin.": "You can message on WhatsApp or call directly.",
    "Tarif": "Recipe",
    "Rehber": "Guide",
    "Etkinlik": "Event",
    "Atölye ve Özel Davetler": "Workshops and Private Events",
    "Kruvasan Atölyesi": "Croissant Workshop",
    "Atolye ve Ozel Davetler": "Workshops and Private Events",
    "Kruvasan Atolyesi": "Croissant Workshop",
    "Kurumsal": "Corporate",
    "Point Croissant Hakkında": "About Point Croissant",
    "Taze Üretim Kruvasanlar": "Freshly Made Croissants",
    "İmza lezzetlerimizi kategorili, modern ve şık bir menü düzeninde keşfedin.": "Discover our signature flavors in a categorized, modern, and elegant menu layout.",
    "Lezzet Haritası": "Flavor Map",
    "Point Croissant Menü Seçkisi": "Point Croissant Menu Selection",
    "Ürünler içerik yapısına göre kategorilendirilir ve admin panelindeki güncel fiyatlarla otomatik listelenir.": "Products are categorized by content and automatically listed with current prices from the admin panel.",
    "Taze üretim": "Freshly made",
    "Güncel fiyat": "Current price",
    "Kategorili görünüm": "Categorized view",
    "Detay Al": "Get details",
    "Özel Lezzet": "Special Flavor",
    "Seçki": "Selection",
    "Tatlı Kruvasanlar": "Sweet Croissants",
    "Meyveli, çikolatalı ve özel dolgulu tatlı seçenekler.": "Fruity, chocolate, and special-filled sweet options.",
    "Tuzlu Kruvasanlar": "Savory Croissants",
    "Dengeli tuzlu tarifler ve brunch için ideal seçenekler.": "Balanced savory recipes and ideal options for brunch.",
    "İmza ve Özel Seçkiler": "Signature and Special Selections",
    "Şef önerileri, premium tarifler ve vitrinin yıldızları.": "Chef recommendations, premium recipes, and showcase stars.",
    "Rezervasyon gerekli mi?": "Is reservation required?",
    "Rezervasyon nasıl yapabilirim?": "How can I make a reservation?",
    "Toplu sipariş alıyor musunuz?": "Do you accept bulk orders?",
    "Toplu sipariş için ne kadar önce iletişime geçmeliyim?": "How early should I contact you for bulk orders?",
    "Teslimat hizmetiniz var mı?": "Do you offer delivery?",
    "Ödeme seçenekleri nelerdir?": "What payment options are available?",
    "Glutensiz seçenek var mı?": "Are gluten-free options available?",
    "Alerjen bilgisi alabilir miyim?": "Can I get allergen information?",
    "Menü ve fiyatlar güncel mi?": "Are menu and prices up to date?",
    "1. Toplanan Bilgiler": "1. Information Collected",
    "2. Verilerin Kullanım Amaçları": "2. Purposes of Data Use",
    "3. Veri Paylaşımı ve Güvenlik": "3. Data Sharing and Security",
    "4. Haklarınız ve İletişim": "4. Your Rights and Contact",
    "1. Genel Kullanım": "1. General Use",
    "2. Fiyat ve Ürün Bilgileri": "2. Pricing and Product Information",
    "3. Bağlantılar ve Üçüncü Taraf Hizmetler": "3. Links and Third-Party Services",
    "4. Sorumluluk Sınırı": "4. Limitation of Liability",
    "1. Çerez Nedir?": "1. What Is a Cookie?",
    "2. Hangi Çerezleri Kullanıyoruz?": "2. Which Cookies Do We Use?",
    "3. Çerez Tercihleri Nasıl Yönetilir?": "3. How to Manage Cookie Preferences?",
    "4. Politika Güncellemeleri": "4. Policy Updates",
    "Lütfen tüm alanları doldur.": "Please fill in all fields.",
    "Mesajın WhatsApp üzerinden hazırlandı ve açıldı.": "Your message was prepared and opened in WhatsApp.",
    "Link kopyalandı.": "Link copied.",
    "Link kopyalanamadı.": "Failed to copy link.",
    "Bu cihazda paylaşım özelliği yok.": "Sharing is not available on this device.",
    "Paylaşım başarılı.": "Shared successfully.",
    "Paylaşım iptal edildi.": "Sharing was cancelled.",
    "Point Croissant Antalya | Cafe, Bakery & İmza Kruvasan": "Point Croissant Antalya | Cafe, Bakery & Signature Croissants",
    "Blog | Point Croissant": "Blog | Point Croissant",
    "Hikayemiz | Point Croissant": "Our Story | Point Croissant",
    "Lezzetler | Point Croissant": "Flavors | Point Croissant",
    "Menü | Point Croissant": "Menu | Point Croissant",
    "Rezervasyon | Point Croissant": "Reservation | Point Croissant",
    "Teslimat | Point Croissant": "Delivery | Point Croissant",
    "Toptan | Point Croissant": "Wholesale | Point Croissant",
    "SSS | Point Croissant": "FAQ | Point Croissant",
    "Kurumsal | Point Croissant": "Corporate | Point Croissant",
    "Etkinlikler | Point Croissant": "Events | Point Croissant",
    "İmza Kruvasan Rehberi | Point Croissant": "Signature Croissant Guide | Point Croissant",
    "Kahve Eşleşmesi | Point Croissant": "Coffee Pairing | Point Croissant",
    "Gizlilik Politikası | Point Croissant": "Privacy Policy | Point Croissant",
    "Kullanım Şartları | Point Croissant": "Terms of Use | Point Croissant",
    "Çerez Politikası | Point Croissant": "Cookie Policy | Point Croissant",
    "Her cumartesi 11:00 - 13:00.": "Every Saturday 11:00 - 13:00.",
    "Ayda iki kez profesyonel eğitim.": "Professional training twice a month.",
    "10-30 kişilik kurumsal organizasyon.": "Corporate organization for 10-30 people.",
    "Ayda iki kez profesyonel egitim.": "Professional training twice a month.",
    "10-30 kisilik kurumsal organizasyon.": "Corporate organization for 10-30 people.",
    "“Antalya’da neden hem çıtır hem dengeli kruvasan yok?” sorusu bizim başlangıcımız oldu.": "\"Why is there no croissant in Antalya that is both crispy and balanced?\" That question was our beginning.",
    "O gün mutfağa girip aylarca denemeler yapacağımızı henüz bilmiyorduk.": "That day, we did not yet know we would step into the kitchen and experiment for months.",
    "İlham aldığımız ilk atmosfer ve servis anlayışı.": "The first atmosphere and service approach that inspired us.",
    "Hamuru bazen fazla yorduk, bazen yeterince dinlendiremedik. Tereyağı seçimi, katlama aralıkları ve fırın dereceleri defalarca değişti. Her denemeyi not alarak reçetemizi adım adım geliştirdik.": "Sometimes we overworked the dough, and sometimes we could not rest it enough. Butter choice, folding intervals, and oven temperatures changed many times. By noting every trial, we improved our recipe step by step.",
    "“Premium olmak, pahalı görünmek değil; her gün aynı özeni gösterebilmektir.”": "\"Being premium is not about looking expensive; it is about showing the same care every day.\"",
    "Deneyimi tamamlayan servis akışı ve alan tasarımı.": "Service flow and space design that complete the experience.",
    "Kahve eşleşmeleri, servis hızı, tezgâh düzeni ve ambalaj hissi bir araya geldiğinde Point Croissant, tekrar gelmek isteyeceğiniz bir deneyime dönüştü.": "When coffee pairings, service speed, counter layout, and packaging feel came together, Point Croissant became an experience you would want to return to.",
    "Aynı disiplinle üretmeye devam ediyoruz. Her yeni tarif ve her geri bildirimle hikayemizi daha ileri taşıyoruz.": "We continue producing with the same discipline. With every new recipe and every feedback, we move our story forward.",
    "Point Croissant logosu": "Point Croissant logo",
    "İmza kruvasanın temelinde üç şey vardır: doğru hamur yapısı, kontrollü katlama ve sabırlı mayalama. Dışının çıtır, içinin hafif ve katmanlı olması için sürecin her adımı dikkat ister.": "At the core of a signature croissant are three things: proper dough structure, controlled folding, and patient proofing. Every step requires attention for a crispy exterior and a light, layered interior.",
    "Kruvasanın en kritik adımı hamurun soğuk zincirde dinlenmesidir. Hamur ısındığında tereyağı katmanlara doğru şekilde dağılmaz; bu da pişince kabarmayı ve katman netliğini düşürür.": "The most critical step is resting the dough within the cold chain. When the dough warms up, butter does not distribute properly into layers, reducing rise and layer definition after baking.",
    "Tereyağı katlarını eşit dağıtmak için her katlamadan sonra hamuru ortalama 25-30 dakika buzdolabında dinlendirin. Bu kısa dinlenme, hamurun tekrar toparlanmasını sağlar ve açma sırasında yırtılmayı azaltır.": "To distribute butter layers evenly, rest the dough in the refrigerator for about 25-30 minutes after each fold. This short rest helps the dough recover and reduces tearing during rolling.",
    "Son mayalamada ortam sıcaklığının 24-26 derece aralığında olması önerilir. Çok düşük sıcaklıkta hacim yavaş gelişir, çok yüksek sıcaklıkta ise tereyağı katmanlardan taşarak yapıyı bozabilir.": "In final proofing, an ambient temperature of 24-26C is recommended. At very low temperatures, volume develops slowly; at very high temperatures, butter can leak from layers and damage the structure.",
    "Pişirme aşamasında önceden ısıtılmış fırın kullanın ve ilk dakikalarda kapağı açmamaya özen gösterin. Bu sayede kruvasanlar güçlü bir ilk kabarma alır ve dış yüzeyde dengeli bir renk oluşur.": "During baking, use a preheated oven and avoid opening the door in the first minutes. This gives the croissants a strong initial rise and an even exterior color.",
    "Servis öncesi kruvasanları kısa bir süre tel ızgara üzerinde dinlendirmek, alt yüzeydeki nemi azaltır ve çıtırlığı korur. Özellikle dolgu eklenecekse bu adım lezzet kadar doku için de fark yaratır.": "Resting croissants briefly on a wire rack before serving reduces moisture on the bottom surface and preserves crispness. Especially if filling will be added, this step improves texture as much as flavor.",
    "Sade tereyağlı kruvasanla filtre kahve daha dengeli bir tat verir.": "Filter coffee gives a more balanced taste with a plain butter croissant.",
    "Çikolatalı lezzetlerde orta kavrum espresso bazlı içecekler öne çıkar.": "With chocolate flavors, medium-roast espresso-based drinks stand out.",
    "Meyveli kruvasanlar için soğuk demleme kahveler ferah bir seçimdir.": "For fruity croissants, cold brew coffees are a refreshing choice.",
    "Point Croissant, Antalya'da kruvasan odaklı bir kafe markasıdır.": "Point Croissant is a croissant-focused cafe brand in Antalya.",
    "Kaliteli ürün ve hızlı servis sunuyoruz.": "We offer quality products and fast service.",
    "Franchise, kurumsal iş birliği ve toplu tedarik görüşmeleri için bizimle iletişime geçebilirsiniz.": "You can contact us for franchise, corporate partnership, and bulk supply discussions.",
    "Zorunlu değil, ancak hafta sonu ve akşam saatlerinde rezervasyon önerilir.": "It is not mandatory, but reservation is recommended on weekends and in evening hours.",
    "Rezervasyon sayfasından WhatsApp veya telefon üzerinden hızlıca rezervasyon oluşturabilirsiniz.": "You can quickly make a reservation via WhatsApp or phone from the reservation page.",
    "Evet. Etkinlik, ofis ve özel günler için toplu sipariş alıyoruz.": "Yes. We accept bulk orders for events, offices, and special occasions.",
    "Yoğun günlerde en az 1 gün, büyük siparişlerde 2-3 gün önce iletişime geçmeniz önerilir.": "On busy days, contact us at least 1 day in advance; for large orders, 2-3 days is recommended.",
    "Evet. Bölgesel teslimat saatleri içinde adrese teslim hizmet sunuyoruz.": "Yes. We provide home delivery within regional delivery hours.",
    "Nakit ve kart ile ödeme yapabilirsiniz. Online yönlendirmelerde ilgili platformun ödeme seçenekleri geçerlidir.": "You can pay by cash or card. For online redirections, the payment options of the relevant platform apply.",
    "Belirli günlerde sınırlı sayıda glutensiz ürün sunuyoruz.": "On selected days, we offer a limited number of gluten-free products.",
    "Evet. Ürün içerikleri ve alerjen bilgileri için ekibimizden detaylı bilgi alabilirsiniz.": "Yes. You can get detailed information from our team about product ingredients and allergens.",
    "Menü sayfası düzenli olarak güncellenir. Güncel ürün ve fiyat bilgisi için menü sayfasını takip edebilirsiniz.": "The menu page is updated regularly. You can follow the menu page for current product and price information.",
    "Point Croissant olarak kişisel verilerinizi korumayı önceliğimiz kabul ediyoruz. Bu metin, hangi bilgileri neden topladığımızı ve nasıl koruduğumuzu açıklar.": "As Point Croissant, we consider protecting your personal data our priority. This text explains what information we collect, why we collect it, and how we protect it.",
    "Sitemiz üzerinden bize ilettiğiniz ad, telefon, e-posta ve mesaj içerikleri gibi iletişim bilgileri işlenebilir.": "Contact information such as name, phone, email, and message content that you send through our website may be processed.",
    "İletişim formlarında paylaştığınız bilgiler": "Information you share in contact forms",
    "Rezervasyon veya teklif taleplerinde ilettiğiniz veriler": "Data you provide in reservation or quote requests",
    "Teknik kullanım verileri (tarayıcı tipi, cihaz bilgisi vb.)": "Technical usage data (browser type, device information, etc.)",
    "Toplanan veriler yalnızca hizmet sağlama ve iletişim süreçlerini yürütme amacıyla kullanılır.": "Collected data is used only for providing services and managing communication processes.",
    "Talep ve rezervasyonlara dönüş yapmak": "Responding to requests and reservations",
    "Hizmet kalitesini geliştirmek": "Improving service quality",
    "Yasal yükümlülükleri yerine getirmek": "Fulfilling legal obligations",
    "Kişisel verileriniz, açık rızanız olmadan üçüncü taraflara satılmaz veya pazarlama amacıyla devredilmez.": "Your personal data is not sold or transferred to third parties for marketing purposes without your explicit consent.",
    "Yetkisiz erişimi önlemek için makul teknik ve idari güvenlik önlemleri uygulanır.": "Reasonable technical and administrative security measures are applied to prevent unauthorized access.",
    "Verilerinize ilişkin erişim, düzeltme veya silme talepleriniz için bizimle iletişime geçebilirsiniz.": "You can contact us for requests regarding access to, correction of, or deletion of your data.",
    "Güncel iletişim bilgileri için ana sayfadaki iletişim bölümünü kullanabilirsiniz.": "You can use the contact section on the homepage for up-to-date contact information.",
    "Bu sayfada yer alan şartlar, Point Croissant web sitesinin kullanımına ilişkin temel kuralları ve tarafların sorumluluklarını belirtir.": "The terms on this page set out the basic rules for using the Point Croissant website and the responsibilities of the parties.",
    "Bu siteye erişen her kullanıcı, burada yer alan kullanım şartlarını kabul etmiş sayılır.": "Every user who accesses this site is deemed to have accepted the terms of use stated here.",
    "İçerikler bilgilendirme amaçlıdır.": "Contents are for informational purposes.",
    "Web sitesindeki görsel ve metinler izinsiz kopyalanamaz.": "Visuals and texts on the website cannot be copied without permission.",
    "Site üzerinden yapılan işlemler dürüst kullanım esasına tabidir.": "Transactions carried out through the site are subject to fair-use principles.",
    "Ürün içerikleri, stok durumu ve fiyatlar operasyonel nedenlerle güncellenebilir.": "Product contents, stock status, and prices may be updated for operational reasons.",
    "Kesin bilgi için sipariş/rezervasyon sırasında ekibimiz tarafından paylaşılan güncel bilgi esas alınır.": "For definitive information, the current information shared by our team during order/reservation applies.",
    "Site içinde WhatsApp, harita ve sosyal medya gibi üçüncü taraf bağlantılar bulunabilir.": "The site may contain third-party links such as WhatsApp, map, and social media.",
    "Bu platformların kendi kullanım koşulları geçerlidir ve Point Croissant bu platformların politikalarından sorumlu değildir.": "These platforms' own terms apply, and Point Croissant is not responsible for their policies.",
    "Teknik bakım, güncelleme veya mücbir sebepler nedeniyle hizmette geçici kesinti yaşanabilir.": "Temporary service interruptions may occur due to technical maintenance, updates, or force majeure.",
    "Bu tür durumlarda doğabilecek dolaylı zararlardan Point Croissant sorumlu tutulamaz.": "Point Croissant cannot be held liable for indirect damages that may arise in such cases.",
    "Bu politika, web sitemizde kullanılan çerez türlerini ve bu çerezlerin hangi amaçlarla işlendiğini açıklamak için hazırlanmıştır.": "This policy has been prepared to explain the types of cookies used on our website and the purposes for which they are processed.",
    "Çerezler, ziyaret ettiğiniz web sitesinin tarayıcınıza kaydettiği küçük metin dosyalarıdır. Bu dosyalar, site deneyimini iyileştirmek için kullanılır.": "Cookies are small text files that the website you visit stores in your browser. These files are used to improve the site experience.",
    "Zorunlu Çerezler:": "Essential Cookies:",
    "Sayfanın temel işlevlerinin çalışması için gereklidir.": "Required for the core functions of the page to operate.",
    "Performans Çerezleri:": "Performance Cookies:",
    "Site kullanımını analiz ederek geliştirme yapılmasına destek olur.": "Helps improvements by analyzing site usage.",
    "Tercih Çerezleri:": "Preference Cookies:",
    "Kullanıcı ayarlarını hatırlayarak kişiselleştirilmiş deneyim sunar.": "Provides a personalized experience by remembering user settings.",
    "Çerezleri tarayıcı ayarlarınızdan silebilir, engelleyebilir veya kısıtlayabilirsiniz.": "You can delete, block, or restrict cookies from your browser settings.",
    "Ancak bazı çerezleri devre dışı bırakmanız, sitenin bazı işlevlerinde kısıtlama yaratabilir.": "However, disabling some cookies may limit certain functions of the site.",
    "Çerez politikamız zaman zaman güncellenebilir. Güncel metin bu sayfa üzerinden yayımlanır.": "Our cookie policy may be updated from time to time. The current text is published on this page.",
    "Point Croissant Admin Panel": "Point Croissant Admin Panel",
    "Yetkili Girişi": "Authorized Login",
    "Admin Panel Kilitli": "Admin Panel Locked",
    "Sadece yetkili kullanıcı şifresi ile erişim sağlanır.": "Access is granted only with an authorized user password.",
    "Şifre": "Password",
    "Giriş Yap": "Sign In",
    "Yönetim": "Management",
    "Yönetim Menüsü": "Management Menu",
    "Ürün Yönetimi": "Product Management",
    "İletişim Ayarları": "Contact Settings",
    "İçerik Düzenleme": "Content Editing",
    "Marka ve Sayaçlar": "Brand and Counters",
    "Menü Yapısı": "Menu Structure",
    "Galeri": "Gallery",
    "Etkinlikler": "Events",
    "Blog Yazıları": "Blog Posts",
    "Menü Kategorileri": "Menu Categories",
    "SEO ve Google": "SEO and Google",
    "Çalışma Saatleri": "Opening Hours",
    "Çalışma Saatleri:": "Opening Hours:",
    "Instagram URL": "Instagram URL",
    "Facebook URL": "Facebook URL",
    "Google çalışma saati (şema)": "Google opening hours (schema)",
    "WhatsApp hazır mesaj (TR)": "WhatsApp greeting (TR)",
    "WhatsApp hazır mesaj (EN)": "WhatsApp greeting (EN)",
    "WhatsApp hazır mesaj (RU)": "WhatsApp greeting (RU)",
    "İmza / özel seçkiye ekle": "Add to signature / special selection",
    "Kategori": "Category",
    "Tatlı": "Sweet",
    "Tuzlu": "Savory",
    "Ürün Listesi": "Product List",
    "Yönetim Özeti": "Management Overview",
    "Toplam Ürün": "Total Products",
    "Ortalama Fiyat": "Average Price",
    "En Yüksek Fiyat": "Highest Price",
    "Çeviri Eksiği (EN/RU)": "Missing Translation (EN/RU)",
    "Önce ürün/ayar bilgilerini kaydet, sonra içerik düzenleyiciden ilgili sayfayı aç.": "First save product/settings information, then open the relevant page from the content editor.",
    "Kayıtlı içerik özeti": "Saved content summary",
    "Toplam ürün:": "Total products:",
    "Ürün önizleme": "Product preview",
    "Kayıt bulunamadı.": "No records found.",
    "Sayfa": "Page",
    "Kayıt": "Record",
    "Ürün ara (ad/açıklama/etiket)": "Search product (name/description/tag)",
    "TR alanı": "TR field",
    "EN alanı": "EN field",
    "RU alanı": "RU field",
    "Yeni eklenen (son)": "Newest first",
    "Fiyat (yüksekten düşüğe)": "Price (high to low)",
    "Fiyat (düşükten yükseğe)": "Price (low to high)",
    "Ürün adı (A-Z)": "Product name (A-Z)",
    "Filtreleri Sıfırla": "Reset Filters",
    "Ürünleri JSON Dışa Aktar": "Export Products JSON",
    "JSON İçeri Aktar": "Import JSON",
    "Görsel": "Image",
    "Çoğalt": "Duplicate",
    "Ürün ve Fiyat Yönetimi": "Product and Price Management",
    "Buradan girdiğin ürünler ana sayfa ve menü sayfasına otomatik yansır.": "Products entered here are automatically reflected on the homepage and menu page.",
    "Ürün Ekle / Güncelle": "Add / Update Product",
    "Ürün Adı": "Product Name",
    "Ürün Adı (TR)": "Product Name (TR)",
    "Ürün Adı (EN)": "Product Name (EN)",
    "Ürün Adı (RU)": "Product Name (RU)",
    "Açıklama": "Description",
    "Açıklama (TR)": "Description (TR)",
    "Açıklama (EN)": "Description (EN)",
    "Açıklama (RU)": "Description (RU)",
    "Ürün Görsel URL": "Product Image URL",
    "Ürün Görsel URL (TR)": "Product Image URL (TR)",
    "Ürün Görsel URL (EN)": "Product Image URL (EN)",
    "Ürün Görsel URL (RU)": "Product Image URL (RU)",
    "assets/logo-point-croissant.webp veya https://...": "assets/logo-point-croissant.webp or https://...",
    "Fiyat (TL)": "Price (TL)",
    "Etiket": "Tag",
    "Etiket (TR)": "Tag (TR)",
    "Etiket (EN)": "Tag (EN)",
    "Etiket (RU)": "Tag (RU)",
    "Boşsa TR kullanılır": "If empty, TR is used",
    "Kaydet": "Save",
    "Temizle": "Clear",
    "Varsayılana Dön": "Reset to Default",
    "İletişim ve Konum Ayarları": "Contact and Location Settings",
    "Telefon (gösterim)": "Phone (display)",
    "Telefon (tel format)": "Phone (tel format)",
    "WhatsApp (gösterim)": "WhatsApp (display)",
    "WhatsApp (numara, ülke kodlu)": "WhatsApp (number, with country code)",
    "E-Posta": "E-mail",
    "Adres": "Address",
    "Adres (TR)": "Address (TR)",
    "Adres (EN)": "Address (EN)",
    "Adres (RU)": "Address (RU)",
    "Harita Konum Metni": "Map Location Text",
    "Harita Konum Metni (TR)": "Map Location Text (TR)",
    "Harita Konum Metni (EN)": "Map Location Text (EN)",
    "Harita Konum Metni (RU)": "Map Location Text (RU)",
    "Ayarları Kaydet": "Save Settings",
    "Varsayılan Ayarlar": "Default Settings",
    "Canlı İçerik Düzenleyici (Tüm Sayfalar)": "Live Content Editor (All Pages)",
    "İstediğin sayfayı seçip düzenleme modunu aç. Açılan sayfada": "Select the page you want and open edit mode. On the opened page",
    "Shift + Tıkla": "Shift + Click",
    "ile metin, link ve görselleri anında düzenle.": "to instantly edit text, links, and images.",
    "Düzenlenecek Sayfa": "Page to Edit",
    "Gizlilik": "Privacy",
    "Düzenleme Modunu Aç": "Open Edit Mode",
    "Düzenleme Modunu Kapat": "Close Edit Mode",
    "Tüm Düzenlemeleri Sıfırla": "Reset All Edits",
    "Mevcut Ürünler": "Current Products",
    "Ürün": "Product",
    "Fiyat": "Price",
    "İşlem": "Action",
    "Belçika çikolatası dolgusu ve kakao glaze ile yoğun lezzet.": "Intense flavor with Belgian chocolate filling and cocoa glaze.",
    "En Çok Satan": "Best Seller",
    "En Cok Satan": "Best Seller",
    "Fıstık Supreme": "Pistachio Supreme",
    "Antep fıstık kreması, çıtır fıstık parçası ve tereyağlı hamur.": "Pistachio cream, crunchy pistachio pieces, and buttery dough.",
    "Şef Önerisi": "Chef's Recommendation",
    "Yaban Mersinli Danish": "Blueberry Danish",
    "İpeksi krema ve meyve dolgusu ile ferah, dengeli tat.": "A fresh, balanced taste with silky cream and fruit filling.",
    "Yeni": "New",
    "Trüf Mantarlı Tuzlu": "Savory Truffle Mushroom",
    "Trüf mantarlı tuzlu kruvasan.": "Savory croissant with truffle mushroom.",
    "Öne Çıkan": "Featured",
    "Düzenle": "Edit",
    "Sil": "Delete",
    "Lütfen ürün adı, açıklama ve fiyatı doldur.": "Please fill in product name, description, and price.",
    "Ürün güncellendi. Ön yüzde anında yansır.": "Product updated. It is reflected on the front side instantly.",
    "Ürün eklendi. Ön yüzde anında yansır.": "Product added. It is reflected on the front side instantly.",
    "Ürün düzenleme için forma getirildi.": "Product loaded into form for editing.",
    "Ürün silindi.": "Product deleted.",
    "Form temizlendi.": "Form cleared.",
    "Varsayılan ürünler geri yüklendi.": "Default products restored.",
    "Lütfen tüm iletişim alanlarını doldur.": "Please fill in all contact fields.",
    "İletişim ve konum ayarları kaydedildi.": "Contact and location settings saved.",
    "Ayarlar varsayılana alındı.": "Settings reset to default.",
    "Şifre gerekli.": "Password is required.",
    "Şifre hatalı.": "Incorrect password.",
    "Bu ürünü silmek istediğine emin misin?": "Are you sure you want to delete this product?",
    "Varsayılan ürünleri geri yüklemek istediğine emin misin?": "Are you sure you want to restore default products?",
    "Tüm sayfalardaki içerik düzenlemeleri sıfırlanacak. Devam etmek istiyor musun?": "All content edits on all pages will be reset. Do you want to continue?",
    "Toplam ürün:": "Total products:",
    "Listelenen:": "Listed:",
    "Ürün kopyalandı.": "Product duplicated.",
    "Ürünler JSON olarak dışa aktarıldı.": "Products exported as JSON.",
    "JSON içeriği geçersiz.": "Invalid JSON content.",
    "JSON içe aktarıldı.": "JSON imported.",
    "JSON dosyası okunamadı.": "JSON file could not be read.",
    "Düzenleme modu açıldı. Yeni sekmede Shift + Tıkla ile metin/link/görsel düzenleyebilirsin.": "Edit mode opened. In the new tab, you can edit text/link/image with Shift + Click.",
    "Düzenleme modu kapatıldı.": "Edit mode closed.",
    "Tüm sayfa içerik düzenlemeleri sıfırlandı.": "All page content edits have been reset.",
    "Görsel URL": "Image URL",
    "Alt metni": "Alt text",
    "Link metni": "Link text",
    "Link adresi": "Link URL",
    "Metin": "Text",
    "Yeni, Premium...": "New, Premium...",
    "Güzeloba Mah. Çağlayangil Cad. No:38 / B, Muratpaşa / Antalya": "Guzeloba Neighborhood, Caglayangil Street No:38 / B, Muratpasa / Antalya",
    "Merhaba Point Croissant, bilgi almak istiyorum.": "Hello Point Croissant, I would like to get information.",
    "Merhaba Point Croissant,\n\nİstek / Dilek / Öneri Formu:\nAd Soyad: ${data.name}\nE-Posta: ${data.email}\nTelefon: ${data.phone}\nMesaj: ${data.message}": "Hello Point Croissant,\n\nRequest / Suggestion Form:\nFull Name: ${data.name}\nE-mail: ${data.email}\nPhone: ${data.phone}\nMessage: ${data.message}",
    "Point Croissant Antalya resmi web sitesi. Güzeloba, Muratpaşa’da cafe ve bakery: imza kruvasanlar, menü, rezervasyon ve iletişim.": "Official Point Croissant Antalya website. Cafe and bakery in Guzeloba, Muratpasa: signature croissants, menu, reservations, and contact.",
    "Point Croissant Antalya lezzetleri: imza kruvasanlar, öne çıkan ürünler ve sipariş için iletişim bilgileri.": "Point Croissant Antalya flavors: signature croissants, featured products, and contact details for ordering.",
    "Point Croissant Antalya menü: güncel fiyatlar, kategorili kruvasan ve cafe ürünleri.": "Point Croissant Antalya menu: current prices, categorized croissants and cafe items.",
    "Point Croissant hikayesi, üretim anlayışı ve marka yolculuğu.": "Point Croissant story, production philosophy, and brand journey.",
    "Kruvasan, kahve ve servis önerileri için Point Croissant blog içerikleri.": "Point Croissant blog content for croissant, coffee, and service tips.",
    "İmza kruvasan hazırlama rehberi, püf noktaları ve üretim önerileri.": "Signature croissant preparation guide, tips, and production recommendations.",
    "Kahve ve kruvasan eşleşmesi için pratik öneriler ve lezzet uyumları.": "Practical tips and flavor pairings for coffee and croissants.",
    "Point Croissant etkinlikleri ve özel gün organizasyon bilgileri.": "Point Croissant events and special occasion organization information.",
    "Kurumsal iş birliği, marka bilgisi ve Point Croissant hakkında detaylar.": "Corporate collaboration, brand information, and details about Point Croissant.",
    "Sıkça sorulan sorular: rezervasyon, teslimat, toplu sipariş ve daha fazlası.": "Frequently asked questions: reservations, delivery, bulk orders, and more.",
    "Point Croissant masa rezervasyonu için WhatsApp ve telefonla hızlı iletişim.": "Fast WhatsApp and phone contact for Point Croissant table reservations.",
    "Antalya içi teslimat saatleri, sipariş detayları ve iletişim seçenekleri.": "Delivery hours within Antalya, order details, and contact options.",
    "Toptan ve kurumsal tedarik çözümleri için teklif ve iletişim bilgileri.": "Quote and contact information for wholesale and corporate supply solutions.",
    "Point Croissant Gizlilik Politikası metni ve kişisel veri işleme esasları.": "Point Croissant Privacy Policy text and principles of personal data processing.",
    "Point Croissant Kullanım Şartları ve site kullanımına ilişkin kurallar.": "Point Croissant Terms of Use and rules regarding site usage.",
    "Point Croissant Çerez Politikası ve çerez tercihleri hakkında bilgiler.": "Point Croissant Cookie Policy and information about cookie preferences.",
    "Web sitesi ve yazılım: SoftenWise": "Website & software: SoftenWise",
    "SoftenWise — yazılım ve web geliştirme": "SoftenWise — software and web development",
    "Çeviri Eksiği (EN/RU/AR/DE)": "Missing Translation (EN/RU/AR/DE)",
    "AR alanı": "AR field",
    "DE alanı": "DE field",
    "Ürün Adı (AR)": "Product Name (AR)",
    "Ürün Adı (DE)": "Product Name (DE)",
    "Açıklama (AR)": "Description (AR)",
    "Açıklama (DE)": "Description (DE)",
    "Etiket (AR)": "Tag (AR)",
    "Etiket (DE)": "Tag (DE)",
    "Ürün Görsel URL (AR)": "Product Image URL (AR)",
    "Ürün Görsel URL (DE)": "Product Image URL (DE)",
    "Adres (AR)": "Address (AR)",
    "Adres (DE)": "Address (DE)",
    "Harita Konum Metni (AR)": "Map Location Text (AR)",
    "Harita Konum Metni (DE)": "Map Location Text (DE)",
    "Blog Yazıları": "Blog Posts",
    "Facebook URL": "Facebook URL",
    "Google çalışma saati (şema)": "Google opening hours (schema)",
    "Instagram URL": "Instagram URL",
    "Kategori": "Category",
    "Marka ve Sayaçlar": "Brand and Counters",
    "Menü Kategorileri": "Menu Categories",
    "Menü Yapısı": "Menu Structure",
    "SEO ve Google": "SEO and Google",
    "Tuzlu": "Savory",
    "WhatsApp hazır mesaj (EN)": "WhatsApp greeting (EN)",
    "WhatsApp hazır mesaj (RU)": "WhatsApp greeting (RU)",
    "WhatsApp hazır mesaj (TR)": "WhatsApp greeting (TR)",
    "WhatsApp hazır mesaj (AR)": "WhatsApp greeting (AR)",
    "WhatsApp hazır mesaj (DE)": "WhatsApp greeting (DE)",
    "Çalışma Saatleri": "Opening Hours",
    "Çalışma Saatleri:": "Opening Hours:",
    "İmza / özel seçkiye ekle": "Add to signature / special selection"
  },
  ru: {
    "Anasayfa": "Главная",
    "Hikayemiz": "О нас",
    "Lezzetler": "Вкусы",
    "Galeri": "Галерея",
    "Tarifler": "Рецепты",
    "İletişim": "Контакты",
    "Sipariş Ver": "Сделать заказ",
    "Keşfet": "Разделы",
    "Menü": "Меню",
    "Etkinlikler": "События",
    "Hizmetler": "Услуги",
    "Rezervasyon": "Бронирование",
    "Teslimat": "Доставка",
    "Toptan": "Опт",
    "SSS": "FAQ",
    "Yasal": "Правовая информация",
    "Gizlilik Politikası": "Политика конфиденциальности",
    "Kullanım Şartları": "Условия использования",
    "Çerez Politikası": "Политика cookies",
    "Günün en keyifli molası için taptaze kruvasanlar ve özenli kahve.": "Свежие круассаны и тщательно приготовленный кофе для лучшего перерыва дня.",
    "Antalya, Türkiye": "Анталья, Турция",
    "Menüyü aç/kapat": "Открыть/закрыть меню",
    "Dil seçimi": "Выбор языка",
    "Güne Lezzetli Bir Başlangıç": "Вкусное начало дня",
    "Çıtır katmanlar, özel reçeteler ve özenle hazırlanan sunumlar. Her lokmada kaliteyi hissedin.": "Хрустящие слои, фирменные рецепты и аккуратная подача. Почувствуйте качество в каждом кусочке.",
    "Antalya · Cafe & Bakery": "Анталья · Cafe & Bakery",
    "Keşfetmeye devam et": "Продолжайте открывать",
    "Katman katman, her sabah taze": "Слой за слоем, свежее каждое утро",
    "Tereyağlı": "Сливочное",
    "Çikolatalı": "Шоколадное",
    "Fıstıklı": "Фисташковое",
    "Brunch": "Бранч",
    "Espresso": "Эспрессо",
    "Taze üretim her sabah": "Свежая выпечка каждое утро",
    "Kat kat çıtır hamur": "Хрустящее слоёное тесто",
    "Özenle çekilmiş kahve": "Тщательно приготовленный кофе",
    "Lara’da imza kruvasan deneyimi": "Фирменный круассан в Ларе",
    "Lezzetleri Keşfet": "Посмотреть вкусы",
    "Bize Ulaş": "Связаться с нами",
    "Yıllık Ustalık": "Лет мастерства",
    "Özel Tarif": "Фирменный рецепт",
    "Günlük Servis": "Ежедневная подача",
    "Lezzet Sayfası": "Страница вкусов",
    "İmza kruvasanlarımız": "Наши фирменные круассаны",
    "Tüm ürünleri tek sayfada inceleyebilirsiniz.": "Все продукты на одной странице.",
    "Lezzet Sayfasına Git": "Перейти к вкусам",
    "Lezzet Galerisi": "Галерея вкусов",
    "Katman detayı": "Деталь слоёв",
    "Kahve eşleşmesi": "Сочетание с кофе",
    "Tümü": "Все",
    "Tatlı": "Сладкое",
    "Meyveli": "Фруктовое",
    "Konum": "Локация",
    "Telefon": "Телефон",
    "E-posta": "E-mail",
    "WhatsApp": "WhatsApp",
    "Konuma Git": "Построить маршрут",
    "WhatsApp ile İletişim": "Связаться в WhatsApp",
    "Hemen Ara": "Позвонить",
    "Bize Yazın": "Напишите нам",
    "İstek / Dilek / Öneri Formu": "Форма запроса / предложения",
    "Görüşlerinizi bizimle paylaşın": "Поделитесь вашим мнением",
    "Ad Soyad": "Имя и фамилия",
    "Telefon": "Телефон",
    "Mesaj": "Сообщение",
    "Gönder": "Отправить",
    "WhatsApp ile iletişime geç": "Связаться через WhatsApp",
    "Öne Çıkanlar": "Популярное",
    "İmza Kruvasanlarımız": "Фирменные круассаны",
    "Günün en sevilen ürünleri tek sayfada.": "Самые любимые продукты дня на одной странице.",
    "Detay ve sipariş için hemen ulaş": "Свяжитесь для деталей и заказа",
    "WhatsApp'tan Yaz": "Написать в WhatsApp",
    "Bizi Arayın": "Позвонить нам",
    "Masa Rezervasyonu": "Бронирование столика",
    "Rezervasyon için bizi arayabilir veya WhatsApp ile yazabilirsiniz.": "Для брони вы можете позвонить нам или написать в WhatsApp.",
    "WhatsApp ile Rezerve Et": "Забронировать через WhatsApp",
    "Antalya İçine Hızlı Teslimat": "Быстрая доставка по Анталье",
    "Bölgesel teslimat saatleri 09:00 - 22:00 arasındadır.": "Часы региональной доставки: 09:00 - 22:00.",
    "Toplu siparişlerde bir gün önce ön sipariş önerilir.": "Для оптовых заказов рекомендуется предзаказ за 1 день.",
    "Kurumsal Tedarik Çözümleri": "Корпоративные решения поставок",
    "Oteller, butik cafeler ve restoranlar için özel gramaj ve paketleme seçenekleri.": "Специальные веса и варианты упаковки для отелей, бутиков-кафе и ресторанов.",
    "Detaylı teklif almak için talep formunu doldurabilirsiniz.": "Чтобы получить подробное предложение, заполните форму.",
    "Point Croissant’in Yolculuğu": "Путь Point Croissant",
    "Bir tariften fazlası: özenle inşa edilen bir lezzet kültürü.": "Больше, чем рецепт: культура вкуса, созданная с заботой.",
    "Bir soruyla başlayan yolculuk": "Путь, начавшийся с вопроса",
    "Katman, sıcaklık ve sabrın dengesi": "Баланс слоев, температуры и терпения",
    "Sadece ürün değil, bütün bir deneyim": "Не только продукт, а полный опыт",
    "Her gün aynı kalite, her sabah taze üretim": "Одинаковое качество каждый день, свежая выпечка каждое утро",
    "Blog & Rehber": "Блог и гид",
    "Kruvasan, kahve ve servis önerileri": "Советы по круассанам, кофе и сервису",
    "İmza kruvasan": "Фирменный круассан",
    "İmza Kruvasan Nasıl Yapılır?": "Как приготовить фирменный круассан?",
    "Devamını Oku": "Читать далее",
    "Kahve eşleşmesi": "Сочетание с кофе",
    "Kahve ile Kruvasan Eşleşmesi": "Сочетание кофе и круассана",
    "Sıkça Sorulan Sorular": "Часто задаваемые вопросы",
    "Kahve ve Kruvasan Eşleşmesi": "Сочетание кофе и круассана",
    "İmza Kruvasan Rehberi": "Гид по фирменному круассану",
    "Blog listesine dön": "Вернуться к списку блога",
    "Düzenleme modu açık - Shift + Tıkla düzenle": "Режим редактирования включен — Shift + Click для редактирования",
    "Kapat": "Закрыть",
    "Bu sayfayı sıfırla": "Сбросить эту страницу",
    "İçeriğe geç": "Перейти к содержимому",
    "Blog": "Блог",
    "Blog: İmza Kruvasan": "Блог: Фирменный круассан",
    "Blog: Kahve Eşleşmesi": "Блог: Сочетание с кофе",
    "İletişim & Konum Bilgileri": "Контакты и локация",
    "Telefon ile ara": "Позвонить по телефону",
    "WhatsApp'tan yazabilir veya direkt arayabilirsin.": "Можно написать в WhatsApp или позвонить напрямую.",
    "Tarif": "Рецепт",
    "Rehber": "Гид",
    "Etkinlik": "Мероприятие",
    "Atölye ve Özel Davetler": "Мастер-классы и частные мероприятия",
    "Kruvasan Atölyesi": "Мастер-класс по круассанам",
    "Atolye ve Ozel Davetler": "Мастер-классы и частные мероприятия",
    "Kruvasan Atolyesi": "Мастер-класс по круассанам",
    "Kurumsal": "Корпоративный",
    "Point Croissant Hakkında": "О Point Croissant",
    "Taze Üretim Kruvasanlar": "Свежеприготовленные круассаны",
    "İmza lezzetlerimizi kategorili, modern ve şık bir menü düzeninde keşfedin.": "Откройте наши фирменные вкусы в структурированном, современном и стильном меню.",
    "Lezzet Haritası": "Карта вкусов",
    "Point Croissant Menü Seçkisi": "Подборка меню Point Croissant",
    "Ürünler içerik yapısına göre kategorilendirilir ve admin panelindeki güncel fiyatlarla otomatik listelenir.": "Продукты распределяются по категориям и автоматически отображаются с актуальными ценами из админ-панели.",
    "Taze üretim": "Свежеприготовленное",
    "Güncel fiyat": "Актуальная цена",
    "Kategorili görünüm": "Категоризированный вид",
    "Detay Al": "Узнать детали",
    "Özel Lezzet": "Особый вкус",
    "Seçki": "Подборка",
    "Tatlı Kruvasanlar": "Сладкие круассаны",
    "Meyveli, çikolatalı ve özel dolgulu tatlı seçenekler.": "Сладкие варианты с фруктами, шоколадом и специальными начинками.",
    "Tuzlu Kruvasanlar": "Соленые круассаны",
    "Dengeli tuzlu tarifler ve brunch için ideal seçenekler.": "Сбалансированные соленые рецепты и идеальные варианты для бранча.",
    "İmza ve Özel Seçkiler": "Фирменные и специальные подборки",
    "Şef önerileri, premium tarifler ve vitrinin yıldızları.": "Рекомендации шефа, премиальные рецепты и хиты витрины.",
    "Rezervasyon gerekli mi?": "Нужна ли бронь?",
    "Rezervasyon nasıl yapabilirim?": "Как сделать бронирование?",
    "Toplu sipariş alıyor musunuz?": "Принимаете ли вы оптовые заказы?",
    "Toplu sipariş için ne kadar önce iletişime geçmeliyim?": "За сколько времени нужно связаться для оптового заказа?",
    "Teslimat hizmetiniz var mı?": "Есть ли у вас доставка?",
    "Ödeme seçenekleri nelerdir?": "Какие способы оплаты доступны?",
    "Glutensiz seçenek var mı?": "Есть ли безглютеновые варианты?",
    "Alerjen bilgisi alabilir miyim?": "Можно получить информацию об аллергенах?",
    "Menü ve fiyatlar güncel mi?": "Актуальны ли меню и цены?",
    "1. Toplanan Bilgiler": "1. Собираемая информация",
    "2. Verilerin Kullanım Amaçları": "2. Цели использования данных",
    "3. Veri Paylaşımı ve Güvenlik": "3. Передача данных и безопасность",
    "4. Haklarınız ve İletişim": "4. Ваши права и контакты",
    "1. Genel Kullanım": "1. Общие условия использования",
    "2. Fiyat ve Ürün Bilgileri": "2. Цены и информация о продуктах",
    "3. Bağlantılar ve Üçüncü Taraf Hizmetler": "3. Ссылки и сторонние сервисы",
    "4. Sorumluluk Sınırı": "4. Ограничение ответственности",
    "1. Çerez Nedir?": "1. Что такое cookie?",
    "2. Hangi Çerezleri Kullanıyoruz?": "2. Какие cookie мы используем?",
    "3. Çerez Tercihleri Nasıl Yönetilir?": "3. Как управлять настройками cookie?",
    "4. Politika Güncellemeleri": "4. Обновления политики",
    "Lütfen tüm alanları doldur.": "Пожалуйста, заполните все поля.",
    "Mesajın WhatsApp üzerinden hazırlandı ve açıldı.": "Ваше сообщение подготовлено и открыто в WhatsApp.",
    "Link kopyalandı.": "Ссылка скопирована.",
    "Link kopyalanamadı.": "Не удалось скопировать ссылку.",
    "Bu cihazda paylaşım özelliği yok.": "На этом устройстве функция \"Поделиться\" недоступна.",
    "Paylaşım başarılı.": "Успешно отправлено.",
    "Paylaşım iptal edildi.": "Отправка отменена.",
    "Point Croissant Antalya | Cafe, Bakery & İmza Kruvasan": "Point Croissant Анталья | кафе, пекарня и фирменные круассаны",
    "Blog | Point Croissant": "Блог | Point Croissant",
    "Hikayemiz | Point Croissant": "О нас | Point Croissant",
    "Lezzetler | Point Croissant": "Вкусы | Point Croissant",
    "Menü | Point Croissant": "Меню | Point Croissant",
    "Rezervasyon | Point Croissant": "Бронирование | Point Croissant",
    "Teslimat | Point Croissant": "Доставка | Point Croissant",
    "Toptan | Point Croissant": "Опт | Point Croissant",
    "SSS | Point Croissant": "FAQ | Point Croissant",
    "Kurumsal | Point Croissant": "Корпоративный | Point Croissant",
    "Etkinlikler | Point Croissant": "События | Point Croissant",
    "İmza Kruvasan Rehberi | Point Croissant": "Гид по фирменному круассану | Point Croissant",
    "Kahve Eşleşmesi | Point Croissant": "Сочетание с кофе | Point Croissant",
    "Gizlilik Politikası | Point Croissant": "Политика конфиденциальности | Point Croissant",
    "Kullanım Şartları | Point Croissant": "Условия использования | Point Croissant",
    "Çerez Politikası | Point Croissant": "Политика cookies | Point Croissant",
    "Kat kat dokusunu koruyan, hacimli ve dengeli hamur tekniğinin püf noktaları.": "Ключевые приёмы для слоёной текстуры, объёма и сбалансированного теста.",
    "Damak zevkine uygun en doğru kahve ve kruvasan uyumunu keşfedin.": "Откройте наиболее подходящее сочетание кофе и круассана по вашему вкусу.",
    "Her cumartesi 11:00 - 13:00.": "Каждую субботу 11:00 - 13:00.",
    "Ayda iki kez profesyonel eğitim.": "Профессиональное обучение два раза в месяц.",
    "10-30 kişilik kurumsal organizasyon.": "Корпоративные мероприятия для 10-30 человек.",
    "Ayda iki kez profesyonel egitim.": "Профессиональное обучение два раза в месяц.",
    "10-30 kisilik kurumsal organizasyon.": "Корпоративные мероприятия для 10-30 человек.",
    "“Antalya’da neden hem çıtır hem dengeli kruvasan yok?” sorusu bizim başlangıcımız oldu.": "\"Почему в Анталье нет круассана, который одновременно хрустящий и сбалансированный?\" С этого вопроса всё началось.",
    "O gün mutfağa girip aylarca denemeler yapacağımızı henüz bilmiyorduk.": "В тот день мы ещё не знали, что войдём на кухню и будем экспериментировать месяцами.",
    "İlham aldığımız ilk atmosfer ve servis anlayışı.": "Первая атмосфера и подход к сервису, которые нас вдохновили.",
    "Hamuru bazen fazla yorduk, bazen yeterince dinlendiremedik. Tereyağı seçimi, katlama aralıkları ve fırın dereceleri defalarca değişti. Her denemeyi not alarak reçetemizi adım adım geliştirdik.": "Иногда мы перегружали тесто, иногда не давали ему достаточно отдыха. Выбор масла, интервалы складывания и температура печи менялись много раз. Фиксируя каждый тест, мы шаг за шагом улучшали рецепт.",
    "“Premium olmak, pahalı görünmek değil; her gün aynı özeni gösterebilmektir.”": "\"Премиальность - это не про дорогой вид; это про одинаковую заботу каждый день.\"",
    "Deneyimi tamamlayan servis akışı ve alan tasarımı.": "Поток сервиса и дизайн пространства, завершающие впечатление.",
    "Kahve eşleşmeleri, servis hızı, tezgâh düzeni ve ambalaj hissi bir araya geldiğinde Point Croissant, tekrar gelmek isteyeceğiniz bir deneyime dönüştü.": "Когда сочетания кофе, скорость сервиса, организация стойки и ощущение от упаковки соединились, Point Croissant превратился в опыт, к которому хочется возвращаться.",
    "Aynı disiplinle üretmeye devam ediyoruz. Her yeni tarif ve her geri bildirimle hikayemizi daha ileri taşıyoruz.": "Мы продолжаем работать с той же дисциплиной. С каждым новым рецептом и каждым отзывом мы продвигаем нашу историю дальше.",
    "Point Croissant logosu": "Логотип Point Croissant",
    "İmza kruvasanın temelinde üç şey vardır: doğru hamur yapısı, kontrollü katlama ve sabırlı mayalama. Dışının çıtır, içinin hafif ve katmanlı olması için sürecin her adımı dikkat ister.": "В основе фирменного круассана три вещи: правильная структура теста, контролируемое складывание и терпеливая расстойка. Чтобы снаружи он был хрустящим, а внутри лёгким и слоистым, каждый этап требует внимания.",
    "Kruvasanın en kritik adımı hamurun soğuk zincirde dinlenmesidir. Hamur ısındığında tereyağı katmanlara doğru şekilde dağılmaz; bu da pişince kabarmayı ve katman netliğini düşürür.": "Самый критичный этап - отдых теста в холодной цепи. Когда тесто нагревается, масло распределяется по слоям неправильно, из-за чего уменьшаются подъём и чёткость слоёв при выпечке.",
    "Tereyağı katlarını eşit dağıtmak için her katlamadan sonra hamuru ortalama 25-30 dakika buzdolabında dinlendirin. Bu kısa dinlenme, hamurun tekrar toparlanmasını sağlar ve açma sırasında yırtılmayı azaltır.": "Чтобы равномерно распределить слои масла, после каждого складывания оставляйте тесто в холодильнике на 25-30 минут. Этот короткий отдых помогает тесту восстановиться и уменьшает разрывы при раскатке.",
    "Son mayalamada ortam sıcaklığının 24-26 derece aralığında olması önerilir. Çok düşük sıcaklıkta hacim yavaş gelişir, çok yüksek sıcaklıkta ise tereyağı katmanlardan taşarak yapıyı bozabilir.": "Для финальной расстойки рекомендуется температура 24-26C. При слишком низкой температуре объём растёт медленно, при слишком высокой - масло может вытекать из слоёв и нарушать структуру.",
    "Pişirme aşamasında önceden ısıtılmış fırın kullanın ve ilk dakikalarda kapağı açmamaya özen gösterin. Bu sayede kruvasanlar güçlü bir ilk kabarma alır ve dış yüzeyde dengeli bir renk oluşur.": "На этапе выпечки используйте заранее разогретую печь и старайтесь не открывать дверцу в первые минуты. Так круассаны получают мощный стартовый подъём и ровный цвет корочки.",
    "Servis öncesi kruvasanları kısa bir süre tel ızgara üzerinde dinlendirmek, alt yüzeydeki nemi azaltır ve çıtırlığı korur. Özellikle dolgu eklenecekse bu adım lezzet kadar doku için de fark yaratır.": "Короткий отдых круассанов на решётке перед подачей уменьшает влагу на нижней поверхности и сохраняет хруст. Особенно при добавлении начинки этот шаг важен не только для вкуса, но и для текстуры.",
    "Sade tereyağlı kruvasanla filtre kahve daha dengeli bir tat verir.": "Фильтр-кофе даёт более сбалансированный вкус с классическим масляным круассаном.",
    "Çikolatalı lezzetlerde orta kavrum espresso bazlı içecekler öne çıkar.": "С шоколадными вкусами лучше всего сочетаются эспрессо-напитки средней обжарки.",
    "Meyveli kruvasanlar için soğuk demleme kahveler ferah bir seçimdir.": "Для фруктовых круассанов освежающим выбором будет cold brew.",
    "Point Croissant, Antalya'da kruvasan odaklı bir kafe markasıdır.": "Point Croissant - это кафе-бренд в Анталье, специализирующийся на круассанах.",
    "Kaliteli ürün ve hızlı servis sunuyoruz.": "Мы предлагаем качественные продукты и быстрый сервис.",
    "Franchise, kurumsal iş birliği ve toplu tedarik görüşmeleri için bizimle iletişime geçebilirsiniz.": "Вы можете связаться с нами по вопросам франшизы, корпоративного сотрудничества и оптовых поставок.",
    "Zorunlu değil, ancak hafta sonu ve akşam saatlerinde rezervasyon önerilir.": "Это не обязательно, но в выходные и вечерние часы рекомендуется бронирование.",
    "Rezervasyon sayfasından WhatsApp veya telefon üzerinden hızlıca rezervasyon oluşturabilirsiniz.": "Вы можете быстро оформить бронь через WhatsApp или по телефону со страницы бронирования.",
    "Evet. Etkinlik, ofis ve özel günler için toplu sipariş alıyoruz.": "Да. Мы принимаем оптовые заказы для мероприятий, офисов и особых дней.",
    "Yoğun günlerde en az 1 gün, büyük siparişlerde 2-3 gün önce iletişime geçmeniz önerilir.": "В загруженные дни рекомендуется связаться минимум за 1 день, для крупных заказов - за 2-3 дня.",
    "Evet. Bölgesel teslimat saatleri içinde adrese teslim hizmet sunuyoruz.": "Да. В пределах региональных часов доставки мы доставляем по адресу.",
    "Nakit ve kart ile ödeme yapabilirsiniz. Online yönlendirmelerde ilgili platformun ödeme seçenekleri geçerlidir.": "Вы можете оплатить наличными или картой. При онлайн-переходах действуют способы оплаты соответствующей платформы.",
    "Belirli günlerde sınırlı sayıda glutensiz ürün sunuyoruz.": "В определённые дни мы предлагаем ограниченное количество безглютеновых продуктов.",
    "Evet. Ürün içerikleri ve alerjen bilgileri için ekibimizden detaylı bilgi alabilirsiniz.": "Да. По составу продуктов и аллергенам вы можете получить подробную информацию у нашей команды.",
    "Menü sayfası düzenli olarak güncellenir. Güncel ürün ve fiyat bilgisi için menü sayfasını takip edebilirsiniz.": "Страница меню регулярно обновляется. Актуальные продукты и цены можно отслеживать на странице меню.",
    "Point Croissant olarak kişisel verilerinizi korumayı önceliğimiz kabul ediyoruz. Bu metin, hangi bilgileri neden topladığımızı ve nasıl koruduğumuzu açıklar.": "В Point Croissant защита ваших персональных данных является приоритетом. Этот текст объясняет, какие данные мы собираем, зачем и как их защищаем.",
    "Sitemiz üzerinden bize ilettiğiniz ad, telefon, e-posta ve mesaj içerikleri gibi iletişim bilgileri işlenebilir.": "Контактные данные, которые вы отправляете через сайт (имя, телефон, e-mail и содержание сообщения), могут обрабатываться.",
    "İletişim formlarında paylaştığınız bilgiler": "Информация, которую вы указываете в формах связи",
    "Rezervasyon veya teklif taleplerinde ilettiğiniz veriler": "Данные, переданные в заявках на бронирование или коммерческое предложение",
    "Teknik kullanım verileri (tarayıcı tipi, cihaz bilgisi vb.)": "Технические данные использования (тип браузера, сведения об устройстве и т.д.)",
    "Toplanan veriler yalnızca hizmet sağlama ve iletişim süreçlerini yürütme amacıyla kullanılır.": "Собранные данные используются только для оказания услуг и ведения коммуникации.",
    "Talep ve rezervasyonlara dönüş yapmak": "Ответ на запросы и бронирования",
    "Hizmet kalitesini geliştirmek": "Улучшение качества сервиса",
    "Yasal yükümlülükleri yerine getirmek": "Выполнение юридических обязательств",
    "Kişisel verileriniz, açık rızanız olmadan üçüncü taraflara satılmaz veya pazarlama amacıyla devredilmez.": "Ваши персональные данные не продаются и не передаются третьим лицам в маркетинговых целях без вашего явного согласия.",
    "Yetkisiz erişimi önlemek için makul teknik ve idari güvenlik önlemleri uygulanır.": "Для предотвращения несанкционированного доступа применяются разумные технические и административные меры безопасности.",
    "Verilerinize ilişkin erişim, düzeltme veya silme talepleriniz için bizimle iletişime geçebilirsiniz.": "Вы можете связаться с нами по вопросам доступа, исправления или удаления ваших данных.",
    "Güncel iletişim bilgileri için ana sayfadaki iletişim bölümünü kullanabilirsiniz.": "Для актуальных контактных данных используйте раздел «Контакты» на главной странице.",
    "Bu sayfada yer alan şartlar, Point Croissant web sitesinin kullanımına ilişkin temel kuralları ve tarafların sorumluluklarını belirtir.": "Условия на этой странице определяют базовые правила использования сайта Point Croissant и ответственность сторон.",
    "Bu siteye erişen her kullanıcı, burada yer alan kullanım şartlarını kabul etmiş sayılır.": "Каждый пользователь, посещающий этот сайт, считается принявшим указанные здесь условия использования.",
    "İçerikler bilgilendirme amaçlıdır.": "Содержимое носит информационный характер.",
    "Web sitesindeki görsel ve metinler izinsiz kopyalanamaz.": "Изображения и тексты на сайте нельзя копировать без разрешения.",
    "Site üzerinden yapılan işlemler dürüst kullanım esasına tabidir.": "Операции через сайт подчиняются принципам добросовестного использования.",
    "Ürün içerikleri, stok durumu ve fiyatlar operasyonel nedenlerle güncellenebilir.": "Состав продуктов, наличие и цены могут обновляться по операционным причинам.",
    "Kesin bilgi için sipariş/rezervasyon sırasında ekibimiz tarafından paylaşılan güncel bilgi esas alınır.": "Окончательной считается актуальная информация, предоставленная нашей командой при заказе/бронировании.",
    "Site içinde WhatsApp, harita ve sosyal medya gibi üçüncü taraf bağlantılar bulunabilir.": "На сайте могут быть сторонние ссылки, такие как WhatsApp, карты и соцсети.",
    "Bu platformların kendi kullanım koşulları geçerlidir ve Point Croissant bu platformların politikalarından sorumlu değildir.": "Для этих платформ действуют их собственные условия, и Point Croissant не несёт ответственности за их политики.",
    "Teknik bakım, güncelleme veya mücbir sebepler nedeniyle hizmette geçici kesinti yaşanabilir.": "Из-за технического обслуживания, обновлений или форс-мажора возможны временные перебои в работе сервиса.",
    "Bu tür durumlarda doğabilecek dolaylı zararlardan Point Croissant sorumlu tutulamaz.": "В таких случаях Point Croissant не несёт ответственности за возможный косвенный ущерб.",
    "Bu politika, web sitemizde kullanılan çerez türlerini ve bu çerezlerin hangi amaçlarla işlendiğini açıklamak için hazırlanmıştır.": "Эта политика подготовлена для объяснения типов cookie, используемых на нашем сайте, и целей их обработки.",
    "Çerezler, ziyaret ettiğiniz web sitesinin tarayıcınıza kaydettiği küçük metin dosyalarıdır. Bu dosyalar, site deneyimini iyileştirmek için kullanılır.": "Cookie - это небольшие текстовые файлы, которые посещаемый сайт сохраняет в вашем браузере. Они используются для улучшения работы сайта.",
    "Zorunlu Çerezler:": "Обязательные cookie:",
    "Sayfanın temel işlevlerinin çalışması için gereklidir.": "Необходимы для работы базовых функций страницы.",
    "Performans Çerezleri:": "Cookie производительности:",
    "Site kullanımını analiz ederek geliştirme yapılmasına destek olur.": "Помогают улучшать сайт за счёт анализа его использования.",
    "Tercih Çerezleri:": "Cookie предпочтений:",
    "Kullanıcı ayarlarını hatırlayarak kişiselleştirilmiş deneyim sunar.": "Предоставляют персонализированный опыт, запоминая настройки пользователя.",
    "Çerezleri tarayıcı ayarlarınızdan silebilir, engelleyebilir veya kısıtlayabilirsiniz.": "Вы можете удалить, заблокировать или ограничить cookie в настройках браузера.",
    "Ancak bazı çerezleri devre dışı bırakmanız, sitenin bazı işlevlerinde kısıtlama yaratabilir.": "Однако отключение некоторых cookie может ограничить работу отдельных функций сайта.",
    "Çerez politikamız zaman zaman güncellenebilir. Güncel metin bu sayfa üzerinden yayımlanır.": "Наша политика cookie может периодически обновляться. Актуальный текст публикуется на этой странице.",
    "Point Croissant Admin Panel": "Админ-панель Point Croissant",
    "Yetkili Girişi": "Вход для авторизованных",
    "Admin Panel Kilitli": "Админ-панель заблокирована",
    "Sadece yetkili kullanıcı şifresi ile erişim sağlanır.": "Доступ предоставляется только по паролю авторизованного пользователя.",
    "Şifre": "Пароль",
    "Giriş Yap": "Войти",
    "Yönetim": "Управление",
    "Yönetim Menüsü": "Меню управления",
    "Ürün Yönetimi": "Управление товарами",
    "İletişim Ayarları": "Настройки контактов",
    "İçerik Düzenleme": "Редактирование контента",
    "Marka ve Sayaçlar": "Бренд и счетчики",
    "Menü Yapısı": "Структура меню",
    "Blog Yazıları": "Записи блога",
    "Menü Kategorileri": "Категории меню",
    "SEO ve Google": "SEO и Google",
    "Çalışma Saatleri": "Часы работы",
    "Çalışma Saatleri:": "Часы работы:",
    "Instagram URL": "URL Instagram",
    "Facebook URL": "URL Facebook",
    "Google çalışma saati (şema)": "Часы работы Google (схема)",
    "İmza / özel seçkiye ekle": "Добавить в фирменную подборку",
    "Kategori": "Категория",
    "Ürün Listesi": "Список товаров",
    "Yönetim Özeti": "Сводка управления",
    "Toplam Ürün": "Всего товаров",
    "Ortalama Fiyat": "Средняя цена",
    "En Yüksek Fiyat": "Максимальная цена",
    "Çeviri Eksiği (EN/RU)": "Нехватка перевода (EN/RU)",
    "Önce ürün/ayar bilgilerini kaydet, sonra içerik düzenleyiciden ilgili sayfayı aç.": "Сначала сохраните данные товара/настроек, затем откройте нужную страницу через редактор контента.",
    "Kayıtlı içerik özeti": "Сводка сохранённого контента",
    "Toplam ürün:": "Всего товаров:",
    "Ürün önizleme": "Предпросмотр товаров",
    "Kayıt bulunamadı.": "Записи не найдены.",
    "Sayfa": "Страница",
    "Kayıt": "Запись",
    "Ürün ara (ad/açıklama/etiket)": "Поиск товара (название/описание/тег)",
    "TR alanı": "Поле TR",
    "EN alanı": "Поле EN",
    "RU alanı": "Поле RU",
    "Yeni eklenen (son)": "Сначала новые",
    "Fiyat (yüksekten düşüğe)": "Цена (по убыванию)",
    "Fiyat (düşükten yükseğe)": "Цена (по возрастанию)",
    "Ürün adı (A-Z)": "Название товара (A-Z)",
    "Filtreleri Sıfırla": "Сбросить фильтры",
    "Ürünleri JSON Dışa Aktar": "Экспорт товаров в JSON",
    "JSON İçeri Aktar": "Импорт JSON",
    "Görsel": "Изображение",
    "Çoğalt": "Дублировать",
    "Ürün ve Fiyat Yönetimi": "Управление товарами и ценами",
    "Buradan girdiğin ürünler ana sayfa ve menü sayfasına otomatik yansır.": "Товары, введённые здесь, автоматически отображаются на главной странице и в меню.",
    "Ürün Ekle / Güncelle": "Добавить / Обновить товар",
    "Ürün Adı": "Название товара",
    "Ürün Adı (TR)": "Название товара (TR)",
    "Ürün Adı (EN)": "Название товара (EN)",
    "Ürün Adı (RU)": "Название товара (RU)",
    "Açıklama": "Описание",
    "Açıklama (TR)": "Описание (TR)",
    "Açıklama (EN)": "Описание (EN)",
    "Açıklama (RU)": "Описание (RU)",
    "Ürün Görsel URL": "URL изображения товара",
    "Ürün Görsel URL (TR)": "URL изображения товара (TR)",
    "Ürün Görsel URL (EN)": "URL изображения товара (EN)",
    "Ürün Görsel URL (RU)": "URL изображения товара (RU)",
    "assets/logo-point-croissant.webp veya https://...": "assets/logo-point-croissant.webp или https://...",
    "Fiyat (TL)": "Цена (TL)",
    "Etiket": "Тег",
    "Etiket (TR)": "Тег (TR)",
    "Etiket (EN)": "Тег (EN)",
    "Etiket (RU)": "Тег (RU)",
    "Boşsa TR kullanılır": "Если пусто, используется TR",
    "Kaydet": "Сохранить",
    "Temizle": "Очистить",
    "Varsayılana Dön": "Вернуть по умолчанию",
    "İletişim ve Konum Ayarları": "Настройки контактов и локации",
    "Telefon (gösterim)": "Телефон (отображение)",
    "Telefon (tel format)": "Телефон (формат tel)",
    "WhatsApp (gösterim)": "WhatsApp (отображение)",
    "WhatsApp (numara, ülke kodlu)": "WhatsApp (номер, с кодом страны)",
    "E-Posta": "E-mail",
    "Adres": "Адрес",
    "Adres (TR)": "Адрес (TR)",
    "Adres (EN)": "Адрес (EN)",
    "Adres (RU)": "Адрес (RU)",
    "Harita Konum Metni": "Текст локации на карте",
    "Harita Konum Metni (TR)": "Текст локации на карте (TR)",
    "Harita Konum Metni (EN)": "Текст локации на карте (EN)",
    "Harita Konum Metni (RU)": "Текст локации на карте (RU)",
    "Ayarları Kaydet": "Сохранить настройки",
    "Varsayılan Ayarlar": "Настройки по умолчанию",
    "Canlı İçerik Düzenleyici (Tüm Sayfalar)": "Редактор живого контента (все страницы)",
    "İstediğin sayfayı seçip düzenleme modunu aç. Açılan sayfada": "Выбери нужную страницу и открой режим редактирования. На открывшейся странице",
    "Shift + Tıkla": "Shift + Click",
    "ile metin, link ve görselleri anında düzenle.": "мгновенно редактируй текст, ссылки и изображения.",
    "Düzenlenecek Sayfa": "Редактируемая страница",
    "Gizlilik": "Конфиденциальность",
    "Düzenleme Modunu Aç": "Открыть режим редактирования",
    "Düzenleme Modunu Kapat": "Закрыть режим редактирования",
    "Tüm Düzenlemeleri Sıfırla": "Сбросить все правки",
    "Mevcut Ürünler": "Текущие товары",
    "Ürün": "Товар",
    "Fiyat": "Цена",
    "İşlem": "Действие",
    "Belçika çikolatası dolgusu ve kakao glaze ile yoğun lezzet.": "Насыщенный вкус с бельгийской шоколадной начинкой и какао-глазурью.",
    "En Çok Satan": "Хит продаж",
    "En Cok Satan": "Хит продаж",
    "Fıstık Supreme": "Фисташковый Supreme",
    "Antep fıstık kreması, çıtır fıstık parçası ve tereyağlı hamur.": "Фисташковый крем, хрустящие кусочки фисташки и масляное тесто.",
    "Şef Önerisi": "Рекомендация шефа",
    "Yaban Mersinli Danish": "Черничный Danish",
    "İpeksi krema ve meyve dolgusu ile ferah, dengeli tat.": "Свежий сбалансированный вкус с нежным кремом и фруктовой начинкой.",
    "Yeni": "Новинка",
    "Trüf Mantarlı Tuzlu": "Солёный с трюфельными грибами",
    "Trüf mantarlı tuzlu kruvasan.": "Солёный круассан с трюфельными грибами.",
    "Öne Çıkan": "Популярное",
    "Düzenle": "Редактировать",
    "Sil": "Удалить",
    "Lütfen ürün adı, açıklama ve fiyatı doldur.": "Пожалуйста, заполните название товара, описание и цену.",
    "Ürün güncellendi. Ön yüzde anında yansır.": "Товар обновлён. Изменения сразу отражаются на витрине.",
    "Ürün eklendi. Ön yüzde anında yansır.": "Товар добавлен. Изменения сразу отражаются на витрине.",
    "Ürün düzenleme için forma getirildi.": "Товар загружен в форму для редактирования.",
    "Ürün silindi.": "Товар удалён.",
    "Form temizlendi.": "Форма очищена.",
    "Varsayılan ürünler geri yüklendi.": "Товары по умолчанию восстановлены.",
    "Lütfen tüm iletişim alanlarını doldur.": "Пожалуйста, заполните все поля контактов.",
    "İletişim ve konum ayarları kaydedildi.": "Настройки контактов и локации сохранены.",
    "Ayarlar varsayılana alındı.": "Настройки сброшены к значениям по умолчанию.",
    "Şifre gerekli.": "Требуется пароль.",
    "Şifre hatalı.": "Неверный пароль.",
    "Bu ürünü silmek istediğine emin misin?": "Вы уверены, что хотите удалить этот товар?",
    "Varsayılan ürünleri geri yüklemek istediğine emin misin?": "Вы уверены, что хотите восстановить товары по умолчанию?",
    "Tüm sayfalardaki içerik düzenlemeleri sıfırlanacak. Devam etmek istiyor musun?": "Все изменения контента на всех страницах будут сброшены. Продолжить?",
    "Toplam ürün:": "Всего товаров:",
    "Listelenen:": "Показано:",
    "Ürün kopyalandı.": "Товар продублирован.",
    "Ürünler JSON olarak dışa aktarıldı.": "Товары экспортированы в JSON.",
    "JSON içeriği geçersiz.": "Некорректный JSON.",
    "JSON içe aktarıldı.": "JSON импортирован.",
    "JSON dosyası okunamadı.": "Не удалось прочитать JSON-файл.",
    "Düzenleme modu açıldı. Yeni sekmede Shift + Tıkla ile metin/link/görsel düzenleyebilirsin.": "Режим редактирования открыт. В новой вкладке можно редактировать текст/ссылки/изображения через Shift + Click.",
    "Düzenleme modu kapatıldı.": "Режим редактирования закрыт.",
    "Tüm sayfa içerik düzenlemeleri sıfırlandı.": "Все правки контента на страницах сброшены.",
    "Görsel URL": "URL изображения",
    "Alt metni": "Alt-текст",
    "Link metni": "Текст ссылки",
    "Link adresi": "Адрес ссылки",
    "Metin": "Текст",
    "Yeni, Premium...": "Новинка, Премиум...",
    "Güzeloba Mah. Çağlayangil Cad. No:38 / B, Muratpaşa / Antalya": "Гюзелоба, ул. Чаглаянгиль, No:38 / B, Муратпаша / Анталья",
    "Merhaba Point Croissant, bilgi almak istiyorum.": "Здравствуйте, Point Croissant, я хотел(а) бы получить информацию.",
    "Merhaba Point Croissant,\n\nİstek / Dilek / Öneri Formu:\nAd Soyad: ${data.name}\nE-Posta: ${data.email}\nTelefon: ${data.phone}\nMesaj: ${data.message}": "Здравствуйте, Point Croissant,\n\nФорма запроса / предложения:\nИмя и фамилия: ${data.name}\nE-mail: ${data.email}\nТелефон: ${data.phone}\nСообщение: ${data.message}",
    "Point Croissant Antalya resmi web sitesi. Güzeloba, Muratpaşa’da cafe ve bakery: imza kruvasanlar, menü, rezervasyon ve iletişim.": "Официальный сайт Point Croissant в Анталье. Кафе и пекарня в Гюзелоба, Муратпаша: фирменные круассаны, меню, бронирование и контакты.",
    "Point Croissant Antalya lezzetleri: imza kruvasanlar, öne çıkan ürünler ve sipariş için iletişim bilgileri.": "Вкусы Point Croissant в Анталье: фирменные круассаны, популярные позиции и контакты для заказа.",
    "Point Croissant Antalya menü: güncel fiyatlar, kategorili kruvasan ve cafe ürünleri.": "Меню Point Croissant в Анталье: актуальные цены, круассаны по категориям и позиции кафе.",
    "Point Croissant hikayesi, üretim anlayışı ve marka yolculuğu.": "История Point Croissant, подход к производству и путь бренда.",
    "Kruvasan, kahve ve servis önerileri için Point Croissant blog içerikleri.": "Материалы блога Point Croissant о круассанах, кофе и сервисе.",
    "İmza kruvasan hazırlama rehberi, püf noktaları ve üretim önerileri.": "Гид по приготовлению фирменного круассана, советы и рекомендации по производству.",
    "Kahve ve kruvasan eşleşmesi için pratik öneriler ve lezzet uyumları.": "Практические советы и вкусовые сочетания кофе и круассанов.",
    "Point Croissant etkinlikleri ve özel gün organizasyon bilgileri.": "События Point Croissant и информация по организации особых дней.",
    "Kurumsal iş birliği, marka bilgisi ve Point Croissant hakkında detaylar.": "Корпоративное сотрудничество, информация о бренде и подробности о Point Croissant.",
    "Sıkça sorulan sorular: rezervasyon, teslimat, toplu sipariş ve daha fazlası.": "Часто задаваемые вопросы: бронирование, доставка, оптовые заказы и другое.",
    "Point Croissant masa rezervasyonu için WhatsApp ve telefonla hızlı iletişim.": "Быстрая связь через WhatsApp и телефон для бронирования столика в Point Croissant.",
    "Antalya içi teslimat saatleri, sipariş detayları ve iletişim seçenekleri.": "Часы доставки по Анталье, детали заказа и варианты связи.",
    "Toptan ve kurumsal tedarik çözümleri için teklif ve iletişim bilgileri.": "Контакты и информация для запроса по оптовым и корпоративным поставкам.",
    "Point Croissant Gizlilik Politikası metni ve kişisel veri işleme esasları.": "Текст Политики конфиденциальности Point Croissant и принципы обработки персональных данных.",
    "Point Croissant Kullanım Şartları ve site kullanımına ilişkin kurallar.": "Условия использования Point Croissant и правила работы с сайтом.",
    "Point Croissant Çerez Politikası ve çerez tercihleri hakkında bilgiler.": "Политика cookie Point Croissant и информация о настройках cookie.",
    "Web sitesi ve yazılım: SoftenWise": "Сайт и разработка ПО: SoftenWise",
    "SoftenWise — yazılım ve web geliştirme": "SoftenWise — разработка ПО и веб-сайтов",
    "Çeviri Eksiği (EN/RU/AR/DE)": "Нехватка перевода (EN/RU/AR/DE)",
    "AR alanı": "Поле AR",
    "DE alanı": "Поле DE",
    "Ürün Adı (AR)": "Название товара (AR)",
    "Ürün Adı (DE)": "Название товара (DE)",
    "Açıklama (AR)": "Описание (AR)",
    "Açıklama (DE)": "Описание (DE)",
    "Etiket (AR)": "Тег (AR)",
    "Etiket (DE)": "Тег (DE)",
    "Ürün Görsel URL (AR)": "URL изображения товара (AR)",
    "Ürün Görsel URL (DE)": "URL изображения товара (DE)",
    "Adres (AR)": "Адрес (AR)",
    "Adres (DE)": "Адрес (DE)",
    "Harita Konum Metni (AR)": "Текст локации на карте (AR)",
    "Harita Konum Metni (DE)": "Текст локации на карте (DE)",
    "Blog Yazıları": "Записи блога",
    "Facebook URL": "URL Facebook",
    "Google çalışma saati (şema)": "Часы работы Google (схема)",
    "Instagram URL": "URL Instagram",
    "Kategori": "Категория",
    "Marka ve Sayaçlar": "Бренд и счётчики",
    "Menü Kategorileri": "Категории меню",
    "Menü Yapısı": "Структура меню",
    "SEO ve Google": "SEO и Google",
    "Tuzlu": "Солёное",
    "WhatsApp hazır mesaj (EN)": "Готовое сообщение WhatsApp (EN)",
    "WhatsApp hazır mesaj (RU)": "Готовое сообщение WhatsApp (RU)",
    "WhatsApp hazır mesaj (TR)": "Готовое сообщение WhatsApp (TR)",
    "WhatsApp hazır mesaj (AR)": "Готовое сообщение WhatsApp (AR)",
    "WhatsApp hazır mesaj (DE)": "Готовое сообщение WhatsApp (DE)",
    "Çalışma Saatleri": "Часы работы",
    "Çalışma Saatleri:": "Часы работы:",
    "İmza / özel seçkiye ekle": "Добавить в фирменную / особую подборку"
  },
  de: {
    "Anasayfa": "Startseite",
    "Hikayemiz": "Unsere Geschichte",
    "Lezzetler": "Sorten",
    "Galeri": "Galerie",
    "Tarifler": "Rezepte",
    "İletişim": "Kontakt",
    "Sipariş Ver": "Jetzt bestellen",
    "Keşfet": "Entdecken",
    "Menü": "Menü",
    "Etkinlikler": "Veranstaltungen",
    "Hizmetler": "Leistungen",
    "Rezervasyon": "Reservierung",
    "Teslimat": "Lieferung",
    "Toptan": "Großhandel",
    "SSS": "FAQ",
    "Yasal": "Rechtliches",
    "Gizlilik Politikası": "Datenschutzerklärung",
    "Kullanım Şartları": "Nutzungsbedingungen",
    "Çerez Politikası": "Cookie-Richtlinie",
    "Günün en keyifli molası için taptaze kruvasanlar ve özenli kahve.": "Frische Croissants und sorgfältig zubereiteter Kaffee für die schönste Pause Ihres Tages.",
    "Antalya, Türkiye": "Antalya, Türkei",
    "Menüyü aç/kapat": "Menü öffnen/schließen",
    "Dil seçimi": "Sprachauswahl",
    "Güne Lezzetli Bir Başlangıç": "Ein köstlicher Start in Ihren Tag",
    "Çıtır katmanlar, özel reçeteler ve özenle hazırlanan sunumlar. Her lokmada kaliteyi hissedin.": "Knusprige Schichten, Signaturrezepte und sorgfältig gestaltete Präsentation. Spüren Sie Qualität in jedem Bissen.",
    "Antalya · Cafe & Bakery": "Antalya · Café & Bäckerei",
    "Keşfetmeye devam et": "Weiter entdecken",
    "Katman katman, her sabah taze": "Schicht für Schicht, jeden Morgen frisch",
    "Tereyağlı": "Butterig",
    "Çikolatalı": "Schokolade",
    "Fıstıklı": "Pistazie",
    "Brunch": "Brunch",
    "Espresso": "Espresso",
    "Taze üretim her sabah": "Jeden Morgen frisch zubereitet",
    "Kat kat çıtır hamur": "Knuspriger, blättriger Teig",
    "Özenle çekilmiş kahve": "Sorgfältig zubereiteter Kaffee",
    "Lara’da imza kruvasan deneyimi": "Signatur-Croissant-Erlebnis in Lara",
    "Lezzetleri Keşfet": "Sorten entdecken",
    "Bize Ulaş": "Kontaktieren Sie uns",
    "Yıllık Ustalık": "Jahre Handwerkskunst",
    "Özel Tarif": "Signaturrezept",
    "Günlük Servis": "Täglicher Service",
    "Lezzet Sayfası": "Sortenseite",
    "İmza kruvasanlarımız": "Unsere Signatur-Croissants",
    "Tüm ürünleri tek sayfada inceleyebilirsiniz.": "Alle Produkte auf einer Seite entdecken.",
    "Lezzet Sayfasına Git": "Zur Sortenseite",
    "Lezzet Galerisi": "Sortengalerie",
    "Katman detayı": "Schichtdetail",
    "Kahve eşleşmesi": "Kaffeekombination",
    "Tümü": "Alle",
    "Tatlı": "Süß",
    "Meyveli": "Fruchtig",
    "Konum": "Standort",
    "Telefon": "Telefon",
    "E-posta": "E-mail",
    "WhatsApp": "WhatsApp",
    "Konuma Git": "Route berechnen",
    "WhatsApp ile İletişim": "Kontakt per WhatsApp",
    "Hemen Ara": "Jetzt anrufen",
    "Bize Yazın": "Schreiben Sie uns",
    "İstek / Dilek / Öneri Formu": "Anfrage- / Vorschlagsformular",
    "Görüşlerinizi bizimle paylaşın": "Teilen Sie uns Ihr Feedback mit",
    "Ad Soyad": "Vor- und Nachname",
    "Mesaj": "Nachricht",
    "Gönder": "Senden",
    "WhatsApp ile iletişime geç": "Kontakt per WhatsApp",
    "Öne Çıkanlar": "Empfohlen",
    "İmza Kruvasanlarımız": "Unsere Signatur-Croissants",
    "Günün en sevilen ürünleri tek sayfada.": "Die beliebtesten Produkte des Tages auf einer Seite.",
    "Detay ve sipariş için hemen ulaş": "Details erfahren und jetzt bestellen",
    "WhatsApp'tan Yaz": "Per WhatsApp schreiben",
    "Bizi Arayın": "Rufen Sie uns an",
    "Masa Rezervasyonu": "Tischreservierung",
    "Rezervasyon için bizi arayabilir veya WhatsApp ile yazabilirsiniz.": "Für eine Reservierung können Sie uns anrufen oder per WhatsApp schreiben.",
    "WhatsApp ile Rezerve Et": "Per WhatsApp reservieren",
    "Antalya İçine Hızlı Teslimat": "Schnelle Lieferung in Antalya",
    "Bölgesel teslimat saatleri 09:00 - 22:00 arasındadır.": "Die regionalen Lieferzeiten liegen zwischen 09:00 und 22:00 Uhr.",
    "Toplu siparişlerde bir gün önce ön sipariş önerilir.": "Bei Sammelbestellungen empfehlen wir eine Vorbestellung einen Tag im Voraus.",
    "Kurumsal Tedarik Çözümleri": "Lösungen für die Unternehmensversorgung",
    "Oteller, butik cafeler ve restoranlar için özel gramaj ve paketleme seçenekleri.": "Individuelle Grammaturen und Verpackungsoptionen für Hotels, Boutique-Cafés und Restaurants.",
    "Detaylı teklif almak için talep formunu doldurabilirsiniz.": "Füllen Sie das Anfrageformular aus, um ein detailliertes Angebot zu erhalten.",
    "Point Croissant’in Yolculuğu": "Die Reise von Point Croissant",
    "Bir tariften fazlası: özenle inşa edilen bir lezzet kültürü.": "Mehr als ein Rezept: eine mit Sorgfalt aufgebaute Genusskultur.",
    "Bir soruyla başlayan yolculuk": "Eine Reise, die mit einer Frage begann",
    "Katman, sıcaklık ve sabrın dengesi": "Die Balance aus Schichten, Temperatur und Geduld",
    "Sadece ürün değil, bütün bir deneyim": "Nicht nur ein Produkt, sondern ein ganzes Erlebnis",
    "Her gün aynı kalite, her sabah taze üretim": "Jeden Tag dieselbe Qualität, jeden Morgen frische Produktion",
    "Blog & Rehber": "Blog & Ratgeber",
    "Kruvasan, kahve ve servis önerileri": "Tipps zu Croissant, Kaffee und Service",
    "İmza kruvasan": "Signatur-Croissant",
    "İmza Kruvasan Nasıl Yapılır?": "Wie macht man ein Signatur-Croissant?",
    "Kat kat dokusunu koruyan, hacimli ve dengeli hamur tekniğinin püf noktaları.": "Wichtige Techniken für blättrige Textur und ausgewogenen Teig.",
    "Devamını Oku": "Weiterlesen",
    "Kahve eşleşmesi": "Kaffee-Pairing",
    "Kahve ile Kruvasan Eşleşmesi": "Kaffee- und Croissant-Pairing",
    "Damak zevkine uygun en doğru kahve ve kruvasan uyumunu keşfedin.": "Entdecken Sie die passende Kombination aus Kaffee und Croissant für Ihren Geschmack.",
    "Sıkça Sorulan Sorular": "Häufig gestellte Fragen",
    "Kahve ve Kruvasan Eşleşmesi": "Kaffee- und Croissant-Pairing",
    "İmza Kruvasan Rehberi": "Signatur-Croissant-Ratgeber",
    "Blog listesine dön": "Zurück zur Blog-Übersicht",
    "Düzenleme modu açık - Shift + Tıkla düzenle": "Bearbeitungsmodus aktiv - Shift + Click zum Bearbeiten",
    "Kapat": "Schließen",
    "Bu sayfayı sıfırla": "Diese Seite zurücksetzen",
    "İçeriğe geç": "Zum Inhalt springen",
    "Blog": "Blog",
    "Blog: İmza Kruvasan": "Blog: Signatur-Croissant",
    "Blog: Kahve Eşleşmesi": "Blog: Kaffee-Pairing",
    "İletişim & Konum Bilgileri": "Kontakt- & Standortinfos",
    "Telefon ile ara": "Telefonisch anrufen",
    "WhatsApp'tan yazabilir veya direkt arayabilirsin.": "Sie können uns per WhatsApp schreiben oder direkt anrufen.",
    "Tarif": "Rezept",
    "Rehber": "Ratgeber",
    "Etkinlik": "Veranstaltung",
    "Atölye ve Özel Davetler": "Workshops und private Veranstaltungen",
    "Kruvasan Atölyesi": "Croissant-Workshop",
    "Atolye ve Ozel Davetler": "Workshops und private Veranstaltungen",
    "Kruvasan Atolyesi": "Croissant-Workshop",
    "Kurumsal": "Unternehmen",
    "Point Croissant Hakkında": "Über Point Croissant",
    "Taze Üretim Kruvasanlar": "Frisch zubereitete Croissants",
    "İmza lezzetlerimizi kategorili, modern ve şık bir menü düzeninde keşfedin.": "Entdecken Sie unsere Signatursorten in einem kategorisierten, modernen und eleganten Menü-Layout.",
    "Lezzet Haritası": "Sortenkarte",
    "Point Croissant Menü Seçkisi": "Point Croissant Menüauswahl",
    "Ürünler içerik yapısına göre kategorilendirilir ve admin panelindeki güncel fiyatlarla otomatik listelenir.": "Produkte werden nach Inhalt kategorisiert und automatisch mit aktuellen Preisen aus dem Admin-Panel aufgelistet.",
    "Taze üretim": "Frisch zubereitet",
    "Güncel fiyat": "Aktueller Preis",
    "Kategorili görünüm": "Kategorisierte Ansicht",
    "Detay Al": "Details anfordern",
    "Özel Lezzet": "Besondere Sorte",
    "Seçki": "Auswahl",
    "Tatlı Kruvasanlar": "Süße Croissants",
    "Meyveli, çikolatalı ve özel dolgulu tatlı seçenekler.": "Fruchtige, schokoladige und speziell gefüllte süße Varianten.",
    "Tuzlu Kruvasanlar": "Herzhafte Croissants",
    "Dengeli tuzlu tarifler ve brunch için ideal seçenekler.": "Ausgewogene herzhafte Rezepte und ideale Optionen für den Brunch.",
    "İmza ve Özel Seçkiler": "Signatur- und Spezialauswahl",
    "Şef önerileri, premium tarifler ve vitrinin yıldızları.": "Empfehlungen des Küchenchefs, Premium-Rezepte und Stars der Vitrine.",
    "Rezervasyon gerekli mi?": "Ist eine Reservierung erforderlich?",
    "Rezervasyon nasıl yapabilirim?": "Wie kann ich reservieren?",
    "Toplu sipariş alıyor musunuz?": "Nehmen Sie Sammelbestellungen an?",
    "Toplu sipariş için ne kadar önce iletişime geçmeliyim?": "Wie früh sollte ich Sie bei Sammelbestellungen kontaktieren?",
    "Teslimat hizmetiniz var mı?": "Bieten Sie Lieferung an?",
    "Ödeme seçenekleri nelerdir?": "Welche Zahlungsmöglichkeiten gibt es?",
    "Glutensiz seçenek var mı?": "Gibt es glutenfreie Optionen?",
    "Alerjen bilgisi alabilir miyim?": "Kann ich Allergeninformationen erhalten?",
    "Menü ve fiyatlar güncel mi?": "Sind Menü und Preise aktuell?",
    "1. Toplanan Bilgiler": "1. Erhobene Informationen",
    "2. Verilerin Kullanım Amaçları": "2. Zwecke der Datennutzung",
    "3. Veri Paylaşımı ve Güvenlik": "3. Datenweitergabe und Sicherheit",
    "4. Haklarınız ve İletişim": "4. Ihre Rechte und Kontakt",
    "1. Genel Kullanım": "1. Allgemeine Nutzung",
    "2. Fiyat ve Ürün Bilgileri": "2. Preis- und Produktinformationen",
    "3. Bağlantılar ve Üçüncü Taraf Hizmetler": "3. Links und Dienste Dritter",
    "4. Sorumluluk Sınırı": "4. Haftungsbeschränkung",
    "1. Çerez Nedir?": "1. Was ist ein Cookie?",
    "2. Hangi Çerezleri Kullanıyoruz?": "2. Welche Cookies verwenden wir?",
    "3. Çerez Tercihleri Nasıl Yönetilir?": "3. Wie verwalten Sie Cookie-Einstellungen?",
    "4. Politika Güncellemeleri": "4. Aktualisierungen der Richtlinie",
    "Lütfen tüm alanları doldur.": "Bitte füllen Sie alle Felder aus.",
    "Mesajın WhatsApp üzerinden hazırlandı ve açıldı.": "Ihre Nachricht wurde vorbereitet und in WhatsApp geöffnet.",
    "Link kopyalandı.": "Link kopiert.",
    "Link kopyalanamadı.": "Link konnte nicht kopiert werden.",
    "Bu cihazda paylaşım özelliği yok.": "Teilen ist auf diesem Gerät nicht verfügbar.",
    "Paylaşım başarılı.": "Erfolgreich geteilt.",
    "Paylaşım iptal edildi.": "Teilen wurde abgebrochen.",
    "Point Croissant Antalya | Cafe, Bakery & İmza Kruvasan": "Point Croissant Antalya | Café, Bäckerei & Signatur-Croissants",
    "Blog | Point Croissant": "Blog | Point Croissant",
    "Hikayemiz | Point Croissant": "Unsere Geschichte | Point Croissant",
    "Lezzetler | Point Croissant": "Sorten | Point Croissant",
    "Menü | Point Croissant": "Menü | Point Croissant",
    "Rezervasyon | Point Croissant": "Reservierung | Point Croissant",
    "Teslimat | Point Croissant": "Lieferung | Point Croissant",
    "Toptan | Point Croissant": "Großhandel | Point Croissant",
    "SSS | Point Croissant": "FAQ | Point Croissant",
    "Kurumsal | Point Croissant": "Unternehmen | Point Croissant",
    "Etkinlikler | Point Croissant": "Veranstaltungen | Point Croissant",
    "İmza Kruvasan Rehberi | Point Croissant": "Signatur-Croissant-Ratgeber | Point Croissant",
    "Kahve Eşleşmesi | Point Croissant": "Kaffee-Pairing | Point Croissant",
    "Gizlilik Politikası | Point Croissant": "Datenschutzerklärung | Point Croissant",
    "Kullanım Şartları | Point Croissant": "Nutzungsbedingungen | Point Croissant",
    "Çerez Politikası | Point Croissant": "Cookie-Richtlinie | Point Croissant",
    "Her cumartesi 11:00 - 13:00.": "Jeden Samstag 11:00 - 13:00 Uhr.",
    "Ayda iki kez profesyonel eğitim.": "Professionelle Schulung zweimal im Monat.",
    "10-30 kişilik kurumsal organizasyon.": "Firmenveranstaltung für 10-30 Personen.",
    "Ayda iki kez profesyonel egitim.": "Professionelle Schulung zweimal im Monat.",
    "10-30 kisilik kurumsal organizasyon.": "Firmenveranstaltung für 10-30 Personen.",
    "“Antalya’da neden hem çıtır hem dengeli kruvasan yok?” sorusu bizim başlangıcımız oldu.": "„Warum gibt es in Antalya kein Croissant, das sowohl knusprig als auch ausgewogen ist?“ Diese Frage war unser Anfang.",
    "O gün mutfağa girip aylarca denemeler yapacağımızı henüz bilmiyorduk.": "An jenem Tag wussten wir noch nicht, dass wir die Küche betreten und monatelang experimentieren würden.",
    "İlham aldığımız ilk atmosfer ve servis anlayışı.": "Die erste Atmosphäre und das Serviceverständnis, die uns inspiriert haben.",
    "Hamuru bazen fazla yorduk, bazen yeterince dinlendiremedik. Tereyağı seçimi, katlama aralıkları ve fırın dereceleri defalarca değişti. Her denemeyi not alarak reçetemizi adım adım geliştirdik.": "Manchmal haben wir den Teig überarbeitet, manchmal konnten wir ihn nicht lange genug ruhen lassen. Die Butterwahl, die Faltintervalle und die Ofentemperaturen haben sich viele Male geändert. Indem wir jeden Versuch notierten, haben wir unser Rezept Schritt für Schritt verbessert.",
    "“Premium olmak, pahalı görünmek değil; her gün aynı özeni gösterebilmektir.”": "„Premium zu sein bedeutet nicht, teuer auszusehen; es bedeutet, jeden Tag dieselbe Sorgfalt zu zeigen.“",
    "Deneyimi tamamlayan servis akışı ve alan tasarımı.": "Serviceablauf und Raumgestaltung, die das Erlebnis vollenden.",
    "Kahve eşleşmeleri, servis hızı, tezgâh düzeni ve ambalaj hissi bir araya geldiğinde Point Croissant, tekrar gelmek isteyeceğiniz bir deneyime dönüştü.": "Als Kaffee-Pairings, Servicegeschwindigkeit, Thekenordnung und das Gefühl der Verpackung zusammenkamen, wurde Point Croissant zu einem Erlebnis, zu dem man gerne zurückkehrt.",
    "Aynı disiplinle üretmeye devam ediyoruz. Her yeni tarif ve her geri bildirimle hikayemizi daha ileri taşıyoruz.": "Wir produzieren weiterhin mit derselben Disziplin. Mit jedem neuen Rezept und jedem Feedback führen wir unsere Geschichte weiter.",
    "Point Croissant logosu": "Point Croissant Logo",
    "İmza kruvasanın temelinde üç şey vardır: doğru hamur yapısı, kontrollü katlama ve sabırlı mayalama. Dışının çıtır, içinin hafif ve katmanlı olması için sürecin her adımı dikkat ister.": "Im Kern eines Signatur-Croissants stehen drei Dinge: die richtige Teigstruktur, kontrolliertes Falten und geduldiges Gehenlassen. Jeder Schritt erfordert Aufmerksamkeit für eine knusprige Kruste und ein leichtes, blättriges Inneres.",
    "Kruvasanın en kritik adımı hamurun soğuk zincirde dinlenmesidir. Hamur ısındığında tereyağı katmanlara doğru şekilde dağılmaz; bu da pişince kabarmayı ve katman netliğini düşürür.": "Der wichtigste Schritt ist das Ruhen des Teigs in der Kühlkette. Wenn der Teig warm wird, verteilt sich die Butter nicht richtig in den Schichten; das mindert den Auftrieb und die Schichtdefinition nach dem Backen.",
    "Tereyağı katlarını eşit dağıtmak için her katlamadan sonra hamuru ortalama 25-30 dakika buzdolabında dinlendirin. Bu kısa dinlenme, hamurun tekrar toparlanmasını sağlar ve açma sırasında yırtılmayı azaltır.": "Damit sich die Butterschichten gleichmäßig verteilen, lassen Sie den Teig nach jedem Falten etwa 25-30 Minuten im Kühlschrank ruhen. Diese kurze Pause hilft dem Teig, sich zu erholen, und verringert das Reißen beim Ausrollen.",
    "Son mayalamada ortam sıcaklığının 24-26 derece aralığında olması önerilir. Çok düşük sıcaklıkta hacim yavaş gelişir, çok yüksek sıcaklıkta ise tereyağı katmanlardan taşarak yapıyı bozabilir.": "Beim finalen Gehenlassen wird eine Umgebungstemperatur von 24-26 °C empfohlen. Bei sehr niedrigen Temperaturen entwickelt sich das Volumen langsam; bei sehr hohen Temperaturen kann Butter aus den Schichten austreten und die Struktur beschädigen.",
    "Pişirme aşamasında önceden ısıtılmış fırın kullanın ve ilk dakikalarda kapağı açmamaya özen gösterin. Bu sayede kruvasanlar güçlü bir ilk kabarma alır ve dış yüzeyde dengeli bir renk oluşur.": "Backen Sie in einem vorgeheizten Ofen und öffnen Sie die Tür in den ersten Minuten nicht. So erhalten die Croissants einen kräftigen Ofentrieb und eine gleichmäßige Außenfarbe.",
    "Servis öncesi kruvasanları kısa bir süre tel ızgara üzerinde dinlendirmek, alt yüzeydeki nemi azaltır ve çıtırlığı korur. Özellikle dolgu eklenecekse bu adım lezzet kadar doku için de fark yaratır.": "Wenn Croissants vor dem Servieren kurz auf einem Rost ruhen, verringert das die Feuchtigkeit an der Unterseite und bewahrt die Knusprigkeit. Besonders wenn eine Füllung folgt, verbessert dieser Schritt die Textur ebenso wie den Geschmack.",
    "Sade tereyağlı kruvasanla filtre kahve daha dengeli bir tat verir.": "Filterkaffee ergibt mit einem schlichten Buttercroissant einen ausgewogeneren Geschmack.",
    "Çikolatalı lezzetlerde orta kavrum espresso bazlı içecekler öne çıkar.": "Zu Schokoladensorten passen Getränke auf Espresso-Basis mit mittlerer Röstung besonders gut.",
    "Meyveli kruvasanlar için soğuk demleme kahveler ferah bir seçimdir.": "Zu fruchtigen Croissants sind Cold-Brew-Kaffees eine erfrischende Wahl.",
    "Point Croissant, Antalya'da kruvasan odaklı bir kafe markasıdır.": "Point Croissant ist eine croissant-fokussierte Café-Marke in Antalya.",
    "Kaliteli ürün ve hızlı servis sunuyoruz.": "Wir bieten Qualitätsprodukte und schnellen Service.",
    "Franchise, kurumsal iş birliği ve toplu tedarik görüşmeleri için bizimle iletişime geçebilirsiniz.": "Kontaktieren Sie uns für Franchise, Unternehmenspartnerschaften und Großlieferungen.",
    "Zorunlu değil, ancak hafta sonu ve akşam saatlerinde rezervasyon önerilir.": "Sie ist nicht verpflichtend, an Wochenenden und in den Abendstunden empfehlen wir jedoch eine Reservierung.",
    "Rezervasyon sayfasından WhatsApp veya telefon üzerinden hızlıca rezervasyon oluşturabilirsiniz.": "Über die Reservierungsseite können Sie schnell per WhatsApp oder Telefon reservieren.",
    "Evet. Etkinlik, ofis ve özel günler için toplu sipariş alıyoruz.": "Ja. Wir nehmen Sammelbestellungen für Veranstaltungen, Büros und besondere Anlässe entgegen.",
    "Yoğun günlerde en az 1 gün, büyük siparişlerde 2-3 gün önce iletişime geçmeniz önerilir.": "An stark nachgefragten Tagen kontaktieren Sie uns bitte mindestens 1 Tag im Voraus; bei großen Bestellungen empfehlen wir 2-3 Tage.",
    "Evet. Bölgesel teslimat saatleri içinde adrese teslim hizmet sunuyoruz.": "Ja. Innerhalb der regionalen Lieferzeiten liefern wir nach Hause.",
    "Nakit ve kart ile ödeme yapabilirsiniz. Online yönlendirmelerde ilgili platformun ödeme seçenekleri geçerlidir.": "Sie können bar oder mit Karte bezahlen. Bei Online-Weiterleitungen gelten die Zahlungsmöglichkeiten der jeweiligen Plattform.",
    "Belirli günlerde sınırlı sayıda glutensiz ürün sunuyoruz.": "An ausgewählten Tagen bieten wir eine begrenzte Anzahl glutenfreier Produkte an.",
    "Evet. Ürün içerikleri ve alerjen bilgileri için ekibimizden detaylı bilgi alabilirsiniz.": "Ja. Unser Team gibt Ihnen gerne detaillierte Auskunft zu Inhaltsstoffen und Allergenen.",
    "Menü sayfası düzenli olarak güncellenir. Güncel ürün ve fiyat bilgisi için menü sayfasını takip edebilirsiniz.": "Die Menüseite wird regelmäßig aktualisiert. Aktuelle Produkt- und Preisinformationen finden Sie dort.",
    "Point Croissant olarak kişisel verilerinizi korumayı önceliğimiz kabul ediyoruz. Bu metin, hangi bilgileri neden topladığımızı ve nasıl koruduğumuzu açıklar.": "Als Point Croissant betrachten wir den Schutz Ihrer personenbezogenen Daten als Priorität. Dieser Text erläutert, welche Informationen wir erheben, warum wir sie erheben und wie wir sie schützen.",
    "Sitemiz üzerinden bize ilettiğiniz ad, telefon, e-posta ve mesaj içerikleri gibi iletişim bilgileri işlenebilir.": "Kontaktdaten wie Name, Telefon, E-Mail und Nachrichteninhalte, die Sie über unsere Website übermitteln, können verarbeitet werden.",
    "İletişim formlarında paylaştığınız bilgiler": "Informationen, die Sie in Kontaktformularen mitteilen",
    "Rezervasyon veya teklif taleplerinde ilettiğiniz veriler": "Daten, die Sie bei Reservierungs- oder Angebotsanfragen angeben",
    "Teknik kullanım verileri (tarayıcı tipi, cihaz bilgisi vb.)": "Technische Nutzungsdaten (Browsertyp, Geräteinformationen usw.)",
    "Toplanan veriler yalnızca hizmet sağlama ve iletişim süreçlerini yürütme amacıyla kullanılır.": "Erhobene Daten werden ausschließlich zur Erbringung von Leistungen und zur Abwicklung der Kommunikation verwendet.",
    "Talep ve rezervasyonlara dönüş yapmak": "Beantwortung von Anfragen und Reservierungen",
    "Hizmet kalitesini geliştirmek": "Verbesserung der Servicequalität",
    "Yasal yükümlülükleri yerine getirmek": "Erfüllung gesetzlicher Pflichten",
    "Kişisel verileriniz, açık rızanız olmadan üçüncü taraflara satılmaz veya pazarlama amacıyla devredilmez.": "Ihre personenbezogenen Daten werden ohne Ihre ausdrückliche Einwilligung nicht an Dritte verkauft oder zu Marketingzwecken weitergegeben.",
    "Yetkisiz erişimi önlemek için makul teknik ve idari güvenlik önlemleri uygulanır.": "Angemessene technische und organisatorische Sicherheitsmaßnahmen werden angewendet, um unbefugten Zugriff zu verhindern.",
    "Verilerinize ilişkin erişim, düzeltme veya silme talepleriniz için bizimle iletişime geçebilirsiniz.": "Für Auskunfts-, Berichtigungs- oder Löschungsanträge zu Ihren Daten können Sie uns kontaktieren.",
    "Güncel iletişim bilgileri için ana sayfadaki iletişim bölümünü kullanabilirsiniz.": "Aktuelle Kontaktdaten finden Sie im Kontaktbereich auf der Startseite.",
    "Bu sayfada yer alan şartlar, Point Croissant web sitesinin kullanımına ilişkin temel kuralları ve tarafların sorumluluklarını belirtir.": "Die Bedingungen auf dieser Seite legen die grundlegenden Regeln für die Nutzung der Point Croissant Website sowie die Verantwortlichkeiten der Parteien fest.",
    "Bu siteye erişen her kullanıcı, burada yer alan kullanım şartlarını kabul etmiş sayılır.": "Jede Person, die diese Website aufruft, gilt als mit den hier genannten Nutzungsbedingungen einverstanden.",
    "İçerikler bilgilendirme amaçlıdır.": "Die Inhalte dienen Informationszwecken.",
    "Web sitesindeki görsel ve metinler izinsiz kopyalanamaz.": "Bilder und Texte auf der Website dürfen ohne Genehmigung nicht kopiert werden.",
    "Site üzerinden yapılan işlemler dürüst kullanım esasına tabidir.": "Über die Website vorgenommene Vorgänge unterliegen den Grundsätzen der fairen Nutzung.",
    "Ürün içerikleri, stok durumu ve fiyatlar operasyonel nedenlerle güncellenebilir.": "Produktinhalte, Lagerbestand und Preise können aus betrieblichen Gründen aktualisiert werden.",
    "Kesin bilgi için sipariş/rezervasyon sırasında ekibimiz tarafından paylaşılan güncel bilgi esas alınır.": "Maßgeblich sind die aktuellen Angaben, die unser Team bei Bestellung/Reservierung mitteilt.",
    "Site içinde WhatsApp, harita ve sosyal medya gibi üçüncü taraf bağlantılar bulunabilir.": "Die Website kann Links Dritter enthalten, etwa zu WhatsApp, Karten und sozialen Medien.",
    "Bu platformların kendi kullanım koşulları geçerlidir ve Point Croissant bu platformların politikalarından sorumlu değildir.": "Es gelten die eigenen Bedingungen dieser Plattformen, und Point Croissant ist für deren Richtlinien nicht verantwortlich.",
    "Teknik bakım, güncelleme veya mücbir sebepler nedeniyle hizmette geçici kesinti yaşanabilir.": "Vorübergehende Unterbrechungen können durch technische Wartung, Updates oder höhere Gewalt entstehen.",
    "Bu tür durumlarda doğabilecek dolaylı zararlardan Point Croissant sorumlu tutulamaz.": "Point Croissant haftet nicht für indirekte Schäden, die in solchen Fällen entstehen können.",
    "Bu politika, web sitemizde kullanılan çerez türlerini ve bu çerezlerin hangi amaçlarla işlendiğini açıklamak için hazırlanmıştır.": "Diese Richtlinie erläutert die auf unserer Website verwendeten Cookie-Arten und die Zwecke, zu denen sie verarbeitet werden.",
    "Çerezler, ziyaret ettiğiniz web sitesinin tarayıcınıza kaydettiği küçük metin dosyalarıdır. Bu dosyalar, site deneyimini iyileştirmek için kullanılır.": "Cookies sind kleine Textdateien, die die besuchte Website in Ihrem Browser speichert. Diese Dateien dienen der Verbesserung der Nutzungserfahrung.",
    "Zorunlu Çerezler:": "Essenzielle Cookies:",
    "Sayfanın temel işlevlerinin çalışması için gereklidir.": "Erforderlich, damit die Kernfunktionen der Seite funktionieren.",
    "Performans Çerezleri:": "Performance-Cookies:",
    "Site kullanımını analiz ederek geliştirme yapılmasına destek olur.": "Unterstützen Verbesserungen durch die Analyse der Seitennutzung.",
    "Tercih Çerezleri:": "Präferenz-Cookies:",
    "Kullanıcı ayarlarını hatırlayarak kişiselleştirilmiş deneyim sunar.": "Bieten ein personalisiertes Erlebnis, indem Benutzereinstellungen gespeichert werden.",
    "Çerezleri tarayıcı ayarlarınızdan silebilir, engelleyebilir veya kısıtlayabilirsiniz.": "Sie können Cookies in Ihren Browsereinstellungen löschen, blockieren oder einschränken.",
    "Ancak bazı çerezleri devre dışı bırakmanız, sitenin bazı işlevlerinde kısıtlama yaratabilir.": "Das Deaktivieren einiger Cookies kann jedoch bestimmte Funktionen der Website einschränken.",
    "Çerez politikamız zaman zaman güncellenebilir. Güncel metin bu sayfa üzerinden yayımlanır.": "Unsere Cookie-Richtlinie kann von Zeit zu Zeit aktualisiert werden. Der aktuelle Text wird auf dieser Seite veröffentlicht.",
    "Point Croissant Admin Panel": "Point Croissant Admin-Panel",
    "Yetkili Girişi": "Autorisierte Anmeldung",
    "Admin Panel Kilitli": "Admin-Panel gesperrt",
    "Sadece yetkili kullanıcı şifresi ile erişim sağlanır.": "Der Zugang erfolgt nur mit dem Passwort einer autorisierten Person.",
    "Şifre": "Passwort",
    "Giriş Yap": "Anmelden",
    "Yönetim": "Verwaltung",
    "Yönetim Menüsü": "Verwaltungsmenü",
    "Ürün Yönetimi": "Produktverwaltung",
    "İletişim Ayarları": "Kontakteinstellungen",
    "İçerik Düzenleme": "Inhaltsbearbeitung",
    "Ürün Listesi": "Produktliste",
    "Yönetim Özeti": "Verwaltungsübersicht",
    "Toplam Ürün": "Produkte insgesamt",
    "Ortalama Fiyat": "Durchschnittspreis",
    "En Yüksek Fiyat": "Höchster Preis",
    "Çeviri Eksiği (EN/RU)": "Fehlende Übersetzung (EN/RU)",
    "Önce ürün/ayar bilgilerini kaydet, sonra içerik düzenleyiciden ilgili sayfayı aç.": "Speichern Sie zuerst Produkt- und Einstellungsdaten und öffnen Sie anschließend die betreffende Seite im Inhaltseditor.",
    "Kayıtlı içerik özeti": "Zusammenfassung der gespeicherten Inhalte",
    "Toplam ürün:": "Produkte insgesamt:",
    "Ürün önizleme": "Produktvorschau",
    "Kayıt bulunamadı.": "Keine Einträge gefunden.",
    "Sayfa": "Seite",
    "Kayıt": "Eintrag",
    "Ürün ara (ad/açıklama/etiket)": "Produkt suchen (Name/Beschreibung/Tag)",
    "TR alanı": "TR-Feld",
    "EN alanı": "EN-Feld",
    "RU alanı": "RU-Feld",
    "Yeni eklenen (son)": "Neueste zuerst",
    "Fiyat (yüksekten düşüğe)": "Preis (absteigend)",
    "Fiyat (düşükten yükseğe)": "Preis (aufsteigend)",
    "Ürün adı (A-Z)": "Produktname (A-Z)",
    "Filtreleri Sıfırla": "Filter zurücksetzen",
    "Ürünleri JSON Dışa Aktar": "Produkte als JSON exportieren",
    "JSON İçeri Aktar": "JSON importieren",
    "Görsel": "Bild",
    "Çoğalt": "Duplizieren",
    "Ürün ve Fiyat Yönetimi": "Produkt- und Preisverwaltung",
    "Buradan girdiğin ürünler ana sayfa ve menü sayfasına otomatik yansır.": "Hier eingegebene Produkte erscheinen automatisch auf der Startseite und der Menüseite.",
    "Ürün Ekle / Güncelle": "Produkt hinzufügen / aktualisieren",
    "Ürün Adı": "Produktname",
    "Ürün Adı (TR)": "Produktname (TR)",
    "Ürün Adı (EN)": "Produktname (EN)",
    "Ürün Adı (RU)": "Produktname (RU)",
    "Açıklama": "Beschreibung",
    "Açıklama (TR)": "Beschreibung (TR)",
    "Açıklama (EN)": "Beschreibung (EN)",
    "Açıklama (RU)": "Beschreibung (RU)",
    "Ürün Görsel URL": "Produktbild-URL",
    "Ürün Görsel URL (TR)": "Produktbild-URL (TR)",
    "Ürün Görsel URL (EN)": "Produktbild-URL (EN)",
    "Ürün Görsel URL (RU)": "Produktbild-URL (RU)",
    "assets/logo-point-croissant.webp veya https://...": "assets/logo-point-croissant.webp oder https://...",
    "Fiyat (TL)": "Preis (TL)",
    "Etiket": "Tag",
    "Etiket (TR)": "Tag (TR)",
    "Etiket (EN)": "Tag (EN)",
    "Etiket (RU)": "Tag (RU)",
    "Boşsa TR kullanılır": "Wenn leer, wird TR verwendet",
    "Kaydet": "Speichern",
    "Temizle": "Leeren",
    "Varsayılana Dön": "Auf Standard zurücksetzen",
    "İletişim ve Konum Ayarları": "Kontakt- und Standorteinstellungen",
    "Telefon (gösterim)": "Telefon (Anzeige)",
    "Telefon (tel format)": "Telefon (tel-Format)",
    "WhatsApp (gösterim)": "WhatsApp (Anzeige)",
    "WhatsApp (numara, ülke kodlu)": "WhatsApp (Nummer, mit Ländervorwahl)",
    "E-Posta": "E-mail",
    "Adres": "Adresse",
    "Adres (TR)": "Adresse (TR)",
    "Adres (EN)": "Adresse (EN)",
    "Adres (RU)": "Adresse (RU)",
    "Harita Konum Metni": "Kartenstandorttext",
    "Harita Konum Metni (TR)": "Kartenstandorttext (TR)",
    "Harita Konum Metni (EN)": "Kartenstandorttext (EN)",
    "Harita Konum Metni (RU)": "Kartenstandorttext (RU)",
    "Ayarları Kaydet": "Einstellungen speichern",
    "Varsayılan Ayarlar": "Standardeinstellungen",
    "Canlı İçerik Düzenleyici (Tüm Sayfalar)": "Live-Inhaltseditor (alle Seiten)",
    "İstediğin sayfayı seçip düzenleme modunu aç. Açılan sayfada": "Wählen Sie die gewünschte Seite und öffnen Sie den Bearbeitungsmodus. Auf der geöffneten Seite",
    "Shift + Tıkla": "Shift + Click",
    "ile metin, link ve görselleri anında düzenle.": "können Sie Texte, Links und Bilder sofort bearbeiten.",
    "Düzenlenecek Sayfa": "Zu bearbeitende Seite",
    "Gizlilik": "Datenschutz",
    "Düzenleme Modunu Aç": "Bearbeitungsmodus öffnen",
    "Düzenleme Modunu Kapat": "Bearbeitungsmodus schließen",
    "Tüm Düzenlemeleri Sıfırla": "Alle Bearbeitungen zurücksetzen",
    "Mevcut Ürünler": "Aktuelle Produkte",
    "Ürün": "Produkt",
    "Fiyat": "Preis",
    "İşlem": "Aktion",
    "Belçika çikolatası dolgusu ve kakao glaze ile yoğun lezzet.": "Intensiver Geschmack mit belgischer Schokoladenfüllung und Kakaoglasur.",
    "En Çok Satan": "Bestseller",
    "En Cok Satan": "Bestseller",
    "Fıstık Supreme": "Pistachio Supreme",
    "Antep fıstık kreması, çıtır fıstık parçası ve tereyağlı hamur.": "Pistaziencreme, knusprige Pistaziestücke und butteriger Teig.",
    "Şef Önerisi": "Empfehlung des Küchenchefs",
    "Yaban Mersinli Danish": "Blueberry Danish",
    "İpeksi krema ve meyve dolgusu ile ferah, dengeli tat.": "Ein frischer, ausgewogener Geschmack mit seidiger Creme und Fruchtfüllung.",
    "Yeni": "Neu",
    "Trüf Mantarlı Tuzlu": "Herzhaft Trüffel-Champignon",
    "Trüf mantarlı tuzlu kruvasan.": "Herzhaftes Croissant mit Trüffelpilz.",
    "Öne Çıkan": "Empfohlen",
    "Düzenle": "Bearbeiten",
    "Sil": "Löschen",
    "Lütfen ürün adı, açıklama ve fiyatı doldur.": "Bitte füllen Sie Produktname, Beschreibung und Preis aus.",
    "Ürün güncellendi. Ön yüzde anında yansır.": "Produkt aktualisiert. Es erscheint sofort auf der Vorderseite.",
    "Ürün eklendi. Ön yüzde anında yansır.": "Produkt hinzugefügt. Es erscheint sofort auf der Vorderseite.",
    "Ürün düzenleme için forma getirildi.": "Produkt wurde zum Bearbeiten in das Formular geladen.",
    "Ürün silindi.": "Produkt gelöscht.",
    "Form temizlendi.": "Formular geleert.",
    "Varsayılan ürünler geri yüklendi.": "Standardprodukte wiederhergestellt.",
    "Lütfen tüm iletişim alanlarını doldur.": "Bitte füllen Sie alle Kontaktfelder aus.",
    "İletişim ve konum ayarları kaydedildi.": "Kontakt- und Standorteinstellungen gespeichert.",
    "Ayarlar varsayılana alındı.": "Einstellungen auf Standard zurückgesetzt.",
    "Şifre gerekli.": "Passwort ist erforderlich.",
    "Şifre hatalı.": "Falsches Passwort.",
    "Bu ürünü silmek istediğine emin misin?": "Möchten Sie dieses Produkt wirklich löschen?",
    "Varsayılan ürünleri geri yüklemek istediğine emin misin?": "Möchten Sie die Standardprodukte wirklich wiederherstellen?",
    "Tüm sayfalardaki içerik düzenlemeleri sıfırlanacak. Devam etmek istiyor musun?": "Alle Inhaltsbearbeitungen auf allen Seiten werden zurückgesetzt. Möchten Sie fortfahren?",
    "Listelenen:": "Angezeigt:",
    "Ürün kopyalandı.": "Produkt dupliziert.",
    "Ürünler JSON olarak dışa aktarıldı.": "Produkte als JSON exportiert.",
    "JSON içeriği geçersiz.": "Ungültiger JSON-Inhalt.",
    "JSON içe aktarıldı.": "JSON importiert.",
    "JSON dosyası okunamadı.": "JSON-Datei konnte nicht gelesen werden.",
    "Düzenleme modu açıldı. Yeni sekmede Shift + Tıkla ile metin/link/görsel düzenleyebilirsin.": "Bearbeitungsmodus geöffnet. Im neuen Tab können Sie Text/Link/Bild mit Shift + Click bearbeiten.",
    "Düzenleme modu kapatıldı.": "Bearbeitungsmodus geschlossen.",
    "Tüm sayfa içerik düzenlemeleri sıfırlandı.": "Alle Inhaltsbearbeitungen der Seiten wurden zurückgesetzt.",
    "Görsel URL": "Bild-URL",
    "Alt metni": "Alt-Text",
    "Link metni": "Linktext",
    "Link adresi": "Link-URL",
    "Metin": "Text",
    "Yeni, Premium...": "Neu, Premium...",
    "Güzeloba Mah. Çağlayangil Cad. No:38 / B, Muratpaşa / Antalya": "Stadtteil Güzeloba, Çağlayangil-Straße Nr. 38 / B, Muratpaşa / Antalya",
    "Merhaba Point Croissant, bilgi almak istiyorum.": "Hallo Point Croissant, ich möchte gerne Informationen erhalten.",
    "Merhaba Point Croissant,\n\nİstek / Dilek / Öneri Formu:\nAd Soyad: ${data.name}\nE-Posta: ${data.email}\nTelefon: ${data.phone}\nMesaj: ${data.message}": "Hallo Point Croissant,\n\nAnfrage- / Vorschlagsformular:\nVor- und Nachname: ${data.name}\nE-mail: ${data.email}\nTelefon: ${data.phone}\nNachricht: ${data.message}",
    "Point Croissant Antalya resmi web sitesi. Güzeloba, Muratpaşa’da cafe ve bakery: imza kruvasanlar, menü, rezervasyon ve iletişim.": "Offizielle Website von Point Croissant Antalya. Café und Bäckerei in Güzeloba, Muratpasa: Signatur-Croissants, Menü, Reservierungen und Kontakt.",
    "Point Croissant Antalya lezzetleri: imza kruvasanlar, öne çıkan ürünler ve sipariş için iletişim bilgileri.": "Point Croissant Antalya Sorten: Signatur-Croissants, empfohlene Produkte und Kontaktdaten zum Bestellen.",
    "Point Croissant Antalya menü: güncel fiyatlar, kategorili kruvasan ve cafe ürünleri.": "Point Croissant Antalya Menü: aktuelle Preise, kategorisierte Croissants und Café-Artikel.",
    "Point Croissant hikayesi, üretim anlayışı ve marka yolculuğu.": "Die Geschichte von Point Croissant, die Produktionsphilosophie und die Markenreise.",
    "Kruvasan, kahve ve servis önerileri için Point Croissant blog içerikleri.": "Point Croissant Blog-Inhalte mit Tipps zu Croissant, Kaffee und Service.",
    "İmza kruvasan hazırlama rehberi, püf noktaları ve üretim önerileri.": "Zubereitungsratgeber für Signatur-Croissants, Tipps und Produktionsempfehlungen.",
    "Kahve ve kruvasan eşleşmesi için pratik öneriler ve lezzet uyumları.": "Praktische Tipps und Geschmackskombinationen für Kaffee und Croissants.",
    "Point Croissant etkinlikleri ve özel gün organizasyon bilgileri.": "Informationen zu Point Croissant Veranstaltungen und Organisation besonderer Anlässe.",
    "Kurumsal iş birliği, marka bilgisi ve Point Croissant hakkında detaylar.": "Unternehmenskooperation, Markeninformationen und Details zu Point Croissant.",
    "Sıkça sorulan sorular: rezervasyon, teslimat, toplu sipariş ve daha fazlası.": "Häufig gestellte Fragen: Reservierungen, Lieferung, Sammelbestellungen und mehr.",
    "Point Croissant masa rezervasyonu için WhatsApp ve telefonla hızlı iletişim.": "Schneller Kontakt per WhatsApp und Telefon für Tischreservierungen bei Point Croissant.",
    "Antalya içi teslimat saatleri, sipariş detayları ve iletişim seçenekleri.": "Lieferzeiten in Antalya, Bestelldetails und Kontaktmöglichkeiten.",
    "Toptan ve kurumsal tedarik çözümleri için teklif ve iletişim bilgileri.": "Angebot und Kontaktinformationen für Großhandel und Unternehmensversorgung.",
    "Point Croissant Gizlilik Politikası metni ve kişisel veri işleme esasları.": "Text der Datenschutzerklärung von Point Croissant und Grundsätze der Verarbeitung personenbezogener Daten.",
    "Point Croissant Kullanım Şartları ve site kullanımına ilişkin kurallar.": "Nutzungsbedingungen von Point Croissant und Regeln zur Nutzung der Website.",
    "Point Croissant Çerez Politikası ve çerez tercihleri hakkında bilgiler.": "Cookie-Richtlinie von Point Croissant und Informationen zu Cookie-Einstellungen.",
    "Web sitesi ve yazılım: SoftenWise": "Website & Software: SoftenWise",
    "SoftenWise — yazılım ve web geliştirme": "SoftenWise — Software- und Webentwicklung",
    "Çeviri Eksiği (EN/RU/AR/DE)": "Fehlende Übersetzung (EN/RU/AR/DE)",
    "AR alanı": "AR-Feld",
    "DE alanı": "DE-Feld",
    "Ürün Adı (AR)": "Produktname (AR)",
    "Ürün Adı (DE)": "Produktname (DE)",
    "Açıklama (AR)": "Beschreibung (AR)",
    "Açıklama (DE)": "Beschreibung (DE)",
    "Etiket (AR)": "Tag (AR)",
    "Etiket (DE)": "Tag (DE)",
    "Ürün Görsel URL (AR)": "Produktbild-URL (AR)",
    "Ürün Görsel URL (DE)": "Produktbild-URL (DE)",
    "Adres (AR)": "Adresse (AR)",
    "Adres (DE)": "Adresse (DE)",
    "Harita Konum Metni (AR)": "Kartenstandorttext (AR)",
    "Harita Konum Metni (DE)": "Kartenstandorttext (DE)",
    "Blog Yazıları": "Blogbeiträge",
    "Facebook URL": "Facebook-URL",
    "Google çalışma saati (şema)": "Google-Öffnungszeiten (Schema)",
    "Instagram URL": "Instagram-URL",
    "Kategori": "Kategorie",
    "Marka ve Sayaçlar": "Marke und Zähler",
    "Menü Kategorileri": "Menükategorien",
    "Menü Yapısı": "Menüstruktur",
    "SEO ve Google": "SEO und Google",
    "Tuzlu": "Herzhaft",
    "WhatsApp hazır mesaj (EN)": "WhatsApp-Begrüßung (EN)",
    "WhatsApp hazır mesaj (RU)": "WhatsApp-Begrüßung (RU)",
    "WhatsApp hazır mesaj (TR)": "WhatsApp-Begrüßung (TR)",
    "WhatsApp hazır mesaj (AR)": "WhatsApp-Begrüßung (AR)",
    "WhatsApp hazır mesaj (DE)": "WhatsApp-Begrüßung (DE)",
    "Çalışma Saatleri": "Öffnungszeiten",
    "Çalışma Saatleri:": "Öffnungszeiten:",
    "İmza / özel seçkiye ekle": "Zur Signatur- / Spezialauswahl hinzufügen"
  },
  ar: {
    "Anasayfa": "الرئيسية",
    "Hikayemiz": "قصتنا",
    "Lezzetler": "النكهات",
    "Galeri": "المعرض",
    "Tarifler": "الوصفات",
    "İletişim": "تواصل معنا",
    "Sipariş Ver": "اطلب الآن",
    "Keşfet": "استكشف",
    "Menü": "القائمة",
    "Etkinlikler": "الفعاليات",
    "Hizmetler": "الخدمات",
    "Rezervasyon": "الحجز",
    "Teslimat": "التوصيل",
    "Toptan": "الجملة",
    "SSS": "FAQ",
    "Yasal": "قانوني",
    "Gizlilik Politikası": "سياسة الخصوصية",
    "Kullanım Şartları": "شروط الاستخدام",
    "Çerez Politikası": "سياسة ملفات تعريف الارتباط",
    "Günün en keyifli molası için taptaze kruvasanlar ve özenli kahve.": "كرواسان طازج وقهوة محضّرة بعناية لأفضل استراحة في يومك.",
    "Antalya, Türkiye": "Antalya، تركيا",
    "Menüyü aç/kapat": "فتح/إغلاق القائمة",
    "Dil seçimi": "اختيار اللغة",
    "Güne Lezzetli Bir Başlangıç": "بداية لذيذة ليومك",
    "Çıtır katmanlar, özel reçeteler ve özenle hazırlanan sunumlar. Her lokmada kaliteyi hissedin.": "طبقات مقرمشة، وصفات مميزة، وتقديم مُعدّ بعناية. اشعر بالجودة في كل لقمة.",
    "Antalya · Cafe & Bakery": "Antalya · مقهى ومخبز",
    "Keşfetmeye devam et": "واصل الاستكشاف",
    "Katman katman, her sabah taze": "طبقة تلو طبقة، طازج كل صباح",
    "Tereyağlı": "زبدي",
    "Çikolatalı": "شوكولاتة",
    "Fıstıklı": "فستق",
    "Brunch": "Brunch",
    "Espresso": "Espresso",
    "Taze üretim her sabah": "يُحضَّر طازجاً كل صباح",
    "Kat kat çıtır hamur": "عجينة مقرمشة متعددة الطبقات",
    "Özenle çekilmiş kahve": "قهوة محضّرة بعناية",
    "Lara’da imza kruvasan deneyimi": "تجربة الكرواسان المميز في Lara",
    "Lezzetleri Keşfet": "استكشف النكهات",
    "Bize Ulaş": "تواصل معنا",
    "Yıllık Ustalık": "سنوات من الحرفة",
    "Özel Tarif": "الوصفة المميزة",
    "Günlük Servis": "خدمة يومية",
    "Lezzet Sayfası": "صفحة النكهات",
    "İmza kruvasanlarımız": "كرواساننا المميز",
    "Tüm ürünleri tek sayfada inceleyebilirsiniz.": "تصفّح جميع المنتجات في صفحة واحدة.",
    "Lezzet Sayfasına Git": "انتقل إلى صفحة النكهات",
    "Lezzet Galerisi": "معرض النكهات",
    "Katman detayı": "تفاصيل الطبقات",
    "Kahve eşleşmesi": "تناسق القهوة",
    "Tümü": "الكل",
    "Tatlı": "حلو",
    "Meyveli": "فاكهي",
    "Konum": "الموقع",
    "Telefon": "الهاتف",
    "E-posta": "E-mail",
    "WhatsApp": "WhatsApp",
    "Konuma Git": "احصل على الاتجاهات",
    "WhatsApp ile İletişim": "تواصل عبر WhatsApp",
    "Hemen Ara": "اتصل الآن",
    "Bize Yazın": "راسلنا",
    "İstek / Dilek / Öneri Formu": "نموذج الطلب / الاقتراح",
    "Görüşlerinizi bizimle paylaşın": "شاركنا ملاحظاتك",
    "Ad Soyad": "الاسم الكامل",
    "Mesaj": "الرسالة",
    "Gönder": "إرسال",
    "WhatsApp ile iletişime geç": "تواصل عبر WhatsApp",
    "Öne Çıkanlar": "مميز",
    "İmza Kruvasanlarımız": "كرواساننا المميز",
    "Günün en sevilen ürünleri tek sayfada.": "أكثر منتجات اليوم حباً في صفحة واحدة.",
    "Detay ve sipariş için hemen ulaş": "اطّلع على التفاصيل واطلب الآن",
    "WhatsApp'tan Yaz": "راسلنا على WhatsApp",
    "Bizi Arayın": "اتصل بنا",
    "Masa Rezervasyonu": "حجز طاولة",
    "Rezervasyon için bizi arayabilir veya WhatsApp ile yazabilirsiniz.": "يمكنك الاتصال بنا أو مراسلتنا عبر WhatsApp للحجز.",
    "WhatsApp ile Rezerve Et": "احجز عبر WhatsApp",
    "Antalya İçine Hızlı Teslimat": "توصيل سريع داخل Antalya",
    "Bölgesel teslimat saatleri 09:00 - 22:00 arasındadır.": "ساعات التوصيل في المنطقة بين 09:00 و 22:00.",
    "Toplu siparişlerde bir gün önce ön sipariş önerilir.": "للطلبات بالجملة يُفضَّل الطلب المسبق قبل يوم واحد.",
    "Kurumsal Tedarik Çözümleri": "حلول التوريد للشركات",
    "Oteller, butik cafeler ve restoranlar için özel gramaj ve paketleme seçenekleri.": "خيارات وزن وتعبئة مخصصة للفنادق والمقاهي البوتيكية والمطاعم.",
    "Detaylı teklif almak için talep formunu doldurabilirsiniz.": "يمكنك تعبئة نموذج الطلب للحصول على عرض سعر مفصّل.",
    "Point Croissant’in Yolculuğu": "رحلة Point Croissant",
    "Bir tariften fazlası: özenle inşa edilen bir lezzet kültürü.": "أكثر من وصفة: ثقافة نكهة بُنيت بعناية.",
    "Bir soruyla başlayan yolculuk": "رحلة بدأت بسؤال",
    "Katman, sıcaklık ve sabrın dengesi": "توازن الطبقات والحرارة والصبر",
    "Sadece ürün değil, bütün bir deneyim": "ليس مجرد منتج، بل تجربة كاملة",
    "Her gün aynı kalite, her sabah taze üretim": "الجودة ذاتها كل يوم، وإنتاج طازج كل صباح",
    "Blog & Rehber": "Blog والأدلة",
    "Kruvasan, kahve ve servis önerileri": "نصائح عن الكرواسان والقهوة والخدمة",
    "İmza kruvasan": "الكرواسان المميز",
    "İmza Kruvasan Nasıl Yapılır?": "كيف يُحضَّر الكرواسان المميز؟",
    "Kat kat dokusunu koruyan, hacimli ve dengeli hamur tekniğinin püf noktaları.": "تقنيات أساسية لقوام متعدد الطبقات وعجينة متوازنة.",
    "Devamını Oku": "اقرأ المزيد",
    "Kahve eşleşmesi": "توافق القهوة",
    "Kahve ile Kruvasan Eşleşmesi": "توافق القهوة والكرواسان",
    "Damak zevkine uygun en doğru kahve ve kruvasan uyumunu keşfedin.": "اكتشف التوافق المناسب بين القهوة والكرواسان لذوقك.",
    "Sıkça Sorulan Sorular": "الأسئلة الشائعة",
    "Kahve ve Kruvasan Eşleşmesi": "توافق القهوة والكرواسان",
    "İmza Kruvasan Rehberi": "دليل الكرواسان المميز",
    "Blog listesine dön": "العودة إلى قائمة Blog",
    "Düzenleme modu açık - Shift + Tıkla düzenle": "وضع التحرير مفعّل - Shift + Click للتحرير",
    "Kapat": "إغلاق",
    "Bu sayfayı sıfırla": "إعادة تعيين هذه الصفحة",
    "İçeriğe geç": "انتقل إلى المحتوى",
    "Blog": "Blog",
    "Blog: İmza Kruvasan": "Blog: الكرواسان المميز",
    "Blog: Kahve Eşleşmesi": "Blog: توافق القهوة",
    "İletişim & Konum Bilgileri": "معلومات التواصل والموقع",
    "Telefon ile ara": "اتصل هاتفياً",
    "WhatsApp'tan yazabilir veya direkt arayabilirsin.": "يمكنك المراسلة عبر WhatsApp أو الاتصال مباشرة.",
    "Tarif": "وصفة",
    "Rehber": "دليل",
    "Etkinlik": "فعالية",
    "Atölye ve Özel Davetler": "ورش العمل والفعاليات الخاصة",
    "Kruvasan Atölyesi": "ورشة الكرواسان",
    "Atolye ve Ozel Davetler": "ورش العمل والفعاليات الخاصة",
    "Kruvasan Atolyesi": "ورشة الكرواسان",
    "Kurumsal": "الشركات",
    "Point Croissant Hakkında": "عن Point Croissant",
    "Taze Üretim Kruvasanlar": "كرواسان محضَّر طازجاً",
    "İmza lezzetlerimizi kategorili, modern ve şık bir menü düzeninde keşfedin.": "اكتشف نكهاتنا المميزة في قائمة مصنّفة بتصميم حديث وأنيق.",
    "Lezzet Haritası": "خريطة النكهات",
    "Point Croissant Menü Seçkisi": "مختارات قائمة Point Croissant",
    "Ürünler içerik yapısına göre kategorilendirilir ve admin panelindeki güncel fiyatlarla otomatik listelenir.": "تُصنَّف المنتجات حسب محتواها وتُعرض تلقائياً بالأسعار الحالية من لوحة الإدارة.",
    "Taze üretim": "محضَّر طازجاً",
    "Güncel fiyat": "السعر الحالي",
    "Kategorili görünüm": "عرض مصنّف",
    "Detay Al": "اطلب التفاصيل",
    "Özel Lezzet": "نكهة خاصة",
    "Seçki": "مختارات",
    "Tatlı Kruvasanlar": "كرواسان حلو",
    "Meyveli, çikolatalı ve özel dolgulu tatlı seçenekler.": "خيارات حلوة بالفاكهة والشوكولاتة والحشوات الخاصة.",
    "Tuzlu Kruvasanlar": "كرواسان مالح",
    "Dengeli tuzlu tarifler ve brunch için ideal seçenekler.": "وصفات مالحة متوازنة وخيارات مثالية لـ Brunch.",
    "İmza ve Özel Seçkiler": "المختارات المميزة والخاصة",
    "Şef önerileri, premium tarifler ve vitrinin yıldızları.": "توصيات الشيف، ووصفات فاخرة، ونجوم الواجهة.",
    "Rezervasyon gerekli mi?": "هل الحجز مطلوب؟",
    "Rezervasyon nasıl yapabilirim?": "كيف يمكنني إجراء حجز؟",
    "Toplu sipariş alıyor musunuz?": "هل تقبلون الطلبات بالجملة؟",
    "Toplu sipariş için ne kadar önce iletişime geçmeliyim?": "متى ينبغي التواصل معكم للطلبات بالجملة؟",
    "Teslimat hizmetiniz var mı?": "هل تقدّمون خدمة التوصيل؟",
    "Ödeme seçenekleri nelerdir?": "ما خيارات الدفع المتاحة؟",
    "Glutensiz seçenek var mı?": "هل تتوفر خيارات خالية من الغلوتين؟",
    "Alerjen bilgisi alabilir miyim?": "هل يمكنني الحصول على معلومات مسببات الحساسية؟",
    "Menü ve fiyatlar güncel mi?": "هل القائمة والأسعار محدَّثة؟",
    "1. Toplanan Bilgiler": "1. المعلومات التي تُجمع",
    "2. Verilerin Kullanım Amaçları": "2. أغراض استخدام البيانات",
    "3. Veri Paylaşımı ve Güvenlik": "3. مشاركة البيانات والأمان",
    "4. Haklarınız ve İletişim": "4. حقوقكم والتواصل",
    "1. Genel Kullanım": "1. الاستخدام العام",
    "2. Fiyat ve Ürün Bilgileri": "2. معلومات الأسعار والمنتجات",
    "3. Bağlantılar ve Üçüncü Taraf Hizmetler": "3. الروابط وخدمات الأطراف الثالثة",
    "4. Sorumluluk Sınırı": "4. تحديد المسؤولية",
    "1. Çerez Nedir?": "1. ما هو ملف تعريف الارتباط؟",
    "2. Hangi Çerezleri Kullanıyoruz?": "2. أي ملفات تعريف ارتباط نستخدم؟",
    "3. Çerez Tercihleri Nasıl Yönetilir?": "3. كيف تُدار تفضيلات ملفات تعريف الارتباط؟",
    "4. Politika Güncellemeleri": "4. تحديثات السياسة",
    "Lütfen tüm alanları doldur.": "يرجى تعبئة جميع الحقول.",
    "Mesajın WhatsApp üzerinden hazırlandı ve açıldı.": "تم إعداد رسالتك وفتحها في WhatsApp.",
    "Link kopyalandı.": "تم نسخ الرابط.",
    "Link kopyalanamadı.": "تعذّر نسخ الرابط.",
    "Bu cihazda paylaşım özelliği yok.": "المشاركة غير متاحة على هذا الجهاز.",
    "Paylaşım başarılı.": "تمت المشاركة بنجاح.",
    "Paylaşım iptal edildi.": "تم إلغاء المشاركة.",
    "Point Croissant Antalya | Cafe, Bakery & İmza Kruvasan": "Point Croissant Antalya | مقهى ومخبز وكرواسان مميز",
    "Blog | Point Croissant": "Blog | Point Croissant",
    "Hikayemiz | Point Croissant": "قصتنا | Point Croissant",
    "Lezzetler | Point Croissant": "النكهات | Point Croissant",
    "Menü | Point Croissant": "القائمة | Point Croissant",
    "Rezervasyon | Point Croissant": "الحجز | Point Croissant",
    "Teslimat | Point Croissant": "التوصيل | Point Croissant",
    "Toptan | Point Croissant": "الجملة | Point Croissant",
    "SSS | Point Croissant": "FAQ | Point Croissant",
    "Kurumsal | Point Croissant": "الشركات | Point Croissant",
    "Etkinlikler | Point Croissant": "الفعاليات | Point Croissant",
    "İmza Kruvasan Rehberi | Point Croissant": "دليل الكرواسان المميز | Point Croissant",
    "Kahve Eşleşmesi | Point Croissant": "توافق القهوة | Point Croissant",
    "Gizlilik Politikası | Point Croissant": "سياسة الخصوصية | Point Croissant",
    "Kullanım Şartları | Point Croissant": "شروط الاستخدام | Point Croissant",
    "Çerez Politikası | Point Croissant": "سياسة ملفات تعريف الارتباط | Point Croissant",
    "Her cumartesi 11:00 - 13:00.": "كل يوم سبت من 11:00 إلى 13:00.",
    "Ayda iki kez profesyonel eğitim.": "تدريب احترافي مرتين في الشهر.",
    "10-30 kişilik kurumsal organizasyon.": "تنظيم شركات لـ 10-30 شخصاً.",
    "Ayda iki kez profesyonel egitim.": "تدريب احترافي مرتين في الشهر.",
    "10-30 kisilik kurumsal organizasyon.": "تنظيم شركات لـ 10-30 شخصاً.",
    "“Antalya’da neden hem çıtır hem dengeli kruvasan yok?” sorusu bizim başlangıcımız oldu.": "«لماذا لا يوجد في Antalya كرواسان يجمع بين القرمشة والتوازن؟» كان هذا السؤال بدايتنا.",
    "O gün mutfağa girip aylarca denemeler yapacağımızı henüz bilmiyorduk.": "في ذلك اليوم لم نكن نعلم بعد أننا سندخل المطبخ ونجرّب لأشهر.",
    "İlham aldığımız ilk atmosfer ve servis anlayışı.": "أول أجواء وأسلوب خدمة ألهمانا.",
    "Hamuru bazen fazla yorduk, bazen yeterince dinlendiremedik. Tereyağı seçimi, katlama aralıkları ve fırın dereceleri defalarca değişti. Her denemeyi not alarak reçetemizi adım adım geliştirdik.": "أحياناً أرهقنا العجينة، وأحياناً لم نُرحها بما يكفي. تغيّر اختيار الزبدة وفترات الطي ودرجات حرارة الفرن مرات كثيرة. وبتدوين كل تجربة حسّنّا وصفتنا خطوة بخطوة.",
    "“Premium olmak, pahalı görünmek değil; her gün aynı özeni gösterebilmektir.”": "«أن تكون مميزاً لا يعني أن تبدو باهظ الثمن؛ بل أن تُظهر القدر نفسه من العناية كل يوم.»",
    "Deneyimi tamamlayan servis akışı ve alan tasarımı.": "تدفق الخدمة وتصميم المكان اللذان يكتمل بهما التجربة.",
    "Kahve eşleşmeleri, servis hızı, tezgâh düzeni ve ambalaj hissi bir araya geldiğinde Point Croissant, tekrar gelmek isteyeceğiniz bir deneyime dönüştü.": "عندما اجتمعت توافقات القهوة وسرعة الخدمة وترتيب المنصة وإحساس التغليف، أصبح Point Croissant تجربة يرغب المرء في العودة إليها.",
    "Aynı disiplinle üretmeye devam ediyoruz. Her yeni tarif ve her geri bildirimle hikayemizi daha ileri taşıyoruz.": "نواصل الإنتاج بالانضباط نفسه. مع كل وصفة جديدة وكل ملاحظة ندفع قصتنا إلى الأمام.",
    "Point Croissant logosu": "شعار Point Croissant",
    "İmza kruvasanın temelinde üç şey vardır: doğru hamur yapısı, kontrollü katlama ve sabırlı mayalama. Dışının çıtır, içinin hafif ve katmanlı olması için sürecin her adımı dikkat ister.": "في جوهر الكرواسان المميز ثلاثة أمور: بنية عجينة سليمة، وطيّ منضبط، وتخمير صبور. كل خطوة تتطلب انتباهاً للحصول على قشرة مقرمشة وداخل خفيف متعدد الطبقات.",
    "Kruvasanın en kritik adımı hamurun soğuk zincirde dinlenmesidir. Hamur ısındığında tereyağı katmanlara doğru şekilde dağılmaz; bu da pişince kabarmayı ve katman netliğini düşürür.": "الخطوة الأهم هي إراحة العجينة ضمن السلسلة الباردة. عندما تدفأ العجينة لا تتوزع الزبدة في الطبقات كما ينبغي، فيقلّ الانتفاخ ووضوح الطبقات بعد الخبز.",
    "Tereyağı katlarını eşit dağıtmak için her katlamadan sonra hamuru ortalama 25-30 dakika buzdolabında dinlendirin. Bu kısa dinlenme, hamurun tekrar toparlanmasını sağlar ve açma sırasında yırtılmayı azaltır.": "لتوزيع طبقات الزبدة بانتظام، أرح العجينة في الثلاجة نحو 25-30 دقيقة بعد كل طيّ. هذه الاستراحة القصيرة تساعد العجينة على التعافي وتقلّل التمزق أثناء الفرد.",
    "Son mayalamada ortam sıcaklığının 24-26 derece aralığında olması önerilir. Çok düşük sıcaklıkta hacim yavaş gelişir, çok yüksek sıcaklıkta ise tereyağı katmanlardan taşarak yapıyı bozabilir.": "في التخمير النهائي يُفضَّل أن تكون حرارة المحيط 24-26C. في الحرارة المنخفضة جداً يتطور الحجم ببطء؛ وفي الحرارة المرتفعة جداً قد تتسرّب الزبدة من الطبقات وتُفسد البنية.",
    "Pişirme aşamasında önceden ısıtılmış fırın kullanın ve ilk dakikalarda kapağı açmamaya özen gösterin. Bu sayede kruvasanlar güçlü bir ilk kabarma alır ve dış yüzeyde dengeli bir renk oluşur.": "أثناء الخبز استخدم فرناً مسخَّناً مسبقاً وتجنّب فتح الباب في الدقائق الأولى. يمنح ذلك الكرواسان انتفاخاً أولياً قوياً ولوناً خارجياً متساوياً.",
    "Servis öncesi kruvasanları kısa bir süre tel ızgara üzerinde dinlendirmek, alt yüzeydeki nemi azaltır ve çıtırlığı korur. Özellikle dolgu eklenecekse bu adım lezzet kadar doku için de fark yaratır.": "إراحة الكرواسان قليلاً على شبكة سلكية قبل التقديم تقلّل الرطوبة في الوجه السفلي وتحفظ القرمشة. وخصوصاً إذا أُضيفت حشوة، يحسّن هذه الخطوة القوام بقدر ما يحسّن النكهة.",
    "Sade tereyağlı kruvasanla filtre kahve daha dengeli bir tat verir.": "القهوة المقطّرة تمنح مذاقاً أكثر توازناً مع كرواسان الزبدة السادة.",
    "Çikolatalı lezzetlerde orta kavrum espresso bazlı içecekler öne çıkar.": "مع نكهات الشوكولاتة تبرز المشروبات القائمة على Espresso بدرجة تحميص متوسطة.",
    "Meyveli kruvasanlar için soğuk demleme kahveler ferah bir seçimdir.": "للكرواسان الفاكهي تُعدّ قهوة التحضير البارد خياراً منعشاً.",
    "Point Croissant, Antalya'da kruvasan odaklı bir kafe markasıdır.": "Point Croissant علامة مقاهٍ تركز على الكرواسان في Antalya.",
    "Kaliteli ürün ve hızlı servis sunuyoruz.": "نقدّم منتجات عالية الجودة وخدمة سريعة.",
    "Franchise, kurumsal iş birliği ve toplu tedarik görüşmeleri için bizimle iletişime geçebilirsiniz.": "يمكنكم التواصل معنا لمناقشات الامتياز والشراكة المؤسسية والتوريد بالجملة.",
    "Zorunlu değil, ancak hafta sonu ve akşam saatlerinde rezervasyon önerilir.": "ليس إلزامياً، لكن يُفضَّل الحجز في عطلة نهاية الأسبوع وفي ساعات المساء.",
    "Rezervasyon sayfasından WhatsApp veya telefon üzerinden hızlıca rezervasyon oluşturabilirsiniz.": "يمكنكم إجراء حجز سريع عبر WhatsApp أو الهاتف من صفحة الحجز.",
    "Evet. Etkinlik, ofis ve özel günler için toplu sipariş alıyoruz.": "نعم. نقبل الطلبات بالجملة للفعاليات والمكاتب والمناسبات الخاصة.",
    "Yoğun günlerde en az 1 gün, büyük siparişlerde 2-3 gün önce iletişime geçmeniz önerilir.": "في الأيام المزدحمة يُفضَّل التواصل قبل يوم واحد على الأقل؛ وللطلبات الكبيرة يُنصح بـ 2-3 أيام.",
    "Evet. Bölgesel teslimat saatleri içinde adrese teslim hizmet sunuyoruz.": "نعم. نقدّم التوصيل إلى العنوان ضمن ساعات التوصيل في المنطقة.",
    "Nakit ve kart ile ödeme yapabilirsiniz. Online yönlendirmelerde ilgili platformun ödeme seçenekleri geçerlidir.": "يمكن الدفع نقداً أو بالبطاقة. وعند التوجيه عبر الإنترنت تسري خيارات الدفع الخاصة بالمنصة المعنية.",
    "Belirli günlerde sınırlı sayıda glutensiz ürün sunuyoruz.": "في أيام محددة نقدّم عدداً محدوداً من المنتجات الخالية من الغلوتين.",
    "Evet. Ürün içerikleri ve alerjen bilgileri için ekibimizden detaylı bilgi alabilirsiniz.": "نعم. يمكنكم الحصول من فريقنا على معلومات مفصّلة عن مكونات المنتجات ومسببات الحساسية.",
    "Menü sayfası düzenli olarak güncellenir. Güncel ürün ve fiyat bilgisi için menü sayfasını takip edebilirsiniz.": "تُحدَّث صفحة القائمة بانتظام. يمكنكم متابعة صفحة القائمة لمعرفة المنتجات والأسعار الحالية.",
    "Point Croissant olarak kişisel verilerinizi korumayı önceliğimiz kabul ediyoruz. Bu metin, hangi bilgileri neden topladığımızı ve nasıl koruduğumuzu açıklar.": "في Point Croissant نعدّ حماية بياناتكم الشخصية أولوية. يوضح هذا النص المعلومات التي نجمعها وسبب جمعها وكيفية حمايتها.",
    "Sitemiz üzerinden bize ilettiğiniz ad, telefon, e-posta ve mesaj içerikleri gibi iletişim bilgileri işlenebilir.": "قد تُعالَج معلومات التواصل مثل الاسم والهاتف والبريد الإلكتروني ومحتوى الرسالة التي ترسلونها عبر موقعنا.",
    "İletişim formlarında paylaştığınız bilgiler": "المعلومات التي تشاركونها في نماذج التواصل",
    "Rezervasyon veya teklif taleplerinde ilettiğiniz veriler": "البيانات التي تقدّمونها في طلبات الحجز أو عروض الأسعار",
    "Teknik kullanım verileri (tarayıcı tipi, cihaz bilgisi vb.)": "بيانات الاستخدام التقنية (نوع المتصفح، معلومات الجهاز، إلخ)",
    "Toplanan veriler yalnızca hizmet sağlama ve iletişim süreçlerini yürütme amacıyla kullanılır.": "تُستخدم البيانات المجمّعة فقط لتقديم الخدمات وإدارة عمليات التواصل.",
    "Talep ve rezervasyonlara dönüş yapmak": "الرد على الطلبات والحجوزات",
    "Hizmet kalitesini geliştirmek": "تحسين جودة الخدمة",
    "Yasal yükümlülükleri yerine getirmek": "الوفاء بالالتزامات القانونية",
    "Kişisel verileriniz, açık rızanız olmadan üçüncü taraflara satılmaz veya pazarlama amacıyla devredilmez.": "لا تُباع بياناتكم الشخصية ولا تُنقل إلى أطراف ثالثة لأغراض تسويقية دون موافقتكم الصريحة.",
    "Yetkisiz erişimi önlemek için makul teknik ve idari güvenlik önlemleri uygulanır.": "تُطبَّق تدابير أمنية تقنية وإدارية معقولة لمنع الوصول غير المصرّح به.",
    "Verilerinize ilişkin erişim, düzeltme veya silme talepleriniz için bizimle iletişime geçebilirsiniz.": "يمكنكم التواصل معنا لطلبات الاطلاع على بياناتكم أو تصحيحها أو حذفها.",
    "Güncel iletişim bilgileri için ana sayfadaki iletişim bölümünü kullanabilirsiniz.": "يمكنكم استخدام قسم التواصل في الصفحة الرئيسية للحصول على أحدث معلومات الاتصال.",
    "Bu sayfada yer alan şartlar, Point Croissant web sitesinin kullanımına ilişkin temel kuralları ve tarafların sorumluluklarını belirtir.": "تحدد الشروط الواردة في هذه الصفحة القواعد الأساسية لاستخدام موقع Point Croissant ومسؤوليات الأطراف.",
    "Bu siteye erişen her kullanıcı, burada yer alan kullanım şartlarını kabul etmiş sayılır.": "يُعدّ كل مستخدم يدخل هذا الموقع موافقاً على شروط الاستخدام الواردة هنا.",
    "İçerikler bilgilendirme amaçlıdır.": "المحتويات لأغراض إعلامية.",
    "Web sitesindeki görsel ve metinler izinsiz kopyalanamaz.": "لا يجوز نسخ الصور والنصوص على الموقع دون إذن.",
    "Site üzerinden yapılan işlemler dürüst kullanım esasına tabidir.": "تخضع المعاملات عبر الموقع لمبادئ الاستخدام العادل.",
    "Ürün içerikleri, stok durumu ve fiyatlar operasyonel nedenlerle güncellenebilir.": "قد تُحدَّث محتويات المنتجات وحالة المخزون والأسعار لأسباب تشغيلية.",
    "Kesin bilgi için sipariş/rezervasyon sırasında ekibimiz tarafından paylaşılan güncel bilgi esas alınır.": "للمعلومة القطعية يُعتدّ بالمعلومات الحالية التي يشاركها فريقنا أثناء الطلب/الحجز.",
    "Site içinde WhatsApp, harita ve sosyal medya gibi üçüncü taraf bağlantılar bulunabilir.": "قد يحتوي الموقع على روابط لأطراف ثالثة مثل WhatsApp والخريطة ووسائل التواصل الاجتماعي.",
    "Bu platformların kendi kullanım koşulları geçerlidir ve Point Croissant bu platformların politikalarından sorumlu değildir.": "تسري شروط هذه المنصات الخاصة، وPoint Croissant غير مسؤول عن سياساتها.",
    "Teknik bakım, güncelleme veya mücbir sebepler nedeniyle hizmette geçici kesinti yaşanabilir.": "قد تحدث انقطاعات مؤقتة في الخدمة بسبب الصيانة التقنية أو التحديثات أو القوة القاهرة.",
    "Bu tür durumlarda doğabilecek dolaylı zararlardan Point Croissant sorumlu tutulamaz.": "لا يتحمل Point Croissant المسؤولية عن الأضرار غير المباشرة التي قد تنشأ في مثل هذه الحالات.",
    "Bu politika, web sitemizde kullanılan çerez türlerini ve bu çerezlerin hangi amaçlarla işlendiğini açıklamak için hazırlanmıştır.": "أُعدّت هذه السياسة لشرح أنواع ملفات تعريف الارتباط المستخدمة على موقعنا والأغراض التي تُعالَج من أجلها.",
    "Çerezler, ziyaret ettiğiniz web sitesinin tarayıcınıza kaydettiği küçük metin dosyalarıdır. Bu dosyalar, site deneyimini iyileştirmek için kullanılır.": "ملفات تعريف الارتباط ملفات نصية صغيرة يخزّنها الموقع الذي تزورونه في المتصفح. تُستخدم هذه الملفات لتحسين تجربة الموقع.",
    "Zorunlu Çerezler:": "ملفات تعريف الارتباط الأساسية:",
    "Sayfanın temel işlevlerinin çalışması için gereklidir.": "مطلوبة لعمل الوظائف الأساسية للصفحة.",
    "Performans Çerezleri:": "ملفات تعريف الارتباط الخاصة بالأداء:",
    "Site kullanımını analiz ederek geliştirme yapılmasına destek olur.": "تساعد على التحسين عبر تحليل استخدام الموقع.",
    "Tercih Çerezleri:": "ملفات تعريف الارتباط الخاصة بالتفضيلات:",
    "Kullanıcı ayarlarını hatırlayarak kişiselleştirilmiş deneyim sunar.": "توفّر تجربة مخصّصة عبر تذكّر إعدادات المستخدم.",
    "Çerezleri tarayıcı ayarlarınızdan silebilir, engelleyebilir veya kısıtlayabilirsiniz.": "يمكنكم حذف ملفات تعريف الارتباط أو حظرها أو تقييدها من إعدادات المتصفح.",
    "Ancak bazı çerezleri devre dışı bırakmanız, sitenin bazı işlevlerinde kısıtlama yaratabilir.": "غير أن تعطيل بعض ملفات تعريف الارتباط قد يقيّد بعض وظائف الموقع.",
    "Çerez politikamız zaman zaman güncellenebilir. Güncel metin bu sayfa üzerinden yayımlanır.": "قد تُحدَّث سياسة ملفات تعريف الارتباط من حين لآخر. يُنشر النص الحالي على هذه الصفحة.",
    "Point Croissant Admin Panel": "لوحة إدارة Point Croissant",
    "Yetkili Girişi": "دخول مصرّح به",
    "Admin Panel Kilitli": "لوحة الإدارة مقفلة",
    "Sadece yetkili kullanıcı şifresi ile erişim sağlanır.": "يُمنح الوصول فقط بكلمة مرور مستخدم مصرّح به.",
    "Şifre": "كلمة المرور",
    "Giriş Yap": "تسجيل الدخول",
    "Yönetim": "الإدارة",
    "Yönetim Menüsü": "قائمة الإدارة",
    "Ürün Yönetimi": "إدارة المنتجات",
    "İletişim Ayarları": "إعدادات التواصل",
    "İçerik Düzenleme": "تحرير المحتوى",
    "Ürün Listesi": "قائمة المنتجات",
    "Yönetim Özeti": "نظرة عامة على الإدارة",
    "Toplam Ürün": "إجمالي المنتجات",
    "Ortalama Fiyat": "متوسط السعر",
    "En Yüksek Fiyat": "أعلى سعر",
    "Çeviri Eksiği (EN/RU)": "ترجمة ناقصة (EN/RU)",
    "Önce ürün/ayar bilgilerini kaydet, sonra içerik düzenleyiciden ilgili sayfayı aç.": "احفظ أولاً معلومات المنتج/الإعدادات، ثم افتح الصفحة المعنية من محرر المحتوى.",
    "Kayıtlı içerik özeti": "ملخص المحتوى المحفوظ",
    "Toplam ürün:": "إجمالي المنتجات:",
    "Ürün önizleme": "معاينة المنتج",
    "Kayıt bulunamadı.": "لا توجد سجلات.",
    "Sayfa": "الصفحة",
    "Kayıt": "سجل",
    "Ürün ara (ad/açıklama/etiket)": "ابحث عن منتج (الاسم/الوصف/الوسم)",
    "TR alanı": "حقل TR",
    "EN alanı": "حقل EN",
    "RU alanı": "حقل RU",
    "Yeni eklenen (son)": "الأحدث أولاً",
    "Fiyat (yüksekten düşüğe)": "السعر (من الأعلى إلى الأدنى)",
    "Fiyat (düşükten yükseğe)": "السعر (من الأدنى إلى الأعلى)",
    "Ürün adı (A-Z)": "اسم المنتج (A-Z)",
    "Filtreleri Sıfırla": "إعادة تعيين عوامل التصفية",
    "Ürünleri JSON Dışa Aktar": "تصدير المنتجات JSON",
    "JSON İçeri Aktar": "استيراد JSON",
    "Görsel": "صورة",
    "Çoğalt": "تكرار",
    "Ürün ve Fiyat Yönetimi": "إدارة المنتجات والأسعار",
    "Buradan girdiğin ürünler ana sayfa ve menü sayfasına otomatik yansır.": "المنتجات المُدخلة هنا تظهر تلقائياً في الصفحة الرئيسية وصفحة القائمة.",
    "Ürün Ekle / Güncelle": "إضافة / تحديث منتج",
    "Ürün Adı": "اسم المنتج",
    "Ürün Adı (TR)": "اسم المنتج (TR)",
    "Ürün Adı (EN)": "اسم المنتج (EN)",
    "Ürün Adı (RU)": "اسم المنتج (RU)",
    "Açıklama": "الوصف",
    "Açıklama (TR)": "الوصف (TR)",
    "Açıklama (EN)": "الوصف (EN)",
    "Açıklama (RU)": "الوصف (RU)",
    "Ürün Görsel URL": "URL صورة المنتج",
    "Ürün Görsel URL (TR)": "URL صورة المنتج (TR)",
    "Ürün Görsel URL (EN)": "URL صورة المنتج (EN)",
    "Ürün Görsel URL (RU)": "URL صورة المنتج (RU)",
    "assets/logo-point-croissant.webp veya https://...": "assets/logo-point-croissant.webp أو https://...",
    "Fiyat (TL)": "السعر (TL)",
    "Etiket": "الوسم",
    "Etiket (TR)": "الوسم (TR)",
    "Etiket (EN)": "الوسم (EN)",
    "Etiket (RU)": "الوسم (RU)",
    "Boşsa TR kullanılır": "إذا كان فارغاً يُستخدم TR",
    "Kaydet": "حفظ",
    "Temizle": "مسح",
    "Varsayılana Dön": "العودة إلى الافتراضي",
    "İletişim ve Konum Ayarları": "إعدادات التواصل والموقع",
    "Telefon (gösterim)": "الهاتف (العرض)",
    "Telefon (tel format)": "الهاتف (تنسيق tel)",
    "WhatsApp (gösterim)": "WhatsApp (العرض)",
    "WhatsApp (numara, ülke kodlu)": "WhatsApp (الرقم، مع رمز الدولة)",
    "E-Posta": "E-mail",
    "Adres": "العنوان",
    "Adres (TR)": "العنوان (TR)",
    "Adres (EN)": "العنوان (EN)",
    "Adres (RU)": "العنوان (RU)",
    "Harita Konum Metni": "نص موقع الخريطة",
    "Harita Konum Metni (TR)": "نص موقع الخريطة (TR)",
    "Harita Konum Metni (EN)": "نص موقع الخريطة (EN)",
    "Harita Konum Metni (RU)": "نص موقع الخريطة (RU)",
    "Ayarları Kaydet": "حفظ الإعدادات",
    "Varsayılan Ayarlar": "الإعدادات الافتراضية",
    "Canlı İçerik Düzenleyici (Tüm Sayfalar)": "محرر المحتوى المباشر (جميع الصفحات)",
    "İstediğin sayfayı seçip düzenleme modunu aç. Açılan sayfada": "اختر الصفحة المطلوبة وافتح وضع التحرير. في الصفحة المفتوحة",
    "Shift + Tıkla": "Shift + Click",
    "ile metin, link ve görselleri anında düzenle.": "لتحرير النصوص والروابط والصور فوراً.",
    "Düzenlenecek Sayfa": "الصفحة المراد تحريرها",
    "Gizlilik": "الخصوصية",
    "Düzenleme Modunu Aç": "فتح وضع التحرير",
    "Düzenleme Modunu Kapat": "إغلاق وضع التحرير",
    "Tüm Düzenlemeleri Sıfırla": "إعادة تعيين كل التعديلات",
    "Mevcut Ürünler": "المنتجات الحالية",
    "Ürün": "المنتج",
    "Fiyat": "السعر",
    "İşlem": "الإجراء",
    "Belçika çikolatası dolgusu ve kakao glaze ile yoğun lezzet.": "نكهة كثيفة بحشوة الشوكولاتة البلجيكية وتغطية الكاكاو.",
    "En Çok Satan": "الأكثر مبيعاً",
    "En Cok Satan": "الأكثر مبيعاً",
    "Fıstık Supreme": "Pistachio Supreme",
    "Antep fıstık kreması, çıtır fıstık parçası ve tereyağlı hamur.": "كريمة فستق، قطع فستق مقرمشة، وعجينة زبدية.",
    "Şef Önerisi": "توصية الشيف",
    "Yaban Mersinli Danish": "Blueberry Danish",
    "İpeksi krema ve meyve dolgusu ile ferah, dengeli tat.": "مذاق منعش ومتوازن مع كريمة حريرية وحشوة فاكهة.",
    "Yeni": "جديد",
    "Trüf Mantarlı Tuzlu": "مالح بفطر الكمأة",
    "Trüf mantarlı tuzlu kruvasan.": "كرواسان مالح بفطر الكمأة.",
    "Öne Çıkan": "مميز",
    "Düzenle": "تحرير",
    "Sil": "حذف",
    "Lütfen ürün adı, açıklama ve fiyatı doldur.": "يرجى تعبئة اسم المنتج والوصف والسعر.",
    "Ürün güncellendi. Ön yüzde anında yansır.": "تم تحديث المنتج. يظهر فوراً في الواجهة.",
    "Ürün eklendi. Ön yüzde anında yansır.": "تمت إضافة المنتج. يظهر فوراً في الواجهة.",
    "Ürün düzenleme için forma getirildi.": "تم تحميل المنتج في النموذج للتحرير.",
    "Ürün silindi.": "تم حذف المنتج.",
    "Form temizlendi.": "تم مسح النموذج.",
    "Varsayılan ürünler geri yüklendi.": "تمت استعادة المنتجات الافتراضية.",
    "Lütfen tüm iletişim alanlarını doldur.": "يرجى تعبئة جميع حقول التواصل.",
    "İletişim ve konum ayarları kaydedildi.": "تم حفظ إعدادات التواصل والموقع.",
    "Ayarlar varsayılana alındı.": "تمت إعادة الإعدادات إلى الافتراضي.",
    "Şifre gerekli.": "كلمة المرور مطلوبة.",
    "Şifre hatalı.": "كلمة المرور غير صحيحة.",
    "Bu ürünü silmek istediğine emin misin?": "هل أنت متأكد أنك تريد حذف هذا المنتج؟",
    "Varsayılan ürünleri geri yüklemek istediğine emin misin?": "هل أنت متأكد أنك تريد استعادة المنتجات الافتراضية؟",
    "Tüm sayfalardaki içerik düzenlemeleri sıfırlanacak. Devam etmek istiyor musun?": "ستُعاد تعيين كل تعديلات المحتوى في جميع الصفحات. هل تريد المتابعة؟",
    "Listelenen:": "المعروض:",
    "Ürün kopyalandı.": "تم تكرار المنتج.",
    "Ürünler JSON olarak dışa aktarıldı.": "تم تصدير المنتجات كـ JSON.",
    "JSON içeriği geçersiz.": "محتوى JSON غير صالح.",
    "JSON içe aktarıldı.": "تم استيراد JSON.",
    "JSON dosyası okunamadı.": "تعذّر قراءة ملف JSON.",
    "Düzenleme modu açıldı. Yeni sekmede Shift + Tıkla ile metin/link/görsel düzenleyebilirsin.": "تم فتح وضع التحرير. في التبويب الجديد يمكنك تحرير النص/الرابط/الصورة بـ Shift + Click.",
    "Düzenleme modu kapatıldı.": "تم إغلاق وضع التحرير.",
    "Tüm sayfa içerik düzenlemeleri sıfırlandı.": "تمت إعادة تعيين كل تعديلات محتوى الصفحات.",
    "Görsel URL": "URL الصورة",
    "Alt metni": "النص البديل",
    "Link metni": "نص الرابط",
    "Link adresi": "URL الرابط",
    "Metin": "النص",
    "Yeni, Premium...": "جديد، Premium...",
    "Güzeloba Mah. Çağlayangil Cad. No:38 / B, Muratpaşa / Antalya": "حي Guzeloba، شارع Caglayangil رقم:38 / B، Muratpasa / Antalya",
    "Merhaba Point Croissant, bilgi almak istiyorum.": "مرحباً Point Croissant، أود الحصول على معلومات.",
    "Merhaba Point Croissant,\n\nİstek / Dilek / Öneri Formu:\nAd Soyad: ${data.name}\nE-Posta: ${data.email}\nTelefon: ${data.phone}\nMesaj: ${data.message}": "مرحباً Point Croissant،\n\nنموذج الطلب / الاقتراح:\nالاسم الكامل: ${data.name}\nE-mail: ${data.email}\nالهاتف: ${data.phone}\nالرسالة: ${data.message}",
    "Point Croissant Antalya resmi web sitesi. Güzeloba, Muratpaşa’da cafe ve bakery: imza kruvasanlar, menü, rezervasyon ve iletişim.": "الموقع الرسمي لـ Point Croissant Antalya. مقهى ومخبز في Guzeloba، Muratpasa: كرواسان مميز، قائمة، حجوزات، وتواصل.",
    "Point Croissant Antalya lezzetleri: imza kruvasanlar, öne çıkan ürünler ve sipariş için iletişim bilgileri.": "نكهات Point Croissant Antalya: كرواسان مميز، منتجات بارزة، وبيانات تواصل للطلب.",
    "Point Croissant Antalya menü: güncel fiyatlar, kategorili kruvasan ve cafe ürünleri.": "قائمة Point Croissant Antalya: أسعار حالية، كرواسان مصنّف ومنتجات المقهى.",
    "Point Croissant hikayesi, üretim anlayışı ve marka yolculuğu.": "قصة Point Croissant، فلسفة الإنتاج، ورحلة العلامة.",
    "Kruvasan, kahve ve servis önerileri için Point Croissant blog içerikleri.": "محتوى Blog من Point Croissant لنصائح الكرواسان والقهوة والخدمة.",
    "İmza kruvasan hazırlama rehberi, püf noktaları ve üretim önerileri.": "دليل تحضير الكرواسان المميز، ونصائح، وتوصيات الإنتاج.",
    "Kahve ve kruvasan eşleşmesi için pratik öneriler ve lezzet uyumları.": "نصائح عملية وتوافقات نكهة للقهوة والكرواسان.",
    "Point Croissant etkinlikleri ve özel gün organizasyon bilgileri.": "معلومات فعاليات Point Croissant وتنظيم المناسبات الخاصة.",
    "Kurumsal iş birliği, marka bilgisi ve Point Croissant hakkında detaylar.": "التعاون المؤسسي، ومعلومات العلامة، وتفاصيل عن Point Croissant.",
    "Sıkça sorulan sorular: rezervasyon, teslimat, toplu sipariş ve daha fazlası.": "أسئلة شائعة: الحجوزات، التوصيل، الطلبات بالجملة، والمزيد.",
    "Point Croissant masa rezervasyonu için WhatsApp ve telefonla hızlı iletişim.": "تواصل سريع عبر WhatsApp والهاتف لحجز طاولة في Point Croissant.",
    "Antalya içi teslimat saatleri, sipariş detayları ve iletişim seçenekleri.": "ساعات التوصيل داخل Antalya، وتفاصيل الطلب، وخيارات التواصل.",
    "Toptan ve kurumsal tedarik çözümleri için teklif ve iletişim bilgileri.": "عرض السعر ومعلومات التواصل لحلول الجملة والتوريد للشركات.",
    "Point Croissant Gizlilik Politikası metni ve kişisel veri işleme esasları.": "نص سياسة الخصوصية لـ Point Croissant ومبادئ معالجة البيانات الشخصية.",
    "Point Croissant Kullanım Şartları ve site kullanımına ilişkin kurallar.": "شروط استخدام Point Croissant وقواعد استخدام الموقع.",
    "Point Croissant Çerez Politikası ve çerez tercihleri hakkında bilgiler.": "سياسة ملفات تعريف الارتباط لـ Point Croissant ومعلومات عن تفضيلات ملفات تعريف الارتباط.",
    "Web sitesi ve yazılım: SoftenWise": "الموقع والبرمجيات: SoftenWise",
    "SoftenWise — yazılım ve web geliştirme": "SoftenWise — البرمجيات وتطوير الويب",
    "Çeviri Eksiği (EN/RU/AR/DE)": "ترجمة ناقصة (EN/RU/AR/DE)",
    "AR alanı": "حقل AR",
    "DE alanı": "حقل DE",
    "Ürün Adı (AR)": "اسم المنتج (AR)",
    "Ürün Adı (DE)": "اسم المنتج (DE)",
    "Açıklama (AR)": "الوصف (AR)",
    "Açıklama (DE)": "الوصف (DE)",
    "Etiket (AR)": "الوسم (AR)",
    "Etiket (DE)": "الوسم (DE)",
    "Ürün Görsel URL (AR)": "URL صورة المنتج (AR)",
    "Ürün Görsel URL (DE)": "URL صورة المنتج (DE)",
    "Adres (AR)": "العنوان (AR)",
    "Adres (DE)": "العنوان (DE)",
    "Harita Konum Metni (AR)": "نص موقع الخريطة (AR)",
    "Harita Konum Metni (DE)": "نص موقع الخريطة (DE)",
    "Blog Yazıları": "مقالات المدونة",
    "Facebook URL": "رابط Facebook",
    "Google çalışma saati (şema)": "ساعات العمل في Google (schema)",
    "Instagram URL": "رابط Instagram",
    "Kategori": "الفئة",
    "Marka ve Sayaçlar": "العلامة والعدادات",
    "Menü Kategorileri": "فئات القائمة",
    "Menü Yapısı": "هيكل القائمة",
    "SEO ve Google": "SEO و Google",
    "Tuzlu": "مالح",
    "WhatsApp hazır mesaj (EN)": "رسالة WhatsApp الجاهزة (EN)",
    "WhatsApp hazır mesaj (RU)": "رسالة WhatsApp الجاهزة (RU)",
    "WhatsApp hazır mesaj (TR)": "رسالة WhatsApp الجاهزة (TR)",
    "WhatsApp hazır mesaj (AR)": "رسالة WhatsApp الجاهزة (AR)",
    "WhatsApp hazır mesaj (DE)": "رسالة WhatsApp الجاهزة (DE)",
    "Çalışma Saatleri": "ساعات العمل",
    "Çalışma Saatleri:": "ساعات العمل:",
    "İmza / özel seçkiye ekle": "أضف إلى التشكيلة المميزة / الخاصة"
  }
};

const getPageFile = () => {
  const page = window.location.pathname.split("/").pop();
  return page && page.length ? page : "index.html";
};

const ensureMetaTag = (selector, attrs, content) => {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => tag.setAttribute(key, value));
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const ensureMobileViewport = () => {
  const desired = "width=device-width, initial-scale=1.0, viewport-fit=cover";
  let viewport = document.head.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement("meta");
    viewport.setAttribute("name", "viewport");
    document.head.appendChild(viewport);
  }
  viewport.setAttribute("content", desired);
};

const ensureSeoMeta = () => {
  const hasNoIndex = !!document.head.querySelector('meta[name="robots"][content*="noindex"]');
  if (hasNoIndex) return;

  const pageFile = getPageFile();
  const isHome = pageFile === "index.html";
  const pagePath = isHome ? "/" : `/${pageFile}`;
  const canonicalUrl = `${SITE_ORIGIN}${pagePath}`;
  const settings = getStoreSettings();
  const seoEntry = settings?.seo?.[pageFile];
  const description =
    (seoEntry && getStoreLocalized(seoEntry.description)) ||
    SEO_DESCRIPTIONS[pageFile] ||
    SEO_DESCRIPTIONS["index.html"];
  const seoTitle =
    (seoEntry && getStoreLocalized(seoEntry.title)) || document.title || "Point Croissant";
  const ogType = OG_ARTICLE_PAGES.has(pageFile) ? "article" : "website";

  ensureMetaTag('meta[name="description"]', { name: "description" }, description);
  ensureMetaTag('meta[property="og:type"]', { property: "og:type" }, ogType);
  ensureMetaTag('meta[property="og:title"]', { property: "og:title" }, seoTitle);
  ensureMetaTag('meta[property="og:description"]', { property: "og:description" }, description);
  ensureMetaTag('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
  ensureMetaTag('meta[property="og:image"]', { property: "og:image" }, OG_IMAGE);
  ensureMetaTag('meta[property="og:image:secure_url"]', { property: "og:image:secure_url" }, OG_IMAGE);
  ensureMetaTag('meta[property="og:image:type"]', { property: "og:image:type" }, "image/jpeg");
  ensureMetaTag('meta[property="og:image:width"]', { property: "og:image:width" }, "1200");
  ensureMetaTag('meta[property="og:image:height"]', { property: "og:image:height" }, "630");
  ensureMetaTag('meta[property="og:site_name"]', { property: "og:site_name" }, "Point Croissant");
  ensureMetaTag('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
  ensureMetaTag('meta[name="twitter:title"]', { name: "twitter:title" }, seoTitle);
  ensureMetaTag('meta[name="twitter:description"]', { name: "twitter:description" }, description);
  ensureMetaTag('meta[name="twitter:image"]', { name: "twitter:image" }, OG_IMAGE);
  ensureMetaTag('meta[name="twitter:image:alt"]', { name: "twitter:image:alt" }, OG_IMAGE_ALT);
  ensureMetaTag('meta[property="og:image:alt"]', { property: "og:image:alt" }, OG_IMAGE_ALT);
  ensureMetaTag('meta[property="og:locale"]', { property: "og:locale" }, OG_LOCALES[activeLang] || "tr_TR");
  ensureMetaTag('meta[name="robots"]', { name: "robots" }, "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  ensureMetaTag('meta[name="theme-color"]', { name: "theme-color" }, "#3d2914");
  ensureMetaTag('meta[name="author"]', { name: "author" }, "Point Croissant");
  ensureMetaTag('meta[name="publisher"]', { name: "publisher" }, "Point Croissant");
  if (isHome) {
    ensureMetaTag('meta[name="keywords"]', { name: "keywords" }, SEO_HOME_KEYWORDS);
    ensureMetaTag('meta[name="application-name"]', { name: "application-name" }, "Point Croissant");
  }

  document.querySelectorAll('meta[property="og:locale:alternate"][data-pc-seo="1"]').forEach((node) => node.remove());
  Object.entries(OG_LOCALES)
    .filter(([lang]) => lang !== activeLang)
    .forEach(([, locale]) => {
    if (document.head.querySelector(`meta[property="og:locale:alternate"][content="${locale}"]`)) return;
    const alt = document.createElement("meta");
    alt.setAttribute("property", "og:locale:alternate");
    alt.setAttribute("content", locale);
    alt.setAttribute("data-pc-seo", "1");
    document.head.appendChild(alt);
  });

  if (!document.head.querySelector('link[rel="dns-prefetch"][data-pc-seo="1"]')) {
    const pre = document.createElement("link");
    pre.rel = "dns-prefetch";
    pre.href = SOFTENWISE_ORIGIN;
    pre.setAttribute("data-pc-seo", "1");
    document.head.appendChild(pre);
  }

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", canonicalUrl);
};

const buildSeoJsonLd = (pageFile, canonicalUrl, seoTitle, description) => {
  const softenwiseOrg = {
    "@type": "Organization",
    "@id": SCHEMA_IDS.softenwiseOrg,
    name: "SoftenWise",
    alternateName: ["Soften Wise", "softenwise"],
    url: `${SOFTENWISE_ORIGIN}/`,
    description:
      "Profesyonel yazılım ve web geliştirme. Point Croissant web sitesinin tasarım ve geliştirme ortağı."
  };

  const settings = getStoreSettings();
  const logoPath = settings?.logo || "assets/logo-point-croissant.webp";
  const logoUrl = logoPath.startsWith("http") ? logoPath : `${SITE_ORIGIN}/${logoPath.replace(/^\//, "")}`;
  const sameAs = [settings?.instagram, settings?.facebook].filter(Boolean);
  const localBusiness = {
    "@type": ["Bakery", "CafeOrCoffeeShop", "FoodEstablishment"],
    "@id": SCHEMA_IDS.localBusiness,
    name: settings?.brandName || "Point Croissant",
    alternateName: BRAND_ALTERNATE_NAMES,
    description:
      (settings?.seo?.["index.html"] && getStoreLocalized(settings.seo["index.html"].description)) ||
      SEO_DESCRIPTIONS["index.html"],
    url: SITE_ORIGIN,
    image: [OG_IMAGE, logoUrl],
    logo: logoUrl,
    telephone: settings?.phoneTel || SCHEMA_CONTACT.telephone,
    email: settings?.email || SCHEMA_CONTACT.email,
    servesCuisine: "French",
    priceRange: "$$",
    openingHours: settings?.openingHoursSpec || "Mo-Su 09:00-22:00",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.schemaStreet || SCHEMA_CONTACT.streetAddress,
      addressLocality: settings?.schemaLocality || SCHEMA_CONTACT.addressLocality,
      addressRegion: settings?.schemaRegion || SCHEMA_CONTACT.addressRegion,
      postalCode: settings?.schemaPostal || SCHEMA_CONTACT.postalCode,
      addressCountry: SCHEMA_CONTACT.addressCountry
    }
  };
  if (sameAs.length) localBusiness.sameAs = sameAs;

  const website = {
    "@type": "WebSite",
    "@id": SCHEMA_IDS.website,
    url: SITE_ORIGIN,
    name: "Point Croissant",
    alternateName: BRAND_ALTERNATE_NAMES,
    inLanguage: [...SUPPORTED_LANGS],
    publisher: { "@id": SCHEMA_IDS.localBusiness }
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: seoTitle,
    description,
    isPartOf: { "@id": SCHEMA_IDS.website },
    about: { "@id": SCHEMA_IDS.localBusiness },
    creator: { "@id": SCHEMA_IDS.softenwiseOrg },
    inLanguage: document.documentElement.lang || "tr"
  };

  const graph = [softenwiseOrg, localBusiness, website, webPage];

  if (pageFile !== "index.html" && BREADCRUMB_NAMES[pageFile]) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Anasayfa",
          item: `${SITE_ORIGIN}/`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: BREADCRUMB_NAMES[pageFile],
          item: canonicalUrl
        }
      ]
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
};

const ensureJsonLd = () => {
  const hasNoIndex = !!document.head.querySelector('meta[name="robots"][content*="noindex"]');
  if (hasNoIndex) return;

  document.querySelectorAll('script[type="application/ld+json"][data-pc-seo-jsonld="1"]').forEach((node) => node.remove());

  const pageFile = getPageFile();
  const isHome = pageFile === "index.html";
  const pagePath = isHome ? "/" : `/${pageFile}`;
  const canonicalUrl = `${SITE_ORIGIN}${pagePath}`;
  const settings = getStoreSettings();
  const seoEntry = settings?.seo?.[pageFile];
  const description =
    (seoEntry && getStoreLocalized(seoEntry.description)) ||
    SEO_DESCRIPTIONS[pageFile] ||
    SEO_DESCRIPTIONS["index.html"];
  const seoTitle =
    (seoEntry && getStoreLocalized(seoEntry.title)) || document.title || "Point Croissant";

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-pc-seo-jsonld", "1");
  script.textContent = JSON.stringify(buildSeoJsonLd(pageFile, canonicalUrl, seoTitle, description));
  document.head.appendChild(script);
};

const shouldSkipLazyImage = (img) =>
  img.classList.contains("hero-image") ||
  img.classList.contains("hero-emblem") ||
  img.closest(".brand") ||
  img.hasAttribute("data-no-lazy");

const hydrateVideoSources = (video) => {
  if (!(video instanceof HTMLVideoElement)) return;
  if (video.dataset.src && !video.getAttribute("src")) {
    video.setAttribute("src", video.dataset.src);
    delete video.dataset.src;
  }
  video.querySelectorAll("source[data-src]").forEach((source) => {
    source.setAttribute("src", source.dataset.src || "");
    source.removeAttribute("data-src");
  });
  video.load();
};

const applyLazyMediaDefaults = (root = document) => {
  const scope = root instanceof Element || root instanceof Document ? root : document;

  scope.querySelectorAll("img").forEach((img) => {
    if (shouldSkipLazyImage(img)) return;
    if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
    if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");
  });

  scope.querySelectorAll("video").forEach((video) => {
    if (!video.getAttribute("preload")) video.setAttribute("preload", "metadata");
  });
};

const mountLazyVideoObserver = () => {
  const lazyVideos = [...document.querySelectorAll("video[data-src], video source[data-src]")].map((node) =>
    node.closest("video")
  );
  const uniqueVideos = [...new Set(lazyVideos)].filter(Boolean);
  if (!uniqueVideos.length) return;

  if (!("IntersectionObserver" in window)) {
    uniqueVideos.forEach((video) => hydrateVideoSources(video));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrateVideoSources(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "180px 0px", threshold: 0.01 }
  );

  uniqueVideos.forEach((video) => observer.observe(video));
};

const translateString = (value, lang) => {
  if (!value || lang === "tr") return value;
  const dictionary = I18N_TEXT[lang] || {};
  return dictionary[value] || value;
};

const shouldSkipTextNode = (node) => {
  if (!node?.nodeValue?.trim()) return true;
  const parent = node.parentElement;
  if (!parent) return true;
  if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return true;
  if (parent.closest("[data-no-i18n]")) return true;
  return false;
};

const translateTextNode = (node) => {
  if (shouldSkipTextNode(node)) return;
  if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
  const source = originalTextNodes.get(node);
  const trimmed = source.trim();
  const translated = translateString(trimmed, activeLang);
  node.nodeValue = source.replace(trimmed, translated);
};

const translateAttributes = (el) => {
  if (!(el instanceof HTMLElement) || el.closest("[data-no-i18n]")) return;
  let sourceAttrs = originalAttrValues.get(el);
  if (!sourceAttrs) {
    sourceAttrs = {};
    ATTRS_TO_TRANSLATE.forEach((attr) => {
      if (el.hasAttribute(attr)) sourceAttrs[attr] = el.getAttribute(attr) || "";
    });
    originalAttrValues.set(el, sourceAttrs);
  }

  ATTRS_TO_TRANSLATE.forEach((attr) => {
    const sourceValue = sourceAttrs[attr];
    if (typeof sourceValue !== "string") return;
    el.setAttribute(attr, translateString(sourceValue, activeLang));
  });
};

const translateSubtree = (root) => {
  if (!root) return;
  if (root instanceof HTMLElement) translateAttributes(root);
  if (root instanceof HTMLElement) {
    root.querySelectorAll("*").forEach((el) => translateAttributes(el));
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    translateTextNode(node);
    node = walker.nextNode();
  }
};

const updateLanguageButtons = () => {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const isActive = btn.dataset.lang === activeLang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
};

const applySeoFromStore = (lang = activeLang) => {
  const settings = getStoreSettings();
  if (!settings) return;
  const pageFile = getPageFile();
  const entry = settings.seo && settings.seo[pageFile];
  const title = entry ? getStoreLocalized(entry.title, lang) : "";
  const description = entry ? getStoreLocalized(entry.description, lang) : "";
  if (title) document.title = title;
  if (description) {
    ensureMetaTag('meta[name="description"]', { name: "description" }, description);
    ensureMetaTag('meta[property="og:title"]', { property: "og:title" }, title || document.title);
    ensureMetaTag('meta[property="og:description"]', { property: "og:description" }, description);
    ensureMetaTag('meta[name="twitter:title"]', { name: "twitter:title" }, title || document.title);
    ensureMetaTag('meta[name="twitter:description"]', { name: "twitter:description" }, description);
  }
};

const applyLanguage = (lang, persist = true) => {
  activeLang = SUPPORTED_LANGS.includes(lang) ? lang : "tr";
  if (persist) localStorage.setItem(I18N_STORAGE_KEY, activeLang);
  document.documentElement.lang = activeLang;
  document.documentElement.dir = activeLang === "ar" ? "rtl" : "ltr";
  renderHeader();
  renderFooter();
  document.title = translateString(originalTitle, activeLang);
  applySeoFromStore(activeLang);
  translateSubtree(document.body);
  updateLanguageButtons();
  updateI18nObserverState();
  const ogLocale = document.head.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute("content", OG_LOCALES[activeLang] || "tr_TR");
  document.querySelectorAll('meta[property="og:locale:alternate"][data-pc-seo="1"]').forEach((node) => node.remove());
  Object.entries(OG_LOCALES)
    .filter(([code]) => code !== activeLang)
    .forEach(([, locale]) => {
      const alt = document.createElement("meta");
      alt.setAttribute("property", "og:locale:alternate");
      alt.setAttribute("content", locale);
      alt.setAttribute("data-pc-seo", "1");
      document.head.appendChild(alt);
    });
};

const mountI18nObserver = () => {
  if (i18nObserver) i18nObserver.disconnect();
  i18nObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((addedNode) => {
        if (addedNode instanceof HTMLElement || addedNode instanceof Text) {
          translateSubtree(addedNode);
        }
      });
    });
  });
};

const updateI18nObserverState = () => {
  if (!i18nObserver) return;
  i18nObserver.disconnect();
  if (activeLang === "tr") return;
  i18nObserver.observe(document.body, {
    subtree: true,
    childList: true
  });
};

const ensureBrandFonts = () => {
  if (document.getElementById("pc-brand-fonts")) return;
  [
    ["https://fonts.googleapis.com", ""],
    ["https://fonts.gstatic.com", "anonymous"]
  ].forEach(([href, cross]) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    if (cross) link.crossOrigin = cross;
    document.head.appendChild(link);
  });
  const fonts = document.createElement("link");
  fonts.id = "pc-brand-fonts";
  fonts.rel = "stylesheet";
  fonts.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(fonts);
};

const injectAtmosphere = () => {
  document.body.classList.add("lux-body");
  if (!document.querySelector(".film-grain")) {
    const grain = document.createElement("div");
    grain.className = "film-grain";
    grain.setAttribute("aria-hidden", "true");
    document.body.appendChild(grain);
  }
  if (!document.querySelector(".cursor-glow")) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
  }
};

const renderHeader = () => {
  const host = document.getElementById("site-header");
  if (!host) return;
  host.innerHTML = `
    <a class="skip-link" href="#main-content">İçeriğe geç</a>
    <div class="container nav-wrap">
      <a href="index.html" class="brand">
        <img src="assets/logo-point-croissant.webp" alt="Point Croissant Logo" width="60" height="60" />
        <div>
          <strong>Point Croissant</strong>
          <span>Cafe & Bakery</span>
        </div>
      </a>
      <input type="checkbox" id="menu-toggle" class="menu-toggle" />
      <label for="menu-toggle" class="menu-button" aria-label="Menüyü aç/kapat">
        <span></span><span></span><span></span>
      </label>
      <nav class="nav-links">
        ${NAV_LINKS.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
        <div class="lang-switch" role="group" aria-label="Dil seçimi">
          <button type="button" class="lang-btn" data-lang="tr">TR</button>
          <button type="button" class="lang-btn" data-lang="en">EN</button>
          <button type="button" class="lang-btn" data-lang="ru">RU</button>
          <button type="button" class="lang-btn" data-lang="ar">AR</button>
          <button type="button" class="lang-btn" data-lang="de">DE</button>
        </div>
        <a class="btn btn-small" href="reservation.html">Sipariş Ver</a>
      </nav>
    </div>
  `;
};

const renderFooter = () => {
  const host = document.getElementById("site-footer");
  if (!host) return;
  const settings = getStoreSettings();
  const brandName = settings?.brandName || "Point Croissant";
  const footerText = settings
    ? getStoreLocalized(settings.footerText)
    : "Günün en keyifli molası için taptaze kruvasanlar ve özenli kahve.";
  const hours = settings ? getStoreLocalized(settings.workingHours) : "";
  const socials = [];
  if (settings?.instagram) {
    socials.push(`<a href="${escapeChrome(settings.instagram)}" target="_blank" rel="noopener noreferrer" data-no-i18n>Instagram</a>`);
  }
  if (settings?.facebook) {
    socials.push(`<a href="${escapeChrome(settings.facebook)}" target="_blank" rel="noopener noreferrer" data-no-i18n>Facebook</a>`);
  }
  host.innerHTML = `
    <div class="footer-ornament" aria-hidden="true"></div>
    <div class="container footer-grid">
      <div class="footer-brand-col">
        <p class="eyebrow">Antalya</p>
        <h3 data-no-i18n>${escapeChrome(brandName)}</h3>
        <p data-no-i18n>${escapeChrome(footerText)}</p>
        ${hours ? `<p data-no-i18n>${escapeChrome(hours)}</p>` : ""}
        ${socials.length ? `<div class="footer-socials">${socials.join("")}</div>` : ""}
      </div>
      <div>
        <h4>Keşfet</h4>
        <a href="index.html">Anasayfa</a>
        <a href="hikayemiz.html">Hikayemiz</a>
        <a href="lezzetler.html">Lezzetler</a>
        <a href="menu.html">Menü</a>
        <a href="blog.html">Blog</a>
        <a href="events.html">Etkinlikler</a>
      </div>
      <div>
        <h4>Hizmetler</h4>
        <a href="reservation.html">Rezervasyon</a>
        <a href="delivery.html">Teslimat</a>
        <a href="wholesale.html">Toptan</a>
        <a href="faq.html">SSS</a>
      </div>
      <div>
        <h4>Yasal</h4>
        <a href="privacy.html">Gizlilik Politikası</a>
        <a href="terms.html">Kullanım Şartları</a>
        <a href="cookies.html">Çerez Politikası</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© 2026 ${escapeChrome(brandName)} Cafe & Bakery</span>
      <span>Antalya, Türkiye</span>
      <a class="designed-by" href="${SOFTENWISE_ORIGIN}/" target="_blank" rel="noopener noreferrer" title="SoftenWise — yazılım ve web geliştirme">Web sitesi ve yazılım: SoftenWise</a>
    </div>
  `;
};

const initLanguageControls = () => {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const langBtn = target.closest(".lang-btn");
    if (!(langBtn instanceof HTMLButtonElement)) return;
    const nextLang = langBtn.dataset.lang;
    if (!nextLang) return;
    applyLanguage(nextLang);
  });
};

const initMobileMenuInteractions = () => {
  const closeMenu = () => {
    const toggle = document.getElementById("menu-toggle");
    if (toggle instanceof HTMLInputElement) toggle.checked = false;
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(".nav-links a")) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1180) closeMenu();
  });
};

const applyA11yEnhancements = () => {
  const main = document.querySelector("main");
  if (main && !main.id) main.id = "main-content";

  const politeIds = ["request-feedback", "share-feedback", "admin-feedback", "settings-feedback", "cms-feedback", "admin-auth-feedback"];
  politeIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute("aria-live", "polite");
    el.setAttribute("role", "status");
  });
};

const ensureMotionScript = () => {
  const hasScript = [...document.scripts].some((node) => (node.getAttribute("src") || "").includes("script.js"));
  if (hasScript) return;
  const motion = document.createElement("script");
  motion.src = "script.js";
  document.body.appendChild(motion);
};

ensureBrandFonts();
injectAtmosphere();
renderHeader();
renderFooter();
ensureMobileViewport();
ensureSeoMeta();
ensureJsonLd();
applyLazyMediaDefaults(document);
mountLazyVideoObserver();
applyA11yEnhancements();
initLanguageControls();
initMobileMenuInteractions();
mountI18nObserver();
applyLanguage(localStorage.getItem(I18N_STORAGE_KEY) || "tr", false);
window.__pcApplyLanguage = applyLanguage;
window.__pcGetLang = () => activeLang;
window.__pcApplyLazyMedia = () => applyLazyMediaDefaults(document);
ensureMotionScript();
