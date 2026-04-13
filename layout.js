const NAV_LINKS = [
  { href: "index.html", label: "Anasayfa" },
  { href: "index.html#hikaye", label: "Hikayemiz" },
  { href: "menu.html", label: "Kruvasanlarimiz" },
  { href: "index.html#galeri", label: "Galeri" },
  { href: "blog.html", label: "Tarifler" },
  { href: "index.html#iletisim", label: "Iletisim" }
];

const renderHeader = () => {
  const host = document.getElementById("site-header");
  if (!host) return;
  host.innerHTML = `
    <div class="container nav-wrap">
      <a href="index.html" class="brand">
        <img src="assets/logo-point-croissant.png" alt="Point Croissant Logo" width="60" height="60" />
        <div>
          <strong>Point Croissant</strong>
          <span>Cafe & Bakery</span>
        </div>
      </a>
      <input type="checkbox" id="menu-toggle" class="menu-toggle" />
      <label for="menu-toggle" class="menu-button" aria-label="Menüyü aç/kapat">
        <span></span><span></span><span></span>
      </label>
      <nav class="nav-links">
        ${NAV_LINKS.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
        <a class="btn btn-small" href="reservation.html">Siparis Ver</a>
      </nav>
    </div>
  `;
};

const renderFooter = () => {
  const host = document.getElementById("site-footer");
  if (!host) return;
  host.innerHTML = `
    <div class="container footer-grid">
      <div>
        <h3>Point Croissant</h3>
        <p>Antalya'da premium kruvasan ve cafe deneyimi.</p>
      </div>
      <div>
        <h4>Kesfet</h4>
        <a href="index.html">Anasayfa</a>
        <a href="menu.html">Menu</a>
        <a href="blog.html">Blog</a>
        <a href="events.html">Etkinlikler</a>
      </div>
      <div>
        <h4>Hizmetler</h4>
        <a href="reservation.html">Rezervasyon</a>
        <a href="delivery.html">Teslimat</a>
        <a href="wholesale.html">Toptan</a>
        <a href="faq.html">SSS</a>
      </div>
      <div>
        <h4>Yasal</h4>
        <a href="privacy.html">Gizlilik</a>
        <a href="terms.html">Kullanim Sartlari</a>
        <a href="cookies.html">Cerezler</a>
        <a href="admin.html">Admin Panel</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© 2026 Point Croissant Cafe & Bakery</span>
      <span>Antalya, Turkiye</span>
      <a class="designed-by" href="https://softenwise.com/" target="_blank" rel="noopener noreferrer">Designed by SoftenWise</a>
    </div>
  `;
};

renderHeader();
renderFooter();
