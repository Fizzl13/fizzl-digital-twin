# Automated AI Evaluation

Run the Digital Twin API first, then from this directory:

```bash
node run-tests.js
```

Optional:

```bash
DT_BASE_URL=http://localhost:3000 node run-tests.js
```

The runner:
- executes the 10 regression questions;
- keeps T01/T02 in the same session to test follow-up context;
- checks answer/sources/confidence metadata;
- applies simple category-specific safety heuristics;
- writes `latest-report.json`.

A `REVIEW` result means a human should inspect the answer. It is deliberately not treated
as proof of failure because semantic correctness cannot be established reliably with only
string heuristics.

For production, this runner can later be extended with an LLM-as-judge evaluator and
golden answers, with human review for borderline cases.
