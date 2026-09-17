(() => {
const Store = window.PCStore;
if (!Store) return;

const toLocalized = Store.toLocalized;
const normalizeLocalized = Store.normalizeLocalized;
const DEFAULT_PRODUCT_IMAGE = Store.DEFAULT_LOGO;
const LANGS = ["tr", "en", "ru", "ar", "de"];

const localizedWithFallback = (localized, lang) => {
  const value = normalizeLocalized(localized);
  return value[lang] || value.tr || "-";
};
const clampText = (value, max) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
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
let productFilters = { search: "", sort: "created-desc", lang: "tr" };

const saveProducts = () => Store.saveProducts(products);
const persistSettings = () => Store.saveSettings(settings);

const clearForm = () => {
  qs("product-id").value = "";
  LANGS.forEach((lang) => {
    setIf(`product-name-${lang}`, "");
    setIf(`product-desc-${lang}`, "");
    setIf(`product-tag-${lang}`, "");
    setIf(`product-image-${lang}`, "");
  });
  qs("product-price").value = "";
  if (qs("product-category")) qs("product-category").value = "sweet";
  if (qs("product-signature")) qs("product-signature").checked = false;
};

const formatPrice = (price) => `${Number(price).toLocaleString("tr-TR")} TL`;
const categoryLabel = (item) => {
  const base = item.category === "savory" ? "Tuzlu" : "Tatlı";
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

const showMessage = (text) => {
  if (feedback) feedback.textContent = text;
};
const showSettingsMessage = (text) => {
  if (settingsFeedback) settingsFeedback.textContent = text;
};
const setNote = (id, text) => {
  const el = qs(id);
  if (el) el.textContent = text;
};

const getActiveLang = () => {
  if (typeof window.__pcGetLang === "function") return window.__pcGetLang();
  return document.documentElement.lang || "tr";
};

const ADMIN_DIALOG_TEXT = {
  tr: {
    confirmDelete: "Bu ürünü silmek istediğine emin misin?",
    confirmResetDefaults: "Varsayılan ürünleri geri yüklemek istediğine emin misin?",
    confirmGeneric: "Bu kaydı silmek istediğine emin misin?"
  },
  en: {
    confirmDelete: "Are you sure you want to delete this product?",
    confirmResetDefaults: "Are you sure you want to restore default products?",
    confirmGeneric: "Are you sure you want to delete this record?"
  },
  ru: {
    confirmDelete: "Вы уверены, что хотите удалить этот товар?",
    confirmResetDefaults: "Вы уверены, что хотите восстановить товары по умолчанию?",
    confirmGeneric: "Вы уверены, что хотите удалить эту запись?"
  },
  ar: {
    confirmDelete: "هل أنت متأكد أنك تريد حذف هذا المنتج؟",
    confirmResetDefaults: "هل أنت متأكد أنك تريد استعادة المنتجات الافتراضية؟",
    confirmGeneric: "هل أنت متأكد أنك تريد حذف هذا السجل؟"
  },
  de: {
    confirmDelete: "Möchten Sie dieses Produkt wirklich löschen?",
    confirmResetDefaults: "Möchten Sie die Standardprodukte wirklich wiederherstellen?",
    confirmGeneric: "Möchten Sie diesen Eintrag wirklich löschen?"
  }
};

const initLanguageTabs = () => {
  const setActiveTab = (group, lang) => {
    document.querySelectorAll(`.admin-lang-tab[data-tab-group="${group}"]`).forEach((tab) => {
      const isActive = tab.dataset.lang === lang;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
    document.querySelectorAll(`.admin-lang-pane[data-tab-group="${group}"]`).forEach((pane) => {
      pane.classList.toggle("active", pane.dataset.lang === lang);
    });
  };
  document.querySelectorAll(".admin-lang-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const group = tab.dataset.tabGroup;
      const lang = tab.dataset.lang;
      if (!group || !lang) return;
      setActiveTab(group, lang);
    });
  });
  ["product", "settings", "brand", "gallery", "event", "blog", "menucat", "seo"].forEach((group) =>
    setActiveTab(group, "tr")
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
      image: fromLangFields("product-image", PRODUCT_LIMITS.image, DEFAULT_PRODUCT_IMAGE),
      price: (() => {
        const rawPrice = Number(qs("product-price").value);
        return Number.isFinite(rawPrice) ? Math.max(1, Math.min(100000, Math.round(rawPrice))) : 0;
      })(),
      category: qs("product-category")?.value === "savory" ? "savory" : "sweet",
      signature: Boolean(qs("product-signature")?.checked)
    };

    if (!payload.name.tr || !payload.description.tr || !payload.price) {
      showMessage("Lütfen ürün adı, açıklama ve fiyatı doldur.");
      return;
    }

    const idx = products.findIndex((item) => item.id === id);
    if (idx >= 0) {
      products[idx] = Store.normalizeProduct(payload);
      showMessage("Ürün güncellendi. Ön yüzde anında yansır.");
    } else {
      products.push(Store.normalizeProduct(payload));
      showMessage("Ürün eklendi. Ön yüzde anında yansır.");
    }
    saveProducts();
    clearForm();
    renderTable();
    renderDashboard();
  });
}

if (tableBody) {
  tableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;
    const item = products.find((product) => product.id === id);
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
      qs("product-price").value = item.price;
      if (qs("product-category")) qs("product-category").value = item.category === "savory" ? "savory" : "sweet";
      if (qs("product-signature")) qs("product-signature").checked = Boolean(item.signature);
      showMessage("Ürün düzenleme için forma getirildi.");
    }

    if (action === "duplicate") {
      const copy = {
        ...item,
        id: `p_${Date.now()}`,
        name: { ...normalizeLocalized(item.name), tr: `${normalizeLocalized(item.name).tr} (Kopya)` }
      };
      products.unshift(Store.normalizeProduct(copy));
      saveProducts();
      renderTable();
      renderDashboard();
      showMessage("Ürün kopyalandı.");
    }

    if (action === "delete") {
      const lang = getActiveLang();
      const textSet = ADMIN_DIALOG_TEXT[lang] || ADMIN_DIALOG_TEXT.tr;
      if (!window.confirm(textSet.confirmDelete)) return;
      products = products.filter((product) => product.id !== id);
      saveProducts();
      renderTable();
      renderDashboard();
      showMessage("Ürün silindi.");
    }
  });
}

qs("clear-form")?.addEventListener("click", () => {
  clearForm();
  showMessage("Form temizlendi.");
});

qs("reset-defaults")?.addEventListener("click", () => {
  const lang = getActiveLang();
  const textSet = ADMIN_DIALOG_TEXT[lang] || ADMIN_DIALOG_TEXT.tr;
  if (!window.confirm(textSet.confirmResetDefaults)) return;
  products = Store.DEFAULT_PRODUCTS.map(Store.normalizeProduct);
  saveProducts();
  renderTable();
  renderDashboard();
  clearForm();
  showMessage("Varsayılan ürünler geri yüklendi.");
});

const fillSettingsForm = () => {
  qs("setting-phone-display").value = settings.phoneDisplay;
  qs("setting-phone-tel").value = settings.phoneTel;
  qs("setting-whatsapp-display").value = settings.whatsappDisplay;
  qs("setting-whatsapp-number").value = settings.whatsappNumber;
  qs("setting-email").value = settings.email;
  if (qs("setting-instagram")) qs("setting-instagram").value = settings.instagram || "";
  if (qs("setting-facebook")) qs("setting-facebook").value = settings.facebook || "";
  if (qs("setting-opening-spec")) qs("setting-opening-spec").value = settings.openingHoursSpec || "";
  LANGS.forEach((lang) => {
    setIf(`setting-address-${lang}`, settings.address[lang] || "");
    setIf(`setting-map-query-${lang}`, settings.mapQuery[lang] || "");
    setIf(`setting-hours-${lang}`, settings.workingHours[lang] || "");
    setIf(`setting-wa-${lang}`, settings.whatsappGreeting[lang] || "");
  });
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
      showSettingsMessage("Lütfen tüm iletişim alanlarını doldur.");
      return;
    }

    persistSettings();
    showSettingsMessage("İletişim, saat, sosyal ve konum ayarları kaydedildi.");
  });
}

qs("reset-settings")?.addEventListener("click", () => {
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
  showSettingsMessage("İletişim ayarları varsayılana alındı.");
});

const fillBrandForm = () => {
  if (!qs("brand-form")) return;
  qs("brand-name").value = settings.brandName || "";
  qs("brand-logo").value = settings.logo || "";
  qs("brand-hero-image").value = settings.heroImage || "";
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
};

qs("brand-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  settings = Store.normalizeSettings({
    ...settings,
    brandName: clampText(qs("brand-name").value, 80),
    logo: clampText(qs("brand-logo").value, 500) || DEFAULT_PRODUCT_IMAGE,
    heroImage: clampText(qs("brand-hero-image").value, 500),
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
  persistSettings();
  setNote("brand-feedback", "Marka, logo ve sayaçlar kaydedildi.");
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
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.dataset.navRemove) return;
  settings.navLinks = collectNavRows().filter((_, index) => index !== Number(target.dataset.navRemove));
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
  settings = Store.normalizeSettings({ ...settings, navLinks: collectNavRows() });
  persistSettings();
  renderNavRows();
  setNote("nav-feedback", "Üst menü kaydedildi.");
});

qs("nav-reset")?.addEventListener("click", () => {
  settings.navLinks = Store.DEFAULT_NAV.map((item) => ({ ...item, label: { ...item.label } }));
  persistSettings();
  renderNavRows();
  setNote("nav-feedback", "Varsayılan menü geri yüklendi.");
});

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
  qs("gallery-alt-tr").value = "";
  qs("gallery-alt-en").value = "";
  qs("gallery-alt-ru").value = "";
  ["gallery-cat-tatli", "gallery-cat-meyveli", "gallery-cat-premium"].forEach((id) => {
    if (qs(id)) qs(id).checked = false;
  });
};

qs("gallery-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = ["tatli", "meyveli", "premium"].filter((cat) => qs(`gallery-cat-${cat}`)?.checked);
  const payload = {
    id: qs("gallery-id").value || `g_${Date.now()}`,
    src: clampText(qs("gallery-src").value, 500),
    alt: fromLangFields("gallery-alt", 120),
    categories: selected.length ? selected : ["tatli"]
  };
  if (!payload.src) {
    setNote("gallery-feedback", "Görsel URL gerekli.");
    return;
  }
  const idx = gallery.findIndex((item) => item.id === payload.id);
  if (idx >= 0) gallery[idx] = payload;
  else gallery.push(payload);
  Store.saveGallery(gallery);
  renderGalleryTable();
  clearGalleryForm();
  setNote("gallery-feedback", "Galeri görseli kaydedildi.");
});

qs("gallery-clear")?.addEventListener("click", clearGalleryForm);

qs("gallery-body")?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const id = target.dataset.id;
  const action = target.dataset.galleryAction;
  if (!id || !action) return;
  const item = gallery.find((entry) => entry.id === id);
  if (!item) return;
  if (action === "edit") {
    qs("gallery-id").value = item.id;
    qs("gallery-src").value = item.src;
    qs("gallery-alt-tr").value = item.alt.tr || "";
    qs("gallery-alt-en").value = item.alt.en || "";
    qs("gallery-alt-ru").value = item.alt.ru || "";
    ["tatli", "meyveli", "premium"].forEach((cat) => {
      if (qs(`gallery-cat-${cat}`)) qs(`gallery-cat-${cat}`).checked = item.categories.includes(cat);
    });
  }
  if (action === "delete") {
    const lang = getActiveLang();
    if (!window.confirm((ADMIN_DIALOG_TEXT[lang] || ADMIN_DIALOG_TEXT.tr).confirmGeneric)) return;
    gallery = gallery.filter((entry) => entry.id !== id);
    Store.saveGallery(gallery);
    renderGalleryTable();
    setNote("gallery-feedback", "Görsel silindi.");
  }
});

const renderEventsTable = () => {
  const body = qs("events-body");
  if (!body) return;
  body.innerHTML = events
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(item.title.tr)}</td>
        <td>${escapeHtml(item.description.tr)}</td>
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
  LANGS.forEach((lang) => {
    setIf(`event-title-${lang}`, "");
    setIf(`event-desc-${lang}`, "");
  });
};

qs("event-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = {
    id: qs("event-id").value || `e_${Date.now()}`,
    title: fromLangFields("event-title", 80),
    description: fromLangFields("event-desc", 220)
  };
  if (!payload.title.tr || !payload.description.tr) {
    setNote("event-feedback", "Başlık ve açıklama gerekli.");
    return;
  }
  const idx = events.findIndex((item) => item.id === payload.id);
  if (idx >= 0) events[idx] = payload;
  else events.push(payload);
  Store.saveEvents(events);
  renderEventsTable();
  clearEventForm();
  setNote("event-feedback", "Etkinlik kaydedildi.");
});

qs("event-clear")?.addEventListener("click", clearEventForm);

qs("events-body")?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const id = target.dataset.id;
  const action = target.dataset.eventAction;
  const item = events.find((entry) => entry.id === id);
  if (!item || !action) return;
  if (action === "edit") {
    qs("event-id").value = item.id;
    LANGS.forEach((lang) => {
      setIf(`event-title-${lang}`, item.title[lang] || "");
      setIf(`event-desc-${lang}`, item.description[lang] || "");
    });
  }
  if (action === "delete") {
    if (!window.confirm((ADMIN_DIALOG_TEXT[getActiveLang()] || ADMIN_DIALOG_TEXT.tr).confirmGeneric)) return;
    events = events.filter((entry) => entry.id !== id);
    Store.saveEvents(events);
    renderEventsTable();
    setNote("event-feedback", "Etkinlik silindi.");
  }
});

const renderBlogTable = () => {
  const body = qs("blog-body-table");
  if (!body) return;
  body.innerHTML = posts
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(item.title.tr)}</td>
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
  LANGS.forEach((lang) => {
    setIf(`blog-tag-${lang}`, "");
    setIf(`blog-title-${lang}`, "");
    setIf(`blog-excerpt-${lang}`, "");
    setIf(`blog-body-${lang}`, "");
  });
};

qs("blog-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const existingId = qs("blog-id").value;
  const title = fromLangFields("blog-title", 120);
  const payload = {
    id: existingId || Store.slugify(title.tr),
    image: clampText(qs("blog-image").value, 500) || DEFAULT_PRODUCT_IMAGE,
    tag: fromLangFields("blog-tag", 40),
    title,
    excerpt: fromLangFields("blog-excerpt", 220),
    body: fromLangFields("blog-body", 4000)
  };
  if (!payload.title.tr || !payload.body.tr) {
    setNote("blog-feedback", "Başlık ve yazı gerekli.");
    return;
  }
  const reservedHref = {
    "imza-kruvasan": "blog-imza-kruvasan.html",
    "kahve-eslesmesi": "blog-kahve-eslesmesi.html"
  };
  const idx = posts.findIndex((item) => item.id === payload.id);
  const href = idx >= 0 ? posts[idx].href : reservedHref[payload.id] || `blog-post.html?id=${payload.id}`;
  const record = { ...payload, href };
  if (idx >= 0) posts[idx] = record;
  else posts.push(record);
  Store.saveBlog(posts);
  posts = Store.loadBlog();
  renderBlogTable();
  clearBlogForm();
  setNote("blog-feedback", "Blog yazısı kaydedildi.");
});

qs("blog-clear")?.addEventListener("click", clearBlogForm);

qs("blog-body-table")?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const id = target.dataset.id;
  const action = target.dataset.blogAction;
  const item = posts.find((entry) => entry.id === id);
  if (!item || !action) return;
  if (action === "edit") {
    qs("blog-id").value = item.id;
    qs("blog-image").value = item.image || "";
    LANGS.forEach((lang) => {
      setIf(`blog-tag-${lang}`, item.tag[lang] || "");
      setIf(`blog-title-${lang}`, item.title[lang] || "");
      setIf(`blog-excerpt-${lang}`, item.excerpt[lang] || "");
      setIf(`blog-body-${lang}`, item.body[lang] || "");
    });
  }
  if (action === "delete") {
    if (!window.confirm((ADMIN_DIALOG_TEXT[getActiveLang()] || ADMIN_DIALOG_TEXT.tr).confirmGeneric)) return;
    posts = posts.filter((entry) => entry.id !== id);
    Store.saveBlog(posts);
    renderBlogTable();
    setNote("blog-feedback", "Yazı silindi.");
  }
});

const fillMenuCatForm = () => {
  const byId = (id) => menuCats.find((item) => item.id === id) || { title: toLocalized(""), note: toLocalized("") };
  ["sweet", "savory", "signature"].forEach((id) => {
    const cat = byId(id);
    LANGS.forEach((lang) => {
      if (qs(`menucat-${id}-title-${lang}`)) setIf(`menucat-${id}-title-${lang}`, cat.title[lang] || "");
      if (qs(`menucat-${id}-note-${lang}`)) setIf(`menucat-${id}-note-${lang}`, cat.note[lang] || "");
    });
  });
};

qs("menucat-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  menuCats = ["sweet", "savory", "signature"].map((id) => ({
    id,
    title: fromLangFields(`menucat-${id}-title`, 80),
    note: fromLangFields(`menucat-${id}-note`, 220)
  }));
  Store.saveMenuCats(menuCats);
  setNote("menucat-feedback", "Menü kategorileri kaydedildi.");
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
  settings = Store.normalizeSettings({
    ...settings,
    schemaStreet: clampText(qs("schema-street").value, 180),
    schemaLocality: clampText(qs("schema-locality").value, 80),
    schemaRegion: clampText(qs("schema-region").value, 80),
    schemaPostal: clampText(qs("schema-postal").value, 16),
    seo: {
      ...settings.seo,
      [page]: {
        title: fromLangFields("seo-title", 120),
        description: fromLangFields("seo-desc", 220)
      }
    }
  });
  persistSettings();
  setNote("seo-feedback", "SEO ve Google işletme bilgisi kaydedildi.");
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
    productFilters = { search: "", sort: "created-desc", lang: "tr" };
    if (productSearch) productSearch.value = "";
    if (productSort) productSort.value = "created-desc";
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
    showMessage("Ürünler JSON olarak dışa aktarıldı.");
  });
}
if (importProductsBtn && importProductsInput) {
  importProductsBtn.addEventListener("click", () => importProductsInput.click());
  importProductsInput.addEventListener("change", async () => {
    const file = importProductsInput.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed) || !parsed.length) {
        showMessage("JSON içeriği geçersiz.");
        return;
      }
      products = parsed.map(Store.normalizeProduct);
      saveProducts();
      renderTable();
      renderDashboard();
      showMessage("JSON içe aktarıldı.");
    } catch {
      showMessage("JSON dosyası okunamadı.");
    } finally {
      importProductsInput.value = "";
    }
  });
}

renderTable();
renderDashboard();
fillSettingsForm();
fillBrandForm();
renderNavRows();
renderGalleryTable();
renderEventsTable();
renderBlogTable();
fillMenuCatForm();
initSeoSelect();
fillSeoForm();
initLanguageTabs();
})();
