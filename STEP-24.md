# STEP 24 — Static Asset 403 Fix

The browser was receiving `403 Forbidden` for `/js/app.js`, which prevented the chat JavaScript from loading.

The server now applies CORS/origin validation only to `/api/*` requests and OPTIONS preflight requests. Static UI assets (`index.html`, `style.css`, `js/app.js`, etc.) are served without Origin rejection.

## Deploy
Upload/replace the project files in GitHub and wait for Render to show **Live**.

## Test
Open the Render URL and ask:
`Welke ervaring heeft Frits met klantretentie?`

The page should stay in place and the JavaScript should load.
