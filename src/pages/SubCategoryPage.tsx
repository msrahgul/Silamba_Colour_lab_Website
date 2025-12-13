import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, ShoppingBag, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-display font-bold mb-4 text-foreground">Category not found</h1>
        <p className="text-muted-foreground mb-8">The category you are looking for does not exist.</p>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Modern Header Section */}
        <section className="relative bg-muted/30 py-12 lg:py-20 border-b border-border/50">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Collections
              </Link>

              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {category.name}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {category.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="container mx-auto px-4 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm font-medium text-muted-foreground">
              {subCategories.length} Products Found
            </p>
          </div>

          {subCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-3xl bg-muted/10">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
              <p className="text-muted-foreground max-w-md text-center mb-6">
                We haven't added any products to this category yet. Please check back later or browse other collections.
              </p>
              <Link to="/products">
                <Button variant="outline">Browse All Categories</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {subCategories.map((subCat, index) => (
                <motion.a
                  key={subCat.id}
                  href={subCat.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group block bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={subCat.image}
                      alt={subCat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay Action Button */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-background/90 backdrop-blur-sm text-foreground px-6 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                        View Details <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-2">
                      <h3 className="font-display text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {subCat.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Starting at</span>
                        <span className="text-lg font-bold text-primary">{subCat.price || "Contact for Price"}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
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
