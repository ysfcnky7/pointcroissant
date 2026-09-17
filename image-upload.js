(() => {
const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const WARN_INPUT_BYTES = 3 * 1024 * 1024;
const DATA_URL_PREFIX = "data:image/";

const PRESETS = {
  logo: {
    maxWidth: 512,
    maxHeight: 512,
    keepAlpha: true,
    quality: 0.92,
    minQuality: 0.84,
    maxOutputBytes: 280 * 1024,
    hint: "Önerilen boyut: 512×512 px (kare). PNG veya WebP, şeffaf arka plan tercih edilir. En fazla 8 MB. Daha büyük dosyalar yüklenmez."
  },
  hero: {
    maxWidth: 1920,
    maxHeight: 1080,
    keepAlpha: false,
    quality: 0.88,
    minQuality: 0.8,
    maxOutputBytes: 480 * 1024,
    hint: "Önerilen boyut: 1920×1080 px (yatay 16:9). JPEG veya WebP. En fazla 8 MB. Daha büyük dosyalar yüklenmez."
  },
  product: {
    maxWidth: 1400,
    maxHeight: 875,
    keepAlpha: false,
    quality: 0.88,
    minQuality: 0.8,
    maxOutputBytes: 380 * 1024,
    hint: "Önerilen boyut: 1400×875 px (yatay 16:10). JPEG veya WebP. En fazla 8 MB. Daha büyük dosyalar yüklenmez."
  },
  gallery: {
    maxWidth: 1600,
    maxHeight: 1200,
    keepAlpha: false,
    quality: 0.88,
    minQuality: 0.8,
    maxOutputBytes: 420 * 1024,
    hint: "Önerilen boyut: 1600×1200 px (yatay 4:3). JPEG veya WebP. En fazla 8 MB. Daha büyük dosyalar yüklenmez."
  },
  blog: {
    maxWidth: 1400,
    maxHeight: 900,
    keepAlpha: false,
    quality: 0.88,
    minQuality: 0.8,
    maxOutputBytes: 380 * 1024,
    hint: "Önerilen boyut: 1400×900 px (kapak, yatay). JPEG veya WebP. En fazla 8 MB. Daha büyük dosyalar yüklenmez."
  },
  cms: {
    maxWidth: 1600,
    maxHeight: 1200,
    keepAlpha: false,
    quality: 0.88,
    minQuality: 0.8,
    maxOutputBytes: 420 * 1024,
    hint: "Önerilen boyut: 1600×1200 px. JPEG veya WebP. En fazla 8 MB. Daha büyük dosyalar yüklenmez."
  }
};

let webpSupported = null;

const formatBytes = (bytes) => {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 102.4) / 10} KB`;
  return `${Math.round(value / (1024 * 102.4)) / 10} MB`;
};

const isStoredImage = (value) => {
  const src = String(value || "");
  return src.startsWith(DATA_URL_PREFIX) || src.startsWith("pcimg:");
};

const resolveEl = (target) => {
  if (!target) return null;
  if (target instanceof HTMLElement) return target;
  return document.getElementById(String(target));
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });

const probeWebp = () => {
  if (webpSupported !== null) return Promise.resolve(webpSupported);
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    canvas.toBlob(
      (blob) => {
        webpSupported = Boolean(blob && blob.type === "image/webp");
        resolve(webpSupported);
      },
      "image/webp",
      0.8
    );
  });
};

const loadBitmap = async (file) => {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      return await createImageBitmap(file);
    }
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("decode"));
      image.src = objectUrl;
    });
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const canvasToBlob = (canvas, mime, quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mime, quality);
  });

const persistProcessedImage = async (blob, fallbackDataUrl) => {
  if (window.PCMedia && typeof window.PCMedia.saveBlob === "function") {
    try {
      return await window.PCMedia.saveBlob(blob);
    } catch {
      return fallbackDataUrl;
    }
  }
  return fallbackDataUrl;
};

const processFile = async (file, presetKey = "cms") => {
  const preset = PRESETS[presetKey] || PRESETS.cms;
  const type = String(file?.type || "").toLowerCase();
  if (!file || !/^image\/(jpeg|jpg|pjpeg|png|webp)$/.test(type)) {
    return { ok: false, error: "Sadece JPG, PNG veya WebP yükleyebilirsiniz. GIF ve PDF kabul edilmez." };
  }
  if (file.size > MAX_INPUT_BYTES) {
    return {
      ok: false,
      error: `Bu dosya ${formatBytes(file.size)}. En fazla 8 MB yükleyebilirsiniz. 50 MB gibi büyük fotoğraflar siteyi yavaşlatır; lütfen daha küçük bir görsel seçin.`
    };
  }

  let bitmap;
  try {
    bitmap = await loadBitmap(file);
  } catch {
    return { ok: false, error: "Görsel okunamadı. Bozuk olmayan bir JPG, PNG veya WebP seçin." };
  }

  const srcW = bitmap.width || 0;
  const srcH = bitmap.height || 0;
  if (!srcW || !srcH) {
    bitmap.close?.();
    return { ok: false, error: "Görsel boyutu okunamadı. Farklı bir dosya deneyin." };
  }

  const scale = Math.min(1, preset.maxWidth / srcW, preset.maxHeight / srcH);
  const outW = Math.max(1, Math.round(srcW * scale));
  const outH = Math.max(1, Math.round(srcH * scale));
  const needsResize = scale < 0.999;
  const alreadyLight = file.size <= preset.maxOutputBytes;
  const notes = [];

  if (file.size >= WARN_INPUT_BYTES) {
    notes.push(
      `Dosya ${formatBytes(file.size)} olduğu için sitede kullanılacak boyuta küçültülüyor. Netlik korunacak.`
    );
  }

  if (!needsResize && alreadyLight) {
    try {
      const dataUrl = await fileToDataUrl(file);
      bitmap.close?.();
      const src = await persistProcessedImage(file, dataUrl);
      notes.push(`Hazır: ${srcW}×${srcH} px, ${formatBytes(file.size)}. Kaydetmeyi unutmayın.`);
      return { ok: true, src, dataUrl, message: notes.join(" ") };
    } catch {
      bitmap.close?.();
      return { ok: false, error: "Görsel okunamadı. Dosya bozuk olabilir. Başka bir JPG, PNG veya WebP seçin, sonra Kaydet’e basın." };
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d", { alpha: Boolean(preset.keepAlpha) });
  if (!ctx) {
    bitmap.close?.();
    return { ok: false, error: "Görsel dönüştürülemedi. Tarayıcı resmi işleyemedi. Başka bir JPG veya WebP seçin ve tekrar deneyin." };
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (!preset.keepAlpha) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);
  }
  ctx.drawImage(bitmap, 0, 0, outW, outH);
  bitmap.close?.();

  const canWebp = await probeWebp();
  const preferAlpha = Boolean(preset.keepAlpha && (type.includes("png") || type.includes("webp")));
  const mime = preferAlpha ? (canWebp ? "image/webp" : "image/png") : canWebp ? "image/webp" : "image/jpeg";

  let quality = preset.quality;
  let blob = await canvasToBlob(canvas, mime, quality);
  while (blob && blob.size > preset.maxOutputBytes && quality > preset.minQuality + 0.005) {
    quality = Math.max(preset.minQuality, Math.round((quality - 0.04) * 100) / 100);
    blob = await canvasToBlob(canvas, mime, quality);
  }

  if (!blob) {
    return { ok: false, error: "Görsel dönüştürülemedi. Tarayıcı resmi işleyemedi. Başka bir JPG veya WebP seçin ve tekrar deneyin." };
  }

  if (blob.size > preset.maxOutputBytes) {
    return {
      ok: false,
      error: `Görsel küçültülünce hâlâ ${formatBytes(blob.size)}. Kaliteyi bozmamak için yüklenmedi. Lütfen ${preset.maxWidth}×${preset.maxHeight} px civarında ve 2 MB altı bir dosya seçin.`
    };
  }

  try {
    const dataUrl = await fileToDataUrl(blob);
    const src = await persistProcessedImage(blob, dataUrl);
    if (needsResize) notes.push(`Boyut ${srcW}×${srcH} px olduğundan ${outW}×${outH} px yapıldı.`);
    notes.push(`Hazır: ${outW}×${outH} px, ${formatBytes(blob.size)}. Kaydetmeyi unutmayın.`);
    return { ok: true, src, dataUrl, message: notes.join(" ") };
  } catch {
    return { ok: false, error: "Görsel dönüştürülemedi. Tarayıcı resmi işleyemedi. Başka bir JPG veya WebP seçin ve tekrar deneyin." };
  }
};

const guessPreset = (el) => {
  if (!(el instanceof HTMLElement)) return "cms";
  if (el.classList.contains("hero-image")) return "hero";
  if (el.closest(".brand") || el.classList.contains("hero-emblem")) return "logo";
  if (el.closest(".gallery-item")) return "gallery";
  if (
    el.classList.contains("product-media") ||
    el.classList.contains("menu-ledger-thumb") ||
    el.classList.contains("menu-highlight-media") ||
    el.classList.contains("signature-image")
  ) {
    return "product";
  }
  if (el.closest(".blog-card") || el.closest(".blog-hero") || el.closest("article.card")) return "blog";
  return "cms";
};

const syncField = (target) => {
  const input = resolveEl(target);
  if (!input) return;
  const wrap = input.closest(".admin-image-field");
  if (!wrap) return;
  const preview = wrap.querySelector(".admin-image-preview");
  const src = String(input.value || "").trim();
  const applyPreview = async () => {
    if (!preview) return;
    if (!src) {
      preview.hidden = true;
      preview.removeAttribute("src");
      return;
    }
    let display = src;
    if (window.PCMedia && window.PCMedia.isMediaKey(src)) {
      try {
        display = await window.PCMedia.resolveSrc(src);
      } catch {
        display = src;
      }
    }
    preview.hidden = false;
    preview.src = display;
  };
  applyPreview();
  const embedded = isStoredImage(src);
  input.classList.toggle("is-embedded", embedded);
  input.removeAttribute("maxlength");
  let note = wrap.querySelector(".admin-image-embedded-note");
  if (embedded) {
    if (!note) {
      note = document.createElement("p");
      note.className = "admin-image-embedded-note";
      note.textContent =
        "Fotoğraf kutuya geldi ama henüz sitede görünmez. Mutlaka alttaki Kaydet düğmesine basın. Kaydetmezseniz tarayıcıyı kapatınca fotoğraf kaybolur. Başka bir internet adresi kullanmak isterseniz kutudaki yazıyı silip https:// adresini yapıştırın.";
      input.insertAdjacentElement("beforebegin", note);
    }
  } else if (note) {
    note.remove();
  }
};

const bindField = (target, presetKey = "cms") => {
  const input = resolveEl(target);
  if (!input || input.dataset.pcUploadBound === "1") return input;
  input.dataset.pcUploadBound = "1";
  input.dataset.pcPreset = presetKey;
  const preset = PRESETS[presetKey] || PRESETS.cms;

  const wrap = document.createElement("div");
  wrap.className = "admin-image-field";
  wrap.dataset.preset = presetKey;
  input.parentNode.insertBefore(wrap, input);

  const previewWrap = document.createElement("div");
  previewWrap.className = "admin-image-preview-wrap";
  const preview = document.createElement("img");
  preview.className = "admin-image-preview";
  preview.alt = "";
  preview.hidden = true;
  previewWrap.appendChild(preview);

  const row = document.createElement("div");
  row.className = "admin-image-upload-row";
  const fileLabel = document.createElement("label");
  fileLabel.className = "admin-image-file-btn";
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/jpeg,image/png,image/webp";
  fileInput.hidden = true;
  const fileText = document.createElement("span");
  fileText.textContent = "Fotoğraf seç";
  fileLabel.append(fileInput, fileText);
  row.appendChild(fileLabel);

  const hint = document.createElement("p");
  hint.className = "admin-image-hint";
  hint.textContent = preset.hint;

  const status = document.createElement("p");
  status.className = "admin-image-status";
  status.setAttribute("role", "status");

  wrap.append(previewWrap, row, hint);
  wrap.appendChild(input);
  wrap.appendChild(status);

  input.removeAttribute("maxlength");
  input.classList.add("admin-image-url");
  if (!input.placeholder) input.placeholder = "veya görsel URL / dosya yolu yapıştırın";

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = "";
    if (!file) return;
    status.classList.remove("is-error");
    status.textContent = "Fotoğraf hazırlanıyor, bekleyin. Bitince Kaydet’e basmayı unutmayın.";
    const result = await processFile(file, presetKey);
    if (!result.ok) {
      status.classList.add("is-error");
      status.textContent = result.error;
      return;
    }
    input.value = result.src || result.dataUrl;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    syncField(input);
    status.classList.remove("is-error");
    status.textContent = result.message;
  });

  const applyDroppedFile = async (file) => {
    if (!file) return;
    status.classList.remove("is-error");
    status.textContent = "Fotoğraf hazırlanıyor, bekleyin. Bitince Kaydet’e basmayı unutmayın.";
    const result = await processFile(file, presetKey);
    if (!result.ok) {
      status.classList.add("is-error");
      status.textContent = result.error;
      return;
    }
    input.value = result.src || result.dataUrl;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    syncField(input);
    status.classList.remove("is-error");
    status.textContent = result.message;
  };

  wrap.addEventListener("dragover", (event) => {
    event.preventDefault();
    wrap.classList.add("is-drop");
  });
  wrap.addEventListener("dragleave", () => wrap.classList.remove("is-drop"));
  wrap.addEventListener("drop", (event) => {
    event.preventDefault();
    wrap.classList.remove("is-drop");
    applyDroppedFile(event.dataTransfer?.files?.[0]);
  });

  input.addEventListener("input", () => {
    const src = String(input.value || "").trim();
    if (!isStoredImage(src)) input.classList.remove("is-embedded");
    syncField(input);
    if (src && !isStoredImage(src)) {
      status.classList.remove("is-error");
      status.textContent = "";
    }
  });

  syncField(input);
  return input;
};

const openCmsPicker = ({ src = "", alt = "", preset = "cms" } = {}) =>
  new Promise((resolve) => {
    const config = PRESETS[preset] || PRESETS.cms;
    const overlay = document.createElement("div");
    overlay.className = "pc-image-modal";
    overlay.innerHTML = `
      <div class="pc-image-modal-card" role="dialog" aria-modal="true" aria-labelledby="pc-image-modal-title">
        <h3 id="pc-image-modal-title">Fotoğrafı değiştir</h3>
        <div class="admin-image-preview-wrap">
          <img class="admin-image-preview pc-image-modal-preview" alt="" hidden />
        </div>
        <label class="admin-image-file-btn">
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden />
          <span>Fotoğraf seç</span>
        </label>
        <p class="admin-image-hint">${config.hint}</p>
        <p class="admin-image-status" role="status"></p>
        <label for="pc-image-modal-url">veya görsel URL / dosya yolu yapıştırın</label>
        <input id="pc-image-modal-url" type="text" />
        <label for="pc-image-modal-alt">Alt metni</label>
        <input id="pc-image-modal-alt" type="text" maxlength="160" />
        <div class="admin-actions">
          <button class="btn" type="button" data-pc-image-apply>Uygula</button>
          <button class="btn" type="button" data-pc-image-cancel>İptal</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const preview = overlay.querySelector(".pc-image-modal-preview");
    const fileInput = overlay.querySelector('input[type="file"]');
    const urlInput = overlay.querySelector("#pc-image-modal-url");
    const altInput = overlay.querySelector("#pc-image-modal-alt");
    const status = overlay.querySelector(".admin-image-status");
    let currentSrc = src;
    let settled = false;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      overlay.remove();
      resolve(value);
    };

    const setPreview = async (next) => {
      currentSrc = next;
      if (!next) {
        preview.hidden = true;
        preview.removeAttribute("src");
        return;
      }
      let display = next;
      if (window.PCMedia && window.PCMedia.isMediaKey(next)) {
        try {
          display = await window.PCMedia.resolveSrc(next);
        } catch {
          display = next;
        }
      }
      preview.hidden = false;
      preview.src = display;
    };

    if (!isStoredImage(src)) urlInput.value = src || "";
    altInput.value = alt || "";
    if (src) setPreview(src);

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files && fileInput.files[0];
      fileInput.value = "";
      if (!file) return;
      status.classList.remove("is-error");
      status.textContent = "Fotoğraf hazırlanıyor, bekleyin. Bitince Kaydet’e basmayı unutmayın.";
      const result = await processFile(file, preset);
      if (!result.ok) {
        status.classList.add("is-error");
        status.textContent = result.error;
        return;
      }
      urlInput.value = "";
      setPreview(result.src || result.dataUrl);
      status.classList.remove("is-error");
      status.textContent = result.message;
    });

    overlay.querySelector("[data-pc-image-cancel]").addEventListener("click", () => finish(null));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) finish(null);
    });
    overlay.querySelector("[data-pc-image-apply]").addEventListener("click", () => {
      const typed = String(urlInput.value || "").trim();
      const nextSrc = typed || currentSrc;
      if (!nextSrc) {
        status.classList.add("is-error");
        status.textContent = "Kayıt olmadı. Önce bir fotoğraf seçin (Fotoğraf seç düğmesi) veya kutuya https:// ile başlayan resmi adresini yazın, sonra Kaydet’e basın.";
        return;
      }
      finish({ src: nextSrc, alt: String(altInput.value || "").trim() });
    });
  });

window.PCImageUpload = {
  PRESETS,
  MAX_INPUT_BYTES,
  processFile,
  bindField,
  syncField,
  guessPreset,
  openCmsPicker,
  formatBytes
};
})();
