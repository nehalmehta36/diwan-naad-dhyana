import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="px-[6vw] pb-12 pt-8 text-center text-sm text-ink-soft">
      © Diwan Naad Dhyana — Founder: {site.founder.name} &nbsp;|&nbsp; {site.contact.phone}{" "}
      &nbsp;|&nbsp; {site.contact.website} &nbsp;|&nbsp; {site.contact.instagram}
    </footer>
  );
}
