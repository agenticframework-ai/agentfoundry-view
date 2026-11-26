import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, ArrowUp, Check, ChevronRight, CircleHelp, ClipboardCheck, CreditCard, Download, Play, Scale, Shield, ShieldCheck, Sparkles, Square, ThumbsDown, ThumbsUp, TrainFront, X } from 'lucide-react';
import { architectureLayers, cloudArchitectureProviders, cloudServices, frameworks, lifecycle, openSourceSecurityTools, phases, ragStages, securityCapabilities, securityControls, securityProviderEvaluation, slides, useCases } from '../data/strategy.js';
import { ragDemoKnowledge, ragPlaybookSections, ragPlaybookStages, ragStageGuidance, ragStagePlaybooks } from '../data/ragPlaybook.js';
import { Card, Metric, Pill, Range, SectionHeading } from './UI.jsx';

const chartTip = { background: '#101c2c', border: '1px solid #26384e', borderRadius: 10, color: '#eaf2ff' };
const publicAssetsBase=import.meta.env.BASE_URL.endsWith('/')?import.meta.env.BASE_URL:`${import.meta.env.BASE_URL}/`;
const discoveryCategories=[
  {id:'hybrid',name:'Orchestrated hybrid decision',description:'rules, AI reasoning and an agent working under human approval'},
  {id:'rules-ai',name:'Rules + AI hybrid decision',description:'rules plus scoring or reasoning, no agent needed'},
  {id:'automation',name:'Deterministic automation',description:'policy logic in code; AI is not needed for the decision'},
  {id:'scoring',name:'Scored decision support',description:'a predictive model scores cases and people decide'},
  {id:'knowledge',name:'Knowledge reasoning assistant',description:'retrieval and reasoning over documents'},
  {id:'investigation',name:'Agentic investigation',description:'multi-step investigation with read-only tools'}
];
const discoveryScenarios=[
  {id:'invoice',title:'Invoice exception handling',category:'hybrid',industry:'Finance / AP',mixSummary:'about 64% rules',baselineHours:1200,hourlyRate:40,mix:[['Price mismatch',31,'rules'],['Quantity / receipt mismatch',27,'rules'],['Missing or invalid PO',14,'reasoning'],['Tax / vendor master data',12,'reasoning'],['Disputes, multi-party cases',10,'agent'],['Duplicate suspicion',6,'rules']]},
  {id:'loan',title:'Loan application approval',category:'hybrid',industry:'Banking / credit',mixSummary:'about 35% rules',baselineHours:900,hourlyRate:48,mix:[['Complete applications',35,'rules'],['Income verification',25,'rules'],['Policy exceptions',20,'reasoning'],['Document review',12,'reasoning'],['Complex cases',8,'agent']]},
  {id:'insurance',title:'Insurance claims triage',category:'hybrid',industry:'Insurance',mixSummary:'about 35% rules',baselineHours:1100,hourlyRate:42,mix:[['Straight-through claims',35,'rules'],['Coverage checks',25,'rules'],['Document review',18,'reasoning'],['Damage assessment',12,'reasoning'],['Complex investigations',10,'agent']]},
  {id:'kyc',title:'KYC adverse media review',category:'hybrid',industry:'Banking / compliance',mixSummary:'about 40% contextual reasoning',baselineHours:720,hourlyRate:52,mix:[['Clear matches',20,'rules'],['Entity resolution',20,'rules'],['Media relevance',25,'reasoning'],['Source comparison',20,'reasoning'],['Escalated investigations',15,'agent']]},
  {id:'payment',title:'Payment dispute resolution',category:'hybrid',industry:'Payments',mixSummary:'about 30% rules',baselineHours:850,hourlyRate:38,mix:[['Duplicate / status checks',30,'rules'],['Reference matching',22,'rules'],['Bank correspondence',18,'reasoning'],['Policy exceptions',15,'reasoning'],['Multi-party disputes',15,'agent']]},
  {id:'iso-repair',title:'ISO 20022 payment repair',category:'hybrid',industry:'Payments',mixSummary:'about 40% rules',baselineHours:680,hourlyRate:41,mix:[['Schema validation',40,'rules'],['Code mapping',24,'rules'],['Remittance context',18,'reasoning'],['Counterparty lookup',10,'reasoning'],['Repair investigation',8,'agent']]},
  {id:'support',title:'Support ticket routing',category:'rules-ai',industry:'Customer service',mixSummary:'about 40% rules',baselineHours:1400,hourlyRate:32,mix:[['Known issue routing',40,'rules'],['Priority classification',25,'reasoning'],['Sentiment / urgency',20,'reasoning'],['Specialist escalation',15,'reasoning']]},
  {id:'expense',title:'Expense policy compliance',category:'automation',industry:'Finance',mixSummary:'about 92% rules',baselineHours:520,hourlyRate:36,mix:[['Policy rule checks',62,'rules'],['Receipt field validation',30,'rules'],['Policy interpretation',8,'reasoning']]},
  {id:'demand',title:'Store demand forecasting',category:'scoring',industry:'Retail / supply chain',mixSummary:'about 92% predictive scoring',baselineHours:640,hourlyRate:39,mix:[['Seasonal baseline',8,'rules'],['Demand prediction',72,'predictive'],['Promotion effects',20,'predictive']]},
  {id:'policy-qa',title:'Policy and contract Q&A',category:'knowledge',industry:'Service operations',mixSummary:'about 85% contextual reasoning',baselineHours:460,hourlyRate:44,mix:[['Policy lookup',15,'reasoning'],['Contract interpretation',55,'reasoning'],['Cross-document questions',30,'reasoning']]},
  {id:'cloud-incident',title:'Cloud incident root cause',category:'investigation',industry:'IT operations',mixSummary:'about 90% multi-step investigation',baselineHours:380,hourlyRate:58,mix:[['Alert correlation',10,'rules'],['Log investigation',45,'agent'],['Change history review',25,'reasoning'],['Dependency tracing',20,'agent']]}
];
const scenarioDiscoveryInputs={
  invoice:{owner:'Accounts payable process owner',target:'Reduce invoice exception resolution time'},
  loan:{owner:'Credit operations owner',target:'Improve application turnaround within credit policy'},
  insurance:{owner:'Claims operations owner',target:'Reduce claim triage time with reviewer oversight'},
  kyc:{owner:'Financial crime compliance owner',target:'Improve adverse media review quality and speed'},
  payment:{owner:'Payment operations owner',target:'Resolve payment disputes faster with clear escalation'},
  'iso-repair':{owner:'Payments product owner',target:'Reduce repair effort while preserving validation controls'},
  support:{owner:'Customer service operations owner',target:'Route support requests accurately and quickly'},
  expense:{owner:'Finance policy owner',target:'Reduce manual expense review while applying policy consistently'},
  demand:{owner:'Retail planning owner',target:'Improve forecast accuracy for replenishment decisions'},
  'policy-qa':{owner:'Knowledge management owner',target:'Answer policy questions from approved source documents'},
  'cloud-incident':{owner:'Cloud operations owner',target:'Reduce incident investigation time without autonomous changes'}
};
const capabilityMixTypes={rules:'rules',context:'reasoning',predictive:'predictive',agent:'agent'};
const getScenarioCapabilities=scenario=>Object.fromEntries(
  Object.entries(capabilityMixTypes).map(([capability,type])=>[
    capability,scenario.mix.reduce((total,row)=>total+(row[2]===type?row[1]:0),0)>=10
  ])
);
const evidenceGroups=[
  {name:'Business value',items:['Quantified baseline','Specific target outcome','Effort and cost known','Customer impact described']},
  {name:'Workflow fit',items:['Repeatable steps','Clear decision criteria','Bounded scope','Stable process owner']},
  {name:'Data readiness',items:['Digital and accessible','Quality measured','Consistent across sources','History for evaluation']},
  {name:'Risk tolerance',items:['Read-only or draft access','Human approval on consequential actions','Audit and retention defined','Error threshold defined']}
];
const scenarioEvidenceCounts={invoice:[3,3,3,3],loan:[4,3,2,2],insurance:[3,3,3,3],kyc:[3,3,2,4],payment:[3,4,3,3],'iso-repair':[3,4,4,3],support:[3,3,4,3],expense:[4,4,4,3],demand:[4,3,3,2],'policy-qa':[3,3,4,3],'cloud-incident':[3,3,3,4]};
const createEvidenceChecks=scenarioId=>Object.fromEntries(
  evidenceGroups.flatMap((group,groupIndex)=>group.items.map((item,itemIndex)=>[
    item,itemIndex<(scenarioEvidenceCounts[scenarioId]||scenarioEvidenceCounts.invoice)[groupIndex]
  ]))
);
const discoveryTabs=['Scenario','Discovery','Decision mix','Capabilities','Evidence','Final Opportunity','Architecture','Value'];
const architectureUseCaseExamples=[
  {id:'compliance',title:'Compliance Analyst Workspace',summary:'Policy-driven case analysis with audit-ready decisions.',fileName:'compliance-analyst.png',icon:Scale,alt:'Compliance architecture: a supervisor coordinates rules, media, network and memo agents over read-only case data, with officer approval, audit trail and evaluation.'},
  {id:'ap-supplier',title:'AP Team and Supplier Portal',summary:'Automate invoice handling and supplier queries.',fileName:'ap-team-supplier-portal.png',icon:ClipboardCheck,alt:'Accounts payable architecture: a supervisor coordinates match, context, dispute and case agents over read-only ERP and supplier data, with payment approval and audit controls.'},
  {id:'payment-operations',title:'Payment Operations',summary:'Triage failed cross-border payments with controlled repair.',fileName:'payment-operations.png',icon:CreditCard,alt:'Payment operations architecture: validation, remittance, counterparty and repair agents use read-only payment data, with four-eyes approval and audit controls.'},
  {id:'insurance-claims',title:'Insurance Claims',summary:'Coordinate claims evidence, coverage checks and human review.',fileName:'insurance-claims.png',icon:ShieldCheck,alt:'Insurance claims architecture: a supervisor coordinates matching, rules, documents, coverage, dispute and triage agents, with human approval and audit controls.'}
];
const decisionProsCons=[
  ['Automation','Handles complex multi-step processes','More difficult to control'],
  ['Productivity','Reduces manual investigation','Requires monitoring'],
  ['Decision support','Combines information from multiple sources','Can produce incorrect conclusions'],
  ['Adaptability','Adjusts workflows based on findings','Execution may be less predictable'],
  ['Integration','Can interact with multiple enterprise systems','Tool security and integration complexity'],
  ['Scalability','Can scale workflows with demand','Model throughput and token costs'],
  ['Customer experience','Faster contextual responses','Requires quality and safety controls'],
  ['Maintenance','Reusable agent capabilities','Model and prompt changes require regression testing']
];
const decisionDimensions=[
  ['Logic','Predefined rules','Contextual reasoning'],
  ['Input','Structured','Often unstructured'],
  ['Output','Predictable','May vary'],
  ['Decision','Rule-based','Reasoning-based'],
  ['Execution','Fixed workflow','Dynamic workflow'],
  ['Repeatability','High','Requires evaluation'],
  ['Example','Tax calculation','Understanding a complex financial report'],
  ['Best technology','Java, SQL, BPMN, rules engine','LLM, RAG, AI agent']
];
const decisionNotRecommended=[
  'A fixed calculation can solve the problem.',
  'The process has stable input and output.',
  'A conventional API or workflow is sufficient.',
  'The agent adds more cost than business value.',
  'The process requires exact repeatability without a need for contextual reasoning.',
  'The consequences of an autonomous error are unacceptable and cannot be adequately controlled.'
];
const decisionRecommended=[
  'The process requires investigating multiple information sources.',
  'The next step depends on previous findings.',
  'The workflow needs contextual reasoning.',
  'The agent needs to select and invoke different tools.',
  'The process contains exceptions that cannot be efficiently represented using fixed rules.',
  'The business value justifies the additional operational complexity.'
];

function Vision({onNavigate}) {
  const [active, setActive] = useState(2);
  const stages = slides.slice(1);
  const levels = [
    { title: 'Manual operations', body: 'People move information between systems and make every routine decision.', icon: '01' },
    { title: 'AI-assisted workflows', body: 'AI summarizes, drafts and recommends; people remain in the execution loop.', icon: '02' },
    { title: 'Agentic workflows', body: 'Bounded agents plan and act across tools, with policy checks and human escalation.', icon: '03' }
  ];
  return <div className="content-grid vision-grid">
    <div className="visual-orbit"><div className="orbit orbit-one"><i className="orbit-spark spark-a"/></div><div className="orbit orbit-two"><i className="orbit-spark spark-b"/></div><div className="orbit orbit-three"><i className="orbit-spark spark-c"/></div><div className="orbit-core"><Sparkles size={30}/><span>INTELLIGENCE<br/>IN MOTION</span></div><i className="orb-dot d1"/><i className="orb-dot d2"/><i className="orb-dot d3"/>
      <div className="orbit-caption">Business intent <ArrowRight size={14}/> governed action</div>
    </div>
    <div className="vision-copy"><Pill>THE TRANSFORMATION</Pill><h3>From tasks that happen<br/>to outcomes that flow.</h3><div className="step-tabs">{levels.map((x,i)=><button key={x.title} onClick={()=>setActive(i)} className={active===i?'selected':''}><span>{x.icon}</span>{x.title}</button>)}</div><AnimatePresence mode="wait"><motion.p className="active-description" key={active} initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-8}}>{levels[active].body}</motion.p></AnimatePresence><div className="outcome-row">{[['↑','Productivity'],['✦','Experience'],['◎','Risk & control'],['↗','Growth']].map(x=><div key={x[1]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div></div>
    <section className="stage-journey" aria-label="17-stage strategy journey">
      <div className="stage-journey-heading"><span>17-STAGE STRATEGY JOURNEY</span><small>Select a stop to explore</small></div>
      <div className="stage-journey-scroll"><div className="stage-journey-track">
        {stages.map((stage,index)=>{const label=index===9?'RELEASE':index===14?'ROADMAP':stage.eyebrow.split('/').pop().trim();return <button type="button" className="journey-stage" key={stage.eyebrow} style={{'--stage-delay':`${index*2}s`}} onClick={()=>onNavigate(index+1)} aria-label={`Open stage ${String(index+1).padStart(2,'0')}: ${label} — ${stage.title}`} title={stage.title}>
          <span className="journey-stage-node">{String(index+1).padStart(2,'0')}</span>
          <span className="journey-stage-name">{label}</span>
        </button>;})}
        <span className="journey-train" aria-hidden="true"><TrainFront size={17}/></span>
      </div></div>
    </section>
  </div>;
}

function Discovery({demoRunToken=0,demoStopToken=0,onDemoComplete}) {
  const [scenarioId,setScenarioId]=useState('invoice');
  const [activeTab,setActiveTab]=useState(0);
  const [showCategories,setShowCategories]=useState(false);
  const [hours,setHours]=useState(1200);
  const [hourlyRate,setHourlyRate]=useState(40);
  const [effortReduction,setEffortReduction]=useState(40);
  const [decisionOwner,setDecisionOwner]=useState(scenarioDiscoveryInputs.invoice.owner);
  const [targetOutcome,setTargetOutcome]=useState(scenarioDiscoveryInputs.invoice.target);
  const [capabilities,setCapabilities]=useState(()=>getScenarioCapabilities(discoveryScenarios[0]));
  const [evidenceChecks,setEvidenceChecks]=useState(()=>createEvidenceChecks('invoice'));
  useEffect(()=>{
    if(demoRunToken<=demoStopToken)return undefined;
    let position=0;
    const timer=window.setInterval(()=>{
      if(position>=discoveryTabs.length*2){
        window.clearInterval(timer);
        onDemoComplete?.();
        return;
      }
      if(position===0||position===discoveryTabs.length){
        const demoScenario=position===0?discoveryScenarios[0]:discoveryScenarios[10];
        setScenarioId(demoScenario.id);
        setHours(demoScenario.baselineHours);
        setHourlyRate(demoScenario.hourlyRate);
        setDecisionOwner(scenarioDiscoveryInputs[demoScenario.id].owner);
        setTargetOutcome(scenarioDiscoveryInputs[demoScenario.id].target);
        setCapabilities(getScenarioCapabilities(demoScenario));
        setEvidenceChecks(createEvidenceChecks(demoScenario.id));
      }
      setActiveTab(position%discoveryTabs.length);
      position+=1;
    },850);
    return ()=>window.clearInterval(timer);
  },[demoRunToken,demoStopToken,onDemoComplete]);
  const scenario=discoveryScenarios.find(item=>item.id===scenarioId)||discoveryScenarios[0];
  const selectScenario=nextScenario=>{
    setScenarioId(nextScenario.id);
    setHours(nextScenario.baselineHours);
    setHourlyRate(nextScenario.hourlyRate);
    setDecisionOwner(scenarioDiscoveryInputs[nextScenario.id].owner);
    setTargetOutcome(scenarioDiscoveryInputs[nextScenario.id].target);
    setCapabilities(getScenarioCapabilities(nextScenario));
    setEvidenceChecks(createEvidenceChecks(nextScenario.id));
  };
  const checkedFor=group=>group.items.filter(item=>evidenceChecks[item]).length;
  const evidenceScores=evidenceGroups.map(group=>1+checkedFor(group));
  const overallSignal=evidenceScores.reduce((total,score)=>total+score,0)/evidenceScores.length;
  const evidenceTotal=evidenceGroups.reduce((total,group)=>total+checkedFor(group),0);
  const businessScore=evidenceScores[0];
  const dataScore=evidenceScores[2];
  const riskScore=evidenceScores[3];
  const rules=[
    {id:'R1',fired:overallSignal>=3.5,text:'Signal average at or above 3.5 qualifies as a good first candidate'},
    {id:'R2',fired:riskScore<=2,text:'Risk tolerance 2 or below caps the outcome at human decision required'},
    {id:'R3',fired:capabilities.predictive&&dataScore<=2,text:'Predictive scoring with data readiness 2 or below: defer the model until data is labelled'},
    {id:'R4',fired:capabilities.agent&&riskScore<=3,text:'Agent with risk tolerance 3 or below: read-only tools and draft output only'},
    {id:'R5',fired:businessScore<=2,text:'Business value 2 or below: capture a quantified baseline before any build'}
  ];
  const candidateReady=overallSignal>=3.5&&riskScore>2;
  const monthlySavings=Math.round(hours*effortReduction/100*hourlyRate);
  const mixColors={rules:'#426b50',reasoning:'#9b72cf',agent:'#dc963a',predictive:'#4b9eb1'};
  let chartPosition=0;
  const chartStops=scenario.mix.map(([,share,type])=>{
    const start=chartPosition;
    chartPosition+=share;
    return `${mixColors[type]} ${start}% ${chartPosition}%`;
  }).join(', ');
  const capabilityRows=[
    {id:'rules',name:'Deterministic rules and policy',result:'Policy and rules engine (code, not an LLM)'},
    {id:'context',name:'Contextual document / knowledge reasoning',result:'Document extraction and retrieval over policies, contracts and emails'},
    {id:'agent',name:'Multi-step investigation / orchestration',result:'Agent with read-only tools that drafts the case for review'},
    {id:'approval',name:'Consequential action',result:'Human approval gate and audit log',enabled:evidenceChecks['Human approval on consequential actions']}
  ];
  const toggleEvidence=item=>setEvidenceChecks(current=>({...current,[item]:!current[item]}));
  const toggleCapability=id=>setCapabilities(current=>({...current,[id]:!current[id]}));
  const formatCurrency=value=>`$${Math.round(value).toLocaleString('en-US')}`;
  const renderStep=()=>{
    if(activeTab===0)return <div className="discovery-scenario-grid">{discoveryScenarios.map(item=>{
      const category=discoveryCategories.find(entry=>entry.id===item.category);
      return <button type="button" key={item.id} className={`discovery-scenario ${scenarioId===item.id?'selected':''}`} aria-pressed={scenarioId===item.id} onClick={()=>selectScenario(item)}>
        <small>{category.name}</small><strong>{item.title}</strong><span>{item.industry}</span>
      </button>;
    })}</div>;
    if(activeTab===1)return <div className="discovery-input-grid">
      <label>Manual effort baseline (hours / month)<input type="number" min="0" value={hours} onChange={event=>setHours(Math.max(0,Number(event.target.value)||0))}/><small>Use a measured baseline or a clearly labelled estimate.</small></label>
      <label>Fully loaded hourly cost<input type="number" min="0" value={hourlyRate} onChange={event=>setHourlyRate(Math.max(0,Number(event.target.value)||0))}/><small>Include operational costs relevant to this workflow.</small></label>
      <label>Decision owner<input type="text" value={decisionOwner} onChange={event=>setDecisionOwner(event.target.value)}/><small>Name the person accountable for policy and outcomes.</small></label>
      <label>Target outcome<input type="text" value={targetOutcome} onChange={event=>setTargetOutcome(event.target.value)}/><small>Describe the customer- or business-facing improvement.</small></label>
      <div className="discovery-input-note"><b>Selected scenario</b><span>{scenario.title} · {scenario.industry}</span><small>Illustrative inputs only. Validate them with the customer before estimating benefits.</small></div>
    </div>;
    if(activeTab===2)return <div className="discovery-mix-layout">
      <div className="discovery-pie" role="img" aria-label={`Case mix distribution for ${scenario.title}`} style={{background:`conic-gradient(${chartStops})`}}/>
      <div className="discovery-mix-list">{scenario.mix.map(([label,share,type])=><div className="discovery-mix-row" key={label}>
        <i style={{'--mix-color':mixColors[type]}}/><span>{label}</span><b>{share}%</b><small>{type==='reasoning'?'Reasoning':type==='agent'?'Agent':type==='predictive'?'Predictive':'Rules'}</small>
      </div>)}</div>
    </div>;
    if(activeTab===3)return <div className="discovery-capability-list">{[
      {id:'rules',label:'Deterministic rules',description:'Apply fixed policy, thresholds, or validations in code.'},
      {id:'context',label:'Contextual reasoning',description:'Interpret documents, unstructured evidence, or exceptions.'},
      {id:'predictive',label:'Predictive scoring',description:'Estimate an outcome from historical labelled data.'},
      {id:'agent',label:'Multi-step investigation',description:'Coordinate steps and tools when the next action depends on findings.'}
    ].map(item=><button type="button" key={item.id} className={`discovery-capability ${capabilities[item.id]?'enabled':''}`} aria-pressed={Boolean(capabilities[item.id])} onClick={()=>toggleCapability(item.id)}>
      <span className="discovery-capability-check">{capabilities[item.id]?'Yes':'No'}</span><span><b>{item.label}</b><small>{item.description}</small></span><i>{capabilities[item.id]?'In scope':'Out of scope'}</i>
    </button>)}</div>;
    if(activeTab===4)return <div className="discovery-evidence-grid">{evidenceGroups.map(group=><section className="discovery-evidence-group" key={group.name}>
      <header><b>{group.name}</b><span>{1+checkedFor(group)} / 5</span></header>
      {group.items.map(item=><label className={`discovery-evidence-item ${evidenceChecks[item]?'checked':''}`} key={item}>
        <input type="checkbox" checked={Boolean(evidenceChecks[item])} onChange={()=>toggleEvidence(item)}/><span>{item}</span>
      </label>)}
    </section>)}</div>;
    if(activeTab===5)return <div className="discovery-opportunity-result">
      <div className={`discovery-candidate ${candidateReady?'ready':'capped'}`}>
        <div className="discovery-candidate-meta"><b>{candidateReady?'GOOD FIRST CANDIDATE':riskScore<=2?'HUMAN DECISION REQUIRED':'NOT READY YET'}</b><span>SIGNAL {overallSignal.toFixed(1)} / 5</span></div>
        <h4>{candidateReady?'Start with AI-assisted triage, deterministic validation, and human approval for consequential actions.':riskScore<=2?'Use AI to prepare evidence for a qualified human decision-maker.':'Strengthen the evidence and controls before committing to a build.'}</h4>
        <p>{candidateReady?'Confirm the baseline and measure quality, cycle time, and exception rates in a controlled pilot.':'Address the risk and evidence gaps before expanding automation.'}</p>
        <span>{discoveryCategories.find(item=>item.id===scenario.category)?.name}</span>
      </div>
      <h4 className="discovery-rules-heading">Rules evaluated</h4>
      <div className="discovery-rule-list">{rules.map(rule=><div className={rule.fired?'fired':''} key={rule.id}><b>{rule.fired?'✓':'–'}</b><strong>{rule.id}</strong><span>{rule.text}</span></div>)}</div>
      <p className="discovery-rule-note">{evidenceTotal} of 16 evidence checks passed. This transparent rule-based signal is guidance, not an automated decision.</p>
    </div>;
    if(activeTab===6)return <div className="discovery-architecture-list">{capabilityRows.filter(row=>row.id==='approval'?row.enabled:capabilities[row.id]).map(row=><div className="discovery-architecture-row" key={row.id}><b>{row.name}</b><span>→</span><p>{row.result}</p></div>)}</div>;
    return <div className="discovery-value">
      <label className="discovery-range"><span>Effort reduction <b>{effortReduction}%</b></span><input type="range" min="0" max="80" step="5" value={effortReduction} onChange={event=>setEffortReduction(Number(event.target.value))}/></label>
      <div className="discovery-value-cards">
        <div><span>Hours saved / month</span><b>{Math.round(hours*effortReduction/100).toLocaleString('en-US')}</b></div>
        <div><span>Saving / month</span><b>{formatCurrency(monthlySavings)}</b></div>
        <div><span>Saving / year</span><b>{formatCurrency(monthlySavings*12)}</b></div>
        <div><span>Scenario</span><b>Base</b></div>
      </div>
      <p>Illustrative estimate only; validate baseline, rate, and reduction with the process owner.</p>
    </div>;
  };
  return <div className="discovery-wizard">
    <div className="discovery-wizard-heading"><a href="#discovery-categories" onClick={event=>{event.preventDefault();setShowCategories(true);}}>Decision categories ↗</a></div>
    <nav className="discovery-tabs" aria-label="Discovery steps">
      {discoveryTabs.map((tab,index)=><button type="button" key={tab} className={activeTab===index?'active':''} aria-current={activeTab===index?'step':undefined} onClick={()=>setActiveTab(index)}>{index+1} {tab}</button>)}
    </nav>
    <Card className="discovery-step-card">
      <div className="discovery-step-heading"><span>{activeTab+1}</span><div><h3>{[
        'Customer scenario','Discovery inputs','Decision mix','Capability fit','Evidence checklist','Final Opportunity: Decision Fit Index','Capability to architecture','Value range'
      ][activeTab]}</h3><p>{[
        'Scenarios are grouped by the decision pattern their case mix produces. Each dataset is illustrative and loads its own inputs, case mix and evidence.',
        'Capture the current workload and decision ownership before estimating an opportunity.',
        'Share of case volume by the capability each case needs. A capability turns Yes when it covers 10% or more.',
        'Select the decision capabilities this workflow needs. Keep the solution no more complex than the work requires.',
        'Four checks per signal. Score = 1 + checks passed (range 1 to 5). Tick only what the customer can show.',
        `${scenario.title}: ${evidenceTotal} of 16 evidence checks passed, signal ${overallSignal.toFixed(1)} / 5. Rules fired: ${rules.filter(rule=>rule.fired).map(rule=>rule.id).join(', ')||'none'}. Scored by rules only; no model makes this call.`,
        'Components follow the capabilities marked Yes.',
        `Baseline ${hours.toLocaleString('en-US')} hrs/month at ${formatCurrency(hourlyRate)}/hr. Show a range, then agree the assumption.`
      ][activeTab]}</p></div></div>
      {renderStep()}
    </Card>
    <div className="discovery-wizard-footer">
      <button type="button" onClick={()=>setActiveTab(index=>Math.max(0,index-1))} disabled={activeTab===0}><ChevronRight size={15}/> Back</button>
      <span>{activeTab+1} / 8</span>
      <button type="button" onClick={()=>setActiveTab(index=>Math.min(discoveryTabs.length-1,index+1))} disabled={activeTab===discoveryTabs.length-1}>Next <ArrowRight size={15}/></button>
    </div>
    {showCategories&&createPortal(<div className="discovery-modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setShowCategories(false);}}>
      <section className="discovery-category-dialog" role="dialog" aria-modal="true" aria-labelledby="discovery-category-title" onKeyDown={event=>{if(event.key==='Escape')setShowCategories(false);}}>
        <header><div><h2 id="discovery-category-title">Decision categories</h2><p>Each scenario falls into one category, set by the capability pattern in its case mix. Select a scenario to load it.</p></div><button type="button" aria-label="Close decision categories" onClick={()=>setShowCategories(false)}><X size={19}/></button></header>
        <div className="discovery-category-table">
          {discoveryCategories.map(category=><section key={category.id}>
            <div className="discovery-category-name"><b>{category.name}</b><span>{category.description}</span></div>
            <div className="discovery-category-scenarios">{discoveryScenarios.filter(item=>item.category===category.id).map(item=><button type="button" key={item.id} onClick={()=>{selectScenario(item);setShowCategories(false);setActiveTab(0);}}><u>{item.title}</u><small>{item.mixSummary}</small></button>)}</div>
          </section>)}
        </div>
      </section>
    </div>,document.body)}
  </div>;
}

function Decision() {
  const [ratings,setRatings]=useState([4,3,3,4,3,3]);
  const [predictability,setPredictability]=useState('');
  const [ruleClarity,setRuleClarity]=useState('');
  const [workPattern,setWorkPattern]=useState('');
  const [dataReadiness,setDataReadiness]=useState('');
  const [impactLevel,setImpactLevel]=useState('');
  const [assessment,setAssessment]=useState(null);
  const [error,setError]=useState('');
  const factors=[['Business value',25],['Uncertainty',20],['Decision complexity',15],['Tool interaction',15],['Adaptability',15],['Operational feasibility',10]];
  const factorColors=['#426b50','#5e8567','#789981','#92ad98','#acc2b0','#c7d5ca'];
  const score=Math.round(ratings.reduce((sum,rating,index)=>sum+(rating/5)*factors[index][1],0));
  const updateRatings=next=>{setRatings(next);setError('');};
  const selectChoice=(setter,value)=>{setter(value);setError('');};
  const predictabilityOptions=[
    ['fixed','Fixed','Same steps every time'],
    ['mostly','Mostly predictable','Known path, rare exceptions'],
    ['mixed','Mixed','Rules plus frequent exceptions'],
    ['variable','Highly variable','Steps change with context']
  ];
  const workOptions=[
    ['rules','Execute repeatable steps','Apply explicit rules and update systems.'],
    ['ml','Predict or classify','Use labeled, structured historical data.'],
    ['rag','Find and explain knowledge','Answer from trusted documents or records.'],
    ['single','Act across tools','One bounded workflow selects tools dynamically.'],
    ['multi','Coordinate specialists','Several distinct capabilities must collaborate.']
  ];
  const optionButton=(value,label,description,current,setter,className='')=><button type="button" key={value} aria-pressed={current===value} className={`decision-choice ${current===value?'selected':''} ${className}`} onClick={()=>selectChoice(setter,value)}><b>{label}</b>{description&&<small>{description}</small>}</button>;
  const displayedRatings=assessment?.ratings||ratings;
  const displayedScore=assessment?.score??score;
  const decisionBands=[
    {max:34,range:'0-34',recommendation:'Traditional deterministic automation'},
    {max:54,range:'35-54',recommendation:'AI-assisted automation'},
    {max:74,range:'55-74',recommendation:'Evaluate single-agent architecture'},
    {max:100,range:'75-100',recommendation:'Evaluate multi-agent architecture'}
  ];
  const recommendation=decisionBands.find(band=>displayedScore<=band.max);
  const chartData=[
    ...factors.map(([name,weight],index)=>({name,value:(displayedRatings[index]/5)*weight,rating:displayedRatings[index],weight,fill:factorColors[index]})),
    {name:'Points available to 100',value:100-displayedScore,fill:'var(--decision-chart-remainder)'}
  ];
  const submittedValues=assessment?[
    predictabilityOptions.find(([value])=>value===assessment.inputs.predictability)?.[1],
    [['explicit','Explicit'],['partial','Partial'],['unclear','Unclear']].find(([value])=>value===assessment.inputs.ruleClarity)?.[1],
    workOptions.find(([value])=>value===assessment.inputs.workPattern)?.[1],
    [['ready','Ready'],['mixed','Mixed'],['unknown','Unknown']].find(([value])=>value===assessment.inputs.dataReadiness)?.[1],
    [['low','Low impact'],['moderate','Moderate impact'],['high','High impact']].find(([value])=>value===assessment.inputs.impactLevel)?.[1]
  ].filter(Boolean):[];
  const assessmentIsCurrent=Boolean(assessment
    && assessment.ratings.every((rating,index)=>rating===ratings[index])
    && assessment.inputs.predictability===predictability
    && assessment.inputs.ruleClarity===ruleClarity
    && assessment.inputs.workPattern===workPattern
    && assessment.inputs.dataReadiness===dataReadiness
    && assessment.inputs.impactLevel===impactLevel);
  const evaluateFit=e=>{
    e.preventDefault();
    if(!predictability||!ruleClarity||!workPattern||!dataReadiness||!impactLevel){
      setError('Choose an option for predictability, business rules, work pattern, data readiness, and decision impact.');
      return;
    }
    const band=decisionBands.find(item=>score<=item.max);
    const reasons=[`A score of ${score}/100 falls in the ${band.range} band.`];
    if(['fixed','mostly'].includes(predictability)&&ruleClarity==='explicit'){
      reasons.push('Keep predictable steps with explicit rules deterministic; use AI only where it adds value, such as handling exceptions.');
    }
    if(impactLevel==='high'){
      reasons.push('High-impact decisions require an accountable human; AI may prepare evidence but must not make the final decision.');
    }else if(impactLevel==='moderate'){
      reasons.push('Use policy checks and human approval before consequential actions.');
    }
    if(dataReadiness==='unknown'){
      reasons.push('Treat this recommendation as provisional until data access, quality, and freshness are confirmed.');
    }else if(dataReadiness==='mixed'){
      reasons.push('Pilot only with approved, representative sources and track data-quality failures.');
    }
    setAssessment({
      score,
      recommendation:band.recommendation,
      reason:reasons.join(' '),
      ratings:[...ratings],
      inputs:{predictability,ruleClarity,workPattern,dataReadiness,impactLevel}
    });
    setError('');
  };
  return <div className="decision-page" id="decision-top">
    <div className="content-grid decision-grid">
    <Card className="decision-tree"><Pill>START WITH THE WORK</Pill><h3>Describe the workflow</h3>
      <div className="decision-question"><span>01</span><b>How predictable are the steps?</b><div className="decision-choice-grid predictability-options">{predictabilityOptions.map(([value,label,description])=>optionButton(value,label,description,predictability,setPredictability))}</div></div>
      <div className="decision-question"><span>02</span><b>How clear are the business rules?</b><div className="decision-choice-grid compact-options">{[['explicit','Explicit','Documented'],['partial','Partial','Some judgement'],['unclear','Unclear','Varies by person']].map(([value,label,description])=>optionButton(value,label,description,ruleClarity,setRuleClarity))}</div></div>
      <div className="decision-question"><span>03</span><b>What does the work mainly need?</b><div className="decision-choice-grid work-options">{workOptions.map(([value,label,description])=>optionButton(value,label,description,workPattern,setWorkPattern))}</div></div>
      <div className="decision-question"><span>04</span><b>Is the required data ready?</b><div className="decision-choice-grid compact-options">{[['ready','Ready','Accessible and trusted'],['mixed','Mixed','Gaps need review'],['unknown','Unknown','Not assessed']].map(([value,label,description])=>optionButton(value,label,description,dataReadiness,setDataReadiness))}</div></div>
      <div className="decision-question"><span>05</span><b>What is the impact of a wrong action?</b><div className="decision-choice-grid compact-options">{[['low','Low','Reversible'],['moderate','Moderate','Approval needed'],['high','High','Regulated / consequential']].map(([value,label,description])=>optionButton(value,label,description,impactLevel,setImpactLevel))}</div></div>
      <p className="small muted">For high-impact outcomes, AI may assist but an accountable human must retain the final decision.</p>
    </Card>
    <Card className="score-card"><div className="card-title-row"><div><Pill>ILLUSTRATIVE HEURISTIC</Pill><h3>Weighted decision score</h3></div><CircleHelp size={17}/></div>
      <form onSubmit={evaluateFit}><p className="range-guidance">Score each dimension from 1 (low) to 5 (high). Weights show each factor's share of the total.</p>{factors.map(([name,weight],i)=><Range key={name} label={`${name} · ${weight}%`} value={ratings[i]} min={1} max={5} step={1} onChange={v=>updateRatings(ratings.map((x,j)=>i===j?v:x))}/>)}
        <div className="decision-actions"><button className="analyze-button" type="submit"><Check size={14}/>{assessment?'Update decision':'Check decision'}</button><span>{assessment?'Your selections stay in place; update to refresh the recommendation.':'Choose all five workflow options, then submit once.'}</span></div>
      </form>
      {error&&<p className="decision-error" role="alert">{error}</p>}
      <div className="score-result decision-score-result" aria-live="polite">
        <div className="decision-score-visual">
          <div className="decision-chart-wrap" role="img" aria-label={`Weighted score ${displayedScore} out of 100; dimensions: ${chartData.slice(0,6).map(item=>`${item.name} ${item.rating} out of 5`).join(', ')}`}>
            <ResponsiveContainer width="100%" height={140}><PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={43} outerRadius={59} paddingAngle={1} stroke="none">{chartData.map(item=><Cell key={item.name} fill={item.fill}/>)}</Pie><Tooltip formatter={value=>[`${Number(value).toFixed(0)} weighted points`]} contentStyle={{background:'var(--panel)',border:'1px solid var(--line)',borderRadius:8,color:'var(--text)',fontSize:10}}/></PieChart></ResponsiveContainer>
            <div className="decision-chart-center"><strong>{displayedScore}</strong><span>/ 100</span></div>
          </div>
          <div className="decision-recommendation"><span className="micro-label">{assessment?(assessmentIsCurrent?'RECOMMENDED APPROACH':'LAST SUBMITTED RECOMMENDATION'):'RECOMMENDATION PENDING'}</span><h4>{assessment?assessment.recommendation:'Submit to get a recommendation'}</h4><small>{assessment?`Score band ${recommendation.range}: ${assessmentIsCurrent?'current selection':'update to refresh'}.`:'The weighted score previews here; submit your selections to set an approach.'}</small></div>
        </div>
        <div className="decision-factor-grid">{factors.map(([name,weight],index)=><div className="decision-factor-item" key={name} style={{'--factor-color':factorColors[index]}}><i/><span>{name}</span><b>{displayedRatings[index]}/5 · {Math.round((displayedRatings[index]/5)*weight)} pts</b></div>)}</div>
        {assessment&&<><p className="decision-selection-summary"><b>Submitted choices:</b> {submittedValues.join(' · ')}</p>{!assessmentIsCurrent&&<p className="decision-stale-note">Inputs changed. The chart and recommendation show the last submitted values until you update.</p>}</>}
      </div>
      {assessment&&<p className="decision-rationale" role="status">{assessment.reason}</p>}
      <p className="decision-band-reference">Score bands: 0-34 · Traditional deterministic automation; 35-54 · AI-assisted automation; 55-74 · Evaluate single-agent architecture; 75-100 · Evaluate multi-agent architecture.</p>
      <p className="tiny muted">Score = sum((rating / 5) x weight). The weights total 100; with ratings limited to 1-5, the minimum possible score is 20. These are initial heuristics, not a universal industry standard.</p>
    </Card>
    </div>
    <div className="decision-guidance">
      <Card className="decision-guidance-card decision-dimensions-card" id="decision-dimensions">
        <div className="card-title-row"><div><Pill>DIMENSIONS</Pill><h3>Deterministic vs non-deterministic: how do I decide?</h3></div><Scale size={18}/></div>
        <p>This distinction is critical. Use deterministic processes when rules and outcomes are predefined; consider AI when work requires contextual reasoning over variable inputs.</p>
        <div className="decision-pros-cons-wrap"><table className="decision-pros-cons-table decision-dimensions-table"><thead><tr><th>Dimension</th><th>Deterministic</th><th>Non-deterministic</th></tr></thead><tbody>{decisionDimensions.map(([dimension,deterministic,nonDeterministic])=><tr key={dimension}><th scope="row">{dimension}</th><td>{deterministic}</td><td>{nonDeterministic}</td></tr>)}</tbody></table></div>
        <a className="decision-back-top" href="#decision-top"><ArrowUp size={14}/>Back to top</a>
      </Card>
      <Card className="decision-guidance-card decision-justification" id="decision-pros-cons">
        <div className="card-title-row"><div><Pill>BUSINESS JUSTIFICATION</Pill><h3>Pros and cons of Agentic AI</h3></div><Scale size={18}/></div>
        <p>Before approving an agent, compare its benefits against the additional complexity and cost it introduces.</p>
        <div className="decision-pros-cons-wrap"><table className="decision-pros-cons-table"><thead><tr><th>Area</th><th>Pros</th><th>Cons / Risks</th></tr></thead><tbody>{decisionProsCons.map(([area,pros,cons])=><tr key={area}><th scope="row">{area}</th><td>{pros}</td><td>{cons}</td></tr>)}</tbody></table></div>
        <a className="decision-back-top" href="#decision-top"><ArrowUp size={14}/>Back to top</a>
      </Card>
      <div className="decision-guidance-pair">
        <Card className="decision-guidance-card decision-recommend-card" id="decision-recommend">
          <div className="card-title-row"><div><Pill>GOOD FIT</Pill><h3>When I would recommend an agent</h3></div><ThumbsUp size={18}/></div>
          <ul className="decision-guidance-list">{decisionRecommended.map(item=><li key={item}>{item}</li>)}</ul>
          <a className="decision-back-top" href="#decision-top"><ArrowUp size={14}/>Back to top</a>
        </Card>
        <Card className="decision-guidance-card decision-not-recommend-card" id="decision-not-recommend">
          <div className="card-title-row"><div><Pill tone="violet">POOR FIT</Pill><h3>When I would NOT recommend an agent</h3></div><ThumbsDown size={18}/></div>
          <ul className="decision-guidance-list">{decisionNotRecommended.map(item=><li key={item}>{item}</li>)}</ul>
          <a className="decision-back-top" href="#decision-top"><ArrowUp size={14}/>Back to top</a>
        </Card>
      </div>
    </div>
  </div>;
}

function Architecture() {
  const [selected,setSelected]=useState(0);
  const [reviewed,setReviewed]=useState([]);
  const [selectedExample,setSelectedExample]=useState(null);
  const [previewError,setPreviewError]=useState(false);
  const previousFocusRef=useRef(null);
  const item=architectureLayers[selected];
  const cubeGroups=[[0],[1,2],[3,4],[5,6,7],[8,9]];
  const activeCubeIndex=cubeGroups.findIndex(group=>group.includes(selected));
  const isReviewed=reviewed.includes(selected);
  const toggleReviewed=()=>setReviewed(current=>isReviewed?current.filter(index=>index!==selected):[...current,selected]);
  const openExample=example=>{
    previousFocusRef.current=document.activeElement;
    setPreviewError(false);
    setSelectedExample(example);
  };
  const closeExample=()=>setSelectedExample(null);
  useEffect(()=>{
    if(selectedExample)return undefined;
    previousFocusRef.current?.focus();
    return undefined;
  },[selectedExample]);
  return <div className="architecture-stage">
    <div className="content-grid architecture-grid">
      <div className="architecture-explorer">
        <div className="architecture-guide"><Pill>INTERACTIVE WALKTHROUGH</Pill><span>{reviewed.length}/{architectureLayers.length} layers reviewed</span><p>Select a layer in the list or diagram to inspect its design notes and workshop prompt.</p></div>
        <div className="layer-list">{architectureLayers.map((x,i)=><motion.button key={x.name} whileHover={{x:3}} aria-pressed={selected===i} className={`layer-row ${selected===i?'active':''} ${reviewed.includes(i)?'reviewed':''}`} onClick={()=>setSelected(i)}><span>{String(i+1).padStart(2,'0')}</span><b>{x.name}</b><small>{x.detail}</small>{reviewed.includes(i)?<Check size={14}/>:<ChevronRight size={15}/>}</motion.button>)}</div>
      </div>
      <Card className="architecture-detail"><div className="architecture-art"><div className="architecture-glow"/><div className="stack-cube"><div className="cube-label">ENTERPRISE<br/>AGENTIC AI</div>{['EXPERIENCE','API + ORCHESTRATION','AGENTS + MODELS','DATA + TOOLS','TRUST PLANE'].map((label,i)=><button type="button" key={label} aria-label={`Inspect ${label.toLowerCase()} architecture layer`} className={`cube-layer cube-${i+1} ${activeCubeIndex===i?'active':''}`} onClick={()=>setSelected(cubeGroups[i][0])}>{label}</button>)}</div><div className="floating-node n1">◉ POLICY</div><div className="floating-node n2">⌁ TELEMETRY</div></div>
        <AnimatePresence mode="wait"><motion.div className="layer-info" key={item.name} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}}><div className="layer-info-heading"><Pill>{String(selected+1).padStart(2,'0')} / 10 · LAYER</Pill><span>{reviewed.length} reviewed</span></div><h3>{item.name}</h3><p>{item.detail}</p><div className="info-columns"><div><span>TECHNOLOGY OPTIONS</span><b>{item.tech}</b></div><div><span>SECURITY REQUIREMENTS</span><b>{item.security}</b></div></div><div className="workshop-prompt"><span>WORKSHOP PROMPT</span><p>{item.prompt}</p></div><div className="layer-actions"><button type="button" className={isReviewed?'reviewed':''} onClick={toggleReviewed}>{isReviewed?<><Check size={13}/> Reviewed</>: 'Mark reviewed'}</button><button type="button" onClick={()=>setSelected((selected+1)%architectureLayers.length)}>Next layer <ArrowRight size={13}/></button></div></motion.div></AnimatePresence>
      </Card>
    </div>
    <section className="architecture-use-cases" aria-labelledby="architecture-use-cases-title">
      <div className="architecture-use-cases-heading"><div><Pill>USE CASE ARCHITECTURES</Pill><h3 id="architecture-use-cases-title">Explore multi-agent blueprints.</h3></div><p>Select an example to open its full architecture diagram.</p></div>
      <div className="architecture-use-case-grid">{architectureUseCaseExamples.map(example=>{
        const {id,title,summary,icon:Icon}=example;
        return <button type="button" className="architecture-use-case-card" id={`architecture-example-${id}`} key={id} onClick={()=>openExample(example)} aria-label={`Open ${title} architecture diagram`}>
          <span className="architecture-use-case-icon"><Icon size={19}/></span><span className="architecture-use-case-copy"><b>{title}</b><small>{summary}</small></span><ArrowRight size={15}/>
        </button>;
      })}</div>
    </section>
    {selectedExample&&createPortal(
      <div className="architecture-preview-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)closeExample();}}>
        <section className="architecture-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="architecture-preview-title" onKeyDown={event=>{
          if(event.key==='Escape'){event.stopPropagation();closeExample();return;}
          if(event.key==='Tab'){
            const focusable=Array.from(event.currentTarget.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
            const first=focusable[0];
            const last=focusable[focusable.length-1];
            if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
            else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
          }
        }}>
          <div className="architecture-preview-header"><div><span className="micro-label">MULTI-AGENT ARCHITECTURE</span><h2 id="architecture-preview-title">{selectedExample.title}</h2></div><button type="button" className="icon-button" onClick={closeExample} aria-label="Close architecture preview" autoFocus><X size={18}/></button></div>
          {previewError?<p className="architecture-preview-error" role="alert">This architecture diagram could not be loaded. Close the preview and try again.</p>:<img className="architecture-preview-image" src={`${publicAssetsBase}use-case-architectures/${selectedExample.fileName}`} alt={selectedExample.alt} onError={()=>setPreviewError(true)}/>}
        </section>
      </div>,
      document.body
    )}
  </div>;
}

function Framework() {
  const [active,setActive]=useState(0);
  const [query,setQuery]=useState('');
  const rows=frameworks.filter(x=>x.name.toLowerCase().includes(query.toLowerCase()));
  return <div className="framework-layout"><div className="framework-top"><div><Pill>NO UNIVERSAL WINNER</Pill><h3>Fit the tool to the system.</h3><p>Choose based on workflow state, required control, team skills and the surrounding ecosystem.</p></div><label className="searchbox">⌕ <input placeholder="Filter frameworks" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
    <div className="framework-table"><div className="table-header"><span>FRAMEWORK / PATTERN</span><span>GOOD FIT WHEN…</span><span>TRADE-OFF TO VALIDATE</span></div>{rows.map((x,i)=><button className={`framework-row ${active===frameworks.indexOf(x)?'active':''}`} onClick={()=>setActive(frameworks.indexOf(x))} key={x.name}><div><b>{x.name}</b><Pill tone="violet">{x.style}</Pill></div><span>{x.best}</span><span>{x.tradeoff}</span></button>)}</div>
    <div className="framework-footer"><div><strong>Design patterns</strong><span>Supervisor · planner · tool calling · memory · human-in-the-loop</span></div><div><strong>Selection principle</strong><span>MCP complements orchestration; it does not replace authorization or policy.</span></div></div>
  </div>;
}

function RAGPlaybook({activeId,onSelect}) {
  const activeSection=ragPlaybookSections.find(section=>section.id===activeId)||ragPlaybookSections[0];
  return <section className="rag-playbook">
    <div className="rag-playbook-heading"><div><Pill>RAG IMPLEMENTATION PLAYBOOK</Pill><h3>Explore design choices by stage.</h3></div><p>Select a topic to see starting options, trade-offs, and what to measure.</p></div>
    <div className="rag-playbook-tabs" role="tablist" aria-label="RAG playbook topics">{ragPlaybookSections.map(section=><button type="button" role="tab" aria-selected={activeId===section.id} className={activeId===section.id?'active':''} key={section.id} onClick={()=>onSelect(section.id)}>{section.label}</button>)}</div>
    <AnimatePresence mode="wait"><motion.div className="rag-playbook-panel" role="tabpanel" key={activeSection.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:.18}}>
      <div className="rag-playbook-intro"><div><span>PLAYBOOK TOPIC</span><h4>{activeSection.title}</h4></div><p>{activeSection.summary}</p></div>
      {activeSection.tables.map(table=><div className="rag-playbook-table-wrap" key={table.title}><h5>{table.title}</h5><div className="rag-table-scroll"><table className="rag-playbook-table"><thead><tr>{table.columns.map(column=><th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row,index)=><tr key={`${row[0]}-${index}`}>{row.map((cell,cellIndex)=><td key={`${cellIndex}-${cell}`}>{cell}</td>)}</tr>)}</tbody></table></div></div>)}
      {activeSection.cards&&<div className="rag-size-cards">{activeSection.cards.map(([title,text])=><div key={title}><b>{title}</b><span>{text}</span></div>)}</div>}
      {activeSection.tips?.length>0&&<div className="rag-playbook-tips">{activeSection.tips.map(([title,text])=><div key={title}><span>FIELD NOTE</span><b>{title}</b><p>{text}</p></div>)}</div>}
      <p className="rag-playbook-disclaimer">Illustrative starting guidance only. Validate model availability, licensing, quality, latency, access controls, and cost for your own data and workload.</p>
    </motion.div></AnimatePresence>
  </section>;
}

const ragSampleForStage=index=>ragDemoKnowledge.find(sample=>sample.stage===index);

function RAG() {
  const [stage,setStage]=useState(0);
  const [activePlaybook,setActivePlaybook]=useState('stages');
  const [question,setQuestion]=useState('What is the renewal notice period?');
  const [retrievalResult,setRetrievalResult]=useState(null);
  const [queryError,setQueryError]=useState('');
  const [isPlaying,setIsPlaying]=useState(false);
  const [walkthroughComplete,setWalkthroughComplete]=useState(false);
  const selectStage=index=>{
    setIsPlaying(false);
    setWalkthroughComplete(false);
    setStage(index);
    setActivePlaybook(ragStagePlaybooks[index]);
    setQuestion(ragSampleForStage(index).question);
    setRetrievalResult(null);
    setQueryError('');
  };
  const selectPlaybook=id=>{
    const nextStage=ragPlaybookStages[id]??stage;
    setIsPlaying(false);
    setWalkthroughComplete(false);
    setActivePlaybook(id);
    setStage(nextStage);
    setQuestion(ragSampleForStage(nextStage).question);
    setRetrievalResult(null);
    setQueryError('');
  };
  useEffect(()=>{
    if(!isPlaying)return undefined;
    if(stage>=ragStages.length-1){
      setIsPlaying(false);
      setWalkthroughComplete(true);
      return undefined;
    }
    const timer=window.setTimeout(()=>{
      const nextStage=stage+1;
      setStage(nextStage);
      setActivePlaybook(ragStagePlaybooks[nextStage]);
      setQuestion(ragSampleForStage(nextStage).question);
      setRetrievalResult(null);
      setQueryError('');
      setWalkthroughComplete(false);
    },1800);
    return ()=>window.clearTimeout(timer);
  },[isPlaying,stage]);
  const runSampleSearch=event=>{
    event.preventDefault();
    if(!question.trim()){
      setQueryError('Enter a question to search the illustrative source.');
      setRetrievalResult(null);
      return;
    }
    setQueryError('');
    const normalized=question.trim().toLowerCase();
    setRetrievalResult(ragDemoKnowledge.find(sample=>sample.triggers.some(trigger=>normalized.includes(trigger)))||'not-found');
  };
  const stageDescriptions=['Connect authoritative systems and preserve source identity.','Ingest incrementally with resilient connectors and change capture.','Validate schema, classify sensitivity and apply access labels.','Create semantically useful chunks with metadata and lineage.','Generate vectors using a selected, evaluated embedding model.','Index vectors with lexical search for hybrid retrieval.','Filter by permissions, retrieve candidates and rerank relevance.','Return evidence-linked responses; abstain when evidence is weak.'];
  return <div className="rag-page"><div className="rag-layout"><div className="pipeline-wrap"><div className="pipeline-label"><Pill>GROUNDED KNOWLEDGE FLOW</Pill><div className="pipeline-toolbar"><span>{isPlaying?'Auto-playing · 1.8s per stage':walkthroughComplete?'Walkthrough complete':'Select a stage or play the guided flow'}</span><div className="pipeline-transport"><button type="button" onClick={()=>{if(stage===ragStages.length-1)selectStage(0);setWalkthroughComplete(false);setIsPlaying(true)}} disabled={isPlaying} aria-label="Play grounded knowledge flow"><Play size={12}/><span>Play</span></button><button type="button" onClick={()=>setIsPlaying(false)} disabled={!isPlaying} aria-label="Stop grounded knowledge flow"><Square size={11}/><span>Stop</span></button></div></div></div><div className="pipeline">{ragStages.map((x,i)=><React.Fragment key={x}><button type="button" aria-pressed={stage===i} onClick={()=>selectStage(i)} className={`pipeline-node ${stage===i?'active':''} ${isPlaying&&stage===i?'playing':''}`}><span>{String(i+1).padStart(2,'0')}</span>{x}</button>{i<ragStages.length-1&&<ArrowRight className="pipeline-arrow" size={14}/>}</React.Fragment>)}</div><Card className="stage-insight"><div className="stage-count">STEP {String(stage+1).padStart(2,'0')}</div><div><h3>{ragStages[stage]}</h3><p>{stageDescriptions[stage]}</p></div><Pill tone="violet">ACCESS-AWARE</Pill></Card><AnimatePresence mode="wait"><motion.div className="stage-choices" key={stage} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:.2}}><div className="stage-choice probable"><b><Check size={12}/> PROBABLE CHOICES</b><p>{ragStageGuidance[stage].probable}</p></div><div className="stage-choice non-probable"><b><CircleHelp size={12}/> NON-PROBABLE CHOICES</b><p>{ragStageGuidance[stage].nonProbable}</p></div></motion.div></AnimatePresence></div>
    <Card className="retrieval-card"><Pill>TRY A RETRIEVAL · {ragStages[stage]}</Pill><h3>Ground the answer in source evidence.</h3><form className="querybox" onSubmit={runSampleSearch}><input aria-label="Sample retrieval question" value={question} onChange={e=>{setQuestion(e.target.value);setQueryError('');setRetrievalResult(null)}}/><button type="submit">Search <ArrowRight size={15}/></button></form>{queryError&&<p className="rag-query-error" role="alert">{queryError}</p>}{retrievalResult&&retrievalResult!=='not-found'&&<motion.div initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} className="retrieved"><div className="retrieved-tag"><Check size={13}/> 1 SOURCE · ACCESS FILTERED</div><p><b>{retrievalResult.source}</b><br/>“{retrievalResult.evidence}”</p><div className="source-meta">Illustrative workshop source · permission check passed</div><p className="answer">“{retrievalResult.answer}” <small>Grounded answer · illustrative source</small></p></motion.div>}{retrievalResult==='not-found'&&<div className="rag-no-match" role="status"><b>No matching source in this sample.</b><span>No answer was generated. Try the stage example shown, or ask about chunking, embeddings, access permissions, citations, or the supplier agreement.</span></div>}<p className="tiny muted">Local illustrative dataset only. Production systems must enforce source permissions, freshness, and citation verification.</p></Card>
  </div><RAGPlaybook activeId={activePlaybook} onSelect={selectPlaybook}/></div>;
}

function Lifecycle() {
  const [step,setStep]=useState(0);const checks=['Agent responsibilities and boundaries','Input / output contracts and state','Tool schemas, scopes and idempotency','Retries, fallbacks and human approval','Evaluation, security and rollout gates'];
  return <div className="lifecycle-layout"><div className="lifecycle-track">{lifecycle.map((x,i)=><button onClick={()=>setStep(i)} key={x} className={`life-step ${step===i?'active':''} ${i<step?'done':''}`}><span>{i<step?<Check size={13}/>:String(i+1).padStart(2,'0')}</span>{x}</button>)}</div><Card className="lifecycle-focus"><div className="focus-icon"><Play size={22}/></div><div className="focus-copy"><Pill>ENGINEERING GATE · {String(step+1).padStart(2,'0')}</Pill><h3>{lifecycle[step]}</h3><p>Build this as an explicit, testable system boundary. Make normal paths, exceptions and accountability visible.</p><div className="check-list">{checks.map((x,i)=><div key={x}><span className={i<=step%checks.length?'checked':''}>{i<=step%checks.length&&<Check size={12}/>}</span>{x}</div>)}</div></div><div className="lifecycle-side"><span>SHIP WITH</span><b>Contracts</b><b>Telemetry</b><b>Rollback</b><b>Owners</b></div></Card></div>;
}

function Cloud() {
  const [provider,setProvider]=useState('AWS');const [selected,setSelected]=useState(4);const [activeView,setActiveView]=useState('Architecture view');
  const providerDetails=cloudArchitectureProviders[provider];
  const views=['Architecture view','Technology catalogue','Comparison','Best practices'];
  const narrative=['Edge entry and filtering','API boundary / rate limits','Private network isolation','Resilient traffic routing','Containerized agent services','Managed / hosted foundation models','Durable business and knowledge data','Permission-aware retrieval store','Asynchronous events and queues','Identity, keys and secrets','Metrics, logs, traces and alerting'];
  const benefits=[
    ['High performance','Use edge caching and managed caches; validate latency against workload baselines.'],
    ['Enterprise security','Combine identity, encryption, network controls, and auditable access policies.'],
    ['Auto scaling','Scale managed services against measured demand and recovery objectives.'],
    ['Cost optimization','Right-size resources and monitor cost by workload and environment.']
  ];
  const practices={
    AWS:[
      ['Network isolation','Place workloads in private subnets; expose only required endpoints and routes.'],
      ['Identity first','Use IAM roles and short-lived credentials; scope permissions to each workload.'],
      ['Resilience and recovery','Set multi-AZ targets, backups, restore tests, and service-specific recovery objectives.'],
      ['Observability and cost','Correlate CloudWatch metrics, CloudTrail activity, traces, and tagged spend.']
    ],
    Azure:[
      ['Network isolation','Use VNets and private endpoints; restrict ingress with explicit network policies.'],
      ['Identity first','Prefer Entra workload identities and managed identities over stored credentials.'],
      ['Resilience and recovery','Set zone-aware targets, backups, restore tests, and service-specific recovery objectives.'],
      ['Observability and cost','Correlate Azure Monitor, Activity Logs, traces, and tagged spend.']
    ],
    GCP:[
      ['Network isolation','Use VPC boundaries and private service access; restrict ingress with firewall policy.'],
      ['Identity first','Use least-privilege IAM and Workload Identity; avoid long-lived service-account keys.'],
      ['Resilience and recovery','Set regional or zonal targets, backups, restore tests, and service-specific recovery objectives.'],
      ['Observability and cost','Correlate Cloud Logging, Cloud Monitoring, traces, and labeled spend.']
    ]
  };
  return <div className="cloud-workbench">
    <div className="cloud-workbench-heading"><div><Pill>CLOUD FOUNDATION</Pill><p>Choose a provider to explore its reference design.</p></div><div className="provider-tabs" role="tablist" aria-label="Cloud provider">{Object.keys(cloudArchitectureProviders).map(name=><button type="button" role="tab" aria-selected={provider===name} className={provider===name?'active':''} id={`cloud-provider-${name.toLowerCase()}`} aria-controls="cloud-view-panel" key={name} onClick={()=>{setProvider(name);setSelected(4);}}>{name}</button>)}</div></div>
    <div className="workbench-tabs" role="tablist" aria-label="Cloud architecture views">{views.map(view=><button type="button" role="tab" aria-selected={activeView===view} className={activeView===view?'active':''} id={`cloud-view-${view.toLowerCase().replaceAll(' ','-')}`} aria-controls="cloud-view-panel" key={view} onClick={()=>setActiveView(view)}>{view}</button>)}</div>
    <Card className="cloud-workbench-panel" role="tabpanel" id="cloud-view-panel" aria-labelledby={`cloud-view-${activeView.toLowerCase().replaceAll(' ','-')}`}>
      {activeView==='Architecture view'&&<>
        <div className="workbench-panel-heading"><div><Pill>REFERENCE ARCHITECTURE</Pill><h3>Enterprise reference architecture</h3><p>Secure, scalable building blocks on {provider}.</p></div><span className="availability-badge"><Check size={12}/> Highly available · Autoscaling</span></div>
        <div className="cloud-layer-stack">{providerDetails.layers.map((layer,index)=><div className={`cloud-layer-row cloud-layer-${index+1}`} key={layer.name}><div className="cloud-layer-title"><span>{String(index+1).padStart(2,'0')}</span><div><b>{layer.name}</b><small>{layer.detail}</small></div></div><div className="cloud-layer-services">{layer.services.map(service=><span key={service}>{service}</span>)}</div></div>)}</div>
        <div className="cloud-security-foundation"><ShieldCheck size={16}/><div><b>Security, governance and observability</b><small>{providerDetails.security}</small></div><span>FOUNDATION</span></div>
        <div className="cloud-summary-grid">
          <Card className="foundation-model-card"><Pill>MANAGED FOUNDATION MODELS</Pill><div className="foundation-model-name"><span><Sparkles size={18}/></span><div><b>{providerDetails.model}</b><small>{providerDetails.modelDetail}</small></div></div><div className="foundation-purpose"><b>Purpose</b><p>{providerDetails.purpose}</p></div><div className="foundation-details"><div><b>Typical integration</b>{providerDetails.integrations.map(item=><span key={item}><Check size={11}/>{item}</span>)}</div><div><b>Architecture considerations</b>{providerDetails.considerations.map(item=><span key={item}>{item}</span>)}</div></div><div className="foundation-alternatives"><b>Alternatives</b>{providerDetails.alternatives.map(item=><span key={item}>{item}</span>)}</div></Card>
          <div className="cloud-benefits"><Pill>KEY BENEFITS</Pill><p>Design goals to validate against the workload baseline.</p><div>{benefits.map(([title,text])=><article key={title}><b>{title}</b><span>{text}</span></article>)}</div><small>Illustrative design guidance, not service-level guarantees. Validate requirements, regional availability, security, reliability, and cost for the workload.</small></div>
        </div>
      </>}
      {activeView==='Technology catalogue'&&<div className="cloud-catalogue-view"><div className="workbench-panel-heading"><div><Pill>{provider} TECHNOLOGY CATALOGUE</Pill><h3>Choose services by architecture role.</h3><p>Select a service to inspect its place in the reference design.</p></div></div><div className="cloud-catalogue-grid">{cloudServices[provider].map((service,index)=><button type="button" className={`cloud-catalogue-item ${selected===index?'active':''}`} key={service} onClick={()=>setSelected(index)}><span>{String(index+1).padStart(2,'0')}</span><div><small>{narrative[index]}</small><b>{service}</b></div><ChevronRight size={14}/></button>)}</div><div className="catalogue-detail"><Pill>{provider} REFERENCE</Pill><p><b>{cloudServices[provider][selected]}</b> — {narrative[selected]}. Validate availability, access controls, regional support, and operational ownership before selection.</p></div></div>}
      {activeView==='Comparison'&&<div className="cloud-comparison-view"><div className="workbench-panel-heading"><div><Pill>PROVIDER COMPARISON</Pill><h3>Compare equivalent architecture capabilities.</h3><p>Service names are illustrative; confirm fit, scope, region, and pricing with each provider.</p></div></div><div className="cloud-comparison-scroll"><table className="cloud-comparison-table"><thead><tr><th>Architecture capability</th>{Object.keys(cloudArchitectureProviders).map(name=><th className={provider===name?'selected-provider':''} key={name}>{name}</th>)}</tr></thead><tbody>{cloudArchitectureProviders.AWS.layers.map((layer,index)=><tr key={layer.name}><th>{layer.name}</th>{Object.keys(cloudArchitectureProviders).map(name=><td className={provider===name?'selected-provider':''} key={name}>{cloudArchitectureProviders[name].layers[index].services.join(' · ')}</td>)}</tr>)}<tr><th>Managed foundation models</th>{Object.keys(cloudArchitectureProviders).map(name=><td className={provider===name?'selected-provider':''} key={name}>{cloudArchitectureProviders[name].model}</td>)}</tr></tbody></table></div></div>}
      {activeView==='Best practices'&&<div className="cloud-practices-view"><div className="workbench-panel-heading"><div><Pill>{provider} BEST PRACTICES</Pill><h3>Design for secure operations.</h3><p>Use these as review prompts; tailor controls to your risk and workload.</p></div></div><div className="cloud-practice-grid">{practices[provider].map(([title,text],index)=><article key={title}><span>{String(index+1).padStart(2,'0')}</span><div><b>{title}</b><p>{text}</p></div></article>)}</div></div>}
    </Card>
  </div>;
}

function Security() {
  const [active,setActive]=useState(0);
  const [filter,setFilter]=useState('All');
  const [activeView,setActiveView]=useState('Control Plane');
  const views=['Control Plane','Technology Matrix','Provider Evaluation','Capability-by-capability','Open Source Tech Stack'];
  const groups=['All','Input / output','Cloud platform','Identity & action','Data & privacy','Model & network','Validation & compliance'];
  const grouped=securityControls.map((control,id)=>({...control,id})).filter(control=>filter==='All'||control.group===filter);
  const activeId=grouped.some(control=>control.id===active)?active:grouped[0]?.id;
  const selectRowOnKey=(event,id)=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      setActive(id);
    }
  };
  return <div className="security-layout"><div className="security-intro"><div className="security-shield"><Shield size={27}/><div className="shield-ring"/></div><Pill>DEFENSE IN DEPTH</Pill><h3>Guard every transition.<br/><em>Authorize every action.</em></h3><p>Layer application controls with cloud and network protections. No single guardrail makes an agent safe.</p><div className="security-stack">{['Input / output safeguards','Cloud & workload identity','Data and tenant isolation','Model & network integrity','Validation, audit & response'].map((label,index)=><div key={label}><span>{String(index+1).padStart(2,'0')}</span>{label}<Check size={13}/></div>)}</div></div>
    <Card className="security-workbench"><div className="security-view-tabs" role="tablist" aria-label="Security views">{views.map(view=><button type="button" role="tab" aria-selected={activeView===view} className={activeView===view?'active':''} id={`security-view-${view.toLowerCase().replaceAll(/[^a-z0-9]+/g,'-')}`} aria-controls="security-view-panel" key={view} onClick={()=>setActiveView(view)}>{view}</button>)}</div>
      <div className="security-view-panel" role="tabpanel" id="security-view-panel" aria-labelledby={`security-view-${activeView.toLowerCase().replaceAll(/[^a-z0-9]+/g,'-')}`}>
        {activeView==='Control Plane'&&<><div className="security-panel-heading"><Pill>THREAT → SECURITY CONTROL → TECHNOLOGY → EVIDENCE</Pill><h3>Interactive security control matrix</h3></div><div className="security-filter-tabs" role="tablist" aria-label="Filter security controls">{groups.map(group=><button type="button" role="tab" aria-selected={filter===group} key={group} onClick={()=>setFilter(group)}>{group}</button>)}</div><div className="security-matrix-scroll"><table className="security-matrix" aria-label="Threat, security control, technology, and validation evidence"><thead><tr><th scope="col">Threat</th><th scope="col">Security control</th><th scope="col">Technology</th><th scope="col">Validation evidence</th></tr></thead><tbody>{grouped.map(control=><tr key={control.id} tabIndex={0} aria-selected={activeId===control.id} className={activeId===control.id?'active':''} onClick={()=>setActive(control.id)} onKeyDown={event=>selectRowOnKey(event,control.id)}><th scope="row">{control.threat}</th><td>{control.securityControl}</td><td>{control.technology}</td><td>{control.validationEvidence}</td></tr>)}</tbody></table></div><p className="security-matrix-hint" aria-live="polite">{grouped.length} threat patterns shown · Select or focus a row to highlight the complete control path.</p><div className="vendor-note"><b>Platform note:</b> Vendor examples are illustrative; verify current capabilities, scope, and licensing. Microsegmentation complements—but does not replace—application-level guardrails and authorization.</div></>}
        {activeView==='Technology Matrix'&&<><div className="security-panel-heading"><Pill>CONTROL COVERAGE</Pill><h3>Map threats to controls and evidence.</h3><p>Use the matrix to identify accountable controls and the evidence required to validate them.</p></div><div className="security-matrix-scroll"><table className="security-matrix technology-matrix"><thead><tr><th>Control domain</th><th>Threat pattern</th><th>Security control</th><th>Technology</th></tr></thead><tbody>{securityControls.map(control=><tr key={control.threat}><th>{control.group}</th><td>{control.threat}</td><td>{control.securityControl}</td><td>{control.technology}</td></tr>)}</tbody></table></div></>}
        {activeView==='Provider Evaluation'&&<><div className="security-panel-heading"><Pill>HYPERSCALER SECURITY</Pill><h3>Evaluate provider control coverage.</h3><p>Illustrative service mapping; verify product scope, configuration, regional availability, and licensing.</p></div><div className="security-matrix-scroll"><table className="security-matrix provider-evaluation-table"><thead><tr><th>Capability</th><th>AWS</th><th>Azure</th><th>Google Cloud</th></tr></thead><tbody>{securityProviderEvaluation.map(row=><tr key={row.capability}><th>{row.capability}</th><td>{row.AWS}</td><td>{row.Azure}</td><td>{row.GCP}</td></tr>)}</tbody></table></div></>}
        {activeView==='Capability-by-capability'&&<><div className="security-panel-heading"><Pill>DEFENSE IN DEPTH</Pill><h3>Validate each security capability.</h3><p>Pair every control with evidence that can be reviewed and repeated.</p></div><div className="security-capability-grid">{securityCapabilities.map((capability,index)=><article key={capability.name}><span>{String(index+1).padStart(2,'0')}</span><div><b>{capability.name}</b><p>{capability.control}</p><small><Check size={12}/>{capability.evidence}</small></div></article>)}</div></>}
        {activeView==='Open Source Tech Stack'&&<><div className="security-panel-heading"><Pill>OPEN SOURCE OPTIONS</Pill><h3>Build a composable security stack.</h3><p>Examples only; assess maturity, maintenance, integration, and operational ownership before adoption.</p></div><div className="security-matrix-scroll"><table className="security-matrix open-source-table"><thead><tr><th>Security area</th><th>Illustrative projects</th><th>Where they can help</th></tr></thead><tbody>{openSourceSecurityTools.map(tool=><tr key={tool.area}><th>{tool.area}</th><td>{tool.examples}</td><td>{tool.use}</td></tr>)}</tbody></table></div><div className="vendor-note"><b>Selection note:</b> Open-source tools do not replace threat modeling, configuration review, human approval, or provider-native controls.</div></>}
      </div>
    </Card>
  </div>;
}

function Governance() {
  const [active,setActive]=useState('Business');const groups={Business:['Executive sponsor','AI product owner','Process owner'],Technology:['Enterprise architect','AI / ML engineering','Platform & SRE'],Control:['Security & privacy','Data governance','Risk & compliance']};
  return <div className="governance-layout"><div className="governance-model"><div className="governance-orbit"><div className="gov-center">TRUSTED<br/>OUTCOMES</div><i className="g-node gn1">BIZ</i><i className="g-node gn2">TECH</i><i className="g-node gn3">RISK</i><i className="g-node gn4">DATA</i></div><div className="operating-caption"><Pill>OPERATING MODEL</Pill><h3>Shared accountability.<br/>Clear decision rights.</h3><p>One accountable business owner; cross-functional oversight proportional to risk.</p></div></div><Card className="governance-card"><Pill>GOVERNANCE COUNCIL</Pill><h3>Bring the right voices to the table.</h3><div className="toggle-group">{Object.keys(groups).map(x=><button onClick={()=>setActive(x)} className={active===x?'active':''} key={x}>{x}</button>)}</div><div className="stakeholder-list">{groups[active].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b><small>{active==='Business'?'Sets value and owns the outcome.':active==='Technology'?'Designs, builds and operates the service.':'Defines policy, reviews evidence and monitors risk.'}</small></div>)}</div><div className="governance-footer"><span>Lifecycle controls</span><span>Risk tiering</span><span>Model & agent registry</span><span>Change approval</span><span>Audit evidence</span></div></Card></div>;
}

function Delivery() {
  const [stage,setStage]=useState(0);const pipe=['Developer','Git','Review','Tests','Agent eval','Security scan','Model validate','Container build','Registry','Canary deploy','Monitor','Feedback'];
  return <div className="delivery-layout"><div className="delivery-left"><Pill>CI / CD + LLMOPS</Pill><h3>Every release is an<br/>evidence-backed change.</h3><p>Prompts, model configuration and workflow definitions deserve versioning and review alongside application code.</p><div className="delivery-practices">{['Isolated environments','Canary / blue-green','Automated rollback','Secrets out of code'].map(x=><span key={x}><Check size={13}/>{x}</span>)}</div></div><div className="delivery-pipeline">{pipe.map((x,i)=><React.Fragment key={x}><button className={`delivery-node ${stage===i?'active':''} ${i<stage?'complete':''}`} onClick={()=>setStage(i)}><span>{i<stage?<Check size={12}/>:String(i+1).padStart(2,'0')}</span>{x}</button>{i<pipe.length-1&&<div className="pipe-link"><i/></div>}</React.Fragment>)}<Card className="delivery-insight"><div className="micro-label">RELEASE GATE · {String(stage+1).padStart(2,'0')}</div><h3>{pipe[stage]}</h3><p>{['Changes originate from an accountable team with tests and ownership.','Commit code, prompts and workflow configuration with traceable versions.','Review changes for quality, risk, data handling and operational impact.','Exercise contracts, edge cases, tool failures and deterministic policy.','Measure task success, groundedness, latency and safety on a representative set.','Scan dependencies, containers, APIs and AI-specific attack surfaces.','Validate model choice, provenance, parameters and behavior.','Produce reproducible, signed artifacts with software bill of materials.','Protect versioned artifacts with controlled promotion and access.','Expose changes gradually, observe metrics and hold rollback criteria.','Compare outcome, quality, policy, availability and spend against SLOs.','Use reviewed feedback to update tests and prioritization.'][stage]}</p></Card></div></div>;
}

const opsData=[
  {t:'09:00',agentSuccess:92,taskCompletion:93.7,latency:2.1,tokens:3400,cost:.21,toolFailure:2.3,groundedness:.88,guardrails:.9,escalation:10.1,loops:.6,apiAvailability:99.91,sloAttainment:99.82},
  {t:'10:00',agentSuccess:94,taskCompletion:94.8,latency:1.9,tokens:3350,cost:.19,toolFailure:1.8,groundedness:.9,guardrails:.8,escalation:8.9,loops:.4,apiAvailability:99.93,sloAttainment:99.91},
  {t:'11:00',agentSuccess:91,taskCompletion:93.9,latency:2.4,tokens:3600,cost:.24,toolFailure:2.2,groundedness:.89,guardrails:.9,escalation:9.3,loops:.5,apiAvailability:99.9,sloAttainment:99.89},
  {t:'12:00',agentSuccess:96,taskCompletion:96.4,latency:1.8,tokens:3300,cost:.18,toolFailure:1.1,groundedness:.92,guardrails:.6,escalation:8.1,loops:.2,apiAvailability:99.95,sloAttainment:99.93},
  {t:'13:00',agentSuccess:95,taskCompletion:95.8,latency:1.7,tokens:3280,cost:.17,toolFailure:1.3,groundedness:.93,guardrails:.5,escalation:8,loops:.2,apiAvailability:99.94,sloAttainment:99.92},
  {t:'14:00',agentSuccess:97,taskCompletion:96.7,latency:1.6,tokens:3200,cost:.16,toolFailure:1.5,groundedness:.92,guardrails:.6,escalation:7.8,loops:.3,apiAvailability:99.96,sloAttainment:99.91},
  {t:'15:00',agentSuccess:94.8,taskCompletion:96.2,latency:1.8,tokens:3250,cost:.19,toolFailure:1.8,groundedness:.91,guardrails:.7,escalation:8.4,loops:.3,apiAvailability:99.95,sloAttainment:99.92}
];
const operationalMetrics=[
  {label:'Agent success rate',value:'94.8%',note:'+2.1% vs prior',dataKey:'agentSuccess',unit:'%',color:'cyan'},
  {label:'Task completion rate',value:'96.2%',note:'completed / started',dataKey:'taskCompletion',unit:'%',color:'cyan'},
  {label:'Model latency',value:'1.8 s',note:'p95 · 4.2 s',dataKey:'latency',unit:' s',color:'cyan'},
  {label:'Token consumption',value:'3.25K',note:'2.6K input · 650 output / task',dataKey:'tokens',unit:' tokens',color:'cyan'},
  {label:'Cost per task',value:'$0.19',note:'within target',dataKey:'cost',format:'currency',color:'cyan'},
  {label:'Tool failure rate',value:'1.8%',note:'98.2% tool success',dataKey:'toolFailure',unit:'%',color:'violet'},
  {label:'Hallucination / groundedness',value:'0.91',note:'groundedness evaluation',dataKey:'groundedness',format:'decimal',color:'violet'},
  {label:'Guardrail violations',value:'0.7%',note:'blocked / attempted',dataKey:'guardrails',unit:'%',color:'violet'},
  {label:'Human escalation rate',value:'8.4%',note:'review queue volume',dataKey:'escalation',unit:'%',color:'cyan'},
  {label:'Agent loop detection',value:'0.3%',note:'stopped before runaway',dataKey:'loops',unit:'%',color:'violet'},
  {label:'API availability',value:'99.95%',note:'30-day window',dataKey:'apiAvailability',unit:'%',color:'cyan'},
  {label:'SLA / SLO',value:'99.92%',note:'SLO target 99.9% · met',dataKey:'sloAttainment',unit:'%',color:'cyan'}
];
function Monitoring() {
  const [period,setPeriod]=useState('24 hours');
  const [selected,setSelected]=useState(operationalMetrics[0].label);
  const selectedMetric=operationalMetrics.find(metric=>metric.label===selected)||operationalMetrics[0];
  const formatMetric=value=>selectedMetric.format==='currency'
    ?`$${Number(value).toFixed(2)}`
    :selectedMetric.format==='decimal'
      ?Number(value).toFixed(2)
      :`${value}${selectedMetric.unit||''}`;
  return <div className="monitor-layout">
    <div className="monitor-top"><div><Pill>PRODUCTION · ILLUSTRATIVE</Pill><h3>One view from request to outcome.</h3></div><div className="toggle-group compact">{['24 hours','7 days','30 days'].map(x=><button key={x} className={period===x?'active':''} onClick={()=>setPeriod(x)}>{x}</button>)}</div></div>
    <div className="metric-grid">{operationalMetrics.map(metric=><button type="button" onClick={()=>setSelected(metric.label)} key={metric.label} className={selected===metric.label?'metric-selected':''}><Metric label={metric.label} value={metric.value} note={metric.note} color={metric.color}/></button>)}</div>
    <div className="charts-grid">
      <Card className="chart-card wide"><div className="card-title-row"><div><span className="micro-label">{selected.toUpperCase()} · {period.toUpperCase()}</span><h3>{selected} trend</h3></div><Pill>ILLUSTRATIVE</Pill></div>
        <ResponsiveContainer width="100%" height={185}><AreaChart data={opsData}><defs><linearGradient id="opsTrendGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#52dfdb" stopOpacity=".35"/><stop offset="100%" stopColor="#52dfdb" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="#243449" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="t" stroke="#71839a" tickLine={false}/><YAxis stroke="#71839a" tickLine={false}/><Tooltip formatter={value=>[formatMetric(value),selectedMetric.label]} contentStyle={chartTip}/><Area type="monotone" dataKey={selectedMetric.dataKey} stroke="#52dfdb" fill="url(#opsTrendGrad)" strokeWidth={2}/></AreaChart></ResponsiveContainer>
      </Card>
      <Card className="chart-card"><span className="micro-label">QUALITY & CONTROL</span><h3>Evaluation checks</h3><div className="signal-list">{[['Groundedness','0.91',91],['Tool success','98.2%',98],['Loop detection','0.3%',22],['Review SLA','96.5%',96]].map(item=><div key={item[0]}><span>{item[0]}</span><b>{item[1]}</b><i><em style={{width:`${item[2]}%`}}/></i></div>)}</div><p className="tiny muted">Illustrative telemetry. Set service-specific thresholds and review them against SLOs.</p></Card>
    </div>
    <div className="monitor-foot">Correlate outcomes, models, tools and infrastructure · redact sensitive logs · retain immutable audit evidence</div>
  </div>;
}

function EmbeddedHtmlFrame({assetName,className,title}) {
  const assetBase=import.meta.env.BASE_URL.replace(/\/+$/,'');
  const assetUrl=`${assetBase}/${assetName}?embedded=1`;
  const [html,setHtml]=useState('');
  const [loadError,setLoadError]=useState('');
  useEffect(()=>{
    const controller=new AbortController();
    fetch(assetUrl,{signal:controller.signal})
      .then(response=>{
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(setHtml)
      .catch(error=>{
        if(!controller.signal.aborted)setLoadError(error instanceof Error?error.message:String(error));
      });
    return ()=>controller.abort();
  },[assetUrl]);
  if(loadError)return <p className="embedded-html-error" role="alert">Unable to load {title}: {loadError}</p>;
  return <iframe
      className={className}
      title={title}
      loading="eager"
      referrerPolicy="no-referrer"
      sandbox="allow-scripts allow-forms allow-downloads allow-popups"
      srcDoc={html||undefined}
    />;
}

function CloudCostEstimator() {
  return <div className="cloud-cost-estimator">
    <EmbeddedHtmlFrame
      className="cloud-cost-estimator-frame"
      assetName="cloud-cost-estimator.html"
      title="Cloud pricing calculator comparing AWS, Azure and Google Cloud"
    />
  </div>;
}

function ModelBenchmark() {
  return <div className="model-benchmark">
    <EmbeddedHtmlFrame
      className="model-benchmark-frame"
      assetName="ai-model-benchmarking.html"
      title="AI model performance, economics and production benchmark"
    />
  </div>;
}

function UseCases() {
  const [active,setActive]=useState(0);const current=useCases[active];const loanSteps=['Document AI','Application validation','Credit intelligence','Fraud intelligence','Covenant intelligence','Human credit approval','Fulfilment','Portfolio monitoring'];
  return <div className="usecase-layout"><div className="usecase-list">{useCases.map((x,i)=><button className={active===i?'active':''} onClick={()=>setActive(i)} key={x[0]}><span>{String(i+1).padStart(2,'0')}</span>{x[0]}<ChevronRight size={14}/></button>)}</div><Card className="usecase-detail"><div className="case-header"><div><Pill>ILLUSTRATIVE USE CASE</Pill><h3>{current[0]}</h3><p>{current[1]}</p></div><div className="case-icon"><Sparkles/></div></div><div className="workflow-label">WORKFLOW PATTERN <span>AI-assisted</span><span>Deterministic</span><span>Human decision</span></div><div className="commercial-flow">{loanSteps.map((x,i)=><React.Fragment key={x}><div className={`workflow-step ${i===5?'human':i===1||i===7?'deterministic':'ai'}`}><span>{i===5?'●':i===1||i===7?'◆':'✦'}</span><b>{x}</b><small>{i===5?'Required approval':i===1||i===7?'Rules & system action':'Evidence and recommendations'}</small></div>{i<loanSteps.length-1&&<ArrowRight size={13}/>}</React.Fragment>)}</div><div className="human-note"><Shield size={16}/><span>{current[2]}<b> Keep policy decisions deterministic; make accountable review explicit.</b></span></div></Card></div>;
}

function Roadmap() {
  const [active,setActive]=useState(0);const p=phases[active];
  return <div className="roadmap-layout"><div className="roadmap-rail">{phases.map((x,i)=><button key={x[0]} onClick={()=>setActive(i)} className={`roadmap-phase ${active===i?'active':''} ${i<active?'done':''}`}><span>{i<active?<Check size={14}/>:x[0]}</span><b>{x[1]}</b><small>{['Find fit','Design safely','Prove','Learn','Harden','Expand'][i]}</small></button>)}</div><Card className="phase-detail"><div className="phase-header"><div><Pill>PHASE {p[0]} / 06</Pill><h3>{p[1]}</h3><p>{p[2]}</p></div><div className="phase-gate"><span>EXIT GATE</span><Check size={21}/></div></div><div className="phase-facts"><div><span>KEY DELIVERABLES</span><b>{p[3]}</b></div><div><span>ACCOUNTABLE STAKEHOLDERS</span><b>{p[4]}</b></div><div><span>ACCEPTANCE CRITERIA</span><b>{p[5]}</b></div><div><span>KEY RISK TO MANAGE</span><b>Scope growth · weak baseline · unclear ownership</b></div></div><div className="phase-footer"><span>POC demonstrates feasibility.</span><ArrowRight size={15}/><span>Production requires security, operations, value and accountability evidence.</span></div></Card></div>;
}

function OperatingModel() {
  const roles=['AI Product Owner','Process Owner','Enterprise Architect','Agent Engineer','Data Engineer','Cloud / Platform','Security / Privacy','Risk / Compliance','SRE / LLMOps','Human Reviewer'];
  const activities=['Value & scope','Architecture','Build & test','Controls & risk','Operate'];
  const matrix=[
    ['A','R','C','C','I'],['R','A','C','I','C'],['C','R','A','C','C'],['C','C','R','I','I'],['C','C','R','C','I'],['I','C','R','C','R'],['I','C','C','A','C'],['C','I','I','A','C'],['I','C','R','C','R'],['I','C','I','C','R']
  ];
  return <div className="rac-layout"><div className="rac-intro"><Pill>PRODUCT TEAM</Pill><h3>Build with the people<br/>who own the outcome.</h3><p>A durable team joins domain expertise, engineering and independent control functions.</p><div className="team-chips">{['Product','Business','Architecture','Engineering','Control','Operations'].map((x,i)=><span className={`team-chip tc${i}`} key={x}>{x}</span>)}</div></div><Card className="raci-card"><div className="card-title-row"><div><Pill>RACI · ILLUSTRATIVE</Pill><h3>Clear ownership, fewer gaps.</h3></div><div className="raci-legend"><span>A Accountable</span><span>R Responsible</span><span>C Consulted</span><span>I Informed</span></div></div><div className="raci-table"><div className="raci-header"><span>ROLE</span>{activities.map(x=><span key={x}>{x}</span>)}</div>{roles.map((x,i)=><div className="raci-row" key={x}><b>{x}</b>{matrix[i].map((c,j)=><span className={`raci-cell ${c.toLowerCase()}`} key={j}>{c}</span>)}</div>)}</div></Card></div>;
}

function Executive() {
  const [form,setForm]=useState({opportunity:'Reduce lending application cycle time',pattern:'Bounded agent with reviewer gates',sponsor:'Business process owner',target:'12-week discovery + pilot plan'});const [generated,setGenerated]=useState(false);
  return <div className="executive-layout"><Card className="executive-form"><Pill>WORKSHOP OUTPUT</Pill><h3>Build the decision brief.</h3><p className="muted">Capture what the room aligns on. Print or save this page as PDF.</p>{[['Opportunity','opportunity'],['Recommended pattern','pattern'],['Accountable sponsor','sponsor'],['Next milestone','target']].map(([label,key])=><label className="summary-input" key={key}><span>{label}</span><input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}<div className="executive-actions"><button className="primary-button" onClick={()=>setGenerated(true)}><Sparkles size={15}/> Generate summary</button><button className="secondary-button" onClick={()=>window.print()}><Download size={15}/> Print / PDF</button></div><div className="decision-checks"><span><Check/> Business owner named</span><span><Check/> Human accountability set</span><span><Check/> Production gate explicit</span></div></Card><Card className="brief-preview"><div className="brief-top"><Pill tone="violet">EXECUTIVE DECISION · DRAFT</Pill><span>AGENTIC AI STRATEGY</span></div><div className="brief-title"><div className="brand-mark mini">A<span>✦</span></div><div><div className="micro-label">CUSTOMER WORKSHOP SUMMARY</div><h3>{generated?'A focused path to measurable value':'The next move is clarity.'}</h3></div></div><div className="summary-grid"><div><span>OPPORTUNITY</span><b>{form.opportunity||'—'}</b></div><div><span>RECOMMENDED PATTERN</span><b>{form.pattern||'—'}</b></div><div><span>ACCOUNTABLE SPONSOR</span><b>{form.sponsor||'—'}</b></div><div><span>NEXT MILESTONE</span><b>{form.target||'—'}</b></div></div><div className="summary-recommendation"><span>RECOMMENDED ACTION</span><p>{generated?'Time-box discovery, confirm baseline and data permissions, then validate the workflow with a human-in-the-loop pilot.':'Align on a measurable workflow, baseline its performance and risk, and validate one bounded pattern before committing to scale.'}</p></div><div className="summary-footer">Illustrative strategy framework · Assumptions require customer validation · High-impact decisions need accountable human oversight</div></Card></div>;
}

const pageMap={1:Vision,2:Discovery,3:Decision,4:Architecture,5:Framework,6:RAG,7:Lifecycle,8:Cloud,9:Security,10:Governance,11:Delivery,12:Monitoring,13:ModelBenchmark,14:CloudCostEstimator,15:UseCases,16:Roadmap,17:OperatingModel,18:Executive};
export default function SlideContent({slide,demoRunToken=0,demoStopToken=0,onDiscoveryDemoComplete,onNavigate}) {
  if(slide===0)return <Vision onNavigate={onNavigate}/>;
  if(slide===1)return <Discovery demoRunToken={demoRunToken} demoStopToken={demoStopToken} onDemoComplete={onDiscoveryDemoComplete}/>;
  const Component=pageMap[slide+1];
  return <Component/>;
}
