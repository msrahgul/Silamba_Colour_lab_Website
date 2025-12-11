import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { OccasionsSection } from "@/components/home/OccasionsSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { OfferBanner } from "@/components/home/OfferBanner";


const Index = () => {
  // Data initialization is handled by json-server now


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OfferBanner />
      <main>
        <Hero />
        <OccasionsSection />
        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
