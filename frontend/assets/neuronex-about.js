/**
 * NEURONEX — About Us Section
 * Injects a high-impact, dark-themed About Us section before footer.footer,
 * and adds navigation links to .topnav and .footer-links.
 */
(() => {
  "use strict";

  /* ── Styles ── */
  const style = document.createElement("style");
  style.id = "neuronex-about-styles";
  style.textContent = `
    /* ── About Section Container ── */
    #about.neuronex-about-section {
      position: relative;
      background: linear-gradient(180deg, #091310 0%, #0c1c16 50%, #08110e 100%);
      border-top: 1px solid rgba(83, 224, 176, 0.15);
      border-bottom: 1px solid rgba(83, 224, 176, 0.12);
      padding: clamp(4rem, 7vw, 6.5rem) 1.5rem;
      color: #e2e8f0;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    }

    #about.neuronex-about-section::before {
      content: '';
      position: absolute;
      top: -20%;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 400px;
      background: radial-gradient(ellipse, rgba(83, 224, 176, 0.07) 0%, rgba(214, 255, 85, 0.02) 40%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .nx-about-inner {
      position: relative;
      z-index: 1;
      max-width: 1240px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
    }

    /* ── Header & Mission ── */
    .nx-about-header {
      text-align: center;
      max-width: 880px;
      margin: 0 auto;
    }

    .nx-about-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'Space Grotesk', monospace, sans-serif;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #53e0b0;
      padding: 5px 14px;
      border-radius: 999px;
      background: rgba(83, 224, 176, 0.08);
      border: 1px solid rgba(83, 224, 176, 0.28);
      margin-bottom: 1.25rem;
    }

    .nx-about-eyebrow-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #53e0b0;
      box-shadow: 0 0 10px #53e0b0;
      animation: nxPulse 2s infinite ease-in-out;
    }

    @keyframes nxPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.5; }
    }

    .nx-about-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 3.4vw, 3rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin: 0 0 1.2rem;
      background: linear-gradient(135deg, #ffffff 30%, #a7f3d0 75%, #53e0b0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nx-about-lead {
      font-size: clamp(1rem, 1.2vw, 1.15rem);
      line-height: 1.7;
      color: #94a3b8;
      margin: 0 auto;
      max-width: 800px;
    }

    /* ── Pillars / Capabilities Grid ── */
    .nx-pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    .nx-pillar-card {
      position: relative;
      background: rgba(14, 28, 22, 0.65);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(83, 224, 176, 0.16);
      border-radius: 16px;
      padding: 1.75rem 1.5rem;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .nx-pillar-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #53e0b0, transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .nx-pillar-card:hover {
      transform: translateY(-4px);
      border-color: rgba(83, 224, 176, 0.45);
      background: rgba(18, 36, 29, 0.85);
      box-shadow: 0 16px 36px rgba(4, 16, 12, 0.5), 0 0 20px rgba(83, 224, 176, 0.08);
    }

    .nx-pillar-card:hover::before {
      opacity: 1;
    }

    .nx-pillar-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(83, 224, 176, 0.1);
      border: 1px solid rgba(83, 224, 176, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      color: #53e0b0;
      font-size: 1.4rem;
    }

    .nx-pillar-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.15rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0 0 0.6rem;
      letter-spacing: -0.01em;
    }

    .nx-pillar-desc {
      font-size: 0.9rem;
      line-height: 1.6;
      color: #8fa0a8;
      margin: 0;
      flex: 1;
    }

    /* ── Impact Stats Strip ── */
    .nx-stats-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      background: rgba(10, 22, 17, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(83, 224, 176, 0.18);
      border-radius: 18px;
      padding: 2rem 1.5rem;
    }

    .nx-stat-item {
      text-align: center;
      padding: 0 1rem;
      border-right: 1px solid rgba(255, 255, 255, 0.06);
    }

    .nx-stat-item:last-child {
      border-right: none;
    }

    .nx-stat-number {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 2.8vw, 2.5rem);
      font-weight: 800;
      line-height: 1.1;
      color: #53e0b0;
      margin-bottom: 0.35rem;
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 2px;
    }

    .nx-stat-number .nx-stat-accent {
      color: #d6ff55;
    }

    .nx-stat-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #cad8dd;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.25rem;
    }

    .nx-stat-sub {
      font-size: 0.75rem;
      color: #718894;
      line-height: 1.35;
    }

    /* ── SIH Innovation & SAGARMALA Banner ── */
    .nx-sih-banner {
      background: linear-gradient(135deg, rgba(16, 37, 29, 0.8) 0%, rgba(10, 22, 18, 0.9) 100%);
      border: 1px solid rgba(83, 224, 176, 0.22);
      border-radius: 18px;
      padding: 2rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      position: relative;
      overflow: hidden;
    }

    .nx-sih-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(214, 255, 85, 0.12);
      border: 1px solid rgba(214, 255, 85, 0.35);
      border-radius: 999px;
      padding: 5px 14px;
      color: #d6ff55;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 0.8rem;
    }

    .nx-sih-content h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.5rem;
    }

    .nx-sih-content p {
      font-size: 0.92rem;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0;
      max-width: 760px;
    }

    .nx-sih-action {
      flex-shrink: 0;
    }

    .nx-sih-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background: linear-gradient(135deg, #53e0b0 0%, #34d399 100%);
      color: #062018;
      font-weight: 700;
      font-size: 0.88rem;
      padding: 0.8rem 1.6rem;
      border-radius: 999px;
      text-decoration: none;
      box-shadow: 0 8px 24px rgba(83, 224, 176, 0.25);
      transition: all 0.2s ease;
    }

    .nx-sih-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(83, 224, 176, 0.4);
      background: linear-gradient(135deg, #6ee7b7 0%, #53e0b0 100%);
    }

    /* ── Topnav link styling ── */
    .topnav a.topnav-about-link {
      color: inherit;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .topnav a.topnav-about-link:hover {
      color: #53e0b0 !important;
    }

    /* ── Responsive breakpoints ── */
    @media (max-width: 960px) {
      .nx-stats-strip {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
      }
      .nx-stat-item:nth-child(2) {
        border-right: none;
      }
      .nx-sih-banner {
        flex-direction: column;
        align-items: flex-start;
        padding: 1.75rem;
      }
    }

    @media (max-width: 640px) {
      #about.neuronex-about-section {
        padding: 3.5rem 1rem;
      }
      .nx-stats-strip {
        grid-template-columns: 1fr;
      }
      .nx-stat-item {
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        padding-bottom: 1.25rem;
      }
      .nx-stat-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
    }
  `;
  document.head.appendChild(style);

  /* ── Build About Section Element ── */
  function createAboutSection() {
    const section = document.createElement("section");
    section.id = "about";
    section.className = "neuronex-about-section";
    section.innerHTML = `
      <div class="nx-about-inner">
        <!-- Header & Mission Statement -->
        <div class="nx-about-header">
          <div class="nx-about-eyebrow">
            <span class="nx-about-eyebrow-dot"></span>
            06 / ABOUT NEURONEX
          </div>
          <h2 class="nx-about-title">Empowering Global Maritime Trade With Predictive Intelligence</h2>
          <p class="nx-about-lead">
            NEURONEX is an end-to-end cognitive maritime operating platform engineered to revolutionize Indian port logistics, freight procurement, and vessel routing. By marrying machine learning rate forecasting, dynamic hydrodynamic simulation, and multi-agent coordination, NEURONEX accelerates maritime decisions from days to seconds.
          </p>
        </div>

        <!-- 4 Core Pillars Grid -->
        <div class="nx-pillars-grid">
          <div class="nx-pillar-card">
            <div class="nx-pillar-icon-box">📈</div>
            <h3 class="nx-pillar-title">Predictive Freight Modeling</h3>
            <p class="nx-pillar-desc">
              ML-driven rate forecasting factoring bunker price volatility, demurrage risk, and market indices to secure optimal spot & time charters across key corridors.
            </p>
          </div>

          <div class="nx-pillar-card">
            <div class="nx-pillar-icon-box">🧭</div>
            <h3 class="nx-pillar-title">Eco-Routing & Bunker Optimization</h3>
            <p class="nx-pillar-desc">
              Advanced waypoint pathfinding calculating optimal voyage trajectories to cut fuel burn, reduce emissions, and safeguard CII compliance scores.
            </p>
          </div>

          <div class="nx-pillar-card">
            <div class="nx-pillar-icon-box">🚢</div>
            <h3 class="nx-pillar-title">Autonomous Vessel Matching</h3>
            <p class="nx-pillar-desc">
              Multi-criteria matching engine filtering vessel draft, deadweight tonnage, crane capabilities, and berth congestion across major Indian ports.
            </p>
          </div>

          <div class="nx-pillar-card">
            <div class="nx-pillar-icon-box">⚡</div>
            <h3 class="nx-pillar-title">FleetMind AI Copilot</h3>
            <p class="nx-pillar-desc">
              Intelligent conversational assistant delivering real-time voyage simulation, cargo viability audits, and instant maritime scenario analysis.
            </p>
          </div>
        </div>

        <!-- 4 Key Impact Metrics -->
        <div class="nx-stats-strip">
          <div class="nx-stat-item">
            <div class="nx-stat-number" data-count="6"><span class="nx-stat-val">0</span><span class="nx-stat-accent">+</span></div>
            <div class="nx-stat-label">Major Ports</div>
            <div class="nx-stat-sub">JNPT, Mundra, Chennai, Vizag, Cochin & Deendayal</div>
          </div>
          <div class="nx-stat-item">
            <div class="nx-stat-number" data-count="40"><span class="nx-stat-val">0</span><span class="nx-stat-accent">%</span></div>
            <div class="nx-stat-label">Faster Decisioning</div>
            <div class="nx-stat-sub">Reduced charter negotiation and fixture cycle time</div>
          </div>
          <div class="nx-stat-item">
            <div class="nx-stat-number" data-count="15"><span class="nx-stat-val">0</span><span class="nx-stat-accent">%</span></div>
            <div class="nx-stat-label">Fuel & Carbon Cut</div>
            <div class="nx-stat-sub">Optimized throttle speeds and hydrodynamic waypoints</div>
          </div>
          <div class="nx-stat-item">
            <div class="nx-stat-number" data-count="24"><span class="nx-stat-val">0</span><span class="nx-stat-accent">/7</span></div>
            <div class="nx-stat-label">Cognitive Tracking</div>
            <div class="nx-stat-sub">Real-time voyage telemetry and risk assessment</div>
          </div>
        </div>

        <!-- SIH Innovation & Sagarmala Dedication -->
        <div class="nx-sih-banner">
          <div class="nx-sih-content">
            <div class="nx-sih-badge">Smart India Hackathon Innovation</div>
            <h3>Pioneering Indigenous AI for SAGARMALA & Maritime India Vision 2030</h3>
            <p>
              Designed to solve critical supply chain bottlenecks across the Indian coastline. Built with precision for charterers, port authorities, logistics directors, and shipping operators seeking frictionless digital transformation.
            </p>
          </div>
          <div class="nx-sih-action">
            <a href="#top" class="nx-sih-btn">Explore Platform ↑</a>
          </div>
        </div>
      </div>
    `;
    return section;
  }

  /* ── DOM Injection Logic ── */
  function injectAboutSection() {
    if (document.getElementById("about")) return;

    const footer = document.querySelector("footer.footer") || document.querySelector("footer");
    if (!footer || !footer.parentNode) return;

    const aboutSection = createAboutSection();
    footer.parentNode.insertBefore(aboutSection, footer);
  }

  function injectNavLinks() {
    // 1. Top navigation link in header
    const topnav = document.querySelector(".topnav");
    if (topnav && !topnav.querySelector(".topnav-about-link")) {
      const aboutLink = document.createElement("a");
      aboutLink.href = "#about";
      aboutLink.className = "topnav-about-link";
      aboutLink.textContent = "About Us";

      // Try inserting directly after Simulator link for exact ordering:
      // OVERVIEW | PROCUREMENT | VESSELS | SIMULATOR | ABOUT US | [⚡ AI]
      const simLink = topnav.querySelector('a[href="#simulator"]');
      if (simLink && simLink.parentNode === topnav) {
        simLink.insertAdjacentElement("afterend", aboutLink);
      } else {
        // Fallback: insert before the AI Link (handling any wrapper element)
        const aiLink = topnav.querySelector(".topnav-ai-link");
        let targetNode = null;
        if (aiLink) {
          let cur = aiLink;
          while (cur && cur.parentNode !== topnav) {
            cur = cur.parentNode;
          }
          if (cur && cur.parentNode === topnav) {
            targetNode = cur;
          }
        }
        if (targetNode) {
          topnav.insertBefore(aboutLink, targetNode);
        } else {
          topnav.appendChild(aboutLink);
        }
      }

      aboutLink.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById("about");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", "#about");
        } else {
          window.location.href = "/#about";
        }
        topnav.classList.remove("open");
        const hamburger = document.getElementById("nx-hamburger");
        if (hamburger) {
          hamburger.innerHTML = "&#9776;";
          hamburger.setAttribute("aria-expanded", "false");
        }
      });
    }

    // 2. Footer links
    const footerLinks = document.querySelector(".footer-links");
    if (footerLinks && !footerLinks.querySelector(".footer-about-link")) {
      const footerAboutLink = document.createElement("a");
      footerAboutLink.href = "#about";
      footerAboutLink.className = "footer-about-link";
      footerAboutLink.textContent = "About Us";

      footerLinks.appendChild(footerAboutLink);

      footerAboutLink.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById("about");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", "#about");
        } else {
          window.location.href = "/#about";
        }
      });
    }
  }

  /* ── Stats Count-Up Animation ── */
  let statsAnimated = false;

  function initStatsObserver() {
    const statsStrip = document.querySelector(".nx-stats-strip");
    if (!statsStrip || statsAnimated) return;

    if (!("IntersectionObserver" in window)) {
      animateStats();
      return;
    }

    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            obs.disconnect();
            animateStats();
          }
        });
      },
      { threshold: 0.35 } // Trigger when ~30-50% of the section is visible
    );

    statsObserver.observe(statsStrip);
  }

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    const statElements = document.querySelectorAll(".nx-stats-strip .nx-stat-number");
    if (!statElements.length) return;

    const items = [];
    statElements.forEach((el) => {
      const target = parseInt(el.getAttribute("data-count"), 10);
      const valSpan = el.querySelector(".nx-stat-val");
      if (!isNaN(target) && valSpan) {
        items.push({ valSpan, target });
      }
    });

    if (!items.length) return;

    const DURATION = 1800; // 1.8 seconds (1.5 - 2s)
    const startTime = performance.now();

    // Ease-out cubic: starts fast and slows down near the end
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeOutCubic(progress);

      items.forEach(({ valSpan, target }) => {
        const current = Math.min(target, Math.round(target * eased));
        valSpan.textContent = String(current);
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Guarantee final exact integer value
        items.forEach(({ valSpan, target }) => {
          valSpan.textContent = String(target);
        });
      }
    }

    requestAnimationFrame(step);
  }

  function run() {
    injectAboutSection();
    injectNavLinks();
    initStatsObserver();
  }

  // Initial execution
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // Observer to re-inject if React re-renders or changes DOM
  const observer = new MutationObserver(() => {
    run();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Handle initial load or hash change if #about
  function handleHash() {
    if (window.location.hash === "#about") {
      const target = document.getElementById("about");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setTimeout(handleHash, 200);
      }
    }
  }

  window.addEventListener("hashchange", handleHash);
  window.setTimeout(handleHash, 600);

  // Additional timeouts for safety
  window.setTimeout(run, 400);
  window.setTimeout(run, 1500);
  window.setTimeout(run, 3000);
})();
