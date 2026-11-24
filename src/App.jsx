import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Command, Leaf, Maximize, Menu, Minimize, Moon, Play, Presentation, Scale, Search, Square, ThumbsDown, ThumbsUp, Sun, Trees, X } from 'lucide-react';
import { slides } from './data/strategy.js';
import { searchStrategy } from './data/search.js';
import SlideContent from './components/SlideContent.jsx';

const iconMap = {
  Sparkles: '✦', Compass: '⌖', GitBranch: '⑂', Network: '◈', Layers3: '▤', Database: '▦', Workflow: '⌁',
  Cloud: '☁', ShieldCheck: '⬡', Scale: '⚖', GitPullRequest: '⑃', Activity: '⌁', Gauge: '◉',
  TrendingUp: '↗', BriefcaseBusiness: '▣', Milestone: '⌑', UsersRound: '◉', CircleCheck: '✓'
};
const walkthroughTargets = 'button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), tr[tabindex="0"]';

export default function App() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState('forest');
  const [isPresentationPlaying, setIsPresentationPlaying] = useState(false);
  const [isDiscoveryDemoPlaying, setIsDiscoveryDemoPlaying] = useState(false);
  const [walkthroughProgress, setWalkthroughProgress] = useState(null);
  const [discoveryDemoRunToken, setDiscoveryDemoRunToken] = useState(0);
  const [discoveryDemoStopToken, setDiscoveryDemoStopToken] = useState(0);
  const searchInputRef = useRef(null);
  const navigate = useCallback((index) => {
    const next=Math.min(slides.length - 1, Math.max(0, index));
    setActive(next);
    if(next!==1){
      setIsDiscoveryDemoPlaying(false);
      setDiscoveryDemoRunToken(0);
      setDiscoveryDemoStopToken(0);
    }
  }, []);
  const onDiscoveryDemoComplete=useCallback(()=>setIsDiscoveryDemoPlaying(false), []);
  const searchResults = useMemo(() => searchStrategy(searchQuery), [searchQuery]);
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch { setIsFullscreen(!isFullscreen); }
  };
  useEffect(() => {
    const keys = e => {
      const target = e.target;
      const editing = target instanceof HTMLElement &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);
      if (e.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setMenuOpen(false);
        setSearchOpen(open => !open);
        return;
      }
      if (e.key === 'f' || e.key === 'F') { if (!e.metaKey && !e.ctrlKey) toggleFullscreen(); return; }
      if (menuOpen || searchOpen || (editing && ['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key))) return;
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); navigate(active + 1); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); navigate(active - 1); }
      if (e.key === 'Home') navigate(0);
      if (e.key === 'End') navigate(slides.length - 1);
    };
    const fs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener('keydown', keys);
    document.addEventListener('fullscreenchange', fs);
    return () => { window.removeEventListener('keydown', keys); document.removeEventListener('fullscreenchange', fs); };
  }, [active, menuOpen, searchOpen, isFullscreen, navigate]);
  useEffect(() => {
    if (!searchOpen) return undefined;
    const timer = window.setTimeout(() => searchInputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);
  useEffect(() => {
    if (!isPresentationPlaying || menuOpen || searchOpen) return undefined;
    let timer;
    let currentTarget;
    let currentRangeField;
    let cancelled = false;
    let slideContent;
    const visitedNodes = new WeakSet();
    const visitedKeys = new Set();
    const clearHighlight = () => {
      currentTarget?.classList.remove('guided-play-target');
      currentRangeField?.classList.remove('guided-play-target');
      currentTarget = null;
      currentRangeField = null;
    };
    const targetKey = element => {
      const rangeLabel=element.matches('input[type="range"]')
        ?element.closest('.range-field')?.querySelector('span')?.childNodes[0]?.textContent
        :null;
      const label=rangeLabel
        ||element.getAttribute('aria-label')
        ||element.labels?.[0]?.textContent
        ||element.querySelector?.('th')?.textContent
        ||element.innerText
        ||element.id
        ||element.getAttribute('placeholder')
        ||element.tagName;
      const scope=element.closest('.decision-question,.metric-grid,.toggle-group,.control-table,.security-matrix,.layer-list,.service-grid,.framework-table,.lifecycle-track,.rag-playbook-tabs,.delivery-pipeline,.roadmap-rail,.usecase-list,.card')?.className||'';
      return `${element.tagName}|${scope}|${label.replace(/\s+/g,' ').trim()}`;
    };
    const canActivate=element=>!(element instanceof HTMLButtonElement
      &&((element.type==='submit'&&element.form)||element.type==='reset'||element.matches('.secondary-button,.journey-stage,[aria-label="Play grounded knowledge flow"],[aria-label="Stop grounded knowledge flow"]')));
    const activateTarget=element=>{
      if(element instanceof HTMLButtonElement||element instanceof HTMLTableRowElement){
        element.click();
        return;
      }
      if(element instanceof HTMLInputElement&&element.type==='range'){
        const stepValue=Number(element.step);
        const step=Number.isFinite(stepValue)&&stepValue>0?stepValue:1;
        const min=element.min===''?0:Number(element.min);
        const max=element.max===''?100:Number(element.max);
        const precision=String(step).split('.')[1]?.length||0;
        const next=Number((Number(element.value)+step>max?min:Number(element.value)+step).toFixed(precision));
        const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
        if(!setter)return;
        setter.call(element,String(next));
        element.dispatchEvent(new Event('input',{bubbles:true}));
        element.dispatchEvent(new Event('change',{bubbles:true}));
        return;
      }
      if(element instanceof HTMLInputElement&&(element.type==='checkbox'||element.type==='radio')){
        element.click();
        return;
      }
      if(element instanceof HTMLSelectElement&&element.options.length>1){
        const options=Array.from(element.options).filter(option=>!option.disabled);
        if(options.length<2)return;
        const current=options.findIndex(option=>option.value===element.value);
        const next=options[(current+1)%options.length];
        const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value')?.set;
        if(!setter)return;
        setter.call(element,next.value);
        element.dispatchEvent(new Event('change',{bubbles:true}));
      }
    };
    const visibleTargets=()=>Array.from(slideContent.querySelectorAll(walkthroughTargets)).filter(element=>{
      const style=window.getComputedStyle(element);
      const bounds=element.getBoundingClientRect();
      return canActivate(element)
        &&style.display!=='none'
        &&style.visibility!=='hidden'
        &&bounds.width>0
        &&bounds.height>0
        &&!element.closest('[aria-hidden="true"]');
    });
    const finishSlide=()=>{
      const completion=active===2
        ?{form:'.score-card form',result:'.score-result',label:'Decision recommendation'}
        :active===5
          ?{form:'.retrieval-card form',result:'.retrieved, .rag-no-match, .rag-query-error',label:'Grounded sample answer'}
          :null;
      if(completion&&slideContent){
        slideContent.querySelector(completion.form)?.requestSubmit();
        currentTarget=slideContent.querySelector(completion.result);
        currentTarget?.classList.add('guided-play-target');
        currentTarget?.scrollIntoView({
          behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',
          block:'center',
          inline:'nearest'
        });
        setWalkthroughProgress({
          section:active+1,
          index:visitedKeys.size+1,
          total:visitedKeys.size+1,
          label:completion.label
        });
        timer=window.setTimeout(()=>{
          clearHighlight();
          setWalkthroughProgress(null);
          if(active>=slides.length-1)setIsPresentationPlaying(false);
          else navigate(active+1);
        },1500);
        return;
      }
      setWalkthroughProgress(null);
      timer=window.setTimeout(()=>{
        if(active>=slides.length-1)setIsPresentationPlaying(false);
        else navigate(active+1);
      },650);
    };
    const walkSlide=()=>{
      if (cancelled) return;
      const pending=visibleTargets().find(element=>!visitedNodes.has(element)&&!visitedKeys.has(targetKey(element)));
      if(!pending){
        finishSlide();
        return;
      }
      currentTarget=pending;
      const key=targetKey(currentTarget);
      visitedNodes.add(currentTarget);
      visitedKeys.add(key);
      const label=currentTarget.getAttribute('aria-label')
        ||currentTarget.labels?.[0]?.textContent
        ||currentTarget.querySelector?.('th')?.textContent
        ||currentTarget.innerText
        ||currentTarget.getAttribute('placeholder')
        ||currentTarget.value
        ||'Interactive field';
      const remaining=visibleTargets().filter(element=>!visitedNodes.has(element)&&!visitedKeys.has(targetKey(element))).length;
      setWalkthroughProgress({
        section: active + 1,
        index: visitedKeys.size,
        total: visitedKeys.size+remaining,
        label: label.replace(/\s+/g, ' ').trim().slice(0, 42)
      });
      currentTarget.classList.add('guided-play-target');
      if (currentTarget.matches('input[type="range"]')) {
        currentRangeField = currentTarget.closest('.range-field');
        currentRangeField?.classList.add('guided-play-target');
      }
      currentTarget.focus({ preventScroll: true });
      currentTarget.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center',
        inline: 'nearest'
      });
      activateTarget(currentTarget);
      timer = window.setTimeout(() => {
        clearHighlight();
        walkSlide();
      }, 850);
    };
    const startWalkthrough = () => {
      if (cancelled) return;
      slideContent = document.querySelector(`.slide-article[data-slide-index="${active}"] .slide-content`);
      if (!slideContent) {
        timer = window.setTimeout(startWalkthrough, 50);
        return;
      }
      walkSlide();
    };
    timer = window.setTimeout(startWalkthrough, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      clearHighlight();
    };
  }, [active, isPresentationPlaying, menuOpen, navigate, searchOpen]);
  const startPlayback=()=>{
    if(active===0||active===1){
      if(active===0)navigate(1);
      setIsPresentationPlaying(false);
      setIsDiscoveryDemoPlaying(true);
      setDiscoveryDemoRunToken(token=>token+1);
      return;
    }
    setIsPresentationPlaying(true);
  };
  const stopPlayback=()=>{
    if(isDiscoveryDemoPlaying){
      setIsDiscoveryDemoPlaying(false);
      setDiscoveryDemoStopToken(discoveryDemoRunToken);
      return;
    }
    setIsPresentationPlaying(false);
    setWalkthroughProgress(null);
  };
  const slide = slides[active];
  const playbackRunning=isDiscoveryDemoPlaying||isPresentationPlaying;
  const playbackStatus=active<=1
    ?isDiscoveryDemoPlaying?'Running positive + negative tests · staying on Discovery':isPresentationPlaying?'Auto-playing · 8 sec / section':'Play to preview Discovery examples'
    :isPresentationPlaying
      ?walkthroughProgress?`Section ${String(walkthroughProgress.section).padStart(2,'0')} · Field ${walkthroughProgress.index}/${walkthroughProgress.total}: ${walkthroughProgress.label}`:'Preparing guided walkthrough'
      :active===slides.length-1?'Play to build the executive summary':'Play to guide every field · Discovery → Executive';
  const playButtonLabel=active<=1?'Play Discovery examples':active===slides.length-1?'Play Executive summary':'Play presentation from Discovery to Executive';
  const stopButtonLabel=isDiscoveryDemoPlaying?'Stop Discovery test run':'Stop presentation';
  const nextTheme=theme==='dark'?'light':theme==='light'?'sage':theme==='sage'?'forest':'dark';
  const themeIcon=theme==='dark'?<Sun size={17}/>:theme==='light'?<Leaf size={17}/>:theme==='sage'?<Trees size={17}/>:<Moon size={17}/>;
  return <main className="presentation-shell" data-theme={theme} data-appearance={theme==='dark'?'dark':'light'}>
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
    <header className="topbar">
      <button className="brand" onClick={()=>navigate(0)} aria-label="Go to title"><span className="brand-mark">A<span>✦</span></span><span className="brand-name">Agent Foundry<span>An Intelligent Enterprise AI Framework</span></span></button>
      <div className="topbar-actions"><span className="key-hint"><Command size={12}/> ← →</span><button className="icon-button" onClick={()=>setTheme(next=>next==='dark'?'light':next==='light'?'sage':next==='sage'?'forest':'dark')} aria-label={`Switch to ${nextTheme} theme`} title={`Switch to ${nextTheme} theme`}>{themeIcon}</button><button className="icon-button" onClick={()=>{setMenuOpen(false);setSearchOpen(true)}} aria-label="Search all sections" title="Search all sections (Ctrl/⌘ K)"><Search size={17}/></button><button className="icon-button" onClick={()=>setMenuOpen(true)} aria-label="Open contents"><Menu size={18}/></button><button className="icon-button" onClick={toggleFullscreen} aria-label="Toggle fullscreen">{isFullscreen?<Minimize size={17}/>:<Maximize size={17}/>}</button></div>
    </header>
    <div className="progress-track"><motion.div className="progress-value" animate={{width:`${((active+1)/slides.length)*100}%`}} transition={{duration:.35}}/></div>
    <div className="slide-meta"><span className="slide-eyebrow">{slide.eyebrow}</span><div className="presentation-playback"><span className="presentation-playback-status" aria-live="polite">{playbackStatus}</span><div className="presentation-playback-buttons"><button type="button" onClick={startPlayback} disabled={playbackRunning} aria-label={playButtonLabel} aria-pressed={playbackRunning}><Play size={12}/><span>Play</span></button><button type="button" onClick={stopPlayback} disabled={!playbackRunning} aria-label={stopButtonLabel}><Square size={11}/><span>Stop</span></button></div></div><span className="slide-count">{String(active+1).padStart(2,'0')} <i>/</i> {String(slides.length).padStart(2,'0')}</span></div>
    <section className="slide-stage" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.article className="slide-article" key={active} data-slide-index={active} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.32,ease:'easeOut'}}>
          <div className={`slide-title-row ${active===2?'decision-title-row':''}`}><div><div className="section-tag"><span>{iconMap[slide.icon]||'✦'}</span>{slide.tag}</div><h1>{slide.title}</h1><p className="slide-subtitle">{slide.subtitle}</p></div>{active===2?<nav className="decision-section-nav" aria-label="Decision guidance"><a href="#decision-pros-cons"><Scale size={15}/><span>Pros &amp; cons</span></a><a href="#decision-recommend"><ThumbsUp size={15}/><span>Recommend</span></a><a href="#decision-not-recommend"><ThumbsDown size={15}/><span>Not recommend</span></a></nav>:<div className="slide-number-watermark">{String(active+1).padStart(2,'0')}</div>}</div>
          <div className="slide-content"><SlideContent slide={active} demoRunToken={discoveryDemoRunToken} demoStopToken={discoveryDemoStopToken} onDiscoveryDemoComplete={onDiscoveryDemoComplete} onNavigate={navigate}/></div>
        </motion.article>
      </AnimatePresence>
    </section>
    <footer className="bottom-bar">
      <div className="bottom-left"><Presentation size={15}/><span>STRATEGY FRAMEWORK</span></div>
      <div className="bottom-center"><button onClick={()=>navigate(active-1)} disabled={active===0} aria-label="Previous slide"><ChevronLeft size={17}/></button><div className="mini-progress">{slides.map((_,i)=><button key={i} className={i===active?'active':''} onClick={()=>navigate(i)} aria-label={`Go to section ${i+1}`}/>)}</div><button onClick={()=>navigate(active+1)} disabled={active===slides.length-1} aria-label="Next slide"><ChevronRight size={17}/></button></div>
      <button className="contents-button" onClick={()=>setMenuOpen(true)}>CONTENTS <span>{String(active+1).padStart(2,'0')}</span></button>
    </footer>
    <AnimatePresence>
      {menuOpen&&<motion.div className="menu-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)setMenuOpen(false)}}>
        <motion.aside className="contents-panel" initial={{x:360}} animate={{x:0}} exit={{x:360}} transition={{duration:.25}}>
          <div className="contents-head"><div><span className="micro-label">PRESENTATION MAP</span><h2>Strategy journey</h2></div><button className="icon-button" onClick={()=>setMenuOpen(false)} aria-label="Close contents"><X size={18}/></button></div>
          <div className="contents-list">{slides.map((x,i)=><button key={x.title} className={i===active?'active':''} onClick={()=>{navigate(i);setMenuOpen(false)}}><span>{String(i+1).padStart(2,'0')}</span><div><b>{x.title}</b><small>{x.tag}</small></div><span className="contents-icon">{iconMap[x.icon]}</span></button>)}</div>
          <div className="contents-hint">Use ← → to navigate · F for fullscreen · Esc to close</div>
        </motion.aside>
      </motion.div>}
    </AnimatePresence>
    <AnimatePresence>
      {searchOpen&&<motion.div className="search-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)setSearchOpen(false)}}>
        <motion.section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="strategy-search-title" initial={{opacity:0,y:12,scale:.985}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:.99}} transition={{duration:.18}}>
          <div className="search-dialog-header"><div><span className="micro-label">STRATEGY KNOWLEDGE SEARCH · 18 SECTIONS</span><h2 id="strategy-search-title">Find relevant guidance</h2></div><button className="icon-button" onClick={()=>setSearchOpen(false)} aria-label="Close search"><X size={17}/></button></div>
          <label className="global-search-box"><Search size={17}/><input ref={searchInputRef} value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search: loan approval, RAG, IAM, ROI…" aria-label="Search all strategy sections" autoComplete="off"/>{searchQuery&&<button type="button" onClick={()=>setSearchQuery('')} aria-label="Clear search"><X size={14}/></button>}</label>
          {!searchQuery.trim()?<div className="search-suggestions"><span>TRY A TOPIC</span>{['Commercial lending','RAG retrieval','Prompt injection','Cloud architecture','ROI and payback','Human approval'].map(topic=><button type="button" key={topic} onClick={()=>setSearchQuery(topic)}>{topic}</button>)}</div>:<div className="search-results" aria-live="polite">
            <div className="search-results-label">{searchResults.length?`${searchResults.length} relevant result${searchResults.length===1?'':'s'}`:'No matching guidance found'}</div>
            {searchResults.map((result,index)=><button type="button" className="search-result" key={`${result.section}-${result.category}-${result.title}-${index}`} onClick={()=>{navigate(result.section);setSearchOpen(false);setSearchQuery('')}}><span className="result-section">{String(result.section+1).padStart(2,'0')}</span><span className="result-copy"><span><b>{result.title}</b><i>{result.category} · {result.sectionTitle}</i></span><small>{result.summary}</small></span><ChevronRight size={16}/></button>)}
            {!searchResults.length&&<p className="search-empty">Try a business topic, technology, control, use case, or delivery phase.</p>}
          </div>}
          <div className="search-dialog-footer">Searches curated content in this presentation only; no external service or customer data is queried. <span>Esc to close</span></div>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  </main>;
}
