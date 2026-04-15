(() => {
const requestForm = document.getElementById("request-form");
const requestFeedback = document.getElementById("request-feedback");
const requestSettingsRaw = localStorage.getItem("pc_settings_v1");

let requestSettings = {
  whatsappNumber: "905323150777"
};

try {
  if (requestSettingsRaw) {
    requestSettings = { ...requestSettings, ...JSON.parse(requestSettingsRaw) };
  }
} catch {
  // Keep default settings
}

const collectRequestData = () => {
  const name = document.getElementById("rf-name")?.value.trim() || "";
  const email = document.getElementById("rf-email")?.value.trim() || "";
  const phone = document.getElementById("rf-phone")?.value.trim() || "";
  const message = document.getElementById("rf-message")?.value.trim() || "";
  return { name, email, phone, message };
};

const isRequestDataValid = (data) =>
  data.name && data.email && data.phone && data.message;

const getActiveLang = () => {
  if (typeof window.__pcGetLang === "function") return window.__pcGetLang();
  return document.documentElement.lang || "tr";
};

const REQUEST_TEXT = {
  tr: {
    fillAll: "Lütfen tüm alanları doldur.",
    success: "Mesajın WhatsApp üzerinden hazırlandı ve açıldı.",
    template:
      "Merhaba Point Croissant,\n\nİstek / Dilek / Öneri Formu:\nAd Soyad: ${name}\nE-Posta: ${email}\nTelefon: ${phone}\nMesaj: ${message}"
  },
  en: {
    fillAll: "Please fill in all fields.",
    success: "Your message was prepared and opened in WhatsApp.",
    template:
      "Hello Point Croissant,\n\nRequest / Suggestion Form:\nFull Name: ${name}\nE-mail: ${email}\nPhone: ${phone}\nMessage: ${message}"
  },
  ru: {
    fillAll: "Пожалуйста, заполните все поля.",
    success: "Ваше сообщение подготовлено и открыто в WhatsApp.",
    template:
      "Здравствуйте, Point Croissant,\n\nФорма запроса / предложения:\nИмя и фамилия: ${name}\nE-mail: ${email}\nТелефон: ${phone}\nСообщение: ${message}"
  }
};

if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = collectRequestData();
    const lang = getActiveLang();
    const textSet = REQUEST_TEXT[lang] || REQUEST_TEXT.tr;

    if (!isRequestDataValid(data)) {
      if (requestFeedback) requestFeedback.textContent = textSet.fillAll;
      return;
    }

    const text = encodeURIComponent(
      textSet.template
        .replace("${name}", data.name)
        .replace("${email}", data.email)
        .replace("${phone}", data.phone)
        .replace("${message}", data.message)
    );
    const waUrl = `https://wa.me/${requestSettings.whatsappNumber}?text=${text}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    requestForm.reset();
    if (requestFeedback) {
      requestFeedback.textContent = textSet.success;
    }
  });
}
})();
