(() => {
  "use strict";

  const token = () => localStorage.getItem("neuronex_access_token");
  const request = (url, options = {}) => fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...(options.headers || {}) },
  });

  /* ── Styles ── */
  const style = document.createElement("style");
  style.textContent = `
    #nx-settings { position: relative; z-index: 2; font: 14px/1.4 "DM Sans", sans-serif; color: #e7f1f5; }
    #nx-settings .nx-open {
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      white-space: nowrap !important;
    }
    #nx-settings .nx-open:hover {
      border-color: rgba(83, 224, 176, 0.45) !important;
      background: rgba(255, 255, 255, 0.12) !important;
      color: #ffffff !important;
      transform: translateY(-1px) scale(1.02) !important;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
    }
    #nx-settings .nx-open:hover svg {
      transform: rotate(45deg);
      color: #53e0b0;
    }
    #nx-settings .nx-open svg {
      transition: transform 0.25s ease, color 0.25s ease;
      color: #94a3b8;
      flex-shrink: 0;
    }

    /* Dialog overlay – attached to body, not #nx-settings, so it escapes z-index stacking */
    #nx-dialog-overlay { display: none; position: fixed; inset: 0; z-index: 99999; background: rgba(4,12,18,.80); backdrop-filter: blur(4px); padding: 20px; box-sizing: border-box; }
    #nx-dialog-overlay.open { display: flex; align-items: center; justify-content: center; }

    #nx-dialog-panel { position: relative; width: min(600px, 100%); max-height: 85vh; overflow-y: auto; border: 1px solid #315368; border-radius: 14px; padding: 24px; background: #0c1825; box-shadow: 0 24px 80px rgba(0,0,0,.6); font: 14px/1.4 "DM Sans", sans-serif; color: #e7f1f5; }

    /* CLOSE BUTTON – sticky at top-right of panel */
    #nx-close-btn { position: sticky; float: right; top: 0; margin: -4px -4px 8px 8px; display: flex; align-items: center; justify-content: center; gap: 6px; width: auto; padding: 6px 12px; border: 1.5px solid #e74c3c; border-radius: 8px; background: #1e0a09; color: #ff6b6b; cursor: pointer; font: 700 13px "DM Sans", sans-serif; z-index: 10; transition: background .15s, transform .15s; }
    #nx-close-btn:hover { background: #3b1212; transform: scale(1.04); }
    #nx-close-btn::before { content: "✕"; font-size: 14px; }

    #nx-dialog-panel h2 { margin: 0 0 5px; color: #e7f1f5; }
    #nx-dialog-panel .nx-muted { color: #8eabb9; font-size: 12px; }
    #nx-dialog-panel .nx-head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; margin-bottom: 4px; }
    #nx-dialog-panel form { display: grid; gap: 11px; margin: 20px 0; padding: 15px; border: 1px solid #294554; border-radius: 10px; }
    #nx-dialog-panel label { display: grid; gap: 5px; color: #cfe0e5; font-size: 12px; }
    #nx-dialog-panel input, #nx-dialog-panel select { width: 100%; box-sizing: border-box; border: 1px solid #315368; border-radius: 7px; padding: 9px; color: #e7f1f5; background: #09151f; font: inherit; }
    #nx-dialog-panel .nx-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    #nx-dialog-panel button[type="submit"] { border: 0; border-radius: 7px; padding: 10px; color: #062018; background: #53e0b0; cursor: pointer; font-weight: 700; font: 700 14px inherit; }
    #nx-dialog-panel .nx-provider { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; border-top: 1px solid #213847; }
    #nx-dialog-panel .nx-provider strong { display: block; }
    #nx-dialog-panel .nx-actions { display: flex; gap: 7px; }
    #nx-dialog-panel .nx-actions button { border: 1px solid #416778; border-radius: 6px; padding: 7px 9px; color: #d9f8ed; background: transparent; cursor: pointer; }
    #nx-dialog-panel .nx-actions .active { border-color: #53e0b0; color: #53e0b0; }
    #nx-dialog-panel .nx-message { min-height: 18px; color: #ffaaa0; }
    @media (max-width: 720px) { #nx-dialog-panel .nx-grid { grid-template-columns: 1fr; } #nx-settings .nx-open { padding: 0 10px; } }
  `;
  document.head.append(style);

  /* ── Button in topbar ── */
  const root = document.createElement("aside");
  root.id = "nx-settings";
  root.innerHTML = `<button class="nx-open" type="button" title="AI Settings">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
    <span>AI settings</span>
  </button>`;

  /* ── Dialog – appended directly to body so z-index is unrestricted ── */
  const overlay = document.createElement("div");
  overlay.id = "nx-dialog-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "nx-settings-title");
  overlay.innerHTML = `
    <section id="nx-dialog-panel">
      <button id="nx-close-btn" type="button" aria-label="Close settings">Close</button>
      <div class="nx-head">
        <div>
          <h2 id="nx-settings-title">AI providers</h2>
          <div class="nx-muted">Keys are encrypted on the NEURONEX server and never shown again.</div>
        </div>
      </div>
      <form>
        <div class="nx-grid">
          <label>Display name<input name="name" placeholder="Operations OpenAI" required maxlength="80"></label>
          <label>Provider<select name="provider"><option value="openai">OpenAI</option><option value="anthropic">Anthropic</option><option value="google">Google Gemini</option><option value="openai-compatible">OpenAI-compatible</option></select></label>
        </div>
        <div class="nx-grid">
          <label>Model<input name="model" value="gpt-4o-mini" required maxlength="120"></label>
          <label>API key<input name="api_key" type="password" autocomplete="new-password" required></label>
        </div>
        <label>Base URL <span class="nx-muted">Optional for standard providers</span><input name="base_url" placeholder="https://api.openai.com/v1"></label>
        <button type="submit">Save provider</button>
        <div class="nx-message" role="status"></div>
      </form>
      <div class="nx-muted">Saved providers</div>
      <div class="nx-list"></div>
    </section>
  `;
  if (!document.body.contains(overlay)) {
    document.body.append(overlay);
  }

  function placeInHeader() {
    const actionGroup = document.querySelector(".topbar-actions");
    if (!actionGroup) return false;
    if (!actionGroup.contains(root)) {
      actionGroup.append(root);
    }
    if (!document.body.contains(overlay)) {
      document.body.append(overlay);
    }
    return true;
  }

  // Place immediately
  placeInHeader();

  // Continuous observer to re-attach whenever React re-renders or changes views
  const observer = new MutationObserver(() => {
    placeInHeader();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Navigation and history event listeners for SPA routing
  window.addEventListener("popstate", placeInHeader);
  window.addEventListener("hashchange", placeInHeader);

  // Hook history pushState and replaceState
  const origPushState = window.history.pushState;
  if (origPushState) {
    window.history.pushState = function () {
      const res = origPushState.apply(this, arguments);
      window.setTimeout(placeInHeader, 50);
      window.setTimeout(placeInHeader, 250);
      return res;
    };
  }
  const origReplaceState = window.history.replaceState;
  if (origReplaceState) {
    window.history.replaceState = function () {
      const res = origReplaceState.apply(this, arguments);
      window.setTimeout(placeInHeader, 50);
      window.setTimeout(placeInHeader, 250);
      return res;
    };
  }

  window.setTimeout(placeInHeader, 400);
  window.setTimeout(placeInHeader, 1200);
  window.setTimeout(placeInHeader, 2400);

  const list = overlay.querySelector(".nx-list");
  const message = overlay.querySelector(".nx-message");
  const form = overlay.querySelector("form");
  const providerDefaults = { openai: "gpt-4o-mini", anthropic: "claude-3-5-sonnet-latest", google: "gemini-2.0-flash", "openai-compatible": "your-model" };

  function openDialog() { overlay.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeDialog() { overlay.classList.remove("open"); document.body.style.overflow = ""; }

  function showMessage(text) { message.textContent = text; }
  function escapeHtml(value) { return String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  async function loadProviders() {
    if (!token()) { list.innerHTML = `<p class="nx-muted">Sign in to save personal AI providers.</p>`; return; }
    const response = await request("/api/ai/providers");
    if (!response.ok) throw new Error("Could not load providers.");
    const result = await response.json();
    list.innerHTML = result.providers.length
      ? result.providers.map((p) => `<div class="nx-provider"><div><strong>${escapeHtml(p.name)}${p.is_active ? " · active" : ""}</strong><span class="nx-muted">${escapeHtml(p.provider)} · ${escapeHtml(p.model)} · ${escapeHtml(p.api_key)}</span></div><div class="nx-actions"><button data-activate="${p.id}" class="${p.is_active ? "active" : ""}" ${p.is_active ? "disabled" : ""}>Use</button><button data-delete="${p.id}" aria-label="Delete ${escapeHtml(p.name)}">Delete</button></div></div>`).join("")
      : `<p class="nx-muted">No providers saved yet. Chat will use demo mode.</p>`;
  }

  /* ── Event listeners ── */
  root.querySelector(".nx-open").addEventListener("click", async () => {
    openDialog(); showMessage("");
    try { await loadProviders(); } catch (e) { showMessage(e.message); }
  });

  // Close button
  document.getElementById("nx-close-btn").addEventListener("click", closeDialog);

  // Click outside panel closes dialog
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeDialog(); });

  // ESC key closes dialog
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("open")) closeDialog(); });

  // Provider selector change
  overlay.querySelector("[name=provider]").addEventListener("change", (e) => { form.elements.model.value = providerDefaults[e.target.value]; });

  // Form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); showMessage("");
    try {
      const response = await request("/api/ai/providers", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Could not save provider.");
      form.reset(); form.elements.model.value = providerDefaults.openai; showMessage("Provider saved."); await loadProviders();
    } catch (e) { showMessage(e.message); }
  });

  // Provider list actions
  list.addEventListener("click", async (e) => {
    const button = e.target.closest("button"); if (!button) return;
    try {
      const id = button.dataset.activate || button.dataset.delete;
      const response = await request(`/api/ai/providers/${id}${button.dataset.activate ? "/activate" : ""}`, { method: button.dataset.activate ? "POST" : "DELETE" });
      if (!response.ok) throw new Error("Provider update failed.");
      await loadProviders();
    } catch (e) { showMessage(e.message); }
  });
})();
