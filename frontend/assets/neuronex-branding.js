(() => {
  "use strict";

  const replacements = new Map([
    ["FleetMind", "NEURONEX"],
    ["AI Platform", "Maritime intelligence"],
  ]);

  function installDarkControls() {
    if (document.querySelector("#neuronex-dark-controls")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "neuronex-dark-controls";
    style.textContent = `
      select {
        color-scheme: dark !important;
        color: #e2e8f0 !important;
        background-color: #101c2a !important;
      }
      select option {
        color: #e2e8f0 !important;
        background-color: #101c2a !important;
      }
    `;
    document.head.append(style);
  }

  function normalizeBrandIcon() {
    const icon = document.querySelector(".brand-mark img");
    if (!icon) {
      return;
    }

    const iconPath = "/assets/freightflow-icon.png";
    if (icon.getAttribute("src") !== iconPath) {
      icon.setAttribute("src", iconPath);
    }
    icon.setAttribute("alt", "NEURONEX icon");
    icon.setAttribute("width", "32");
    icon.setAttribute("height", "32");
    icon.style.borderRadius = "50%";
    icon.style.objectFit = "cover";

    const brandMark = icon.closest(".brand-mark");
    if (brandMark) {
      brandMark.style.borderRadius = "50%";
      brandMark.style.overflow = "hidden";
    }
  }

  function normalizeBranding() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;

    while ((node = walker.nextNode())) {
      nodes.push(node);
    }

    nodes.forEach((textNode) => {
      let text = textNode.nodeValue;
      replacements.forEach((replacement, source) => {
        text = text.replaceAll(source, replacement);
      });
      text = text.replace(/freightflow/gi, "NEURONEX");
      if (text !== textNode.nodeValue) {
        textNode.nodeValue = text;
      }
    });

    document.querySelectorAll("[aria-label], [title], [alt]").forEach((element) => {
      ["aria-label", "title", "alt"].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value) {
          const normalizedValue = value.replace(/freightflow/gi, "NEURONEX");
          if (normalizedValue !== value) {
            element.setAttribute(attribute, normalizedValue);
          }
        }
      });
    });

    document.querySelectorAll(".brand-name, .footer-brand").forEach((element) => {
      if (element.textContent !== "NEURONEX") {
        element.textContent = "NEURONEX";
      }
    });
  }

  installDarkControls();
  normalizeBrandIcon();
  normalizeBranding();
  new MutationObserver(() => {
    normalizeBrandIcon();
    normalizeBranding();
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();