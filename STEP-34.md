# FIZZL Digital Twin — Step 34

## Evaluation 2.0

This step extends the automated regression layer to cover the Decision Engine, Scenario Engine and Action Planner introduced in Steps 31–33.

### Added
- `evaluation/evaluation-suite-v2.json` — 20 tests across grounding, memory, decisions, scenarios, action planning, human control, learning and adversarial resistance.
- `evaluation/run-tests-v2.js` — automated runner with category-specific heuristics and per-category reporting.
- `evaluation/README-v2.md` — usage instructions.

The existing evaluation suite remains untouched for backward compatibility.
