"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { FlightState } from "./SpaceScene";
import { projects } from "../lib/content";

const SpaceScene = dynamic(() => import("./SpaceScene"), { ssr: false });
const chapters = [
  { label: "Orbit", title: "A different", italic: "dimension.", text: "A little depth. A change of perspective. This is what happens when curiosity gets a canvas.", number: "01 / INTO THE UNEXPECTED" },
  { label: "Frames", title: "Ideas deserve", italic: "some space.", text: "Real projects. Different worlds. Built with the same care for the details you can see, and the ones you can feel.", number: "02 / FROM A THOUGHT TO A SCREEN" },
  { label: "Play", title: "Let curiosity", italic: "take over.", text: "Move things. Break the pattern. Make something unexpected. There’s a whole playground waiting on the other side.", number: "03 / THE BEST PART IS YOURS" },
] as const;

export default function CinematicJourney({ motion }: { motion: boolean }) {
  const root = useRef<HTMLElement>(null);
  const flight = useRef<FlightState>({ progress: 0, x: 0, y: 0, boost: 0 });
  const refresh = useRef<(() => void) | null>(null);
  const [chapter, setChapter] = useState(0);
  const [activated, setActivated] = useState(false);
  const [warps, setWarps] = useState(0);
  const [accent, setAccent] = useState("Jade");
  const current = chapters[chapter];

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setActivated(true); observer.disconnect(); } }, { rootMargin: "500px" });
    observer.observe(node); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const node = root.current;
    if (!node || !motion) return;
    let frame = 0;
    function update() {
      frame = 0; if (!node) return;
      const rect = node.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      flight.current.progress = progress;
      node.style.setProperty("--flight-p", progress.toFixed(4));
      const next = Math.min(2, Math.floor(progress * 3));
      setChapter(value => value === next ? value : next);
      refresh.current?.();
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule, { passive: true }); update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [motion]);

  function goTo(index: number) {
    const node = root.current;
    if (motion && node) {
      const travel = Math.max(1, node.offsetHeight - window.innerHeight);
      window.scrollTo({ top: window.scrollY + node.getBoundingClientRect().top + travel * ((index + 0.4) / 3), behavior: "smooth" });
    } else {
      setChapter(index); flight.current.progress = index / 2;
      node?.style.setProperty("--flight-p", String(index / 2)); refresh.current?.();
    }
  }
  function track(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    flight.current.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    flight.current.y = (event.clientY - rect.top) / rect.height * 2 - 1;
    refresh.current?.();
  }
  function warp() { flight.current.boost += 1; setWarps(value => value + 1); refresh.current?.(); }
  function rotate(event: KeyboardEvent<HTMLButtonElement>) {
    if (!event.key.startsWith("Arrow")) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") flight.current.x = Math.max(-1, flight.current.x - 0.2);
    if (event.key === "ArrowRight") flight.current.x = Math.min(1, flight.current.x + 0.2);
    if (event.key === "ArrowUp") flight.current.y = Math.max(-1, flight.current.y - 0.2);
    if (event.key === "ArrowDown") flight.current.y = Math.min(1, flight.current.y + 0.2);
    refresh.current?.();
  }
  return (
    <section ref={root} id="play" className={"cinematic-journey" + (motion ? " cj-scroll-driven" : "")} data-chapter={chapter} data-accent={accent} aria-labelledby="cinematic-title">
      <div className="cj-sticky">
        <div className="cj-space-art">{activated && <SpaceScene motion={motion} flight={flight} refresh={refresh} />}</div>
        <button type="button" className="cj-flight-touch" aria-label="Explore the orbital scene; click or press Enter to warp, arrow keys to look around" onPointerMove={track} onPointerLeave={() => { flight.current.x = 0; flight.current.y = 0; refresh.current?.(); }} onClick={warp} onKeyDown={rotate} />
        <div className="cj-shade" aria-hidden="true" />
        <div className="cj-heading page-width"><span>JOEL SOYEMI / THE EXPLORATION ROOM</span><span>SCROLL A LITTLE FURTHER <i />↓</span></div>
        <div className="cj-copy page-width"><span className="cj-kicker">{current.number}</span><h2 id="cinematic-title">{current.title}<br /><em>{current.italic}</em></h2><p>{current.text}</p>{chapter === 2 ? <a href="#play-experiments" className="cj-next">Open the playground <span aria-hidden="true">↗</span></a> : <span className="cj-scroll-hint">{motion ? "KEEP SCROLLING. THERE’S MORE TO THIS." : "CHOOSE A CHAPTER BELOW."}</span>}</div>
        <div className="cj-project-gallery" aria-hidden={chapter !== 1}>
          {projects.map((project, index) => <a key={project.name} className={"cj-project-frame cj-frame-" + index} href={project.site} target="_blank" rel="noreferrer" tabIndex={chapter === 1 ? 0 : -1} aria-label={"Open " + project.name + ", opens in a new tab"}><div className="cj-frame-bar"><span>•••</span><span>{new URL(project.site).hostname}</span><span>↗</span></div><Image src={project.preview} alt={project.name + " website preview"} width={1348} height={926} sizes="(max-width: 600px) 68vw, 35vw" loading="lazy" /><span className="cj-frame-label">{project.name}</span></a>)}
        </div>
        <div className="cj-giant-word" aria-hidden="true">{chapter === 1 ? "CREATE" : chapter === 2 ? "EXPLORE" : "BEYOND"}</div>
        <div className="cj-bottom page-width">
          <div className="cj-chapters" role="group" aria-label="Cinematic journey chapter">{chapters.map((item, index) => <button type="button" key={item.label} aria-pressed={chapter === index} aria-label={"Explore " + item.label + " chapter"} onClick={() => goTo(index)}><span>0{index + 1}</span>{item.label}<i /></button>)}</div>
          <div className="cj-scene-controls"><div role="group" aria-label="Orbital lighting"><button type="button" aria-pressed={accent === "Jade"} onClick={() => setAccent("Jade")}>Jade</button><button type="button" aria-pressed={accent === "Amber"} onClick={() => setAccent("Amber")}>Amber</button></div><button type="button" onClick={warp} className="cj-warp">Warp <span aria-hidden="true">✳</span></button><span className="cj-warp-count" role="status">{warps ? String(warps).padStart(2, "0") + " JUMPS" : "YOUR SMALL ESCAPE"}</span></div>
        </div>
      </div>
    </section>
  );
}
