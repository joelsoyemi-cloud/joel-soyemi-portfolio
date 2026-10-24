"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { useCanvasSurface } from "./useCanvasSurface";
import type { CanvasDraw } from "./useCanvasSurface";

export type FlightState = { progress: number; x: number; y: number; boost: number };
type Props = { motion: boolean; flight: RefObject<FlightState>; refresh: RefObject<(() => void) | null> };
const TAU = Math.PI * 2;
const random = (index: number) => { const n = Math.sin(index * 127.1 + 42.5) * 43758.5453; return n - Math.floor(n); };

export default function SpaceScene({ motion, flight, refresh }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const gpuRefresh = useRef<(() => void) | null>(null);
  const motionRef = useRef(motion);
  const clock = useRef(0);
  const [rendererState, setRendererState] = useState("loading");

  const fallbackDraw = useCallback<CanvasDraw>((ctx, width, height, seconds) => {
    clock.current += seconds;
    const { progress, x, y, boost } = flight.current;
    const time = clock.current;
    ctx.fillStyle = "#0b1919"; ctx.fillRect(0, 0, width, height);
    const cx = width * (width < 650 ? 0.5 : 0.64) + x * 25;
    const cy = height * (width < 650 ? 0.47 : 0.49) + y * 18;
    const size = Math.min(width * 0.3, height * 0.25) * (1 + Math.sin(progress * Math.PI) * 0.45);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 2.2);
    glow.addColorStop(0, "#77b7a02c"); glow.addColorStop(1, "#0b191900");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 150; i++) {
      const drift = (time * (0.7 + boost % 4 * 0.4) + progress * 60) * (0.2 + random(i + 1));
      const sx = (random(i * 3 + 7) * width + x * (random(i) * 20) + boost * 17) % width;
      const sy = (random(i * 5 + 2) * height + drift) % height;
      ctx.fillStyle = i % 9 === 0 ? "#e5b48e" : "#a0c4b5";
      ctx.globalAlpha = 0.18 + random(i + 10) * 0.65;
      ctx.beginPath(); ctx.arc(sx, sy, 0.5 + random(i + 3), 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.45 + progress * 0.5 + x * 0.06);
    const orb = ctx.createRadialGradient(-size * 0.35, -size * 0.4, size * 0.06, 0, 0, size);
    orb.addColorStop(0, "#bbd5bd"); orb.addColorStop(0.35, "#6d9f8b"); orb.addColorStop(0.7, "#2c6259"); orb.addColorStop(1, "#0b282b");
    ctx.fillStyle = orb; ctx.shadowColor = "#83c2a03d"; ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.arc(0, 0, size * 0.7, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = i % 2 ? "#d5b7977d" : "#9fd0bc8c";
      ctx.lineWidth = i === 0 ? 2 : 0.8;
      ctx.beginPath(); ctx.ellipse(0, 0, size * (1.05 + i * 0.14), size * (0.27 + i * 0.045), progress * 0.35 + i * 0.1, 0, TAU); ctx.stroke();
    }
    ctx.restore();
    for (let i = 0; i < 3; i++) {
      const angle = time * 0.12 + i * 2.1 + progress * 3;
      const r = size * (1.25 + i * 0.25);
      const px = cx + Math.cos(angle) * r, py = cy + Math.sin(angle) * r * 0.55;
      ctx.fillStyle = i === 1 ? "#d1b092" : "#a4bfa4";
      ctx.beginPath(); ctx.arc(px, py, size * (0.035 + i * 0.015), 0, TAU); ctx.fill();
    }
  }, [flight]);
  const { canvas, redraw } = useCanvasSurface(motion && rendererState !== "ready", fallbackDraw);

  useEffect(() => {
    refresh.current = () => { gpuRefresh.current?.(); redraw(); };
    return () => { refresh.current = null; };
  }, [redraw, refresh]);
  useEffect(() => { motionRef.current = motion; refresh.current?.(); }, [motion, refresh]);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    if (new URLSearchParams(window.location.search).get("graphics") === "off") { setRendererState("fallback"); return; }
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
    catch { setRendererState("fallback"); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 720 ? 1.2 : 1.5));
    renderer.setClearColor(0x0b1919, 1);
    renderer.domElement.setAttribute("aria-hidden", "true");
    node.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#0b1919", 0.025);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    const world = new THREE.Group(); scene.add(world);
    const orbGeometry = new THREE.IcosahedronGeometry(1.15, 4);
    const orbMaterial = new THREE.MeshStandardMaterial({ color: "#729d85", roughness: 0.3, metalness: 0.65 });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial); world.add(orb);
    const ringGeometry = new THREE.TorusGeometry(1.9, 0.012, 5, 112);
    const ringMaterials = [new THREE.MeshBasicMaterial({ color: "#bddbc3", transparent: true, opacity: 0.8 }), new THREE.MeshBasicMaterial({ color: "#d2ab86", transparent: true, opacity: 0.75 })];
    for (let i = 0; i < 5; i++) { const ring = new THREE.Mesh(ringGeometry, ringMaterials[i % 2]); ring.rotation.set(1.12 + i * 0.13, 0.3, i * 0.25); ring.scale.setScalar(1 + i * 0.12); world.add(ring); }
    const moonGeometry = new THREE.IcosahedronGeometry(0.11, 1);
    const moons: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i++) { const moon = new THREE.Mesh(moonGeometry, orbMaterial); moon.scale.setScalar(0.5 + random(i) * 1.1); moons.push(moon); world.add(moon); }
    const starGeometry = new THREE.BufferGeometry();
    const starsArray = new Float32Array(720 * 3);
    for (let i = 0; i < 720; i++) { starsArray[i * 3] = (random(i * 3 + 1) - 0.5) * 45; starsArray[i * 3 + 1] = (random(i * 3 + 2) - 0.5) * 28; starsArray[i * 3 + 2] = random(i * 3 + 3) * 55 - 40; }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starsArray, 3));
    const starMaterial = new THREE.PointsMaterial({ color: "#b5d7c2", size: 0.035, transparent: true, opacity: 0.7, sizeAttenuation: true });
    const stars = new THREE.Points(starGeometry, starMaterial); scene.add(stars);
    scene.add(new THREE.HemisphereLight("#d9f0d0", "#102329", 2.5));
    const key = new THREE.DirectionalLight("#f6e2c6", 3.5); key.position.set(-3, 4, 5); scene.add(key);
    const rim = new THREE.PointLight("#83d0bd", 26, 20); rim.position.set(3, -1, 2); scene.add(rim);
    let inView = true, disposed = false, contextAlive = true, frame = 0, previous = 0, elapsed = 0;
    function draw(now: number) {
      frame = 0;
      if (disposed || !contextAlive || !inView || document.hidden) return;
      const running = motionRef.current;
      const dt = running && previous ? Math.min((now - previous) / 1000, 0.032) : 0;
      previous = running ? now : 0; elapsed += dt;
      const state = flight.current, p = state.progress;
      const compact = node!.clientWidth < 650;
      camera.position.set((compact ? 0 : -1.6) + state.x * 0.45, 0.6 + state.y * 0.35, 7.7 - Math.min(p, 0.65) * 5.7 + Math.max(0, p - 0.65) * 9);
      camera.lookAt(compact ? 0 : -0.6, 0, 0);
      world.position.x = compact ? 0 : 0.85;
      world.rotation.y = elapsed * 0.09 + p * 2.5 + state.boost * 0.15;
      world.rotation.z = -0.25 + p * 0.5;
      orb.rotation.x = elapsed * 0.04;
      moons.forEach((moon, i) => { const a = elapsed * 0.12 + i * 0.9 + p * 3; moon.position.set(Math.cos(a) * (2.1 + i * 0.1), Math.sin(a) * 1.15, Math.sin(a * 1.3) * 1.5); });
      stars.rotation.z = p * 0.08;
      stars.position.z = (elapsed * (0.15 + state.boost % 4 * 0.16) + p * 8) % 12;
      renderer.render(scene, camera);
      if (running) frame = requestAnimationFrame(draw);
    }
    function requestDraw() { if (!frame && !disposed && contextAlive && inView && !document.hidden) frame = requestAnimationFrame(draw); }
    function resize() { if (!node?.clientWidth || !node.clientHeight) return; renderer.setSize(node.clientWidth, node.clientHeight); camera.aspect = node.clientWidth / node.clientHeight; camera.updateProjectionMatrix(); requestDraw(); }
    const size = new ResizeObserver(resize); size.observe(node);
    const view = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; previous = 0; if (frame) cancelAnimationFrame(frame); frame = 0; requestDraw(); }); view.observe(node);
    function visibility() { previous = 0; if (frame) cancelAnimationFrame(frame); frame = 0; requestDraw(); }
    function contextLost(event: Event) { event.preventDefault(); contextAlive = false; if (frame) cancelAnimationFrame(frame); frame = 0; gpuRefresh.current = null; setRendererState("fallback"); }
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    document.addEventListener("visibilitychange", visibility);
    gpuRefresh.current = requestDraw; resize(); setRendererState("ready");
    return () => {
      disposed = true; cancelAnimationFrame(frame); gpuRefresh.current = null;
      size.disconnect(); view.disconnect(); document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      orbGeometry.dispose(); orbMaterial.dispose(); ringGeometry.dispose(); ringMaterials.forEach(m => m.dispose()); moonGeometry.dispose(); starGeometry.dispose(); starMaterial.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [flight]);

  return <div className="cj-space-scene" data-renderer={rendererState}><canvas ref={canvas} className={rendererState === "ready" ? "cj-fallback is-hidden" : "cj-fallback"} aria-hidden="true" /><div ref={host} className="cj-webgl" aria-hidden="true" /></div>;
}
