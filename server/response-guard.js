function validateResponse(answer = "") {
  const text = String(answer || "").trim();
  const issues = [];
  if (!text) issues.push("empty_response");
  if (text.length > 12000) issues.push("response_too_long");

  const forbidden = [
    /\bI (?:know|remember) that you\b/i,
    /\bI (?:personally|actually) (?:did|worked|built)\b/i,
    /\baccording to (?:my|our) private records\b/i
  ];
  if (forbidden.some(rx => rx.test(text))) issues.push("unsupported_personal_claim");

  return { ok: issues.length === 0, issues, length: text.length };
}

function buildGuardFallback() {
  return "I can't give a reliable answer from the available FIZZL Knowledge Base.";
}

module.exports = { validateResponse, buildGuardFallback };
