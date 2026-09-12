function isFollowUpQuestion(question = "") {
  const q = String(question).trim().toLowerCase();
  return /^(en|en hoe|en waarom|waarom|hoe deed hij dat|hoe doet hij dat|kun je daar.*voorbeeld|kun je.*voorbeeld|daarover|meer hierover|wat bedoel je|hoe dan|en daarna|wat was dat|welke daarvan)\b/.test(q)
    || /^(en|maar)\s+(hoe|waarom|wat|welke)\b/.test(q);
}

function resolveFollowUp({ question = "", history = [] } = {}) {
  if (!isFollowUpQuestion(question) || !Array.isArray(history) || !history.length) return null;

  const recent = history.slice(-6);
  const previousUser = [...recent].reverse().find(x => x && (x.role === "user" || x.role === "human"));
  const previousAssistant = [...recent].reverse().find(x => x && x.role === "assistant");

  if (!previousUser) return null;

  // Extract stable topic anchors from the previous user turn.
  const stop = new Set(["hoe","wat","waarom","kun","kan","daar","dit","dat","met","voor","van","een","het","de","en","zijn","was","heeft","heeft","frits","hij"]);
  const anchors = String(previousUser.content || previousUser.message || "")
    .toLowerCase()
    .replace(/[^a-z0-9à-ÿ\s-]/gi, " ")
    .split(/\s+/)
    .filter(w => w.length >= 5 && !stop.has(w))
    .slice(0, 8);

  return {
    resolved: true,
    topic: anchors,
    previousQuestion: String(previousUser.content || previousUser.message || "").slice(0, 500),
    previousAnswerPresent: Boolean(previousAssistant),
    instruction: anchors.length
      ? `Treat the follow-up as a continuation of the immediately preceding topic. Topic anchors: ${anchors.join(", ")}.`
      : "Treat the follow-up as a continuation of the immediately preceding user topic."
  };
}

module.exports = { isFollowUpQuestion, resolveFollowUp };
