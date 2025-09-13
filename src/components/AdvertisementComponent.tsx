import React, { useState, useEffect } from 'react';
import { Advertisement } from '../types';
import { ExternalLink, X } from 'lucide-react';

interface AdvertisementComponentProps {
  advertisements: Advertisement[];
  position: 'home-top' | 'home-middle' | 'home-bottom' | 'category-top' | 'category-bottom' | 'floating';
  className?: string;
}

const AdvertisementComponent: React.FC<AdvertisementComponentProps> = ({ 
  advertisements, 
  position,
  className = ''
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showFloatingAd, setShowFloatingAd] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const activeAds = advertisements.filter(ad => ad.active && ad.position === position);
  
  useEffect(() => {
    if (activeAds.length > 1) {
      const timer = setInterval(() => {
        setCurrentAdIndex(prev => (prev + 1) % activeAds.length);
      }, 8000); // Change ad every 8 seconds
      return () => clearInterval(timer);
    }
  }, [activeAds.length]);

  // Auto-hide floating ads after 30 seconds
  useEffect(() => {
    if (position === 'floating') {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [position]);

  if (activeAds.length === 0 || !isVisible) return null;

  const currentAd = activeAds[currentAdIndex];

  const handleAdClick = () => {
    if (currentAd.redirectLink) {
      window.open(currentAd.redirectLink, '_blank', 'noopener noreferrer');
    }
  };

  const closeFloatingAd = () => {
    setShowFloatingAd(false);
    setIsVisible(false);
  };

  // Floating advertisement
  if (position === 'floating' && showFloatingAd) {
    return (
      <div className="ad-floating bg-white rounded-xl shadow-2xl overflow-hidden animate-float z-50">
        <button
          onClick={closeFloatingAd}
          className="absolute top-2 right-2 z-10 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
          aria-label="Close advertisement"
        >
          <X size={16} />
        </button>
        
        <div 
          onClick={handleAdClick}
          className="cursor-pointer group relative overflow-hidden"
        >
          <div className="ad-container">
            <img
              src={currentAd.image}
              alt={currentAd.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-bold text-lg mb-1 leading-tight">{currentAd.title}</h3>
              <p className="text-sm opacity-90 line-clamp-2">{currentAd.description}</p>
              
              <div className="flex items-center mt-2 text-xs font-medium opacity-80">
                <ExternalLink size={12} className="mr-1" />
                Learn More
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline advertisements
  return (
    <div className={`my-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div 
          onClick={handleAdClick}
          className="relative group cursor-pointer card-modern overflow-hidden max-w-4xl mx-auto hover-lift"
        >
          <div className="ad-container">
            <img
              src={currentAd.image}
              alt={currentAd.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="p-8 md:p-12 text-white max-w-2xl">
                <div className="inline-block bg-red-600/90 text-xs font-semibold px-3 py-1 rounded-full mb-4 animate-pulse">
                  SPONSORED
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {currentAd.title}
                </h2>
                
                <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">
                  {currentAd.description}
                </p>
                
                <div className="flex items-center group-hover:translate-x-2 transition-transform duration-300">
                  <span className="font-semibold mr-2">Learn More</span>
                  <ExternalLink size={20} />
                </div>
              </div>
            </div>
            
            {/* Progress indicator for multiple ads */}
            {activeAds.length > 1 && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {activeAds.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentAdIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementComponent;
