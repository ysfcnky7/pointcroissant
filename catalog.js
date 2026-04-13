const CATALOG_KEY = "pc_catalog_v1";

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Double Chocolate",
    description: "Belcika cikolatasi dolgusu ve kakao glaze ile yogun lezzet.",
    price: 205,
    tag: "En Cok Satan"
  },
  {
    id: "p2",
    name: "Fistik Supreme",
    description: "Antep fistik kremasi, citir fistik parcasi ve tereyagli hamur.",
    price: 225,
    tag: "Sef Onerisi"
  },
  {
    id: "p3",
    name: "Yaban Mersinli Danish",
    description: "Ipeksi krema ve meyve dolgusu ile ferah, dengeli tat.",
    price: 215,
    tag: "Yeni"
  },
  {
    id: "p4",
    name: "Truf Mantarli Tuzlu",
    description: "Brunch icin premium tuzlu kruvasan deneyimi.",
    price: 235,
    tag: "Premium"
  }
];

const parseProducts = () => {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_PRODUCTS;
    return parsed;
  } catch {
    return DEFAULT_PRODUCTS;
  }
};

const formatPrice = (value) => `${Number(value || 0).toLocaleString("tr-TR")} TL`;

const renderFeaturedProducts = (products) => {
  const grid = document.getElementById("featured-products");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (item) => `
      <article class="card product-card reveal">
        <span class="tag">${item.tag || "Ozel Lezzet"}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p><strong>${formatPrice(item.price)}</strong></p>
        <a href="#iletisim">Detay Al</a>
      </article>
    `
    )
    .join("");
};

const renderMenuProducts = (products) => {
  const body = document.getElementById("menu-products-body");
  if (!body) return;

  body.innerHTML = products
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${formatPrice(item.price)}</td>
      </tr>
    `
    )
    .join("");
};

const catalog = parseProducts();
renderFeaturedProducts(catalog);
renderMenuProducts(catalog);
