function detectResponseMode({ question = "", intent = "general", scenario = null, actionPlan = null } = {}) {
  const q = String(question).toLowerCase();

  if (actionPlan) return {
    mode: "action_plan",
    style: "concrete",
    instructions: "Give practical ordered steps. Include the human-control gate when relevant."
  };

  if (scenario) return {
    mode: "scenario",
    style: "practical",
    instructions: "Answer as a grounded practical approach. Distinguish documented principles from assumptions."
  };

  if (intent === "customer_issue" || /klacht|boos|boze klant|customer complaint|angry customer/.test(q)) {
    return {
      mode: "customer_case",
      style: "empathetic",
      instructions: "Lead with understanding, then root cause, accommodation, solution or alternative."
    };
  }

  if (intent === "commercial" || /sales|verkoop|aanbieding|upsell|cross.?sell|revenue|commercial/.test(q)) {
    return {
      mode: "business",
      style: "professional",
      instructions: "Use concise business reasoning grounded in the documented commercial approach."
    };
  }

  if (intent === "automation" || /automatiseer|automatiseren|ai-proces|ai proces|automation/.test(q)) {
    return {
      mode: "ai_process",
      style: "technical-practical",
      instructions: "Explain the process, the AI gate, and where human control remains necessary."
    };
  }

  if (/ai|llm|rag|api|agent|embedding|semantic|technisch|technical/.test(q)) {
    return {
      mode: "ai_technical",
      style: "technical",
      instructions: "Be technically precise but only claim technologies and experience supported by the knowledge base."
    };
  }

  if (/hoe werkt|how does|waarom|why|hoe zou|how would/.test(q)) {
    return {
      mode: "explanatory",
      style: "clear",
      instructions: "Explain the relevant documented principle first, then give a concise application."
    };
  }

  return {
    mode: "direct",
    style: "concise",
    instructions: "Answer the exact question first and avoid unnecessary detail."
  };
}

module.exports = { detectResponseMode };
