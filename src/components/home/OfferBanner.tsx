import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { STORAGE_KEYS, Banner } from "@/data/mockData";

export const OfferBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);

  const { data: serverBanner } = useQuery({
    queryKey: ["banner"],
    queryFn: api.getBanner,
  });

  useEffect(() => {
    // Check if banner was shown this session
    const shown = sessionStorage.getItem(STORAGE_KEYS.BANNER_SHOWN);
    if (!shown && serverBanner && serverBanner.isActive) {
      setBanner(serverBanner);
      // Small delay for better UX
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, [serverBanner]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_KEYS.BANNER_SHOWN, "true");
  };

  if (!banner) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-card rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            {/* Banner Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={banner.image}
                alt="Special Offer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                <Gift className="w-4 h-4" />
                <span>Special Offer</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {banner.title}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {banner.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="font-medium"
                  onClick={() => {
                    handleClose();
                    if (banner.ctaLink) {
                      window.location.href = banner.ctaLink;
                    }
                  }}
                >
                  {banner.ctaText}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleClose}
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
