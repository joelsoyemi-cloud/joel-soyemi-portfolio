"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { morphismById } from "../lib/morphisms";

const chapters = [
  { style: "liquid", title: "Let a little", emphasis: "light in.", text: "An edge catches the light. A surface lets the world through. An interface starts to feel alive.", word: "Light", caption: "01 / GLASS, WITH FEELING" },
  { style: "clay", title: "Give pixels a", emphasis: "softer side.", text: "Round the corners. Press into the surface. The very same object takes on a different personality.", word: "Soft", caption: "02 / SOMETHING MORE TACTILE" },
  { style: "neo", title: "Then make a", emphasis: "bold move.", text: "A strong line. A little contrast. A whole new attitude. Now take the controls and make it your own.", word: "Bold", caption: "03 / A LITTLE LESS EXPECTED" },
] as const;

export default function MaterialScrollStory({ motion }: { motion: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const active = chapters[chapter];

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (!motion) return;
    let frame = 0;
    function update() {
      frame = 0;
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      const travel = Math.max(1, bounds.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -bounds.top / travel));
      node.style.setProperty("--story-p", progress.toFixed(4));
      const next = Math.min(2, Math.floor(progress * 3));
      setChapter(previous => previous === next ? previous : next);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [motion]);

  useEffect(() => {
    if (!motion) root.current?.style.setProperty("--story-p", String(chapter / 2));
  }, [motion, chapter]);

  function goTo(index: number) {
    const node = root.current;
    if (motion && node) {
      const travel = Math.max(1, node.offsetHeight - window.innerHeight);
      const top = window.scrollY + node.getBoundingClientRect().top + travel * ((index + 0.4) / 3);
      window.scrollTo({ top, behavior: "smooth" });
    } else { setChapter(index); node?.style.setProperty("--story-p", String(index / 2)); }
  }
  return (
    <div ref={root} className={"material-scroll-story" + (motion ? " is-scroll-driven" : "")} aria-label="Three materials, one scroll story" data-chapter={chapter + 1}>
      <div className="ms-story-sticky">
        <div className="ms-story-heading"><span className="eyebrow">A SMALL CHANGE OF PERSPECTIVE</span><span>{motion ? "SCROLL TO FEEL THE DIFFERENCE ↓" : "CHOOSE A CHAPTER BELOW"}</span></div>
        <div className="ms-story-main">
          <div className="ms-story-art" aria-hidden="true">
            <span className="ms-story-orbit" />
            {chapters.map((item, index) => {
              const material = morphismById(item.style);
              return <div key={item.style} className={"ms-scroll-card ms-story-card-" + index + " ms-theme-" + item.style} style={{ "--ms-bg": material.background, "--ms-ink": material.ink, "--ms-a": material.colors[0], "--ms-b": material.colors[1], "--ms-c": material.colors[2], zIndex: chapter === index ? 4 : 3 - index } as CSSProperties}>
                <div className="ms-scroll-surface"><div className="ms-story-card-top"><span>CURIOUS<br />OBJECTS™</span><span>0{index + 1} ↗</span></div><div className="ms-story-sculpture"><svg viewBox="0 0 160 160" fill="none">{Array.from({ length: 12 }, (_, line) => <ellipse key={line} cx="80" cy="80" rx="59" ry={10 + line * 4} transform={"rotate(" + line * 15 + " 80 80)"} stroke="currentColor" strokeWidth="1.2" opacity={0.3 + line / 20} />)}</svg></div><span className="ms-story-word">{item.word}<em>.</em></span><div className="ms-story-card-bottom"><span>THE MATERIAL COLLECTION</span><span>JS / 024</span></div></div>
              </div>;
            })}
          </div>
          <div className="ms-story-copy" key={chapter}><span className="ms-control-label">{active.caption}</span><h3>{active.title}<br /><em>{active.emphasis}</em></h3><p>{active.text}</p><a href="#morphism-studio">Now it’s your turn <span aria-hidden="true">↗</span></a></div>
        </div>
        <div className="ms-story-timeline" role="group" aria-label="Material story chapter">{chapters.map((item, index) => <button type="button" key={item.style} aria-pressed={chapter === index} aria-label={"Show " + item.word + " chapter"} onClick={() => goTo(index)}><span>0{index + 1}</span><span>{item.word}</span><i /></button>)}</div>
      </div>
    </div>
  );
}
