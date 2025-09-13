import React from 'react';
import { Subcategory } from '../types';
import { ExternalLink, ArrowRight, Star, CheckCircle, Sparkles } from 'lucide-react';

interface SubcategoryListProps {
  subcategories: Subcategory[];
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({ subcategories }) => {
  const handleSubcategoryClick = (redirectLink: string) => {
    window.open(redirectLink, '_blank', 'noopener noreferrer');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {subcategories.map((subcategory, index) => (
        <div
          key={subcategory.id}
          className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 animate-slide-up"
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          {/* Premium Badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              Personalised
            </div>
          </div>

          {/* Clickable Image Container with Fixed Aspect Ratio */}
          <div 
            className="relative w-full h-64 sm:h-56 md:h-64 lg:h-56 xl:h-64 overflow-hidden cursor-pointer"
            onClick={() => handleSubcategoryClick(subcategory.redirectLink)}
          >
            <img
              src={subcategory.image}
              alt={subcategory.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop';
              }}
            />
            
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Click Indicator Text */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-red-600 font-semibold text-sm">Click to View Products</span>
              </div>
            </div>

            {/* Floating Action Button */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <div className="bg-white text-red-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8">
            {/* Title Section */}
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                {subcategory.title}
              </h3>
            </div>

            {/* Enhanced Description */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed text-base mb-4 line-height-7">
                {subcategory.description}
              </p>
              
              {/* Key Features */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Excellent Quality
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Fast delivery
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  100% satisfaction guarantee
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-3">
              <button
                onClick={() => handleSubcategoryClick(subcategory.redirectLink)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 sm:py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group/btn"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>View Products</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </div>
              </button>
            </div>
          </div>

          {/* Hover Effect Border */}
          <div className="absolute inset-0 rounded-3xl ring-2 ring-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <pattern id={`pattern-${subcategory.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill={`url(#pattern-${subcategory.id})`} />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubcategoryList;