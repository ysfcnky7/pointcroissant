const requestForm = document.getElementById("request-form");
const requestFeedback = document.getElementById("request-feedback");
const requestSettingsRaw = localStorage.getItem("pc_settings_v1");

let requestSettings = {
  whatsappNumber: "905074216688"
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

if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = collectRequestData();

    if (!isRequestDataValid(data)) {
      if (requestFeedback) requestFeedback.textContent = "Lutfen tum alanlari doldur.";
      return;
    }

    const text = encodeURIComponent(
      `Merhaba Point Croissant,\n\nIstek / Dilek / Oneri Formu:\nAd Soyad: ${data.name}\nE-Posta: ${data.email}\nTelefon: ${data.phone}\nMesaj: ${data.message}`
    );
    const waUrl = `https://wa.me/${requestSettings.whatsappNumber}?text=${text}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    requestForm.reset();
    if (requestFeedback) {
      requestFeedback.textContent = "Mesajin WhatsApp uzerinden hazirlandi ve acildi.";
    }
  });
}
