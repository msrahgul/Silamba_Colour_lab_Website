import React from 'react';
import { Link } from 'react-router-dom';
import { Occasion } from '../types';
import { Calendar, Star } from 'lucide-react';

interface OccasionGridProps {
  occasions: Occasion[];
}

const OccasionGrid: React.FC<OccasionGridProps> = ({ occasions }) => {
  return (
    <section className="container mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Calendar size={16} className="mr-2" />
          Special Occasions
        </div>
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
          Celebrate Life's Special Moments
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
         Discover a collection of thoughtful and unique photo gifts designed to make every occasion even more memorable
        </p>
      </div>

      {/* Occasions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {occasions.map((occasion, index) => (
          <Link
            key={occasion.id}
            to={`/occasion/${occasion.slug}`}
            className="group card-modern overflow-hidden hover-lift animate-slide-up"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={occasion.image}
                alt={occasion.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              


              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                  {occasion.title}
                </h3>
                <p className="text-sm opacity-90 line-clamp-2">
                  {occasion.description}
                </p>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 border-2 border-red-500/0 group-hover:border-red-500/30 rounded-2xl transition-colors duration-300 pointer-events-none" />
            
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16 animate-fade-in-delay">
        <div className="card-gradient p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="text-red-600 mr-3" size={32} />
            <h3 className="text-2xl font-bold text-gray-800">
              Planning a Special Event?
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Let us create a custom photography package for your unique celebration
          </p>
          <button className="btn-primary">
            Get Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default OccasionGrid;
