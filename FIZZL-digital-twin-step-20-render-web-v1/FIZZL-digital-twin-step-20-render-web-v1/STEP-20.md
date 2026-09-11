# FIZZL Digital Twin — Step 20

## Goal
Connect the Render web service to the Digital Twin browser interface.

## Fix
Previously `GET /` returned `{\"error\":\"Not found\"}` because the Node service only exposed the API routes. This step makes the same Render service serve the frontend while keeping the API routes intact.

## Routes
- `/` → Digital Twin interface
- `/health` → backend health JSON
- `/api/chat` → chat API
- `/evaluation/` → evaluation dashboard
- `/showcase/` → showcase page

## Security
Static serving uses an explicit allowlist. Server-side files such as `.env`, `server/`, and the knowledge base are not exposed as arbitrary paths.

## Deploy
Push/upload this version to the existing `Fizzl13/fizzl-digital-twin` GitHub repository. Render should automatically deploy the new commit.

## Test
1. Open `https://fizzl-digital-twin.onrender.com/`.
2. Confirm the Digital Twin interface appears instead of `Not found`.
3. Confirm `/health` still returns the online JSON response.
4. Test a question in the chat.
