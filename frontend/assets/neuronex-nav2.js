/**
 * NEURONEX — Navigation 2 (React Bits Pro Style)
 * Centered rounded floating navigation capsule with frosted glass effect
 * and smooth expanding card dropdowns.
 */
(() => {
  "use strict";

  /* ── 1. Inject Styles ── */
  const style = document.createElement("style");
  style.id = "neuronex-nav2-styles";
  style.textContent = `
    /* ── Home page body adjustment for floating navbar (seamless overview hero) ── */
    body:has(header.topbar) {
      padding-top: 0 !important;
      margin-top: 0 !important;
    }

    body:has(header.topbar):not(:has(#dashboard)) {
      padding-top: 86px !important;
    }

    /* ── AI / Forecast Dashboard route reset ── */
    body:has(.ai-layout),
    body.ai-route,
    .ai-layout {
      padding-top: 0 !important;
      margin-top: 0 !important;
      background-color: #080e1a !important;
    }

    /* ── Topbar: Centered Rounded Glass Capsule ── */
    header.topbar {
      position: fixed !important;
      top: 14px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: min(1260px, calc(100% - 32px)) !important;
      height: 58px !important;
      border-radius: 9999px !important;
      background: rgba(10, 22, 17, 0.82) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      border: 1px solid rgba(83, 224, 176, 0.25) !important;
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.25), 0 0 20px rgba(83, 224, 176, 0.08) !important;
      padding: 0 20px 0 14px !important;
      margin: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      z-index: 10000 !important;
      box-sizing: border-box !important;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    /* Subtle hover glow on pill nav */
    header.topbar:hover {
      border-color: rgba(83, 224, 176, 0.4) !important;
      box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.32), 0 0 28px rgba(83, 224, 176, 0.14) !important;
    }

    /* ── Brand styling ── */
    header.topbar .brand {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      text-decoration: none !important;
      color: #f1f5f9 !important;
      cursor: pointer !important;
      flex-shrink: 0 !important;
    }

    header.topbar .brand-mark {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      min-height: 32px !important;
      border-radius: 50% !important;
      overflow: hidden !important;
      background: #061118 !important;
      border: 1.5px solid rgba(83, 224, 176, 0.35) !important;
      box-shadow: 0 0 10px rgba(83, 224, 176, 0.2), 0 2px 8px rgba(0, 0, 0, 0.4) !important;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
      flex-shrink: 0 !important;
      box-sizing: border-box !important;
    }

    header.topbar .brand-mark img {
      width: 100% !important;
      height: 100% !important;
      border-radius: 50% !important;
      object-fit: cover !important;
      transform: scale(1.12) !important;
      display: block !important;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    header.topbar .brand:hover .brand-mark {
      border-color: #53e0b0 !important;
      box-shadow: 0 0 16px rgba(83, 224, 176, 0.5), 0 2px 10px rgba(0, 0, 0, 0.5) !important;
      transform: scale(1.05) !important;
    }

    header.topbar .brand:hover .brand-mark img {
      transform: scale(1.22) rotate(-4deg) !important;
    }

    header.topbar .brand-name {
      font-family: 'Space Grotesk', -apple-system, sans-serif !important;
      font-size: 15px !important;
      font-weight: 800 !important;
      letter-spacing: 0.04em !important;
      color: #f8fafc !important;
      text-transform: uppercase !important;
      margin: 0 !important;
    }

    /* ── Centered Navigation Items ── */
    header.topbar .topnav {
      position: static !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      margin: 0 auto !important;
      padding: 0 !important;
      background: transparent !important;
      border: none !important;
    }

    header.topbar .topnav a {
      position: relative !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 5px !important;
      padding: 7px 14px !important;
      border-radius: 9999px !important;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
      color: #94a3b8 !important;
      text-decoration: none !important;
      cursor: pointer !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      white-space: nowrap !important;
    }

    header.topbar .topnav a:hover,
    header.topbar .topnav a.nx-nav-active {
      color: #53e0b0 !important;
      background: rgba(83, 224, 176, 0.12) !important;
    }

    /* Dropdown indicator chevron */
    .nx-chevron {
      display: inline-block !important;
      font-size: 8px !important;
      opacity: 0.65 !important;
      transition: transform 0.25s ease !important;
    }

    .nx-nav-active .nx-chevron,
    header.topbar .topnav a:hover .nx-chevron {
      transform: rotate(180deg) !important;
      opacity: 1 !important;
    }

    /* ── Topbar Actions (Right Pill) ── */
    header.topbar .topbar-actions {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      flex-shrink: 0 !important;
    }

    header.topbar .live-status {
      display: none !important; /* Hide old text for cleaner pill nav */
    }

    /* ── Topbar Action Buttons (Sign In & AI Settings) ── */
    header.topbar .topbar-actions #nx-settings,
    header.topbar .topbar-actions #neuronex-account {
      display: inline-flex !important;
      align-items: center !important;
    }

    header.topbar .topbar-actions #nx-settings .nx-open,
    header.topbar .topbar-actions #neuronex-account .nx-account-button {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      height: 32px !important;
      min-height: 32px !important;
      max-height: 32px !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: 9999px !important;
      padding: 0 14px !important;
      color: #cbd5e1 !important;
      background: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      cursor: pointer !important;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      letter-spacing: 0.03em !important;
      text-decoration: none !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      white-space: nowrap !important;
      box-sizing: border-box !important;
    }

    header.topbar .topbar-actions #nx-settings .nx-open:hover,
    header.topbar .topbar-actions #neuronex-account .nx-account-button:hover {
      border-color: rgba(83, 224, 176, 0.45) !important;
      background: rgba(255, 255, 255, 0.12) !important;
      color: #ffffff !important;
      transform: translateY(-1px) scale(1.02) !important;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
    }

    header.topbar .topbar-actions #nx-settings .nx-open:active,
    header.topbar .topbar-actions #neuronex-account .nx-account-button:active {
      transform: translateY(0) scale(0.98) !important;
    }

    header.topbar .topbar-actions #nx-settings .nx-open svg,
    header.topbar .topbar-actions #neuronex-account .nx-account-button svg {
      transition: color 0.2s ease, transform 0.25s ease !important;
      color: #94a3b8 !important;
      flex-shrink: 0 !important;
    }

    header.topbar .topbar-actions #nx-settings .nx-open:hover svg,
    header.topbar .topbar-actions #neuronex-account .nx-account-button:hover svg {
      color: #53e0b0 !important;
    }

    header.topbar .topbar-actions #nx-settings .nx-open:hover svg {
      transform: rotate(45deg) !important;
    }

    /* ── Outer wrapper of topnav-ai-link must NOT have background or border ── */
    header.topbar .topnav a:has(.topnav-ai-link),
    header.topbar .topnav a:has(.topnav-ai-link):hover,
    header.topbar .topnav a:has(.topnav-ai-link):focus {
      background: transparent !important;
      border: none !important;
      outline: none !important;
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
    }

    /* ── The NEURONEX AI button (Completely borderless, no outline) ── */
    header.topbar .topnav-ai-link {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      background: rgba(83, 224, 176, 0.14) !important;
      border: none !important;
      outline: none !important;
      border-radius: 9999px !important;
      padding: 7px 16px !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      letter-spacing: 0.06em !important;
      color: #53e0b0 !important;
      box-shadow: none !important;
      position: relative !important;
      overflow: hidden !important;
      cursor: pointer !important;
      text-decoration: none !important;
      transition: background 0.25s ease, color 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    /* Light beam / shimmer sweep across the button */
    header.topbar .topnav-ai-link::after {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: -120% !important;
      width: 60% !important;
      height: 100% !important;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent) !important;
      transform: skewX(-25deg) !important;
      transition: none !important;
      pointer-events: none !important;
    }

    header.topbar .topnav-ai-link:hover {
      background: #53e0b0 !important;
      color: #062018 !important; /* Premium dark text on emerald pill */
      border: none !important;
      outline: none !important;
      box-shadow: none !important; /* Cancel outline and glow completely */
      transform: translateY(-2px) scale(1.04) !important;
    }

    header.topbar .topnav-ai-link:hover::after {
      left: 160% !important;
      transition: left 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    header.topbar .topnav-ai-link:active {
      transform: translateY(0) scale(0.97) !important;
    }

    /* ── Expanding Card Dropdown Container ── */
    #nx-dropdown-container {
      position: absolute;
      top: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%) translateY(8px);
      background: rgba(10, 22, 17, 0.94);
      -webkit-backdrop-filter: blur(28px) saturate(200%);
      backdrop-filter: blur(28px) saturate(200%);
      border: 1px solid rgba(83, 224, 176, 0.25);
      border-radius: 20px;
      box-shadow: 0 24px 64px -8px rgba(0, 0, 0, 0.65), 0 0 32px rgba(83, 224, 176, 0.08);
      padding: 22px 24px;
      width: max-content;
      min-width: 490px;
      max-width: 640px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 99999;
      box-sizing: border-box;
    }

    /* Invisible hover bridge to prevent closing when moving cursor */
    #nx-dropdown-container::before {
      content: '';
      position: absolute;
      top: -14px;
      left: 0;
      right: 0;
      height: 14px;
      background: transparent;
    }

    #nx-dropdown-container.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }

    .nx-dropdown-card {
      display: none;
      animation: nxCardFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .nx-dropdown-card.active {
      display: block;
    }

    @keyframes nxCardFadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }

    .nx-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(83, 224, 176, 0.12);
      padding-bottom: 12px;
      margin-bottom: 14px;
    }

    .nx-card-category {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #53e0b0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .nx-card-kicker {
      font-size: 11px;
      color: #64748b;
    }

    .nx-card-items-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .nx-card-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      transition: all 0.18s ease;
    }

    .nx-card-item:hover {
      background: rgba(83, 224, 176, 0.08);
      border-color: rgba(83, 224, 176, 0.3);
      transform: translateY(-2px);
    }

    .nx-card-item-icon {
      font-size: 20px;
      line-height: 1;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .nx-card-item-text {
      flex: 1;
    }

    .nx-card-item-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0 0 3px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nx-card-item:hover .nx-card-item-title {
      color: #53e0b0;
    }

    .nx-card-item-desc {
      font-size: 11px;
      line-height: 1.45;
      color: #8fa0a8;
      margin: 0;
    }

    .nx-card-footer-strip {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid rgba(83, 224, 176, 0.12);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: #94a3b8;
    }

    .nx-card-footer-strip a {
      color: #53e0b0;
      text-decoration: none;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .nx-card-footer-strip a:hover {
      text-decoration: underline;
    }

    /* ── Mobile adjustments ── */
    @media (max-width: 900px) {
      header.topbar {
        width: calc(100% - 20px) !important;
        top: 10px !important;
        padding: 0 14px !important;
      }
      header.topbar .topnav {
        display: none !important; /* Managed by hamburger */
      }
      header.topbar .topnav.open {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        position: absolute !important;
        top: calc(100% + 8px) !important;
        left: 0 !important;
        right: 0 !important;
        background: rgba(10, 22, 17, 0.95) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(83, 224, 176, 0.25) !important;
        border-radius: 18px !important;
        padding: 14px !important;
        gap: 8px !important;
      }
      #nx-dropdown-container {
        display: none !important; /* Dropdowns simplified on mobile */
      }
    }
  `;
  document.head.appendChild(style);

  /* ── 2. Dropdown Cards Content Data ── */
  const cardsData = {
    dashboard: {
      category: "Market Overview",
      kicker: "Cognitive Fleet Telemetry",
      target: "#dashboard",
      items: [
        {
          icon: "📊",
          title: "Spot Rate Signals",
          desc: "Live coastal & global charter rates, bunker indices, and spread forecasting.",
          target: "#dashboard"
        },
        {
          icon: "⚓",
          title: "Indian Port Telemetry",
          desc: "Turnaround metrics & real-time congestion for JNPT, Mundra, Chennai & Vizag.",
          target: "#dashboard"
        },
        {
          icon: "🗺️",
          title: "Active Corridor Map",
          desc: "Dynamic voyage visualization across Indian maritime trade corridors.",
          target: "#dashboard"
        },
        {
          icon: "📈",
          title: "Demurrage Risk Index",
          desc: "Predictive delay and demurrage risk probabilities per port call.",
          target: "#dashboard"
        }
      ],
      footerLinkText: "Open Full Overview & Signals →",
      footerLinkTarget: "#dashboard"
    },
    brief: {
      category: "Freight Procurement",
      kicker: "Smart Tender & Chartering",
      target: "#brief",
      items: [
        {
          icon: "💵",
          title: "Spot Rate Calculator",
          desc: "Instant fixture estimation calibrated by cargo volume, route, and bunker prices.",
          target: "#brief"
        },
        {
          icon: "📋",
          title: "Smart RFQ Bids",
          desc: "Automated charter tender generator with laytime and demurrage terms.",
          target: "#brief"
        },
        {
          icon: "⚖️",
          title: "Spot vs. COA Comparison",
          desc: "Optimize long-term contracts versus volatile spot exposure.",
          target: "#brief"
        },
        {
          icon: "⚡",
          title: "Procurement Copilot",
          desc: "AI-assisted negotiation suggestions for freight and vessel fixtures.",
          target: "#brief"
        }
      ],
      footerLinkText: "Configure New Freight Brief →",
      footerLinkTarget: "#brief"
    },
    fleet: {
      category: "Vessels & Fleet",
      kicker: "Autonomous Allocation",
      target: "#fleet",
      items: [
        {
          icon: "🚢",
          title: "Active Fleet Allocation",
          desc: "Capesize, Panamax, Supramax and container vessel operational readiness.",
          target: "#fleet"
        },
        {
          icon: "📏",
          title: "Draft & Gear Matching",
          desc: "Filter vessels by max draft, LOA, beam, and crane capacity constraints.",
          target: "#fleet"
        },
        {
          icon: "📡",
          title: "AIS Tracking Stream",
          desc: "Real-time vessel position, speed over ground, and ETA calculations.",
          target: "#fleet"
        },
        {
          icon: "🛡️",
          title: "Port Clearance Viability",
          desc: "Automated verification against Indian port channel restrictions.",
          target: "#fleet"
        }
      ],
      footerLinkText: "View Complete Vessel Fleet →",
      footerLinkTarget: "#fleet"
    },
    simulator: {
      category: "Voyage Simulator",
      kicker: "Hydrodynamic & Eco-Routing",
      target: "#simulator",
      items: [
        {
          icon: "🧭",
          title: "Eco-Voyage Routing",
          desc: "Optimal waypoints balancing transit time, weather, and fuel burn.",
          target: "#simulator"
        },
        {
          icon: "🌱",
          title: "IMO CII Calculator",
          desc: "Carbon Intensity Indicator ratings and EU ETS / carbon tax estimates.",
          target: "#simulator"
        },
        {
          icon: "🌊",
          title: "Hydrodynamic Drag",
          desc: "Speed-consumption curves incorporating hull fouling and sea states.",
          target: "#simulator"
        },
        {
          icon: "⛽",
          title: "Bunker Optimization",
          desc: "Strategic bunkering stops calculated along the voyage trajectory.",
          target: "#simulator"
        }
      ],
      footerLinkText: "Launch Voyage Simulator →",
      footerLinkTarget: "#simulator"
    },
    about: {
      category: "About NEURONEX",
      kicker: "Smart India Hackathon 2024",
      target: "#about",
      items: [
        {
          icon: "💡",
          title: "Platform Mission",
          desc: "Transforming Indian maritime logistics through predictive ML intelligence.",
          target: "#about"
        },
        {
          icon: "🇮🇳",
          title: "SAGARMALA & Maritime 2030",
          desc: "Built to accelerate national logistics efficiency and port digitization.",
          target: "#about"
        },
        {
          icon: "📈",
          title: "Key Impact Metrics",
          desc: "6+ Major ports, 40% faster decisioning, 15% fuel and carbon cuts.",
          target: "#about"
        },
        {
          icon: "⚡",
          title: "Cognitive Architecture",
          desc: "Multi-agent coordination fusing ML forecasting with hydrodynamic simulation.",
          target: "#about"
        }
      ],
      footerLinkText: "Read Complete About Us Story →",
      footerLinkTarget: "#about"
    }
  };

  /* ── 3. Build Dropdown HTML Element ── */
  let dropdownEl = document.getElementById("nx-dropdown-container");
  if (!dropdownEl) {
    dropdownEl = document.createElement("div");
    dropdownEl.id = "nx-dropdown-container";
    dropdownEl.innerHTML = Object.entries(cardsData).map(([key, data]) => `
      <div class="nx-dropdown-card" data-card="${key}">
        <div class="nx-card-header">
          <div class="nx-card-category">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#53e0b0;box-shadow:0 0 6px #53e0b0;"></span>
            ${data.category}
          </div>
          <div class="nx-card-kicker">${data.kicker}</div>
        </div>
        <div class="nx-card-items-grid">
          ${data.items.map(item => `
            <a href="${item.target}" class="nx-card-item" data-target="${item.target}">
              <div class="nx-card-item-icon">${item.icon}</div>
              <div class="nx-card-item-text">
                <div class="nx-card-item-title">${item.title}</div>
                <p class="nx-card-item-desc">${item.desc}</p>
              </div>
            </a>
          `).join("")}
        </div>
        <div class="nx-card-footer-strip">
          <span>NEURONEX Maritime Platform</span>
          <a href="${data.footerLinkTarget}" data-target="${data.footerLinkTarget}">
            ${data.footerLinkText}
          </a>
        </div>
      </div>
    `).join("");
  }

  /* ── 4. Dropdown Interactions & Smooth Scrolling ── */
  let activeKey = null;
  let closeTimer = null;

  function showCard(key) {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    activeKey = key;

    // Show dropdown container
    dropdownEl.classList.add("open");

    // Activate specific card
    dropdownEl.querySelectorAll(".nx-dropdown-card").forEach(card => {
      card.classList.toggle("active", card.getAttribute("data-card") === key);
    });

    // Update active class on topnav links
    document.querySelectorAll(".topnav a[data-nx-key]").forEach(link => {
      link.classList.toggle("nx-nav-active", link.getAttribute("data-nx-key") === key);
    });
  }

  function hideCard() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      dropdownEl.classList.remove("open");
      dropdownEl.querySelectorAll(".nx-dropdown-card").forEach(c => c.classList.remove("active"));
      document.querySelectorAll(".topnav a[data-nx-key]").forEach(l => l.classList.remove("nx-nav-active"));
      activeKey = null;
    }, 180);
  }

  function scrollToSection(targetSelector) {
    if (!targetSelector) return;
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", targetSelector);
    } else {
      window.location.href = "/" + targetSelector;
    }
    hideCard();
  }

  /* ── 5. Attach to Header DOM ── */
  function setupNav2() {
    const topbar = document.querySelector("header.topbar");
    if (!topbar) return false;

    // Attach dropdown container inside topbar so it positions relatively
    if (!topbar.contains(dropdownEl)) {
      topbar.appendChild(dropdownEl);
    }

    // Keep dropdown open when mouse enters dropdown
    dropdownEl.addEventListener("mouseenter", () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    });
    dropdownEl.addEventListener("mouseleave", hideCard);

    // Handle clicks inside dropdown
    dropdownEl.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-target]");
      if (link) {
        e.preventDefault();
        const target = link.getAttribute("data-target");
        scrollToSection(target);
      }
    });

    // Configure Nav Links
    const topnav = topbar.querySelector(".topnav");
    if (topnav) {
      const linkMap = {
        '#dashboard': 'dashboard',
        '#brief': 'brief',
        '#fleet': 'fleet',
        '#simulator': 'simulator',
        '#about': 'about'
      };

      topnav.querySelectorAll("a").forEach(a => {
        // Skip AI pill button and its parent wrapper
        if (a.classList.contains("topnav-ai-link") || a.querySelector(".topnav-ai-link") || a.closest(".topnav-ai-link")) {
          a.style.setProperty("background", "transparent", "important");
          a.style.setProperty("border", "none", "important");
          a.style.setProperty("padding", "0", "important");
          a.style.setProperty("margin", "0", "important");
          a.style.setProperty("outline", "none", "important");
          a.style.setProperty("box-shadow", "none", "important");
          return;
        }

        const href = a.getAttribute("href");
        const key = linkMap[href];
        if (key) {
          a.setAttribute("data-nx-key", key);

          // Add chevron if not present
          if (!a.querySelector(".nx-chevron")) {
            const chevron = document.createElement("span");
            chevron.className = "nx-chevron";
            chevron.textContent = "▾";
            a.appendChild(chevron);
          }

          // Hover events to show expanding card
          a.addEventListener("mouseenter", () => showCard(key));
          a.addEventListener("mouseleave", hideCard);

          // Click to smooth scroll
          a.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToSection(href);
          });
        }
      });
    }

    return true;
  }

  /* ── 6. Dynamic Route Spacing & Background Control ── */
  function updateRouteLayout() {
    const isAiRoute = window.location.pathname.startsWith("/forecast") ||
                      window.location.pathname.startsWith("/vessels") ||
                      window.location.pathname.startsWith("/ports") ||
                      window.location.pathname.startsWith("/contracts") ||
                      window.location.pathname.startsWith("/risk") ||
                      Boolean(document.querySelector(".ai-layout"));

    if (isAiRoute) {
      document.body.classList.add("ai-route");
      document.body.style.setProperty("padding-top", "0px", "important");
      document.body.style.setProperty("margin-top", "0px", "important");
      document.body.style.setProperty("background-color", "#080e1a", "important");
      document.documentElement.style.setProperty("background-color", "#080e1a", "important");
    } else {
      document.body.classList.remove("ai-route");
      if (document.querySelector("header.topbar")) {
        document.body.style.setProperty("padding-top", "86px", "important");
      } else {
        document.body.style.removeProperty("padding-top");
      }
      document.body.style.removeProperty("background-color");
      document.documentElement.style.removeProperty("background-color");
    }
  }

  function handleAll() {
    updateRouteLayout();
    setupNav2();
  }

  // Run immediately and observe for React updates
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleAll);
  } else {
    handleAll();
  }

  const observer = new MutationObserver(() => {
    handleAll();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("popstate", updateRouteLayout);
  window.addEventListener("hashchange", updateRouteLayout);

  window.setTimeout(handleAll, 500);
  window.setTimeout(handleAll, 1600);
})();
