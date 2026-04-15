const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-target]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

if (revealItems.length) {
  revealItems.forEach((item, index) => {
    const delay = Math.min(index * 45, 420);
    item.style.transitionDelay = `${delay}ms`;
  });
}

if (!reducedMotion) {
  let ticking = false;
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrollProgress);
      }
    },
    { passive: true }
  );
  updateScrollProgress();
}

if (!("IntersectionObserver" in window) || reducedMotion) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const runCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const duration = 1200;
  const stepTime = 20;
  const increment = Math.max(1, Math.ceil(target / (duration / stepTime)));
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    counter.textContent = current.toLocaleString("tr-TR");
  }, stepTime);
};

if (!reducedMotion && "IntersectionObserver" in window && counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const toiTrack = document.getElementById("toi-track");
const toiDots = document.getElementById("toi-dots");

if (toiTrack && toiDots) {
  const slides = [...toiTrack.querySelectorAll(".toi-slide")];
  let activeIndex = 0;
  let timerId = null;
  const lang =
    (typeof window.__pcGetLang === "function" && window.__pcGetLang()) ||
    document.documentElement.lang ||
    "tr";
  const slideLabelMap = {
    tr: "Görsel",
    en: "Slide",
    ru: "Слайд"
  };
  const slideLabel = slideLabelMap[lang] || slideLabelMap.tr;

  const buildDots = () => {
    toiDots.innerHTML = slides
      .map(
        (_, idx) =>
          `<button class="toi-dot${idx === 0 ? " active" : ""}" type="button" data-slide="${idx}" aria-label="${slideLabel} ${idx + 1}"></button>`
      )
      .join("");
  };

  const setActiveSlide = (idx) => {
    activeIndex = idx;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === idx));
    [...toiDots.querySelectorAll(".toi-dot")].forEach((dot, i) =>
      dot.classList.toggle("active", i === idx)
    );
  };

  const startAutoPlay = () => {
    if (reducedMotion) return;
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      const next = (activeIndex + 1) % slides.length;
      setActiveSlide(next);
    }, 3200);
  };

  buildDots();
  toiDots.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const idx = Number(target.dataset.slide);
    if (Number.isNaN(idx)) return;
    setActiveSlide(idx);
    startAutoPlay();
  });

  setActiveSlide(0);
  startAutoPlay();
}

const galleryFilters = document.getElementById("gallery-filters");
const galleryGrid = document.getElementById("gallery-grid");

if (galleryFilters && galleryGrid) {
  const filterButtons = [...galleryFilters.querySelectorAll(".gallery-filter")];
  const galleryItems = [...galleryGrid.querySelectorAll(".gallery-item")];

  filterButtons.forEach((btn) => {
    const isActive = btn.classList.contains("active");
    btn.setAttribute("aria-pressed", String(isActive));
  });

  galleryFilters.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const selected = target.dataset.filter;
    if (!selected) return;

    filterButtons.forEach((btn) =>
      {
        const isActive = btn.dataset.filter === selected;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      }
    );

    galleryItems.forEach((item) => {
      const categories = item.dataset.category || "";
      const visible = selected === "all" || categories.includes(selected);
      item.classList.toggle("hidden", !visible);
    });
  });
}
