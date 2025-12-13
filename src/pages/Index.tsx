import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OccasionsSection } from "@/components/home/OccasionsSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { OfferBanner } from "@/components/home/OfferBanner";
import { DealsSection } from "@/components/home/DealsSection"; // New import

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Top Banner Slider */}
        <OfferBanner />

        {/* New Special Offers Section - High priority advertising */}
        <DealsSection />

        {/* Featured Products Showcase (Small Cards) */}
        <CategoriesGrid />

        {/* Occasions (With Redirects) */}
        <OccasionsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
