import React from 'react';
import { Camera, Users, Heart, Gift } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gray-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About us</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Capturing memories, creating art, preserving moments that matter most
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          {/* Our Story */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Established in 2000, Silamba Colour Lab & Studio has been a trusted name in photography in Dindigul. 
              Conveniently located near the bus stand, we specialize in capturing life's most cherished moments 
              with precision and creativity.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From weddings and corporate events to personal shoots, every moment is preserved with artistic integrity. 
              Over two decades, our commitment to excellence has made us a preferred choice for clients seeking 
              exceptional photography and personalized imaging services.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-2xl transition-shadow">
              <Camera className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Photography</h3>
              <p className="text-gray-600">Wedding, event, candid, pre/post-wedding shoots captured with creativity and precision.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-2xl transition-shadow">
              <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Corporate & Event Shoots</h3>
              <p className="text-gray-600">Professional coverage for conferences, seminars, and business events.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-2xl transition-shadow">
              <Gift className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Personalized Photo Gifts</h3>
              <p className="text-gray-600">Transforming memories into lasting keepsakes with custom engraving and gift items.</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Equipment</h3>
              <p className="text-gray-600">State-of-the-art cameras and lighting for superior quality photos and prints.</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Experienced Team</h3>
              <p className="text-gray-600">Professional photographers with years of expertise in various photography styles.</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Service</h3>
              <p className="text-gray-600">Tailored sessions and packages to meet your unique needs and vision.</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Keepsakes</h3>
              <p className="text-gray-600">personalized gifts that preserve memories beautifully.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
