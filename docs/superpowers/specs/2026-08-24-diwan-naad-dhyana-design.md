# Diwan Naad Dhyana website — design

## 1. Summary

A marketing/booking site for Diwan Naad Dhyana (Naad Yoga practice, founder Nehal Sati). No backend: the only conversion mechanism is a booking/enquiry form that opens WhatsApp with a pre-filled message (`wa.me` deep link). The centerpiece is a scroll-driven 3D "resonance tunnel" hero built with Three.js.

Source material: the full build brief (goals, content, design tokens, non-negotiables) supplied by Nehal, and a working reference demo at `reference/diwan-naad-dhyana-scroll-demo.html` that is the source of truth for the hero's look and scroll mechanics.

## 2. Goals (equal priority)

1. Get individuals to book a personal or community session.
2. Build brand awareness, funnel to Instagram/WhatsApp.
3. Get institutions/corporates to enquire about programs.

## 3. Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS, themed with the tokens in Section 7
- Three.js used directly (not react-three-fiber) inside a client component, matching the reference demo's approach
- Framer Motion for non-hero scroll reveals (fade/slide-in on offerings, founder, testimonials)
- No CMS — content lives in `content/site.ts`
- Deploy target: Vercel (final domain/DNS TBD — see Section 10)

## 4. Project structure

```
app/layout.tsx          — fonts (next/font/google), metadata
app/page.tsx             — assembles sections
components/
  Nav.tsx
  Hero.tsx               — client component, dynamic-imports HeroScene (ssr:false)
  HeroScene.tsx           — 'use client', owns the Three.js canvas + scroll listener
  BenefitStrip.tsx
  Offerings.tsx
  Founder.tsx             — placeholder bio + portrait, TODO-flagged
  Testimonials.tsx        — placeholder quotes, TODO-flagged
  Booking.tsx             — form → wa.me deep link
  Footer.tsx
content/site.ts           — typed content (copy, offerings, benefits, testimonials, contact)
lib/whatsapp.ts           — builds the wa.me URL from form fields
reference/                — the source-of-truth demo HTML (not shipped, reference only)
```

## 5. Hero: scroll-driven 3D resonance tunnel

Ported from `reference/diwan-naad-dhyana-scroll-demo.html`, adapted for React/Next:

- `<canvas>` inside a pinned hero section: `height: 180vh` outer wrapper, `position: sticky; top: 0; height: 100dvh` inner viewport (use `dvh` for mobile browser-chrome stability per Section 9 of the brief).
- 7 glowing torus rings (gold/brass, `MeshBasicMaterial`, additive blending, `depthWrite: false`), spaced along z, each pulsing scale/opacity via a sine wave independent of scroll.
- ~700 particles (`THREE.Points`, additive blending) in a cylindrical volume for depth.
- A radial-gradient glow sprite at the vanishing point.
- Camera z-position is scroll-driven: computed from scroll progress (0→1) through the pinned section, eased toward target via `currentP += (targetP - currentP) * 0.07` per frame (exact factor from the demo), plus a small idle sine sway on x/y. Primary motion is scroll-position-driven, not time-driven.
- Tunnel group has slow idle rotation drift + a small scroll-linked increment — kept subtle per explicit prior feedback (no dramatic rotation).
- Three text beats crossfade via the `fadeWindow(p, inStart, inEnd, outStart, outEnd)` helper (verbatim from the demo) over these scroll-progress windows:
  1. `0–0.04 → 0.18–0.30`: eyebrow + wordmark + gold rule
  2. `0.32–0.42 → 0.55–0.68`: shloka + tagline
  3. `0.70–0.82 → end`: closing line + CTAs

**Text contrast (non-negotiable, broke twice during prior iteration):** no opaque card behind text, no gold-on-gold. Use the feathered radial-gradient dark scrim (`.hero-scrim` in the demo) positioned behind the text block only; headline text near-white (`#fbf3e2`) with soft drop shadow. Copy the `.hero-scrim` / `.hero-copy` CSS from the demo directly.

**React/Next adaptations beyond the demo:**
- Mount/teardown the Three.js scene in `useEffect`; dispose renderer, geometries, materials, and remove scroll/resize listeners on unmount.
- Guard all `window`/`document` access for SSR; lazy-load `HeroScene` via `next/dynamic({ ssr: false })` so it doesn't block first paint.
- `prefers-reduced-motion: reduce` → skip scroll-driven camera movement and idle animations entirely; render the hero in a static state with the third (final) text beat visible and no canvas animation loop running.
- Cap `devicePixelRatio` at 2 on desktop, 1 on mobile/narrow viewports; reduce particle count on mobile to help hit Lighthouse mobile performance ≥ 85.

## 6. Content

Verbatim copy (wordmark, shloka, tagline, 5 benefits, 4 offerings, founder name, contact details) goes into `content/site.ts`, matching Section 4 of the brief exactly — no paraphrasing of the shloka or tagline.

**Placeholders (must be TODO-flagged in code, not shipped as final):**
- Founder bio (2–3 paragraphs) — generic placeholder language only, no invented biographical claims (dates, credentials, lineage).
- 3 testimonial quotes (Personal/Community/Corporate) — placeholder, or omit the section entirely if none are supplied before launch.
- Founder portrait — gradient placeholder box until a real photo is supplied.
- QR code target URL — unconfirmed; placeholder points at the Instagram handle until Nehal confirms the standee's actual QR target.

## 7. Design tokens

```
--ink:        #2a1c10
--ink-soft:   #4a3624
--gold:       #c9974a
--gold-light: #e8c384
--cream:      #f8efdc
--cream-deep: #f0e2c4
--maroon:     #6b2323   (sparingly)
--sand:       #cbb28a
```

Typography: Cormorant Garamond (display), Assistant (body), Noto Serif Devanagari (shloka only) — via `next/font/google`.

## 8. Page structure

1. Nav — wordmark + gold dot, links, "Book a Session" CTA pill
2. Hero (Section 5)
3. Benefit strip — dark background, 5 items, horizontal desktop / 2-col mobile
4. Offerings — 4-col grid (2-col mobile), one-line factual description per offering (written fresh, no invented claims)
5. Founder section — portrait + bio (placeholder, flagged)
6. Testimonials — 3-card grid (placeholder, flagged)
7. Booking section — dark rounded panel, contact info + form (name required, interest-type dropdown matching the 4 offerings, free-text message) → `lib/whatsapp.ts` builds `wa.me/918368426330?text=...` and opens it in a new tab
8. Footer — contact info repeated, © line

## 9. Booking form → WhatsApp

`lib/whatsapp.ts` exports a pure function `buildWhatsAppUrl({ name, interest, message })` that mirrors the demo's `waForm` submit handler: composes `Hi, I'm ${name}. I'm interested in: ${interest}.${message ? ' ' + message : ''}`, URL-encodes it, and returns `https://wa.me/918368426330?text=...`. `Booking.tsx` calls this on submit and `window.open`s the result. No backend call, no validation beyond `required` on name.

## 10. Testing & verification

- One unit test file for `lib/whatsapp.ts` (query-param encoding, interest-type mapping, message-omitted case).
- No broader automated suite — this is a static marketing site with no other business logic.
- Manual verification in-browser before calling the work done: hero scroll behavior at normal speed, `prefers-reduced-motion` path, mobile viewport (including that `100dvh` behaves correctly under mobile browser-chrome collapse), and the WhatsApp form producing a correct deep link.
- Target Lighthouse mobile performance ≥ 85; check after the hero is built and tune particle count / pixel ratio cap if short.

## 11. Open items (not blocking initial build, must resolve before launch)

- QR code target URL on the standee — confirm with Nehal.
- Final DNS/hosting target for `www.diwannaaddhyana.com` and where to deploy.
- Real founder bio and any available testimonials — site should not ship with placeholder bio/testimonial copy live.
- Real founder portrait photo, or confirm one needs to be sourced/shot.

## 12. Non-negotiables (explicit prior feedback, do not regress)

- Pinned hero scroll distance stays short (180vh wrapper) — content reachable in well under one full scroll.
- Camera/rotation motion stays subtle and scroll-position-driven, never a large or continuous idle rotation.
- No literal 3D instrument built from primitive shapes — abstract resonance-tunnel only, unless a real 3D tanpura asset becomes available later (flag as a future enhancement, don't attempt to fake it with basic geometry).
- Hero text never sits in an opaque card, never relies on gold-on-gold contrast — scrim approach only.
