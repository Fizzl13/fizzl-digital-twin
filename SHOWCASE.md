# FIZZL DIGITAL TWIN — Step 13: Showcase Layer

Step 13 prepares the project to be presented as a portfolio piece.

## Added
- `showcase.json` — reusable project metadata for the FIZZL ecosystem.
- `showcase/index.html` — standalone project showcase page.
- Clear explanation of RAG, session memory, grounding, evaluation and security.
- Direct link to the live Digital Twin at `https://ai.fizzl.eu`.
- Direct GitHub link.

## Suggested portfolio presentation

**FIZZL DIGITAL TWIN**
Grounded AI professional profile

**Problem**
A traditional CV is static. The Digital Twin makes the profile interactive while keeping
answers constrained to verified profile information.

**Built**
Knowledge Base → Semantic RAG → Claude → Session Memory → Evaluation → Secure API

**Result**
A visitor can explore professional experience conversationally instead of reading only
a static CV.

## Next
The next step should connect this project to `projects.fizzl.eu` and `cv.fizzl.eu`,
with a single polished project card and a clear GitHub/demo call-to-action.


## Step 37 — Public Architecture Trace

The chat API now returns a safe `trace` object showing the processing stages at a high level:
Question → Knowledge Retrieval → Intent → Decision → Scenario → Action Planning → Response.

The trace contains only stage status and high-level metadata. It does not expose prompts, private conversation content, retrieved text, hidden reasoning or chain-of-thought.
