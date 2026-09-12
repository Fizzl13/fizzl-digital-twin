# STEP 22 — Chat Connection Fix

## What changed
- Fixed same-origin CORS handling on the Render service.
- The homepage now calls `/health` and `/api/chat` on the current host by default.
- External API origins can still be explicitly allowlisted with `ALLOWED_ORIGINS`.
- No API key is exposed in the browser.

## Why
The Render homepage was loading correctly, but browser POST requests to `/api/chat` could be rejected because the configured allowlist only contained `https://ai.fizzl.eu` while the live test was running on the Render `onrender.com` hostname.

## Test
After deployment, open the homepage and ask:

> Welke ervaring heeft Frits met klantretentie?

Expected: a grounded Digital Twin response rather than an empty/non-response.
