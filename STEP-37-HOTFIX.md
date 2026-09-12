# Step 37 HOTFIX

The first Step 37 build had a runtime ReferenceError in the public trace construction.
This version is rebuilt from the stable Step 36 base and adds the trace cleanly.

The trace is high-level only and does not expose prompts, retrieved text, private conversation content, or hidden reasoning.
