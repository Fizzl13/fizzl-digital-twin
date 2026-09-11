# FIZZL Digital Twin — Step 17

## Goal
Connect the AI.fizzl.eu chat frontend to the live Render API and fix the frontend/backend integration.

### Fixed
- Frontend now calls `https://fizzl-digital-twin.onrender.com/api/chat`.
- Frontend selectors now match the HTML (`#messages`, `#question`).
- Render backend now supports CORS for the configured `ALLOWED_ORIGINS`.
- Added `OPTIONS` handling for browser preflight requests.
- Added `/` and `/health` endpoints so the Render service can be checked in a browser.

## Deploy
1. Deploy this full package to Render from the repository/root.
2. Keep `ALLOWED_ORIGINS=https://ai.fizzl.eu`.
3. In STRATO, upload the frontend files (`index.html`, `style.css`, `js/`) to the folder mapped to `ai.fizzl.eu`.
4. Open `https://ai.fizzl.eu` and ask: `Welke ervaring heeft Frits met klantretentie?`

The browser should no longer show `Not found`; that message was caused by opening the API root before a root route existed. The chat itself uses the `/api/chat` POST endpoint.
