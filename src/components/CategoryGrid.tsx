import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { ArrowRight, Camera } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <section className="container mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Camera size={16} className="mr-2" />
          Our Products
        </div>
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
          Discover Handpicked Masterpieces
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Designed Just for You. Crafted with Care. Guaranteed to Impress.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="group card-modern overflow-hidden hover-lift animate-slide-up block"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Image Container */}
            <div className="relative h-85 overflow-hidden">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Service Count Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                {category.subcategories.length} Products
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                {category.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                {category.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Hover Effect Decoration */}
            <div className="absolute inset-0 border-2 border-red-500/0 group-hover:border-red-500/20 rounded-2xl transition-colors duration-300 pointer-events-none" />
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16 animate-fade-in-delay">
        <div className="card-gradient p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-600 mb-6">
            We offer custom photography solutions tailored to your unique needs
          </p>
          <Link to="/contact" className="btn-primary inline-block">
            Contact Us for Custom Services
          </Link>
        </div>
      </div>
    </section>
  );
};
export default CategoryGrid;
