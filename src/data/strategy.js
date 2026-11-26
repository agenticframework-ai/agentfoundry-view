export const slides = [
  { eyebrow: 'ENTERPRISE TRANSFORMATION', title: 'Enterprise Agentic AI', subtitle: 'A practical strategy to move from isolated pilots to trusted, measurable, intelligent workflows.', icon: 'Sparkles', tag: 'STRATEGY FRAMEWORK' },
  { eyebrow: '01 / DISCOVER', title: 'Start with the business, not the bot', subtitle: 'Pick a customer scenario. The Final Opportunity is scored by the Decision Fit Index: a transparent, rule-based score driven by four decision capabilities and a 16-point evidence checklist.', icon: 'Compass', tag: 'DISCOVERY' },
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

export const cloudArchitectureProviders = {
  AWS: {
    layers: [
      { name: 'Experience and access', detail: 'Web, mobile, APIs', services: ['React / Angular', 'CloudFront', 'Route 53', 'AWS WAF'] },
      { name: 'API and traffic management', detail: 'Secure entry', services: ['API Gateway', 'Application Load Balancer', 'AppSync (GraphQL)', 'AWS Shield'] },
      { name: 'Application and compute', detail: 'Microservices', services: ['ECS Fargate', 'EKS Kubernetes', 'Lambda', 'Spring Boot / FastAPI'] },
      { name: 'Data and storage', detail: 'Persistent data', services: ['Aurora PostgreSQL', 'DynamoDB', 'ElastiCache', 'S3'] },
      { name: 'Integration and messaging', detail: 'Event driven', services: ['MSK (Kafka)', 'SQS', 'SNS', 'EventBridge'] }
    ],
    security: 'Cognito · IAM · KMS · Secrets Manager · CloudWatch · X-Ray',
    model: 'Amazon Bedrock',
    modelDetail: 'Managed foundation model service',
    purpose: 'Build generative AI applications using hosted foundation models.',
    integrations: ['FastAPI / Spring Boot', 'LangChain / LangGraph', 'Knowledge Bases / RAG', 'S3 document storage'],
    considerations: ['Model selection and latency', 'Token usage and cost management', 'IAM permissions and data protection', 'Fallback models and retry strategies'],
    alternatives: ['Amazon SageMaker', 'Amazon Nova', 'Partner models']
  },
  Azure: {
    layers: [
      { name: 'Experience and access', detail: 'Web, mobile, APIs', services: ['React / Angular', 'Azure Front Door', 'Azure DNS', 'Web Application Firewall'] },
      { name: 'API and traffic management', detail: 'Secure entry', services: ['API Management', 'Application Gateway', 'Azure Load Balancer', 'DDoS Protection'] },
      { name: 'Application and compute', detail: 'Microservices', services: ['Azure Kubernetes Service', 'Container Apps', 'Azure Functions', 'Spring Boot / FastAPI'] },
      { name: 'Data and storage', detail: 'Persistent data', services: ['Azure Database for PostgreSQL', 'Cosmos DB', 'Azure Managed Redis', 'Blob Storage'] },
      { name: 'Integration and messaging', detail: 'Event driven', services: ['Event Hubs', 'Service Bus', 'Event Grid', 'Logic Apps'] }
    ],
    security: 'Entra ID · Key Vault · Defender for Cloud · Azure Monitor · App Insights',
    model: 'Azure AI Foundry',
    modelDetail: 'Managed AI model and application platform',
    purpose: 'Build, evaluate, and govern generative AI applications with managed models.',
    integrations: ['FastAPI / Spring Boot', 'Semantic Kernel / LangChain', 'Azure AI Search / RAG', 'Blob Storage'],
    considerations: ['Model availability by region', 'Token usage and cost management', 'Managed identity and data protection', 'Content safety and fallback behavior'],
    alternatives: ['Azure OpenAI models', 'Azure Machine Learning', 'Partner models']
  },
  GCP: {
    layers: [
      { name: 'Experience and access', detail: 'Web, mobile, APIs', services: ['React / Angular', 'Cloud CDN', 'Cloud DNS', 'Cloud Armor'] },
      { name: 'API and traffic management', detail: 'Secure entry', services: ['API Gateway', 'Cloud Load Balancing', 'Apigee', 'Cloud Armor'] },
      { name: 'Application and compute', detail: 'Microservices', services: ['Google Kubernetes Engine', 'Cloud Run', 'Cloud Functions', 'Spring Boot / FastAPI'] },
      { name: 'Data and storage', detail: 'Persistent data', services: ['AlloyDB', 'Firestore', 'Memorystore', 'Cloud Storage'] },
      { name: 'Integration and messaging', detail: 'Event driven', services: ['Pub/Sub', 'Eventarc', 'Dataflow', 'Workflows'] }
    ],
    security: 'Cloud IAM · Cloud KMS · Secret Manager · Security Command Center · Cloud Logging · Trace',
    model: 'Vertex AI',
    modelDetail: 'Managed AI development and model platform',
    purpose: 'Develop and operate generative AI applications with managed models and tools.',
    integrations: ['FastAPI / Spring Boot', 'Vertex AI SDK / LangChain', 'Vertex AI Search / RAG', 'Cloud Storage'],
    considerations: ['Model availability by region', 'Token usage and cost management', 'Workload identity and data protection', 'Evaluation and fallback behavior'],
    alternatives: ['Gemini models', 'Vertex AI Model Garden', 'Partner models']
  }
};

export const securityProviderEvaluation = [
  { capability: 'Identity and workload access', AWS: 'IAM · Cognito', Azure: 'Entra ID · Managed Identities', GCP: 'Cloud IAM · Workload Identity' },
  { capability: 'Secrets and key management', AWS: 'KMS · Secrets Manager', Azure: 'Key Vault · Managed HSM', GCP: 'Cloud KMS · Secret Manager' },
  { capability: 'Network protection', AWS: 'VPC · WAF · Shield', Azure: 'VNet · WAF · DDoS Protection', GCP: 'VPC · Cloud Armor · Cloud Firewall' },
  { capability: 'Threat detection and audit', AWS: 'GuardDuty · CloudTrail · Security Hub', Azure: 'Defender for Cloud · Activity Log', GCP: 'Security Command Center · Cloud Audit Logs' },
  { capability: 'Managed AI safeguards', AWS: 'Bedrock Guardrails', Azure: 'Azure AI Content Safety', GCP: 'Vertex AI safety filters' }
];

export const securityCapabilities = [
  { name: 'Input / output safeguards', control: 'Validate requests and responses; detect injection, unsafe content, and sensitive data.', evidence: 'Adversarial prompt tests · redaction checks · blocked-action traces' },
  { name: 'Identity and action control', control: 'Use unique workload identity, least privilege, tool allowlists, and approval gates.', evidence: 'Access reviews · denied-action tests · approval records' },
  { name: 'Data and tenant isolation', control: 'Enforce source permissions, tenant boundaries, retention, and deletion policies.', evidence: 'Cross-tenant tests · ACL checks · deletion evidence' },
  { name: 'Model and network integrity', control: 'Protect private endpoints and artifacts; validate provenance and contain workloads.', evidence: 'Signature checks · segmentation tests · model evaluation results' },
  { name: 'Validation and response', control: 'Continuously test controls, maintain audit trails, and rehearse incident response.', evidence: 'Control mapping · red-team reports · incident tabletop actions' }
];

export const openSourceSecurityTools = [
  { area: 'Guardrails and policy', examples: 'NeMo Guardrails · Guardrails AI · Open Policy Agent', use: 'Response checks, policy decisions, and tool authorization boundaries.' },
  { area: 'AI security testing', examples: 'Garak · Microsoft PyRIT · promptfoo', use: 'Authorized robustness, prompt-injection, and safety evaluations.' },
  { area: 'Identity and secrets', examples: 'HashiCorp Vault · External Secrets Operator · Keycloak', use: 'Credential brokering, secret delivery, and identity integration.' },
  { area: 'Telemetry and audit', examples: 'OpenTelemetry · Langfuse · OpenSearch', use: 'Trace model and tool activity with access-aware retention and redaction.' },
  { area: 'Supply-chain security', examples: 'Sigstore Cosign · Trivy · Syft', use: 'Artifact signing, vulnerability scanning, and software-bill-of-materials generation.' }
];

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
