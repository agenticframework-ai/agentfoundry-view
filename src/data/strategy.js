export const slides = [
  { eyebrow: 'ENTERPRISE TRANSFORMATION', title: 'Enterprise Agentic AI', subtitle: 'A practical strategy to move from isolated pilots to trusted, measurable, intelligent workflows.', icon: 'Sparkles', tag: 'STRATEGY FRAMEWORK' },
  { eyebrow: '01 / DISCOVER', title: 'Start with the business, not the bot', subtitle: 'Find high-friction work where better decisions, faster execution and trusted data can change outcomes.', icon: 'Compass', tag: 'DISCOVERY' },
  { eyebrow: '02 / DECIDE', title: 'Should this process use an agent?', subtitle: 'Choose the least complex pattern that safely delivers the outcome. Autonomy is a design choice—not the goal.', icon: 'GitBranch', tag: 'DECISION FRAMEWORK' },
  { eyebrow: '03 / ARCHITECT', title: 'A reference architecture built for trust', subtitle: 'Connect experience, orchestration, models and enterprise systems—with security and observability throughout.', icon: 'Network', tag: 'REFERENCE ARCHITECTURE' },
  { eyebrow: '04 / SELECT', title: 'Choose frameworks by fit', subtitle: 'Match orchestration style, ecosystem and operating constraints to the workflow you need to run.', icon: 'Layers3', tag: 'FRAMEWORKS' },
  { eyebrow: '05 / GROUND', title: 'Make enterprise knowledge usable', subtitle: 'A reliable RAG system is a governed data product—not just a vector database.', icon: 'Database', tag: 'DATA & RAG' },
  { eyebrow: '06 / BUILD', title: 'Engineer agents as dependable systems', subtitle: 'Specify boundaries, tools, state, approvals and recovery before writing prompts.', icon: 'Workflow', tag: 'DEVELOPMENT LIFECYCLE' },
  { eyebrow: '07 / RUN', title: 'Deploy into a secure cloud foundation', subtitle: 'Design for isolation, resilience and portability; pick managed services to fit the organization.', icon: 'Cloud', tag: 'CLOUD ARCHITECTURE' },
  { eyebrow: '08 / PROTECT', title: 'Security is the control plane', subtitle: 'Identity, authorization, privacy and runtime controls constrain every request and action.', icon: 'ShieldCheck', tag: 'SECURITY' },
  { eyebrow: '09 / GOVERN', title: 'Accountability scales with autonomy', subtitle: 'Set ownership, risk tiers and evidence requirements across the full AI lifecycle.', icon: 'Scale', tag: 'GOVERNANCE' },
  { eyebrow: '10 / SHIP', title: 'A release pipeline for changing systems', subtitle: 'Version prompts and workflows alongside code, then evaluate before every controlled release.', icon: 'GitPullRequest', tag: 'DELIVERY' },
  { eyebrow: '11 / OPERATE', title: 'Observe outcomes—not only tokens', subtitle: 'Production confidence comes from tracing behavior, quality, policy and cost together.', icon: 'Activity', tag: 'OPERATIONS' },
  { eyebrow: '12 / BENCHMARK MODELS', title: 'Benchmark AI models for production fit', subtitle: '', icon: 'Gauge', tag: 'MODEL INTELLIGENCE' },
  { eyebrow: '13 / CLOUD ESTIMATION', title: 'Compare cloud service costs across providers', subtitle: 'Build a monthly estimate with configurable services, quantities and pricing assumptions.', icon: 'Cloud', tag: 'CLOUD ESTIMATION' },
  { eyebrow: '14 / APPLY', title: 'Put the pattern to work', subtitle: 'Start with bounded use cases, clear success measures and explicit human decision rights.', icon: 'BriefcaseBusiness', tag: 'USE CASES' },
  { eyebrow: '15 / DELIVER', title: 'Progress through evidence-based gates', subtitle: 'A production path is earned through reliability, security, adoption and operational readiness.', icon: 'Milestone', tag: 'ROADMAP' },
  { eyebrow: '16 / ORGANIZE', title: 'Build the team around the product', subtitle: 'Cross-functional ownership keeps the workflow useful, safe and supportable after launch.', icon: 'UsersRound', tag: 'OPERATING MODEL' },
  { eyebrow: '17 / DECIDE', title: 'Leave with a decision and next step', subtitle: 'Align on an opportunity, accountable owners and a time-boxed plan to validate the case.', icon: 'CircleCheck', tag: 'EXECUTIVE ACTION' }
];

export const architectureLayers = [
  { name: 'Experience', detail: 'Web, mobile, employee copilots and customer portals.', tech: 'React · enterprise portal · contact center', security: 'SSO, session controls, accessible UX', prompt: 'Which user groups can start this workflow, and what may each group see?' },
  { name: 'API & access', detail: 'Expose governed capabilities behind a consistent access boundary.', tech: 'API Gateway · OAuth/OIDC · service mesh', security: 'AuthN/AuthZ, rate limits, input validation', prompt: 'Which identities and checks protect every request?' },
  { name: 'Orchestration', detail: 'Coordinate state, plans, policies, retries and approvals.', tech: 'LangGraph · workflow engine · supervisor', security: 'Bounded state, policy checks, deterministic transitions', prompt: 'Where must the workflow pause, retry, or ask for approval?' },
  { name: 'Agent capabilities', detail: 'Specialized, scoped workers collaborate on well-defined tasks.', tech: 'Domain agents · tool adapters · HITL queues', security: 'Unique identity, tool allowlists, action approval', prompt: 'What can each specialist do, and what actions must remain prohibited?' },
  { name: 'Models', detail: 'Select and evaluate models for each task and risk tier.', tech: 'LLMs · embeddings · model router · evals', security: 'Private endpoints, model controls, content safety', prompt: 'Which model meets the task quality, latency, privacy, and cost targets?' },
  { name: 'Knowledge', detail: 'Retrieve relevant, permission-aware evidence with provenance.', tech: 'RAG · vector/hybrid search · reranking', security: 'Document ACLs, tenant boundaries, lineage', prompt: 'How will retrieval enforce source permissions and cite its evidence?' },
  { name: 'Data', detail: 'Use governed operational and analytical sources as trusted inputs.', tech: 'Lakehouse · databases · document stores', security: 'Classification, encryption, retention, residency', prompt: 'Who owns each source, and how fresh and complete must data be?' },
  { name: 'Integration', detail: 'Connect to enterprise systems through explicit contracts.', tech: 'MCP · REST · events · business applications', security: 'Scoped credentials, schemas, transaction limits', prompt: 'Which systems may the workflow read or write, and what limits apply?' },
  { name: 'Security', detail: 'Enforce enterprise policy across the agent lifecycle.', tech: 'IAM · guardrails · DLP · KMS', security: 'Least privilege, isolation, threat testing', prompt: 'Which policies, controls, and security tests are mandatory?' },
  { name: 'Observability', detail: 'Trace decisions, tools, model calls, outcomes and spend.', tech: 'Logs · metrics · traces · audit · FinOps', security: 'Immutable evidence, redaction, alerting', prompt: 'What evidence, alerts, and SLOs demonstrate quality and safe operation?' }
];

export const frameworks = [
  { name: 'LangGraph', best: 'Stateful, branching workflows requiring explicit control and checkpoints.', style: 'Graph / stateful', tradeoff: 'Strong control surface; requires thoughtful state and workflow design.' },
  { name: 'LangChain', best: 'Composable model and tool integrations across a broad application ecosystem.', style: 'Composable / general', tradeoff: 'Large ecosystem; production behavior still needs explicit orchestration.' },
  { name: 'CrewAI', best: 'Role-based agent collaboration for teams of specialized agents.', style: 'Role / task based', tradeoff: 'Intuitive collaboration model; validate control and observability needs.' },
  { name: 'Microsoft AutoGen', best: 'Research and applications exploring conversational multi-agent patterns.', style: 'Conversation / multi-agent', tradeoff: 'Useful patterns; assess current project fit and production requirements.' },
  { name: 'MCP', best: 'A protocol pattern for connecting AI applications with tools and context.', style: 'Integration protocol', tradeoff: 'Interoperability layer, not a workflow orchestrator or security boundary by itself.' },
  { name: 'LlamaIndex', best: 'Knowledge-centric applications, indexing and retrieval workflows.', style: 'Data / retrieval focused', tradeoff: 'Strong data abstractions; orchestration may be paired with another layer.' }
];

export const ragStages = ['Source systems', 'Ingestion', 'Validate & classify', 'Chunk & enrich', 'Embeddings', 'Vector / hybrid index', 'Retrieve & rerank', 'Grounded response'];
export const lifecycle = ['Discovery', 'Design', 'Agent spec', 'Tool contracts', 'Prompt & policy', 'Orchestration', 'RAG integration', 'Testing', 'Evaluation', 'Security validation', 'Deployment'];
export const cloudServices = {
  AWS: ['Route 53 / WAF', 'API Gateway', 'VPC · private subnets', 'ALB', 'ECS / EKS', 'Bedrock / SageMaker', 'S3 · Aurora', 'OpenSearch / pgvector', 'SQS · SNS · MSK', 'IAM · KMS · Secrets Manager', 'CloudWatch · X-Ray'],
  Azure: ['Front Door / WAF', 'API Management', 'VNet · private endpoints', 'Application Gateway', 'AKS / Container Apps', 'Azure OpenAI / AI Foundry', 'Blob · Azure SQL', 'AI Search / PostgreSQL', 'Service Bus · Event Hubs', 'Entra ID · Key Vault', 'Azure Monitor · App Insights'],
  GCP: ['Cloud DNS / Armor', 'API Gateway', 'VPC · private service access', 'Cloud Load Balancing', 'GKE / Cloud Run', 'Vertex AI', 'Cloud Storage · AlloyDB', 'Vertex AI Search / Vector Search', 'Pub/Sub', 'IAM · Cloud KMS · Secret Manager', 'Cloud Logging · Trace']
};

export const securityControls = [
  {
    threat:'Prompt injection, jailbreak & unsafe output',
    securityControl:'Filter inputs and outputs; detect prompt injection and jailbreaks; identify PII/PHI/PCI and secrets; apply DLP, sensitive-data masking, content safety, response validation, and runtime guardrails.',
    technology:'Runtime guardrails · content filters · DLP · secrets scanner · response validators',
    validationEvidence:'Adversarial prompt results; PII/secrets redaction checks; unsafe-output and response-validation tests; blocked-action traces',
    group:'Input / output'
  },
  {
    threat:'Hyperscaler control-plane compromise',
    securityControl:'Enforce cloud IAM, encryption at rest and in transit, KMS, secrets management, cloud network security, managed AI guardrails, and logging with threat detection.',
    technology:'AWS / Azure / GCP IAM · KMS and secret managers · private networking · managed AI controls · cloud threat detection',
    validationEvidence:'IAM policy review; encryption and key-rotation checks; network-policy tests; cloud log and alert coverage',
    group:'Cloud platform'
  },
  {
    threat:'Unauthorized agent or tool access',
    securityControl:'Give each agent a unique identity and short-lived credentials; scope API permissions; enforce RBAC/ABAC, tool allowlists, controlled MCP access, and privilege-escalation protection.',
    technology:'Workload identity · API gateway · RBAC/ABAC policy engine · tool broker · MCP authorization',
    validationEvidence:'Per-agent access review; credential-expiry tests; denied-action and privilege-escalation tests; MCP authorization logs',
    group:'Identity & action'
  },
  {
    threat:'Cross-tenant or private-data exposure',
    securityControl:'Isolate tenants and sessions; enforce vector database access controls, data classification, residency, retention and deletion policies, and privacy-by-design.',
    technology:'Tenant-aware retrieval · vector-store ACLs · data catalogue · residency and retention policies',
    validationEvidence:'Cross-tenant/session isolation tests; vector ACL tests; residency review; deletion and retention evidence',
    group:'Data & privacy'
  },
  {
    threat:'Uncontrolled or high-impact agent action',
    securityControl:'Apply deterministic policies, tool-execution authorization, parameter validation, human approval, transaction limits, a kill switch, and an immutable audit trail.',
    technology:'Policy engine · schema validation · approval workflow · transaction controls · tamper-evident audit store',
    validationEvidence:'Denied-action and limit tests; approval records; kill-switch drill; audit-integrity verification',
    group:'Identity & action'
  },
  {
    threat:'Model, parameter or fine-tuning compromise',
    securityControl:'Prevent parameter corruption and model backdoors; protect artifact integrity, signing and provenance; secure the model registry, fine-tuning datasets, prompts and configuration; block model extraction and reduce inversion/privacy leakage.',
    technology:'Signed model artifacts · provenance/attestation · secure registry · dataset lineage · privacy and integrity evaluations',
    validationEvidence:'Signature and provenance verification; registry-access audit; backdoor, extraction and inversion tests; dataset lineage review',
    group:'Model & network'
  },
  {
    threat:'Rogue agent lateral movement',
    securityControl:'Contain workloads with microsegmentation; prevent lateral movement; use network visibility and threat containment, plus AI-assisted policy generation and AI-powered deception where supported.',
    technology:'ColorTokens Xshield (illustrative) · workload isolation · microsegmentation · policy and visibility tooling',
    validationEvidence:'Workload-isolation and lateral-movement tests; segmentation-policy review; containment drill; visibility/deception coverage',
    group:'Model & network'
  },
  {
    threat:'AI application, LLM or API vulnerability',
    securityControl:'Run authorized AI application and API security testing, prompt-injection tests, vulnerability discovery, and continuous validation; verify LLM/agent attack coverage where supported.',
    technology:'Parameter (illustrative AI-assisted pentesting platform) · authorized AI/API security-testing tools',
    validationEvidence:'Written test authorization and scope; validated platform coverage; findings, retest results, and remediation evidence',
    group:'Validation & compliance'
  },
  {
    threat:'Compliance gap or delayed incident response',
    securityControl:'Maintain auditability and explainability; map data protection and regulatory requirements; manage AI risk; continuously red-team, test security controls, and rehearse incident response.',
    technology:'GRC/control mapping · agent and model registries · SIEM/SOAR · incident-response runbooks',
    validationEvidence:'Control-to-regulation mapping; risk review; red-team and security-test reports; incident tabletop and closure evidence',
    group:'Validation & compliance'
  }
];

export const useCases = [
  ['Commercial lending', 'Document intake, evidence extraction, analyst briefings and covenant monitoring.', 'Human credit approval; policy engine owns eligibility rules.'],
  ['Financial services', 'Research synthesis, service operations and controlled case preparation.', 'Regulated decisions remain accountable and reviewable.'],
  ['Insurance', 'Claims evidence organization, policy lookup and adjuster assistance.', 'Human adjudication for complex or high-impact claims.'],
  ['Healthcare', 'Clinical administration, prior authorization support and knowledge retrieval.', 'Clinician retains clinical decision authority.'],
  ['Manufacturing', 'Maintenance troubleshooting, work-order triage and parts recommendations.', 'Safety interlocks and authorized maintenance procedures.'],
  ['Retail & FMCG', 'Product content operations, demand insights and service resolution.', 'Pricing, refunds and customer commitments are bounded.'],
  ['Supply chain', 'Exception triage, shipment context and supplier communications.', 'Human approval for material commitments or rerouting.'],
  ['Real estate', 'Lease abstraction, portfolio research and service request coordination.', 'Legal and investment decisions stay with accountable staff.'],
  ['Customer service', 'Grounded response drafting, next-best action and case updates.', 'Escalate ambiguity; constrain write actions.'],
  ['Enterprise IT', 'Incident summarization, runbook retrieval and approved remediation.', 'Privileged changes require explicit approval.']
];

export const phases = [
  ['01', 'Discover & assess', 'Select a valuable, measurable workflow; baseline volume, risk and data readiness.', 'Opportunity canvas · baseline · risk tier', 'Sponsor + process owner', 'Signed problem statement, feasible data and measurable outcome.'],
  ['02', 'Architecture & security', 'Define target pattern, data path, identity model, controls and evaluation plan.', 'Architecture · threat model · control plan', 'Architecture + security', 'Design review and control owners accepted.'],
  ['03', 'Proof of concept', 'Test critical assumptions with representative data and bounded scope.', 'Working prototype · evaluation results', 'Product + engineering', 'Quality threshold met; no unsupported autonomy.'],
  ['04', 'Pilot', 'Run with real users, human oversight and operational telemetry.', 'Pilot release · runbooks · adoption data', 'Business + platform', 'Reliability, user value and support model demonstrated.'],
  ['05', 'Production', 'Harden, approve, deploy progressively and monitor against SLOs.', 'Production service · evidence pack', 'Service owner + risk', 'Security, privacy, readiness and rollback gates passed.'],
  ['06', 'Scale & improve', 'Expand use cases, optimize unit cost and continuously validate controls.', 'Reusable platform · value reviews', 'AI operating council', 'Benefits sustained; risk and cost within appetite.']
];
