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
