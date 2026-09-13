# Step 41 Hotfix 2

Rebuilt from stable Step 40.

Root cause of the previous Step 41 crash:
`answer` was declared with `const` and then reassigned by the response guard.

Fix:
- keep generated answer immutable
- validate `cleanAnswer`
- use a separate `guardedAnswer`
- preserve existing chat/session flow
- return guard metadata safely

No other architecture changes.
