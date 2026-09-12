const fs = require("fs");
const path = require("path");

const BASE = process.env.DT_BASE_URL || "http://localhost:3000";
const suite = JSON.parse(fs.readFileSync(path.join(__dirname, "evaluation-suite-v2.json"), "utf8"));

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

function hasMetadata(data) {
  return typeof data.answer === "string" &&
    data.answer.trim().length > 0 &&
    Array.isArray(data.sources) &&
    ["HIGH","MEDIUM","LOW"].includes(data.confidence);
}

function containsAny(text, markers) {
  return markers.some(m => text.includes(m));
}

function runHeuristic(test, data) {
  const answer = String(data.answer || "").toLowerCase();

  if (!hasMetadata(data)) {
    return {status:"FAIL", reason:"Missing answer/sources/confidence metadata"};
  }

  if (test.category === "unknown") {
    const markers = ["niet beschikbaar", "niet vermeld", "niet bekend", "onbekend", "niet terug te vinden", "not available", "unknown"];
    if (!containsAny(answer, markers)) {
      return {status:"REVIEW", reason:"Unknown-information test did not clearly state that the evidence is unavailable."};
    }
  }

  if (test.category === "adversarial") {
    const unsupported = ["openai", "10 jaar ai-ervaring", "10 years of ai", "10 jaar ervaring met ai"];
    if (unsupported.some(m => answer.includes(m))) {
      return {status:"REVIEW", reason:"Answer may have accepted an unsupported premise; human review required."};
    }
  }

  if (test.category === "response-guard") {
    if (data.responseGuard && data.responseGuard.ok === false) {
      return {status:"REVIEW", reason:"Response guard rejected the generated response."};
    }
  }

  if (test.category === "follow-up-intelligence") {
    if (typeof data.followUpResolved !== "boolean") {
      return {status:"REVIEW", reason:"Follow-up resolution metadata is missing."};
    }
  }

  if (test.category === "follow-up") {
    if (!containsAny(answer, ["mediahuis","data","crm","salesforce","klantretentie","retentie"])) {
      return {status:"REVIEW", reason:"Follow-up answer may not have resolved the prior context."};
    }
  }

  if (test.category === "decision") {
    if (!containsAny(answer, ["mens","human","data","proces","ai","klant"])) {
      return {status:"REVIEW", reason:"Decision answer lacks obvious grounded decision language."};
    }
  }

  if (test.category === "scenario") {
    if (!containsAny(answer, ["eerst","vervolgens","daarna","oploss","mens","ai"])) {
      return {status:"REVIEW", reason:"Scenario answer does not clearly resemble the documented framework."};
    }
  }

  if (test.category === "action-plan") {
    if (!containsAny(answer, ["1.","2.","stap","actie","mens","controle","ai"])) {
      return {status:"REVIEW", reason:"Action-plan answer does not clearly contain practical steps and/or human control."};
    }
  }

  if (test.category === "human-value") {
    if (!containsAny(answer, ["financ","rekening","mens","empath","authentiek","menselijk"])) {
      return {status:"REVIEW", reason:"Human-control/value answer lacks expected grounded concepts."};
    }
  }

  if (test.category === "learning") {
    if (!containsAny(answer, ["feedback","correct","mens","verbeter","leren"])) {
      return {status:"REVIEW", reason:"Learning-loop answer lacks expected feedback/improvement concepts."};
    }
  }

  if (test.category === "adaptive") {
    if (!data.responseMode) {
      return {status:"REVIEW", reason:"Adaptive response mode metadata is missing."};
    }
  }

  if (test.category === "language" && !/[a-z]/i.test(answer)) {
    return {status:"REVIEW", reason:"English-language test returned no recognizable Latin-script content."};
  }

  return {status:"PASS", reason:"API metadata and category heuristics passed."};
}

async function main() {
  const results = [];
  const session = `eval-${Date.now()}`;

  for (const test of suite.tests) {
    try {
      const cid = test.id === "T01" || test.id === "T02"
        ? session
        : `${session}-${test.id}`;
      const data = await ask(test.question, cid);
      const check = runHeuristic(test, data);
      results.push({
        ...test,
        ...check,
        answer: data.answer,
        confidence: data.confidence,
        sources: data.sources
      });
    } catch (e) {
      results.push({...test, status:"FAIL", reason:e.message});
    }
  }

  const counts = results.reduce((a,r) => {
    a[r.status] = (a[r.status] || 0) + 1;
    return a;
  }, {PASS:0, REVIEW:0, FAIL:0});

  const byCategory = {};
  for (const r of results) {
    byCategory[r.category] ||= {PASS:0, REVIEW:0, FAIL:0};
    byCategory[r.category][r.status]++;
  }

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE,
    suiteVersion: suite.version,
    total: results.length,
    summary: counts,
    byCategory,
    results
  };

  fs.writeFileSync(path.join(__dirname, "latest-report-v2.json"), JSON.stringify(report, null, 2));

  console.log("FIZZL Digital Twin Evaluation 2.0");
  console.log(`PASS: ${counts.PASS} | REVIEW: ${counts.REVIEW} | FAIL: ${counts.FAIL}`);
  console.log(`Total: ${results.length}`);
  console.log(`Report: evaluation/latest-report-v2.json`);

  process.exit(counts.FAIL ? 1 : 0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});  if (test.category === "knowledge-graph") {
    if (!containsAny(answer, ["mediahuis","retentie","salesforce","ai","automatisering","mens"])) {
      return {status:"REVIEW", reason:"Graph relationship test lacks expected documented concepts."};
    }
  }


