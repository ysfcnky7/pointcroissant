(() => {
const SETTINGS_KEY = "pc_settings_v1";
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
const getLocalized = (value, lang) => {
  const normalized = normalizeLocalized(value);
  return normalized[lang] || normalized.tr || "";
};

const DEFAULT_SETTINGS = {
  phoneDisplay: "+90 532 315 07 77",
  phoneTel: "+905323150777",
  whatsappDisplay: "+90 532 315 07 77",
  whatsappNumber: "905323150777",
  email: "hello@pointcroissant.com",
  address: toLocalized("Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya"),
  mapQuery: toLocalized("Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya")
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_SETTINGS, ...parsed };
    return {
      ...merged,
      address: normalizeLocalized(merged.address, DEFAULT_SETTINGS.address.tr),
      mapQuery: normalizeLocalized(merged.mapQuery, DEFAULT_SETTINGS.mapQuery.tr)
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
};

const setHref = (id, value) => {
  const el = document.getElementById(id);
  if (el && value) el.setAttribute("href", value);
};

const settings = loadSettings();
const activeLang =
  (typeof window.__pcGetLang === "function" && window.__pcGetLang()) ||
  document.documentElement.lang ||
  "tr";
const whatsappGreetingByLang = {
  tr: "Merhaba Point Croissant, bilgi almak istiyorum.",
  en: "Hello Point Croissant, I would like to get information.",
  ru: "Здравствуйте, Point Croissant, я хотел(а) бы получить информацию."
};
const whatsappMessage = encodeURIComponent(
  whatsappGreetingByLang[activeLang] || whatsappGreetingByLang.tr
);
const localizedAddress = getLocalized(settings.address, activeLang);
const localizedMapQuery = getLocalized(settings.mapQuery, activeLang) || localizedAddress;

setText("contact-address-text", localizedAddress);
setText("location-address-text", localizedAddress);
setText("contact-phone-text", settings.phoneDisplay);
setText("contact-email-text", settings.email);
setText("contact-whatsapp-text", settings.whatsappDisplay);

setHref("contact-phone-link", `tel:${settings.phoneTel}`);
setHref("contact-call-btn", `tel:${settings.phoneTel}`);
setHref("contact-email-link", `mailto:${settings.email}`);
setHref(
  "contact-whatsapp-link",
  `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`
);
setHref(
  "contact-whatsapp-cta",
  `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`
);
setHref(
  "whatsapp-float-link",
  `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`
);
setHref("call-float-link", `tel:${settings.phoneTel}`);
setHref(
  "route-link",
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(localizedMapQuery)}&travelmode=driving`
);
})();
