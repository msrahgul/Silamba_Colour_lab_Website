import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export const OfferBanner = () => {
  const [apiInstance, setApiInstance] = useState<CarouselApi>();

  const { data: banners = [] } = useQuery({
    queryKey: ["banners"],
    queryFn: api.getBanners,
  });

  // Filter active banners
  const activeBanners = banners.filter(b => b.isActive);

  // Auto-play logic
  useEffect(() => {
    if (!apiInstance) return;

    const autoPlayInterval = setInterval(() => {
      if (apiInstance.canScrollNext()) {
        apiInstance.scrollNext();
      } else {
        apiInstance.scrollTo(0); // Loop back to start
      }
    }, 5000); // 5 seconds loop

    // Stop autoplay on user interaction
    const onSelect = () => {
      // Optional: Reset timer on interaction if desired, 
      // but simple interval is usually robust enough for simple banners
    };

    apiInstance.on("select", onSelect);

    return () => {
      clearInterval(autoPlayInterval);
      apiInstance.off("select", onSelect);
    };
  }, [apiInstance]);


  if (activeBanners.length === 0) return null;

  return (
    <section className="pt-16 lg:pt-20 bg-background group">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <Carousel
          setApi={setApiInstance}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative rounded-2xl overflow-hidden shadow-lg"
        >
          <CarouselContent>
            {activeBanners.map((banner) => (
              <CarouselItem key={banner.id}>
                <a
                  href={banner.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative w-full h-full cursor-pointer bg-muted"
                >
                  {/* Desktop Image */}
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="hidden md:block w-full h-auto object-cover max-h-[500px]"
                  />

                  {/* Mobile Image */}
                  <img
                    src={banner.mobileImage || banner.image}
                    alt={banner.title}
                    className="md:hidden w-full h-auto object-cover max-h-[500px]"
                  />
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons (only show if multiple banners) */}
          {activeBanners.length > 1 && (
            <>
              <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" />
              <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
};
