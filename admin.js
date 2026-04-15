(() => {
const CATALOG_KEY = "pc_catalog_v1";
const SETTINGS_KEY = "pc_settings_v1";
const SUPPORTED_LANGS = ["tr", "en", "ru"];
const DEFAULT_PRODUCT_IMAGE = "assets/logo-point-croissant.webp";

const toLocalized = (tr = "", en = "", ru = "") => ({ tr, en, ru });

const normalizeLocalized = (value, fallback = "") => {
  if (value && typeof value === "object") {
    return {
      tr: String(value.tr || fallback || "").trim(),
      en: String(value.en || "").trim(),
      ru: String(value.ru || "").trim()
    };
  }
  const tr = typeof value === "string" ? value.trim() : String(fallback || "").trim();
  return toLocalized(tr, "", "");
};

const trText = (localized) => normalizeLocalized(localized).tr;
const localizedWithFallback = (localized, lang) => {
  const value = normalizeLocalized(localized);
  return value[lang] || value.tr || "-";
};
const clampText = (value, max) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const PRODUCT_LIMITS = {
  name: 70,
  description: 320,
  tag: 26,
  image: 500
};

const SETTINGS_LIMITS = {
  phone: 24,
  email: 120,
  address: 220,
  mapQuery: 220
};
const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: toLocalized("Double Chocolate"),
    description: toLocalized("Belçika çikolatası dolgusu ve kakao glaze ile yoğun lezzet."),
    price: 205,
    tag: toLocalized("En Çok Satan"),
    image: DEFAULT_PRODUCT_IMAGE
  },
  {
    id: "p2",
    name: toLocalized("Fıstık Supreme"),
    description: toLocalized("Antep fıstık kreması, çıtır fıstık parçası ve tereyağlı hamur."),
    price: 225,
    tag: toLocalized("Şef Önerisi"),
    image: DEFAULT_PRODUCT_IMAGE
  },
  {
    id: "p3",
    name: toLocalized("Yaban Mersinli Danish"),
    description: toLocalized("İpeksi krema ve meyve dolgusu ile ferah, dengeli tat."),
    price: 215,
    tag: toLocalized("Yeni"),
    image: DEFAULT_PRODUCT_IMAGE
  },
  {
    id: "p4",
    name: toLocalized("Trüf Mantarlı Tuzlu"),
    description: toLocalized("Trüf mantarlı tuzlu kruvasan."),
    price: 235,
    tag: toLocalized("Premium"),
    image: DEFAULT_PRODUCT_IMAGE
  }
];

const DEFAULT_SETTINGS = {
  phoneDisplay: "+90 532 315 07 77",
  phoneTel: "+905323150777",
  whatsappDisplay: "+90 532 315 07 77",
  whatsappNumber: "905323150777",
  email: "hello@pointcroissant.com",
  address: toLocalized("Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya"),
  mapQuery: toLocalized("Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya")
};

const normalizeProduct = (item) => ({
  id: item.id || `p_${Date.now()}`,
  name: normalizeLocalized(item.name),
  description: normalizeLocalized(item.description),
  price: Number(item.price || 0),
  tag: normalizeLocalized(item.tag),
  image: normalizeLocalized(item.image, DEFAULT_PRODUCT_IMAGE)
});

const normalizeSettings = (raw) => {
  const merged = { ...DEFAULT_SETTINGS, ...(raw || {}) };
  return {
    ...merged,
    address: normalizeLocalized(merged.address, trText(DEFAULT_SETTINGS.address)),
    mapQuery: normalizeLocalized(merged.mapQuery, trText(DEFAULT_SETTINGS.mapQuery))
  };
};

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

const loadProducts = () => {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    const parsed = raw ? JSON.parse(raw) : DEFAULT_PRODUCTS;
    const source = Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_PRODUCTS;
    return source.map(normalizeProduct);
  } catch {
    return DEFAULT_PRODUCTS.map(normalizeProduct);
  }
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return normalizeSettings(DEFAULT_SETTINGS);
    const parsed = JSON.parse(raw);
    return normalizeSettings(parsed);
  } catch {
    return normalizeSettings(DEFAULT_SETTINGS);
  }
};

let products = loadProducts();
let settings = loadSettings();
let productFilters = {
  search: "",
  sort: "created-desc",
  lang: "tr"
};

const saveProducts = () => {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
};

const saveSettings = () => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const clearForm = () => {
  qs("product-id").value = "";
  qs("product-name-tr").value = "";
  qs("product-name-en").value = "";
  qs("product-name-ru").value = "";
  qs("product-desc-tr").value = "";
  qs("product-desc-en").value = "";
  qs("product-desc-ru").value = "";
  qs("product-price").value = "";
  qs("product-tag-tr").value = "";
  qs("product-tag-en").value = "";
  qs("product-tag-ru").value = "";
  qs("product-image-tr").value = "";
  qs("product-image-en").value = "";
  qs("product-image-ru").value = "";
};

const formatPrice = (price) => `${Number(price).toLocaleString("tr-TR")} TL`;

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
    case "created-desc":
    default:
      list.sort((a, b) => String(b.id).localeCompare(String(a.id), "tr"));
      break;
  }

  return list;
};

const countMissingTranslations = () =>
  products.reduce((acc, item) => {
    const name = normalizeLocalized(item.name);
    const desc = normalizeLocalized(item.description);
    const tag = normalizeLocalized(item.tag);
    const missingEn = !name.en || !desc.en || !tag.en;
    const missingRu = !name.ru || !desc.ru || !tag.ru;
    return acc + (missingEn || missingRu ? 1 : 0);
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
    .map(
      (item) => {
        const displayName = escapeHtml(localizedWithFallback(item.name, activeLang));
        const displayTag = escapeHtml(localizedWithFallback(item.tag, activeLang) || "-");
        const imageSrc = escapeHtml(localizedWithFallback(item.image, activeLang) || DEFAULT_PRODUCT_IMAGE);
        return `
      <tr>
        <td><img class="admin-table-thumb" src="${imageSrc}" alt="${displayName}" loading="lazy" decoding="async" /></td>
        <td>${displayName}</td>
        <td>${formatPrice(item.price)}</td>
        <td>${displayTag}</td>
        <td>
          <button class="admin-link-btn" data-action="edit" data-id="${item.id}" type="button">Düzenle</button>
          <button class="admin-link-btn" data-action="duplicate" data-id="${item.id}" type="button">Çoğalt</button>
          <button class="admin-link-btn danger" data-action="delete" data-id="${item.id}" type="button">Sil</button>
        </td>
      </tr>
    `;
      }
    )
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
              <p><strong>${formatPrice(item.price)}</strong></p>
              <small>TR: ${escapeHtml(name.tr || "-")}</small>
              <small>EN: ${escapeHtml(localizedWithFallback(name, "en"))}</small>
              <small>RU: ${escapeHtml(localizedWithFallback(name, "ru"))}</small>
            </div>
          </article>
        `;
      })
      .join("");
  }
};

const showMessage = (text) => {
  feedback.textContent = text;
};

const showSettingsMessage = (text) => {
  settingsFeedback.textContent = text;
};

const getActiveLang = () => {
  if (typeof window.__pcGetLang === "function") return window.__pcGetLang();
  return document.documentElement.lang || "tr";
};

const ADMIN_DIALOG_TEXT = {
  tr: {
    confirmDelete: "Bu ürünü silmek istediğine emin misin?",
    confirmResetDefaults: "Varsayılan ürünleri geri yüklemek istediğine emin misin?"
  },
  en: {
    confirmDelete: "Are you sure you want to delete this product?",
    confirmResetDefaults: "Are you sure you want to restore default products?"
  },
  ru: {
    confirmDelete: "Вы уверены, что хотите удалить этот товар?",
    confirmResetDefaults: "Вы уверены, что хотите восстановить товары по умолчанию?"
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

  ["product", "settings"].forEach((group) => setActiveTab(group, "tr"));
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = qs("product-id").value || `p_${Date.now()}`;
  const name = toLocalized(
    clampText(qs("product-name-tr").value, PRODUCT_LIMITS.name),
    clampText(qs("product-name-en").value, PRODUCT_LIMITS.name),
    clampText(qs("product-name-ru").value, PRODUCT_LIMITS.name)
  );
  const description = toLocalized(
    clampText(qs("product-desc-tr").value, PRODUCT_LIMITS.description),
    clampText(qs("product-desc-en").value, PRODUCT_LIMITS.description),
    clampText(qs("product-desc-ru").value, PRODUCT_LIMITS.description)
  );
  const tag = toLocalized(
    clampText(qs("product-tag-tr").value, PRODUCT_LIMITS.tag),
    clampText(qs("product-tag-en").value, PRODUCT_LIMITS.tag),
    clampText(qs("product-tag-ru").value, PRODUCT_LIMITS.tag)
  );
  const image = toLocalized(
    clampText(qs("product-image-tr").value, PRODUCT_LIMITS.image) || DEFAULT_PRODUCT_IMAGE,
    clampText(qs("product-image-en").value, PRODUCT_LIMITS.image),
    clampText(qs("product-image-ru").value, PRODUCT_LIMITS.image)
  );
  const rawPrice = Number(qs("product-price").value);
  const safePrice = Number.isFinite(rawPrice)
    ? Math.max(1, Math.min(100000, Math.round(rawPrice)))
    : 0;
  const payload = {
    id,
    name,
    description,
    price: safePrice,
    tag,
    image
  };

  if (!payload.name.tr || !payload.description.tr || !payload.price) {
    showMessage("Lütfen ürün adı, açıklama ve fiyatı doldur.");
    return;
  }

  const idx = products.findIndex((item) => item.id === id);
  if (idx >= 0) {
    products[idx] = payload;
    showMessage("Ürün güncellendi. Ön yüzde anında yansır.");
  } else {
    products.push(payload);
    showMessage("Ürün eklendi. Ön yüzde anında yansır.");
  }
  saveProducts();
  clearForm();
  renderTable();
  renderDashboard();
});

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
    qs("product-name-tr").value = itemName.tr;
    qs("product-name-en").value = itemName.en;
    qs("product-name-ru").value = itemName.ru;
    qs("product-desc-tr").value = itemDescription.tr;
    qs("product-desc-en").value = itemDescription.en;
    qs("product-desc-ru").value = itemDescription.ru;
    qs("product-price").value = item.price;
    qs("product-tag-tr").value = itemTag.tr;
    qs("product-tag-en").value = itemTag.en;
    qs("product-tag-ru").value = itemTag.ru;
    qs("product-image-tr").value = itemImage.tr || DEFAULT_PRODUCT_IMAGE;
    qs("product-image-en").value = itemImage.en || "";
    qs("product-image-ru").value = itemImage.ru || "";
    showMessage("Ürün düzenleme için forma getirildi.");
  }

  if (action === "duplicate") {
    const copy = {
      ...item,
      id: `p_${Date.now()}`,
      name: {
        ...normalizeLocalized(item.name),
        tr: `${normalizeLocalized(item.name).tr} (Kopya)`
      }
    };
    products.unshift(copy);
    saveProducts();
    renderTable();
    renderDashboard();
    showMessage("Ürün kopyalandı.");
  }

  if (action === "delete") {
    const lang = getActiveLang();
    const textSet = ADMIN_DIALOG_TEXT[lang] || ADMIN_DIALOG_TEXT.tr;
    const ok = window.confirm(textSet.confirmDelete);
    if (!ok) return;
    products = products.filter((product) => product.id !== id);
    saveProducts();
    renderTable();
    renderDashboard();
    showMessage("Ürün silindi.");
  }
});

qs("clear-form").addEventListener("click", () => {
  clearForm();
  showMessage("Form temizlendi.");
});

qs("reset-defaults").addEventListener("click", () => {
  const lang = getActiveLang();
  const textSet = ADMIN_DIALOG_TEXT[lang] || ADMIN_DIALOG_TEXT.tr;
  const ok = window.confirm(textSet.confirmResetDefaults);
  if (!ok) return;
  products = [...DEFAULT_PRODUCTS];
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
  qs("setting-address-tr").value = settings.address.tr || "";
  qs("setting-address-en").value = settings.address.en || "";
  qs("setting-address-ru").value = settings.address.ru || "";
  qs("setting-map-query-tr").value = settings.mapQuery.tr || "";
  qs("setting-map-query-en").value = settings.mapQuery.en || "";
  qs("setting-map-query-ru").value = settings.mapQuery.ru || "";
};

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const address = toLocalized(
    clampText(qs("setting-address-tr").value, SETTINGS_LIMITS.address),
    clampText(qs("setting-address-en").value, SETTINGS_LIMITS.address),
    clampText(qs("setting-address-ru").value, SETTINGS_LIMITS.address)
  );
  const mapQueryTr = clampText(qs("setting-map-query-tr").value, SETTINGS_LIMITS.mapQuery);
  const mapQuery = toLocalized(
    mapQueryTr || address.tr,
    clampText(qs("setting-map-query-en").value, SETTINGS_LIMITS.mapQuery),
    clampText(qs("setting-map-query-ru").value, SETTINGS_LIMITS.mapQuery)
  );
  settings = {
    phoneDisplay: clampText(qs("setting-phone-display").value, SETTINGS_LIMITS.phone),
    phoneTel: clampText(qs("setting-phone-tel").value, SETTINGS_LIMITS.phone),
    whatsappDisplay: clampText(qs("setting-whatsapp-display").value, SETTINGS_LIMITS.phone),
    whatsappNumber: clampText(qs("setting-whatsapp-number").value, SETTINGS_LIMITS.phone),
    email: clampText(qs("setting-email").value, SETTINGS_LIMITS.email),
    address,
    mapQuery
  };

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

  saveSettings();
  showSettingsMessage("İletişim ve konum ayarları kaydedildi.");
});

qs("reset-settings").addEventListener("click", () => {
  settings = normalizeSettings(DEFAULT_SETTINGS);
  saveSettings();
  fillSettingsForm();
  showSettingsMessage("Ayarlar varsayılana alındı.");
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
      products = parsed.map(normalizeProduct);
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
initLanguageTabs();
})();
