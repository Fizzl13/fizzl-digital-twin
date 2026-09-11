
const fs = require("fs");
const path = require("path");

const STOPWORDS = new Set([
  "de","het","een","en","of","van","voor","met","op","in","aan","bij","naar","hoe",
  "wat","welke","wie","waar","is","zijn","heeft","heeft","he","hij","zij","die","dat",
  "dit","the","a","an","and","or","of","to","for","with","on","in","how","what","which",
  "who","is","are","has","his","her","that","this"
]);

const SYNONYMS = {
  klantretentie: ["retentie","churn","behoud","klanten behouden","retention"],
  sales: ["verkoop","commercieel","upsell","cross-sell","omzet","revenue"],
  mediahuis: ["abonnement","subscriber","b2c","crm","salesforce","klant"],
  ai: ["artificial intelligence","generative ai","llm","machine learning","automatisering"],
  vaardigheden: ["skills","competenties","kennis","tools","ervaring"],
  startups: ["startup","startups","web3","saas","founder","product-market fit"],
  werkstijl: ["werkwijze","manier van werken","samenwerken","data-gedreven"],
  projecten: ["project","applicatie","bouwen","product","propositie"]
};

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}%+#.-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text) {
  return normalize(text)
    .split(/\s+/)
    .filter(t => t && !STOPWORDS.has(t));
}

function flatten(value, pathParts = []) {
  const docs = [];
  if (Array.isArray(value)) {
    value.forEach((item, i) => docs.push(...flatten(item, [...pathParts, String(i)])));
  } else if (value && typeof value === "object") {
    for (const [key, val] of Object.entries(value)) {
      docs.push(...flatten(val, [...pathParts, key]));
    }
  } else if (value !== null && value !== undefined) {
    docs.push({
      id: pathParts.join("."),
      text: `${pathParts.join(" ")} ${String(value)}`,
      value: String(value)
    });
  }
  return docs;
}

function expandedQuery(question) {
  const q = normalize(question);
  const out = new Set(tokens(q));
  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    if (q.includes(key) || synonyms.some(s => q.includes(normalize(s)))) {
      out.add(key);
      synonyms.forEach(s => tokens(s).forEach(t => out.add(t)));
    }
  }
  return [...out];
}

function scoreDocument(queryTokens, doc) {
  const text = normalize(doc.text);
  const dt = new Set(tokens(text));
  let score = 0;

  for (const token of queryTokens) {
    if (dt.has(token)) score += 2;
    else if (text.includes(token)) score += 0.75;
  }

  // Phrase and semantic-intent boosts.
  const q = queryTokens.join(" ");
  if (q.includes("klant") && /retentie|churn|subscriber|klant/.test(text)) score += 2;
  if (q.includes("sales") && /upsell|cross|omzet|sales|commerc/.test(text)) score += 2;
  if (q.includes("ai") && /ai|python|automatis|llm/.test(text)) score += 1.5;
  if (q.includes("startup") && /startup|saas|web3|founder/.test(text)) score += 1.5;

  // Prefer concise, information-rich chunks.
  const lengthPenalty = Math.max(0, (text.length - 900) / 1800);
  return score - lengthPenalty;
}

function buildDocuments(kb) {
  return flatten(kb);
}

function retrieve(question, kb, topK = 6) {
  const queryTokens = expandedQuery(question);
  const docs = buildDocuments(kb);

  return docs
    .map(doc => ({...doc, score: scoreDocument(queryTokens, doc)}))
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function formatContext(results) {
  return results.map((r, i) =>
    `[SOURCE ${i + 1}: ${r.id}]\n${r.value}`
  ).join("\n\n");
}

module.exports = {
  retrieve,
  formatContext,
  buildDocuments
};


function sourceIds(results) {
  return results.map(r => r.id).filter(Boolean);
}

module.exports.sourceIds = sourceIds;
