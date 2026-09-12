# FIZZL Digital Twin — Step 18

## Goal
Make the live AI frontend more reliable when connected to the Render backend.

## Added
- Automatic `/health` check when the frontend loads.
- Clear ONLINE / OFFLINE connection state.
- 8-second health timeout.
- 30-second chat request timeout.
- Better handling of non-JSON and HTTP errors.
- Frontend verifies the API before sending a chat request.
- Existing conversation memory, RAG and CLEAR SESSION behavior preserved.

## Render
The frontend continues to use:
`https://fizzl-digital-twin.onrender.com`

The backend must expose:
- `GET /health`
- `POST /api/chat`
- `DELETE /api/chat?conversationId=...`

## Test
1. Deploy the repository on Render.
2. Confirm `/health` returns JSON with `ok: true`.
3. Open `https://ai.fizzl.eu`.
4. The status should change from `CHECKING CONNECTION` to `ONLINE`.
5. Ask: `Welke ervaring heeft Frits met klantretentie?`
