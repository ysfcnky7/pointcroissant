(() => {
const Store = window.PCStore;
if (!Store) return;

const settings = Store.loadSettings();
const activeLang = Store.getLang();
const loc = (value) => Store.getLocalized(value, activeLang);

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
};

const setHref = (id, value) => {
  const el = document.getElementById(id);
  if (el && value) el.setAttribute("href", value);
};

const setSrc = (id, value) => {
  const el = document.getElementById(id);
  if (el && value) el.setAttribute("src", value);
};

const toggleRow = (id, show) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.hidden = !show;
};

const whatsappMessage = encodeURIComponent(
  loc(settings.whatsappGreeting) || settings.whatsappGreeting.tr
);
const localizedAddress = loc(settings.address);
const localizedMapQuery = loc(settings.mapQuery) || localizedAddress;
const hours = loc(settings.workingHours);

setText("contact-address-text", localizedAddress);
setText("location-address-text", localizedAddress);
setText("contact-phone-text", settings.phoneDisplay);
setText("contact-email-text", settings.email);
setText("contact-whatsapp-text", settings.whatsappDisplay);
setText("contact-hours-text", hours);
setText("delivery-hours-text", hours);

setHref("contact-phone-link", `tel:${settings.phoneTel}`);
setHref("contact-call-btn", `tel:${settings.phoneTel}`);
setHref("contact-email-link", `mailto:${settings.email}`);
setHref("contact-whatsapp-link", `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`);
setHref("contact-whatsapp-cta", `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`);
setHref("whatsapp-float-link", `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`);
setHref("call-float-link", `tel:${settings.phoneTel}`);
setHref(
  "route-link",
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(localizedMapQuery)}&travelmode=driving`
);

if (settings.instagram) {
  setHref("contact-instagram-link", settings.instagram);
  setText("contact-instagram-text", "Instagram");
  toggleRow("contact-instagram-row", true);
} else {
  toggleRow("contact-instagram-row", false);
}

if (settings.facebook) {
  setHref("contact-facebook-link", settings.facebook);
  setText("contact-facebook-text", "Facebook");
  toggleRow("contact-facebook-row", true);
} else {
  toggleRow("contact-facebook-row", false);
}

toggleRow("contact-hours-row", Boolean(hours));

const heroImage = document.querySelector(".hero-image");
if (heroImage && settings.heroImage) heroImage.setAttribute("src", settings.heroImage);
const heroLogo = document.querySelector(".hero-emblem");
if (heroLogo && settings.logo) heroLogo.setAttribute("src", settings.logo);

const stats = settings.heroStats || {};
const statMap = [
  ["stat-years", stats.years, stats.yearsLabel],
  ["stat-recipes", stats.recipes, stats.recipesLabel],
  ["stat-daily", stats.daily, stats.dailyLabel]
];
const statNodes = document.querySelectorAll(".hero-mini-stats > div, .atelier-stats-grid > div");
statNodes.forEach((node, index) => {
  const config = statMap[index];
  if (!config) return;
  const strong = node.querySelector("strong");
  const span = node.querySelector("span");
  if (strong && config[1] != null) {
    strong.dataset.target = String(config[1]);
    strong.textContent = "0";
  }
  if (span && config[2]) span.textContent = loc(config[2]);
});

setSrc("hero-logo", settings.logo);
})();
