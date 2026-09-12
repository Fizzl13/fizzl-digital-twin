# FIZZL Digital Twin — Step 38

## Persistent Knowledge Graph

Adds a small, explicit relationship layer on top of the Knowledge Base.

The graph captures documented relationships such as:
- Frits → Mediahuis → Customer Success / Sales
- Frits → customer retention
- Frits → Salesforce
- Frits → AI → automation → human-in-the-loop
- Frits → Digital Twin → RAG / Claude API

The graph is used as supplemental context for relationship-oriented questions. It does not replace the Knowledge Base and does not invent new facts.

## Safety
Only high-level relationship metadata is injected into the model prompt. No private conversation data or hidden reasoning is exposed.
