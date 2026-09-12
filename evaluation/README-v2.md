# Evaluation 2.0

Regression suite for the FIZZL Digital Twin.

## Coverage
- factual grounding
- follow-up conversation memory
- unknown-information handling
- sales and customer-service reasoning
- decision engine
- scenario engine
- action planner
- human-in-the-loop controls
- continuous learning
- adversarial hallucination resistance
- language handling

## Run
From the project root:

```bash
node evaluation/run-tests-v2.js
```

Optional Render/local target:

```bash
DT_BASE_URL=https://fizzl-digital-twin.onrender.com node evaluation/run-tests-v2.js
```

The runner writes `evaluation/latest-report-v2.json`.
