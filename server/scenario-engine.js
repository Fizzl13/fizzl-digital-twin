// FIZZL Digital Twin — Scenario Engine v1
// Turns practical business scenarios into grounded action frameworks.
// It does not execute actions or invent company policy/thresholds.

function isScenario(question) {
  const q = String(question || '').toLowerCase();
  return /hoe zou frits|wat zou frits|stel dat|scenario|situatie|proces|als een klant|als ai|hoe pak|wat doe/.test(q);
}

function buildScenarioFramework(question, kb) {
  const q = String(question || '').toLowerCase();
  let type = 'general';
  let steps = kb?.decision_model?.problem_solving || [];

  if (/klacht|boos|ontevreden|customer/.test(q)) {
    type = 'customer_issue';
    steps = ['Begrijp de klacht', 'Zoek de oorzaak', 'Bepaal hoe de klant tegemoetgekomen kan worden', 'Los het probleem op of bied een alternatief', 'Zorg dat de klant zich geholpen voelt'];
  } else if (/aanbieding|upsell|cross.?sell|abonnement|sales|verkopen|prijs/.test(q)) {
    type = 'commercial';
    steps = ['Bekijk de relevante klantdata', 'Neem het huidige abonnement en de huidige prijs mee', 'Raadpleeg de beschikbare prijslijst in de kennisbank', 'Bepaal een passend aanbod', 'Benader de klant en faciliteer activering'];
  } else if (/automatis|ai|agent|handmatig|proces/.test(q)) {
    type = 'automation';
    steps = ['Bepaal welk deel van het proces onnodig tijd kost', 'Controleer of AI de handeling veilig kan uitvoeren', 'Bepaal waar menselijke controle nodig blijft', 'Laat AI zelfstandig handelen waar dat passend is', 'Gebruik menselijke feedback om het proces verder te verbeteren'];
  } else if (/priorit|welke klant.*eerst|eerste.*klant/.test(q)) {
    type = 'prioritization';
    steps = ['Controleer of er op korte termijn een afschrijving plaatsvindt', 'Bekijk eerdere klachten', 'Neem het type abonnement mee', 'Geef hogere prioriteit aan duurdere abonnementen'];
  }

  return { type, steps, principle: 'Probleem begrijpen → data gebruiken → passende actie → menselijke controle waar nodig → leren van feedback' };
}

function formatScenario(question, kb) {
  if (!isScenario(question)) return '';
  const s = buildScenarioFramework(question, kb);
  return `SCENARIO FRAMEWORK (${s.type}):\nPrinciple: ${s.principle}\n${s.steps.map((x, i) => `${i + 1}. ${x}`).join('\n')}`;
}

module.exports = { isScenario, buildScenarioFramework, formatScenario };
