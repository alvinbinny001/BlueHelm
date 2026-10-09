(() => {
  "use strict";

  const DURATION = 1800; // 1.8 seconds (1.5 - 2.0s)

  // Ease-out cubic: starts fast and smoothly decelerates near the end
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Renders intermediate count values preserving all prefixes, suffixes, and decimals
  function renderProgress(origText, eased) {
    return origText.replace(/(\d+(?:\.\d+)?)/g, (match) => {
      const val = parseFloat(match);
      if (isNaN(val)) return match;
      const dec = match.includes(".") ? match.split(".")[1].length : 0;
      const cur = val * eased;
      return dec === 0 ? String(Math.round(cur)) : cur.toFixed(dec);
    });
  }

  /* -------------------------------------------------------------
     1. KPI & Signal Stat Card Count-Up (Forecast & Contracts)
     ------------------------------------------------------------- */
  function setupObserverForContainer(container) {
    const valElements = container.querySelectorAll(".ai-kpi-value, .signal-value");
    if (!valElements.length) return;

    const textItems = [];
    valElements.forEach((valEl) => {
      if (valEl.dataset.kpiPrepared) return;
      valEl.dataset.kpiPrepared = "true";

      Array.from(valEl.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && /\d+(?:\.\d+)?/.test(node.nodeValue)) {
          const origText = node.nodeValue;
          textItems.push({
            node,
            origText
          });
          node.nodeValue = renderProgress(origText, 0);
        }
      });
    });

    if (!textItems.length) return;

    let animated = false;

    function runAnimation() {
      if (animated) return;
      animated = true;
      container.dataset.kpiAnimated = "true";

      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased = easeOutCubic(progress);

        textItems.forEach(({ node, origText }) => {
          if (progress >= 1) {
            node.nodeValue = origText;
          } else {
            node.nodeValue = renderProgress(origText, eased);
          }
        });

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      runAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            obs.disconnect();
            runAnimation();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(container);
  }

  /* -------------------------------------------------------------
     2. Speedometer Gauge Animation (Risk Center Cards & Badge)
     Animates arc sweep and score count-up keeping original layout
     ------------------------------------------------------------- */
  function getArcD(score) {
    const r = -135 + (score / 100) * 270;
    const o = 52, s = 64, c = 64;
    const f = b => (b * Math.PI) / 180;
    const p = s + o * Math.cos(f(r));
    const d = c + o * Math.sin(f(r));
    const v = { x: s + o * Math.cos(f(-135)), y: c + o * Math.sin(f(-135)) };
    // Large arc flag is 1 ONLY when angular span > 180 degrees (score > 66.67)
    const largeArc = score > 66.67 ? 1 : 0;
    return `M ${v.x.toFixed(2)} ${v.y.toFixed(2)} A ${o} ${o} 0 ${largeArc} 1 ${p.toFixed(2)} ${d.toFixed(2)}`;
  }

  function setupSpeedometerAnimation(gaugeSvg, delay = 0) {
    if (gaugeSvg.dataset.gaugeAnimated) return;

    const paths = gaugeSvg.querySelectorAll("path");
    const textEl = gaugeSvg.querySelector("text");
    if (paths.length < 2 || !textEl) return;

    const fgPath = paths[1];
    const targetScore = parseInt(textEl.textContent.trim(), 10);
    if (isNaN(targetScore)) return;

    gaugeSvg.dataset.gaugeAnimated = "true";
    gaugeSvg.dataset.targetScore = String(targetScore);

    // Ensure the arc geometry exactly matches the track curve (no flipped inverted arcs)
    fgPath.setAttribute("d", getArcD(targetScore));

    let pathLength = 245;
    try {
      const len = fgPath.getTotalLength();
      if (len > 0) pathLength = len;
    } catch (e) {
      pathLength = 245;
    }

    // Set initial state: arc empty and center number 0
    fgPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    fgPath.style.strokeDashoffset = String(pathLength);
    textEl.textContent = "0";

    const duration = 1500;
    let startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime - delay;
      if (elapsed < 0) {
        requestAnimationFrame(step);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      // fgPath is the exact arc for targetScore: sweep from empty (pathLength) to full (0)
      fgPath.style.strokeDashoffset = String(pathLength * (1 - eased));
      textEl.textContent = String(Math.round(targetScore * eased));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        fgPath.style.strokeDashoffset = "0";
        textEl.textContent = String(targetScore);
      }
    }

    requestAnimationFrame(step);
  }

  function handleScoreUpdate(gaugeSvg) {
    if (!gaugeSvg.dataset.gaugeAnimated) return;
    const textEl = gaugeSvg.querySelector("text");
    const paths = gaugeSvg.querySelectorAll("path");
    if (!textEl || paths.length < 2) return;
    const fgPath = paths[1];
    const currentScore = parseInt(textEl.textContent.trim(), 10);
    const recordedTarget = parseInt(gaugeSvg.dataset.targetScore, 10);
    if (!isNaN(currentScore) && currentScore !== recordedTarget) {
      gaugeSvg.dataset.targetScore = String(currentScore);
      fgPath.setAttribute("d", getArcD(currentScore));
      fgPath.style.strokeDasharray = "";
      fgPath.style.strokeDashoffset = "";
      textEl.textContent = String(currentScore);
    }
  }

  function observeRiskGauges() {
    const riskGrid = document.querySelector(".ai-risk-cards-grid");
    if (riskGrid && !riskGrid.dataset.riskGridObserved) {
      riskGrid.dataset.riskGridObserved = "true";

      const runGaugesAnimation = () => {
        const cards = riskGrid.querySelectorAll(".ai-risk-card");
        cards.forEach((card, idx) => {
          const svg = card.querySelector(".ai-gauge-svg");
          if (svg) {
            setupSpeedometerAnimation(svg, idx * 80);
          }
        });
      };

      if (!("IntersectionObserver" in window)) {
        runGaugesAnimation();
      } else {
        const obs = new IntersectionObserver(
          (entries, o) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                o.disconnect();
                runGaugesAnimation();
              }
            });
          },
          { threshold: 0.15 }
        );
        obs.observe(riskGrid);
      }
    }

    // Also observe overall risk badge at top right
    const overallBadge = document.querySelector(".ai-overall-risk-badge");
    if (overallBadge && !overallBadge.dataset.riskBadgeObserved) {
      overallBadge.dataset.riskBadgeObserved = "true";
      const svg = overallBadge.querySelector(".ai-gauge-svg");
      if (svg) {
        if (!("IntersectionObserver" in window)) {
          setupSpeedometerAnimation(svg, 0);
        } else {
          const obs = new IntersectionObserver(
            (entries, o) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  o.disconnect();
                  setupSpeedometerAnimation(svg, 0);
                }
              });
            },
            { threshold: 0.15 }
          );
          obs.observe(overallBadge);
        }
      }
    }

    // Keep reactive to slider adjustments
    document.querySelectorAll(".ai-gauge-svg[data-gauge-animated='true']").forEach(handleScoreUpdate);
  }

  /* -------------------------------------------------------------
     3. General Scanner & Listeners
     ------------------------------------------------------------- */
  function scanAndObserve() {
    // 1. Grid containers (Forecast & Contracts KPI strips, Signal grid)
    const grids = document.querySelectorAll(".ai-kpi-grid, .signal-grid");
    grids.forEach((grid) => {
      if (grid.dataset.kpiObserved) return;
      grid.dataset.kpiObserved = "true";
      setupObserverForContainer(grid);
    });

    // 2. Individual cards if outside a detected grid
    const standaloneCards = document.querySelectorAll(
      ".ai-kpi-card:not(.ai-kpi-grid *), .signal-card:not(.signal-grid *)"
    );
    standaloneCards.forEach((card) => {
      if (card.dataset.kpiObserved) return;
      card.dataset.kpiObserved = "true";
      setupObserverForContainer(card);
    });

    // 3. Risk Center speedometer gauges
    observeRiskGauges();

    // 4. Ensure one-line risk card notes have title tooltips with full text
    document.querySelectorAll(".ai-risk-alert, .ai-risk-mitigation").forEach((el) => {
      const span = el.querySelector("span");
      if (span) {
        const text = span.textContent.trim();
        if (text && el.getAttribute("title") !== text) {
          el.setAttribute("title", text);
        }
      }
    });
  }

  // Initial execution
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scanAndObserve);
  } else {
    scanAndObserve();
  }

  // MutationObserver to catch React route changes and dynamic component mounts
  const observer = new MutationObserver(() => {
    scanAndObserve();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // History and route event listeners
  window.addEventListener("popstate", scanAndObserve);
  window.addEventListener("hashchange", scanAndObserve);

  // Safety fallbacks
  window.setTimeout(scanAndObserve, 200);
  window.setTimeout(scanAndObserve, 600);
  window.setTimeout(scanAndObserve, 1500);
})();
