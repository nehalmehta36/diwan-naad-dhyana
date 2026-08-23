"use client";

import dynamic from "next/dynamic";
import { useRef, useMemo } from "react";
import { site } from "@/content/site";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const copy1Ref = useRef<HTMLDivElement>(null);
  const copy2Ref = useRef<HTMLDivElement>(null);
  const copy3Ref = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const copyRefs = useMemo(() => [copy1Ref, copy2Ref, copy3Ref] as const, []);
  const closingLines = site.hero.closingLine.split("\n");

  return (
    <div ref={heroSectionRef} className="relative h-[180vh]">
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_30%,#3a2818_0%,#241708_60%,#170f07_100%)]">
        <HeroScene
          heroSectionRef={heroSectionRef}
          copyRefs={copyRefs}
          scrollCueRef={scrollCueRef}
        />
        <div className="hero-scrim" />
        <div ref={copy1Ref} className="hero-copy">
          <p className="eyebrow">{site.hero.eyebrow}</p>
          <h1>{site.hero.wordmark}</h1>
          <div className="rule" />
        </div>
        <div ref={copy2Ref} className="hero-copy" style={{ opacity: 0 }}>
          <p className="shloka" lang="sa">
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
              {site.hero.primaryCta}
            </a>
            <a className="btn-ghost" href="#offerings">
              {site.hero.secondaryCta}
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
