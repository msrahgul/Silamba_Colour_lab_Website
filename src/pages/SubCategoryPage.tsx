import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RedirectModal } from "@/components/ui/RedirectModal";

const SubCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [redirectState, setRedirectState] = useState<{ isOpen: boolean; url: string }>({
    isOpen: false,
    url: "",
  });

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

  const { data: allSubCategories = [], isLoading: subLoading } = useQuery({
    queryKey: ["subcategories"],
    queryFn: api.getSubCategories,
  });

  const category = categories.find((c) => c.id === categoryId);
  const subCategories = allSubCategories.filter((s) => s.categoryId === categoryId);

  const handleProductClick = (url: string) => {
    setRedirectState({ isOpen: true, url });
  };

  const confirmRedirect = () => {
    window.open(redirectState.url, "_blank");
    setRedirectState({ ...redirectState, isOpen: false });
  };

  if (catLoading || subLoading) return <div className="h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  if (!category) return (
    <div className="h-screen flex flex-col items-center justify-center bg-background space-y-4">
      <h1 className="text-2xl font-bold">Category Not Found</h1>
      <Link to="/"><Button variant="outline">Return Home</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      <main className="pt-24 lg:pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8">

          {/* Simple Professional Header - No Big Image */}
          <div className="max-w-4xl mb-12 border-b border-border/40 pb-8">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {category.description}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search items..." className="pl-9" />
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {subCategories.length} Items Found
            </div>
          </div>

          {/* Clean Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            <AnimatePresence>
              {subCategories.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(item.externalUrl)}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted rounded-xl mb-4 border border-border/50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-black">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">Detailed View</span>
                      {item.price && (
                        <span className="font-medium text-foreground">{item.price}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {subCategories.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <RedirectModal
        isOpen={redirectState.isOpen}
        onClose={() => setRedirectState({ ...redirectState, isOpen: false })}
        onConfirm={confirmRedirect}
        url={redirectState.url}
      />
    </div>
  );
};

export default SubCategoryPage;
