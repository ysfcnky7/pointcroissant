(() => {
const Store = window.PCStore;
if (!Store) return;

const toLocalized = Store.toLocalized;
const normalizeLocalized = Store.normalizeLocalized;
const DEFAULT_PRODUCT_IMAGE = Store.DEFAULT_LOGO;
const LANGS = ["tr", "en", "ru", "ar", "de"];

const localizedWithFallback = (localized, lang) => {
  const value = normalizeLocalized(localized);
  return String(value[lang] || "").trim() || String(value.tr || "").trim() || "-";
};
const filledLangCodes = (localized) => {
  const value = normalizeLocalized(localized);
  return LANGS.filter((lang) => String(value[lang] || "").trim());
};
const syncLangPlaceholders = () => {
  LANGS.filter((lang) => lang !== "tr").forEach((lang) => {
    document.querySelectorAll(`input[id$="-${lang}"], textarea[id$="-${lang}"]`).forEach((el) => {
      const trEl = qs(el.id.replace(new RegExp(`-${lang}$`), "-tr"));
      if (!trEl) return;
      const trVal = String(trEl.value || "").trim();
      el.placeholder = trVal || "Boşsa TR kullanılır";
    });
  });
};
const clampText = (value, max) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
const clampMultiline = (value, max) =>
  String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
const clampSrc = (value) => {
  const src = String(value || "").trim();
  if (!src) return "";
  if (src.startsWith("pcimg:")) return src.slice(0, 80);
  if (src.startsWith("data:image/")) return src.slice(0, 1_800_000);
  return clampText(src, 500);
};
const fieldValue = (id) => qs(id)?.value || "";
const setIf = (id, value = "") => {
  const el = qs(id);
  if (el) el.value = value || "";
};
const fromLangFields = (prefix, max = 500, fallback = "") =>
  toLocalized(
    clampText(fieldValue(`${prefix}-tr`), max) || fallback,
    clampText(fieldValue(`${prefix}-en`), max),
    clampText(fieldValue(`${prefix}-ru`), max),
    clampText(fieldValue(`${prefix}-ar`), max),
    clampText(fieldValue(`${prefix}-de`), max)
  );
const fromLangAreas = (prefix, max = 8000, fallback = "") =>
  toLocalized(
    clampMultiline(fieldValue(`${prefix}-tr`), max) || fallback,
    clampMultiline(fieldValue(`${prefix}-en`), max),
    clampMultiline(fieldValue(`${prefix}-ru`), max),
    clampMultiline(fieldValue(`${prefix}-ar`), max),
    clampMultiline(fieldValue(`${prefix}-de`), max)
  );
const fromImageFields = (prefix, fallback = "") =>
  toLocalized(
    clampSrc(fieldValue(`${prefix}-tr`)) || fallback,
    clampSrc(fieldValue(`${prefix}-en`)),
    clampSrc(fieldValue(`${prefix}-ru`)),
    clampSrc(fieldValue(`${prefix}-ar`)),
    clampSrc(fieldValue(`${prefix}-de`))
  );
const toSharedLocalized = (value, max = 500) => {
  const text = clampText(value, max);
  return toLocalized(text, text, text, text, text);
};
const firstFilledLocalized = (localized) => {
  const value = normalizeLocalized(localized);
  return LANGS.map((lang) => value[lang]).find((text) => String(text || "").trim()) || "";
};
const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const PRODUCT_LIMITS = { name: 70, description: 320, tag: 26, image: 500 };
const SETTINGS_LIMITS = { phone: 24, email: 120, address: 220, mapQuery: 220, hours: 80, greeting: 220, url: 220 };

const qs = (id) => document.getElementById(id);
const actionButton = (event, attr) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return null;
  return target.closest(`[${attr}]`);
};
const activateLangTab = (group, lang = "tr") => {
  document.querySelectorAll(`.admin-lang-tab[data-tab-group="${group}"]`).forEach((tab) => {
    const isActive = tab.dataset.lang === lang;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  document.querySelectorAll(`.admin-lang-pane[data-tab-group="${group}"]`).forEach((pane) => {
    pane.classList.toggle("active", pane.dataset.lang === lang);
  });
};
const ADMIN_DEFAULT_VIEW = "overview";
const showAdminView = (view) => {
  const target = view || ADMIN_DEFAULT_VIEW;
  document.querySelectorAll("#admin-app .admin-panel").forEach((panel) => {
    const on = panel.dataset.adminView === target;
    panel.classList.toggle("is-active", on);
    panel.toggleAttribute("hidden", !on);
  });
  document.querySelectorAll(".admin-nav a[data-admin-view]").forEach((link) => {
    const on = link.dataset.adminView === target;
    link.classList.toggle("is-active", on);
    if (on) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
};
const viewFromHash = () => {
  const id = String(location.hash || "").replace("#", "");
  if (!id) return ADMIN_DEFAULT_VIEW;
  return qs(id)?.dataset.adminView || ADMIN_DEFAULT_VIEW;
};
const initAdminViews = () => {
  const nav = document.querySelector(".admin-nav");
  if (!nav) return;
  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-admin-view]");
    if (!link) return;
    event.preventDefault();
    const href = link.getAttribute("href") || "";
    if (href && location.hash !== href) history.replaceState(null, "", href);
    showAdminView(link.dataset.adminView);
    window.scrollTo({ top: 0, behavior: "auto" });
  });
  window.addEventListener("hashchange", () => showAdminView(viewFromHash()));
  showAdminView(viewFromHash());
};
const revealEditor = (panelId, group) => {
  if (group) activateLangTab(group, "tr");
  const panel = qs(panelId);
  if (!panel) return;
  const view = panel.dataset.adminView;
  if (view) {
    const href = `#${panelId}`;
    if (location.hash !== href) history.replaceState(null, "", href);
    showAdminView(view);
  }
  panel.classList.add("is-editing");
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => panel.classList.remove("is-editing"), 1800);
};
const form = qs("product-form");
const tableBody = qs("admin-products-body");
const feedback = qs("admin-feedback");
const settingsForm = qs("settings-form");
const settingsFeedback = qs("settings-feedback");
const productsCount = qs("admin-products-count");
const productsPreview = qs("admin-products-preview");
const productSearch = qs("product-search");
const productSort = qs("product-sort");
const productLangFilter = qs("product-lang-filter");
const productResetFiltersBtn = qs("product-reset-filters");
const exportProductsBtn = qs("export-products-json");
const importProductsBtn = qs("import-products-json-btn");
const importProductsInput = qs("import-products-json");
const kpiTotalProducts = qs("kpi-total-products");
const kpiAvgPrice = qs("kpi-avg-price");
const kpiMaxPrice = qs("kpi-max-price");
const kpiMissingI18n = qs("kpi-missing-i18n");

let products = Store.loadProducts();
let settings = Store.loadSettings();
let gallery = Store.loadGallery();
let events = Store.loadEvents();
let posts = Store.loadBlog();
let menuCats = Store.loadMenuCats();
let faqItems = Store.loadFaq();
let pageMap = Store.loadPages();
let inboxItems = Store.loadInbox();
let galleryFilters = Store.loadGalleryFilters();
let productFilters = { search: "", sort: "order-asc", lang: "tr" };

const saveProducts = () => Store.saveProducts(products);
const persistSettings = () => Store.saveSettings(settings);
const STORAGE_QUOTA_MSG =
  "Tarayıcı deposu doldu. Daha küçük bir görsel yükleyin veya eski görselleri silin. Kaliteyi düşürmemek için kayıt yapılmadı.";
const tryStore = (fn) => {
  try {
    fn();
    return true;
  } catch (error) {
    if (error && error.message === "STORAGE_QUOTA") return false;
    throw error;
  }
};
const imageApi = () => window.PCImageUpload;
const syncImageFields = (...ids) => {
  const api = imageApi();
  if (!api) return;
  ids.forEach((id) => api.syncField(id));
};
let imageBindTries = 0;
const bindAdminImageFields = () => {
  const api = imageApi();
  if (!api) {
    if (imageBindTries < 20) {
      imageBindTries += 1;
      window.setTimeout(bindAdminImageFields, 50);
    }
    return;
  }
  api.bindField("brand-logo", "logo");
  api.bindField("brand-hero-image", "hero");
  api.bindField("brand-og-image", "hero");
  LANGS.forEach((lang) => api.bindField(`product-image-${lang}`, "product"));
  api.bindField("gallery-src", "gallery");
  api.bindField("blog-image", "blog");
  api.bindField("event-image", "product");
};

const clearForm = () => {
  qs("product-id").value = "";
  LANGS.forEach((lang) => {
    setIf(`product-name-${lang}`, "");
    setIf(`product-desc-${lang}`, "");
    setIf(`product-tag-${lang}`, "");
    setIf(`product-image-${lang}`, "");
  });
  qs("product-price").value = "";
  if (qs("product-stock")) qs("product-stock").value = "";
  fillCategorySelect();
  if (qs("product-visible")) qs("product-visible").checked = true;
  if (qs("product-signature")) qs("product-signature").checked = false;
  LANGS.forEach((lang) => syncImageFields(`product-image-${lang}`));
};

const fillCategorySelect = (selected = "") => {
  const select = qs("product-category");
  if (!select) return;
  const options = menuCats.filter((cat) => cat.kind !== "signature");
  const list = options.length ? options : [{ id: "sweet", title: toLocalized("Tatlı") }];
  const current = selected || select.value || list[0].id;
  select.innerHTML = list
    .map(
      (cat) =>
        `<option value="${escapeHtml(cat.id)}" ${cat.id === current ? "selected" : ""}>${escapeHtml(
          localizedWithFallback(cat.title, "tr")
        )}</option>`
    )
    .join("");
};

const formatPrice = (price) => `${Number(price).toLocaleString("tr-TR")} TL`;
const categoryLabel = (item) => {
  const cat = menuCats.find((entry) => entry.id === item.category);
  const base = cat ? localizedWithFallback(cat.title, "tr") : item.category || "—";
  return item.signature ? `${base} · İmza` : base;
};

const compareLocalizedName = (a, b, lang) =>
  localizedWithFallback(a.name, lang).localeCompare(localizedWithFallback(b.name, lang), "tr");

const getFilteredProducts = () => {
  const search = productFilters.search.trim().toLocaleLowerCase("tr");
  const lang = productFilters.lang || "tr";
  let list = [...products];
  if (search) {
    list = list.filter((item) => {
      const name = localizedWithFallback(item.name, lang).toLocaleLowerCase("tr");
      const desc = localizedWithFallback(item.description, lang).toLocaleLowerCase("tr");
      const tag = localizedWithFallback(item.tag, lang).toLocaleLowerCase("tr");
      return name.includes(search) || desc.includes(search) || tag.includes(search);
    });
  }
  switch (productFilters.sort) {
    case "price-desc":
      list.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case "price-asc":
      list.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case "name-asc":
      list.sort((a, b) => compareLocalizedName(a, b, lang));
      break;
    case "order-asc":
      list.sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
      break;
    default:
      list.sort((a, b) => String(b.id).localeCompare(String(a.id), "tr"));
  }
  return list;
};

const countMissingTranslations = () =>
  products.reduce((acc, item) => {
    const name = normalizeLocalized(item.name);
    const desc = normalizeLocalized(item.description);
    const tag = normalizeLocalized(item.tag);
    const missing = ["en", "ru", "ar", "de"].some((lang) => !name[lang] || !desc[lang] || !tag[lang]);
    return acc + (missing ? 1 : 0);
  }, 0);

const renderDashboard = () => {
  if (kpiTotalProducts) kpiTotalProducts.textContent = String(products.length);
  if (kpiAvgPrice) {
    const avg =
      products.length > 0
        ? products.reduce((sum, item) => sum + Number(item.price || 0), 0) / products.length
        : 0;
    kpiAvgPrice.textContent = formatPrice(Math.round(avg));
  }
  if (kpiMaxPrice) {
    const max = products.length ? Math.max(...products.map((item) => Number(item.price || 0))) : 0;
    kpiMaxPrice.textContent = formatPrice(max);
  }
  if (kpiMissingI18n) kpiMissingI18n.textContent = String(countMissingTranslations());
  if (qs("kpi-hidden-products")) {
    qs("kpi-hidden-products").textContent = String(products.filter((item) => item.visible === false).length);
  }
  if (qs("kpi-inbox")) qs("kpi-inbox").textContent = String(inboxItems.length);
};

const renderTable = () => {
  const filtered = getFilteredProducts();
  const activeLang = productFilters.lang || "tr";
  tableBody.innerHTML = filtered
    .map((item) => {
      const displayName = escapeHtml(localizedWithFallback(item.name, activeLang));
      const displayTag = escapeHtml(localizedWithFallback(item.tag, activeLang) || "-");
      const imageSrc = escapeHtml(localizedWithFallback(item.image, activeLang) || DEFAULT_PRODUCT_IMAGE);
      return `
      <tr>
        <td><img class="admin-table-thumb" src="${imageSrc}" alt="${displayName}" loading="lazy" decoding="async" /></td>
        <td>${displayName}</td>
        <td>${formatPrice(item.price)}</td>
        <td>${displayTag}</td>
        <td>${escapeHtml(categoryLabel(item))}</td>
        <td>${item.visible === false ? "Gizli" : "Yayında"}${item.stock == null ? "" : ` · stok ${item.stock}`}</td>
        <td>
          <button class="admin-link-btn" data-action="up" data-id="${item.id}" type="button">Yukarı</button>
          <button class="admin-link-btn" data-action="down" data-id="${item.id}" type="button">Aşağı</button>
        </td>
        <td>
          <button class="admin-link-btn" data-action="edit" data-id="${item.id}" type="button">Düzenle</button>
          <button class="admin-link-btn" data-action="duplicate" data-id="${item.id}" type="button">Çoğalt</button>
          <button class="admin-link-btn danger" data-action="delete" data-id="${item.id}" type="button">Sil</button>
        </td>
      </tr>`;
    })
    .join("");

  if (productsCount) {
    productsCount.textContent = `Toplam ürün: ${products.length} • Listelenen: ${filtered.length}`;
  }

  if (productsPreview) {
    productsPreview.innerHTML = filtered
      .map((item) => {
        const name = normalizeLocalized(item.name);
        const desc = normalizeLocalized(item.description);
        const imageSrc = escapeHtml(localizedWithFallback(item.image, activeLang) || DEFAULT_PRODUCT_IMAGE);
        return `
          <article class="admin-product-card">
            <img src="${imageSrc}" alt="${escapeHtml(name.tr || "Ürün")}" loading="lazy" decoding="async" />
            <div>
              <h4>${escapeHtml(name.tr || "-")}</h4>
              <p>${escapeHtml(desc.tr || "-")}</p>
              <p><strong>${formatPrice(item.price)}</strong> · ${escapeHtml(categoryLabel(item))}</p>
              <small>TR: ${escapeHtml(name.tr || "-")}</small>
              <small>EN: ${escapeHtml(localizedWithFallback(name, "en"))}</small>
              <small>RU: ${escapeHtml(localizedWithFallback(name, "ru"))}</small>
              <small>AR: ${escapeHtml(localizedWithFallback(name, "ar"))}</small>
              <small>DE: ${escapeHtml(localizedWithFallback(name, "de"))}</small>
            </div>
          </article>`;
      })
      .join("");
  }
};

const getActiveLang = () => {
  if (typeof window.__pcGetLang === "function") return window.__pcGetLang();
  return document.documentElement.lang || "tr";
};

const ADMIN_TEXT = {
  tr: {
    confirmSaveProduct:
      "KAYDET UYARISI\n\nBu ürünü internet sitesine yazacaksınız.\n\nNe olacak:\n• Ad, açıklama, fiyat ve resim müşterinin gördüğü anasayfa ve menüde görünür.\n• Eski bilgi silinir. Geri alma düğmesi yoktur.\n\nTAMAM = kaydet ve sitede göster\nİPTAL = hiçbir şeyi değiştirme",
    confirmDeleteProduct:
      "SİLME UYARISI\n\nBu ürün müşterinin gördüğü siteden kalkacak.\n\nNe olacak:\n• Anasayfa ve menüde bu ürün görünmez.\n• Geri getiremezsiniz. Tekrar eklemek için adı, fiyatı ve resmi yeniden yazmanız gerekir.\n\nTAMAM = ürünü sil\nİPTAL = ürün dursun",
    confirmDuplicateProduct:
      "ÇOĞALTMA UYARISI\n\nAynı üründen bir kopya oluşturulacak.\n\nNe olacak:\n• Sitede iki ayrı ürün görünür.\n• Kopyanın adının sonuna (Kopya) yazılır. Fiyat aynı kalır.\n• İstemezseniz sonra Sil ile kopyayı kaldırabilirsiniz.\n\nTAMAM = kopya oluştur\nİPTAL = hiçbir şey yapma",
    confirmResetDefaults:
      "VARSAYILANA DÖN UYARISI\n\nSizin eklediğiniz BÜTÜN ürünler silinecek.\n\nNe olacak:\n• Liste eski örnek ürünlerle değişir.\n• Sizin ürünleriniz geri gelmez.\n\nBunu ancak yedeğiniz varsa yapın. Önce “Ürünleri JSON Dışa Aktar” ile kopya alabilirsiniz.\n\nTAMAM = her şeyi sil, örnekleri getir\nİPTAL = listem dursun",
    confirmClearForm:
      "FORMU TEMİZLE\n\nKutulardaki yazılar silinecek. Henüz Kaydet’e basmadıysanız bu bilgiler kaybolur.\n\nTAMAM = kutuları boşalt\nİPTAL = yazılar dursun",
    confirmImportJson:
      "JSON İÇE AKTAR UYARISI\n\nSeçtiğiniz dosyadaki ürünler, şimdi listedeki BÜTÜN ürünlerin yerine geçecek.\n\nNe olacak:\n• Mevcut ürün listeniz silinir.\n• Geri alma yoktur.\n\nDoğru yedek dosyası olduğundan emin olun.\n\nTAMAM = dosyayı yükle ve listeyi değiştir\nİPTAL = hiçbir şeyi değiştirme",
    confirmSaveSettings:
      "İLETİŞİM KAYDET UYARISI\n\nTelefon, WhatsApp, e-posta ve adres müşterinin sizi bulması için sitede değişecek.\n\nYanlış numara yazarsanız kimse ulaşamaz. Numarayı bir kez daha okuyun.\n\nTAMAM = kaydet ve sitede göster\nİPTAL = eski bilgiler dursun",
    confirmResetSettings:
      "VARSAYILAN İLETİŞİM UYARISI\n\nSizin yazdığınız telefon, WhatsApp, e-posta ve adres silinir, eski örnek bilgiler gelir.\n\nTAMAM = sil ve örneğe dön\nİPTAL = benim bilgilerim dursun",
    confirmSaveBrand:
      "MARKA KAYDET UYARISI\n\nMarka adı, logo, slogan ve sayaçlar tüm sitede değişecek.\n\nLogoyu buradan yükleyebilirsiniz. 8 MB üstü dosyalar kabul edilmez.\n\nTAMAM = kaydet\nİPTAL = eski görünüm dursun",
    confirmSaveNav:
      "MENÜ KAYDET UYARISI\n\nSitenin en üstündeki tıklanabilir yazılar değişecek.\n\nYanlış link yazarsanız düğme boş veya hatalı sayfaya gider.\n\nTAMAM = menüyü kaydet\nİPTAL = eski menü dursun",
    confirmResetNav:
      "VARSAYILAN MENÜ UYARISI\n\nSizin eklediğiniz üst menü linkleri silinir, eski örnek menü gelir.\n\nTAMAM = örneğe dön\nİPTAL = benim menüm dursun",
    confirmDeleteNav:
      "MENÜ SATIRI SİL\n\nBu satır üst menüden kalkacak. Menüyü Kaydet demeden sitede görünmez; yine de formdan silinir.\n\nTAMAM = bu satırı sil\nİPTAL = satır dursun",
    confirmSaveGallery:
      "GALERİ KAYDET UYARISI\n\nBu resim Galeri bölümünde görünecek. Bilgisayardan yükleyebilir veya URL yapıştırabilirsiniz. 8 MB üstü dosyalar kabul edilmez.\n\nTAMAM = resmi kaydet\nİPTAL = kaydetme",
    confirmDeleteGallery:
      "GALERİ SİL UYARISI\n\nBu resim siteden kalkacak ve geri gelmez. Tekrar eklemek için görseli yeniden yüklemeniz gerekir.\n\nTAMAM = resmi sil\nİPTAL = resim dursun",
    confirmSaveEvent:
      "ETKİNLİK KAYDET UYARISI\n\nBu etkinlik Etkinlikler sayfasında görünecek.\n\nTAMAM = kaydet\nİPTAL = kaydetme",
    confirmDeleteEvent:
      "ETKİNLİK SİL UYARISI\n\nBu etkinlik siteden kalkacak ve geri gelmez.\n\nTAMAM = sil\nİPTAL = dursun",
    confirmSaveBlog:
      "BLOG KAYDET UYARISI\n\nBu yazı Blog sayfasında görünecek. Yanlış kaydı geri almak zordur.\n\nTAMAM = yazıyı kaydet\nİPTAL = kaydetme",
    confirmDeleteBlog:
      "BLOG SİL UYARISI\n\nBu yazı siteden kalkacak ve geri gelmez.\n\nTAMAM = yazıyı sil\nİPTAL = yazı dursun",
    confirmSaveMenuCats:
      "KATEGORİ KAYDET UYARISI\n\nMenü sayfasındaki bölüm başlıkları değişecek.\n\nTAMAM = kaydet\nİPTAL = eski başlıklar dursun",
    confirmSaveFooter:
      "ALT MENÜ KAYDET UYARISI\n\nSitenin en altındaki linkler değişecek.\n\nTAMAM = kaydet\nİPTAL = eski alt menü dursun",
    confirmResetFooter:
      "VARSAYILAN ALT MENÜ\n\nSizin eklediğiniz alt menü linkleri silinir.\n\nTAMAM = örneğe dön\nİPTAL = benim menüm dursun",
    confirmSaveFaq:
      "SSS KAYDET UYARISI\n\nBu soru SSS sayfasında görünecek.\n\nTAMAM = kaydet\nİPTAL = kaydetme",
    confirmDeleteFaq:
      "SSS SİL UYARISI\n\nBu soru siteden kalkacak ve geri gelmez.\n\nTAMAM = sil\nİPTAL = dursun",
    confirmSavePage:
      "SAYFA KAYDET UYARISI\n\nSeçili sayfanın başlığı ve metni değişecek.\n\nTAMAM = kaydet\nİPTAL = kaydetme",
    confirmClearInbox:
      "GELEN KUTUSU\n\nListedeki bütün mesajlar silinecek.\n\nTAMAM = sil\nİPTAL = dursun",
    confirmImportBackup:
      "YEDEK YÜKLE\n\nBu dosya ürün, ayar, galeri, blog ve diğer her şeyi değiştirir. Geri alma yoktur.\n\nTAMAM = yükle\nİPTAL = vazgeç",
    confirmClearLocal:
      "YEREL ÖNİZLEMEYİ SİL\n\nBu tarayıcıdaki kayıtlar silinir. Canlı sitedeki pc-data.js veya varsayılanlar görünür.\n\nTAMAM = sil\nİPTAL = dursun",
    confirmSaveSeo:
      "SEO KAYDET UYARISI\n\nSeçili sayfanın Google’da görünen başlığı ve açıklaması değişecek.\n\nYanlış sayfa seçiliyse başka sayfanın arama yazısı değişir. Üstteki listeyi kontrol edin.\n\nTAMAM = kaydet\nİPTAL = kaydetme",
    needProductName:
      "Kayıt yapılamadı. Türkçe ürün adı boş. Üstte TR sekmesine tıklayın, “Ürün Adı (TR)” kutusuna ismi yazın (örnek: Antep Fıstıklı Kruvasan), sonra tekrar Kaydet’e basın.",
    needProductDesc:
      "Kayıt yapılamadı. Türkçe açıklama boş. TR sekmesinde “Açıklama (TR)” kutusuna kısa bir cümle yazın, sonra tekrar Kaydet’e basın.",
    needProductPrice:
      "Kayıt yapılamadı. Fiyat boş veya 0. Aşağıdaki “Fiyat (TL)” kutusuna sadece sayı yazın (örnek: 120). TL yazmayın, virgül kullanmayın.",
    needContactFields:
      "Kayıt yapılamadı. Telefon (gösterim), telefon (tel format), WhatsApp (gösterim), WhatsApp numara, e-posta ve Türkçe adres dolu olmalıdır. Kırmızı/boş kutuları doldurup tekrar Kaydet’e basın.",
    needBrandName:
      "Kayıt yapılamadı. Marka adı boş. En üstteki “Marka adı” kutusuna ismi yazın (örnek: Point Croissant), sonra tekrar Kaydet’e basın.",
    needGallerySrc:
      "Kayıt yapılamadı. Görsel yok. “Görsel yükle” ile dosya seçin veya URL yapıştırın. En fazla 8 MB, önerilen 1600×1200 px.",
    needEventFields:
      "Kayıt yapılamadı. Türkçe başlık ve açıklama zorunludur. TR sekmesine geçin, iki kutuyu doldurun, sonra tekrar Kaydet’e basın.",
    needBlogFields:
      "Kayıt yapılamadı. Türkçe başlık ve yazı zorunludur. TR sekmesinde “Başlık (TR)” ve “Yazı (TR)” kutularını doldurun, sonra tekrar Kaydet’e basın.",
    needNavLabel:
      "Kayıt yapılamadı. En az bir menü satırında Türkçe etiket (TR etiket) yazılmalıdır. Boş satırı silin veya isim yazın, sonra Menüyü Kaydet’e basın.",
    needSeoTitle:
      "Kayıt yapılamadı. Türkçe sayfa başlığı boş. TR sekmesinde “Sayfa başlığı (TR)” yazın. Önce üstteki listeden doğru sayfayı seçtiğinizden emin olun.",
    productUpdated:
      "Ürün kaydedildi. Müşteri anasayfa ve menüde yeni adı, fiyatı ve resmi görür. Sayfayı yenileyerek kontrol edebilirsiniz.",
    productAdded:
      "Yeni ürün eklendi. Müşteri anasayfa ve menüde bu ürünü görür. Listeden Düzenle ile tekrar değiştirebilirsiniz.",
    productLoaded:
      "Ürün forma geldi. Kutuları değiştirin, bitince Kaydet’e basın. Kaydetmezseniz sitede eski hali kalır.",
    productDeleted: "Ürün silindi. Artık anasayfa ve menüde görünmez. Geri getirmek için yeniden eklemeniz gerekir.",
    productDuplicated:
      "Ürünün kopyası eklendi. Sitede iki ürün görünür. Kopyanın adında (Kopya) yazar. İstemezseniz Sil ile kaldırın.",
    formCleared: "Form boşaltıldı. Henüz kaydetmediğiniz yazılar silindi. Sitedeki kayıtlı ürünler duruyor.",
    defaultsRestored:
      "Örnek ürünler geri yüklendi. Sizin eklediğiniz ürünler silindi. Eski listeniz yoksa yeniden yazmanız gerekir.",
    exportOk:
      "Ürün listesi bilgisayarınıza JSON dosyası olarak indi. Bu bir yedektir. Sitedeki ürünler silinmedi.",
    importInvalid:
      "Dosya yüklenmedi. Bu JSON ürün listesi değil veya içi boş. “Ürünleri JSON Dışa Aktar” ile indirdiğiniz dosyayı seçin.",
    importOk: "Dosyadaki ürünler yüklendi. Eski liste silindi. Anasayfa ve menü yeni listeyi gösterir.",
    importUnreadable:
      "Dosya okunamadı. Bozuk veya yanlış türde olabilir. JSON dosyası seçtiğinizden emin olun, sonra tekrar deneyin.",
    settingsSaved:
      "İletişim bilgileri kaydedildi. Müşteri sitede yeni telefon, WhatsApp, e-posta ve adresi görür.",
    settingsReset: "İletişim bilgileri eski örneğe döndü. Sizin yazdığınız numaralar silindi.",
    brandSaved: "Marka, logo ve sayaçlar kaydedildi. Değişiklik tüm sitede görünür.",
    navSaved: "Üst menü kaydedildi. Sitenin en üstündeki yazılar artık yeni haliyle görünür.",
    navReset: "Üst menü eski örneğe döndü. Sizin eklediğiniz linkler silindi.",
    gallerySaved: "Galeri resmi kaydedildi. Müşteri Galeri bölümünde bu resmi görür.",
    galleryDeleted: "Resim silindi. Galeri bölümünden kalktı. Geri gelmez.",
    galleryLoaded: "Resim forma geldi. Değiştirip Kaydet’e basın. Kaydetmezseniz sitede eski hali kalır.",
    eventSaved: "Etkinlik kaydedildi. Etkinlikler sayfasında görünür.",
    eventDeleted: "Etkinlik silindi. Siteden kalktı. Geri gelmez.",
    eventLoaded: "Etkinlik forma geldi. Değiştirip Kaydet’e basın. Kaydetmezseniz sitede eski hali kalır.",
    blogSaved: "Blog yazısı kaydedildi. Blog sayfasında görünür.",
    blogDeleted: "Yazı silindi. Blog sayfasından kalktı. Geri gelmez.",
    blogLoaded: "Yazı forma geldi. Değiştirip Kaydet’e basın. Kaydetmezseniz sitede eski hali kalır.",
    menuCatsSaved: "Menü kategorileri kaydedildi. Menü sayfasındaki bölüm başlıkları değişti.",
    footerSaved: "Alt menü kaydedildi. Sitenin en altındaki linkler güncellendi.",
    footerReset: "Alt menü eski örneğe döndü.",
    faqSaved: "Soru kaydedildi. SSS sayfasında görünür.",
    faqDeleted: "Soru silindi. SSS sayfasından kalktı.",
    faqLoaded: "Soru forma geldi. Değiştirip Kaydet’e basın.",
    needFaqFields: "Kayıt yapılamadı. Türkçe soru ve cevap zorunludur.",
    pageSaved: "Sayfa metni kaydedildi. İlgili sayfayı yenileyerek kontrol edin.",
    inboxCleared: "Gelen kutusu boşaltıldı.",
    inboxDeleted: "Mesaj silindi.",
    backupExportOk: "Yedek JSON bilgisayarınıza indi. Sitedeki içerik silinmedi.",
    backupImportOk: "Yedek yüklendi. Sayfayı yenileyin.",
    backupPublishOk: "pc-data.js indi. Bu dosyayı site klasörüne koyun ki müşteri yeni içeriği görsün.",
    backupCleared: "Yerel kayıtlar silindi. Sayfa yenilenecek.",
    backupInvalid: "Dosya okunamadı veya yedek formatı değil.",
    passwordChanged: "Şifre bu tarayıcıda değiştirildi. Çıkış yapıp yeni şifreyle girin.",
    passwordMismatch: "Yeni şifreler aynı değil veya 6 karakterden kısa.",
    passwordWrong: "Mevcut şifre yanlış.",
    seoSaved:
      "SEO kaydedildi. Seçtiğiniz sayfanın Google’da görünen başlığı ve açıklaması güncellendi. Yanlış sayfayı seçtiyseniz tekrar seçip kaydedin.",
    storageQuota:
      "Tarayıcı deposu doldu. Daha küçük bir görsel yükleyin veya eski görselleri silin. Kaliteyi düşürmemek için kayıt yapılmadı."
  },
  en: {
    confirmSaveProduct:
      "SAVE WARNING\n\nThis product will be written to the website.\n\nWhat happens:\n• Name, description, price and image will appear on the homepage and menu.\n• The old information is replaced. There is no undo.\n\nOK = save and show on the site\nCANCEL = change nothing",
    confirmDeleteProduct:
      "DELETE WARNING\n\nThis product will disappear from the customer website.\n\nWhat happens:\n• It will no longer show on the homepage and menu.\n• You cannot undo this. To bring it back you must type name, price and image again.\n\nOK = delete the product\nCANCEL = keep the product",
    confirmDuplicateProduct:
      "DUPLICATE WARNING\n\nA copy of this product will be created.\n\nWhat happens:\n• Customers will see two products.\n• The copy name ends with (Kopya). The price stays the same.\n• You can delete the copy later if you do not want it.\n\nOK = create the copy\nCANCEL = do nothing",
    confirmResetDefaults:
      "RESTORE DEFAULTS WARNING\n\nALL products you added will be deleted.\n\nWhat happens:\n• The list is replaced with sample products.\n• Your products will not come back.\n\nDo this only if you have a backup. You can first click “Export Products JSON”.\n\nOK = delete everything and restore samples\nCANCEL = keep my list",
    confirmClearForm:
      "CLEAR FORM\n\nThe text in the boxes will be erased. If you have not clicked Save yet, that information is lost.\n\nOK = empty the boxes\nCANCEL = keep the text",
    confirmImportJson:
      "IMPORT JSON WARNING\n\nProducts in the selected file will REPLACE the entire current list.\n\nWhat happens:\n• Your current product list is deleted.\n• There is no undo.\n\nMake sure this is the correct backup file.\n\nOK = load the file and replace the list\nCANCEL = change nothing",
    confirmSaveSettings:
      "CONTACT SAVE WARNING\n\nPhone, WhatsApp, email and address on the website will change so customers can reach you.\n\nA wrong number means nobody can call you. Read the number once more.\n\nOK = save and show on the site\nCANCEL = keep the old information",
    confirmResetSettings:
      "DEFAULT CONTACT WARNING\n\nThe phone, WhatsApp, email and address you typed will be deleted and replaced with sample values.\n\nOK = delete and restore sample\nCANCEL = keep my information",
    confirmSaveBrand:
      "BRAND SAVE WARNING\n\nBrand name, logo, slogan and counters will change on the whole website.\n\nYou can upload the logo here. Files over 8 MB are rejected.\n\nOK = save\nCANCEL = keep the old look",
    confirmSaveNav:
      "MENU SAVE WARNING\n\nThe clickable words at the top of the site will change.\n\nA wrong link sends the button to an empty or wrong page.\n\nOK = save the menu\nCANCEL = keep the old menu",
    confirmResetNav:
      "DEFAULT MENU WARNING\n\nThe top-menu links you added will be deleted and the sample menu comes back.\n\nOK = restore sample\nCANCEL = keep my menu",
    confirmDeleteNav:
      "DELETE MENU ROW\n\nThis row will be removed from the top menu. It is removed from the form now; click Save Menu later to apply on the site.\n\nOK = delete this row\nCANCEL = keep the row",
    confirmSaveGallery:
      "GALLERY SAVE WARNING\n\nThis image will appear in the Gallery. A wrong address means the picture will not show.\n\nOK = save the image\nCANCEL = do not save",
    confirmDeleteGallery:
      "GALLERY DELETE WARNING\n\nThis image will be removed from the site and will not come back. To add it again you must type the address.\n\nOK = delete the image\nCANCEL = keep the image",
    confirmSaveEvent:
      "EVENT SAVE WARNING\n\nThis event will appear on the Events page.\n\nOK = save\nCANCEL = do not save",
    confirmDeleteEvent:
      "EVENT DELETE WARNING\n\nThis event will be removed from the site and will not come back.\n\nOK = delete\nCANCEL = keep it",
    confirmSaveBlog:
      "BLOG SAVE WARNING\n\nThis article will appear on the Blog page. A wrong save is hard to undo.\n\nOK = save the article\nCANCEL = do not save",
    confirmDeleteBlog:
      "BLOG DELETE WARNING\n\nThis article will be removed from the site and will not come back.\n\nOK = delete the article\nCANCEL = keep the article",
    confirmSaveMenuCats:
      "CATEGORY SAVE WARNING\n\nThe Sweet / Savory / Signature headings on the Menu page will change.\n\nOK = save\nCANCEL = keep the old headings",
    confirmSaveSeo:
      "SEO SAVE WARNING\n\nThe Google title and description of the selected page will change.\n\nIf the wrong page is selected, another page’s search text changes. Check the list at the top.\n\nOK = save\nCANCEL = do not save",
    needProductName:
      "Not saved. Turkish product name is empty. Click the TR tab, type the name in “Product Name (TR)” (example: Pistachio Croissant), then click Save again.",
    needProductDesc:
      "Not saved. Turkish description is empty. On the TR tab, write a short sentence in “Description (TR)”, then click Save again.",
    needProductPrice:
      "Not saved. Price is empty or 0. In “Price (TL)” type numbers only (example: 120). Do not write TL and do not use a comma.",
    needContactFields:
      "Not saved. Display phone, tel phone, display WhatsApp, WhatsApp number, email and Turkish address must all be filled. Fill the empty boxes and click Save again.",
    needBrandName:
      "Not saved. Brand name is empty. Type the name in “Brand name” (example: Point Croissant), then click Save again.",
    needGallerySrc:
      "Not saved. No image. Use “Upload image” or paste a URL. Maximum 8 MB, recommended 1600×1200 px.",
    needEventFields:
      "Not saved. Turkish title and description are required. Open the TR tab, fill both boxes, then click Save again.",
    needBlogFields:
      "Not saved. Turkish title and article text are required. On the TR tab fill “Title (TR)” and “Article (TR)”, then click Save again.",
    needNavLabel:
      "Not saved. At least one menu row needs a Turkish label. Delete the empty row or type a name, then click Save Menu.",
    needSeoTitle:
      "Not saved. Turkish page title is empty. On the TR tab fill “Page title (TR)”. First make sure the correct page is selected in the list.",
    productUpdated:
      "Product saved. Customers now see the new name, price and image on the homepage and menu. You can refresh the page to check.",
    productAdded:
      "New product added. Customers see it on the homepage and menu. Use Edit in the list if you need to change it again.",
    productLoaded:
      "Product loaded into the form. Change the boxes, then click Save. If you do not save, the site keeps the old version.",
    productDeleted: "Product deleted. It no longer appears on the homepage and menu. To bring it back you must add it again.",
    productDuplicated:
      "A copy was added. Customers see two products. The copy name contains (Kopya). Delete it if you do not want it.",
    formCleared: "Form emptied. Unsaved text was erased. Products already saved on the site are unchanged.",
    defaultsRestored:
      "Sample products restored. The products you added were deleted. If you have no backup you must type them again.",
    exportOk:
      "The product list was downloaded to your computer as a JSON file. This is a backup. Products on the site were not deleted.",
    importInvalid:
      "File not loaded. This JSON is not a product list or it is empty. Choose a file you downloaded with “Export Products JSON”.",
    importOk: "Products from the file were loaded. The old list was deleted. Homepage and menu now show the new list.",
    importUnreadable:
      "The file could not be read. It may be damaged or the wrong type. Make sure you selected a JSON file, then try again.",
    settingsSaved:
      "Contact details saved. Customers now see the new phone, WhatsApp, email and address on the site.",
    settingsReset: "Contact details restored to the sample. The numbers you typed were deleted.",
    brandSaved: "Brand, logo and counters saved. The change is visible on the whole site.",
    navSaved: "Top menu saved. The words at the top of the site now show the new version.",
    navReset: "Top menu restored to the sample. The links you added were deleted.",
    gallerySaved: "Gallery image saved. Customers see this picture in the Gallery section.",
    galleryDeleted: "Image deleted. It was removed from the Gallery. It will not come back.",
    galleryLoaded: "Image loaded into the form. Change it and click Save. If you do not save, the site keeps the old version.",
    eventSaved: "Event saved. It appears on the Events page.",
    eventDeleted: "Event deleted. It was removed from the site. It will not come back.",
    eventLoaded: "Event loaded into the form. Change it and click Save. If you do not save, the site keeps the old version.",
    blogSaved: "Blog article saved. It appears on the Blog page.",
    blogDeleted: "Article deleted. It was removed from the Blog page. It will not come back.",
    blogLoaded: "Article loaded into the form. Change it and click Save. If you do not save, the site keeps the old version.",
    menuCatsSaved: "Menu categories saved. Sweet / Savory / Signature headings on the Menu page have changed.",
    seoSaved:
      "SEO saved. The Google title and description of the selected page were updated. If you picked the wrong page, select it again and save.",
    storageQuota:
      "Browser storage is full. Upload a smaller image or delete older images. Nothing was saved, so quality was not reduced."
  }
};

ADMIN_TEXT.ru = {
  confirmSaveProduct:
    "ПРЕДУПРЕЖДЕНИЕ О СОХРАНЕНИИ\n\nЭтот товар будет записан на сайт.\n\nЧто произойдёт:\n• Название, описание, цена и фото появятся на главной и в меню.\n• Старые данные заменятся. Отмены нет.\n\nОК = сохранить и показать на сайте\nОТМЕНА = ничего не менять",
  confirmDeleteProduct:
    "ПРЕДУПРЕЖДЕНИЕ ОБ УДАЛЕНИИ\n\nЭтот товар исчезнет с сайта для клиентов.\n\nЧто произойдёт:\n• На главной и в меню его не будет.\n• Вернуть одной кнопкой нельзя. Нужно снова ввести название, цену и фото.\n\nОК = удалить товар\nОТМЕНА = оставить товар",
  confirmDuplicateProduct:
    "ПРЕДУПРЕЖДЕНИЕ О КОПИИ\n\nБудет создана копия этого товара.\n\nЧто произойдёт:\n• На сайте появятся два товара.\n• В конце названия копии будет (Kopya). Цена та же.\n• Копию можно потом удалить.\n\nОК = создать копию\nОТМЕНА = ничего не делать",
  confirmResetDefaults:
    "ВОССТАНОВЛЕНИЕ ПО УМОЛЧАНИЮ\n\nВСЕ добавленные вами товары будут удалены.\n\nСписок заменится примерами. Ваши товары не вернутся.\nСначала можно нажать «Экспорт товаров в JSON».\n\nОК = удалить всё и вернуть примеры\nОТМЕНА = оставить мой список",
  confirmClearForm:
    "ОЧИСТИТЬ ФОРМУ\n\nТекст в полях сотрётся. Если вы ещё не нажали Сохранить, эти данные пропадут.\n\nОК = очистить поля\nОТМЕНА = оставить текст",
  confirmImportJson:
    "ИМПОРТ JSON\n\nТовары из файла ЗАМЕНЯТ весь текущий список. Текущий список удалится. Отмены нет.\n\nОК = загрузить файл\nОТМЕНА = ничего не менять",
  confirmSaveSettings:
    "СОХРАНЕНИЕ КОНТАКТОВ\n\nТелефон, WhatsApp, почта и адрес на сайте изменятся. Неверный номер — клиент не дозвониться.\n\nОК = сохранить\nОТМЕНА = оставить старые данные",
  confirmResetSettings:
    "КОНТАКТЫ ПО УМОЛЧАНИЮ\n\nВаши телефон, WhatsApp, почта и адрес удалятся, вернутся примеры.\n\nОК = вернуть примеры\nОТМЕНА = оставить мои данные",
  confirmSaveBrand:
    "СОХРАНЕНИЕ БРЕНДА\n\nНазвание, логотип, слоган и счётчики изменятся на всём сайте. Неверный адрес логотипа даст битую картинку.\n\nОК = сохранить\nОТМЕНА = оставить старый вид",
  confirmSaveNav:
    "СОХРАНЕНИЕ МЕНЮ\n\nНадписи вверху сайта изменятся. Неверная ссылка ведёт на пустую страницу.\n\nОК = сохранить меню\nОТМЕНА = оставить старое меню",
  confirmResetNav:
    "МЕНЮ ПО УМОЛЧАНИЮ\n\nВаши ссылки верхнего меню удалятся, вернётся пример.\n\nОК = вернуть пример\nОТМЕНА = оставить моё меню",
  confirmDeleteNav:
    "УДАЛИТЬ СТРОКУ МЕНЮ\n\nЭта строка будет убрана из формы. Чтобы применить на сайте, потом нажмите Сохранить меню.\n\nОК = удалить строку\nОТМЕНА = оставить",
  confirmSaveGallery:
    "СОХРАНЕНИЕ ГАЛЕРЕИ\n\nЭто фото появится в Галерее. Неверный адрес — картинка не откроется.\n\nОК = сохранить\nОТМЕНА = не сохранять",
  confirmDeleteGallery:
    "УДАЛЕНИЕ ИЗ ГАЛЕРЕИ\n\nФото исчезнет с сайта и не вернётся.\n\nОК = удалить\nОТМЕНА = оставить",
  confirmSaveEvent:
    "СОХРАНЕНИЕ СОБЫТИЯ\n\nСобытие появится на странице События.\n\nОК = сохранить\nОТМЕНА = не сохранять",
  confirmDeleteEvent:
    "УДАЛЕНИЕ СОБЫТИЯ\n\nСобытие исчезнет с сайта и не вернётся.\n\nОК = удалить\nОТМЕНА = оставить",
  confirmSaveBlog:
    "СОХРАНЕНИЕ БЛОГА\n\nСтатья появится на странице Блог. Ошибку сложно отменить.\n\nОК = сохранить\nОТМЕНА = не сохранять",
  confirmDeleteBlog:
    "УДАЛЕНИЕ СТАТЬИ\n\nСтатья исчезнет с сайта и не вернётся.\n\nОК = удалить\nОТМЕНА = оставить",
  confirmSaveMenuCats:
    "СОХРАНЕНИЕ КАТЕГОРИЙ\n\nЗаголовки Сладкое / Солёное / Фирменное на странице Меню изменятся.\n\nОК = сохранить\nОТМЕНА = оставить старые заголовки",
  confirmSaveSeo:
    "СОХРАНЕНИЕ SEO\n\nЗаголовок и описание выбранной страницы в Google изменятся. Проверьте список страниц сверху.\n\nОК = сохранить\nОТМЕНА = не сохранять",
  needProductName:
    "Не сохранено. Турецкое название товара пустое. Откройте вкладку TR, введите имя и снова нажмите Сохранить.",
  needProductDesc:
    "Не сохранено. Турецкое описание пустое. На вкладке TR заполните описание и снова нажмите Сохранить.",
  needProductPrice:
    "Не сохранено. Цена пустая или 0. В поле «Цена (TL)» введите только число (пример: 120).",
  needContactFields:
    "Не сохранено. Нужны телефон (показ), телефон (tel), WhatsApp (показ), номер WhatsApp, почта и турецкий адрес.",
  needBrandName: "Не сохранено. Название бренда пустое. Заполните поле и снова нажмите Сохранить.",
  needGallerySrc:
    "Не сохранено. URL изображения пустой. Введите путь, например assets/foto.webp или адрес с https://.",
  needEventFields: "Не сохранено. Нужны турецкие заголовок и описание. Заполните вкладку TR и снова сохраните.",
  needBlogFields: "Не сохранено. Нужны турецкие заголовок и текст статьи. Заполните вкладку TR и снова сохраните.",
  needNavLabel: "Не сохранено. Хотя бы в одной строке меню нужна турецкая подпись.",
  needSeoTitle: "Не сохранено. Турецкий заголовок страницы пустой. Сначала выберите верную страницу в списке.",
  productUpdated: "Товар сохранён. Клиенты видят новое название, цену и фото на главной и в меню.",
  productAdded: "Товар добавлен. Он виден на главной и в меню. Изменить можно через «Править».",
  productLoaded: "Товар загружен в форму. Измените поля и нажмите Сохранить, иначе на сайте останется старое.",
  productDeleted: "Товар удалён. На главной и в меню его больше нет.",
  productDuplicated: "Копия добавлена. На сайте два товара. В названии копии есть (Kopya).",
  formCleared: "Форма очищена. Несохранённый текст удалён. Товары на сайте не изменились.",
  defaultsRestored: "Примеры товаров восстановлены. Ваши товары удалены.",
  exportOk: "Список товаров скачан как JSON. Это копия. Товары на сайте не удалены.",
  importInvalid: "Файл не загружен. Это не список товаров или файл пустой.",
  importOk: "Товары из файла загружены. Старый список удалён.",
  importUnreadable: "Файл не прочитан. Выберите JSON и попробуйте снова.",
  settingsSaved: "Контакты сохранены. На сайте новые телефон, WhatsApp, почта и адрес.",
  settingsReset: "Контакты возвращены к примеру. Ваши номера удалены.",
  brandSaved: "Бренд, логотип и счётчики сохранены. Изменение видно на всём сайте.",
  navSaved: "Верхнее меню сохранено.",
  navReset: "Верхнее меню возвращено к примеру. Ваши ссылки удалены.",
  gallerySaved: "Фото галереи сохранено.",
  galleryDeleted: "Фото удалено из галереи. Оно не вернётся.",
  galleryLoaded: "Фото загружено в форму. Измените и нажмите Сохранить.",
  eventSaved: "Событие сохранено и видно на странице События.",
  eventDeleted: "Событие удалено с сайта.",
  eventLoaded: "Событие загружено в форму. Измените и нажмите Сохранить.",
  blogSaved: "Статья сохранена и видна на странице Блог.",
  blogDeleted: "Статья удалена со страницы Блог.",
  blogLoaded: "Статья загружена в форму. Измените и нажмите Сохранить.",
  menuCatsSaved: "Категории меню сохранены.",
  seoSaved: "SEO сохранено. Заголовок и описание выбранной страницы в Google обновлены.",
  storageQuota: "Хранилище браузера заполнено. Загрузите изображение меньшего размера. Запись не сохранена."
};

ADMIN_TEXT.ar = {
  confirmSaveProduct:
    "تحذير الحفظ\n\nسيُكتب هذا المنتج في الموقع.\n\nماذا يحدث:\n• يظهر الاسم والوصف والسعر والصورة في الصفحة الرئيسية والقائمة.\n• تُحذف المعلومات القديمة ولا يمكن التراجع.\n\nموافق = احفظ وأظهر في الموقع\nإلغاء = لا تغيّر شيئاً",
  confirmDeleteProduct:
    "تحذير الحذف\n\nسيختفي هذا المنتج من موقع الزبائن.\n\nلن يظهر في الصفحة الرئيسية والقائمة. لا يمكن التراجع. لإعادته يجب كتابة الاسم والسعر والصورة من جديد.\n\nموافق = احذف المنتج\nإلغاء = أبقِ المنتج",
  confirmDuplicateProduct:
    "تحذير النسخ\n\nستُنشأ نسخة من هذا المنتج. سيظهر منتجان في الموقع. ينتهي اسم النسخة بـ (Kopya). السعر نفسه.\n\nموافق = أنشئ النسخة\nإلغاء = لا تفعل شيئاً",
  confirmResetDefaults:
    "تحذير الإعادة للافتراضي\n\nستُحذف كل المنتجات التي أضفتها ويحل محلها أمثلة قديمة. لن تعود منتجاتك.\nيمكنك أولاً تصدير JSON كنسخة احتياطية.\n\nموافق = احذف الكل وأعد الأمثلة\nإلغاء = أبقِ قائمتي",
  confirmClearForm:
    "مسح النموذج\n\nسيُمسح النص في الحقول. إن لم تضغط حفظ بعد، تضيع المعلومات.\n\nموافق = أفرغ الحقول\nإلغاء = أبقِ النص",
  confirmImportJson:
    "تحذير استيراد JSON\n\nمنتجات الملف ستستبدل القائمة الحالية بالكامل. لا يمكن التراجع.\n\nموافق = حمّل الملف\nإلغاء = لا تغيّر شيئاً",
  confirmSaveSettings:
    "تحذير حفظ التواصل\n\nسيتغير الهاتف وواتساب والبريد والعنوان في الموقع. رقم خاطئ يعني أن لا أحد يصل إليكم.\n\nموافق = احفظ\nإلغاء = أبقِ المعلومات القديمة",
  confirmResetSettings:
    "تحذير التواصل الافتراضي\n\nستُحذف أرقامكم ويعود المثال القديم.\n\nموافق = أعد المثال\nإلغاء = أبقِ معلوماتي",
  confirmSaveBrand:
    "تحذير حفظ العلامة\n\nسيتغير الاسم والشعار والعدادات في كل الموقع. عنوان شعار خاطئ يظهر صورة مكسورة.\n\nموافق = احفظ\nإلغاء = أبقِ الشكل القديم",
  confirmSaveNav:
    "تحذير حفظ القائمة\n\nستتغير الكلمات القابلة للنقر أعلى الموقع. رابط خاطئ يفتح صفحة فارغة.\n\nموافق = احفظ القائمة\nإلغاء = أبقِ القائمة القديمة",
  confirmResetNav:
    "القائمة الافتراضية\n\nستُحذف روابطكم وتعود قائمة المثال.\n\nموافق = أعد المثال\nإلغاء = أبقِ قائمتي",
  confirmDeleteNav:
    "حذف صف القائمة\n\nسيُحذف هذا الصف من النموذج. اضغط حفظ القائمة لاحقاً لتطبيق ذلك في الموقع.\n\nموافق = احذف الصف\nإلغاء = أبقِ الصف",
  confirmSaveGallery:
    "تحذير حفظ المعرض\n\nستظهر هذه الصورة في المعرض. عنوان خاطئ يعني أن الصورة لن تظهر.\n\nموافق = احفظ\nإلغاء = لا تحفظ",
  confirmDeleteGallery:
    "تحذير حذف المعرض\n\nستُحذف الصورة من الموقع ولن تعود.\n\nموافق = احذف\nإلغاء = أبقِ الصورة",
  confirmSaveEvent:
    "تحذير حفظ الفعالية\n\nستظهر هذه الفعالية في صفحة الفعاليات.\n\nموافق = احفظ\nإلغاء = لا تحفظ",
  confirmDeleteEvent:
    "تحذير حذف الفعالية\n\nستُحذف الفعالية من الموقع ولن تعود.\n\nموافق = احذف\nإلغاء = أبقِها",
  confirmSaveBlog:
    "تحذير حفظ المدونة\n\nستظهر المقالة في صفحة المدونة. يصعب التراجع عن حفظ خاطئ.\n\nموافق = احفظ\nإلغاء = لا تحفظ",
  confirmDeleteBlog:
    "تحذير حذف المقالة\n\nستُحذف المقالة من الموقع ولن تعود.\n\nموافق = احذف\nإلغاء = أبقِ المقالة",
  confirmSaveMenuCats:
    "تحذير حفظ الفئات\n\nستتغير عناوين حلو / مالح / توقيع في صفحة القائمة.\n\nموافق = احفظ\nإلغاء = أبقِ العناوين القديمة",
  confirmSaveSeo:
    "تحذير حفظ SEO\n\nسيتغير عنوان الصفحة ووصفها في Google. تحقق من الصفحة المختارة في القائمة.\n\nموافق = احفظ\nإلغاء = لا تحفظ",
  needProductName: "لم يُحفظ. اسم المنتج بالتركية فارغ. افتح تبويب TR واكتب الاسم ثم اضغط حفظ.",
  needProductDesc: "لم يُحفظ. الوصف بالتركية فارغ. املأ الوصف في تبويب TR ثم اضغط حفظ.",
  needProductPrice: "لم يُحفظ. السعر فارغ أو 0. اكتب رقماً فقط في خانة السعر (مثال: 120).",
  needContactFields: "لم يُحفظ. يجب ملء الهاتف وواتساب والبريد والعنوان التركي.",
  needBrandName: "لم يُحفظ. اسم العلامة فارغ. املأ الحقل ثم اضغط حفظ.",
  needGallerySrc: "لم يُحفظ. عنوان الصورة فارغ. اكتب المسار مثل assets/foto.webp أو رابط https://.",
  needEventFields: "لم يُحفظ. العنوان والوصف بالتركية إلزاميان.",
  needBlogFields: "لم يُحفظ. العنوان والنص بالتركية إلزاميان.",
  needNavLabel: "لم يُحفظ. يجب كتابة تسمية تركية في صف واحد على الأقل.",
  needSeoTitle: "لم يُحفظ. عنوان الصفحة بالتركية فارغ. تأكد أولاً من اختيار الصفحة الصحيحة.",
  productUpdated: "تم حفظ المنتج. يرى الزبون الاسم والسعر والصورة الجديدة في الصفحة الرئيسية والقائمة.",
  productAdded: "تمت إضافة المنتج. يظهر في الصفحة الرئيسية والقائمة.",
  productLoaded: "تم تحميل المنتج في النموذج. غيّر الحقول ثم اضغط حفظ.",
  productDeleted: "تم حذف المنتج. لم يعد يظهر في الموقع.",
  productDuplicated: "تمت إضافة نسخة. يظهر منتجان. في اسم النسخة (Kopya).",
  formCleared: "تم تفريغ النموذج. النصوص غير المحفوظة حُذفت. المنتجات في الموقع لم تتغير.",
  defaultsRestored: "تمت استعادة المنتجات الافتراضية. منتجاتكم حُذفت.",
  exportOk: "تم تنزيل قائمة المنتجات كملف JSON. هذه نسخة احتياطية. لم تُحذف منتجات الموقع.",
  importInvalid: "لم يُحمَّل الملف. هذا ليس قائمة منتجات أو الملف فارغ.",
  importOk: "تم تحميل منتجات الملف. حُذفت القائمة القديمة.",
  importUnreadable: "تعذّر قراءة الملف. اختر ملف JSON ثم أعد المحاولة.",
  settingsSaved: "تم حفظ معلومات التواصل. يظهر الهاتف وواتساب والبريد والعنوان الجديد في الموقع.",
  settingsReset: "عادت معلومات التواصل للمثال. حُذفت أرقامكم.",
  brandSaved: "تم حفظ العلامة والشعار والعدادات.",
  navSaved: "تم حفظ القائمة العلوية.",
  navReset: "عادت القائمة العلوية للمثال. حُذفت روابطكم.",
  gallerySaved: "تم حفظ صورة المعرض.",
  galleryDeleted: "حُذفت الصورة من المعرض ولن تعود.",
  galleryLoaded: "تم تحميل الصورة في النموذج. غيّرها ثم اضغط حفظ.",
  eventSaved: "تم حفظ الفعالية وتظهر في صفحة الفعاليات.",
  eventDeleted: "حُذفت الفعالية من الموقع.",
  eventLoaded: "تم تحميل الفعالية في النموذج. غيّرها ثم اضغط حفظ.",
  blogSaved: "تم حفظ المقالة وتظهر في المدونة.",
  blogDeleted: "حُذفت المقالة من المدونة.",
  blogLoaded: "تم تحميل المقالة في النموذج. غيّرها ثم اضغط حفظ.",
  menuCatsSaved: "تم حفظ فئات القائمة.",
  seoSaved: "تم حفظ SEO. تحديث عنوان الصفحة ووصفها في Google.",
  storageQuota: "امتلأ تخزين المتصفح. ارفع صورة أصغر أو احذف الصور القديمة. لم يُحفظ شيء حتى لا تنخفض الجودة."
};

ADMIN_TEXT.de = {
  confirmSaveProduct:
    "SPEICHERN-HINWEIS\n\nDieses Produkt wird auf die Website geschrieben.\n\nWas passiert:\n• Name, Beschreibung, Preis und Bild erscheinen auf Startseite und Speisekarte.\n• Alte Daten werden ersetzt. Es gibt kein Rückgängig.\n\nOK = speichern und auf der Website zeigen\nABBRECHEN = nichts ändern",
  confirmDeleteProduct:
    "LÖSCH-HINWEIS\n\nDieses Produkt verschwindet von der Kundenwebsite.\n\nEs erscheint nicht mehr auf Startseite und Speisekarte. Sie können das nicht rückgängig machen.\n\nOK = Produkt löschen\nABBRECHEN = Produkt behalten",
  confirmDuplicateProduct:
    "KOPIER-HINWEIS\n\nEs wird eine Kopie dieses Produkts erstellt. Kunden sehen zwei Produkte. Der Kopiename endet mit (Kopya).\n\nOK = Kopie erstellen\nABBRECHEN = nichts tun",
  confirmResetDefaults:
    "STANDARD WIEDERHERSTELLEN\n\nALLE von Ihnen hinzugefügten Produkte werden gelöscht und durch Beispiele ersetzt. Ihre Produkte kommen nicht zurück.\nZuerst können Sie JSON exportieren.\n\nOK = alles löschen und Beispiele laden\nABBRECHEN = meine Liste behalten",
  confirmClearForm:
    "FORMULAR LEEREN\n\nDer Text in den Feldern wird gelöscht. Wenn Sie noch nicht auf Speichern geklickt haben, sind die Daten weg.\n\nOK = Felder leeren\nABBRECHEN = Text behalten",
  confirmImportJson:
    "JSON-IMPORT-HINWEIS\n\nDie Produkte in der Datei ERSETZEN die gesamte aktuelle Liste. Es gibt kein Rückgängig.\n\nOK = Datei laden\nABBRECHEN = nichts ändern",
  confirmSaveSettings:
    "KONTAKT SPEICHERN\n\nTelefon, WhatsApp, E-Mail und Adresse auf der Website ändern sich. Eine falsche Nummer bedeutet, niemand erreicht Sie.\n\nOK = speichern\nABBRECHEN = alte Daten behalten",
  confirmResetSettings:
    "KONTAKT ZURÜCKSETZEN\n\nIhre Telefon-, WhatsApp-, E-Mail- und Adressdaten werden gelöscht, die Beispiele kommen zurück.\n\nOK = Beispiele laden\nABBRECHEN = meine Daten behalten",
  confirmSaveBrand:
    "MARKE SPEICHERN\n\nName, Logo, Slogan und Zähler ändern sich auf der ganzen Website. Eine falsche Logo-Adresse zeigt ein kaputtes Bild.\n\nOK = speichern\nABBRECHEN = altes Aussehen behalten",
  confirmSaveNav:
    "MENÜ SPEICHERN\n\nDie klickbaren Wörter oben auf der Website ändern sich. Ein falscher Link öffnet eine leere Seite.\n\nOK = Menü speichern\nABBRECHEN = altes Menü behalten",
  confirmResetNav:
    "STANDARDMENÜ\n\nIhre Menülinks werden gelöscht, das Beispielmenü kommt zurück.\n\nOK = Beispiel laden\nABBRECHEN = mein Menü behalten",
  confirmDeleteNav:
    "MENÜZEILE LÖSCHEN\n\nDiese Zeile wird aus dem Formular entfernt. Speichern Sie später das Menü, damit es auf der Website gilt.\n\nOK = Zeile löschen\nABBRECHEN = Zeile behalten",
  confirmSaveGallery:
    "GALERIE SPEICHERN\n\nDieses Bild erscheint in der Galerie. Eine falsche Adresse zeigt kein Bild.\n\nOK = speichern\nABBRECHEN = nicht speichern",
  confirmDeleteGallery:
    "GALERIE LÖSCHEN\n\nDas Bild verschwindet von der Website und kommt nicht zurück.\n\nOK = löschen\nABBRECHEN = Bild behalten",
  confirmSaveEvent:
    "EVENT SPEICHERN\n\nDieses Event erscheint auf der Events-Seite.\n\nOK = speichern\nABBRECHEN = nicht speichern",
  confirmDeleteEvent:
    "EVENT LÖSCHEN\n\nDas Event verschwindet von der Website und kommt nicht zurück.\n\nOK = löschen\nABBRECHEN = behalten",
  confirmSaveBlog:
    "BLOG SPEICHERN\n\nDieser Artikel erscheint auf der Blog-Seite. Falsches Speichern ist schwer rückgängig zu machen.\n\nOK = speichern\nABBRECHEN = nicht speichern",
  confirmDeleteBlog:
    "BLOG LÖSCHEN\n\nDer Artikel verschwindet von der Website und kommt nicht zurück.\n\nOK = löschen\nABBRECHEN = Artikel behalten",
  confirmSaveMenuCats:
    "KATEGORIEN SPEICHERN\n\nDie Überschriften Süß / Herzhaft / Signature auf der Speisekarte ändern sich.\n\nOK = speichern\nABBRECHEN = alte Überschriften behalten",
  confirmSaveSeo:
    "SEO SPEICHERN\n\nTitel und Beschreibung der gewählten Seite in Google ändern sich. Prüfen Sie die Seitenliste oben.\n\nOK = speichern\nABBRECHEN = nicht speichern",
  needProductName:
    "Nicht gespeichert. Der türkische Produktname ist leer. Öffnen Sie den TR-Tab, geben Sie den Namen ein und klicken Sie erneut auf Speichern.",
  needProductDesc:
    "Nicht gespeichert. Die türkische Beschreibung ist leer. Füllen Sie sie im TR-Tab und speichern Sie erneut.",
  needProductPrice:
    "Nicht gespeichert. Der Preis ist leer oder 0. Geben Sie nur eine Zahl ein (Beispiel: 120).",
  needContactFields:
    "Nicht gespeichert. Telefon, WhatsApp, E-Mail und türkische Adresse müssen ausgefüllt sein.",
  needBrandName: "Nicht gespeichert. Der Markenname ist leer. Füllen Sie das Feld und speichern Sie erneut.",
  needGallerySrc:
    "Nicht gespeichert. Die Bild-URL ist leer. Geben Sie z. B. assets/foto.webp oder eine https://-Adresse ein.",
  needEventFields: "Nicht gespeichert. Türkischer Titel und Beschreibung sind Pflicht.",
  needBlogFields: "Nicht gespeichert. Türkischer Titel und Text sind Pflicht.",
  needNavLabel: "Nicht gespeichert. Mindestens eine Menüzeile braucht ein türkisches Label.",
  needSeoTitle: "Nicht gespeichert. Der türkische Seitentitel ist leer. Wählen Sie zuerst die richtige Seite.",
  productUpdated: "Produkt gespeichert. Kunden sehen Name, Preis und Bild neu auf Startseite und Speisekarte.",
  productAdded: "Produkt hinzugefügt. Es erscheint auf Startseite und Speisekarte.",
  productLoaded: "Produkt ins Formular geladen. Ändern Sie die Felder und klicken Sie Speichern.",
  productDeleted: "Produkt gelöscht. Es erscheint nicht mehr auf der Website.",
  productDuplicated: "Kopie hinzugefügt. Kunden sehen zwei Produkte. Der Kopiename enthält (Kopya).",
  formCleared: "Formular geleert. Ungespeicherter Text ist weg. Gespeicherte Produkte auf der Website bleiben.",
  defaultsRestored: "Beispielprodukte wiederhergestellt. Ihre Produkte wurden gelöscht.",
  exportOk: "Die Produktliste wurde als JSON heruntergeladen. Das ist eine Sicherung. Die Website wurde nicht gelöscht.",
  importInvalid: "Datei nicht geladen. Das ist keine Produktliste oder die Datei ist leer.",
  importOk: "Produkte aus der Datei geladen. Die alte Liste wurde gelöscht.",
  importUnreadable: "Datei konnte nicht gelesen werden. Wählen Sie eine JSON-Datei und versuchen Sie es erneut.",
  settingsSaved: "Kontaktdaten gespeichert. Kunden sehen neue Telefon-, WhatsApp-, E-Mail- und Adressdaten.",
  settingsReset: "Kontaktdaten auf das Beispiel zurückgesetzt. Ihre Nummern wurden gelöscht.",
  brandSaved: "Marke, Logo und Zähler gespeichert. Die Änderung gilt für die ganze Website.",
  navSaved: "Oberes Menü gespeichert.",
  navReset: "Oberes Menü auf das Beispiel zurückgesetzt. Ihre Links wurden gelöscht.",
  gallerySaved: "Galeriebild gespeichert.",
  galleryDeleted: "Bild gelöscht. Es ist aus der Galerie entfernt und kommt nicht zurück.",
  galleryLoaded: "Bild ins Formular geladen. Ändern und Speichern klicken.",
  eventSaved: "Event gespeichert. Es erscheint auf der Events-Seite.",
  eventDeleted: "Event gelöscht und von der Website entfernt.",
  eventLoaded: "Event ins Formular geladen. Ändern und Speichern klicken.",
  blogSaved: "Blogartikel gespeichert. Er erscheint auf der Blog-Seite.",
  blogDeleted: "Artikel gelöscht und von der Blog-Seite entfernt.",
  blogLoaded: "Artikel ins Formular geladen. Ändern und Speichern klicken.",
  menuCatsSaved: "Menükategorien gespeichert.",
  seoSaved: "SEO gespeichert. Google-Titel und Beschreibung der gewählten Seite wurden aktualisiert.",
  storageQuota: "Der Browserspeicher ist voll. Laden Sie ein kleineres Bild hoch. Es wurde nichts gespeichert."
};

const adminText = (key) => {
  const pack = ADMIN_TEXT[getActiveLang()] || ADMIN_TEXT.tr;
  return pack[key] || ADMIN_TEXT.tr[key] || key;
};

const askAdmin = (key) => window.confirm(adminText(key));

const setStatus = (target, key, kind = "") => {
  const el = typeof target === "string" ? qs(target) : target;
  if (!el) return;
  el.textContent = adminText(key);
  el.classList.remove("is-ok", "is-warn", "is-error");
  if (kind) el.classList.add(`is-${kind}`);
};

const showMessage = (key, kind = "") => setStatus(feedback, key, kind);
const showSettingsMessage = (key, kind = "") => setStatus(settingsFeedback, key, kind);
const setNote = (id, key, kind = "") => setStatus(id, key, kind);

const productFormHasContent = () =>
  Boolean(
    fieldValue("product-name-tr") ||
      fieldValue("product-desc-tr") ||
      fieldValue("product-price") ||
      qs("product-id")?.value
  );

const initLanguageTabs = () => {
  document.querySelectorAll(".admin-lang-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const group = tab.dataset.tabGroup;
      const lang = tab.dataset.lang;
      if (!group || !lang) return;
      activateLangTab(group, lang);
    });
  });
  ["product", "settings", "brand", "event", "blog", "menucat", "seo", "gallery", "faq", "page"].forEach((group) =>
    activateLangTab(group, "tr")
  );
};

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = qs("product-id").value || `p_${Date.now()}`;
    const payload = {
      id,
      name: fromLangFields("product-name", PRODUCT_LIMITS.name),
      description: fromLangFields("product-desc", PRODUCT_LIMITS.description),
      tag: fromLangFields("product-tag", PRODUCT_LIMITS.tag),
      image: fromImageFields("product-image", DEFAULT_PRODUCT_IMAGE),
      price: (() => {
        const rawPrice = Number(qs("product-price").value);
        return Number.isFinite(rawPrice) ? Math.max(1, Math.min(100000, Math.round(rawPrice))) : 0;
      })(),
      category: qs("product-category")?.value || "sweet",
      signature: Boolean(qs("product-signature")?.checked),
      visible: qs("product-visible") ? Boolean(qs("product-visible").checked) : true,
      stock: qs("product-stock")?.value === "" ? null : Number(qs("product-stock").value),
      sortOrder: (() => {
        const existing = products.find((item) => item.id === id);
        return existing ? existing.sortOrder : products.length + 1;
      })()
    };

    if (!payload.name.tr) {
      showMessage("needProductName", "error");
      return;
    }
    if (!payload.description.tr) {
      showMessage("needProductDesc", "error");
      return;
    }
    if (!payload.price) {
      showMessage("needProductPrice", "error");
      return;
    }
    if (!askAdmin("confirmSaveProduct")) return;

    const idx = products.findIndex((item) => item.id === id);
    if (idx >= 0) {
      products[idx] = Store.normalizeProduct(payload);
      showMessage("productUpdated", "ok");
    } else {
      products.push(Store.normalizeProduct(payload));
      showMessage("productAdded", "ok");
    }
    if (!tryStore(() => saveProducts())) {
      showMessage("storageQuota", "error");
      return;
    }
    clearForm();
    renderTable();
    renderDashboard();
  });
}

if (tableBody) {
  tableBody.addEventListener("click", (event) => {
    const button = actionButton(event, "data-action");
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (!action || !id) return;
    const item = products.find((product) => String(product.id) === String(id));
    if (!item) return;

    if (action === "edit") {
      qs("product-id").value = item.id;
      const itemName = normalizeLocalized(item.name);
      const itemDescription = normalizeLocalized(item.description);
      const itemTag = normalizeLocalized(item.tag);
      const itemImage = normalizeLocalized(item.image, DEFAULT_PRODUCT_IMAGE);
      LANGS.forEach((lang) => {
        setIf(`product-name-${lang}`, itemName[lang] || "");
        setIf(`product-desc-${lang}`, itemDescription[lang] || "");
        setIf(`product-tag-${lang}`, itemTag[lang] || "");
        setIf(`product-image-${lang}`, itemImage[lang] || (lang === "tr" ? DEFAULT_PRODUCT_IMAGE : ""));
      });
      LANGS.forEach((lang) => syncImageFields(`product-image-${lang}`));
      qs("product-price").value = item.price;
      fillCategorySelect(item.category);
      if (qs("product-visible")) qs("product-visible").checked = item.visible !== false;
      if (qs("product-stock")) qs("product-stock").value = item.stock == null ? "" : String(item.stock);
      if (qs("product-signature")) qs("product-signature").checked = Boolean(item.signature);
      showMessage("productLoaded", "warn");
      revealEditor("panel-products", "product");
      qs("product-name-tr")?.focus();
    }

    if (action === "up" || action === "down") {
      const ordered = [...products].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
      const idx = ordered.findIndex((product) => String(product.id) === String(id));
      const swapWith = action === "up" ? idx - 1 : idx + 1;
      if (idx < 0 || swapWith < 0 || swapWith >= ordered.length) return;
      const currentOrder = Number(ordered[idx].sortOrder || idx + 1);
      ordered[idx].sortOrder = Number(ordered[swapWith].sortOrder || swapWith + 1);
      ordered[swapWith].sortOrder = currentOrder;
      products = ordered;
      saveProducts();
      renderTable();
      return;
    }

    if (action === "duplicate") {
      if (!askAdmin("confirmDuplicateProduct")) return;
      const copy = {
        ...item,
        id: `p_${Date.now()}`,
        name: { ...normalizeLocalized(item.name), tr: `${normalizeLocalized(item.name).tr} (Kopya)` }
      };
      products.unshift(Store.normalizeProduct(copy));
      saveProducts();
      renderTable();
      renderDashboard();
      showMessage("productDuplicated", "ok");
    }

    if (action === "delete") {
      if (!askAdmin("confirmDeleteProduct")) return;
      products = products.filter((product) => String(product.id) !== String(id));
      saveProducts();
      renderTable();
      renderDashboard();
      showMessage("productDeleted", "warn");
    }
  });
}

qs("clear-form")?.addEventListener("click", () => {
  if (productFormHasContent() && !askAdmin("confirmClearForm")) return;
  clearForm();
  showMessage("formCleared", "warn");
});

qs("reset-defaults")?.addEventListener("click", () => {
  if (!askAdmin("confirmResetDefaults")) return;
  products = Store.DEFAULT_PRODUCTS.map(Store.normalizeProduct);
  saveProducts();
  renderTable();
  renderDashboard();
  clearForm();
  showMessage("defaultsRestored", "warn");
});

const fillSettingsForm = () => {
  qs("setting-phone-display").value = settings.phoneDisplay;
  qs("setting-phone-tel").value = settings.phoneTel;
  qs("setting-whatsapp-display").value = settings.whatsappDisplay;
  qs("setting-whatsapp-number").value = settings.whatsappNumber;
  qs("setting-email").value = settings.email;
  if (qs("setting-instagram")) qs("setting-instagram").value = settings.instagram || "";
  if (qs("setting-facebook")) qs("setting-facebook").value = settings.facebook || "";
  if (qs("setting-tiktok")) qs("setting-tiktok").value = settings.tiktok || "";
  if (qs("setting-youtube")) qs("setting-youtube").value = settings.youtube || "";
  if (qs("setting-twitter")) qs("setting-twitter").value = settings.twitter || "";
  if (qs("setting-map-embed")) qs("setting-map-embed").value = settings.mapEmbed || "";
  if (qs("setting-form-webhook")) qs("setting-form-webhook").value = settings.formWebhook || "";
  if (qs("setting-opening-spec")) qs("setting-opening-spec").value = settings.openingHoursSpec || "";
  LANGS.forEach((lang) => {
    setIf(`setting-address-${lang}`, settings.address[lang] || "");
    setIf(`setting-map-query-${lang}`, settings.mapQuery[lang] || "");
    setIf(`setting-hours-${lang}`, settings.workingHours[lang] || "");
    setIf(`setting-wa-${lang}`, settings.whatsappGreeting[lang] || "");
  });
  syncLangPlaceholders();
};

if (settingsForm) {
  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const address = fromLangFields("setting-address", SETTINGS_LIMITS.address);
    const mapQuery = fromLangFields("setting-map-query", SETTINGS_LIMITS.mapQuery, address.tr);
    settings = Store.normalizeSettings({
      ...settings,
      phoneDisplay: clampText(qs("setting-phone-display").value, SETTINGS_LIMITS.phone),
      phoneTel: clampText(qs("setting-phone-tel").value, SETTINGS_LIMITS.phone),
      whatsappDisplay: clampText(qs("setting-whatsapp-display").value, SETTINGS_LIMITS.phone),
      whatsappNumber: clampText(qs("setting-whatsapp-number").value, SETTINGS_LIMITS.phone),
      email: clampText(qs("setting-email").value, SETTINGS_LIMITS.email),
      instagram: clampText(qs("setting-instagram")?.value || "", SETTINGS_LIMITS.url),
      facebook: clampText(qs("setting-facebook")?.value || "", SETTINGS_LIMITS.url),
      tiktok: clampText(qs("setting-tiktok")?.value || "", SETTINGS_LIMITS.url),
      youtube: clampText(qs("setting-youtube")?.value || "", SETTINGS_LIMITS.url),
      twitter: clampText(qs("setting-twitter")?.value || "", SETTINGS_LIMITS.url),
      mapEmbed: clampText(qs("setting-map-embed")?.value || "", 900),
      formWebhook: clampText(qs("setting-form-webhook")?.value || "", SETTINGS_LIMITS.url),
      openingHoursSpec: clampText(qs("setting-opening-spec")?.value || "", 80),
      address,
      mapQuery,
      workingHours: fromLangFields("setting-hours", SETTINGS_LIMITS.hours),
      whatsappGreeting: fromLangFields("setting-wa", SETTINGS_LIMITS.greeting)
    });

    if (
      !settings.phoneDisplay ||
      !settings.phoneTel ||
      !settings.whatsappDisplay ||
      !settings.whatsappNumber ||
      !settings.email ||
      !settings.address.tr
    ) {
      showSettingsMessage("needContactFields", "error");
      return;
    }
    if (!askAdmin("confirmSaveSettings")) return;

    persistSettings();
    showSettingsMessage("settingsSaved", "ok");
  });
}

qs("reset-settings")?.addEventListener("click", () => {
  if (!askAdmin("confirmResetSettings")) return;
  const current = settings;
  settings = Store.normalizeSettings({
    ...Store.DEFAULT_SETTINGS,
    heroStats: current.heroStats,
    navLinks: current.navLinks,
    seo: current.seo,
    logo: current.logo,
    heroImage: current.heroImage,
    brandName: current.brandName,
    brandTagline: current.brandTagline,
    footerText: current.footerText
  });
  persistSettings();
  fillSettingsForm();
  showSettingsMessage("settingsReset", "warn");
});

const fillBrandForm = () => {
  if (!qs("brand-form")) return;
  qs("brand-name").value = settings.brandName || "";
  qs("brand-logo").value = settings.logo || "";
  qs("brand-hero-image").value = settings.heroImage || "";
  if (qs("brand-og-image")) qs("brand-og-image").value = settings.ogImage || "";
  if (qs("brand-marquee")) {
    qs("brand-marquee").value = (settings.flavorMarquee || []).map((item) => item.tr || "").filter(Boolean).join(", ");
  }
  qs("brand-cta-href").value = settings.ctaHref || "";
  qs("stat-years").value = settings.heroStats.years;
  qs("stat-recipes").value = settings.heroStats.recipes;
  qs("stat-daily").value = settings.heroStats.daily;
  LANGS.forEach((lang) => {
    setIf(`brand-tagline-${lang}`, settings.brandTagline[lang] || "");
    setIf(`brand-footer-${lang}`, settings.footerText[lang] || "");
    setIf(`brand-cta-${lang}`, settings.ctaLabel[lang] || "");
    setIf(`stat-years-label-${lang}`, settings.heroStats.yearsLabel[lang] || "");
    setIf(`stat-recipes-label-${lang}`, settings.heroStats.recipesLabel[lang] || "");
    setIf(`stat-daily-label-${lang}`, settings.heroStats.dailyLabel[lang] || "");
  });
  syncImageFields("brand-logo", "brand-hero-image", "brand-og-image");
  syncLangPlaceholders();
};

qs("brand-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!clampText(qs("brand-name").value, 80)) {
    setNote("brand-feedback", "needBrandName", "error");
    return;
  }
  if (!askAdmin("confirmSaveBrand")) return;
  settings = Store.normalizeSettings({
    ...settings,
    brandName: clampText(qs("brand-name").value, 80),
    logo: clampSrc(qs("brand-logo").value) || DEFAULT_PRODUCT_IMAGE,
    heroImage: clampSrc(qs("brand-hero-image").value),
    ogImage: clampSrc(qs("brand-og-image")?.value || "") || "assets/og-share.jpg",
    flavorMarquee: String(qs("brand-marquee")?.value || "")
      .split(",")
      .map((part) => clampText(part, 80))
      .filter(Boolean)
      .map((text) => toLocalized(text)),
    ctaHref: clampText(qs("brand-cta-href").value, 180) || "reservation.html",
    brandTagline: fromLangFields("brand-tagline", 80),
    footerText: fromLangFields("brand-footer", 320),
    ctaLabel: fromLangFields("brand-cta", 40),
    heroStats: {
      years: Number(qs("stat-years").value || 0),
      recipes: Number(qs("stat-recipes").value || 0),
      daily: Number(qs("stat-daily").value || 0),
      yearsLabel: fromLangFields("stat-years-label", 40),
      recipesLabel: fromLangFields("stat-recipes-label", 40),
      dailyLabel: fromLangFields("stat-daily-label", 40)
    }
  });
  if (!tryStore(() => persistSettings())) {
    setNote("brand-feedback", "storageQuota", "error");
    return;
  }
  setNote("brand-feedback", "brandSaved", "ok");
});

const renderNavRows = () => {
  const host = qs("nav-rows");
  if (!host) return;
  host.innerHTML = settings.navLinks
    .map(
      (item, index) => `
      <article class="admin-nav-row" data-index="${index}">
        <label class="admin-check"><input type="checkbox" data-nav-field="visible" ${item.visible ? "checked" : ""} /> Görünür</label>
        <input data-nav-field="href" type="text" value="${escapeHtml(item.href)}" placeholder="index.html" />
        <input data-nav-field="tr" type="text" value="${escapeHtml(item.label.tr)}" placeholder="TR etiket" />
        <input data-nav-field="en" type="text" value="${escapeHtml(item.label.en)}" placeholder="EN etiket" />
        <input data-nav-field="ru" type="text" value="${escapeHtml(item.label.ru)}" placeholder="RU etiket" />
        <input data-nav-field="ar" type="text" value="${escapeHtml(item.label.ar || "")}" placeholder="AR etiket" dir="rtl" />
        <input data-nav-field="de" type="text" value="${escapeHtml(item.label.de || "")}" placeholder="DE etiket" />
        <button class="admin-link-btn danger" type="button" data-nav-remove="${index}">Sil</button>
      </article>`
    )
    .join("");
};

const collectNavRows = () =>
  [...document.querySelectorAll(".admin-nav-row")].map((row, index) => ({
    id: settings.navLinks[index]?.id || `nav_${Date.now()}_${index}`,
    visible: Boolean(row.querySelector('[data-nav-field="visible"]')?.checked),
    href: row.querySelector('[data-nav-field="href"]')?.value || "index.html",
    label: toLocalized(
      row.querySelector('[data-nav-field="tr"]')?.value || "",
      row.querySelector('[data-nav-field="en"]')?.value || "",
      row.querySelector('[data-nav-field="ru"]')?.value || "",
      row.querySelector('[data-nav-field="ar"]')?.value || "",
      row.querySelector('[data-nav-field="de"]')?.value || ""
    )
  }));

qs("nav-rows")?.addEventListener("click", (event) => {
  const button = actionButton(event, "data-nav-remove");
  if (!button) return;
  if (!askAdmin("confirmDeleteNav")) return;
  settings.navLinks = collectNavRows().filter((_, index) => index !== Number(button.dataset.navRemove));
  renderNavRows();
});

qs("nav-add-row")?.addEventListener("click", () => {
  settings.navLinks = [
    ...collectNavRows(),
    { id: `nav_${Date.now()}`, href: "index.html", label: toLocalized("Yeni Link"), visible: true }
  ];
  renderNavRows();
});

qs("nav-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const rows = collectNavRows();
  if (!rows.some((row) => String(row.label?.tr || "").trim())) {
    setNote("nav-feedback", "needNavLabel", "error");
    return;
  }
  if (!askAdmin("confirmSaveNav")) return;
  settings = Store.normalizeSettings({ ...settings, navLinks: rows });
  persistSettings();
  renderNavRows();
  setNote("nav-feedback", "navSaved", "ok");
});

qs("nav-reset")?.addEventListener("click", () => {
  if (!askAdmin("confirmResetNav")) return;
  settings.navLinks = Store.DEFAULT_NAV.map((item) => ({ ...item, label: { ...item.label } }));
  persistSettings();
  renderNavRows();
  setNote("nav-feedback", "navReset", "warn");
});

const renderGalleryFilterChecks = (selected = []) => {
  const host = qs("gallery-filter-checks");
  if (!host) return;
  host.innerHTML = galleryFilters
    .map(
      (filter) => `
      <label class="admin-check">
        <input type="checkbox" data-gallery-filter="${escapeHtml(filter.id)}" ${
        selected.includes(filter.id) ? "checked" : ""
      } /> ${escapeHtml(localizedWithFallback(filter.label, "tr"))}
      </label>`
    )
    .join("");
};

const selectedGalleryFilters = () =>
  [...document.querySelectorAll("[data-gallery-filter]:checked")].map((el) => el.getAttribute("data-gallery-filter"));

const renderGalleryTable = () => {
  const body = qs("gallery-body");
  if (!body) return;
  body.innerHTML = gallery
    .map(
      (item) => `
      <tr>
        <td><img class="admin-table-thumb" src="${escapeHtml(item.src)}" alt="" /></td>
        <td>${escapeHtml(item.categories.join(", "))}</td>
        <td>
          <button class="admin-link-btn" type="button" data-gallery-action="edit" data-id="${item.id}">Düzenle</button>
          <button class="admin-link-btn danger" type="button" data-gallery-action="delete" data-id="${item.id}">Sil</button>
        </td>
      </tr>`
    )
    .join("");
};

const clearGalleryForm = () => {
  qs("gallery-id").value = "";
  qs("gallery-src").value = "";
  LANGS.forEach((lang) => setIf(`gallery-alt-${lang}`, ""));
  renderGalleryFilterChecks([]);
  syncImageFields("gallery-src");
  syncLangPlaceholders();
};

qs("gallery-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = selectedGalleryFilters();
  const payload = {
    id: qs("gallery-id").value || `g_${Date.now()}`,
    src: clampSrc(qs("gallery-src").value),
    alt: fromLangFields("gallery-alt", 120),
    categories: selected.length ? selected : galleryFilters[0] ? [galleryFilters[0].id] : ["tatli"]
  };
  if (!payload.src) {
    setNote("gallery-feedback", "needGallerySrc", "error");
    return;
  }
  if (!askAdmin("confirmSaveGallery")) return;
  const idx = gallery.findIndex((item) => item.id === payload.id);
  if (idx >= 0) gallery[idx] = payload;
  else gallery.push(payload);
  if (!tryStore(() => Store.saveGallery(gallery))) {
    setNote("gallery-feedback", "storageQuota", "error");
    return;
  }
  renderGalleryTable();
  clearGalleryForm();
  setNote("gallery-feedback", "gallerySaved", "ok");
});

qs("gallery-filter-add")?.addEventListener("click", () => {
  const id = Store.slugify(qs("gallery-filter-new-id")?.value || qs("gallery-filter-new-label")?.value);
  const label = clampText(qs("gallery-filter-new-label")?.value, 40);
  if (!id || !label) {
    setNote("gallery-feedback", "needGallerySrc", "error");
    return;
  }
  if (!galleryFilters.some((item) => item.id === id)) {
    galleryFilters.push({ id, label: toLocalized(label) });
    Store.saveGalleryFilters(galleryFilters);
  }
  setIf("gallery-filter-new-id", "");
  setIf("gallery-filter-new-label", "");
  renderGalleryFilterChecks(selectedGalleryFilters());
  setNote("gallery-feedback", "gallerySaved", "ok");
});

qs("gallery-clear")?.addEventListener("click", clearGalleryForm);

qs("gallery-body")?.addEventListener("click", (event) => {
  const button = actionButton(event, "data-gallery-action");
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.galleryAction;
  if (!id || !action) return;
  const item = gallery.find((entry) => String(entry.id) === String(id));
  if (!item) return;
  if (action === "edit") {
    qs("gallery-id").value = item.id;
    qs("gallery-src").value = item.src;
    const alt = normalizeLocalized(item.alt);
    LANGS.forEach((lang) => setIf(`gallery-alt-${lang}`, alt[lang] || ""));
    syncImageFields("gallery-src");
    renderGalleryFilterChecks(item.categories || []);
    syncLangPlaceholders();
    setNote("gallery-feedback", "galleryLoaded", "warn");
    revealEditor("panel-gallery");
  }
  if (action === "delete") {
    if (!askAdmin("confirmDeleteGallery")) return;
    gallery = gallery.filter((entry) => String(entry.id) !== String(id));
    Store.saveGallery(gallery);
    renderGalleryTable();
    setNote("gallery-feedback", "galleryDeleted", "warn");
  }
});

const renderEventsTable = () => {
  const body = qs("events-body");
  if (!body) return;
  body.innerHTML = events
    .map(
      (item) => `
      <tr>
        <td>${item.image ? `<img class="admin-table-thumb" src="${escapeHtml(item.image)}" alt="" />` : "-"}</td>
        <td>${escapeHtml(item.title.tr)}</td>
        <td>${escapeHtml([item.date, item.time].filter(Boolean).join(" ") || "-")}</td>
        <td>
          <button class="admin-link-btn" type="button" data-event-action="edit" data-id="${item.id}">Düzenle</button>
          <button class="admin-link-btn danger" type="button" data-event-action="delete" data-id="${item.id}">Sil</button>
        </td>
      </tr>`
    )
    .join("");
};

const clearEventForm = () => {
  qs("event-id").value = "";
  if (qs("event-image")) qs("event-image").value = "";
  LANGS.forEach((lang) => {
    setIf(`event-title-${lang}`, "");
    setIf(`event-desc-${lang}`, "");
    setIf(`event-location-${lang}`, "");
  });
  if (qs("event-date")) qs("event-date").value = "";
  if (qs("event-time")) qs("event-time").value = "";
  syncLangPlaceholders();
  syncImageFields("event-image");
};

qs("event-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = {
    id: qs("event-id").value || `e_${Date.now()}`,
    title: fromLangFields("event-title", 80),
    description: fromLangAreas("event-desc", 220),
    image: clampSrc(qs("event-image")?.value || ""),
    date: qs("event-date")?.value || "",
    time: qs("event-time")?.value || "",
    location: fromLangFields("event-location", 120)
  };
  if (!payload.title.tr || !payload.description.tr) {
    setNote("event-feedback", "needEventFields", "error");
    return;
  }
  if (!askAdmin("confirmSaveEvent")) return;
  const idx = events.findIndex((item) => item.id === payload.id);
  if (idx >= 0) events[idx] = payload;
  else events.push(payload);
  Store.saveEvents(events);
  renderEventsTable();
  clearEventForm();
  setNote("event-feedback", "eventSaved", "ok");
});

qs("event-clear")?.addEventListener("click", clearEventForm);

qs("events-body")?.addEventListener("click", (event) => {
  const button = actionButton(event, "data-event-action");
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.eventAction;
  const item = events.find((entry) => String(entry.id) === String(id));
  if (!item || !action) return;
  if (action === "edit") {
    const title = normalizeLocalized(item.title);
    const description = normalizeLocalized(item.description);
    qs("event-id").value = item.id;
    if (qs("event-image")) qs("event-image").value = item.image || "";
    LANGS.forEach((lang) => {
      setIf(`event-title-${lang}`, title[lang] || "");
      setIf(`event-desc-${lang}`, description[lang] || "");
      setIf(`event-location-${lang}`, normalizeLocalized(item.location)[lang] || "");
    });
    if (qs("event-date")) qs("event-date").value = item.date || "";
    if (qs("event-time")) qs("event-time").value = item.time || "";
    syncLangPlaceholders();
    syncImageFields("event-image");
    setNote("event-feedback", "eventLoaded", "warn");
    revealEditor("panel-events", "event");
  }
  if (action === "delete") {
    if (!askAdmin("confirmDeleteEvent")) return;
    events = events.filter((entry) => String(entry.id) !== String(id));
    Store.saveEvents(events);
    renderEventsTable();
    setNote("event-feedback", "eventDeleted", "warn");
  }
});

const renderBlogTable = () => {
  const body = qs("blog-body-table");
  if (!body) return;
  body.innerHTML = posts
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(localizedWithFallback(item.title, "tr"))}</td>
        <td>${item.published === false ? "Taslak" : "Yayında"}</td>
        <td>${escapeHtml(item.href)}</td>
        <td>
          <button class="admin-link-btn" type="button" data-blog-action="edit" data-id="${item.id}">Düzenle</button>
          <button class="admin-link-btn danger" type="button" data-blog-action="delete" data-id="${item.id}">Sil</button>
        </td>
      </tr>`
    )
    .join("");
};

const clearBlogForm = () => {
  qs("blog-id").value = "";
  qs("blog-image").value = "";
  if (qs("blog-slug")) qs("blog-slug").value = "";
  if (qs("blog-date")) qs("blog-date").value = "";
  if (qs("blog-published")) qs("blog-published").checked = true;
  LANGS.forEach((lang) => {
    setIf(`blog-tag-${lang}`, "");
    setIf(`blog-title-${lang}`, "");
    setIf(`blog-excerpt-${lang}`, "");
    setIf(`blog-body-${lang}`, "");
  });
  syncLangPlaceholders();
  syncImageFields("blog-image");
};

qs("blog-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const existingId = qs("blog-id").value;
  const title = fromLangFields("blog-title", 120);
  const slug = Store.slugify(qs("blog-slug")?.value || title.tr);
  const payload = {
    id: existingId || slug,
    image: clampSrc(qs("blog-image").value) || DEFAULT_PRODUCT_IMAGE,
    tag: fromLangFields("blog-tag", 40),
    title,
    excerpt: fromLangFields("blog-excerpt", 280),
    body: fromLangAreas("blog-body", 8000),
    published: qs("blog-published") ? Boolean(qs("blog-published").checked) : true,
    publishedAt: qs("blog-date")?.value || ""
  };
  if (!payload.title.tr || !payload.body.tr) {
    setNote("blog-feedback", "needBlogFields", "error");
    return;
  }
  if (!askAdmin("confirmSaveBlog")) return;
  const reservedHref = {
    "imza-kruvasan": "blog-imza-kruvasan.html",
    "kahve-eslesmesi": "blog-kahve-eslesmesi.html"
  };
  const idx = posts.findIndex((item) => item.id === payload.id);
  const href = idx >= 0 ? posts[idx].href : reservedHref[payload.id] || `blog-post.html?id=${payload.id}`;
  const record = { ...payload, href };
  if (idx >= 0) posts[idx] = record;
  else posts.push(record);
  if (!tryStore(() => Store.saveBlog(posts))) {
    setNote("blog-feedback", "storageQuota", "error");
    return;
  }
  posts = Store.loadBlog();
  renderBlogTable();
  clearBlogForm();
  setNote("blog-feedback", "blogSaved", "ok");
});

qs("blog-clear")?.addEventListener("click", clearBlogForm);

qs("blog-body-table")?.addEventListener("click", (event) => {
  const button = actionButton(event, "data-blog-action");
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.blogAction;
  const item = posts.find((entry) => String(entry.id) === String(id));
  if (!item || !action) return;
  if (action === "edit") {
    qs("blog-id").value = item.id;
    qs("blog-image").value = item.image || "";
    if (qs("blog-slug")) qs("blog-slug").value = item.id || "";
    if (qs("blog-date")) qs("blog-date").value = item.publishedAt || "";
    if (qs("blog-published")) qs("blog-published").checked = item.published !== false;
    syncImageFields("blog-image");
    const tag = normalizeLocalized(item.tag);
    const title = normalizeLocalized(item.title);
    const excerpt = normalizeLocalized(item.excerpt);
    const body = normalizeLocalized(item.body);
    LANGS.forEach((lang) => {
      setIf(`blog-tag-${lang}`, tag[lang] || "");
      setIf(`blog-title-${lang}`, title[lang] || "");
      setIf(`blog-excerpt-${lang}`, excerpt[lang] || "");
      setIf(`blog-body-${lang}`, body[lang] || "");
    });
    syncLangPlaceholders();
    setNote("blog-feedback", "blogLoaded", "warn");
    revealEditor("panel-blog", "blog");
  }
  if (action === "delete") {
    if (!askAdmin("confirmDeleteBlog")) return;
    posts = posts.filter((entry) => String(entry.id) !== String(id));
    Store.saveBlog(posts);
    renderBlogTable();
    setNote("blog-feedback", "blogDeleted", "warn");
  }
});

const fillMenuCatForm = () => {
  const host = qs("menucat-rows");
  if (!host) return;
  host.innerHTML = menuCats
    .map(
      (cat, index) => `
      <article class="admin-nav-row admin-cat-row" data-index="${index}">
        <input data-cat-field="id" type="text" value="${escapeHtml(cat.id)}" placeholder="kod" ${
        cat.id === "signature" ? "readonly" : ""
      } />
        <select data-cat-field="kind">
          <option value="standard" ${cat.kind !== "signature" ? "selected" : ""}>Standart</option>
          <option value="signature" ${cat.kind === "signature" ? "selected" : ""}>İmza grubu</option>
        </select>
        <input data-cat-field="tr" type="text" value="${escapeHtml(cat.title.tr || "")}" placeholder="TR başlık" />
        <input data-cat-field="en" type="text" value="${escapeHtml(cat.title.en || "")}" placeholder="EN" />
        <input data-cat-field="note-tr" type="text" value="${escapeHtml(cat.note.tr || "")}" placeholder="TR not" />
        <button class="admin-link-btn danger" type="button" data-cat-remove="${index}">Sil</button>
      </article>`
    )
    .join("");
};

const collectMenuCats = () =>
  [...document.querySelectorAll(".admin-cat-row")].map((row, index) => {
    const prev = menuCats[index] || { title: toLocalized(""), note: toLocalized("") };
    const prevTitle = normalizeLocalized(prev.title);
    const prevNote = normalizeLocalized(prev.note);
    return {
      id: row.querySelector('[data-cat-field="id"]')?.value || prev.id || `cat_${index}`,
      kind: row.querySelector('[data-cat-field="kind"]')?.value || "standard",
      title: toLocalized(
        row.querySelector('[data-cat-field="tr"]')?.value || prevTitle.tr,
        row.querySelector('[data-cat-field="en"]')?.value || prevTitle.en,
        prevTitle.ru,
        prevTitle.ar,
        prevTitle.de
      ),
      note: toLocalized(
        row.querySelector('[data-cat-field="note-tr"]')?.value || prevNote.tr,
        prevNote.en,
        prevNote.ru,
        prevNote.ar,
        prevNote.de
      )
    };
  });

qs("menucat-rows")?.addEventListener("click", (event) => {
  const button = actionButton(event, "data-cat-remove");
  if (!button) return;
  if (!askAdmin("confirmSaveMenuCats")) return;
  menuCats = collectMenuCats().filter((_, index) => index !== Number(button.dataset.catRemove));
  if (!menuCats.length) menuCats = Store.DEFAULT_MENU_CATS.map((item) => ({ ...item }));
  fillMenuCatForm();
  fillCategorySelect();
});

qs("menucat-add")?.addEventListener("click", () => {
  menuCats = [
    ...collectMenuCats(),
    { id: `cat_${Date.now()}`, kind: "standard", title: toLocalized("Yeni kategori"), note: toLocalized("") }
  ];
  fillMenuCatForm();
});

qs("menucat-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!askAdmin("confirmSaveMenuCats")) return;
  menuCats = collectMenuCats().filter((cat) => String(cat.title?.tr || "").trim());
  if (!menuCats.length) {
    setNote("menucat-feedback", "needNavLabel", "error");
    return;
  }
  Store.saveMenuCats(menuCats);
  menuCats = Store.loadMenuCats();
  fillMenuCatForm();
  fillCategorySelect();
  setNote("menucat-feedback", "menuCatsSaved", "ok");
});

const SEO_PAGES = [
  ["index.html", "Anasayfa"],
  ["hikayemiz.html", "Hikayemiz"],
  ["lezzetler.html", "Lezzetler"],
  ["menu.html", "Menü"],
  ["blog.html", "Blog"],
  ["blog-imza-kruvasan.html", "Blog: İmza Kruvasan"],
  ["blog-kahve-eslesmesi.html", "Blog: Kahve Eşleşmesi"],
  ["blog-post.html", "Yeni blog yazısı"],
  ["events.html", "Etkinlikler"],
  ["corporate.html", "Kurumsal"],
  ["faq.html", "SSS"],
  ["reservation.html", "Rezervasyon"],
  ["delivery.html", "Teslimat"],
  ["wholesale.html", "Toptan"],
  ["privacy.html", "Gizlilik"],
  ["terms.html", "Kullanım Şartları"],
  ["cookies.html", "Çerez Politikası"]
];

const fillSeoForm = (page = qs("seo-page")?.value || "index.html") => {
  if (!qs("seo-form")) return;
  const entry = settings.seo[page] || Store.DEFAULT_SEO[page] || { title: toLocalized(""), description: toLocalized("") };
  LANGS.forEach((lang) => {
    setIf(`seo-title-${lang}`, entry.title[lang] || "");
    setIf(`seo-desc-${lang}`, entry.description[lang] || "");
  });
  qs("schema-street").value = settings.schemaStreet || "";
  qs("schema-locality").value = settings.schemaLocality || "";
  qs("schema-region").value = settings.schemaRegion || "";
  qs("schema-postal").value = settings.schemaPostal || "";
  syncLangPlaceholders();
};

const initSeoSelect = () => {
  const select = qs("seo-page");
  if (!select) return;
  select.innerHTML = SEO_PAGES.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  select.addEventListener("change", () => fillSeoForm(select.value));
};

qs("seo-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const page = qs("seo-page").value;
  const title = fromLangFields("seo-title", 120);
  if (!title.tr) {
    setNote("seo-feedback", "needSeoTitle", "error");
    return;
  }
  if (!askAdmin("confirmSaveSeo")) return;
  settings = Store.normalizeSettings({
    ...settings,
    schemaStreet: clampText(qs("schema-street").value, 180),
    schemaLocality: clampText(qs("schema-locality").value, 80),
    schemaRegion: clampText(qs("schema-region").value, 80),
    schemaPostal: clampText(qs("schema-postal").value, 16),
    seo: {
      ...settings.seo,
      [page]: {
        title,
        description: fromLangFields("seo-desc", 220)
      }
    }
  });
  persistSettings();
  setNote("seo-feedback", "seoSaved", "ok");
});

if (productSearch) {
  productSearch.addEventListener("input", () => {
    productFilters.search = productSearch.value || "";
    renderTable();
  });
}
if (productSort) {
  productSort.addEventListener("change", () => {
    productFilters.sort = productSort.value || "created-desc";
    renderTable();
  });
}
if (productLangFilter) {
  productLangFilter.addEventListener("change", () => {
    productFilters.lang = productLangFilter.value || "tr";
    renderTable();
  });
}
if (productResetFiltersBtn) {
  productResetFiltersBtn.addEventListener("click", () => {
    productFilters = { search: "", sort: "order-asc", lang: "tr" };
    if (productSearch) productSearch.value = "";
    if (productSort) productSort.value = "order-asc";
    if (productLangFilter) productLangFilter.value = "tr";
    renderTable();
  });
}
if (exportProductsBtn) {
  exportProductsBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `point-croissant-products-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showMessage("exportOk", "ok");
  });
}
if (importProductsBtn && importProductsInput) {
  importProductsBtn.addEventListener("click", () => importProductsInput.click());
  importProductsInput.addEventListener("change", async () => {
    const file = importProductsInput.files?.[0];
    if (!file) return;
    if (!askAdmin("confirmImportJson")) {
      importProductsInput.value = "";
      return;
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed) || !parsed.length) {
        showMessage("importInvalid", "error");
        return;
      }
      products = parsed.map(Store.normalizeProduct);
      saveProducts();
      renderTable();
      renderDashboard();
      showMessage("importOk", "ok");
    } catch {
      showMessage("importUnreadable", "error");
    } finally {
      importProductsInput.value = "";
    }
  });
}

const footerGroups = ["explore", "services", "legal"];
const renderFooterGroup = (group) => {
  const host = qs(`footer-rows-${group}`);
  if (!host) return;
  const rows = settings.footerLinks?.[group] || [];
  host.innerHTML = rows
    .map(
      (item, index) => `
      <article class="admin-nav-row" data-footer-group="${group}" data-index="${index}">
        <label class="admin-check"><input type="checkbox" data-foot-field="visible" ${item.visible ? "checked" : ""} /> Görünür</label>
        <input data-foot-field="href" type="text" value="${escapeHtml(item.href)}" />
        <input data-foot-field="tr" type="text" value="${escapeHtml(item.label.tr || "")}" placeholder="TR" />
        <input data-foot-field="en" type="text" value="${escapeHtml(item.label.en || "")}" placeholder="EN" />
        <button class="admin-link-btn danger" type="button" data-footer-remove="${group}:${index}">Sil</button>
      </article>`
    )
    .join("");
};
const renderFooterRows = () => footerGroups.forEach(renderFooterGroup);
const collectFooterGroup = (group) =>
  [...document.querySelectorAll(`[data-footer-group="${group}"]`)].map((row, index) => ({
    id: settings.footerLinks?.[group]?.[index]?.id || `fl_${group}_${index}`,
    visible: Boolean(row.querySelector('[data-foot-field="visible"]')?.checked),
    href: row.querySelector('[data-foot-field="href"]')?.value || "index.html",
    label: toLocalized(
      row.querySelector('[data-foot-field="tr"]')?.value || "",
      row.querySelector('[data-foot-field="en"]')?.value || ""
    )
  }));
const collectFooterLinks = () => ({
  explore: collectFooterGroup("explore"),
  services: collectFooterGroup("services"),
  legal: collectFooterGroup("legal")
});

document.addEventListener("click", (event) => {
  const addBtn = event.target.closest("[data-footer-add]");
  if (addBtn) {
    const group = addBtn.getAttribute("data-footer-add");
    const current = collectFooterLinks();
    current[group].push({
      id: `fl_${Date.now()}`,
      href: "index.html",
      label: toLocalized("Yeni Link"),
      visible: true
    });
    settings.footerLinks = current;
    renderFooterRows();
  }
  const removeBtn = event.target.closest("[data-footer-remove]");
  if (removeBtn) {
    const [group, index] = String(removeBtn.getAttribute("data-footer-remove") || "").split(":");
    if (!askAdmin("confirmDeleteNav")) return;
    const current = collectFooterLinks();
    current[group] = current[group].filter((_, i) => i !== Number(index));
    settings.footerLinks = current;
    renderFooterRows();
  }
});

qs("footer-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!askAdmin("confirmSaveFooter")) return;
  settings = Store.normalizeSettings({ ...settings, footerLinks: collectFooterLinks() });
  persistSettings();
  renderFooterRows();
  setNote("footer-feedback", "footerSaved", "ok");
});

qs("footer-reset")?.addEventListener("click", () => {
  if (!askAdmin("confirmResetFooter")) return;
  settings = Store.normalizeSettings({
    ...settings,
    footerLinks: JSON.parse(JSON.stringify(Store.DEFAULT_FOOTER))
  });
  persistSettings();
  renderFooterRows();
  setNote("footer-feedback", "footerReset", "warn");
});

const renderFaqTable = () => {
  const body = qs("faq-body");
  if (!body) return;
  body.innerHTML = faqItems
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(item.question.tr)}</td>
        <td>
          <button class="admin-link-btn" type="button" data-faq-action="edit" data-id="${item.id}">Düzenle</button>
          <button class="admin-link-btn danger" type="button" data-faq-action="delete" data-id="${item.id}">Sil</button>
        </td>
      </tr>`
    )
    .join("");
};
const clearFaqForm = () => {
  setIf("faq-id", "");
  LANGS.forEach((lang) => {
    setIf(`faq-q-${lang}`, "");
    setIf(`faq-a-${lang}`, "");
  });
  syncLangPlaceholders();
};
qs("faq-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = {
    id: qs("faq-id").value || `faq_${Date.now()}`,
    question: fromLangFields("faq-q", 180),
    answer: fromLangAreas("faq-a", 800)
  };
  if (!payload.question.tr || !payload.answer.tr) {
    setNote("faq-feedback", "needFaqFields", "error");
    return;
  }
  if (!askAdmin("confirmSaveFaq")) return;
  const idx = faqItems.findIndex((item) => item.id === payload.id);
  if (idx >= 0) faqItems[idx] = payload;
  else faqItems.push(payload);
  Store.saveFaq(faqItems);
  renderFaqTable();
  clearFaqForm();
  setNote("faq-feedback", "faqSaved", "ok");
});
qs("faq-clear")?.addEventListener("click", clearFaqForm);
qs("faq-body")?.addEventListener("click", (event) => {
  const button = actionButton(event, "data-faq-action");
  if (!button) return;
  const item = faqItems.find((entry) => String(entry.id) === String(button.dataset.id));
  if (!item) return;
  if (button.dataset.faqAction === "edit") {
    qs("faq-id").value = item.id;
    const q = normalizeLocalized(item.question);
    const a = normalizeLocalized(item.answer);
    LANGS.forEach((lang) => {
      setIf(`faq-q-${lang}`, q[lang] || "");
      setIf(`faq-a-${lang}`, a[lang] || "");
    });
    syncLangPlaceholders();
    setNote("faq-feedback", "faqLoaded", "warn");
    revealEditor("panel-faq", "faq");
  }
  if (button.dataset.faqAction === "delete") {
    if (!askAdmin("confirmDeleteFaq")) return;
    faqItems = faqItems.filter((entry) => entry.id !== item.id);
    Store.saveFaq(faqItems);
    renderFaqTable();
    setNote("faq-feedback", "faqDeleted", "warn");
  }
});

const PAGE_LABELS = {
  "hikayemiz.html": "Hikayemiz",
  "corporate.html": "Kurumsal",
  "reservation.html": "Rezervasyon",
  "delivery.html": "Teslimat",
  "wholesale.html": "Toptan",
  "faq.html": "SSS",
  "privacy.html": "Gizlilik",
  "terms.html": "Kullanım Şartları",
  "cookies.html": "Çerez Politikası"
};
const fillPageForm = (page = qs("page-select")?.value || "hikayemiz.html") => {
  const entry = pageMap[page] || Store.DEFAULT_PAGES[page] || { eyebrow: toLocalized(""), title: toLocalized(""), lead: toLocalized(""), body: toLocalized("") };
  LANGS.forEach((lang) => {
    setIf(`page-eyebrow-${lang}`, entry.eyebrow?.[lang] || "");
    setIf(`page-title-${lang}`, entry.title?.[lang] || "");
    setIf(`page-lead-${lang}`, entry.lead?.[lang] || "");
    setIf(`page-body-${lang}`, entry.body?.[lang] || "");
  });
  syncLangPlaceholders();
};
const initPageSelect = () => {
  const select = qs("page-select");
  if (!select) return;
  select.innerHTML = (Store.PAGE_IDS || Object.keys(PAGE_LABELS))
    .map((id) => `<option value="${id}">${PAGE_LABELS[id] || id}</option>`)
    .join("");
  select.addEventListener("change", () => fillPageForm(select.value));
};
qs("pages-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const page = qs("page-select").value;
  if (!askAdmin("confirmSavePage")) return;
  pageMap[page] = {
    eyebrow: fromLangFields("page-eyebrow", 40),
    title: fromLangFields("page-title", 120),
    lead: fromLangFields("page-lead", 220),
    body: fromLangAreas("page-body", 12000)
  };
  Store.savePages(pageMap);
  pageMap = Store.loadPages();
  setNote("pages-feedback", "pageSaved", "ok");
});

const renderInbox = () => {
  const body = qs("inbox-body");
  if (!body) return;
  body.innerHTML = inboxItems
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(String(item.createdAt || "").slice(0, 16).replace("T", " "))}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.phone)}<br />${escapeHtml(item.email)}</td>
        <td>${escapeHtml(item.message)}</td>
        <td><button class="admin-link-btn danger" type="button" data-inbox-del="${item.id}">Sil</button></td>
      </tr>`
    )
    .join("") || `<tr><td colspan="5">Henüz mesaj yok.</td></tr>`;
};
qs("inbox-clear")?.addEventListener("click", () => {
  if (!askAdmin("confirmClearInbox")) return;
  inboxItems = [];
  Store.saveInbox(inboxItems);
  renderInbox();
  renderDashboard();
  setNote("inbox-feedback", "inboxCleared", "warn");
});
qs("inbox-body")?.addEventListener("click", (event) => {
  const button = actionButton(event, "data-inbox-del");
  if (!button) return;
  inboxItems = inboxItems.filter((item) => item.id !== button.dataset.inboxDel);
  Store.saveInbox(inboxItems);
  renderInbox();
  renderDashboard();
  setNote("inbox-feedback", "inboxDeleted", "warn");
});

const downloadText = (filename, text, type = "application/json") => {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

qs("backup-export-json")?.addEventListener("click", () => {
  downloadText(
    `point-croissant-yedek-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(Store.exportPack(), null, 2)
  );
  setNote("backup-feedback", "backupExportOk", "ok");
});
qs("backup-publish")?.addEventListener("click", () => {
  const pack = Store.exportPack();
  downloadText("pc-data.js", `window.__pcRemoteData = ${JSON.stringify(pack, null, 2)};\n`, "text/javascript");
  setNote("backup-feedback", "backupPublishOk", "ok");
});
qs("backup-import-json-btn")?.addEventListener("click", () => qs("backup-import-json")?.click());
qs("backup-import-json")?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!askAdmin("confirmImportBackup")) {
    event.target.value = "";
    return;
  }
  try {
    const pack = JSON.parse(await file.text());
    Store.importPack(pack);
    setNote("backup-feedback", "backupImportOk", "ok");
    window.setTimeout(() => location.reload(), 700);
  } catch {
    setNote("backup-feedback", "backupInvalid", "error");
  } finally {
    event.target.value = "";
  }
});
qs("backup-clear-local")?.addEventListener("click", () => {
  if (!askAdmin("confirmClearLocal")) return;
  Store.clearLocalOverrides();
  setNote("backup-feedback", "backupCleared", "warn");
  window.setTimeout(() => location.reload(), 600);
});

qs("password-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const current = qs("password-current")?.value || "";
  const next = qs("password-new")?.value || "";
  const next2 = qs("password-new2")?.value || "";
  if (next.length < 6 || next !== next2) {
    setNote("password-feedback", "passwordMismatch", "error");
    return;
  }
  const api = window.PCAdminAuth;
  if (!api) return;
  const ok = await api.verify(current);
  if (!ok) {
    setNote("password-feedback", "passwordWrong", "error");
    return;
  }
  await api.setPassword(next);
  setNote("password-feedback", "passwordChanged", "ok");
});

qs("admin-logout")?.addEventListener("click", () => {
  window.PCAdminAuth?.logout();
});

initAdminViews();
renderTable();
renderDashboard();
bindAdminImageFields();
fillSettingsForm();
fillBrandForm();
renderNavRows();
renderGalleryTable();
renderEventsTable();
renderBlogTable();
fillMenuCatForm();
fillCategorySelect();
initSeoSelect();
fillSeoForm();
initPageSelect();
fillPageForm();
renderFooterRows();
renderGalleryFilterChecks();
renderFaqTable();
renderInbox();
initLanguageTabs();
syncLangPlaceholders();
document.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.id || !/-tr$/.test(target.id)) return;
  syncLangPlaceholders();
});
})();
