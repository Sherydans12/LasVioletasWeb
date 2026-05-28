import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppBubble } from "@/components/shared/WhatsAppBubble";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Infrastructure } from "@/components/sections/Infrastructure";
import { MatriculaCTA } from "@/components/sections/MatriculaCTA";
import { Contact } from "@/components/sections/Contact";
import { LatestActivities } from "@/components/sections/LatestActivities";
import { GalleryCarouselSection } from "@/components/sections/GalleryCarouselSection";

/** Contenido dinámico (noticias, galería) desde PostgreSQL. */
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <LatestActivities />
        <About />
        <Services />
        <GalleryCarouselSection />
        <Infrastructure />
        <MatriculaCTA />
        <Contact />
      </main>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}
