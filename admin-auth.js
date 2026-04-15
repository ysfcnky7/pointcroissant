const AUTH_STORAGE_KEY = "pc_admin_auth_v1";
const ADMIN_PASSWORD_SHA256 =
  "059b94dcfbe5e488d8ff25a1e0c43d0dc023931b7e3e771175ef58f1e04eeef8";
const ADMIN_ENTRY_KEY = "pc-ozel-giris-2026";

const lockScreen = document.getElementById("admin-lock-screen");
const authForm = document.getElementById("admin-auth-form");
const passwordInput = document.getElementById("admin-password");
const authFeedback = document.getElementById("admin-auth-feedback");
const adminApp = document.getElementById("admin-app");
const entryKey = new URLSearchParams(window.location.search).get("k");

if (entryKey !== ADMIN_ENTRY_KEY) {
  window.location.replace("index.html");
}

const loadAdminScripts = () => {
  ["cms-runtime.js", "cms-admin.js", "admin.js"].forEach((src) => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  });
};

const openAdminPanel = () => {
  if (lockScreen) lockScreen.hidden = true;
  if (adminApp) adminApp.hidden = false;
  loadAdminScripts();
};

const hashText = async (value) => {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

const hasValidSession = () => sessionStorage.getItem(AUTH_STORAGE_KEY) === "ok";

if (entryKey === ADMIN_ENTRY_KEY && hasValidSession()) {
  openAdminPanel();
} else if (entryKey === ADMIN_ENTRY_KEY && authForm) {
  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = passwordInput?.value || "";
    if (!password.trim()) {
      if (authFeedback) authFeedback.textContent = "Şifre gerekli.";
      return;
    }

    const hashed = await hashText(password.trim());
    if (hashed !== ADMIN_PASSWORD_SHA256) {
      if (authFeedback) authFeedback.textContent = "Şifre hatalı.";
      if (passwordInput) passwordInput.value = "";
      return;
    }

    sessionStorage.setItem(AUTH_STORAGE_KEY, "ok");
    openAdminPanel();
  });
}
