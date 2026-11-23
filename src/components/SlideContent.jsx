import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, ArrowUp, Check, ChevronRight, CircleHelp, Download, LockKeyhole, Play, RotateCcw, Scale, Shield, Sparkles, Square, ThumbsDown, ThumbsUp, TrainFront } from 'lucide-react';
import { architectureLayers, cloudServices, frameworks, lifecycle, phases, ragStages, securityControls, slides, useCases } from '../data/strategy.js';
import { discoveryTestCases } from '../data/discoveryTestData.js';
import { ragDemoKnowledge, ragPlaybookSections, ragPlaybookStages, ragStageGuidance, ragStagePlaybooks } from '../data/ragPlaybook.js';
import { Card, Metric, Pill, Range, SectionHeading } from './UI.jsx';

const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const moneyPrecise = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const chartTip = { background: '#101c2c', border: '1px solid #26384e', borderRadius: 10, color: '#eaf2ff' };
const discoveryPrompts=['Business objective','Process bottleneck','Manual effort / cost','Customer impact','Data sources & quality','Applications / integration','Regulatory constraints','Success KPI'];
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

function assessDiscoveryAnswers(answers) {
  const allText=Object.values(answers).join(' ').toLowerCase();
  const valueText=[answers[discoveryPrompts[0]],answers[discoveryPrompts[2]],answers[discoveryPrompts[7]]].join(' ').toLowerCase();
  const workflowText=[answers[discoveryPrompts[1]],answers[discoveryPrompts[5]]].join(' ').toLowerCase();
  const dataText=answers[discoveryPrompts[4]].toLowerCase();
  const riskText=[answers[discoveryPrompts[5]],answers[discoveryPrompts[6]]].join(' ').toLowerCase();
  const hasAny=(text,words)=>words.some(word=>text.includes(word));
  const autonomousHighImpact=/(automatically approve|automatically reject|approve or reject all loan|autonomous.{0,30}(credit|loan|medical|legal)|final (credit|loan|medical|legal) decision)/i.test(allText);
  const quantified=/[$%]|\b\d+(?:\.\d+)?\s*(hours?|days?|weeks?|months?|transactions?|cases?|staff|people)\b/i.test(valueText);
  const measurableOutcome=/\b(reduce|decrease|increase|improve|cut|save|under|below|within)\b/i.test(valueText);
  const boundedAction=hasAny(workflowText,['read-only','draft','bounded','staff review','human review','approval']);
  const clearWorkflow=hasAny(workflowText,['manual','compare','repeat','routine','exception','bottleneck','steps']);
  const poorData=hasAny(dataText,['incomplete','inconsistent','unavailable','untrusted','unknown','poor quality','difficult to access']);
  const readyData=hasAny(dataText,['digital','available','trusted','complete','structured','validated','erp','quality']);
  const humanControls=hasAny(riskText,['human','review','approval','audit','policy','read-only','draft']);
  const criteria=[
    {label:'Business value',score:quantified&&measurableOutcome?4:quantified?3:2,detail:quantified&&measurableOutcome?'A measurable outcome or baseline is captured.':'Add a quantified baseline and a specific target outcome.'},
    {label:'Workflow fit',score:autonomousHighImpact?1:clearWorkflow&&boundedAction?4:clearWorkflow?3:2,detail:autonomousHighImpact?'The requested workflow includes autonomous high-impact decisions.':clearWorkflow&&boundedAction?'A recognizable workflow and bounded action are described.':'Clarify repeatable steps, action boundaries, and exception handling.'},
    {label:'Data readiness',score:poorData?1:readyData?4:2,detail:poorData?'Data quality or access gaps need to be resolved first.':readyData?'Digital or accessible source data is identified.':'Confirm source ownership, access, quality, and freshness.'},
    {label:'Risk tolerance',score:autonomousHighImpact?1:humanControls?4:2,detail:autonomousHighImpact?'High-impact outcomes need accountable human decision-making.':humanControls?'Human review, approval, or audit controls are identified.':'Define approval limits, accountable owners, and audit evidence.'}
  ];
  const score=criteria.reduce((sum,item)=>sum+item.score,0)/criteria.length;
  const result=autonomousHighImpact
    ?{status:'HUMAN DECISION REQUIRED',tone:'warning',recommendation:'Use AI to prepare evidence for a qualified reviewer—not to make the final decision.',note:'Establish decision criteria, data access, fairness checks, and accountable human review before expanding automation.'}
    :score>=3.5
      ?{status:'GOOD FIRST CANDIDATE',tone:'positive',recommendation:'Start with AI-assisted triage, deterministic validation, and human approval for consequential actions.',note:'Confirm the baseline and measure quality, cycle time, and exception rates in a controlled pilot.'}
      :score<=2.25
        ?{status:'NOT READY — ADDRESS GAPS',tone:'warning',recommendation:'Do not automate yet. Establish the process baseline, trusted data, and measurable success criteria first.',note:'Revisit the opportunity after the key discovery gaps have owners and remediation plans.'}
        :{status:'CONDITIONAL CANDIDATE',tone:'conditional',recommendation:'Run a bounded discovery or proof of concept with explicit policy checks and human oversight.',note:'Resolve the weaker discovery dimensions before making production commitments.'};
  return {...result,criteria,score:score.toFixed(1)};
}

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
        {stages.map((stage,index)=><button type="button" className="journey-stage" key={stage.eyebrow} style={{'--stage-delay':`${index*2}s`}} onClick={()=>onNavigate(index+1)} aria-label={`Open stage ${String(index+1).padStart(2,'0')}: ${stage.eyebrow.split('/').pop().trim()} — ${stage.title}`} title={stage.title}>
          <span className="journey-stage-node">{String(index+1).padStart(2,'0')}</span>
          <span className="journey-stage-name">{stage.eyebrow.split('/').pop().trim()}</span>
        </button>)}
        <span className="journey-train" aria-hidden="true"><TrainFront size={17}/></span>
      </div></div>
    </section>
  </div>;
}

function Discovery({demoRunToken,demoStopToken,onDemoComplete}) {
  const prompts=discoveryPrompts;
  const [answers,setAnswers]=useState({});
  const [assessment,setAssessment]=useState(null);
  const [activeLens,setActiveLens]=useState(0);
  const [formError,setFormError]=useState('');
  const [isDemoRunning,setIsDemoRunning]=useState(false);
  const changeAnswer=(prompt,value)=>{
    setAnswers(current=>({...current,[prompt]:value}));
    setAssessment(null);
    setFormError('');
    setIsDemoRunning(false);
  };
  useEffect(()=>{
    if(demoRunToken<=demoStopToken){
      setIsDemoRunning(false);
      return undefined;
    }
    const positive=discoveryTestCases.find(testCase=>testCase.id==='positive');
    const negative=discoveryTestCases.find(testCase=>testCase.id==='negative');
    if(!positive||!negative)throw new Error('Discovery demo requires positive and negative cases from testdata.md.');
    const cases=[positive,negative];
    const incompleteCase=cases.find(testCase=>prompts.some(prompt=>!testCase.answers[prompt]?.trim()));
    if(incompleteCase){
      const missing=prompts.find(prompt=>!incompleteCase.answers[prompt]?.trim());
      setFormError(`The ${incompleteCase.id} test data is missing: ${missing}.`);
      setIsDemoRunning(false);
      onDemoComplete();
      return undefined;
    }
    setIsDemoRunning(true);
    let timer;
    let currentInput;
    let cancelled=false;
    let caseIndex=0;
    const runCase=()=>{
      if(cancelled)return;
      const testCase=cases[caseIndex];
      setAnswers({});
      setAssessment(null);
      setActiveLens(0);
      setFormError('');
      let fieldIndex=0;
      const visitField=()=>{
        if(cancelled)return;
        if(fieldIndex>=prompts.length){
          setAssessment(assessDiscoveryAnswers(testCase.answers));
          setActiveLens(0);
          timer=window.setTimeout(()=>{
            if(caseIndex+1<cases.length){
              caseIndex+=1;
              runCase();
            }else{
              setIsDemoRunning(false);
              onDemoComplete();
            }
          },850);
          return;
        }
        const prompt=prompts[fieldIndex];
        setAnswers(current=>({...current,[prompt]:testCase.answers[prompt]}));
        setActiveLens(Math.min(3,Math.floor(fieldIndex/2)));
        currentInput=document.getElementById(`discovery-${fieldIndex}`);
        currentInput?.classList.add('guided-play-target');
        currentInput?.scrollIntoView({
          behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',
          block:'center',
          inline:'nearest'
        });
        timer=window.setTimeout(()=>{
          currentInput?.classList.remove('guided-play-target');
          currentInput=null;
          fieldIndex+=1;
          visitField();
        },650);
      };
      visitField();
    };
    runCase();
    return ()=>{
      cancelled=true;
      window.clearTimeout(timer);
      currentInput?.classList.remove('guided-play-target');
    };
  },[demoRunToken,demoStopToken,onDemoComplete]);
  const analyzeOpportunity=e=>{
    e.preventDefault();
    const missing=prompts.find(prompt=>!answers[prompt]?.trim());
    if(missing){
      setFormError(`Please complete all 8 fields. Missing: ${missing}.`);
      document.getElementById(`discovery-${prompts.indexOf(missing)}`)?.focus();
      return;
    }
    setAssessment(assessDiscoveryAnswers(answers));
    setActiveLens(0);
    setFormError('');
    setIsDemoRunning(false);
  };
  return <div className="content-grid">
    <Card className="discovery-form"><form onSubmit={analyzeOpportunity} noValidate><div className="card-title-row"><div><Pill>WORKSHOP CANVAS</Pill><h3>Opportunity discovery</h3></div><span className="counter">{Object.values(answers).filter(value=>value.trim()).length}/{prompts.length} captured</span></div>
      <div className="form-grid">{prompts.map((p,i)=><label className="text-field" key={p}><span><i>{String(i+1).padStart(2,'0')}</i>{p}</span><input id={`discovery-${i}`} value={answers[p]||''} onChange={e=>changeAnswer(p,e.target.value)} placeholder={['What outcome matters?','Where does work stall?','Hours or cost per month?','What is the customer pain?','Which sources are trusted?','What must the solution connect to?','What rules constrain this?','How will success be measured?'][i]} aria-required="true" disabled={isDemoRunning}/></label>)}</div>
      <div className="discovery-actions"><button className="analyze-button" type="submit" disabled={isDemoRunning}><Sparkles size={14}/>{assessment?'Update assessment':'Analyze opportunity'}</button><span>Complete all 8 fields to generate the workshop readout.</span></div>
      {formError&&<p className="form-error" role="alert">{formError}</p>}
      {assessment&&!formError&&<p className="assessment-note" role="status">Assessment updated from the submitted answers. Change a field and submit again to refresh.</p>}
    </form></Card>
    <div className="side-stack"><Card className="accent-card"><Pill tone="violet">DISCOVERY LENS</Pill><h3>{assessment?'Assessment signals':'Value lives at the intersection'}</h3><div className="lens-list">{(assessment?.criteria||['Business value','Workflow fit','Data readiness','Risk tolerance'].map(label=>({label}))).map((item,i)=><button type="button" className={`lens-row ${assessment&&activeLens===i?'active':''}`} key={item.label} onClick={()=>assessment&&setActiveLens(i)} disabled={!assessment}><span className="lens-dot">{i+1}</span><span>{item.label}</span>{assessment&&<b className={`lens-score ${item.score<=2?'low':''}`}>{item.score}/5</b>}<ChevronRight size={15}/></button>)}</div>{assessment?<div className="lens-detail" aria-live="polite"><b>{assessment.criteria[activeLens].label} · {assessment.criteria[activeLens].score}/5</b><p>{assessment.criteria[activeLens].detail}</p></div>:<p className="muted small">Submit the workshop canvas to see a signal for each dimension.</p>}</Card><Card className={`candidate-card ${assessment?assessment.tone:''}`}><div className="micro-label">{assessment?.status||'WORKSHOP GUIDANCE'}{assessment&&<span className="candidate-score">SIGNAL {assessment.score}/5</span>}</div><p className="quote">{assessment?.recommendation||'High volume, measurable outcomes, digital evidence, bounded actions—and a human owner.'}</p>{assessment&&<p className="candidate-note">{assessment.note}</p>}<Pill>{assessment?'RULE-BASED WORKSHOP HEURISTIC':'NOT: “Use an agent”'}</Pill></Card></div>
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
  const item=architectureLayers[selected];
  const cubeGroups=[[0],[1,2],[3,4],[5,6,7],[8,9]];
  const activeCubeIndex=cubeGroups.findIndex(group=>group.includes(selected));
  const isReviewed=reviewed.includes(selected);
  const toggleReviewed=()=>setReviewed(current=>isReviewed?current.filter(index=>index!==selected):[...current,selected]);
  return <div className="content-grid architecture-grid">
    <div className="architecture-explorer">
      <div className="architecture-guide"><Pill>INTERACTIVE WALKTHROUGH</Pill><span>{reviewed.length}/{architectureLayers.length} layers reviewed</span><p>Select a layer in the list or diagram to inspect its design notes and workshop prompt.</p></div>
      <div className="layer-list">{architectureLayers.map((x,i)=><motion.button key={x.name} whileHover={{x:3}} aria-pressed={selected===i} className={`layer-row ${selected===i?'active':''} ${reviewed.includes(i)?'reviewed':''}`} onClick={()=>setSelected(i)}><span>{String(i+1).padStart(2,'0')}</span><b>{x.name}</b><small>{x.detail}</small>{reviewed.includes(i)?<Check size={14}/>:<ChevronRight size={15}/>}</motion.button>)}</div>
    </div>
    <Card className="architecture-detail"><div className="architecture-art"><div className="architecture-glow"/><div className="stack-cube"><div className="cube-label">ENTERPRISE<br/>AGENTIC AI</div>{['EXPERIENCE','API + ORCHESTRATION','AGENTS + MODELS','DATA + TOOLS','TRUST PLANE'].map((label,i)=><button type="button" key={label} aria-label={`Inspect ${label.toLowerCase()} architecture layer`} className={`cube-layer cube-${i+1} ${activeCubeIndex===i?'active':''}`} onClick={()=>setSelected(cubeGroups[i][0])}>{label}</button>)}</div><div className="floating-node n1">◉ POLICY</div><div className="floating-node n2">⌁ TELEMETRY</div></div>
      <AnimatePresence mode="wait"><motion.div className="layer-info" key={item.name} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}}><div className="layer-info-heading"><Pill>{String(selected+1).padStart(2,'0')} / 10 · LAYER</Pill><span>{reviewed.length} reviewed</span></div><h3>{item.name}</h3><p>{item.detail}</p><div className="info-columns"><div><span>TECHNOLOGY OPTIONS</span><b>{item.tech}</b></div><div><span>SECURITY REQUIREMENTS</span><b>{item.security}</b></div></div><div className="workshop-prompt"><span>WORKSHOP PROMPT</span><p>{item.prompt}</p></div><div className="layer-actions"><button type="button" className={isReviewed?'reviewed':''} onClick={toggleReviewed}>{isReviewed?<><Check size={13}/> Reviewed</>:'Mark reviewed'}</button><button type="button" onClick={()=>setSelected((selected+1)%architectureLayers.length)}>Next layer <ArrowRight size={13}/></button></div></motion.div></AnimatePresence>
    </Card>
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
  const [provider,setProvider]=useState('AWS');const [selected,setSelected]=useState(4);
  const narrative=['Edge entry and filtering','API boundary / rate limits','Private network isolation','Resilient traffic routing','Containerized agent services','Managed / hosted foundation models','Durable business and knowledge data','Permission-aware retrieval store','Asynchronous events and queues','Identity, keys and secrets','Metrics, logs, traces and alerting'];
  return <div className="cloud-layout"><div className="cloud-controls"><Pill>REFERENCE MAPPING</Pill><div className="toggle-group">{Object.keys(cloudServices).map(x=><button className={provider===x?'active':''} onClick={()=>{setProvider(x);setSelected(4)}} key={x}>{x}</button>)}</div><p className="small muted">Illustrative service mapping—not a prescribed landing zone. Select a service to inspect.</p><div className="cloud-callout"><Shield size={17}/><span>Private-by-default paths<br/><b>identity · network · encryption</b></span></div><div className="cloud-callout"><LockKeyhole size={17}/><span>Production essentials<br/><b>recovery · audit · cost limits</b></span></div></div><div className="cloud-map"><div className="vpc-label"><span>{provider} · VPC / VNet / VPC NETWORK</span><span>PRIVATE SUBNETS</span></div><div className="service-grid">{cloudServices[provider].map((x,i)=><button key={x} className={`service-node ${selected===i?'active':''}`} onClick={()=>setSelected(i)}><i>{['◉','⌘','▦','⇄','▣','✧','◫','⌕','⇢','◇','⌁'][i]}</i><span>{x}</span></button>)}</div><div className="service-description"><Pill>{provider} REFERENCE</Pill><p><b>{cloudServices[provider][selected]}</b> — {narrative[selected]}. Apply availability zones, least privilege and service-specific recovery objectives as appropriate.</p></div></div></div>;
}

function Security() {
  const [active,setActive]=useState(0);
  const [filter,setFilter]=useState('All');
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
    <Card className="control-explorer"><div className="card-title-row"><div><Pill>THREAT → SECURITY CONTROL → TECHNOLOGY → EVIDENCE</Pill><h3>Interactive security control matrix</h3></div><div className="toggle-group compact">{groups.map(group=><button type="button" key={group} onClick={()=>setFilter(group)} className={filter===group?'active':''}>{group}</button>)}</div></div>
      <div className="security-matrix-scroll"><table className="security-matrix" aria-label="Threat, security control, technology, and validation evidence"><thead><tr><th scope="col">Threat</th><th scope="col">Security control</th><th scope="col">Technology</th><th scope="col">Validation evidence</th></tr></thead><tbody>{grouped.map(control=><tr key={control.id} tabIndex={0} aria-selected={activeId===control.id} className={activeId===control.id?'active':''} onClick={()=>setActive(control.id)} onKeyDown={event=>selectRowOnKey(event,control.id)}><th scope="row">{control.threat}</th><td>{control.securityControl}</td><td>{control.technology}</td><td>{control.validationEvidence}</td></tr>)}</tbody></table></div>
      <p className="security-matrix-hint" aria-live="polite">{grouped.length} threat patterns shown · Select or focus a row to highlight the complete control path.</p>
      <div className="vendor-note"><b>Platform note:</b> Vendor examples are illustrative; verify current capabilities, scope, and licensing. Microsegmentation complements—but does not replace—application-level guardrails and authorization.</div>
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

function FinOps() {
  const [volume,setVolume]=useState(50000);
  const [inTokens,setIn]=useState(2600);
  const [outTokens,setOut]=useState(650);
  const [inputPrice,setInputPrice]=useState(4);
  const [outputPrice,setOutputPrice]=useState(12);
  const [successRate,setSuccessRate]=useState(92);
  const [embeddingCostPerTask,setEmbeddingCostPerTask]=useState(.00003);
  const [vectorDatabase,setVectorDatabase]=useState(420);
  const [infrastructure,setInfrastructure]=useState(780);
  const [network,setNetwork]=useState(140);
  const [logging,setLogging]=useState(230);
  const [security,setSecurity]=useState(320);
  const [reviewRate,setReviewRate]=useState(8);
  const [reviewCost,setReviewCost]=useState(.42);
  const [support,setSupport]=useState(600);
  const inputCost=volume*inTokens*inputPrice/1000000;
  const outputCost=volume*outTokens*outputPrice/1000000;
  const embeddingCost=volume*embeddingCostPerTask;
  const humanReviewCost=volume*(reviewRate/100)*reviewCost;
  const categories=[
    {name:'Model input tokens',value:inputCost},
    {name:'Model output tokens',value:outputCost},
    {name:'Embedding costs',value:embeddingCost},
    {name:'Vector database',value:vectorDatabase},
    {name:'Infrastructure',value:infrastructure},
    {name:'Network',value:network},
    {name:'Logging and monitoring',value:logging},
    {name:'Security platforms',value:security},
    {name:'Human review',value:humanReviewCost},
    {name:'Support and operations',value:support}
  ];
  const total=categories.reduce((sum,category)=>sum+category.value,0);
  const costPerSuccessfulTask=total/(volume*successRate/100);
  const costField=(label,value,setter,step)=> <label className="cost-assumption-field" key={label}><span>{label}</span><input type="number" min="0" step={step} value={value} onChange={event=>setter(Math.max(0,Number(event.target.value)))}/></label>;
  const optimizationLevers=[
    ['Model routing','Send each task to the lowest-cost model that meets its quality, latency, privacy, and risk requirements.'],
    ['Smaller model selection','Benchmark smaller models on representative tasks; promote them only when quality and safety gates pass.'],
    ['Prompt optimization','Remove redundant instructions and examples, then regression-test for quality before release.'],
    ['Context trimming','Send only relevant, permission-checked context and cap unnecessary conversation history.'],
    ['Caching','Reuse stable prompt prefixes and eligible results; respect freshness, tenant, and authorization boundaries.'],
    ['Batching','Batch embedding and non-urgent work where provider limits and latency targets allow.'],
    ['Retrieval optimization','Tune chunking, filters, top-k, and reranking to reduce irrelevant context and repeat retrieval.'],
    ['Token budgeting','Set input/output limits per task, alert on budget drift, and stop work before limits are exhausted.'],
    ['Agent loop prevention','Apply step, tool-call, and time limits; detect repeated states and stop unproductive loops.'],
    ['Cost per successful task','Divide total operating spend by successfully completed tasks; track quality so cheaper failures do not look like savings.']
  ];
  return <div className="finops-layout">
    <div className="calculator-layout">
      <Card className="calculator-inputs">
        <div className="card-title-row"><div><Pill>CHANGE THE ASSUMPTIONS</Pill><h3>Monthly operating model</h3></div><span className="assumption-badge">CONFIGURABLE · USD</span></div>
        <Range label="Transactions / month" value={volume} min={5000} max={250000} step={5000} onChange={setVolume}/>
        <Range label="Model input tokens / task" value={inTokens} min={500} max={10000} step={100} onChange={setIn}/>
        <Range label="Model output tokens / task" value={outTokens} min={100} max={3000} step={50} onChange={setOut}/>
        <Range label="Model input price / 1M tokens" value={inputPrice} min={1} max={30} step={1} onChange={setInputPrice} prefix="$"/>
        <Range label="Model output price / 1M tokens" value={outputPrice} min={1} max={60} step={1} onChange={setOutputPrice} prefix="$"/>
        <Range label="Successful task rate" value={successRate} min={50} max={100} step={1} onChange={setSuccessRate} suffix="%"/>
        <div className="cost-assumptions">
          <b className="cost-assumptions-heading">Additional monthly cost assumptions</b>
          {costField('Embedding cost / task ($)',embeddingCostPerTask,setEmbeddingCostPerTask,.00001)}
          {costField('Vector database / month ($)',vectorDatabase,setVectorDatabase,50)}
          {costField('Infrastructure / month ($)',infrastructure,setInfrastructure,50)}
          {costField('Network / month ($)',network,setNetwork,25)}
          {costField('Logging & monitoring / month ($)',logging,setLogging,25)}
          {costField('Security platforms / month ($)',security,setSecurity,25)}
          {costField('Human review rate (%)',reviewRate,setReviewRate,1)}
          {costField('Cost per human review ($)',reviewCost,setReviewCost,.05)}
          {costField('Support & operations / month ($)',support,setSupport,25)}
        </div>
        <p className="tiny muted">Illustrative assumptions only—not vendor quotations. Replace them with measured usage and procurement rates.</p>
      </Card>
      <Card className="cost-result">
        <Pill>ESTIMATED MONTHLY COST</Pill>
        <div className="cost-total">{money(total)}<small>{moneyPrecise(costPerSuccessfulTask)} / successful task · {moneyPrecise(total/volume)} / attempt</small></div>
        <p className="cost-success-definition">Cost per successful task = monthly operating cost ÷ successful tasks.</p>
        <div className="cost-bars">{categories.map(category=><div key={category.name}><span>{category.name}</span><b>{money(category.value)}</b><i><em style={{width:`${Math.max(3,category.value/total*100)}%`}}/></i></div>)}</div>
      </Card>
    </div>
    <Card className="finops-playbook">
      <div className="card-title-row"><div><Pill>OPTIMIZATION PLAYBOOK</Pill><h3>Reduce unit cost without trading away quality.</h3></div></div>
      <div className="finops-playbook-grid">{optimizationLevers.map(([title,description])=><div className="finops-lever" key={title}><b>{title}</b><p>{description}</p></div>)}</div>
    </Card>
  </div>;
}

function ROI() {
  const [volume,setVol]=useState(18000),[current,setCurrent]=useState(24),[future,setFuture]=useState(10),[hourly,setHourly]=useState(42),[aiCost,setAi]=useState(6000),[investment,setInvestment]=useState(180000);
  const currentCost=volume*current/60*hourly;const futureCost=volume*future/60*hourly+aiCost;const savings=currentCost-futureCost;const annual=savings*12;const payback=savings>0?investment/savings:0;const roi=investment?((annual-investment)/investment)*100:0;const tco=investment+aiCost*36;
  return <div className="roi-layout">
    <Card className="roi-inputs">
      <div className="card-title-row"><div><Pill>ILLUSTRATIVE BUSINESS CASE</Pill><h3>Change the baseline.</h3></div><RotateCcw size={15} onClick={()=>{setVol(18000);setCurrent(24);setFuture(10);setHourly(42);setAi(6000);setInvestment(180000)}}/></div>
      <Range label="Monthly transaction volume" value={volume} min={1000} max={100000} step={1000} onChange={setVol}/>
      <Range label="Current minutes / transaction" value={current} min={5} max={90} onChange={setCurrent}/>
      <Range label="Future human minutes / transaction" value={future} min={0} max={60} onChange={setFuture}/>
      <Range label="Loaded hourly cost" value={hourly} min={20} max={150} onChange={setHourly} prefix="$"/>
      <Range label="AI operating cost / month" value={aiCost} min={500} max={50000} step={500} onChange={setAi} prefix="$"/>
      <Range label="One-time implementation investment" value={investment} min={25000} max={1000000} step={25000} onChange={setInvestment} prefix="$"/>
    </Card>
    <div className="roi-results">
      <div className="roi-hero"><span>NET MONTHLY BENEFIT · ESTIMATE</span><strong>{money(savings)}</strong><small>Capacity and cost estimate; validate which portion is cashable.</small></div>
      <div className="roi-kpis">
        <Metric label="Current labor baseline" value={money(currentCost)}/>
        <Metric label="Future cost incl. AI" value={money(futureCost)}/>
        <Metric label="Annualized benefit" value={money(annual)}/>
        <Metric label="Payback" value={savings>0?`${payback.toFixed(1)} mo`:'—'}/>
        <Metric label="3-year TCO" value={money(tco)}/>
        <Metric label="Year 1 ROI" value={`${roi.toFixed(0)}%`}/>
      </div>
      <Card className="value-mix">
        <div><Pill tone="violet">VALUE REALIZATION</Pill><p>Track outcomes separately</p></div>
        {[
          ['Cash savings','Prove reduced spend'],
          ['Capacity released','Redeploy hours to priority work'],
          ['Cost avoidance','Avoid future operating expense'],
          ['Revenue uplift','Measure incremental conversion'],
          ['Risk reduction','Track incidents and loss avoided']
        ].map(x=><div key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></div>)}
      </Card>
    </div>
    <Card className="roi-business-case">
      <div className="card-title-row"><div><Pill>ENTERPRISE BUSINESS CASE</Pill><h3>ROI formula and value drivers</h3></div></div>
      <div className="roi-business-case-grid">
        <section>
          <h4>ROI formula</h4>
          <p className="roi-formula">ROI (%) = ((Benefits - Costs) / Costs) × 100</p>
        </section>
        <section>
          <h4>Benefits</h4>
          <ul>
            <li>Reduced manual processing cost.</li>
            <li>Reduced turnaround time.</li>
            <li>Increased processing capacity.</li>
            <li>Lower error and rework rates.</li>
            <li>Better customer experience.</li>
            <li>Increased revenue or conversion where demonstrable.</li>
          </ul>
        </section>
        <section>
          <h4>Costs</h4>
          <ul>
            <li>One-time implementation investment.</li>
            <li>Future human processing and review costs.</li>
            <li>Ongoing AI operating costs.</li>
          </ul>
        </section>
      </div>
      <p className="roi-business-case-note"><b>Note:</b> Calculate payback period, net present value (NPV), and total cost of ownership (TCO) over three years rather than relying only on monthly token savings.</p>
    </Card>
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

const pageMap={1:Vision,2:Discovery,3:Decision,4:Architecture,5:Framework,6:RAG,7:Lifecycle,8:Cloud,9:Security,10:Governance,11:Delivery,12:Monitoring,13:FinOps,14:ROI,15:UseCases,16:Roadmap,17:OperatingModel,18:Executive};
export default function SlideContent({slide,demoRunToken=0,demoStopToken=0,onDiscoveryDemoComplete,onNavigate}) {
  if(slide===0)return <Vision onNavigate={onNavigate}/>;
  if(slide===1)return <Discovery demoRunToken={demoRunToken} demoStopToken={demoStopToken} onDemoComplete={onDiscoveryDemoComplete}/>;
  const Component=pageMap[slide+1];
  return <Component/>;
}
