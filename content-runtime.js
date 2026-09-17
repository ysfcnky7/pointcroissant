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

const inlineFormat = (text) =>
  escapeHtml(text)
    .replaceAll("**", "\0b")
    .replace(/\0b(.+?)\0b/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

const bodyToHtml = (text) =>
  String(text || "")
    .split(/\n{2,}/)
    .map((part) => `<p>${inlineFormat(part).replaceAll("\n", "<br />")}</p>`)
    .join("");

const currentPage = () => window.location.pathname.split("/").pop() || "index.html";

const renderGallery = () => {
  const grid = document.getElementById("gallery-grid");
  const filters = document.getElementById("gallery-filters");
  if (!grid || !filters) return;
  const items = Store.loadGallery();
  const filterMeta = Store.loadGalleryFilters();
  const lang = getLang();
  const used = new Set();
  items.forEach((item) => item.categories.forEach((cat) => used.add(cat)));
  const allLabel = { tr: "Tümü", en: "All", ru: "Все", ar: "الكل", de: "Alle" };
  const buttons = [
    { id: "all", label: allLabel[lang] || allLabel.tr },
    ...filterMeta.filter((item) => used.has(item.id)).map((item) => ({ id: item.id, label: loc(item.label) }))
  ];
  filters.innerHTML = buttons
    .map(
      (item, index) =>
        `<button class="gallery-filter${index === 0 ? " active" : ""}" type="button" data-filter="${escapeHtml(
          item.id
        )}" data-no-i18n>${escapeHtml(item.label)}</button>`
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
    .map((item) => {
      const when = [item.date, item.time].filter(Boolean).join(" ");
      const place = loc(item.location);
      return `
      <article class="card event-card" data-no-i18n>
        ${item.image ? `<img class="event-card-media" src="${escapeHtml(item.image)}" alt="${escapeHtml(loc(item.title))}" loading="lazy" decoding="async" />` : ""}
        <h2>${escapeHtml(loc(item.title))}</h2>
        ${when ? `<p class="event-meta">${escapeHtml(when)}</p>` : ""}
        ${place ? `<p class="event-meta">${escapeHtml(place)}</p>` : ""}
        <p>${escapeHtml(loc(item.description))}</p>
      </article>`;
    })
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
    .filter((item) => item.published !== false)
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
  const posts = Store.loadBlog().filter((item) => item.published !== false);
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
    ${post.image ? `<img class="blog-cover" src="${escapeHtml(post.image)}" alt="${escapeHtml(loc(post.title))}" loading="lazy" decoding="async" />` : ""}
    ${bodyToHtml(loc(post.body))}
    <p>
      <a class="btn btn-small" href="blog.html" data-no-i18n>${back[getLang()] || back.tr}</a>
    </p>`;
  document.title = `${loc(post.title)} | Point Croissant`;
};

bindGalleryFilters();
const renderFaq = () => {
  const host = document.getElementById("faq-list");
  if (!host) return;
  host.innerHTML = Store.loadFaq()
    .map(
      (item) => `
      <h3 data-no-i18n>${escapeHtml(loc(item.question))}</h3>
      <p data-no-i18n>${escapeHtml(loc(item.answer)).replaceAll("\n", "<br />")}</p>`
    )
    .join("");
};

const renderPageCopy = () => {
  const page = currentPage();
  const data = typeof Store.getPageOverride === "function" ? Store.getPageOverride(page) : null;
  if (!data) return;
  const hero = document.querySelector(".page-hero .container");
  if (hero) {
    const eyebrow = hero.querySelector(".eyebrow");
    const title = hero.querySelector("h1");
    const lead = hero.querySelector("p:not(.eyebrow)");
    if (eyebrow && loc(data.eyebrow)) eyebrow.textContent = loc(data.eyebrow);
    if (title && loc(data.title)) title.textContent = loc(data.title);
    if (lead && loc(data.lead)) lead.textContent = loc(data.lead);
  }
  if (page === "faq.html") return;
  const bodyText = loc(data.body);
  if (!bodyText) return;
  const prose = document.querySelector(".prose, [data-pc-page-body]");
  if (!prose) return;
  const keep = [...prose.querySelectorAll(".contact-actions, .legal-toc, #delivery-hours-text")];
  prose.innerHTML = bodyToHtml(bodyText);
  keep.forEach((node) => prose.appendChild(node));
};

const renderMarquee = () => {
  const track = document.querySelector(".flavor-marquee-track");
  if (!track) return;
  const settings = Store.loadSettings();
  const phrases = (settings.flavorMarquee || []).map((item) => loc(item)).filter(Boolean);
  if (!phrases.length) return;
  const doubled = [...phrases, ...phrases];
  track.innerHTML = doubled.map((text) => `<span data-no-i18n>${escapeHtml(text)}</span>`).join("");
};

const reapplyCms = () => {
  if (typeof window.__pcApplyCms === "function") window.__pcApplyCms();
};

const renderManagedContent = () => {
  renderGallery();
  renderEvents();
  renderBlogList();
  renderBlogDetail();
  renderFaq();
  renderPageCopy();
  renderMarquee();
  reapplyCms();
  refreshI18n();
  if (typeof window.__pcApplyLazyMedia === "function") window.__pcApplyLazyMedia();
};
renderManagedContent();
document.addEventListener("pc:langchange", () => {
  renderGallery();
  renderEvents();
  renderBlogList();
  renderBlogDetail();
  renderFaq();
  renderPageCopy();
  renderMarquee();
  reapplyCms();
  if (typeof window.__pcApplyLazyMedia === "function") window.__pcApplyLazyMedia();
});
})();
