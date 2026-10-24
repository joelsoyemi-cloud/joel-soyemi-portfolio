"use client";

import { useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import MorphismField from "./MorphismField";
import { fieldBehaviors, morphismById, morphismFamilies, morphismStyles, morphShapes } from "../lib/morphisms";
import type { FieldBehavior, MorphismFamily, MorphShape } from "../lib/morphisms";

export default function MorphismStudio({ motion }: { motion: boolean }) {
  const [selected, setSelected] = useState("liquid");
  const [family, setFamily] = useState<MorphismFamily>("All styles");
  const [shape, setShape] = useState<MorphShape>("Globe");
  const [behavior, setBehavior] = useState<FieldBehavior>("Scatter");
  const [strength, setStrength] = useState(1);
  const [radius, setRadius] = useState(28);
  const [depth, setDepth] = useState(60);
  const [compare, setCompare] = useState(false);
  const [comparison, setComparison] = useState("clay");
  const [burst, setBurst] = useState(0);
  const [reset, setReset] = useState(0);
  const [edition, setEdition] = useState(1);
  const remixIndex = useRef(0);
  const style = morphismById(selected);
  const otherStyle = morphismById(comparison);
  const visibleStyles = morphismStyles.filter(item => family === "All styles" || item.family === family);
  const filterId = useId();
  const scatter = () => setBurst(value => value + 1);

  function resetStudio() {
    setSelected("liquid"); setFamily("All styles"); setShape("Globe"); setBehavior("Scatter");
    setStrength(1); setRadius(28); setDepth(60); setCompare(false); setComparison("clay");
    setBurst(0); setEdition(1); remixIndex.current = 0; setReset(value => value + 1);
  }
  function remix() {
    remixIndex.current += 1;
    const index = remixIndex.current;
    const next = morphismStyles[(index * 7 + 3) % morphismStyles.length];
    setSelected(next.id); setFamily("All styles");
    setShape(morphShapes[index % morphShapes.length]);
    setRadius(8 + (index * 13) % 39); setDepth(25 + (index * 19) % 76);
    setEdition(value => value + 1); scatter();
  }
  function familyKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target = index;
    if (event.key === "ArrowRight") target = (index + 1) % morphismFamilies.length;
    else if (event.key === "ArrowLeft") target = (index - 1 + morphismFamilies.length) % morphismFamilies.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = morphismFamilies.length - 1;
    else return;
    event.preventDefault(); setFamily(morphismFamilies[target]);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]")[target]?.focus();
  }
  const shared = { shape, behavior, strength, radius, depth, motion, burst, reset, onScatter: scatter };
  return (
    <section id="morphism-studio" className="morphism-studio" aria-labelledby="morphism-title" data-motion={motion ? "on" : "off"}>
      <div className="ms-intro">
        <div><span className="eyebrow">THE MATERIAL EXPLORER / EXPERIMENT 04</span><h3 id="morphism-title">Same object.<br /><em>24 different feelings.</em></h3></div>
        <div className="ms-intro-copy"><span className="ms-round-mark" aria-hidden="true">✳</span><p>An interface has a personality. Give this one a new surface, bend its shape, then make a little chaos.</p><a href="#morphism-styles">Explore the collection <span aria-hidden="true">↓</span></a></div>
      </div>
      <div className="ms-workbench">
        <div className="ms-toolbar"><span><i /> MORPHISM STUDIO</span><div><span className="ms-edition">EDITION {String(edition).padStart(3, "0")}</span><button type="button" aria-pressed={compare} className="ms-compare" onClick={() => setCompare(value => !value)}><span aria-hidden="true">◫</span> Compare {compare ? "on" : "styles"}</button></div></div>
        <div className={"ms-preview-grid" + (compare ? " ms-comparing" : "")}>
          <MorphismField {...shared} style={style} label="Surface A" />
          {compare && <MorphismField {...shared} style={otherStyle} label="Surface B" />}
        </div>
        <div className="ms-controls">
          <div className="ms-shape-control"><span className="ms-control-label">01 / CHANGE THE FORM</span><div className="ms-segmented" role="group" aria-label="Studio shape">{morphShapes.map(value => <button type="button" key={value} aria-pressed={shape === value} onClick={() => setShape(value)}>{value}</button>)}</div></div>
          <div><span className="ms-control-label">02 / MAKE IT RESPOND</span><div className="ms-segmented" role="group" aria-label="Studio pointer behavior">{fieldBehaviors.map(value => <button type="button" key={value} aria-pressed={behavior === value} onClick={() => setBehavior(value)}>{value}</button>)}</div></div>
          <div className="ms-sliders">
            <label><span>Force <output>{strength.toFixed(1)}×</output></span><input aria-label="Studio interaction force" type="range" min="0.3" max="2" step="0.1" value={strength} onChange={event => setStrength(Number(event.target.value))} /></label>
            <label><span>Roundness <output>{radius}px</output></span><input aria-label="Studio surface roundness" type="range" min="0" max="48" value={radius} onChange={event => setRadius(Number(event.target.value))} /></label>
            <label><span>Depth <output>{depth}%</output></span><input aria-label="Studio surface depth" type="range" min="0" max="100" value={depth} onChange={event => setDepth(Number(event.target.value))} /></label>
          </div>
          {compare && <label className="ms-compare-select"><span className="ms-control-label">COMPARE WITH / SURFACE B</span><select aria-label="Comparison style" value={comparison} onChange={event => setComparison(event.target.value)}>{morphismStyles.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
        </div>
        <div className="ms-action-bar"><p id="morphism-gesture-hint">Touch or move through the field. Enter to scatter. Arrow keys to rotate.</p><div><button type="button" className="ms-scatter" onClick={scatter}>Scatter {compare ? "both" : "the field"} <span aria-hidden="true">✳</span></button><button type="button" onClick={remix}>Remix <span aria-hidden="true">↗</span></button><button type="button" className="ms-reset" onClick={resetStudio}>Reset</button></div></div>
      </div>
      <div id="morphism-styles" className="ms-collection">
        <div className="ms-collection-heading"><div><span className="ms-control-label">A SMALL LIBRARY OF BIG PERSONALITIES</span><h4>Pick a surface. <em>Feel the difference.</em></h4></div><span className="ms-style-count">24 STYLES / 5 FAMILIES</span></div>
        <div className="ms-family-tabs" role="tablist" aria-label="Morphism style family">{morphismFamilies.map((value, index) => <button type="button" role="tab" id={filterId + "-tab-" + index} aria-controls={filterId + "-panel"} key={value} aria-selected={family === value} tabIndex={family === value ? 0 : -1} onKeyDown={event => familyKey(event, index)} onClick={() => setFamily(value)}>{value}<span>{value === "All styles" ? 24 : morphismStyles.filter(item => item.family === value).length}</span></button>)}</div>
        <div className="ms-style-grid" id={filterId + "-panel"} role="tabpanel" aria-labelledby={filterId + "-tab-" + morphismFamilies.indexOf(family)}>
          {visibleStyles.map(item => <button type="button" key={item.id} className={"ms-style-option ms-theme-" + item.id + (item.dark ? " ms-dark" : "")} aria-pressed={selected === item.id} aria-label={"Use " + item.name} onClick={() => { setSelected(item.id); setRadius(["brutal", "neo", "bauhaus", "retro"].includes(item.id) ? 4 : item.id === "clay" ? 40 : 28); }} style={{ "--ms-bg": item.background, "--ms-ink": item.ink, "--ms-a": item.colors[0], "--ms-b": item.colors[1], "--ms-c": item.colors[2] } as CSSProperties}><span className="ms-swatch" aria-hidden="true"><span className="ms-swatch-orb" /><span className="ms-swatch-card"><i /><b /><em /></span><span className="ms-swatch-selected">↗</span></span><span className="ms-option-name">{item.name}<span>{String(morphismStyles.indexOf(item) + 1).padStart(2, "0")}</span></span></button>)}
        </div>
      </div>
      <div className="ms-studio-footer"><p>A mix of UI morphisms, design movements, and experimental finishes. One curious playground.</p><span role="status" aria-live="polite">{style.name} · {shape} · {burst} scatter{burst === 1 ? "" : "s"}{compare ? " · Comparing " + otherStyle.name : ""}</span></div>
    </section>
  );
}
