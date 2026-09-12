# FIZZL DIGITAL TWIN — STEP 26

## Smart Confidence Scoring

Improves confidence metadata so directly supported answers are marked HIGH, partial evidence is MEDIUM, and insufficient retrieval remains LOW.

### Rules
- HIGH: direct meaningful term match in the strongest retrieved evidence, or a strong retrieval score.
- MEDIUM: useful but less direct evidence.
- LOW: weak or missing evidence.

The model answer remains grounded in the Knowledge Base; this change only improves the application-level confidence label.
