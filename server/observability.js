const metrics = {
  startedAt: Date.now(),
  total: 0,
  success: 0,
  lowConfidence: 0,
  humanControl: 0,
  modes: {},
  sources: {},
  errors: 0,
  totalLatencyMs: 0
};

function recordResponse({ responseMode="direct", confidence="LOW", sources=[], humanControl=false, latencyMs=0 } = {}) {
  metrics.total++;
  metrics.success++;
  if (confidence === "LOW") metrics.lowConfidence++;
  if (humanControl) metrics.humanControl++;
  metrics.totalLatencyMs += Number(latencyMs) || 0;
  metrics.modes[responseMode] = (metrics.modes[responseMode] || 0) + 1;
  for (const source of Array.isArray(sources) ? sources : []) {
    metrics.sources[source] = (metrics.sources[source] || 0) + 1;
  }
}

function recordError() { metrics.errors++; }

function snapshot() {
  return {
    uptimeMs: Date.now() - metrics.startedAt,
    total: metrics.total,
    success: metrics.success,
    errors: metrics.errors,
    lowConfidence: metrics.lowConfidence,
    humanControl: metrics.humanControl,
    averageLatencyMs: metrics.total ? Math.round(metrics.totalLatencyMs / metrics.total) : 0,
    modes: {...metrics.modes},
    sources: {...metrics.sources}
  };
}

module.exports = { recordResponse, recordError, snapshot };
