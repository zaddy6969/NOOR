"use client";

import { useEffect, useState } from "react";

export default function StepLearningMode({ steps, storageKey, label }: { steps: string[][]; storageKey: string; label: string }) {
  const [current, setCurrent] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = Number(window.localStorage.getItem(storageKey));
      if (Number.isInteger(saved) && saved >= 0 && saved < steps.length) setCurrent(saved);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [steps.length, storageKey]);

  const select = (index: number) => {
    const next = Math.max(0, Math.min(steps.length - 1, index));
    setCurrent(next);
    window.localStorage.setItem(storageKey, String(next));
  };

  if (showAll) {
    return <div className="step-learning-mode is-all"><div className="step-mode-toolbar"><div><span>{label.toUpperCase()}</span><strong>All {steps.length} steps</strong></div><button type="button" onClick={() => setShowAll(false)}>Use step mode</button></div><div className="step-list">{steps.map(([number, title, copy], index) => <article className={index <= current ? "is-complete" : ""} key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div>;
  }

  const [number, title, copy] = steps[current];
  return <section className="step-learning-mode" aria-label={`${label} step-by-step mode`}>
    <div className="step-mode-toolbar"><div><span>{label.toUpperCase()}</span><strong>Step {current + 1} of {steps.length}</strong></div><button type="button" onClick={() => setShowAll(true)}>Show all steps</button></div>
    <article className="active-learning-step"><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>
    <div className="step-mode-progress"><i style={{ width: `${((current + 1) / steps.length) * 100}%` }} /><span>{Math.round(((current + 1) / steps.length) * 100)}% complete</span></div>
    <nav aria-label={`${label} step controls`}><button type="button" onClick={() => select(current - 1)} disabled={current === 0}>← Previous</button><button type="button" onClick={() => select(current + 1)} disabled={current === steps.length - 1}>{current === steps.length - 1 ? "Completed" : "Next step →"}</button></nav>
  </section>;
}
