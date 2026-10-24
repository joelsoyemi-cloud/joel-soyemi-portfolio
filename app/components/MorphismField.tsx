"use client";

import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { useCanvasSurface } from "./useCanvasSurface";
import type { CanvasDraw } from "./useCanvasSurface";
import type { FieldBehavior, MorphismStyle, MorphShape } from "../lib/morphisms";

const TAU = Math.PI * 2;
const COUNT = 336;
const noise = (i: number) => { const n = Math.sin(i * 127.1 + 13.7) * 43758.5453; return n - Math.floor(n); };
type Point = { x: number; y: number; z: number };

function targetPoint(shape: MorphShape, i: number, time: number): Point {
  const u = i / (COUNT - 1);
  const a = i * 2.399963;
  if (shape === "Globe") {
    const y = 1 - u * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    return { x: Math.cos(a) * ring, y, z: Math.sin(a) * ring };
  }
  if (shape === "Waves") {
    const x = (i % 28) / 27 * 2 - 1;
    const z = Math.floor(i / 28) / 11 * 2 - 1;
    return { x: x * 1.2, y: Math.sin(x * 4 + time * 1.3 + z * 2) * 0.28, z: z * 0.8 };
  }
  if (shape === "Torus") {
    const theta = (i % 28) / 28 * TAU;
    const phi = Math.floor(i / 28) / 12 * TAU;
    const ring = 0.7 + Math.cos(phi) * 0.29;
    return { x: Math.cos(theta) * ring, y: Math.sin(phi) * 0.29, z: Math.sin(theta) * ring };
  }
  if (shape === "Cube") {
    const face = Math.floor(i / 56);
    const x = (i % 8) / 7 * 1.4 - 0.7;
    const y = Math.floor((i % 56) / 8) / 6 * 1.4 - 0.7;
    if (face < 2) return { x, y, z: face ? 0.7 : -0.7 };
    if (face < 4) return { x: face === 2 ? 0.7 : -0.7, y, z: x };
    return { x, y: face === 4 ? 0.7 : -0.7, z: y };
  }
  const r = Math.sqrt(u) * (0.74 + 0.26 * Math.cos(a * 5));
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, z: Math.sin(r * 5 + time * 0.5) * 0.25 };
}

type Props = {
  style: MorphismStyle;
  shape: MorphShape;
  behavior: FieldBehavior;
  strength: number;
  radius: number;
  depth: number;
  motion: boolean;
  burst: number;
  reset: number;
  label: string;
  onScatter: () => void;
};

export default function MorphismField({ style, shape, behavior, strength, radius, depth, motion, burst, reset, label, onScatter }: Props) {
  const points = useRef<Point[]>([]);
  const clock = useRef(0);
  const blast = useRef(-100);
  const pointer = useRef({ x: 0, y: 0, active: false, down: false });
  const rotation = useRef({ x: -0.25, y: 0.25 });

  const draw = useCallback<CanvasDraw>((ctx, width, height, seconds, animating) => {
    clock.current += seconds;
    const time = clock.current;
    const size = Math.min(width * 0.36, height * 0.35);
    const cx = width / 2, cy = height * 0.48;
    ctx.fillStyle = style.background;
    ctx.fillRect(0, 0, width, height);
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.6);
    halo.addColorStop(0, style.colors[1] + "28");
    halo.addColorStop(1, style.background + "00");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, width, height);
    const yaw = rotation.current.y + time * 0.18;
    const pitch = rotation.current.x;
    const scatter = Math.exp(-Math.max(0, time - blast.current) * 2.2);
    const projected: Point[] = [];
    for (let i = 0; i < COUNT; i++) {
      const target = targetPoint(shape, i, time);
      if (!points.current[i]) points.current[i] = { ...target };
      const point = points.current[i];
      const ease = animating ? Math.min(1, seconds * 6.5) : 1;
      point.x += (target.x - point.x) * ease;
      point.y += (target.y - point.y) * ease;
      point.z += (target.z - point.z) * ease;
      const rx = point.x * Math.cos(yaw) - point.z * Math.sin(yaw);
      const rz = point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
      const ry = point.y * Math.cos(pitch) - rz * Math.sin(pitch);
      const z = point.y * Math.sin(pitch) + rz * Math.cos(pitch);
      const perspective = 1 / (1 - z * 0.23);
      let x = cx + rx * size * perspective;
      let y = cy + ry * size * perspective;
      const angle = noise(i) * TAU;
      const force = (0.3 + noise(i + 73)) * scatter * size * 1.2 * strength;
      x += Math.cos(angle) * force;
      y += Math.sin(angle) * force;
      if (pointer.current.active) {
        const dx = x - pointer.current.x, dy = y - pointer.current.y;
        const distance = Math.hypot(dx, dy) || 1;
        const push = Math.max(0, 1 - distance / (size * 0.9)) ** 2 * 100 * strength;
        if (behavior === "Attract") { x -= dx / distance * push * 0.85; y -= dy / distance * push * 0.85; }
        else if (behavior === "Vortex") { x -= dy / distance * push; y += dx / distance * push; }
        else { x += dx / distance * push; y += dy / distance * push; }
      }
      projected.push({ x, y, z });
    }
    ctx.lineWidth = 0.65;
    for (let i = 1; i < COUNT; i++) {
      const p = projected[i], previous = projected[i - 1];
      if ((style.id === "wire" || i % 3 === 0) && Math.hypot(p.x - previous.x, p.y - previous.y) < size * 0.4) {
        ctx.strokeStyle = style.colors[i % 3] + (style.id === "wire" ? "66" : "29");
        ctx.beginPath(); ctx.moveTo(previous.x, previous.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
    }
    projected.sort((a, b) => a.z - b.z);
    projected.forEach((p, i) => {
      const dot = Math.max(1, 1.5 + (p.z + 1.4) * 1.05);
      ctx.globalAlpha = Math.max(0.35, Math.min(1, 0.5 + (p.z + 1) * 0.22));
      ctx.fillStyle = style.colors[i % 3];
      ctx.shadowColor = style.colors[i % 3];
      ctx.shadowBlur = style.id === "neon" || style.id === "aurora" ? 7 : 0;
      if (style.id === "retro" || style.id === "brutal") ctx.fillRect(p.x - dot, p.y - dot, dot * 2, dot * 2);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, dot, 0, TAU); ctx.fill(); }
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }, [shape, behavior, strength, style]);
  const { canvas, redraw } = useCanvasSurface(motion, draw);

  useEffect(() => {
    blast.current = burst > 0 ? clock.current : -100;
    redraw();
  }, [burst, redraw]);
  useEffect(() => {
    rotation.current = { x: -0.25, y: 0.25 };
    pointer.current.active = false;
    pointer.current.down = false;
    redraw();
  }, [reset, redraw]);

  function track(event: PointerEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointer.current.x = event.clientX - bounds.left;
    pointer.current.y = event.clientY - bounds.top;
    pointer.current.active = true;
    const specimen = event.currentTarget.closest<HTMLElement>(".ms-specimen");
    specimen?.style.setProperty("--ms-light-x", (pointer.current.x / bounds.width * 100) + "%");
    specimen?.style.setProperty("--ms-light-y", (pointer.current.y / bounds.height * 100) + "%");
    redraw();
  }
  const vars = {
    "--ms-bg": style.background, "--ms-ink": style.ink,
    "--ms-a": style.colors[0], "--ms-b": style.colors[1], "--ms-c": style.colors[2],
    "--ms-radius": radius + "px", "--ms-shadow": (depth * 0.22) + "px",
    "--ms-depth": (depth / 100), "--ms-blur": (6 + depth * 0.18) + "px",
  } as CSSProperties;
  return (
    <article className={"ms-specimen ms-theme-" + style.id + (style.dark ? " ms-dark" : "")} style={vars} aria-label={label + ": " + style.name}>
      <div className="ms-stage-meta"><span>{label} / {style.family.toUpperCase()}</span><span>{motion ? "LIVE FIELD" : "MOTION PAUSED"}<i /></span></div>
      <div className="ms-orb ms-orb-one" aria-hidden="true" /><div className="ms-orb ms-orb-two" aria-hidden="true" />
      <div className="ms-object">
        <div className="ms-object-top"><span className="ms-object-icon" aria-hidden="true">✳</span><span>CURIOUS OBJECTS<br /><strong>BY JOEL SOYEMI</strong></span><span className="ms-object-serial">№ 024</span></div>
        <div className="ms-canvas-shell">
          <canvas ref={canvas} aria-hidden="true" />
          <button type="button" className="ms-field-touch" aria-label={"Scatter and rotate " + label.toLowerCase() + " field"} aria-describedby="morphism-gesture-hint"
            onPointerDown={event => {
              if (event.pointerType === "mouse" && event.button !== 0) return;
              pointer.current.down = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              track(event);
              if (behavior === "Scatter") onScatter();
            }}
            onPointerMove={track}
            onPointerUp={event => { pointer.current.down = false; pointer.current.active = false; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); redraw(); }}
            onPointerCancel={() => { pointer.current.down = false; pointer.current.active = false; redraw(); }}
            onPointerLeave={() => { if (!pointer.current.down) { pointer.current.active = false; redraw(); } }}
            onClick={event => { if (event.detail === 0) onScatter(); }}
            onKeyDown={event => {
              if (!event.key.startsWith("Arrow")) return;
              event.preventDefault();
              if (event.key === "ArrowLeft") rotation.current.y -= 0.18;
              if (event.key === "ArrowRight") rotation.current.y += 0.18;
              if (event.key === "ArrowUp") rotation.current.x -= 0.18;
              if (event.key === "ArrowDown") rotation.current.x += 0.18;
              redraw();
            }} />
          <div className="ms-field-caption" aria-hidden="true"><span>336 POINTS</span><span>{shape.toUpperCase()} ↗</span></div>
        </div>
        <div className="ms-object-bottom"><div><span>A DIFFERENT KIND OF FEELING</span><h4>{style.name}<em>.</em></h4></div><button type="button" className="ms-demo-button" onClick={onScatter} aria-label={"Scatter " + label.toLowerCase() + " particles"}>Make a little chaos <span aria-hidden="true">↗</span></button></div>
      </div>
      <p className="ms-stage-footnote">{style.note}</p>
    </article>
  );
}
