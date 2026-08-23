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
