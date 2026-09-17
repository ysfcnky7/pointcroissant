(() => {
const requestForm = document.getElementById("request-form");
const requestFeedback = document.getElementById("request-feedback");

let requestSettings = {
  whatsappNumber: "905323150777"
};

try {
  if (window.PCStore && typeof window.PCStore.loadSettings === "function") {
    const stored = window.PCStore.loadSettings();
    if (stored?.whatsappNumber) requestSettings.whatsappNumber = stored.whatsappNumber;
    if (stored?.formWebhook) requestSettings.formWebhook = stored.formWebhook;
  } else {
    const requestSettingsRaw =
      localStorage.getItem("pc_settings_v3") || localStorage.getItem("pc_settings_v2");
    if (requestSettingsRaw) {
      requestSettings = { ...requestSettings, ...JSON.parse(requestSettingsRaw) };
    }
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
  },
  ar: {
    fillAll: "يرجى تعبئة جميع الحقول.",
    success: "تم إعداد رسالتك وفتحها في WhatsApp.",
    template:
      "مرحباً Point Croissant،\n\nنموذج الطلب / الاقتراح:\nالاسم الكامل: ${name}\nالبريد الإلكتروني: ${email}\nالهاتف: ${phone}\nالرسالة: ${message}"
  },
  de: {
    fillAll: "Bitte füllen Sie alle Felder aus.",
    success: "Ihre Nachricht wurde vorbereitet und in WhatsApp geöffnet.",
    template:
      "Hallo Point Croissant,\n\nAnfrage- / Vorschlagsformular:\nVollständiger Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone}\nNachricht: ${message}"
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

    if (window.PCStore && typeof window.PCStore.loadInbox === "function") {
      const inbox = window.PCStore.loadInbox();
      inbox.unshift({
        id: `msg_${Date.now()}`,
        ...data,
        lang,
        createdAt: new Date().toISOString()
      });
      try {
        window.PCStore.saveInbox(inbox.slice(0, 100));
      } catch {
        // ignore quota
      }
    }

    const webhook = requestSettings.formWebhook;
    if (webhook) {
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      }).catch(() => {});
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
