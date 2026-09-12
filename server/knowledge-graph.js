const fs = require("fs");
const path = require("path");

function loadGraph(rootDir) {
  const file = path.join(rootDir, "knowledge-graph.json");
  if (!fs.existsSync(file)) return {nodes: [], edges: []};
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return {nodes: [], edges: []}; }
}

function normalize(text) {
  return String(text || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function buildGraphContext(question, rootDir) {
  const graph = loadGraph(rootDir);
  const q = normalize(question);
  const matched = graph.nodes.filter(n => {
    const label = normalize(n.label);
    const id = normalize(n.id);
    return q.includes(label) || q.includes(id) ||
      (label.length > 4 && q.split(/\s+/).some(t => t.length > 4 && label.includes(t)));
  });
  if (!matched.length) return "";

  const ids = new Set(matched.map(n => n.id));
  const related = graph.edges.filter(([a,,b]) => ids.has(a) || ids.has(b));
  const nodeMap = new Map(graph.nodes.map(n => [n.id, n.label]));
  const lines = related.slice(0, 12).map(([a,rel,b]) =>
    `${nodeMap.get(a) || a} — ${rel.replace(/_/g, " ")} → ${nodeMap.get(b) || b}`
  );

  return lines.length
    ? `KNOWLEDGE GRAPH RELATIONSHIPS:\n${lines.join("\n")}`
    : "";
}

module.exports = { loadGraph, buildGraphContext };
