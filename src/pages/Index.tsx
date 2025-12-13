import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OccasionsSection } from "@/components/home/OccasionsSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { OfferBanner } from "@/components/home/OfferBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Banner is now the top element */}
        <OfferBanner />
        <OccasionsSection />
        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
