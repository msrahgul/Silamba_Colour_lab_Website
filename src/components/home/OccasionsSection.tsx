import { motion } from "framer-motion";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Gift } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const OccasionsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: occasions = [] } = useQuery({
    queryKey: ["occasions"],
    queryFn: api.getOccasions,
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wider mb-2">
              <Gift className="w-4 h-4" />
              <span>Gifting Made Easy</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Shop by Occasion
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors border-border/50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors border-border/50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 -mx-4 px-4 snap-x snap-mandatory"
        >
          {occasions.map((occasion, index) => (
            <motion.div
              key={occasion.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] md:w-[320px] snap-center group cursor-pointer"
            >
              <div className="h-full bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Image Area */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={occasion.image}
                    alt={occasion.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Content Area */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {occasion.name}
                    </h3>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
                    {occasion.description}
                  </p>

                  <div className="flex items-center text-sm font-semibold text-primary gap-2 group/link">
                    <span>Shop Collection</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
