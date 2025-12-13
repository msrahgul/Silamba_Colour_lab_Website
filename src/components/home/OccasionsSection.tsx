import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Gift, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { RedirectModal } from "@/components/ui/RedirectModal";

export const OccasionsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [redirectState, setRedirectState] = useState<{ isOpen: boolean; url: string }>({
    isOpen: false,
    url: "",
  });

  const { data: occasions = [] } = useQuery({
    queryKey: ["occasions"],
    queryFn: api.getOccasions,
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleOccasionClick = (url?: string) => {
    if (url) {
      setRedirectState({ isOpen: true, url });
    }
  };

  return (
    <section className="py-12 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
              <Gift className="w-3 h-3" />
              <span>Perfect For Every Moment</span>
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Shop by Occasion
            </h2>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="h-8 w-8 rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="h-8 w-8 rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 snap-x snap-mandatory"
        >
          {occasions.map((occasion, index) => (
            <motion.div
              key={occasion.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-[240px] snap-start cursor-pointer group"
              onClick={() => handleOccasionClick(occasion.link)}
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3">
                <img
                  src={occasion.image}
                  alt={occasion.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg leading-none mb-1">{occasion.name}</h3>
                  <p className="text-xs text-white/80 line-clamp-2">{occasion.description}</p>
                </div>

                {/* External Link Icon */}
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <RedirectModal
        isOpen={redirectState.isOpen}
        onClose={() => setRedirectState({ ...redirectState, isOpen: false })}
        onConfirm={() => {
          window.open(redirectState.url, "_blank");
          setRedirectState(prev => ({ ...prev, isOpen: false }));
        }}
        url={redirectState.url}
      />
    </section>
  );
};
