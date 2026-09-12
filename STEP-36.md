# FIZZL Digital Twin — Step 36

## Quality & Observability

Adds privacy-conscious technical telemetry without storing chat content.

Tracked in memory:
- total successful requests
- errors
- low-confidence responses
- human-control detections
- response modes
- source-label usage
- average response latency

No questions, answers, or personal conversation content are written to the metrics object.

### Internal metrics
`GET /internal/metrics`

If `METRICS_TOKEN` is configured, send it in `x-metrics-token`. Without a configured token, the endpoint is intentionally available for local/demo use; production deployments should configure the token.

The chat response path remains unchanged except for internal metric recording.
