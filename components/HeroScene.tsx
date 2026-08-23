// components/HeroScene.tsx
"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

const RING_COUNT = 7;
const RING_SPACING = 5;
const RING_COLORS = [0xe8c384, 0xc9974a, 0xf3e4c4, 0xb97a45, 0xe8c384, 0xc9974a, 0xf3e4c4];
const PARTICLE_COUNT_DESKTOP = 700;
const PARTICLE_COUNT_MOBILE = 300;
const MOBILE_BREAKPOINT = 760;
const CAMERA_LERP = 0.07;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function fadeWindow(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
) {
  if (p <= inStart || p >= outEnd) return 0;
  if (p < inEnd) return clamp((p - inStart) / (inEnd - inStart), 0, 1);
  if (p > outStart) return clamp((outEnd - p) / (outEnd - outStart), 0, 1);
  return 1;
}

interface HeroSceneProps {
  heroSectionRef: RefObject<HTMLDivElement | null>;
  copyRefs: readonly [
    RefObject<HTMLDivElement | null>,
    RefObject<HTMLDivElement | null>,
    RefObject<HTMLDivElement | null>,
  ];
  scrollCueRef: RefObject<HTMLDivElement | null>;
}

export default function HeroScene({ heroSectionRef, copyRefs, scrollCueRef }: HeroSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const heroSection = heroSectionRef.current;
    const pinEl = canvas?.parentElement;
    if (!canvas || !heroSection || !pinEl) return;

    const [copy1, copy2, copy3] = copyRefs.map((r) => r.current);
    const scrollCue = scrollCueRef.current;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      if (copy1) {
        copy1.style.opacity = "0";
        copy1.style.visibility = "hidden";
      }
      if (copy2) {
        copy2.style.opacity = "0";
        copy2.style.visibility = "hidden";
      }
      if (copy3) {
        copy3.style.opacity = "1";
        copy3.style.visibility = "visible";
      }
      if (scrollCue) scrollCue.style.opacity = "0";
      return;
    }

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    scene.add(new THREE.AmbientLight(0x2a1c10, 1));
    const core = new THREE.PointLight(0xffd9a0, 3.5, 40, 2);
    core.position.set(0, 0, -9);
    scene.add(core);

    const tunnelGroup = new THREE.Group();
    scene.add(tunnelGroup);

    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < RING_COUNT; i++) {
      const radius = 2.6 + (i % 3) * 0.5;
      const geo = new THREE.TorusGeometry(radius, 0.018, 16, 96);
      const mat = new THREE.MeshBasicMaterial({
        color: RING_COLORS[i % RING_COLORS.length],
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.position.z = -i * RING_SPACING - 4;
      ring.rotation.x = i % 2 === 0 ? 0.15 : -0.1;
      ring.rotation.y = i * 0.3;
      ring.userData.phase = i * 0.8;
      tunnelGroup.add(ring);
      rings.push(ring);
    }

    const particleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 4.5;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = -Math.random() * (RING_SPACING * RING_COUNT + 10) + 6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf3e4c4,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    tunnelGroup.add(particles);

    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 256;
    const gctx = glowCanvas.getContext("2d")!;
    const grad = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,224,170,0.9)");
    grad.addColorStop(1, "rgba(255,224,170,0)");
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 256, 256);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(9, 9, 1);
    glowSprite.position.z = -RING_SPACING * RING_COUNT - 6;
    tunnelGroup.add(glowSprite);

    function resizeThree() {
      const w = pinEl!.clientWidth;
      const h = pinEl!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resizeThree();
    window.addEventListener("resize", resizeThree);

    let targetP = 0;
    let currentP = 0;
    let t = 0;
    let rafId = 0;
    const TUNNEL_DEPTH = RING_SPACING * RING_COUNT - 6;

    function animate() {
      rafId = requestAnimationFrame(animate);
      t += 0.008;
      currentP += (targetP - currentP) * CAMERA_LERP;

      camera.position.z = 9 - currentP * TUNNEL_DEPTH;
      camera.position.x = Math.sin(t * 0.4) * 0.15;
      camera.position.y = Math.cos(t * 0.3) * 0.1;
      camera.lookAt(0, 0, camera.position.z - 8);

      tunnelGroup.rotation.z = t * 0.03 + currentP * 0.5;

      rings.forEach((ring) => {
        const phase = ring.userData.phase as number;
        const pulse = 1 + Math.sin(t * 1.2 + phase) * 0.04;
        ring.scale.set(pulse, pulse, 1);
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(t + phase) * 0.15;
      });

      renderer.render(scene, camera);
    }
    animate();

    function onScroll() {
      const rect = heroSection!.getBoundingClientRect();
      const total = heroSection!.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = clamp(scrolled / total, 0, 1);
      targetP = p;

      const v1 = fadeWindow(p, -0.001, 0.04, 0.18, 0.3);
      if (copy1) {
        copy1.style.opacity = String(v1);
        copy1.style.visibility = v1 > 0.01 ? "visible" : "hidden";
      }
      const v2 = fadeWindow(p, 0.32, 0.42, 0.55, 0.68);
      if (copy2) {
        copy2.style.opacity = String(v2);
        copy2.style.visibility = v2 > 0.01 ? "visible" : "hidden";
      }
      const v3 = fadeWindow(p, 0.7, 0.82, 1.01, 1.02);
      if (copy3) {
        copy3.style.opacity = String(v3);
        copy3.style.visibility = v3 > 0.01 ? "visible" : "hidden";
      }
      if (scrollCue) scrollCue.style.opacity = p < 0.05 ? "0.7" : "0";
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", resizeThree);
      rings.forEach((ring) => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      particleGeo.dispose();
      particleMat.dispose();
      glowTex.dispose();
      glowMat.dispose();
      renderer.dispose();
    };
  }, [heroSectionRef, copyRefs, scrollCueRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
