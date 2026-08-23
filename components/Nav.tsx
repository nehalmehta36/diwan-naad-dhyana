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
