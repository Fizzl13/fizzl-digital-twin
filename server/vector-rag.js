const STOPWORDS = new Set([
  "de","het","een","en","of","van","voor","met","op","in","aan","bij","naar","hoe",
  "wat","welke","wie","waar","is","zijn","heeft","he","hij","zij","die","dat","dit",
  "the","a","an","and","or","to","for","with","on","how","what","which","who","are","has","his","her","that","this"
]);

const SYNONYMS = {
  klantretentie: ["retentie","churn","behoud","klanten behouden","retention","klantbehoud"],
  sales: ["verkoop","commercieel","upsell","cross-sell","omzet","revenue","verkopen"],
  mediahuis: ["abonnement","subscriber","b2c","crm","salesforce","klant","risico-abonnees"],
  ai: ["artificial intelligence","generative ai","llm","machine learning","automatisering"],
  vaardigheden: ["skills","competenties","kennis","tools","ervaring","vaardigheden"],
  startups: ["startup","startups","web3","saas","founder","product-market fit","go-to-market"],
  werkstijl: ["werkwijze","manier van werken","samenwerken","data-gedreven","sparringpartner"],
  projecten: ["project","projecten","applicatie","bouwen","product","propositie"],
  opleiding: ["studie","opleiding","school","universiteit","inhoudelijke opleiding"],
  werkgevers: ["werkgever","werkgevers","baan","banen","functie","functies","rollen","werkervaring","jobs","job"]
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
  return normalize(text).split(/\s+/).filter(t => t && !STOPWORDS.has(t));
}

function detectIntent(question) {
  const q = normalize(question);
  const has = key => q.includes(key) || (SYNONYMS[key] || []).some(s => q.includes(normalize(s)));
  if (has("werkgevers") || /welke banen|welke functies|welke rollen|jobs heb/.test(q)) return "experience";
  if (has("klantretentie")) return "retention";
  if (has("sales")) return "sales";
  if (has("ai")) return "ai";
  if (has("vaardigheden")) return "skills";
  if (has("startups")) return "startups";
  if (has("projecten")) return "projects";
  if (has("opleiding")) return "education";
  if (has("werkstijl")) return "work_style";
  return "general";
}

function makeDoc(id, value, section, weight = 1) {
  return {
    id,
    value: String(value),
    text: `${id.replace(/[._]/g, " ")} ${String(value)}`,
    section,
    weight
  };
}

function buildDocuments(kb) {
  const docs = [];

  // High-value structured documents: these keep related facts together.
  (kb.experience || []).forEach((e, i) => {
    docs.push(makeDoc(
      `experience.${i}`,
      `${e.company} — ${e.role} (${e.period}). ${e.achievements.join(" ")} Tools: ${(e.tools || []).join(", ")}.`,
      "experience", 2.4
    ));
    e.achievements.forEach((a, j) => docs.push(makeDoc(`experience.${i}.achievements.${j}`, a, "experience", 1.2)));
    (e.tools || []).forEach((t, j) => docs.push(makeDoc(`experience.${i}.tools.${j}`, t, "experience", 1.0)));
  });

  docs.push(makeDoc("profile", `${kb.profile?.name || ""}. ${kb.profile?.headline || ""}. ${kb.profile?.summary || ""}. Focus: ${(kb.profile?.professional_focus || []).join(", ")}.`, "profile", 1.6));
  docs.push(makeDoc("skills.sales", (kb.skills?.sales || []).join(", "), "skills", 1.5));
  docs.push(makeDoc("skills.tools", (kb.skills?.tools || []).join(", "), "skills", 1.3));
  docs.push(makeDoc("skills.core_competencies", (kb.skills?.core_competencies || []).join(", "), "skills", 1.5));
  docs.push(makeDoc("skills.languages", Object.entries(kb.skills?.languages || {}).map(([k,v]) => `${k}: ${v}`).join("; "), "skills", 1.0));
  docs.push(makeDoc("ai", `${kb.ai?.documented_level || ""}. ${kb.ai?.note || ""}`, "ai", 1.5));
  docs.push(makeDoc("projects", `${(kb.projects?.documented_projects || []).join(", ")}. ${kb.projects?.note || ""}`, "projects", 1.2));
  (kb.education || []).forEach((e, i) => docs.push(makeDoc(`education.${i}`, `${e.program} — ${e.institution}${e.location ? `, ${e.location}` : ""}`, "education", 1.4)));
  docs.push(makeDoc("work_style", `${(kb.work_style?.documented_strengths || []).join(", ")}. ${kb.work_style?.evidence_based_note || ""}`, "work_style", 1.3));

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

function scoreDocument(queryTokens, question, doc, intent) {
  const text = normalize(doc.text);
  const dt = new Set(tokens(text));
  let score = 0;
  let matches = 0;

  for (const token of queryTokens) {
    if (dt.has(token)) { score += 2.2; matches++; }
    else if (token.length >= 5 && text.includes(token)) score += 0.7;
  }

  const q = normalize(question);
  const phrases = [
    ["klantretentie", /retentie|churn|behoud|risico-abonnees/],
    ["sales", /upsell|cross-sell|omzet|sales|commercieel|verkoop/],
    ["experience", /experience|werkervaring|werkgever|functie|rol|baan|jobs|company|role|period/],
    ["skills", /skills|competent|vaardig|tools|kennis/],
    ["startups", /startup|saas|web3|founder|go-to-market/],
    ["ai", /\bai\b|llm|python|automatis/],
    ["projects", /project|propositie|applicatie/],
    ["education", /opleiding|studie|inhogeschool|inholland|universiteit/]
  ];
  for (const [key, pattern] of phrases) if (q.includes(key) && pattern.test(text)) score += 3.5;

  const sectionBoost = {
    experience: {experience: 7, profile: 1},
    retention: {experience: 8, skills: 1},
    sales: {experience: 5, skills: 4},
    skills: {skills: 7, experience: 1},
    startups: {experience: 7},
    ai: {ai: 7, projects: 1},
    projects: {projects: 7, experience: 1},
    education: {education: 7},
    work_style: {work_style: 7, experience: 1},
    general: {}
  }[intent] || {};
  score += sectionBoost[doc.section] || 0;
  score *= doc.weight || 1;

  // Avoid returning weak, unrelated leaf facts just because a generic word matched.
  if (matches === 0 && score < 5) score = 0;
  return score;
}

function retrieve(question, kb, topK = 6) {
  const intent = detectIntent(question);
  const queryTokens = expandedQuery(question);
  const docs = buildDocuments(kb);
  const ranked = docs
    .map(doc => ({...doc, score: scoreDocument(queryTokens, question, doc, intent)}))
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score);

  // For "which jobs/roles" questions, return the structured experience records,
  // one per employer, rather than six isolated achievement fragments.
  if (intent === "experience") {
    const experienceDocs = ranked.filter(d => d.section === "experience" && /^experience\.\d+$/.test(d.id));
    if (experienceDocs.length >= 3) return experienceDocs.slice(0, 3);
  }

  // De-duplicate by section + parent item where possible, while retaining enough evidence.
  const selected = [];
  const seenParents = new Set();
  for (const doc of ranked) {
    const parent = doc.id.match(/^(experience\.\d+)/)?.[1] || doc.id.split(".")[0];
    if (selected.length < topK && (!seenParents.has(parent) || doc.section !== "experience")) {
      selected.push(doc);
      seenParents.add(parent);
    }
    if (selected.length >= topK) break;
  }
  return selected;
}

function formatContext(results) {
  return results.map((r, i) => `[SOURCE ${i + 1}: ${r.id}]\n${r.value}`).join("\n\n");
}

module.exports = { retrieve, formatContext, buildDocuments, detectIntent };
