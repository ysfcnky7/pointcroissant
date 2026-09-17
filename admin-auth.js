const AUTH_STORAGE_KEY = "pc_admin_auth_v1";
const PASS_HASH_KEY = "pc_admin_pass_hash_v1";
const ADMIN_PASSWORD_SHA256 =
  "059b94dcfbe5e488d8ff25a1e0c43d0dc023931b7e3e771175ef58f1e04eeef8";

const AUTH_TEXT = {
  tr: {
    needPassword:
      "Giriş olmadı. Şifre kutusu boş. Klavyeden şifreyi yazın, sonra Giriş Yap’a basın. Şifreyi kimseyle paylaşmayın.",
    wrongPassword:
      "Giriş olmadı. Yazılan şifre yanlış. Kutuyu silip tekrar yazın. Caps Lock (büyük harf kilidi) açık olmasın. Birkaç kez yanlış olursa sayfayı yenileyip tekrar deneyin."
  },
  en: {
    needPassword:
      "You did not enter. The password box is empty. Type the password, then click Log in. Do not share the password with anyone.",
    wrongPassword:
      "You did not enter. The password is wrong. Clear the box and type again. Caps Lock should be off. If it fails several times, refresh the page and try again."
  },
  ru: {
    needPassword:
      "Вход не выполнен. Поле пароля пустое. Введите пароль и нажмите Войти. Никому не сообщайте пароль.",
    wrongPassword:
      "Вход не выполнен. Пароль неверный. Очистите поле и введите снова. Caps Lock должен быть выключен. Если несколько раз ошибка — обновите страницу."
  },
  ar: {
    needPassword:
      "لم يتم الدخول. خانة كلمة المرور فارغة. اكتب كلمة المرور ثم اضغط دخول. لا تشاركوا كلمة المرور مع أحد.",
    wrongPassword:
      "لم يتم الدخول. كلمة المرور خاطئة. امسحوا الخانة واكتبوا من جديد. تأكدوا أن Caps Lock مغلق. إن تكرر الخطأ حدّثوا الصفحة."
  },
  de: {
    needPassword:
      "Kein Zugang. Das Passwortfeld ist leer. Tippen Sie das Passwort und klicken Sie auf Anmelden. Teilen Sie das Passwort mit niemandem.",
    wrongPassword:
      "Kein Zugang. Das Passwort ist falsch. Leeren Sie das Feld und tippen Sie erneut. Caps Lock sollte aus sein. Bei mehreren Fehlern die Seite neu laden."
  }
};

const getAuthLang = () => {
  if (typeof window.__pcGetLang === "function") return window.__pcGetLang();
  return document.documentElement.lang || "tr";
};

const authText = (key) => {
  const pack = AUTH_TEXT[getAuthLang()] || AUTH_TEXT.tr;
  return pack[key] || AUTH_TEXT.tr[key] || key;
};

const setAuthFeedback = (key, kind = "error") => {
  if (!authFeedback) return;
  authFeedback.textContent = authText(key);
  authFeedback.classList.remove("is-ok", "is-warn", "is-error");
  if (kind) authFeedback.classList.add(`is-${kind}`);
};
const lockScreen = document.getElementById("admin-lock-screen");
const authForm = document.getElementById("admin-auth-form");
const passwordInput = document.getElementById("admin-password");
const authFeedback = document.getElementById("admin-auth-feedback");
const adminApp = document.getElementById("admin-app");

const loadAdminScripts = () => {
  ["image-upload.js", "cms-runtime.js", "cms-admin.js", "admin.js"].forEach((src) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    document.body.appendChild(script);
  });
};

const openAdminPanel = () => {
  if (lockScreen) lockScreen.hidden = true;
  if (adminApp) adminApp.hidden = false;
  loadAdminScripts();
};

const expectedHash = () => localStorage.getItem(PASS_HASH_KEY) || ADMIN_PASSWORD_SHA256;

const hashText = async (value) => {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

window.PCAdminAuth = {
  verify: async (password) => (await hashText(String(password || "").trim())) === expectedHash(),
  setPassword: async (password) => {
    localStorage.setItem(PASS_HASH_KEY, await hashText(String(password || "").trim()));
  },
  logout: () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    location.reload();
  }
};

const hasValidSession = () => sessionStorage.getItem(AUTH_STORAGE_KEY) === "ok";

if (hasValidSession()) {
  openAdminPanel();
} else if (authForm) {
  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = passwordInput?.value || "";
    if (!password.trim()) {
      setAuthFeedback("needPassword", "error");
      return;
    }

    const hashed = await hashText(password.trim());
    if (hashed !== expectedHash()) {
      setAuthFeedback("wrongPassword", "error");
      if (passwordInput) passwordInput.value = "";
      return;
    }

    sessionStorage.setItem(AUTH_STORAGE_KEY, "ok");
    openAdminPanel();
  });
}
