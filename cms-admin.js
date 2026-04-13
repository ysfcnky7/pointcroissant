const CMS_ADMIN_MODE_KEY = "pc_admin_mode_v1";
const CMS_KEY = "pc_cms_content_v1";

const pageSelector = document.getElementById("cms-page-select");
const openEditorBtn = document.getElementById("cms-open-editor");
const disableEditorBtn = document.getElementById("cms-disable-editor");
const clearAllBtn = document.getElementById("cms-clear-all");
const cmsFeedback = document.getElementById("cms-feedback");

const setFeedback = (text) => {
  if (cmsFeedback) cmsFeedback.textContent = text;
};

if (openEditorBtn && pageSelector) {
  openEditorBtn.addEventListener("click", () => {
    const targetPage = pageSelector.value || "index.html";
    localStorage.setItem(CMS_ADMIN_MODE_KEY, "1");
    window.open(targetPage, "_blank", "noopener,noreferrer");
    setFeedback(
      "Duzenleme modu acildi. Yeni sekmede Shift + Tikla ile metin/link/gorsel duzenleyebilirsin."
    );
  });
}

if (disableEditorBtn) {
  disableEditorBtn.addEventListener("click", () => {
    localStorage.setItem(CMS_ADMIN_MODE_KEY, "0");
    setFeedback("Duzenleme modu kapatildi.");
  });
}

if (clearAllBtn) {
  clearAllBtn.addEventListener("click", () => {
    localStorage.removeItem(CMS_KEY);
    setFeedback("Tum sayfa icerik duzenlemeleri sifirlandi.");
  });
}
