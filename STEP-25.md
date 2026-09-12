# Step 25 — Professional Source Labels

The Digital Twin now converts internal retrieval IDs such as `experience.0.achievements.3` into recruiter-friendly source labels.

Examples:
- Mediahuis · Customer Success & Sales
- Startups & Web3 · Commercial Consulting
- TK Maxx Amsterdam · Sales & Operations
- Skills & Competencies
- AI Knowledge

The Claude prompt also no longer asks the model to append `CONFIDENCE` and `SOURCES`; the application adds that metadata separately. This prevents duplicate technical metadata from appearing inside the answer.
