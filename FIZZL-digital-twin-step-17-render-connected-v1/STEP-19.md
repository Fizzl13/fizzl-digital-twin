# FIZZL Digital Twin — Step 19

## Goal
Make the live Digital Twin resilient to Render free-tier cold starts.

## Added
- Health checks can now wait for a sleeping Render instance to wake up.
- Frontend shows `WAKING UP API` while the backend is starting.
- Initial page-load health check retries for up to 30 seconds.
- A chat request can wait up to 60 seconds for the backend to become healthy.
- Health polling uses a 5-second interval to avoid excessive requests.
- Existing session memory, RAG, CLEAR SESSION, confidence and source metadata remain intact.

## Render
Backend URL remains:
`https://fizzl-digital-twin.onrender.com`

Required endpoints:
- `GET /health`
- `POST /api/chat`
- `DELETE /api/chat?conversationId=...`

## Test
1. Deploy the repository on Render.
2. Open `https://ai.fizzl.eu`.
3. If the Render service is sleeping, the status should show `WAKING UP API`.
4. After startup it should become `ONLINE`.
5. Ask: `Welke ervaring heeft Frits met klantretentie?`
6. Confirm the answer arrives even after a Render cold start.
