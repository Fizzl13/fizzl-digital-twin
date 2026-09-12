// FIZZL Digital Twin — Decision Engine v1
// Converts documented decision principles into a small, grounded guidance block.
// It does not invent thresholds or hidden reasoning.

function classify(question) {
  const q = String(question || '').toLowerCase();
  if (/klant.*boos|klacht|ontevreden|complaint/.test(q)) return 'customer_issue';
  if (/aanbieding|upsell|cross.?sell|verkopen|sales|abonnement|prijs|offer/.test(q)) return 'commercial';
  if (/priorit|welke klant.*eerst|eerste.*klant/.test(q)) return 'prioritization';
  if (/automatis|ai.*inzet|inzet.*ai|human|mens.*nodig|agent/.test(q)) return 'automation';
  if (/probleem|proces.*beter|proces.*sneller|verbeter/.test(q)) return 'problem_solving';
  if (/feedback|leren|verbeter.*agent|correct/.test(q)) return 'learning';
  if (/empath|menselijke connectie|authentiek/.test(q)) return 'human_value';
  return 'general';
}

function buildGuidance(question, kb) {
  const type = classify(question);
  const dm = kb?.decision_model || {};
  const flows = {
    customer_issue: ['Begrijp de klacht', 'Zoek de oorzaak', 'Kijk hoe de klant tegemoetgekomen kan worden', 'Los het probleem op of bied een alternatief', 'Zorg dat de klant zich geholpen voelt'],
    commercial: ['Bekijk klantdata', 'Neem huidig abonnement en huidige prijs mee', 'Raadpleeg beschikbare prijslijst', 'Bepaal een passend aanbod', 'Benader de klant en faciliteer activering'],
    prioritization: ['Controleer of er op korte termijn een afschrijving plaatsvindt', 'Bekijk eerdere klachten', 'Neem het type abonnement mee', 'Geef hogere prioriteit aan duurdere abonnementen'],
    automation: ['Bepaal of de handeling het proces onnodig vertraagt', 'Controleer of AI de handeling veilig kan uitvoeren', 'Houd menselijke controle bij financiële of risicovolle cases', 'Laat AI zelfstandig handelen waar menselijke tussenkomst niet nodig is'],
    problem_solving: ['Herken en valideer het probleem met collega’s', 'Ervaar het proces zelf', 'Zoek samen naar oplossingen', 'Zet AI in wanneer dat passend en veilig is'],
    learning: ['Leg vast wanneer een medewerker de AI corrigeert', 'Gebruik die correctie als feedback', 'Verbeter de agent', 'Verminder waar mogelijk toekomstige handmatige correcties'],
    human_value: ['Behoud empathie', 'Behoud authenticiteit', 'Behoud menselijke connectie', 'Gebruik AI om mensen te ondersteunen, niet om die connectie onnodig te vervangen'],
    general: dm.problem_solving || []
  };
  return {
    type,
    guidance: flows[type] || []
  };
}

function formatGuidance(question, kb) {
  const result = buildGuidance(question, kb);
  if (!result.guidance.length) return '';
  return `DECISION GUIDANCE (${result.type}):\n${result.guidance.map((x, i) => `${i + 1}. ${x}`).join('\n')}`;
}

module.exports = { classify, buildGuidance, formatGuidance };
