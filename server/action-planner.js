// FIZZL Digital Twin — Action Planner v1
// Converts a grounded scenario/decision framework into a practical action plan.
// It does not execute actions, invent policy, or expose hidden chain-of-thought.

function isActionRequest(question) {
  const q = String(question || '').toLowerCase();
  return /actieplan|stappenplan|plan van aanpak|wat moet er gebeuren|concreet plan|hoe pak.*aan|wat zou.*doen|implementeren|invoeren/.test(q);
}

function buildActionPlan(question, kb) {
  const q = String(question || '').toLowerCase();
  let domain = 'general';
  let actions = kb?.decision_model?.problem_solving || [];
  let humanGate = 'Beoordeel of menselijke controle nodig is voordat een consequentiale actie wordt uitgevoerd.';

  if (/aanbieding|upsell|cross.?sell|abonnement|sales|prijs/.test(q)) {
    domain = 'commercial';
    actions = [
      'Verzamel relevante klantdata en bekijk het huidige abonnement en de huidige prijs',
      'Controleer de beschikbare prijslijst in de kennisbank',
      'Bepaal een passend en relevant aanbod',
      'Laat AI de klantbenadering en e-mail voorbereiden of uitvoeren waar dat veilig kan',
      'Bied een duidelijke route voor activering en vervolgcontact'
    ];
    humanGate = 'Laat een medewerker controleren wanneer financiële gegevens, rekeningen of uitzonderingen een rol spelen.';
  } else if (/klacht|boos|ontevreden|customer/.test(q)) {
    domain = 'customer_issue';
    actions = [
      'Analyseer de klacht en relevante klantcontext',
      'Zoek de oorzaak van het probleem',
      'Bepaal een passende oplossing of alternatief',
      'Laat AI de standaardcase afhandelen wanneer menselijke tussenkomst niet nodig is',
      'Escaleren naar een medewerker wanneer empathie, risico of complexiteit dat vereist'
    ];
    humanGate = 'Houd menselijke controle bij complexe, gevoelige of financieel consequentiale cases.';
  } else if (/automatis|ai|agent|proces/.test(q)) {
    domain = 'automation';
    actions = [
      'Breng het huidige proces en de tijdrovende handmatige stappen in kaart',
      'Valideer het probleem met betrokken collega’s en ervaar het proces zelf',
      'Bepaal welke handelingen veilig door AI kunnen worden overgenomen',
      'Ontwerp een human-in-the-loop controlepunt voor risicovolle uitzonderingen',
      'Meet resultaten en gebruik menselijke correcties als feedback voor verbetering'
    ];
    humanGate = 'Behoud menselijke controle bij financiële zaken, rekeningen en andere consequentiale uitzonderingen.';
  }

  return {
    domain,
    actions,
    human_gate: humanGate,
    outcome: 'Efficiënter en winstgevender werken terwijl klanttevredenheid en menselijke controle behouden blijven.'
  };
}

function formatActionPlan(question, kb) {
  if (!isActionRequest(question)) return '';
  const plan = buildActionPlan(question, kb);
  return `ACTION PLAN (${plan.domain}):\n${plan.actions.map((x, i) => `${i + 1}. ${x}`).join('\n')}\nHUMAN GATE: ${plan.human_gate}\nOUTCOME: ${plan.outcome}`;
}

module.exports = { isActionRequest, buildActionPlan, formatActionPlan };
