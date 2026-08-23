"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { buildWhatsAppUrl, type InterestType } from "@/lib/whatsapp";

const INTEREST_OPTIONS: InterestType[] = site.offerings.map((o) => o.title);

export default function Booking() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState<InterestType>(INTEREST_OPTIONS[0]);
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const url = buildWhatsAppUrl({ name: name.trim(), interest, message: message.trim() });
    window.open(url, "_blank", "noopener,noreferrer");
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
          <div className="mb-2.5 text-sm text-cream-deep">
            📱{" "}
            <a href={`tel:${site.contact.phone.replace(/[^0-9+]/g, "")}`}>
              {site.contact.phone}
            </a>
          </div>
          <div className="mb-2.5 text-sm text-cream-deep">🌐 {site.contact.website}</div>
          <div className="mb-2.5 text-sm text-cream-deep">
            📷{" "}
            <a href={site.contact.instagramUrl} target="_blank" rel="noopener noreferrer">
              {site.contact.instagram}
            </a>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-cream-deep/25 bg-cream-deep/[0.06] px-4 py-3 text-sm text-cream placeholder:text-cream-deep/60"
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
            className="min-h-[90px] resize-y rounded-xl border border-cream-deep/25 bg-cream-deep/[0.06] px-4 py-3 text-sm text-cream placeholder:text-cream-deep/60"
          />
          <button
            type="submit"
            className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-bold text-[#0c2a17]"
          >
            Send via WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
