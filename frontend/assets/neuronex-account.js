(() => {
  "use strict";

  if (document.getElementById("neuronex-account")) return;

  const token = localStorage.getItem("neuronex_access_token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("neuronex_user") || "null");
  } catch {
    localStorage.removeItem("neuronex_user");
  }

  const escapeHtml = (value) => String(value || "").replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  const displayName = escapeHtml(user?.full_name || user?.email || "NEURONEX user");
  const email = escapeHtml(user?.email);
  const initial = escapeHtml((user?.full_name || user?.email || "N").charAt(0).toUpperCase());

  const root = document.createElement("aside");
  root.id = "neuronex-account";
  root.innerHTML = token && user
    ? `<button class="nx-account-button" type="button" aria-expanded="false" title="${displayName}">
        <span class="nx-account-mark">${initial}</span>
        <span class="nx-account-label">${displayName}</span>
        <svg class="nx-account-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="nx-account-menu" hidden>
        <strong>${displayName}</strong>
        <span>${email}</span>
        <a href="/login">Account & sign in</a>
        <button type="button" data-logout>Sign out</button>
      </div>`
    : `<a class="nx-account-button" href="/login" title="Sign In">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Sign in</span>
      </a>`;

  const style = document.createElement("style");
  style.textContent = `
    #neuronex-account { position: relative; z-index: 2; color: #e7f1f5; font: 14px/1.4 "DM Sans", sans-serif; }
    #neuronex-account .nx-account-button {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      height: 32px !important;
      min-height: 32px !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: 9999px !important;
      padding: 0 13px !important;
      color: #cbd5e1 !important;
      background: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: blur(10px) !important;
      -webkit-backdrop-filter: blur(10px) !important;
      cursor: pointer !important;
      font-family: 'DM Sans', -apple-system, sans-serif !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      letter-spacing: 0.03em !important;
      text-decoration: none !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      white-space: nowrap !important;
    }
    #neuronex-account .nx-account-button:hover {
      border-color: rgba(83, 224, 176, 0.45) !important;
      background: rgba(255, 255, 255, 0.12) !important;
      color: #ffffff !important;
      transform: translateY(-1px) scale(1.02) !important;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
    }
    #neuronex-account .nx-account-button svg {
      transition: color 0.2s ease, transform 0.2s ease;
      color: #94a3b8;
      flex-shrink: 0;
    }
    #neuronex-account .nx-account-button:hover svg {
      color: #53e0b0;
    }
    #neuronex-account .nx-account-mark {
      display: grid;
      place-items: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      color: #062018;
      background: #53e0b0;
      font-size: 10px;
      font-weight: 700;
    }
    #neuronex-account .nx-account-label {
      font-size: 11px;
      font-weight: 600;
    }
    #neuronex-account .nx-account-chevron {
      opacity: 0.7;
      transition: transform 0.2s ease;
    }
    #neuronex-account .nx-account-button[aria-expanded="true"] .nx-account-chevron {
      transform: rotate(180deg);
    }
    #neuronex-account .nx-account-menu {
      position: absolute;
      right: 0;
      top: calc(100% + 8px);
      min-width: 190px;
      border: 1px solid rgba(83, 224, 176, 0.25);
      border-radius: 12px;
      padding: 12px;
      background: rgba(10, 22, 17, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 12px;
      z-index: 1000;
    }
    #neuronex-account .nx-account-menu strong { color: #e7f1f5; font-size: 13px; }
    #neuronex-account .nx-account-menu span { color: #8eabb9; font-size: 11px; }
    #neuronex-account .nx-account-menu a,
    #neuronex-account .nx-account-menu button[data-logout] {
      color: #cbd5e1;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      padding: 6px 8px;
      border-radius: 6px;
      font: inherit;
      text-decoration: none;
      transition: background 0.15s ease, color 0.15s ease;
    }
    #neuronex-account .nx-account-menu a:hover,
    #neuronex-account .nx-account-menu button[data-logout]:hover {
      color: #53e0b0;
      background: rgba(83, 224, 176, 0.1);
    }
  `;
  document.head.append(style);

  function placeInHeader() {
    const actionGroup = document.querySelector(".topbar-actions");
    if (!actionGroup) return false;
    actionGroup.querySelector(".avatar-button")?.remove();
    if (!actionGroup.contains(root)) actionGroup.append(root);
    return true;
  }

  // Try immediately, then keep watching — never fall back to body
  placeInHeader();
  const headerObserver = new MutationObserver(() => placeInHeader());
  headerObserver.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(placeInHeader, 1200);

  const button = root.querySelector(".nx-account-button");
  const menu = root.querySelector(".nx-account-menu");
  if (menu) {
    button.addEventListener("click", () => {
      const isOpen = menu.hidden;
      menu.hidden = !isOpen;
      button.setAttribute("aria-expanded", String(isOpen));
    });
    root.querySelector("[data-logout]").addEventListener("click", () => {
      localStorage.removeItem("neuronex_access_token");
      localStorage.removeItem("neuronex_user");
      window.location.href = "/login";
    });
  }
})();