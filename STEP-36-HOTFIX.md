# Step 36 Hotfix

The previous Step 36 deployment had a JavaScript syntax error in `server/api.js`.
This hotfix rebuilds the observability integration cleanly on top of the stable Step 35 code.

Verified locally:
- `node --check server/api.js` passes
- `node --check server/observability.js` passes
- `/health` returns HTTP 200
- `/api/chat` returns a valid response with allowed origin
- `/internal/metrics` returns telemetry
- chat content is not stored in the metrics object
