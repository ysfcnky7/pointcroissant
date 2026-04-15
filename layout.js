const NAV_LINKS = [
  { href: "index.html", label: "Anasayfa" },
  { href: "hikayemiz.html", label: "Hikayemiz" },
  { href: "lezzetler.html", label: "Lezzetler" },
  { href: "index.html#galeri", label: "Galeri" },
  { href: "blog.html", label: "Tarifler" },
  { href: "index.html#siparis", label: "İletişim" }
];

const I18N_STORAGE_KEY = "pc_lang_v1";
const SUPPORTED_LANGS = ["tr", "en", "ru"];
const ATTRS_TO_TRANSLATE = ["placeholder", "title", "aria-label", "alt"];
const originalTextNodes = new WeakMap();
const originalAttrValues = new WeakMap();
const originalTitle = document.title;
let activeLang = "tr";
let i18nObserver = null;
const SITE_ORIGIN = "https://pointcroissant.com";

const SEO_DESCRIPTIONS = {
  "index.html": "Point Croissant Antalya resmi web sitesi. İmza kruvasanlar, iletişim ve güncel bilgiler.",
  "hikayemiz.html": "Point Croissant hikayesi, üretim anlayışı ve marka yolculuğu.",
  "lezzetler.html": "Point Croissant lezzetleri, öne çıkan ürünler ve sipariş için iletişim bilgileri.",
  "menu.html": "Point Croissant menü sayfası. Kategorili ürün listesi ve güncel fiyatlar.",
  "blog.html": "Kruvasan, kahve ve servis önerileri için Point Croissant blog içerikleri.",
  "blog-imza-kruvasan.html": "İmza kruvasan hazırlama rehberi, püf noktaları ve üretim önerileri.",
  "blog-kahve-eslesmesi.html": "Kahve ve kruvasan eşleşmesi için pratik öneriler ve lezzet uyumları.",
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
    "Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya": "Sirinyali Neighborhood, Lara Street No:128/A, Muratpasa / Antalya",
    "Merhaba Point Croissant, bilgi almak istiyorum.": "Hello Point Croissant, I would like to get information.",
    "Merhaba Point Croissant,\n\nİstek / Dilek / Öneri Formu:\nAd Soyad: ${data.name}\nE-Posta: ${data.email}\nTelefon: ${data.phone}\nMesaj: ${data.message}": "Hello Point Croissant,\n\nRequest / Suggestion Form:\nFull Name: ${data.name}\nE-mail: ${data.email}\nPhone: ${data.phone}\nMessage: ${data.message}",
    "Point Croissant Antalya resmi web sitesi. İmza kruvasanlar, iletişim ve güncel bilgiler.": "Official Point Croissant Antalya website. Signature croissants, contact details, and current information.",
    "Point Croissant hikayesi, üretim anlayışı ve marka yolculuğu.": "Point Croissant story, production philosophy, and brand journey.",
    "Point Croissant lezzetleri, öne çıkan ürünler ve sipariş için iletişim bilgileri.": "Point Croissant flavors, featured products, and contact details for ordering.",
    "Point Croissant menü sayfası. Kategorili ürün listesi ve güncel fiyatlar.": "Point Croissant menu page. Categorized product list and current prices.",
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
    "Point Croissant Çerez Politikası ve çerez tercihleri hakkında bilgiler.": "Point Croissant Cookie Policy and information about cookie preferences."
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
    "Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya": "Шириньялы, ул. Лара, No:128/A, Муратпаша / Анталья",
    "Merhaba Point Croissant, bilgi almak istiyorum.": "Здравствуйте, Point Croissant, я хотел(а) бы получить информацию.",
    "Merhaba Point Croissant,\n\nİstek / Dilek / Öneri Formu:\nAd Soyad: ${data.name}\nE-Posta: ${data.email}\nTelefon: ${data.phone}\nMesaj: ${data.message}": "Здравствуйте, Point Croissant,\n\nФорма запроса / предложения:\nИмя и фамилия: ${data.name}\nE-mail: ${data.email}\nТелефон: ${data.phone}\nСообщение: ${data.message}",
    "Point Croissant Antalya resmi web sitesi. İmza kruvasanlar, iletişim ve güncel bilgiler.": "Официальный сайт Point Croissant Antalya. Фирменные круассаны, контакты и актуальная информация.",
    "Point Croissant hikayesi, üretim anlayışı ve marka yolculuğu.": "История Point Croissant, подход к производству и путь бренда.",
    "Point Croissant lezzetleri, öne çıkan ürünler ve sipariş için iletişim bilgileri.": "Вкусы Point Croissant, популярные позиции и контакты для заказа.",
    "Point Croissant menü sayfası. Kategorili ürün listesi ve güncel fiyatlar.": "Страница меню Point Croissant. Категоризированный список товаров и актуальные цены.",
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
    "Point Croissant Çerez Politikası ve çerez tercihleri hakkında bilgiler.": "Политика cookie Point Croissant и информация о настройках cookie."
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
  const description = SEO_DESCRIPTIONS[pageFile] || SEO_DESCRIPTIONS["index.html"];
  const seoTitle = document.title || "Point Croissant";
  const ogImage = `${SITE_ORIGIN}/assets/logo-point-croissant.webp`;

  ensureMetaTag('meta[name="description"]', { name: "description" }, description);
  ensureMetaTag('meta[property="og:type"]', { property: "og:type" }, "website");
  ensureMetaTag('meta[property="og:title"]', { property: "og:title" }, seoTitle);
  ensureMetaTag('meta[property="og:description"]', { property: "og:description" }, description);
  ensureMetaTag('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
  ensureMetaTag('meta[property="og:image"]', { property: "og:image" }, ogImage);
  ensureMetaTag('meta[property="og:site_name"]', { property: "og:site_name" }, "Point Croissant");
  ensureMetaTag('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
  ensureMetaTag('meta[name="twitter:title"]', { name: "twitter:title" }, seoTitle);
  ensureMetaTag('meta[name="twitter:description"]', { name: "twitter:description" }, description);
  ensureMetaTag('meta[name="twitter:image"]', { name: "twitter:image" }, ogImage);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", canonicalUrl);
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

const applyLanguage = (lang, persist = true) => {
  activeLang = SUPPORTED_LANGS.includes(lang) ? lang : "tr";
  if (persist) localStorage.setItem(I18N_STORAGE_KEY, activeLang);
  document.documentElement.lang = activeLang;
  document.title = translateString(originalTitle, activeLang);
  translateSubtree(document.body);
  updateLanguageButtons();
  updateI18nObserverState();
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
        </div>
        <a class="btn btn-small" href="reservation.html">Sipariş Ver</a>
      </nav>
    </div>
  `;
};

const renderFooter = () => {
  const host = document.getElementById("site-footer");
  if (!host) return;
  host.innerHTML = `
    <div class="container footer-grid">
      <div>
        <h3>Point Croissant</h3>
        <p>Günün en keyifli molası için taptaze kruvasanlar ve özenli kahve.</p>
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
      <span>© 2026 Point Croissant Cafe & Bakery</span>
      <span>Antalya, Türkiye</span>
      <a class="designed-by" href="https://softenwise.com/" target="_blank" rel="noopener noreferrer">Designed by SoftenWise</a>
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
  const toggle = document.getElementById("menu-toggle");
  if (!(toggle instanceof HTMLInputElement)) return;

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(".nav-links a")) toggle.checked = false;
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) toggle.checked = false;
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

renderHeader();
renderFooter();
ensureMobileViewport();
ensureSeoMeta();
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
