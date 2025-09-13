import React, { useState, useEffect } from 'react';
import { Banner as BannerType } from '../types';

interface BannerProps {
  banners: BannerType[];
}

const Banner: React.FC<BannerProps> = ({ banners }) => {
  const [banner, setBanner] = useState<BannerType | null>(null);

  useEffect(() => {
    const activeBanners = banners.filter(b => b.active);
    if (activeBanners.length > 0) {
      setBanner(activeBanners[0]);
    }
  }, [banners]);

  if (!banner) return null;

  return (
    <div className="w-full bg-gradient-to-b from-grey-50 via-white to-grey-100 mt-12 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        
        {/* Banner Image Container */}
        <div className="flex justify-center items-center">
          <picture>
            <source media="(min-width: 768px)" srcSet={banner.imageDesktop} />
            <img
              src={banner.imageMobile}
              alt={banner.title}
              className="max-w-full h-auto object-contain rounded-lg shadow-lg transition-transform duration-1000 hover:scale-105"
            />
          </picture>
        </div>

      </div>
    </div>
  );
};

export default Banner;
