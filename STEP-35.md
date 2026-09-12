# FIZZL Digital Twin — Step 35

## Adaptive Response Layer

The Digital Twin now selects a response mode based on the grounded request:

- `direct` — concise factual/profile questions
- `business` — commercial questions
- `customer_case` — empathetic customer situations
- `ai_process` — AI/process automation
- `ai_technical` — technical AI questions
- `scenario` — practical scenarios
- `action_plan` — ordered implementation steps
- `explanatory` — how/why questions

The selected mode changes communication style, not the factual knowledge base. Grounding and human-control rules remain active.

## Validation

Evaluation 2.1 adds four adaptive-response regression cases and checks that the API returns `responseMode` metadata.
