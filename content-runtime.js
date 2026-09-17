(() => {
const Store = window.PCStore;
if (!Store) return;

const getLang = () => Store.getLang();
const loc = (value) => Store.getLocalized(value, getLang());
const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const refreshI18n = () => {
  if (typeof window.__pcApplyLanguage === "function" && typeof window.__pcGetLang === "function") {
    window.__pcApplyLanguage(window.__pcGetLang(), false);
  }
};

const bodyToHtml = (text) =>
  String(text || "")
    .split(/\n{2,}/)
    .map((part) => `<p>${escapeHtml(part).replaceAll("\n", "<br />")}</p>`)
    .join("");

const renderGallery = () => {
  const grid = document.getElementById("gallery-grid");
  const filters = document.getElementById("gallery-filters");
  if (!grid || !filters) return;
  const items = Store.loadGallery();
  const labels = {
    tr: { all: "Tümü", tatli: "Tatlı", meyveli: "Meyveli", premium: "Premium" },
    en: { all: "All", tatli: "Sweet", meyveli: "Fruity", premium: "Premium" },
    ru: { all: "Все", tatli: "Сладкое", meyveli: "Фруктовое", premium: "Премиум" },
    ar: { all: "الكل", tatli: "حلو", meyveli: "فاكهي", premium: "مميز" },
    de: { all: "Alle", tatli: "Süß", meyveli: "Fruchtig", premium: "Premium" }
  };
  const lang = getLang();
  const dict = labels[lang] || labels.tr;
  const used = new Set();
  items.forEach((item) => item.categories.forEach((cat) => used.add(cat)));
  const filterOrder = ["all", "tatli", "meyveli", "premium"].filter((key) => key === "all" || used.has(key));
  filters.innerHTML = filterOrder
    .map(
      (key, index) =>
        `<button class="gallery-filter${index === 0 ? " active" : ""}" type="button" data-filter="${key}" data-no-i18n>${dict[key] || key}</button>`
    )
    .join("");
  grid.innerHTML = items
    .map(
      (item, index) => `
      <article class="gallery-item${index === 0 ? " gallery-item--feature" : ""} reveal visible" data-category="${escapeHtml(item.categories.join(" "))}">
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(loc(item.alt))}" loading="lazy" decoding="async" />
      </article>`
    )
    .join("");
};

const bindGalleryFilters = () => {
  const galleryFilters = document.getElementById("gallery-filters");
  const galleryGrid = document.getElementById("gallery-grid");
  if (!galleryFilters || !galleryGrid) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  galleryFilters.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const selected = target.dataset.filter;
    if (!selected) return;
    const filterButtons = [...galleryFilters.querySelectorAll(".gallery-filter")];
    const galleryItems = [...galleryGrid.querySelectorAll(".gallery-item")];
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === selected;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    galleryItems.forEach((item, index) => {
      const categories = item.dataset.category || "";
      const visible = selected === "all" || categories.includes(selected);
      item.classList.toggle("hidden", !visible);
      item.classList.remove("gallery-item--feature");
      if (visible && !reducedMotion) {
        item.classList.remove("visible");
        requestAnimationFrame(() => {
          item.style.transitionDelay = `${Math.min(index * 40, 280)}ms`;
          item.classList.add("visible");
        });
      }
    });
    const firstVisible = galleryItems.find((item) => !item.classList.contains("hidden"));
    if (firstVisible) firstVisible.classList.add("gallery-item--feature");
  });
};

const renderEvents = () => {
  const grid = document.getElementById("events-grid");
  if (!grid) return;
  grid.innerHTML = Store.loadEvents()
    .map(
      (item) => `
      <article class="card" data-no-i18n>
        <h2>${escapeHtml(loc(item.title))}</h2>
        <p>${escapeHtml(loc(item.description))}</p>
      </article>`
    )
    .join("");
};

const renderBlogList = () => {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;
  const readMore = {
    tr: "Devamını Oku",
    en: "Read More",
    ru: "Читать далее",
    ar: "اقرأ المزيد",
    de: "Weiterlesen"
  };
  const lang = getLang();
  grid.innerHTML = Store.loadBlog()
    .map(
      (item) => `
      <article class="card article-card">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(loc(item.title))}" loading="lazy" />
        <p class="eyebrow" data-no-i18n>${escapeHtml(loc(item.tag))}</p>
        <h2 data-no-i18n>${escapeHtml(loc(item.title))}</h2>
        <p data-no-i18n>${escapeHtml(loc(item.excerpt))}</p>
        <a class="btn btn-small" href="${escapeHtml(item.href)}" data-no-i18n>${readMore[lang] || readMore.tr}</a>
      </article>`
    )
    .join("");
};

const renderBlogDetail = () => {
  const article = document.getElementById("blog-detail");
  const titleEl = document.getElementById("blog-detail-title");
  const tagEl = document.getElementById("blog-detail-tag");
  if (!article) return;
  const page = window.location.pathname.split("/").pop() || "index.html";
  const params = new URLSearchParams(window.location.search);
  const posts = Store.loadBlog();
  const post =
    posts.find((item) => item.id === params.get("id")) ||
    posts.find((item) => item.href === page);
  if (!post) return;
  if (tagEl) tagEl.textContent = loc(post.tag);
  if (titleEl) titleEl.textContent = loc(post.title);
  const back = {
    tr: "Blog listesine dön",
    en: "Back to blog list",
    ru: "К списку блога",
    ar: "العودة إلى قائمة المدونة",
    de: "Zurück zur Blogübersicht"
  };
  article.innerHTML = `
    ${bodyToHtml(loc(post.body))}
    <p>
      <a class="btn btn-small" href="blog.html" data-no-i18n>${back[getLang()] || back.tr}</a>
    </p>`;
  document.title = `${loc(post.title)} | Point Croissant`;
};

renderGallery();
bindGalleryFilters();
renderEvents();
renderBlogList();
renderBlogDetail();
refreshI18n();
if (typeof window.__pcApplyLazyMedia === "function") window.__pcApplyLazyMedia();
})();
