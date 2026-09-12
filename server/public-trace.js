function buildPublicTrace({
  retrievedCount = 0, intent = "general", decisionGuidance = "",
  scenarioFramework = "", actionPlan = "", responseMode = "direct", confidence = "LOW"
} = {}) {
  return [
    {stage:"question", status:"complete", detail:"Question received"},
    {stage:"knowledge_retrieval", status:retrievedCount > 0 ? "matched" : "no_match",
      detail:`${retrievedCount} relevant knowledge item${retrievedCount === 1 ? "" : "s"} retrieved`},
    {stage:"intent", status:"complete", detail:intent},
    {stage:"decision", status:decisionGuidance ? "active" : "not_needed",
      detail:decisionGuidance ? "Documented decision guidance applied" : "No decision framework required"},
    {stage:"scenario", status:scenarioFramework ? "active" : "not_needed",
      detail:scenarioFramework ? "Scenario framework applied" : "No scenario framework required"},
    {stage:"action_planning", status:actionPlan ? "active" : "not_needed",
      detail:actionPlan ? "Action planning framework applied" : "No action plan requested"},
    {stage:"response", status:"complete", detail:`${responseMode} response · ${confidence} confidence`}
  ];
}
module.exports = {buildPublicTrace};
