(() => {
const CMS_ADMIN_MODE_KEY = "pc_admin_mode_v1";
const CMS_KEY = "pc_cms_content_v1";

const pageSelector = document.getElementById("cms-page-select");
const openEditorBtn = document.getElementById("cms-open-editor");
const disableEditorBtn = document.getElementById("cms-disable-editor");
const clearAllBtn = document.getElementById("cms-clear-all");
const cmsFeedback = document.getElementById("cms-feedback");
const cmsSummary = document.getElementById("cms-summary");

const setFeedback = (text) => {
  if (cmsFeedback) cmsFeedback.textContent = text;
};

const renderCmsSummary = () => {
  if (!cmsSummary) return;
  let data = {};
  try {
    const raw = localStorage.getItem(CMS_KEY);
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }

  const entries = Object.entries(data).map(([page, records]) => ({
    page,
    count: records && typeof records === "object" ? Object.keys(records).length : 0
  }));

  if (!entries.length) {
    cmsSummary.innerHTML = "<p>Kayıt bulunamadı.</p>";
    return;
  }

  cmsSummary.innerHTML = `
    <table class="menu-table">
      <thead>
        <tr><th>Sayfa</th><th>Kayıt</th></tr>
      </thead>
      <tbody>
        ${entries
          .map(
            (item) => `
          <tr>
            <td>${item.page}</td>
            <td>${item.count}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

const getActiveLang = () => {
  if (typeof window.__pcGetLang === "function") return window.__pcGetLang();
  return document.documentElement.lang || "tr";
};

const CMS_DIALOG_TEXT = {
  tr: "Tüm sayfalardaki içerik düzenlemeleri sıfırlanacak. Devam etmek istiyor musun?",
  en: "All content edits on all pages will be reset. Do you want to continue?",
  ru: "Все изменения контента на всех страницах будут сброшены. Продолжить?"
};

if (openEditorBtn && pageSelector) {
  openEditorBtn.addEventListener("click", () => {
    const targetPage = pageSelector.value || "index.html";
    localStorage.setItem(CMS_ADMIN_MODE_KEY, "1");
    window.open(targetPage, "_blank", "noopener,noreferrer");
    setFeedback(
      "Düzenleme modu açıldı. Yeni sekmede Shift + Tıkla ile metin/link/görsel düzenleyebilirsin."
    );
  });
}

if (disableEditorBtn) {
  disableEditorBtn.addEventListener("click", () => {
    localStorage.setItem(CMS_ADMIN_MODE_KEY, "0");
    setFeedback("Düzenleme modu kapatıldı.");
  });
}

if (clearAllBtn) {
  clearAllBtn.addEventListener("click", () => {
    const lang = getActiveLang();
    const ok = window.confirm(CMS_DIALOG_TEXT[lang] || CMS_DIALOG_TEXT.tr);
    if (!ok) return;
    localStorage.removeItem(CMS_KEY);
    setFeedback("Tüm sayfa içerik düzenlemeleri sıfırlandı.");
    renderCmsSummary();
  });
}

renderCmsSummary();
})();
