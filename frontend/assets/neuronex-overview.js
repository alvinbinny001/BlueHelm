(() => {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    .primary-button { box-shadow: 0 10px 24px rgba(25, 77, 63, .16); transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
    .primary-button:hover { transform: translateY(-2px); box-shadow: 0 16px 30px rgba(25, 77, 63, .24); }
    .topnav-ai-link { border: none !important; outline: none !important; border-radius: 999px !important; padding: 8px 13px !important; color: #53e0b0 !important; background: rgba(83, 224, 176, .13) !important; transition: background .2s ease, transform .2s ease !important; }
    .topnav-ai-link:hover { border: none !important; outline: none !important; background: rgba(83, 224, 176, .24) !important; transform: translateY(-1px); }
    .fleetmind-banner { padding-top: 4.75rem !important; padding-bottom: 4.75rem !important; padding-left: clamp(1.5rem, 3.5vw, 3rem) !important; padding-right: clamp(1.5rem, 3.5vw, 3rem) !important; margin: 0 !important; border-top: 1px solid rgba(83, 224, 176, 0.18) !important; border-bottom: 1px solid rgba(83, 224, 176, 0.14) !important; position: relative; overflow: hidden; }
    .fleetmind-banner-inner { display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 2.75rem !important; max-width: 1320px !important; margin: 0 auto !important; width: 100% !important; box-sizing: border-box !important; }
    .fleetmind-banner-copy { flex: 0 0 360px !important; max-width: 380px !important; display: flex !important; flex-direction: column !important; justify-content: center !important; }
    .fleetmind-banner-eyebrow { display: inline-flex !important; align-items: center !important; gap: 0.5rem !important; margin-bottom: 0.95rem !important; font-size: 0.74rem !important; font-weight: 700 !important; letter-spacing: 0.14em !important; text-transform: uppercase !important; color: #53e0b0 !important; padding: 6px 14px !important; border-radius: 999px !important; background: rgba(83, 224, 176, 0.09) !important; border: 1px solid rgba(83, 224, 176, 0.26) !important; width: fit-content !important; box-shadow: 0 2px 8px rgba(83, 224, 176, 0.08) !important; }
    .fleetmind-banner-copy h2 { margin: 0 0 0.85rem !important; font-size: clamp(2rem, 2.4vw, 2.45rem) !important; font-weight: 800 !important; line-height: 1.18 !important; letter-spacing: -0.025em !important; background: linear-gradient(135deg, #ffffff 30%, #53e0b0 100%) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }
    .fleetmind-banner-copy p { margin: 0 !important; color: #94a3b8 !important; font-size: 0.93rem !important; line-height: 1.65 !important; font-weight: 400 !important; }
    .fleetmind-banner-links { display: grid !important; grid-template-columns: repeat(5, minmax(0, 1fr)) !important; flex: 1 !important; gap: 0.95rem !important; align-items: stretch !important; }
    .fleetmind-module-card { min-width: 0 !important; min-height: 165px !important; padding: 1.5rem 1.15rem 1.35rem !important; border-radius: 16px !important; border: 1px solid rgba(83, 224, 176, 0.2) !important; background: linear-gradient(165deg, rgba(12, 28, 21, 0.72) 0%, rgba(6, 16, 12, 0.84) 100%) !important; -webkit-backdrop-filter: blur(14px) !important; backdrop-filter: blur(14px) !important; box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; transition: transform .25s cubic-bezier(0.16, 1, 0.3, 1), border-color .25s ease, box-shadow .25s ease, background .25s ease !important; text-decoration: none !important; }
    .fleetmind-module-card:hover { transform: translateY(-4px) !important; border-color: rgba(83, 224, 176, 0.65) !important; background: linear-gradient(165deg, rgba(16, 42, 32, 0.85) 0%, rgba(9, 22, 17, 0.92) 100%) !important; box-shadow: 0 16px 36px -6px rgba(0, 0, 0, 0.55), 0 0 24px rgba(83, 224, 176, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important; }
    .fleetmind-module-icon { margin-bottom: 0.95rem !important; font-size: 1.65rem !important; line-height: 1 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; width: 44px !important; height: 44px !important; border-radius: 12px !important; background: rgba(83, 224, 176, 0.08) !important; border: 1px solid rgba(83, 224, 176, 0.18) !important; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important; transition: transform 0.2s ease, background 0.2s ease !important; }
    .fleetmind-module-card:hover .fleetmind-module-icon { transform: scale(1.06) !important; background: rgba(83, 224, 176, 0.15) !important; border-color: rgba(83, 224, 176, 0.35) !important; }
    .fleetmind-module-label { color: #f8fafc !important; font-size: 0.92rem !important; font-weight: 700 !important; letter-spacing: -0.01em !important; margin-bottom: 0.35rem !important; display: block !important; white-space: nowrap !important; text-overflow: ellipsis !important; overflow: hidden !important; }
    .fleetmind-module-sub { color: #8fa6b8 !important; font-size: 0.78rem !important; line-height: 1.45 !important; display: block !important; }
    .signal-overview { padding-top: 3.5rem !important; padding-bottom: 4.5rem !important; margin-top: 0 !important; border-top: none !important; }
    .signal-overview:before { display: none !important; }
    @media (max-width: 1180px) {
      .fleetmind-banner-inner { gap: 1.75rem !important; }
      .fleetmind-banner-links { gap: 0.75rem !important; }
    }
    @media (max-width: 1024px) {
      .fleetmind-banner { padding-top: 3.5rem !important; padding-bottom: 3.5rem !important; }
      .fleetmind-banner-inner { flex-direction: column !important; align-items: stretch !important; gap: 2rem !important; }
      .fleetmind-banner-copy { max-width: 100% !important; flex: 1 1 auto !important; }
      .fleetmind-banner-links { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important; gap: 0.85rem !important; }
    }
    @media (max-width: 640px) {
      .fleetmind-banner { padding-top: 2.75rem !important; padding-bottom: 2.75rem !important; }
      .fleetmind-banner-links { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
      .fleetmind-module-card { min-height: 145px !important; padding: 1.25rem 1rem !important; }
    }
    @media (max-width: 720px) {
      .topnav-ai-link { padding: 7px 10px !important; }
      table { display: block; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
      table thead, table tbody { min-width: 680px; }
      .hero-image-wrap { overflow: hidden; }
    }
    /* ── Vessel card layout fix ── */
    .ai-vessel-card {
      min-width: 0 !important;
      box-sizing: border-box !important;
    }
    /* Give score bars enough right space for the absolute score labels */
    .ai-vessel-scores {
      padding-right: 36px !important;
    }
    /* Ensure score labels are always visible */
    .ai-score-bar-label {
      right: -34px !important;
      font-size: .72rem !important;
      font-weight: 600 !important;
      color: #94a3b8 !important;
    }
    /* Fix long reason/port-error text wrapping */
    .ai-vessel-reason {
      overflow-wrap: break-word !important;
      word-break: break-word !important;
      white-space: normal !important;
      min-width: 0 !important;
      max-width: 100% !important;
      padding-top: 4px !important;
    }
    .ai-vessel-reason span,
    .ai-vessel-reason--warn {
      overflow-wrap: break-word !important;
      word-break: break-word !important;
      min-width: 0 !important;
      flex: 1 1 0 !important;
    }
    /* ── Freight rate card – dark text on lime background ── */
    .signal-card-lime .signal-value {
      color: #0d1a0f !important;
    }
    .signal-card-lime .signal-value small {
      color: #1a3320 !important;
      opacity: 1 !important;
    }
    /* ── Route SVG label overlap fix ── */
    /* Hide the static SVG text labels (ORIGIN / DESTINATION) that overlap
       with the animated waypoint port labels rendered by route-animator.js */
    svg.route-doodle text {
      display: none !important;
    }
    /* ── Remove default white spinner arrows on number inputs ── */
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none !important;
      appearance: none !important;
      margin: 0 !important;
      opacity: 0 !important;
    }
    input[type=number] {
      -moz-appearance: textfield !important;
    }
  `;
  document.head.append(style);

  window.setTimeout(() => {
    const actionGroup = document.querySelector(".topbar-actions");
    const account = document.getElementById("neuronex-account");
    const settings = document.getElementById("nx-settings");
    if (actionGroup && account) {
      actionGroup.querySelector(".avatar-button")?.remove();
      actionGroup.append(account);
    }
    if (actionGroup && settings) actionGroup.append(settings);
  }, 1600);

  /* ── Hamburger menu for mobile ── */
  function injectHamburger() {
    const topbar = document.querySelector(".topbar");
    const topnav  = document.querySelector(".topnav");
    if (!topbar || !topnav || document.getElementById("nx-hamburger")) return false;

    const btn = document.createElement("button");
    btn.id = "nx-hamburger";
    btn.className = "mobile-menu-btn";
    btn.setAttribute("aria-label", "Toggle navigation");
    btn.innerHTML = "&#9776;"; // ☰

    btn.addEventListener("click", () => {
      const open = topnav.classList.toggle("open");
      btn.innerHTML = open ? "&#10005;" : "&#9776;";
      btn.setAttribute("aria-expanded", String(open));
    });

    // Insert before topbar-actions so it appears on right side in mobile
    const actions = topbar.querySelector(".topbar-actions");
    if (actions) {
      topbar.insertBefore(btn, actions);
    } else {
      topbar.append(btn);
    }

    // Close nav when a link is clicked
    topnav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        topnav.classList.remove("open");
        btn.innerHTML = "&#9776;";
      }
    });

    return true;
  }

  if (!injectHamburger()) {
    const obs = new MutationObserver(() => {
      if (injectHamburger()) obs.disconnect();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
})();