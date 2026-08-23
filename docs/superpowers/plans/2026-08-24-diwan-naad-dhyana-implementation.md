# Diwan Naad Dhyana Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Diwan Naad Dhyana marketing/booking site — a Next.js app with a scroll-driven 3D "resonance tunnel" hero and a WhatsApp-deep-link booking form, no backend.

**Architecture:** Next.js 15 App Router + TypeScript, Tailwind CSS v4 (CSS-first `@theme` tokens), a hand-rolled Three.js scene in a client component for the hero, Framer Motion for scroll-reveal on the non-hero sections, and a typed content file (`content/site.ts`) as the only content source.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Three.js, Framer Motion, Vitest (for the one pure-function unit test).

**Spec:** `docs/superpowers/specs/2026-08-24-diwan-naad-dhyana-design.md`

## Global Constraints

- Next.js 15 App Router, TypeScript, no `src/` directory, `@/*` import alias resolving to project root.
- Tailwind CSS v4, CSS-first config via `@theme` in `app/globals.css` — no `tailwind.config.ts`.
- Three.js used directly (`import * as THREE from 'three'`), not react-three-fiber.
- Framer Motion only for non-hero scroll reveals (BenefitStrip, Offerings, Founder, Testimonials). The hero's own animation is imperative Three.js/DOM code, not Framer Motion.
- No CMS. All copy lives in `content/site.ts`.
- Design tokens (exact hex values):
  `--color-ink:#2a1c10; --color-ink-soft:#4a3624; --color-gold:#c9974a; --color-gold-light:#e8c384; --color-cream:#f8efdc; --color-cream-deep:#f0e2c4; --color-maroon:#6b2323; --color-sand:#cbb28a;`
- Fonts via `next/font/google`: Cormorant Garamond (display, weights 500/600/700), Assistant (body, weights 400/500/600/700), Noto Serif Devanagari (shloka only, weights 500/600).
- Hero pinned section: outer wrapper `height: 180vh`, inner sticky viewport `height: 100dvh` (not `100vh` — mobile browser-chrome stability).
- Hero scene constants (from `reference/diwan-naad-dhyana-scroll-demo.html`): `RING_COUNT = 7`, `RING_SPACING = 5`, particle count 700 desktop / 300 on viewports narrower than 760px, camera-position lerp factor `0.07` per frame, `devicePixelRatio` capped at 2 desktop / 1 mobile.
- `fadeWindow(p, inStart, inEnd, outStart, outEnd)` crossfade windows: beat 1 `0–0.04 → 0.18–0.30`, beat 2 `0.32–0.42 → 0.55–0.68`, beat 3 `0.70–0.82 → 1.01–1.02` (never fades back out).
- Hero text: never an opaque card behind it, never gold-on-gold. Use the `.hero-scrim` feathered radial gradient + near-white (`#fbf3e2`) headline text with drop shadow, ported verbatim from the reference demo's CSS.
- `prefers-reduced-motion: reduce` → no Three.js animation loop, no scroll listener driving the camera; show the static final (third) text beat, hide the scroll cue.
- WhatsApp number: `918368426330`. Deep link format: `https://wa.me/918368426330?text=<encoded>`.
- Founder bio, testimonials, portrait, and QR target URL are placeholders — mark each with a `// TODO:` comment in `content/site.ts` per the spec's Section 6/11.
- Shloka and tagline copy must be reproduced verbatim, never paraphrased.

---

### Task 1: Project scaffold, design tokens, fonts

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `.gitignore`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a buildable Next.js app; `app/globals.css` exposes Tailwind utility classes `bg-ink`, `text-gold`, `bg-cream`, etc. (from `--color-*` theme tokens) and font-family CSS variables `--font-cormorant`, `--font-assistant`, `--font-noto-devanagari` for later tasks to reference as `var(--font-display)` / `var(--font-body)` / `var(--font-devanagari)`.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "diwan-naad-dhyana",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.169.0",
    "framer-motion": "^11.5.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.169.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "vitest": "^2.1.0",
    "vite-tsconfig-paths": "^5.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `package-lock.json` and `node_modules/`.

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 5: Write `postcss.config.mjs`**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 6: Write `.gitignore`**

```
node_modules/
.next/
out/
*.log
.env*.local
.DS_Store
```

- [ ] **Step 7: Write `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-ink: #2a1c10;
  --color-ink-soft: #4a3624;
  --color-gold: #c9974a;
  --color-gold-light: #e8c384;
  --color-cream: #f8efdc;
  --color-cream-deep: #f0e2c4;
  --color-maroon: #6b2323;
  --color-sand: #cbb28a;

  --font-display: var(--font-cormorant), serif;
  --font-body: var(--font-assistant), sans-serif;
  --font-devanagari: var(--font-noto-devanagari), serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-cream);
  color: var(--color-ink);
}

h1,
h2,
h3 {
  font-family: var(--font-display), serif;
  font-weight: 600;
}
```

- [ ] **Step 8: Write `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Assistant, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
});

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});

const notoDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "600"],
  variable: "--font-noto-devanagari",
});

export const metadata: Metadata = {
  title: "Diwan Naad Dhyana — Naad Yoga Sound Meditation",
  description:
    "Experience the healing power of Naad Yoga with Diwan Naad Dhyana, founded by Nehal Sati. Book a personal or community sound meditation session.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${assistant.variable} ${notoDevanagari.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Write `app/page.tsx` (placeholder, replaced in Task 13)**

```tsx
export default function Home() {
  return <main className="p-10">Diwan Naad Dhyana — scaffold OK</main>;
}
```

- [ ] **Step 10: Verify the build**

Run: `npm run build`
Expected: build succeeds with no type errors; output confirms the `/` route compiled.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs .gitignore app/
git commit -m "chore: scaffold Next.js app with Tailwind v4 tokens and fonts"
```

---

### Task 2: Test runner + `lib/whatsapp.ts`

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/whatsapp.ts`
- Test: `lib/whatsapp.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `buildWhatsAppUrl(params: { name: string; interest: InterestType; message: string }): string` and `type InterestType = 'Personal Experience' | 'Community Gathering' | 'Educational Institution' | 'Workplace Well-being'`, both exported from `lib/whatsapp.ts`, imported by `components/Booking.tsx` (Task 11).

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 2: Write the failing test**

```ts
// lib/whatsapp.test.ts
import { describe, it, expect } from "vitest";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me URL with the name and interest, URL-encoded", () => {
    const url = buildWhatsAppUrl({
      name: "Asha",
      interest: "Personal Experience",
      message: "",
    });
    expect(url).toBe(
      "https://wa.me/918368426330?text=Hi%2C%20I'm%20Asha.%20I'm%20interested%20in%3A%20Personal%20Experience."
    );
  });

  it("appends the message when provided", () => {
    const url = buildWhatsAppUrl({
      name: "Ravi",
      interest: "Workplace Well-being",
      message: "Looking for a team session.",
    });
    expect(url).toContain(encodeURIComponent("Looking for a team session."));
    expect(url.startsWith("https://wa.me/918368426330?text=")).toBe(true);
  });

  it("omits the trailing space when message is empty", () => {
    const url = buildWhatsAppUrl({
      name: "Priya",
      interest: "Community Gathering",
      message: "",
    });
    const decoded = decodeURIComponent(url.split("text=")[1]);
    expect(decoded.endsWith(".")).toBe(true);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run lib/whatsapp.test.ts`
Expected: FAIL — `lib/whatsapp.ts` does not exist / `buildWhatsAppUrl` is not defined.

- [ ] **Step 4: Write the implementation**

```ts
// lib/whatsapp.ts
export type InterestType =
  | "Personal Experience"
  | "Community Gathering"
  | "Educational Institution"
  | "Workplace Well-being";

export function buildWhatsAppUrl(params: {
  name: string;
  interest: InterestType;
  message: string;
}): string {
  const { name, interest, message } = params;
  const text = `Hi, I'm ${name}. I'm interested in: ${interest}.${
    message ? " " + message : ""
  }`;
  return `https://wa.me/918368426330?text=${encodeURIComponent(text)}`;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run lib/whatsapp.test.ts`
Expected: PASS, 3 tests passing.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts lib/whatsapp.ts lib/whatsapp.test.ts
git commit -m "feat: add WhatsApp deep-link URL builder"
```

---

### Task 3: `content/site.ts` — typed content

**Files:**
- Create: `content/site.ts`
- Test: `content/site.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `export const site` with shape `{ hero: { eyebrow, wordmark, shlokaLines: string[], tagline, closingLine }, benefits: { label: string }[], offerings: { title: string; description: string }[], founder: { name: string; bio: string[] }, testimonials: { quote: string; attribution: string }[], contact: { phone, whatsappNumber, website, instagram, instagramUrl, qrTargetUrl } }`. Consumed by `components/Nav.tsx`, `components/Hero.tsx`, `components/BenefitStrip.tsx`, `components/Offerings.tsx`, `components/Founder.tsx`, `components/Testimonials.tsx`, `components/Booking.tsx`, `components/Footer.tsx`.

- [ ] **Step 1: Write the failing test**

```ts
// content/site.test.ts
import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("site content", () => {
  it("has 5 benefits", () => {
    expect(site.benefits).toHaveLength(5);
  });

  it("has 4 offerings", () => {
    expect(site.offerings).toHaveLength(4);
  });

  it("keeps the shloka verbatim", () => {
    expect(site.hero.shlokaLines).toEqual([
      "सर्वं शान्तं शिवं ब्रह्म",
      "नादे लीनं निरामयम्।",
    ]);
  });

  it("has the correct WhatsApp number", () => {
    expect(site.contact.whatsappNumber).toBe("918368426330");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run content/site.test.ts`
Expected: FAIL — `content/site.ts` does not exist.

- [ ] **Step 3: Write `content/site.ts`**

```ts
// content/site.ts
export interface Offering {
  title: string;
  description: string;
}

export interface Benefit {
  label: string;
}

export interface Testimonial {
  quote: string;
  attribution: string;
}

export const site = {
  hero: {
    eyebrow: "Experience the healing power of Naad Yoga",
    wordmark: "Diwan Naad Dhyana",
    shlokaLines: ["सर्वं शान्तं शिवं ब्रह्म", "नादे लीनं निरामयम्।"],
    tagline: "Stillness dissolves into sound",
    closingLine: "Every string, a resonance.\nEvery session, a return to stillness.",
  },
  benefits: [
    { label: "Sound Meditation" },
    { label: "Reduce Stress & Anxiety" },
    { label: "Improve Focus & Clarity" },
    { label: "Emotional Balance" },
    { label: "Better Sleep & Well-being" },
  ] satisfies Benefit[],
  offerings: [
    {
      title: "Personal Experiences",
      description: "One-on-one sound meditation sessions tailored to your needs.",
    },
    {
      title: "Community Gatherings",
      description: "Group sound baths and satsangs held in shared, sacred spaces.",
    },
    {
      title: "Educational Institutions",
      description: "Programs introducing students to sound, stillness, and focus.",
    },
    {
      title: "Workplace Well-being",
      description: "Corporate sessions to reduce stress and restore team balance.",
    },
  ] satisfies Offering[],
  founder: {
    name: "Nehal Sati",
    // TODO: replace with real founder bio (training/lineage, what led to founding
    // Diwan Naad Dhyana, philosophy behind sessions). Do not invent specific
    // biographical claims (dates, credentials, lineage details).
    bio: [
      "Placeholder bio paragraph one — training and background will go here.",
      "Placeholder bio paragraph two — the story behind founding Diwan Naad Dhyana will go here.",
    ],
  },
  // TODO: replace with real client testimonials before launch, or remove the
  // Testimonials section entirely if none are available yet.
  testimonials: [
    { quote: "Placeholder personal-session testimonial.", attribution: "Placeholder, Personal Session" },
    { quote: "Placeholder community-gathering testimonial.", attribution: "Placeholder, Community Gathering" },
    { quote: "Placeholder corporate-session testimonial.", attribution: "Placeholder, Workplace Session" },
  ] satisfies Testimonial[],
  contact: {
    phone: "+91-8368426330",
    whatsappNumber: "918368426330",
    website: "www.diwannaaddhyana.com",
    instagram: "@diwannaaddhyana",
    instagramUrl: "https://instagram.com/diwannaaddhyana",
    // TODO: confirm the standee QR code's actual target URL with Nehal —
    // defaulting to the Instagram profile until confirmed.
    qrTargetUrl: "https://instagram.com/diwannaaddhyana",
  },
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run content/site.test.ts`
Expected: PASS, 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add content/site.ts content/site.test.ts
git commit -m "feat: add typed site content with TODO-flagged placeholders"
```

---

### Task 4: `Nav.tsx`

**Files:**
- Create: `components/Nav.tsx`

**Interfaces:**
- Consumes: `site` from `@/content/site` (`site.hero.wordmark`).
- Produces: default export `Nav()`, consumed by `app/page.tsx` (Task 13).

- [ ] **Step 1: Write `components/Nav.tsx`**

```tsx
import Link from "next/link";
import { site } from "@/content/site";

export default function Nav() {
  return (
    <nav className="relative z-50 flex items-center justify-between bg-cream px-[6vw] py-5">
      <div className="flex items-center gap-2.5 font-display text-2xl font-bold">
        <span className="h-2.5 w-2.5 rounded-full bg-gold" />
        {site.hero.wordmark}
      </div>
      <div className="hidden gap-8 text-sm font-medium md:flex">
        <Link href="#offerings" className="opacity-75 hover:opacity-100">
          Offerings
        </Link>
        <Link href="#founder" className="opacity-75 hover:opacity-100">
          About
        </Link>
        <Link href="#book" className="opacity-75 hover:opacity-100">
          Contact
        </Link>
      </div>
      <Link
        href="#book"
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream"
      >
        Book a Session
      </Link>
    </nav>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat: add site nav"
```

---

### Task 5: `HeroScene.tsx` — the Three.js resonance tunnel

**Files:**
- Create: `components/HeroScene.tsx`

**Interfaces:**
- Consumes: nothing beyond the DOM refs passed in as props (self-contained Three.js logic; no content-file dependency).
- Produces: default export `HeroScene(props: HeroSceneProps)` where

```ts
interface HeroSceneProps {
  heroSectionRef: React.RefObject<HTMLDivElement | null>;
  copyRefs: [
    React.RefObject<HTMLDivElement | null>,
    React.RefObject<HTMLDivElement | null>,
    React.RefObject<HTMLDivElement | null>,
  ];
  scrollCueRef: React.RefObject<HTMLDivElement | null>;
}
```

  Renders a `<canvas>` absolutely positioned to fill its parent, and imperatively sets `style.opacity` on `copyRefs[0..2].current` and `scrollCueRef.current` as the user scrolls. Consumed by `components/Hero.tsx` (Task 6), which owns the refs and the parent element `HeroScene` measures for canvas sizing.

This component has no visual harness of its own (it needs `Hero.tsx`'s sized wrapper to render into), so this task's verification step is a production build only. Task 6 does the first visual check.

- [ ] **Step 1: Write `components/HeroScene.tsx`**

```tsx
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
  copyRefs: [
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
      if (copy1) copy1.style.opacity = "0";
      if (copy2) copy2.style.opacity = "0";
      if (copy3) copy3.style.opacity = "1";
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

      if (copy1) copy1.style.opacity = String(fadeWindow(p, 0, 0.04, 0.18, 0.3));
      if (copy2) copy2.style.opacity = String(fadeWindow(p, 0.32, 0.42, 0.55, 0.68));
      if (copy3) copy3.style.opacity = String(fadeWindow(p, 0.7, 0.82, 1.01, 1.02));
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
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/HeroScene.tsx
git commit -m "feat: add HeroScene resonance-tunnel Three.js component"
```

---

### Task 6: `Hero.tsx` — DOM structure, scrim/copy CSS, dynamic import

**Files:**
- Create: `components/Hero.tsx`
- Modify: `app/globals.css` (append hero-specific classes)

**Interfaces:**
- Consumes: `HeroScene` default export and `HeroSceneProps` shape from `@/components/HeroScene` (Task 5); `site` from `@/content/site` (Task 3): `site.hero.eyebrow`, `site.hero.wordmark`, `site.hero.shlokaLines`, `site.hero.tagline`, `site.hero.closingLine`.
- Produces: default export `Hero()`, consumed by `app/page.tsx` (Task 13).

- [ ] **Step 1: Append hero CSS to `app/globals.css`**

```css
.hero-scrim {
  position: absolute;
  z-index: 10;
  width: min(92vw, 780px);
  height: 460px;
  background: radial-gradient(
    ellipse at center,
    rgba(10, 6, 3, 0.85) 0%,
    rgba(10, 6, 3, 0.6) 45%,
    rgba(10, 6, 3, 0) 78%
  );
  pointer-events: none;
}

.hero-copy {
  position: absolute;
  z-index: 20;
  text-align: center;
  padding: 0 24px;
  max-width: 680px;
}

.hero-copy .eyebrow {
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6);
}

.hero-copy h1 {
  font-size: clamp(2.1rem, 4.6vw, 3.6rem);
  line-height: 1.08;
  margin: 14px 0 0;
  color: #fbf3e2;
  text-shadow: 0 4px 40px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(0, 0, 0, 0.4);
}

.hero-copy .rule {
  width: 46px;
  height: 1px;
  background: var(--color-gold);
  margin: 18px auto;
  opacity: 0.8;
}

.hero-copy .shloka {
  font-family: var(--font-devanagari), serif;
  font-size: 1.1rem;
  color: var(--color-gold-light);
  line-height: 1.7;
  margin-bottom: 8px;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.6);
}

.hero-copy .tag {
  font-size: 0.86rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-sand);
  font-weight: 600;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);
}

.eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-gold);
  font-weight: 600;
}

.hero-ctas {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 26px;
}

.btn-primary {
  background: var(--color-gold);
  color: var(--color-ink);
  padding: 13px 30px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 8px 30px rgba(201, 151, 74, 0.35);
}

.btn-ghost {
  border: 1.5px solid rgba(248, 239, 220, 0.5);
  padding: 12px 28px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-cream-deep);
}

.scroll-cue {
  position: absolute;
  bottom: 34px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-cream-deep);
  opacity: 0.7;
  z-index: 20;
}

.scroll-cue span {
  display: block;
  width: 1px;
  height: 26px;
  background: var(--color-cream-deep);
  margin: 8px auto 0;
  opacity: 0.5;
}
```

- [ ] **Step 2: Write `components/Hero.tsx`**

```tsx
"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { site } from "@/content/site";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const copy1Ref = useRef<HTMLDivElement>(null);
  const copy2Ref = useRef<HTMLDivElement>(null);
  const copy3Ref = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const closingLines = site.hero.closingLine.split("\n");

  return (
    <div ref={heroSectionRef} className="relative h-[180vh]">
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_30%,#3a2818_0%,#241708_60%,#170f07_100%)]">
        <HeroScene
          heroSectionRef={heroSectionRef}
          copyRefs={[copy1Ref, copy2Ref, copy3Ref]}
          scrollCueRef={scrollCueRef}
        />
        <div className="hero-scrim" />
        <div ref={copy1Ref} className="hero-copy">
          <p className="eyebrow">{site.hero.eyebrow}</p>
          <h1>{site.hero.wordmark}</h1>
          <div className="rule" />
        </div>
        <div ref={copy2Ref} className="hero-copy" style={{ opacity: 0 }}>
          <p className="shloka">
            {site.hero.shlokaLines.map((line, i) => (
              <span key={line}>
                {line}
                {i < site.hero.shlokaLines.length - 1 && <br />}
              </span>
            ))}
          </p>
          <p className="tag">{site.hero.tagline}</p>
        </div>
        <div ref={copy3Ref} className="hero-copy" style={{ opacity: 0 }}>
          <h1 className="text-[clamp(1.8rem,4vw,3rem)]">
            {closingLines.map((line, i) => (
              <span key={line}>
                {line}
                {i < closingLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <div className="hero-ctas">
            <a className="btn-primary" href="#book">
              Book a Session
            </a>
            <a className="btn-ghost" href="#offerings">
              Explore Offerings
            </a>
          </div>
        </div>
        <div ref={scrollCueRef} className="scroll-cue">
          Scroll
          <span />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire it into the page temporarily and verify visually**

Temporarily replace the body of `app/page.tsx` with:

```tsx
import Hero from "@/components/Hero";

export default function Home() {
  return <Hero />;
}
```

Run: `npm run dev`, open `http://localhost:3000`.
Expected: dark tunnel scene with glowing rings visible behind the wordmark on load; scrolling slowly through the page crossfades eyebrow/wordmark → shloka/tagline → closing line + CTAs, and the camera glides deeper into the tunnel as you scroll (not on its own). Text stays legible over the rings at every scroll position (scrim working). Leave `app/page.tsx` in this temporary state — Task 13 replaces it with the full page assembly.

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx app/globals.css app/page.tsx
git commit -m "feat: add Hero wrapper with scrim, copy beats, and CTAs"
```

---

### Task 7: `BenefitStrip.tsx`

**Files:**
- Create: `components/BenefitStrip.tsx`

**Interfaces:**
- Consumes: `site.benefits` from `@/content/site`.
- Produces: default export `BenefitStrip()`, consumed by `app/page.tsx` (Task 13).

- [ ] **Step 1: Write `components/BenefitStrip.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";

const ICONS = ["♪", "✿", "◐", "♡", "☾"];

export default function BenefitStrip() {
  return (
    <div className="flex flex-wrap justify-center bg-ink px-[4vw] py-8 text-cream-deep">
      {site.benefits.map((benefit, i) => (
        <motion.div
          key={benefit.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="flex-1 basis-40 border-r border-cream-deep/15 px-4 py-3.5 text-center last:border-r-0"
        >
          <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full border border-gold text-gold">
            {ICONS[i]}
          </div>
          <p className="text-sm font-medium leading-tight">{benefit.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/BenefitStrip.tsx
git commit -m "feat: add benefit strip with scroll reveal"
```

---

### Task 8: `Offerings.tsx`

**Files:**
- Create: `components/Offerings.tsx`

**Interfaces:**
- Consumes: `site.offerings` from `@/content/site`; the `.eyebrow` class from `app/globals.css` (Task 6).
- Produces: default export `Offerings()`, rendering a `<section id="offerings">`, consumed by `app/page.tsx` (Task 13). The `#offerings` anchor is targeted by the Nav (Task 4) and Hero (Task 6) CTA links.

- [ ] **Step 1: Write `components/Offerings.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";

export default function Offerings() {
  return (
    <section id="offerings" className="mx-auto max-w-6xl px-[6vw] py-20">
      <div className="mb-12 text-center">
        <p className="eyebrow">Our Offerings</p>
        <h2 className="mt-2 text-4xl">Ways to experience Naad Yoga</h2>
      </div>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
        {site.offerings.map((offering, i) => (
          <motion.div
            key={offering.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border-ink/10 px-5 text-center md:border-r md:last:border-r-0"
          >
            <h3 className="mb-2 text-xl">{offering.title}</h3>
            <p className="text-sm leading-relaxed text-ink-soft">{offering.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/Offerings.tsx
git commit -m "feat: add offerings grid with scroll reveal"
```

---

### Task 9: `Founder.tsx`

**Files:**
- Create: `components/Founder.tsx`

**Interfaces:**
- Consumes: `site.founder` from `@/content/site`; the `.eyebrow` class from `app/globals.css`.
- Produces: default export `Founder()`, rendering `<section id="founder">`, consumed by `app/page.tsx` (Task 13). The `#founder` anchor is targeted by the Nav "About" link (Task 4).

- [ ] **Step 1: Write `components/Founder.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";

export default function Founder() {
  return (
    <section id="founder" className="mx-auto max-w-6xl px-[6vw] py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="aspect-[4/5] w-full rounded-2xl bg-gradient-to-br from-gold-light to-maroon"
          aria-label="Founder portrait placeholder"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <p className="eyebrow">Founder</p>
          <h2 className="mb-4 mt-2 text-4xl">{site.founder.name}</h2>
          {site.founder.bio.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/Founder.tsx
git commit -m "feat: add founder section with placeholder bio and portrait"
```

---

### Task 10: `Testimonials.tsx`

**Files:**
- Create: `components/Testimonials.tsx`

**Interfaces:**
- Consumes: `site.testimonials` from `@/content/site`; the `.eyebrow` class from `app/globals.css`.
- Produces: default export `Testimonials()`, consumed by `app/page.tsx` (Task 13).

- [ ] **Step 1: Write `components/Testimonials.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-[6vw] py-20">
      <div className="mb-12 text-center">
        <p className="eyebrow">Testimonials</p>
        <h2 className="mt-2 text-4xl">What people carry with them</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {site.testimonials.map((testimonial, i) => (
          <motion.div
            key={testimonial.attribution}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-ink/10 p-6"
          >
            <p className="mb-4 italic leading-relaxed text-ink-soft">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <p className="text-sm font-semibold text-gold">{testimonial.attribution}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/Testimonials.tsx
git commit -m "feat: add testimonials grid with placeholder quotes"
```

---

### Task 11: `Booking.tsx`

**Files:**
- Create: `components/Booking.tsx`

**Interfaces:**
- Consumes: `buildWhatsAppUrl` and `InterestType` from `@/lib/whatsapp` (Task 2); `site.contact` from `@/content/site` (Task 3).
- Produces: default export `Booking()`, rendering `<section id="book">`, consumed by `app/page.tsx` (Task 13). The `#book` anchor is targeted by the Nav "Book a Session" pill (Task 4) and both Hero CTAs (Task 6).

- [ ] **Step 1: Write `components/Booking.tsx`**

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { buildWhatsAppUrl, type InterestType } from "@/lib/whatsapp";

const INTEREST_OPTIONS: InterestType[] = [
  "Personal Experience",
  "Community Gathering",
  "Educational Institution",
  "Workplace Well-being",
];

export default function Booking() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState<InterestType>(INTEREST_OPTIONS[0]);
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const url = buildWhatsAppUrl({ name, interest, message });
    window.open(url, "_blank");
  }

  return (
    <section id="book" className="mx-[6vw] mb-20 rounded-[28px] bg-ink px-[6vw] py-14 text-cream">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-4xl text-cream">Book a session</h2>
          <p className="mb-6 leading-relaxed text-sand">
            Fill this in and it opens WhatsApp with your details pre-filled, ready to send to
            us directly — no account or backend needed.
          </p>
          <div className="mb-2.5 text-sm text-cream-deep">📱 {site.contact.phone}</div>
          <div className="mb-2.5 text-sm text-cream-deep">🌐 {site.contact.website}</div>
          <div className="mb-2.5 text-sm text-cream-deep">📷 {site.contact.instagram}</div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-cream-deep/25 bg-cream-deep/[0.06] px-4 py-3 text-sm text-cream placeholder:text-cream-deep/45"
          />
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value as InterestType)}
            className="rounded-xl border border-cream-deep/25 bg-cream-deep/[0.06] px-4 py-3 text-sm text-cream"
          >
            {INTEREST_OPTIONS.map((option) => (
              <option key={option} value={option} className="text-ink">
                {option}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Tell us a little about what you're looking for"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[90px] resize-y rounded-xl border border-cream-deep/25 bg-cream-deep/[0.06] px-4 py-3 text-sm text-cream placeholder:text-cream-deep/45"
          />
          <button
            type="submit"
            className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-bold text-[#0c2a17]"
          >
            Send via WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/Booking.tsx
git commit -m "feat: add booking form that opens a WhatsApp deep link"
```

---

### Task 12: `Footer.tsx`

**Files:**
- Create: `components/Footer.tsx`

**Interfaces:**
- Consumes: `site.founder.name`, `site.contact` from `@/content/site`.
- Produces: default export `Footer()`, consumed by `app/page.tsx` (Task 13).

- [ ] **Step 1: Write `components/Footer.tsx`**

```tsx
import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="px-[6vw] pb-12 pt-8 text-center text-sm text-ink-soft">
      © Diwan Naad Dhyana — Founder: {site.founder.name} &nbsp;|&nbsp; {site.contact.phone}{" "}
      &nbsp;|&nbsp; {site.contact.website} &nbsp;|&nbsp; {site.contact.instagram}
    </footer>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add footer"
```

---

### Task 13: Assemble `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: default exports `Nav`, `Hero`, `BenefitStrip`, `Offerings`, `Founder`, `Testimonials`, `Booking`, `Footer` from `@/components/*` (Tasks 4, 6–12).
- Produces: the site's `/` route.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BenefitStrip from "@/components/BenefitStrip";
import Offerings from "@/components/Offerings";
import Founder from "@/components/Founder";
import Testimonials from "@/components/Testimonials";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <BenefitStrip />
      <Offerings />
      <Founder />
      <Testimonials />
      <Booking />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble full page from all sections"
```

---

### Task 14: Manual QA, reduced-motion/mobile checks, Lighthouse, final commit

**Files:** none created; verification only. Fix forward in whichever file is implicated if a check fails.

**Interfaces:** none — this task exercises the fully assembled app from Task 13.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all `lib/whatsapp.test.ts` and `content/site.test.ts` tests pass.

- [ ] **Step 2: Manual desktop scroll check**

Run: `npm run dev`, open `http://localhost:3000` in a desktop-width window.
Verify: hero content is reachable in well under one full page scroll (per the 180vh non-negotiable); the three text beats crossfade at the documented scroll windows; rings/particles stay visible everywhere except directly behind the text (scrim, not a card); tunnel rotation and camera drift are subtle, not dramatic; scrolling past the hero reveals BenefitStrip → Offerings → Founder → Testimonials → Booking → Footer in order, each revealing on scroll via Framer Motion.

- [ ] **Step 3: Reduced-motion check**

In Chrome DevTools, open the Rendering tab and set "Emulate CSS media feature prefers-reduced-motion" to `reduce`, then reload `http://localhost:3000`.
Verify: the hero shows the closing line + CTAs statically with no scroll cue, no canvas animation running (check the Performance/FPS meter shows no continuous rAF activity from the hero), and no camera movement as you scroll.

- [ ] **Step 4: Mobile viewport check**

In DevTools device toolbar, emulate a phone viewport (e.g. 390×844) with device-frame browser-chrome simulation enabled.
Verify: the hero's `100dvh` sticky viewport does not visibly jump or leave a gap when the simulated mobile browser chrome collapses on scroll; the benefit strip wraps to 2 columns; the offerings and testimonials grids wrap to fewer columns; the booking form stacks to one column.

- [ ] **Step 5: WhatsApp form check**

On the running dev server, fill in the booking form (name required; pick each of the 4 interest options in turn; try with and without a message) and submit.
Verify: a new tab opens to a `https://wa.me/918368426330?text=...` URL whose decoded text reads `Hi, I'm <name>. I'm interested in: <interest>.` optionally followed by the message, matching `lib/whatsapp.ts`'s `buildWhatsAppUrl`.

- [ ] **Step 6: Production build and Lighthouse check**

Run: `npm run build && npm start`
Then in a separate terminal: `npx lighthouse http://localhost:3000 --preset=perf --only-categories=performance --chrome-flags="--headless" --output=json --output-path=./lighthouse-report.json`
Expected: the reported performance score is ≥ 0.85. If it's short, reduce `PARTICLE_COUNT_MOBILE` / `PARTICLE_COUNT_DESKTOP` in `components/HeroScene.tsx` and re-run until the target is met.

- [ ] **Step 7: Remove the Lighthouse report and commit any fixes**

```bash
rm -f lighthouse-report.json
git add -A
git commit -m "chore: final QA pass on hero, reduced-motion, mobile, and booking flow"
```

If Step 7 has nothing to commit (no fixes were needed), skip the commit — the plan is complete.
