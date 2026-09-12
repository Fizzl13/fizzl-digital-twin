# STEP 23 — No-Reload Chat Fix

## Problem
Pressing ASK was causing the browser to return to the initial page state, which indicates native form navigation was still possible when the chat JavaScript did not fully attach.

## Fix
- Replaced the native `<form>` submit flow with a non-navigating chat container.
- ASK is now an explicit button.
- Enter sends the question without navigation.
- Removed `type="module"` from the app script and use a deferred normal script for broader browser compatibility.
- The existing same-origin `/api/chat` connection from Step 22 is preserved.

## Expected result
Pressing ASK must keep the current page in place. The user question should appear immediately in the chat, followed by either a grounded answer or a clear connection/API error.
