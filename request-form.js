const requestForm = document.getElementById("request-form");
const requestFeedback = document.getElementById("request-feedback");
const requestWhatsAppLink = document.getElementById("request-whatsapp-link");
const settingsRaw = localStorage.getItem("pc_settings_v1");

let settings = {
  whatsappNumber: "905321234567"
};

try {
  if (settingsRaw) {
    settings = { ...settings, ...JSON.parse(settingsRaw) };
  }
} catch {
  // Keep default settings
}

const defaultWaText = encodeURIComponent("Merhaba Point Croissant, ozel uretim talebi olusturmak istiyorum.");
if (requestWhatsAppLink) {
  requestWhatsAppLink.href = `https://wa.me/${settings.whatsappNumber}?text=${defaultWaText}`;
}

if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("rf-name").value.trim();
    const city = document.getElementById("rf-city").value.trim();
    const email = document.getElementById("rf-email").value.trim();
    const phone = document.getElementById("rf-phone").value.trim();
    const message = document.getElementById("rf-message").value.trim();

    if (!name || !city || !email || !phone || !message) {
      if (requestFeedback) requestFeedback.textContent = "Lutfen tum alanlari doldur.";
      return;
    }

    const text = encodeURIComponent(
      `Merhaba Point Croissant,\n\nTalep Formu:\nAd Soyad: ${name}\nSehir: ${city}\nE-Posta: ${email}\nTelefon: ${phone}\nMesaj: ${message}`
    );
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${text}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    requestForm.reset();
    if (requestFeedback) {
      requestFeedback.textContent = "Talebin WhatsApp uzerinden hazirlandi ve acildi.";
    }
  });
}
