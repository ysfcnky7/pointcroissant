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
  localStorage.setItem(CMS_KEY, JSON.stringify(data));
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
    "h1,h2,h3,h4,p,span,li,a,label,button,th,td,strong,img"
  );
  let idx = 0;
  candidates.forEach((el) => {
    if (el.closest("script,style")) return;
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

const mountAdminToolbar = () => {
  if (!isAdminMode()) return;
  const bar = document.createElement("div");
  bar.className = "cms-toolbar";
  bar.innerHTML = `
    <span>Düzenleme modu açık - Shift + Tıkla düzenle</span>
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
    const data = loadCmsData();
    delete data[pageKey];
    saveCmsData(data);
    window.location.reload();
  });

  document.addEventListener("click", (event) => {
    if (!event.shiftKey) return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(".cms-toolbar")) return;
    const editable = target.closest("[data-cms-id]");
    if (!(editable instanceof HTMLElement)) return;
    event.preventDefault();

    const id = editable.dataset.cmsId;
    if (!id) return;
    const data = loadCmsData();
    if (!data[pageKey]) data[pageKey] = {};

    if (editable.tagName === "IMG") {
      const src = window.prompt("Görsel URL", editable.getAttribute("src") || "");
      if (!src) return;
      const alt = window.prompt("Alt metni", editable.getAttribute("alt") || "");
      data[pageKey][id] = { ...(data[pageKey][id] || {}), src, alt: alt || "" };
    } else if (editable.tagName === "A") {
      const text = window.prompt("Link metni", editable.textContent || "");
      if (text === null) return;
      const href = window.prompt("Link adresi", editable.getAttribute("href") || "#");
      if (href === null) return;
      data[pageKey][id] = { ...(data[pageKey][id] || {}), text, href };
    } else {
      const text = window.prompt("Metin", editable.textContent || "");
      if (text === null) return;
      data[pageKey][id] = { ...(data[pageKey][id] || {}), text };
    }

    saveCmsData(data);
    applyCms();
  });
};

ensureCmsSchema();
applyCms();
mountAdminToolbar();
})();
