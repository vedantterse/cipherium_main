import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Languages } from "@/components/landing/languages";
import { DemoPreview } from "@/components/landing/demo-preview";
import { CTA } from "@/components/landing/cta";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <DemoPreview />
      <Languages />
      <CTA />
      <Footer />
    </div>
  );
}
