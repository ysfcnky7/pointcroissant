const shareUrl = encodeURIComponent(window.location.href);
const shareText = encodeURIComponent(
  "Point Croissant Antalya"
);

const links = {
  whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
  x: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
  telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`
};

const elWhatsApp = document.getElementById("share-whatsapp");
const elX = document.getElementById("share-x");
const elFacebook = document.getElementById("share-facebook");
const elTelegram = document.getElementById("share-telegram");
const elCopy = document.getElementById("share-copy");
const elNative = document.getElementById("share-native");
const elFeedback = document.getElementById("share-feedback");

if (elWhatsApp) elWhatsApp.href = links.whatsapp;
if (elX) elX.href = links.x;
if (elFacebook) elFacebook.href = links.facebook;
if (elTelegram) elTelegram.href = links.telegram;

if (elCopy) {
  elCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (elFeedback) elFeedback.textContent = "Link kopyalandı.";
    } catch {
      if (elFeedback) elFeedback.textContent = "Link kopyalanamadı.";
    }
  });
}

if (elNative) {
  elNative.addEventListener("click", async () => {
    if (!navigator.share) {
      if (elFeedback) elFeedback.textContent = "Bu cihazda paylaşım özelliği yok.";
      return;
    }
    try {
      await navigator.share({
        title: "Point Croissant | Cafe & Bakery",
        text: "Point Croissant Antalya",
        url: window.location.href
      });
      if (elFeedback) elFeedback.textContent = "Paylaşım başarılı.";
    } catch {
      if (elFeedback) elFeedback.textContent = "Paylaşım iptal edildi.";
    }
  });
}
