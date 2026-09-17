(() => {
const CMS_KEY = "pc_cms_content_v1";
const CMS_ADMIN_MODE_KEY = "pc_admin_mode_v1";
const CMS_SCHEMA_KEY = "pc_cms_schema_v1";
const CMS_SCHEMA_VERSION = "3";

const ensureCmsSchema = () => {
  try {
    const schema = localStorage.getItem(CMS_SCHEMA_KEY);
    if (schema === CMS_SCHEMA_VERSION) return;
    localStorage.removeItem(CMS_KEY);
    localStorage.setItem(CMS_SCHEMA_KEY, CMS_SCHEMA_VERSION);
  } catch {
    // Ignore storage errors and continue with defaults
  }
};

const getPageKey = () => {
  const page = window.location.pathname.split("/").pop();
  return page && page.length ? page : "index.html";
};

const loadCmsData = () => {
  try {
    const raw = localStorage.getItem(CMS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveCmsData = (data) => {
  try {
    localStorage.setItem(CMS_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    const quota =
      error &&
      (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED" || error.code === 22);
    window.alert(
      quota
        ? "KAYIT YAPILMADI\n\nTarayıcının hafızası doldu. Bu, bilgisayarın kendi küçük deposudur.\n\nNe yapmalısınız:\n1) Daha küçük bir fotoğraf seçin (önerilen 2 MB altı).\n2) İsterseniz admin panelde “Tüm Düzenlemeleri Sıfırla” ile yer açın.\n\nKaliteyi bozmamak için yazınız kaydedilmedi. Eski metin duruyor."
        : "KAYIT YAPILMADI\n\nYazı kaydedilirken bir sorun oldu. İnternet kopmuş olabilir veya tarayıcı depolaması kapalı olabilir.\n\nNe yapmalısınız:\n1) Sayfayı kapatmayın.\n2) Bir kez daha deneyin.\n3) Olmazsa admin panele dönüp tekrar açın.\n\nYazdığınız son değişiklik sitede görünmez."
    );
    return false;
  }
};

const applyRecord = (el, record) => {
  if (!record) return;
  if (typeof record.text === "string" && !["IMG", "INPUT", "TEXTAREA"].includes(el.tagName)) {
    el.textContent = record.text;
  }
  if (typeof record.href === "string" && el.tagName === "A") {
    el.setAttribute("href", record.href);
  }
  if (typeof record.src === "string" && el.tagName === "IMG") {
    el.setAttribute("src", record.src);
  }
  if (typeof record.alt === "string" && el.tagName === "IMG") {
    el.setAttribute("alt", record.alt);
  }
};

const ensureCmsIds = () => {
  const candidates = document.querySelectorAll(
    "h1,h2,h3,h4,p,span,li,a,label,button,th,td,strong,img,figcaption"
  );
  let idx = 0;
  candidates.forEach((el) => {
    if (el.closest("script,style,#admin-app,#admin-lock-screen,.cms-toolbar,.pc-image-modal,.admin-image-field")) return;
    if (el.classList.contains("cms-ignore")) return;
    if (!el.dataset.cmsId) {
      el.dataset.cmsId = `cms-${idx}`;
      idx += 1;
    }
  });
};

const applyCms = () => {
  ensureCmsIds();
  const data = loadCmsData();
  const pageKey = getPageKey();
  const pageData = data[pageKey] || {};
  Object.entries(pageData).forEach(([id, record]) => {
    const el = document.querySelector(`[data-cms-id="${id}"]`);
    if (el) applyRecord(el, record);
  });
};

const isAdminMode = () => localStorage.getItem(CMS_ADMIN_MODE_KEY) === "1";

const loadImageUpload = () => {
  if (window.PCImageUpload) return Promise.resolve(window.PCImageUpload);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="image-upload.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.PCImageUpload), { once: true });
      existing.addEventListener("error", () => reject(new Error("image-upload")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "image-upload.js";
    script.onload = () => resolve(window.PCImageUpload);
    script.onerror = () => reject(new Error("image-upload"));
    document.head.appendChild(script);
  });
};

const mountAdminToolbar = () => {
  if (!isAdminMode()) return;
  loadImageUpload().catch(() => {});
  const bar = document.createElement("div");
  bar.className = "cms-toolbar";
  bar.innerHTML = `
    <span>Düzenleme modu açık - Shift + Tıkla: yazı, link veya fotoğraf</span>
    <button type="button" id="cms-disable-mode">Kapat</button>
    <button type="button" id="cms-clear-page">Bu sayfayı sıfırla</button>
  `;
  document.body.appendChild(bar);

  const pageKey = getPageKey();
  const disableBtn = bar.querySelector("#cms-disable-mode");
  const clearBtn = bar.querySelector("#cms-clear-page");

  disableBtn.addEventListener("click", () => {
    localStorage.setItem(CMS_ADMIN_MODE_KEY, "0");
    window.location.reload();
  });

  clearBtn.addEventListener("click", () => {
    const ok = window.confirm(
      "BU SAYFAYI SIFIRLA UYARISI\n\nŞu anda açık olan sayfadaki canlı düzenleyici yazı, resim ve link değişiklikleri silinecek.\n\nNe olacak:\n• Sadece bu sayfa eski haline döner.\n• Diğer sayfalar durur.\n• Geri getiremezsiniz.\n\nTAMAM = bu sayfayı sıfırla\nİPTAL = hiçbir şeyi silme"
    );
    if (!ok) return;
    const data = loadCmsData();
    delete data[pageKey];
    if (!saveCmsData(data)) return;
    window.location.reload();
  });

  document.addEventListener("click", async (event) => {
    if (!event.shiftKey) return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(".cms-toolbar, .pc-image-modal")) return;
    const editable = target.closest("[data-cms-id]");
    if (!(editable instanceof HTMLElement)) return;
    event.preventDefault();

    const id = editable.dataset.cmsId;
    if (!id) return;
    const data = loadCmsData();
    if (!data[pageKey]) data[pageKey] = {};

    if (editable.tagName === "IMG") {
      let upload = window.PCImageUpload;
      try {
        upload = await loadImageUpload();
      } catch {
        upload = null;
      }
      if (upload && typeof upload.openCmsPicker === "function") {
        const liveSrc = editable.getAttribute("src") || "";
        const storedSrc = editable.dataset.pcSrc || data[pageKey][id]?.src || "";
        const src = storedSrc || (liveSrc.startsWith("blob:") ? "" : liveSrc);
        const picked = await upload.openCmsPicker({
          src,
          alt: editable.getAttribute("alt") || "",
          preset: upload.guessPreset(editable)
        });
        if (!picked) return;
        data[pageKey][id] = { ...(data[pageKey][id] || {}), src: picked.src, alt: picked.alt || "" };
      } else {
        const src = window.prompt(
          "GÖRSEL ADRESİ\n\nResmin internet adresini yazın. Bilgisayardan dosya sürüklemeyin.\nÖrnek: assets/foto.webp veya https:// ile başlayan adres.\n\nİptal = resmi değiştirme.",
          editable.getAttribute("src") || ""
        );
        if (!src) return;
        const alt = window.prompt(
          "RESİM AÇIKLAMASI\n\nGörme engelli ziyaretçi ve Google için kısa yazı. Örnek: Antep fıstıklı kruvasan.\n\nİptal = vazgeç.",
          editable.getAttribute("alt") || ""
        );
        data[pageKey][id] = { ...(data[pageKey][id] || {}), src, alt: alt || "" };
      }
    } else if (editable.tagName === "A") {
      const text = window.prompt(
        "LİNK YAZISI\n\nMüşterinin tıklayacağı yazı. Örnek: Menü.\n\nİptal = hiçbir şeyi değiştirme.",
        editable.textContent || ""
      );
      if (text === null) return;
      const href = window.prompt(
        "LİNK ADRESİ\n\nTıklanınca açılacak sayfa. Örnek: menu.html veya https://...\nYanlış yazarsanız düğme boş sayfaya gider.\n\nİptal = vazgeç.",
        editable.getAttribute("href") || "#"
      );
      if (href === null) return;
      data[pageKey][id] = { ...(data[pageKey][id] || {}), text, href };
    } else {
      const text = window.prompt(
        "YAZIYI DEĞİŞTİR\n\nMüşterinin sitede göreceği metin. Kaydetmek için Tamam’a basın. Yanlış yazarsanız tekrar Shift + tıklayıp düzeltebilirsiniz.\n\nİptal = hiçbir şeyi değiştirme.",
        editable.textContent || ""
      );
      if (text === null) return;
      data[pageKey][id] = { ...(data[pageKey][id] || {}), text };
    }

    if (!saveCmsData(data)) return;
    applyCms();
  });
};

ensureCmsSchema();
applyCms();
mountAdminToolbar();
window.__pcApplyCms = applyCms;
})();
