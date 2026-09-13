const ROLE_PROFILES = {
  junior_ai: {
    title: 'Junior AI / AI Implementation',
    fit: 'STRONG POTENTIAL',
    strengths: [
      'Praktische AI-projectervaring via de FIZZL Digital Twin.',
      'Ervaring met LLM/Generative AI, Claude API, RAG en semantic retrieval.',
      'Ervaring met decision, scenario en action-planning lagen.',
      'Combinatie van AI, klantprocessen en commerciële businesscontext.'
    ],
    gaps: [
      'Geen formele AI-certificaten gedocumenteerd.',
      'Er is geen gevorderd programmeerniveau gedocumenteerd.'
    ],
    next: 'Laat het Digital Twin-project en de technische architectuur zien als concreet portfolio-bewijs.'
  },
  ai_customer_service: {
    title: 'AI Customer Service / Automation',
    fit: 'VERY STRONG',
    strengths: [
      'Directe Customer Success- en Sales-ervaring.',
      'Gedocumenteerde visie op AI voor klantprocessen en automatisering.',
      'Human-in-the-loop bij financiële en beoordelingsgevoelige situaties.',
      'FIZZL Digital Twin toont praktische AI-implementatie.'
    ],
    gaps: [
      'Geen specifieke productie-implementatie bij een externe organisatie gedocumenteerd.'
    ],
    next: 'Gebruik de Digital Twin als case voor veilige AI-ondersteuning van klantprocessen.'
  },
  customer_success: {
    title: 'Customer Success / Account Management',
    fit: 'VERY STRONG',
    strengths: [
      '4+ jaar gedocumenteerde Customer Success-ervaring.',
      'Retentie, upsell/cross-sell en account expansion.',
      'CRM- en data-gedreven klantbenadering.',
      'Ervaring met escalaties, klantrelaties en cross-functionele samenwerking.'
    ],
    gaps: [],
    next: 'Benadruk de combinatie van klantresultaten, commerciële vaardigheden en procesverbetering.'
  },
  sales: {
    title: 'Sales / Commercial',
    fit: 'VERY STRONG',
    strengths: [
      'Consultative selling, upselling/cross-selling en account expansion.',
      'Meetbare retentie- en omzetresultaten bij Mediahuis.',
      'Commerciële consultancy voor early-stage startups.',
      'Data gebruiken om passende klantaanbiedingen te bepalen.'
    ],
    gaps: [],
    next: 'Gebruik de Mediahuis- en startupresultaten als primaire bewijsvoering.'
  }
};

function getRoleFit(role, kb) {
  const profile = ROLE_PROFILES[role] || ROLE_PROFILES.junior_ai;
  return {
    role: profile.title,
    fit: profile.fit,
    strengths: profile.strengths,
    gaps: profile.gaps,
    next: profile.next,
    evidence: {
      project: kb?.projects?.documented_projects?.[0]?.name || 'FIZZL Digital Twin',
      profile: kb?.profile?.headline || '',
      documented: true
    }
  };
}

module.exports = { getRoleFit, ROLE_PROFILES };
