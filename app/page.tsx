import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BenefitStrip from "@/components/BenefitStrip";
import Offerings from "@/components/Offerings";
import Founder from "@/components/Founder";
import Testimonials from "@/components/Testimonials";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <BenefitStrip />
        <Offerings />
        <Founder />
        <Testimonials />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
