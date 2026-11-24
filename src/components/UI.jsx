import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '', ...props }) {
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }} className={`card ${className}`} {...props}>{children}</motion.div>;
}
export function Pill({ children, tone = 'cyan' }) { return <span className={`pill ${tone}`}>{children}</span>; }
export function Metric({ label, value, note, color = 'cyan' }) { return <div className={`metric ${color}`}><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>; }
export function SectionHeading({ title, text, tag }) {
  return <div className="section-heading"><div>{tag && <div className="micro-label">{tag}</div>}<h2>{title}</h2><p>{text}</p></div></div>;
}
export function Range({ label, value, min, max, step = 1, onChange, suffix = '', prefix = '' }) {
  const progress = ((Number(value) - min) / (max - min)) * 100;
  return <label className="range-field"><span>{label}<b>{prefix}{Number(value).toLocaleString()}{suffix}</b></span><input type="range" min={min} max={max} step={step} value={value} style={{ '--range-progress': `${progress}%` }} onChange={e => onChange(Number(e.target.value))} /></label>;
}
