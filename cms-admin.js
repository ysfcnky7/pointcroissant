(() => {
const CMS_ADMIN_MODE_KEY = "pc_admin_mode_v1";
const CMS_KEY = "pc_cms_content_v1";

const pageSelector = document.getElementById("cms-page-select");
const openEditorBtn = document.getElementById("cms-open-editor");
const disableEditorBtn = document.getElementById("cms-disable-editor");
const clearAllBtn = document.getElementById("cms-clear-all");
const cmsFeedback = document.getElementById("cms-feedback");
const cmsSummary = document.getElementById("cms-summary");

const getActiveLang = () => {
  if (typeof window.__pcGetLang === "function") return window.__pcGetLang();
  return document.documentElement.lang || "tr";
};

const CMS_TEXT = {
  tr: {
    empty: "Henüz kaydedilmiş sayfa yazısı yok. Bu normal olabilir. Düzenleme Modunu Aç ile bir sayfa açıp Shift tuşunu basılı tutarak yazıya tıklayın.",
    opened:
      "Düzenleme açıldı. Yeni pencerede sayfa gelecek. Klavyede Shift tuşunu basılı tutun, sonra değiştirmek istediğiniz yazıya, resme veya linke tıklayın. Bitince o sayfada kaydedin. Bu pencereyi kapatmayın, işiniz bitince Düzenleme Modunu Kapat’a basın.",
    closed:
      "Düzenleme kapatıldı. Bundan sonra Shift + tıklama çalışmaz. Yaptığınız kayıtlı yazılar duruyor; sadece düzenleme kalemi kapandı.",
    confirmClear:
      "SIFIRLAMA UYARISI\n\nBu düğme, canlı düzenleyici ile yaptığınız BÜTÜN yazı, resim ve link değişikliklerini siler.\n\nNe olacak:\n• Tüm sayfalardaki bu tür düzenlemeler eski haline döner.\n• Geri getiremezsiniz.\n• Ürün fiyatları ve iletişim formu buradan silinmez; onlar ayrı kayıttır.\n\nTAMAM = her şeyi sil\nİPTAL = hiçbir şeyi silme",
    cleared:
      "Canlı düzenleyici ile yaptığınız tüm yazı değişiklikleri silindi. Sayfalar eski metne döndü. Geri gelmez. Ürün ve iletişim kayıtlarınız duruyor."
  },
  en: {
    empty:
      "There is no saved page text yet. That can be normal. Click Open Edit Mode, then hold Shift and click the text you want to change.",
    opened:
      "Edit mode is on. A new window will open. Hold Shift on the keyboard, then click the text, image or link you want to change. Save on that page when done. Do not close this admin window; click Close Edit Mode when you finish.",
    closed:
      "Edit mode is off. Shift + click will not work now. Your saved texts are still there; only the edit pencil is closed.",
    confirmClear:
      "RESET WARNING\n\nThis button deletes ALL text, image and link changes you made with the live editor.\n\nWhat happens:\n• Those edits on all pages go back to the old text.\n• You cannot undo this.\n• Product prices and contact form are not deleted here; they are saved separately.\n\nOK = delete everything\nCANCEL = delete nothing",
    cleared:
      "All live-editor text changes were deleted. Pages went back to the old text. This cannot be undone. Your product and contact records are still there."
  },
  ru: {
    empty:
      "Пока нет сохранённого текста страниц. Это нормально. Нажмите «Открыть режим правки», затем удерживайте Shift и нажмите на текст.",
    opened:
      "Режим правки включён. Откроется новое окно. Удерживайте Shift и нажмите на текст, фото или ссылку. Сохраните на той странице. Это окно не закрывайте; потом нажмите «Закрыть режим правки».",
    closed:
      "Режим правки выключен. Shift + клик больше не работает. Сохранённые тексты остаются.",
    confirmClear:
      "ПРЕДУПРЕЖДЕНИЕ О СБРОСЕ\n\nЭта кнопка удалит ВСЕ правки текста, фото и ссылок, сделанные в живом редакторе. Отмены нет. Цены товаров и контакты здесь не удаляются.\n\nОК = удалить всё\nОТМЕНА = ничего не удалять",
    cleared:
      "Все правки живого редактора удалены. Страницы вернулись к старому тексту. Товары и контакты сохранены."
  },
  ar: {
    empty:
      "لا يوجد نص صفحات محفوظ بعد. هذا طبيعي. اضغط فتح وضع التحرير ثم اضغط Shift وانقر على النص.",
    opened:
      "وضع التحرير مفتوح. ستفتح نافذة جديدة. اضغط Shift باستمرار ثم انقر على النص أو الصورة أو الرابط. احفظ في تلك الصفحة. لا تغلق نافذة الإدارة هذه؛ عند الانتهاء اضغط إغلاق وضع التحرير.",
    closed:
      "أُغلق وضع التحرير. لن يعمل Shift + نقرة الآن. النصوص المحفوظة ما زالت موجودة.",
    confirmClear:
      "تحذير إعادة التعيين\n\nهذا الزر يحذف كل تعديلات النص والصورة والرابط التي عملتموها بالمحرر الحي. لا يمكن التراجع. أسعار المنتجات ومعلومات التواصل لا تُحذف من هنا.\n\nموافق = احذف الكل\nإلغاء = لا تحذف شيئاً",
    cleared:
      "حُذفت كل تعديلات المحرر الحي. عادت الصفحات للنص القديم. سجلات المنتجات والتواصل ما زالت موجودة."
  },
  de: {
    empty:
      "Es gibt noch keinen gespeicherten Seitentext. Das kann normal sein. Klicken Sie auf Bearbeitungsmodus öffnen, halten Sie dann Shift und klicken Sie auf den Text.",
    opened:
      "Bearbeitungsmodus ist an. Ein neues Fenster öffnet sich. Halten Sie Shift und klicken Sie auf Text, Bild oder Link. Speichern Sie auf jener Seite. Schließen Sie dieses Admin-Fenster nicht; klicken Sie danach auf Bearbeitungsmodus schließen.",
    closed:
      "Bearbeitungsmodus ist aus. Shift + Klick funktioniert nicht mehr. Gespeicherte Texte bleiben.",
    confirmClear:
      "ZURÜCKSETZEN-HINWEIS\n\nDiese Taste löscht ALLE Text-, Bild- und Linkänderungen aus dem Live-Editor. Es gibt kein Rückgängig. Produktpreise und Kontakte werden hier nicht gelöscht.\n\nOK = alles löschen\nABBRECHEN = nichts löschen",
    cleared:
      "Alle Live-Editor-Änderungen wurden gelöscht. Die Seiten haben den alten Text. Produkt- und Kontaktdaten bleiben."
  }
};

const cmsText = (key) => {
  const pack = CMS_TEXT[getActiveLang()] || CMS_TEXT.tr;
  return pack[key] || CMS_TEXT.tr[key] || key;
};

const setFeedback = (key, kind = "") => {
  if (!cmsFeedback) return;
  cmsFeedback.textContent = cmsText(key);
  cmsFeedback.classList.remove("is-ok", "is-warn", "is-error");
  if (kind) cmsFeedback.classList.add(`is-${kind}`);
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
    cmsSummary.innerHTML = `<p>${cmsText("empty")}</p>`;
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

if (openEditorBtn && pageSelector) {
  openEditorBtn.addEventListener("click", () => {
    const targetPage = pageSelector.value || "index.html";
    localStorage.setItem(CMS_ADMIN_MODE_KEY, "1");
    window.open(targetPage, "_blank", "noopener,noreferrer");
    setFeedback("opened", "ok");
  });
}

if (disableEditorBtn) {
  disableEditorBtn.addEventListener("click", () => {
    localStorage.setItem(CMS_ADMIN_MODE_KEY, "0");
    setFeedback("closed", "warn");
  });
}

if (clearAllBtn) {
  clearAllBtn.addEventListener("click", () => {
    const ok = window.confirm(cmsText("confirmClear"));
    if (!ok) return;
    localStorage.removeItem(CMS_KEY);
    setFeedback("cleared", "warn");
    renderCmsSummary();
  });
}

renderCmsSummary();
})();
