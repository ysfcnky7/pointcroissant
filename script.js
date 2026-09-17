const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const root = document.documentElement;
const header = document.getElementById("site-header");
const cursorGlow = document.querySelector(".cursor-glow");
const observedReveals = new WeakSet();
let revealObserver = null;
let revealIndex = 0;

const bindReveal = (item) => {
  if (!(item instanceof HTMLElement) || observedReveals.has(item)) return;
  observedReveals.add(item);
  const delay = Math.min(revealIndex * 55, 480);
  item.style.transitionDelay = `${delay}ms`;
  revealIndex += 1;

  if (!("IntersectionObserver" in window) || reducedMotion) {
    item.classList.add("visible");
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
  }

  revealObserver.observe(item);
};

document.querySelectorAll(".reveal").forEach(bindReveal);

if ("MutationObserver" in window) {
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.classList.contains("reveal")) bindReveal(node);
        node.querySelectorAll?.(".reveal").forEach(bindReveal);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
}

if (!reducedMotion) {
  let ticking = false;
  const updateScrollChrome = () => {
    const scrollTop = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
    header?.classList.toggle("is-scrolled", scrollTop > 18);

    const heroImage = document.querySelector(".hero-image");
    if (heroImage) {
      const shift = Math.min(scrollTop * 0.18, 120);
      heroImage.style.setProperty("--hero-shift", `${shift}px`);
    }
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrollChrome);
      }
    },
    { passive: true }
  );
  updateScrollChrome();
} else {
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
  header?.classList.add("is-scrolled");
}

const counters = document.querySelectorAll("[data-target]");

const runCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const duration = 1400;
  const stepTime = 18;
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
} else {
  counters.forEach((counter) => {
    counter.textContent = Number(counter.dataset.target).toLocaleString("tr-TR");
  });
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
    ru: "Слайд",
    ar: "شريحة",
    de: "Folie"
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

if (!reducedMotion && finePointer) {
  document.body.classList.add("has-cursor-glow");

  if (cursorGlow) {
    let glowX = 0;
    let glowY = 0;
    let targetX = 0;
    let targetY = 0;
    let glowTick = false;

    const followGlow = () => {
      glowX += (targetX - glowX) * 0.16;
      glowY += (targetY - glowY) * 0.16;
      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      glowTick = false;
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        if (!glowTick) {
          glowTick = true;
          window.requestAnimationFrame(followGlow);
        }
      },
      { passive: true }
    );
  }

  const magnetics = document.querySelectorAll(".btn.magnetic, a.magnetic");
  magnetics.forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.setProperty("--tilt-x", `${(x / rect.width) * 8}deg`);
      el.style.setProperty("--tilt-y", `${(y / rect.height) * -8}deg`);
      el.style.setProperty("--magnet-x", `${x * 0.12}px`);
      el.style.setProperty("--magnet-y", `${y * 0.14}px`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--magnet-x", "0px");
      el.style.setProperty("--magnet-y", "0px");
    });
  });
}

document.querySelectorAll(".page-hero").forEach((hero) => hero.classList.add("reveal", "visible"));
document.querySelectorAll(".article-card, .menu-premium-head, .prose.card, .cta-band").forEach((el) => {
  if (!el.classList.contains("reveal")) el.classList.add("reveal");
  bindReveal(el);
});
