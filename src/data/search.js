import {
  architectureLayers,
  cloudServices,
  frameworks,
  lifecycle,
  phases,
  ragStages,
  securityControls,
  slides,
  useCases
} from './strategy.js';
import { ragPlaybookSections } from './ragPlaybook.js';

const sectionGuides = [
  ['Enterprise Agentic AI vision', 'Business transformation from manual operations to AI-assisted workflows and bounded autonomous workflows. Outcomes include productivity, customer experience, risk reduction, operational efficiency, and revenue growth.', 'automation productivity customer experience business transformation outcomes'],
  ['Business discovery', 'Business objectives, process bottlenecks, manual effort, customer impact, data readiness, applications, regulations, and measurable KPIs. Capture a baseline before estimating benefits.', 'opportunity canvas bottleneck baseline workshop discovery questionnaire'],
  ['Choosing an AI pattern', 'Compare deterministic automation, rules-based workflows, traditional machine learning, LLM and RAG assistants, single agents, and multi-agent systems. Use predictability, business rules, data readiness, risk, and feasibility.', 'decision tree agent suitability weighted score uncertainty complexity tools predictability'],
  ['Enterprise reference architecture', 'Experience, API access, orchestration, agents, models, knowledge, data, integration, security, and observability layers. Design identity, policy, privacy, and telemetry across the full system.', 'reference design layers APIs tools data access control'],
  ['Framework selection', 'Compare LangGraph, LangChain, CrewAI, Microsoft AutoGen, MCP, and LlamaIndex by orchestration style, state, tool use, ecosystem fit, and operating trade-offs.', 'framework comparison supervisor planner stateful stateless memory human in loop'],
  ['Data engineering and RAG', 'Source ingestion, validation, classification, chunking, embeddings, vector and hybrid search, reranking, permission-aware retrieval, citations, and grounded responses.', 'data retrieval vector database embeddings document search access-aware RAG'],
  ['Agent development lifecycle', 'Discovery, design, agent specifications, tool contracts, prompt and policy, orchestration, RAG integration, testing, evaluation, security validation, and deployment.', 'engineering contracts retries fallback state idempotency testing'],
  ['Cloud infrastructure', 'AWS reference services and comparable Azure and Google Cloud options for networks, APIs, containers, foundation models, storage, search, events, identity, keys, and monitoring.', 'AWS Azure GCP cloud VPC Kubernetes ECS Bedrock SageMaker OpenSearch'],
  ['Enterprise AI security', 'Interactive threat-to-control matrix covering input/output filtering, prompt injection, PII and secrets, hyperscaler IAM and encryption, least-privilege agents and MCP, tenant/vector isolation, controlled actions, model integrity, Parameter pentesting, ColorTokens Xshield microsegmentation, compliance, red teaming, and incident response.', 'security prompt injection jailbreak PII PHI PCI DLP IAM KMS MCP tenant vector isolation authorization model backdoor extraction Parameter ColorTokens Xshield microsegmentation compliance audit red team'],
  ['AI governance', 'Risk classification, accountable owners, agent and model registries, policy management, change control, responsible AI, explainability, and compliance evidence.', 'governance accountability risk classification registry audit'],
  ['CI/CD and production deployment', 'Version code, prompts, models, and workflows; run tests and evaluations; scan security; deploy canary or blue-green releases; monitor and roll back safely.', 'deployment CI CD DevSecOps MLOps LLMOps Docker Kubernetes Terraform'],
  ['Production monitoring', 'Track agent success, task completion, model latency, input/output token consumption, cost per task, tool failure rate, hallucination and groundedness, guardrail violations, human escalation, agent loop detection, API availability, and SLA/SLO attainment.', 'observability dashboard SLO SLA metrics traces logs hallucination completion availability tokens tool failures loop detection escalation'],
  ['AI model benchmarking', 'Compare model quality, latency, economics, tool execution, structured output, groundedness, security compliance, workflow completion, and production readiness. Import experiment or production telemetry from CSV or JSON, tune mandatory thresholds, rank qualified models, and export reports.', 'AI model benchmark performance economics production telemetry CSV JSON latency quality cost successful task thresholds ranking'],
  ['Cloud service cost estimation', 'Compare monthly cloud service costs across AWS, Azure, and Google Cloud. Configure service quantities, hours, custom services and unit prices, regional adjustments, and commitment discounts; use example configurations and official provider calculators.', 'cloud cost estimator calculator pricing AWS Azure Google Cloud GCP monthly service quantity hours virtual machines Kubernetes storage database network regional adjustment discount'],
  ['Enterprise use cases', 'Illustrative use cases across lending, financial services, insurance, healthcare, manufacturing, retail, supply chain, real estate, customer service, and IT operations.', 'commercial lending credit approval fraud covenant healthcare claims supply chain'],
  ['POC-to-production roadmap', 'Six delivery phases from discovery and architecture through proof of concept, pilot, production, and scale, with owners, deliverables, acceptance criteria, and exit gates.', 'roadmap POC pilot production acceptance criteria milestones'],
  ['Operating model and team', 'Business, product, architecture, engineering, data, cloud, security, risk, operations, and human-review roles with an illustrative RACI.', 'roles RACI responsibility product owner architect reviewer SRE'],
  ['Executive action plan', 'Capture the opportunity, recommended pattern, architecture, readiness, estimated investment, business value, timeline, dependencies, risks, accountable owner, and next actions.', 'executive decision workshop summary next steps investment readiness']
].map(([title,summary,keywords],section)=>({section,title,summary,keywords,category:'Section guide'}));

const record=(section,title,summary,category,keywords='')=>({section,title,summary,category,keywords});

export const strategySearchRecords=[
  ...sectionGuides,
  ...architectureLayers.map(layer=>record(3,layer.name,`${layer.detail} Technology options: ${layer.tech}. Security requirements: ${layer.security}. Workshop prompt: ${layer.prompt}`,'Architecture layer')),
  ...frameworks.map(item=>record(4,item.name,`${item.best} Trade-off: ${item.tradeoff}`,'Framework',item.style)),
  ...ragStages.map((stage,index)=>record(5,stage,[
    'Connect authoritative systems and preserve source identity.',
    'Ingest incrementally with resilient connectors and change capture.',
    'Validate schema, classify sensitivity, and apply access labels.',
    'Create semantically useful chunks with metadata and lineage.',
    'Generate vectors using a selected, evaluated embedding model.',
    'Index vectors with lexical search for hybrid retrieval.',
    'Filter by permissions, retrieve candidates, and rerank relevance.',
    'Return evidence-linked responses and abstain when evidence is weak.'
  ][index],'RAG stage')),
  ...ragPlaybookSections.flatMap(section=>[
    record(5,section.title,section.summary,`RAG playbook · ${section.label}`),
    ...section.tables.flatMap(table=>table.rows.map(row=>record(5,row[0],row.slice(1).join('. '),`RAG playbook · ${section.label}`,`${section.title} ${table.title}`))),
    ...(section.tips||[]).map(([title,summary])=>record(5,title,summary,`RAG playbook · ${section.label}`,section.title))
  ]),
  record(5,'Supplier Agreement §8.2','Either party may elect not to renew by providing written notice no fewer than 60 days before the end of the current term. Illustrative retrieved source; verify against the authoritative agreement.','Sample retrieved evidence','renewal notice period contract term supplier agreement sixty days'),
  ...lifecycle.map((step,index)=>record(6,step,'Define a testable boundary, ownership, failure behavior, evaluation criteria, and release evidence for this lifecycle step.','Lifecycle step')),
  ...Object.entries(cloudServices).flatMap(([provider,services])=>services.map(service=>record(7,service,`${provider} reference service option. Validate networking, identity, availability, disaster recovery, and cost for the intended workload.`,'Cloud option',provider))),
  ...securityControls.map(({threat,securityControl,technology,validationEvidence})=>record(8,threat,`Control: ${securityControl}. Technology options: ${technology}. Validation evidence: ${validationEvidence}.`,'Security control')),
  ...useCases.map(([name,example,guardrail])=>record(14,name,`${example} ${guardrail}`,'Use case',name==='Commercial lending'?'commercial lending loan origination loan approval credit underwriting':name)),
  ...phases.map(([,name,activities,deliverables,owners,gate])=>record(15,name,`${activities} Deliverables: ${deliverables}. Owners: ${owners}. Exit gate: ${gate}`,'Roadmap phase'))
];

const normalize=value=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();

export function searchStrategy(query) {
  const tokens=normalize(query).split(/\s+/).filter(token=>token.length>1);
  if(!tokens.length)return [];

  return strategySearchRecords.map(item=>{
    const title=normalize(item.title);
    const summary=normalize(item.summary);
    const keywords=normalize(item.keywords||'');
    const searchable=`${title} ${keywords} ${summary}`;
    let score=0;
    let matchedTokens=0;
    for(const token of tokens){
      const inTitle=title.includes(token);
      const inKeywords=keywords.includes(token);
      const inSummary=summary.includes(token);
      if(inTitle||inKeywords||inSummary)matchedTokens++;
      if(inTitle)score+=6;
      if(inKeywords)score+=4;
      if(inSummary)score+=2;
    }
    if(tokens.length>1&&tokens.every(token=>searchable.includes(token)))score+=3;
    if(matchedTokens<Math.min(tokens.length,2))score=0;
    return {...item,score,sectionTitle:slides[item.section].title};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.section-b.section||a.title.localeCompare(b.title)).slice(0,10);
}
