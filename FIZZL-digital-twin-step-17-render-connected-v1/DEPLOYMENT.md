# FIZZL DIGITAL TWIN — Production Deployment

## 1. Environment
Create a server-side `.env` from `.env.example`.

Set:
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`
- `ALLOWED_ORIGINS=https://ai.fizzl.eu`
- `RATE_LIMIT_MAX=30`

Never expose the API key in HTML, CSS or browser JavaScript.

## 2. HTTPS
Serve the frontend and API behind HTTPS. Use a reverse proxy such as Nginx/Caddy
or the hosting provider's supported Node deployment.

## 3. CORS
The API uses an exact origin allowlist. Keep only the domains that should access it.

## 4. Security included
- request-size limit
- per-IP rate limiting
- secure response headers
- restrictive Content Security Policy
- server-side API key
- server-owned session memory
- generic production error messages

## 5. Important prototype limitation
Session memory is in-process. A restart clears sessions, and multiple server instances
do not share sessions. For scaling, use Redis or another server-side session store.

## 6. Before public launch
Run the Step 11 automated tests against the deployed API and manually review the Step 10
evaluation cases, especially unsupported claims and adversarial prompts.
