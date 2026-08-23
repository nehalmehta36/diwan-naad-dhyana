import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="px-[6vw] pb-12 pt-8 text-center text-sm text-ink-soft">
      © {site.hero.wordmark} — Founder: {site.founder.name} &nbsp;|&nbsp;{" "}
      <a href={`tel:${site.contact.phone.replace(/[^0-9+]/g, "")}`}>{site.contact.phone}</a>{" "}
      &nbsp;|&nbsp; {site.contact.website} &nbsp;|&nbsp;{" "}
      <a href={site.contact.instagramUrl} target="_blank" rel="noopener noreferrer">
        {site.contact.instagram}
      </a>
    </footer>
  );
}
