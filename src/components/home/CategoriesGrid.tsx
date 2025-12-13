import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const CategoriesGrid = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

  // Filter only featured categories for the home page
  const featuredCategories = categories.filter(c => c.isFeatured);

  if (featuredCategories.length === 0) return null;

  return (
    <section id="showcase" className="py-12 lg:py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-border/40 pb-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Bestsellers</span>
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Trending Products
            </h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            View All Products <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Small Cards Grid for "Advertising" look */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={`/category/${category.id}`}
                className="group block h-full"
              >
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-secondary mb-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay for better text readability if needed, or just hover effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                  {/* Badge */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0">
                    View
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <h3 className="font-semibold text-sm md:text-base text-foreground leading-tight group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
