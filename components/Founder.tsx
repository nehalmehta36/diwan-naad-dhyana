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
