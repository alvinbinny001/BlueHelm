(() => {
  "use strict";

  if (document.getElementById("neuronex-copilot")) return;

  const style = document.createElement("style");
  style.textContent = `
    #neuronex-copilot { position: fixed; right: 22px; bottom: 22px; z-index: 9000; font: 14px/1.45 "DM Sans", "Segoe UI", sans-serif; color: #e7f1f5; }
    #neuronex-copilot .nx-launch { display: inline-flex; align-items: center; gap: 9px; border: 1px solid #3e8c79; border-radius: 999px; padding: 11px 16px; color: #062018; background: #53e0b0; box-shadow: 0 12px 30px rgba(0,0,0,.3); cursor: pointer; font: 700 13px inherit; }
    #neuronex-copilot .nx-mark { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 7px; color: #53e0b0; background: #0c3029; }
    #neuronex-copilot .nx-panel { display: none; flex-direction: column; width: min(390px, calc(100vw - 32px)); height: min(580px, calc(100vh - 100px)); overflow: hidden; border: 1px solid #2b4b5b; border-radius: 16px; background: #0c1825; box-shadow: 0 22px 70px rgba(0,0,0,.48); }
    #neuronex-copilot[data-open="true"] .nx-launch { display: none; }
    #neuronex-copilot[data-open="true"] .nx-panel { display: flex; }
    #neuronex-copilot .nx-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 16px; border-bottom: 1px solid #213847; background: #112637; }
    #neuronex-copilot .nx-title { display: flex; align-items: center; gap: 10px; font-weight: 700; }
    #neuronex-copilot .nx-subtitle { margin: 2px 0 0; color: #8eabb9; font-size: 11px; }
    #neuronex-copilot .nx-close { border: 0; color: #a9bdc7; background: transparent; cursor: pointer; font-size: 21px; }
    #neuronex-copilot .nx-feed { flex: 1; overflow-y: auto; display: grid; align-content: start; gap: 12px; padding: 16px; }
    #neuronex-copilot .nx-msg { max-width: 88%; padding: 10px 12px; border-radius: 11px; white-space: pre-wrap; }
    #neuronex-copilot .nx-msg.ai { justify-self: start; border: 1px solid #244c59; background: #112936; color: #d4e5e9; }
    #neuronex-copilot .nx-msg.user { justify-self: end; color: #062018; background: #53e0b0; }
    #neuronex-copilot .nx-meta { margin-top: 5px; color: #8eabb9; font-size: 10px; }
    #neuronex-copilot .nx-form { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #213847; background: #0f202e; }
    #neuronex-copilot textarea { flex: 1; min-height: 42px; max-height: 110px; resize: vertical; border: 1px solid #315368; border-radius: 9px; padding: 10px; color: #e7f1f5; background: #09151f; font: inherit; outline: none; }
    #neuronex-copilot textarea:focus { border-color: #53e0b0; }
    #neuronex-copilot .nx-send { align-self: end; border: 0; border-radius: 9px; padding: 11px 13px; color: #062018; background: #53e0b0; cursor: pointer; font-weight: 700; }
    #neuronex-copilot button:disabled { cursor: wait; opacity: .55; }
    @media (max-width: 560px) { #neuronex-copilot { right: 16px; bottom: 16px; } #neuronex-copilot .nx-panel { width: calc(100vw - 32px); height: min(620px, calc(100vh - 70px)); } }
  `;
  document.head.append(style);

  const root = document.createElement("aside");
  root.id = "neuronex-copilot";
  root.setAttribute("aria-label", "NEURONEX AI Copilot");
  root.innerHTML = `
    <button class="nx-launch" type="button"><span class="nx-mark">N</span>Ask NEURONEX AI</button>
    <section class="nx-panel" aria-label="AI Copilot chat">
      <header class="nx-head"><div><div class="nx-title"><span class="nx-mark">N</span>NEURONEX AI Copilot</div><p class="nx-subtitle">Grounded in your current workspace</p></div><button class="nx-close" type="button" aria-label="Close AI Copilot">&times;</button></header>
      <div class="nx-feed" role="log" aria-live="polite"><div class="nx-msg ai">Ask about freight, vessels, ports, forecasts, contracts, or risk.<div class="nx-meta">Checking provider status…</div></div></div>
      <form class="nx-form"><textarea maxlength="4000" aria-label="Message NEURONEX AI" placeholder="What should I analyze?" required></textarea><button class="nx-send" type="submit">Send</button></form>
    </section>
  `;
  document.body.append(root);

  const feed = root.querySelector(".nx-feed");
  const form = root.querySelector(".nx-form");
  const input = form.querySelector("textarea");
  const send = form.querySelector(".nx-send");

  function addMessage(text, role, meta = "") {
    const message = document.createElement("div");
    message.className = `nx-msg ${role}`;
    message.textContent = text;
    if (meta) {
      const detail = document.createElement("div");
      detail.className = "nx-meta";
      detail.textContent = meta;
      message.append(detail);
    }
    feed.append(message);
    feed.scrollTop = feed.scrollHeight;
    return message;
  }

  root.querySelector(".nx-launch").addEventListener("click", () => {
    root.dataset.open = "true";
    input.focus();
  });
  root.querySelector(".nx-close").addEventListener("click", () => {
    root.dataset.open = "false";
  });

  const statusHeaders = {};
  const statusToken = localStorage.getItem("neuronex_access_token");
  if (statusToken) statusHeaders.Authorization = `Bearer ${statusToken}`;
  fetch("/api/chat/status", { headers: statusHeaders }).then((response) => response.json()).then((status) => {
    const meta = feed.querySelector(".nx-meta");
    if (meta) meta.textContent = status.mode === "live" ? `LIVE · ${status.model}` : "DEMO · no AI provider configured";
  }).catch(() => {
    const meta = feed.querySelector(".nx-meta");
    if (meta) meta.textContent = "UNAVAILABLE · provider status could not be checked";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message || send.disabled) return;
    addMessage(message, "user");
    input.value = "";
    send.disabled = true;
    const reply = addMessage("", "ai", "Thinking…");
    try {
      const headers = { "Content-Type": "application/json" };
      const token = localStorage.getItem("neuronex_access_token");
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message,
          context: { route: window.location.pathname, hash: window.location.hash, selections: Object.fromEntries([...document.querySelectorAll("select")].map((select) => [select.name || select.id || "selection", select.value])) },
        }),
      });
      if (!response.ok || !response.body) throw new Error("Chat service is unavailable.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let meta = "";
      while (true) {
        const result = await reader.read();
        if (result.done) break;
        buffer += decoder.decode(result.value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop();
        for (const eventText of events) {
          const line = eventText.split("\n").find((line) => line.startsWith("data: "));
          if (!line) continue;
          const event = JSON.parse(line.slice(6));
          if (event.type === "token") {
            reply.firstChild.textContent += event.content;
            feed.scrollTop = feed.scrollHeight;
          }
          if (event.type === "done") meta = `${event.status} · ${event.source}`;
        }
      }
      reply.querySelector(".nx-meta").textContent = meta || "NEURONEX AI";
    } catch (error) {
      reply.firstChild.textContent = error.message;
      reply.querySelector(".nx-meta").textContent = "UNAVAILABLE";
    } finally {
      send.disabled = false;
      input.focus();
    }
  });
})();
