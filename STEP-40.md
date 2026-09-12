# FIZZL Digital Twin — Step 40

## Contextual Follow-up Intelligence

Adds a conservative follow-up resolver for short contextual questions such as:
- "En hoe deed hij dat?"
- "Waarom?"
- "Kun je daar een voorbeeld van geven?"
- "En daarna?"

The resolver uses recent session history only to identify the topic being referenced. It does not create new facts and does not replace Knowledge Base retrieval.

A small `followUpResolved` metadata flag is returned for evaluation/debugging.

## Safety
- No conversation content is exposed through the public metadata.
- Previous turns are used only for reference resolution.
- If context is ambiguous or unavailable, the resolver does nothing.
