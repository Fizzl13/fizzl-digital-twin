/*
 * FIZZL DIGITAL TWIN — Step 5
 * Claude + vector retrieval.
 *
 * The current embedding implementation is local/deterministic so this
 * version is testable without an additional embedding API.
 * For production, replace embed() with a real embedding model/provider.
 */

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildVectorIndex,
  semanticSearch
} from "./vector-rag.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 3000;
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";

const SYSTEM_PROMPT = `
You are the FIZZL Digital Twin, a professional AI representation of Frits Zwager.

Use ONLY the supplied retrieved Knowledge Base context.
Never invent experience, qualifications, dates, projects, employers, metrics or personal facts.
If the context is insufficient, say that the information is not currently available.
Do not claim to literally be Frits. You are his Digital Twin.
Answer in the visitor's language.
Keep answers concise and professional.
`;

async function readKnowledgeBase() {
  return JSON.parse(
    await fs.readFile(path.join(root, "knowledge-base.json"), "utf8")
  );
}

async function callClaude(question, results) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY ontbreekt op de server.");
  }

  const context = results.map(item => ({
    source: item.source,
    title: item.title,
    text: item.text,
    relevance: Number(item.score.toFixed(4))
  }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content:
          "Retrieved Knowledge Base context:\n" +
          JSON.stringify(context, null, 2) +
          "\n\nVisitor question:\n" + question
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error ${response.status}`);
  }

  const data = await response.json();
  return (data.content || [])
    .filter(block => block.type === "text")
    .map(block => block.text)
    .join("\n")
    .trim();
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  });
  res.end(JSON.stringify(data));
}

const kb = await readKnowledgeBase();
const vectorIndex = buildVectorIndex(kb);

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});

  if (req.method !== "POST" || req.url !== "/api/chat") {
    return sendJson(res, 404, { error: "Endpoint niet gevonden." });
  }

  let body = "";
  req.on("data", chunk => {
    body += chunk;
    if (body.length > 12000) req.destroy();
  });

  req.on("end", async () => {
    try {
      const { question } = JSON.parse(body || "{}");

      if (!question || typeof question !== "string" || question.length > 1000) {
        return sendJson(res, 400, { error: "Ongeldige vraag." });
      }

      const results = semanticSearch(question, vectorIndex, 4);

      if (!results.length || results[0].score < 0.05) {
        return sendJson(res, 200, {
          grounded: false,
          answer:
            "Dat staat momenteel niet in mijn Knowledge Base, dus daar wil ik geen aannames over doen.",
          sources: []
        });
      }

      const answer = await callClaude(question, results);

      return sendJson(res, 200, {
        grounded: true,
        answer,
        sources: results.map(r => ({
          section: r.source,
          title: r.title,
          relevance: Number(r.score.toFixed(4))
        })),
        retrieval: "vector-rag-v2",
        model: MODEL
      });
    } catch (error) {
      console.error(error);
      return sendJson(res, 500, {
        error: "De Digital Twin kon het antwoord niet genereren."
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`FIZZL Digital Twin vector RAG running on port ${PORT}`);
});
