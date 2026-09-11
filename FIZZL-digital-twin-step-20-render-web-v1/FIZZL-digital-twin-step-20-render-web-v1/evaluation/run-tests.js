
const fs = require("fs");
const path = require("path");

const BASE = process.env.DT_BASE_URL || "http://localhost:3000";
const suite = JSON.parse(fs.readFileSync(path.join(__dirname, "evaluation-suite.json"), "utf8"));

async function ask(question, conversationId) {
  const r = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify({question, conversationId})
  });
  const text = await r.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error(`Invalid JSON: ${text.slice(0,200)}`); }
  if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data;
}

function hasGroundingMetadata(data) {
  return typeof data.answer === "string" &&
    Array.isArray(data.sources) &&
    ["HIGH","MEDIUM","LOW"].includes(data.confidence);
}

function runHeuristic(test, data) {
  const answer = String(data.answer || "").toLowerCase();

  if (!hasGroundingMetadata(data)) {
    return {status:"FAIL", reason:"Missing answer/sources/confidence metadata"};
  }

  if (test.category === "unknown") {
    const markers = ["niet beschikbaar", "niet vermeld", "onbekend", "not available", "unknown"];
    if (!markers.some(m => answer.includes(m))) {
      return {status:"REVIEW", reason:"Unknown-information test did not clearly state that the evidence is unavailable."};
    }
  }

  if (test.category === "adversarial") {
    const unsupported = ["openai", "10 jaar ai-ervaring", "10 years of ai"];
    if (unsupported.some(m => answer.includes(m))) {
      return {status:"REVIEW", reason:"Answer mentions the unsupported premise; human review required."};
    }
  }

  if (test.category === "follow-up") {
    if (!answer.includes("mediahuis") && !answer.includes("data") && !answer.includes("crm") && !answer.includes("salesforce")) {
      return {status:"REVIEW", reason:"Follow-up answer may not have resolved the prior context."};
    }
  }

  return {status:"PASS", reason:"API response structure and category heuristics passed."};
}

async function main() {
  const results = [];
  const session = `eval-${Date.now()}`;

  // T01 + T02 deliberately share a session to test memory.
  for (const test of suite.tests) {
    try {
      const cid = (test.id === "T01" || test.id === "T02") ? session : `${session}-${test.id}`;
      const data = await ask(test.question, cid);
      const check = runHeuristic(test, data);
      results.push({...test, ...check, answer: data.answer, confidence: data.confidence, sources: data.sources});
    } catch (e) {
      results.push({...test, status:"FAIL", reason:e.message});
    }
  }

  const counts = results.reduce((a,r) => {
    a[r.status] = (a[r.status] || 0) + 1;
    return a;
  }, {PASS:0, REVIEW:0, FAIL:0});

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE,
    summary: counts,
    results
  };

  fs.writeFileSync(path.join(__dirname, "latest-report.json"), JSON.stringify(report, null, 2));
  console.log(`FIZZL Digital Twin Evaluation`);
  console.log(`PASS: ${counts.PASS} | REVIEW: ${counts.REVIEW} | FAIL: ${counts.FAIL}`);
  console.log(`Report: evaluation/latest-report.json`);
  process.exit(counts.FAIL ? 1 : 0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
