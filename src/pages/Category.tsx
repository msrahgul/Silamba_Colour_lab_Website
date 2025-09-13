// Updated Category.tsx with proper image handling and square aspect ratios

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import SubcategoryList from '../components/SubcategoryList';
import AdvertisementComponent from '../components/AdvertisementComponent';
import { useData } from '../hooks/useData';

const Category: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-shimmer w-16 h-16 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load data
          </h2>
          <p className="text-gray-600 mb-4">
            Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const category = data.categories.find(cat => cat.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Category Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested category could not be found.
          </p>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Square Image */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={category.headerImage || category.image}
            alt={category.title}
            className="w-full h-full object-cover opacity-30"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = category.image;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <Link 
              to="/" 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              {category.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {category.description}
            </p>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Professional photography services tailored to capture your perfect moments
            </p>
          </div>
        </div>
      </div>

      {/* Category Image Display - Square Aspect Ratio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Category Image - Square */}
          <div className="lg:col-span-1">
            <div className="card-modern overflow-hidden animate-fade-in">
              <div className="aspect-square relative group">
                <img
                  src={category.image}
                  alt={`${category.title} photography services`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg font-semibold mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-200">{category.subcategories.length} Products Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our {category.title} Products
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover our comprehensive range of {category.title.toLowerCase()} photography services. 
                Each Product is carefully crafted to meet your unique needs and exceed your expectations.
              </p>
            </div>

            {/* Service Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-center p-6 bg-white rounded-xl shadow-soft">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {category.subcategories.length}
                </div>
                <div className="text-gray-600">Products</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-soft">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  10+
                </div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-soft md:col-span-1 col-span-2">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Advertisement */}
      <AdvertisementComponent 
        advertisements={data.advertisements} 
        position="category-top"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
      />

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our specialized {category.title.toLowerCase()} Products, 
            each designed to capture your unique story with artistic excellence.
          </p>
        </div>

        {category.subcategories.length > 0 ? (
          <SubcategoryList subcategories={category.subcategories} />
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl text-gray-300 mb-6">📸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Products available at the moment.
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're working on adding new services to this category. 
              Check back soon or contact us for custom requests.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link to="/contact" className="btn-primary">
                Contact Us
              </Link>
              <Link to="/" className="btn-secondary">
                Browse Other Categories
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Advertisement */}
      <AdvertisementComponent 
        advertisements={data.advertisements} 
        position="category-bottom"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
      />

      
    </div>
  );
};

export default Category;