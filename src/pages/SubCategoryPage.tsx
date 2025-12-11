import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const SubCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

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

  if (catLoading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Category not found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Banner */}
        <section className="relative h-64 lg:h-80 mb-12">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />

          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-background/80 hover:text-primary mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back to Home</span>
                </Link>

                <h1 className="font-display text-4xl lg:text-5xl font-bold text-background mb-2">
                  {category.name}
                </h1>
                <p className="text-background/70 text-lg max-w-xl">
                  {category.description}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sub-Categories Grid */}
        <section className="container mx-auto px-4 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mb-8"
          >
            Showing {subCategories.length} products in {category.name}
          </motion.p>

          {subCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subCategories.map((subCat, index) => (
                <motion.a
                  key={subCat.id}
                  href={subCat.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group block bg-card rounded-2xl overflow-hidden shadow-card hover-lift"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={subCat.image}
                      alt={subCat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* External Link Badge */}
                    <div className="absolute top-3 right-3 p-2 rounded-full bg-card/90 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {subCat.name}
                    </h3>
                    {subCat.price && (
                      <p className="text-primary font-medium">
                        Starting from {subCat.price}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>View on Store</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SubCategoryPage;
