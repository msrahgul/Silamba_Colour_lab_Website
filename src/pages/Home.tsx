import React from 'react';
import Banner from '../components/Banner';
import CategoryGrid from '../components/CategoryGrid';
import OccasionGrid from '../components/OccasionGrid';
import AdvertisementComponent from '../components/AdvertisementComponent';
import { useData } from '../hooks/useData';

const Home: React.FC = () => {
  const { data, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="loading-shimmer w-32 h-32 rounded-full mx-auto mb-8"></div>
          <div className="loading-shimmer w-48 h-6 rounded mx-auto mb-4"></div>
          <div className="loading-shimmer w-32 h-4 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 card-modern max-w-md mx-4">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to load content</h3>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Banner Section */}
      <section className="relative">
        <Banner banners={data.banners} />
      </section>

      {/* Top Advertisement */}
      <AdvertisementComponent 
        advertisements={data.advertisements || []} 
        position="home-top"
        className="animate-fade-in"
      />

      {/* Categories Section */}
      <section className="py-16 animate-fade-in-delay">
        <CategoryGrid categories={data.categories} />
      </section>

      {/* Middle Advertisement */}
      <AdvertisementComponent 
        advertisements={data.advertisements || []} 
        position="home-middle"
        className="animate-slide-up"
      />

      {/* Occasions Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 animate-fade-in">
        <OccasionGrid occasions={data.occasions} />
      </section>

      {/* Bottom Advertisement */}
      <AdvertisementComponent 
        advertisements={data.advertisements || []} 
        position="home-bottom"
        className="animate-fade-in-delay"
      />

      {/* Floating Advertisement */}
      <AdvertisementComponent 
        advertisements={data.advertisements || []} 
        position="floating"
      />

      
      
    </div>
  );
};

export default Home;
