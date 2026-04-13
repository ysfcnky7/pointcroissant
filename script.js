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
