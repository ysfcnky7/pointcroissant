const Store = window.PCStore;
if (Store) {
const DEFAULT_PRODUCT_IMAGE = "assets/croissant-chocolate.png";
const getActiveLang = () => Store.getLang();
const getLocalized = (value, lang) => Store.getLocalized(value, lang);
const clampText = (value, max) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};
const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const UI_FALLBACK = {
  tr: { featured: "Öne Çıkan", selection: "Seçki" },
  en: { featured: "Featured", selection: "Selection" },
  ru: { featured: "Популярное", selection: "Подборка" },
  ar: { featured: "مميز", selection: "تشكيلة" },
  de: { featured: "Empfohlen", selection: "Auswahl" }
};

const formatPrice = (value) => `${Number(value || 0).toLocaleString("tr-TR")} TL`;

const refreshI18nIfNeeded = () => {
  if (typeof window.__pcApplyLanguage !== "function") return;
  if (typeof window.__pcGetLang !== "function") return;
  window.__pcApplyLanguage(window.__pcGetLang(), false);
};

const refreshLazyMediaIfNeeded = () => {
  if (typeof window.__pcApplyLazyMedia !== "function") return;
  window.__pcApplyLazyMedia();
};

const renderFeaturedProducts = (products) => {
  const grid = document.getElementById("featured-products");
  if (!grid) return;
  const lang = getActiveLang();
  const fallback = UI_FALLBACK[lang] || UI_FALLBACK.tr;

  grid.innerHTML = products
    .map((item) => {
      const imageSrc = escapeHtml(getLocalized(item.image, lang) || DEFAULT_PRODUCT_IMAGE);
      const name = escapeHtml(clampText(getLocalized(item.name, lang), 64));
      const desc = escapeHtml(clampText(getLocalized(item.description, lang), 220));
      const tag = escapeHtml(clampText(getLocalized(item.tag, lang) || fallback.selection, 26));
      return `
      <article class="card product-card reveal visible">
        <img class="product-media" src="${imageSrc}" alt="${name}" loading="lazy" decoding="async" />
        <span class="tag">${tag}</span>
        <h3 class="product-title">${name}</h3>
        <p class="product-desc">${desc}</p>
        <p><strong>${formatPrice(item.price)}</strong></p>
        <a href="#iletisim">Detay Al</a>
      </article>`;
    })
    .join("");
};

const renderMenuProducts = (products) => {
  const highlightGrid = document.getElementById("menu-highlight-grid");
  const categorySections = document.getElementById("menu-category-sections");
  const body = document.getElementById("menu-products-body");
  const lang = getActiveLang();
  const fallback = UI_FALLBACK[lang] || UI_FALLBACK.tr;
  const cats = Store.loadMenuCats();

  if (highlightGrid) {
    const highlighted = [...products].sort((a, b) => Number(b.price) - Number(a.price)).slice(0, 2);
    highlightGrid.innerHTML = highlighted
      .map((item) => {
        const imageSrc = escapeHtml(getLocalized(item.image, lang) || DEFAULT_PRODUCT_IMAGE);
        const name = escapeHtml(clampText(getLocalized(item.name, lang), 64));
        const desc = escapeHtml(clampText(getLocalized(item.description, lang), 220));
        const tag = escapeHtml(clampText(getLocalized(item.tag, lang) || fallback.featured, 26));
        return `
        <article class="card menu-highlight-card reveal visible">
          <img class="menu-highlight-media" src="${imageSrc}" alt="${name}" loading="lazy" decoding="async" />
          <p class="menu-kicker">${tag}</p>
          <h3 class="menu-highlight-title">${name}</h3>
          <p class="menu-highlight-desc">${desc}</p>
          <p class="menu-price-pill">${formatPrice(item.price)}</p>
        </article>`;
      })
      .join("");
  }

  if (categorySections) {
    const sections = cats
      .map((meta) => {
        const itemsForCat =
          meta.kind === "signature" || meta.id === "signature"
            ? products.filter((item) => item.signature)
            : products.filter((item) => item.category === meta.id);
        return {
          title: getLocalized(meta.title, lang),
          note: getLocalized(meta.note, lang),
          items: itemsForCat
        };
      })
      .filter((section) => section.items.length);

    categorySections.innerHTML = sections
      .map(
        (section) => `
        <section class="card menu-category-block reveal visible">
          <div class="menu-category-head">
            <h3 data-no-i18n>${escapeHtml(section.title)}</h3>
            <p data-no-i18n>${escapeHtml(section.note)}</p>
          </div>
          <div class="menu-items-grid">
            ${section.items
              .map(
                (item) => `
                <article class="menu-ledger-item">
                  <img class="menu-ledger-thumb" src="${escapeHtml(getLocalized(item.image, lang) || DEFAULT_PRODUCT_IMAGE)}" alt="${escapeHtml(clampText(getLocalized(item.name, lang), 64))}" loading="lazy" decoding="async" />
                  <div class="menu-ledger-body">
                    <div class="menu-ledger-line">
                      <h4 class="menu-item-title">${escapeHtml(clampText(getLocalized(item.name, lang), 64))}</h4>
                      <span class="menu-ledger-rule" aria-hidden="true"></span>
                      <span class="menu-item-price">${formatPrice(item.price)}</span>
                    </div>
                    <p class="menu-item-desc">${escapeHtml(clampText(getLocalized(item.description, lang), 220))}</p>
                    <small>${escapeHtml(clampText(getLocalized(item.tag, lang) || fallback.selection, 26))}</small>
                  </div>
                </article>`
              )
              .join("")}
          </div>
        </section>`
      )
      .join("");
    return;
  }

  if (!body) return;
  body.innerHTML = products
    .map(
      (item) => `
      <tr>
        <td>${getLocalized(item.name, lang)}</td>
        <td>${getLocalized(item.description, lang)}</td>
        <td>${formatPrice(item.price)}</td>
      </tr>`
    )
    .join("");
};

const renderCatalog = () => {
  const items = Store.loadProducts()
    .filter((item) => item.visible !== false)
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  renderFeaturedProducts(items);
  renderMenuProducts(items);
  refreshLazyMediaIfNeeded();
};
renderCatalog();
refreshI18nIfNeeded();
document.addEventListener("pc:langchange", renderCatalog);
}
