const SETTINGS_KEY = "pc_settings_v1";

const DEFAULT_SETTINGS = {
  phoneDisplay: "+90 (242) 456 78 90",
  phoneTel: "+902424567890",
  whatsappDisplay: "+90 (532) 123 45 67",
  whatsappNumber: "905321234567",
  email: "hello@pointcroissant.com",
  address: "Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya",
  mapQuery: "Şirinyalı Mah. Lara Cd. No:128/A, Muratpaşa / Antalya"
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
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
const whatsappMessage = encodeURIComponent(
  "Merhaba Point Croissant, bilgi almak istiyorum."
);
const routeDestination = encodeURIComponent(settings.mapQuery || settings.address);

setText("contact-address-text", settings.address);
setText("location-address-text", settings.address);
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
  "whatsapp-float-link",
  `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`
);
setHref(
  "route-link",
  `https://www.google.com/maps/dir/?api=1&destination=${routeDestination}&travelmode=driving`
);
