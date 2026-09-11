
const state = {
  conversationId: crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  busy: false
};

const chat = document.querySelector("#chat");
const form = document.querySelector("#chat-form");
const input = document.querySelector("#message");
const clearButton = document.querySelector("#clear-chat");
const exampleButtons = document.querySelectorAll("[data-question]");

function addMessage(role, text, meta = "") {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  item.innerHTML = `<div class="message-text"></div>${meta ? `<div class="message-meta">${meta}</div>` : ""}`;
  item.querySelector(".message-text").textContent = text;
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
  return item;
}

function setStatus(text) {
  const el = document.querySelector("#twin-status");
  if (el) el.textContent = text;
}

async function sendQuestion(question) {
  if (!question || state.busy) return;
  state.busy = true;
  input.value = "";
  addMessage("user", question);
  setStatus("SEARCHING");

  const typing = addMessage("assistant", "Thinking…", "SESSION CONTEXT + RAG");
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        question,
        conversationId: state.conversationId
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");

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
    if (meta) meta.textContent = "OFFLINE";
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
    await fetch(`/api/chat?conversationId=${encodeURIComponent(state.conversationId)}`, {method: "DELETE"});
  } catch (_) {}
  chat.innerHTML = "";
  addMessage("assistant", "Session context cleared. Ask me anything about Frits.", "DIGITAL TWIN / ONLINE");
  setStatus("ONLINE");
  input.focus();
});

addMessage(
  "assistant",
  "Hi. I’m the FIZZL Digital Twin. Ask me about Frits’ experience, skills, projects or way of working.",
  "DIGITAL TWIN / ONLINE · SESSION CONTEXT ENABLED"
);
