const state = {
  conversationId: crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  busy: false,
  online: false,
  checking: false
};

const chat = document.querySelector("#messages");
const form = document.querySelector("#chat-form");
const input = document.querySelector("#question");
const clearButton = document.querySelector("#clear-chat");
const exampleButtons = document.querySelectorAll("[data-question]");

function addMessage(role, text, meta = "") {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  item.innerHTML = `<div class="message-text"></div>${meta ? `<div class="message-meta"></div>` : ""}`;
  item.querySelector(".message-text").textContent = text;
  if (meta) item.querySelector(".message-meta").textContent = meta;
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
  return item;
}

function setStatus(text) {
  const el = document.querySelector("#twin-status");
  const retrieval = document.querySelector("#retrieval-status");
  if (el) el.textContent = text;
  if (retrieval) retrieval.textContent = text;
}

const API_BASE = window.FIZZL_API_BASE || "https://fizzl-digital-twin.onrender.com";

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {...options, signal: controller.signal});
  } finally {
    clearTimeout(timer);
  }
}

async function checkHealth(options = {}) {
  const maxWaitMs = Number(options.maxWaitMs || 0);
  const pollMs = Number(options.pollMs || 5000);
  const started = Date.now();
  state.checking = true;

  try {
    while (true) {
      try {
        const response = await fetchWithTimeout(`${API_BASE}/health`, {method: "GET", cache: "no-store"}, 10000);
        const data = await response.json().catch(() => ({}));
        state.online = response.ok && data?.ok === true;
        if (state.online) {
          setStatus("ONLINE");
          return true;
        }
      } catch (_) {
        state.online = false;
      }

      if (!maxWaitMs || Date.now() - started >= maxWaitMs) break;
      setStatus("WAKING UP API");
      await new Promise(resolve => setTimeout(resolve, pollMs));
    }
  } finally {
    state.checking = false;
  }

  state.online = false;
  setStatus("OFFLINE");
  return false;
}

async function sendQuestion(question) {
  if (!question || state.busy) return;
  state.busy = true;
  input.value = "";
  addMessage("user", question);
  setStatus("SEARCHING");

  const typing = addMessage("assistant", "Thinking…", "CONNECTING TO DIGITAL TWIN");
  try {
    if (!state.online && !(await checkHealth({maxWaitMs: 60000, pollMs: 5000}))) {
      throw new Error("Digital Twin API is offline");
    }

    const response = await fetchWithTimeout(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        question,
        conversationId: state.conversationId
      })
    }, 60000);

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);

    state.online = true;
    typing.querySelector(".message-text").textContent = data.answer || "No answer available.";
    const sourceNames = Array.isArray(data.sources) ? data.sources : [];
    const confidence = data.confidence ? ` · CONFIDENCE ${data.confidence}` : "";
    const meta = typing.querySelector(".message-meta");
    if (meta) {
      meta.textContent = sourceNames.length
        ? `GROUNDED${confidence} · ${sourceNames.slice(0, 3).join(" · ")}`
        : `GROUNDED${confidence} · KNOWLEDGE BASE`;
    }
    setStatus("GROUNDED");
  } catch (error) {
    typing.querySelector(".message-text").textContent =
      "The Digital Twin is temporarily unavailable. Please try again.";
    const meta = typing.querySelector(".message-meta");
    if (meta) meta.textContent = error?.name === "AbortError" ? "TIMEOUT" : (state.checking ? "CONNECTING" : "OFFLINE");
    setStatus("OFFLINE");
    console.error(error);
  } finally {
    state.busy = false;
    input.focus();
  }
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  sendQuestion(input.value.trim());
});

exampleButtons.forEach(btn => {
  btn.addEventListener("click", () => sendQuestion(btn.dataset.question));
});

clearButton?.addEventListener("click", async () => {
  try {
    await fetchWithTimeout(`${API_BASE}/api/chat?conversationId=${encodeURIComponent(state.conversationId)}`, {method: "DELETE"}, 8000);
  } catch (_) {}
  chat.innerHTML = "";
  addMessage("assistant", "Session context cleared. Ask me anything about Frits.", "DIGITAL TWIN / ONLINE");
  setStatus(state.online ? "ONLINE" : "OFFLINE");
  input.focus();
});

addMessage(
  "assistant",
  "Hi. I’m the FIZZL Digital Twin. Ask me about Frits’ experience, skills, projects or way of working.",
  "DIGITAL TWIN / CHECKING CONNECTION"
);

checkHealth({maxWaitMs: 30000, pollMs: 5000});
