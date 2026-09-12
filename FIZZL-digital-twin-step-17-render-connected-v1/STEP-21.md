# STEP 21 — Render Homepage Fix

This step hardens the Render web service so `GET /` explicitly serves the repository root `index.html`.

## What changed
- Explicit homepage route for `/`
- Repository-root path resolution via `ROOT_DIR`
- Existing `/health` and `/api/chat` routes remain unchanged
- No API key is placed in the frontend

## Deploy
1. Upload the contents of this folder to the GitHub repository root.
2. Commit the changes.
3. Wait for Render to deploy the new commit.
4. Open the Render URL and test `/` first.
5. Then test `/health`.
