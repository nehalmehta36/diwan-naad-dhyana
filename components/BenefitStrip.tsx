"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";

const ICONS = ["♪", "✿", "◐", "♡", "☾"];

export default function BenefitStrip() {
  return (
    <section className="flex flex-wrap justify-center bg-ink px-[4vw] py-8 text-cream-deep">
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
    </section>
  );
}
