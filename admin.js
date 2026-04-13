const CATALOG_KEY = "pc_catalog_v1";
const SETTINGS_KEY = "pc_settings_v1";
const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Double Chocolate",
    description: "Belcika cikolatasi dolgusu ve kakao glaze ile yogun lezzet.",
    price: 205,
    tag: "En Cok Satan"
  },
  {
    id: "p2",
    name: "Fistik Supreme",
    description: "Antep fistik kremasi, citir fistik parcasi ve tereyagli hamur.",
    price: 225,
    tag: "Sef Onerisi"
  },
  {
    id: "p3",
    name: "Yaban Mersinli Danish",
    description: "Ipeksi krema ve meyve dolgusu ile ferah, dengeli tat.",
    price: 215,
    tag: "Yeni"
  },
  {
    id: "p4",
    name: "Truf Mantarli Tuzlu",
    description: "Brunch icin premium tuzlu kruvasan deneyimi.",
    price: 235,
    tag: "Premium"
  }
];

const DEFAULT_SETTINGS = {
  phoneDisplay: "+90 (242) 456 78 90",
  phoneTel: "+902424567890",
  whatsappDisplay: "+90 (532) 123 45 67",
  whatsappNumber: "905321234567",
  email: "hello@pointcroissant.com",
  address: "Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya",
  mapQuery: "Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya"
};

const qs = (id) => document.getElementById(id);
const form = qs("product-form");
const tableBody = qs("admin-products-body");
const feedback = qs("admin-feedback");
const settingsForm = qs("settings-form");
const settingsFeedback = qs("settings-feedback");

const loadProducts = () => {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    const parsed = raw ? JSON.parse(raw) : DEFAULT_PRODUCTS;
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

let products = loadProducts();
let settings = loadSettings();

const saveProducts = () => {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
};

const saveSettings = () => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const clearForm = () => {
  qs("product-id").value = "";
  qs("product-name").value = "";
  qs("product-desc").value = "";
  qs("product-price").value = "";
  qs("product-tag").value = "";
};

const formatPrice = (price) => `${Number(price).toLocaleString("tr-TR")} TL`;

const renderTable = () => {
  tableBody.innerHTML = products
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${formatPrice(item.price)}</td>
        <td>${item.tag || "-"}</td>
        <td>
          <button class="admin-link-btn" data-action="edit" data-id="${item.id}" type="button">Duzenle</button>
          <button class="admin-link-btn danger" data-action="delete" data-id="${item.id}" type="button">Sil</button>
        </td>
      </tr>
    `
    )
    .join("");
};

const showMessage = (text) => {
  feedback.textContent = text;
};

const showSettingsMessage = (text) => {
  settingsFeedback.textContent = text;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = qs("product-id").value || `p_${Date.now()}`;
  const payload = {
    id,
    name: qs("product-name").value.trim(),
    description: qs("product-desc").value.trim(),
    price: Number(qs("product-price").value),
    tag: qs("product-tag").value.trim()
  };

  if (!payload.name || !payload.description || !payload.price) {
    showMessage("Lutfen urun adi, aciklama ve fiyati doldur.");
    return;
  }

  const idx = products.findIndex((item) => item.id === id);
  if (idx >= 0) {
    products[idx] = payload;
    showMessage("Urun guncellendi. On yuzde aninda yansir.");
  } else {
    products.push(payload);
    showMessage("Urun eklendi. On yuzde aninda yansir.");
  }
  saveProducts();
  clearForm();
  renderTable();
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
    qs("product-name").value = item.name;
    qs("product-desc").value = item.description;
    qs("product-price").value = item.price;
    qs("product-tag").value = item.tag || "";
    showMessage("Urun duzenleme icin forma getirildi.");
  }

  if (action === "delete") {
    products = products.filter((product) => product.id !== id);
    saveProducts();
    renderTable();
    showMessage("Urun silindi.");
  }
});

qs("clear-form").addEventListener("click", () => {
  clearForm();
  showMessage("Form temizlendi.");
});

qs("reset-defaults").addEventListener("click", () => {
  products = [...DEFAULT_PRODUCTS];
  saveProducts();
  renderTable();
  clearForm();
  showMessage("Varsayilan urunler geri yuklendi.");
});

const fillSettingsForm = () => {
  qs("setting-phone-display").value = settings.phoneDisplay;
  qs("setting-phone-tel").value = settings.phoneTel;
  qs("setting-whatsapp-display").value = settings.whatsappDisplay;
  qs("setting-whatsapp-number").value = settings.whatsappNumber;
  qs("setting-email").value = settings.email;
  qs("setting-address").value = settings.address;
  qs("setting-map-query").value = settings.mapQuery;
};

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  settings = {
    phoneDisplay: qs("setting-phone-display").value.trim(),
    phoneTel: qs("setting-phone-tel").value.trim(),
    whatsappDisplay: qs("setting-whatsapp-display").value.trim(),
    whatsappNumber: qs("setting-whatsapp-number").value.trim(),
    email: qs("setting-email").value.trim(),
    address: qs("setting-address").value.trim(),
    mapQuery: qs("setting-map-query").value.trim() || qs("setting-address").value.trim()
  };

  if (
    !settings.phoneDisplay ||
    !settings.phoneTel ||
    !settings.whatsappDisplay ||
    !settings.whatsappNumber ||
    !settings.email ||
    !settings.address
  ) {
    showSettingsMessage("Lutfen tum iletisim alanlarini doldur.");
    return;
  }

  saveSettings();
  showSettingsMessage("Iletisim ve konum ayarlari kaydedildi.");
});

qs("reset-settings").addEventListener("click", () => {
  settings = { ...DEFAULT_SETTINGS };
  saveSettings();
  fillSettingsForm();
  showSettingsMessage("Ayarlar varsayilana alindi.");
});

renderTable();
fillSettingsForm();
