import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Layout: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isContactPage = location.pathname === '/contact';
  const isAboutPage = location.pathname === '/about';
  const isHidden = isAboutPage || isContactPage;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          {!isHidden && (
            <div className="container mx-auto px-4 py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand Section */}
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center mb-6 justify-center">
                    <div className="rounded-xl mr-4 p-2">
                      <img src="logo.png" alt="Logo" className="h-12 w-12 object-contain" />
                    </div>
                    <h3 className="text-2xl font-bold">Silamba Colour Lab & Studio</h3>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed max-w-xs">
                    Capturing memories with passion and precision. Premium photo services & products in Dindigul.
                  </p>
                  <div className="flex space-x-4 justify-center">
                    {[{
                      icon: Facebook, href: 'https://www.facebook.com/www.photoland.in/', label: 'Facebook'
                    },{
                      icon: Instagram, href: 'https://www.instagram.com/silambacolourlab', label: 'Instagram'
                    },{
                      icon: Youtube, href: 'https://www.youtube.com/@Photoland_in', label: 'YouTube'
                    }].map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        className="bg-gray-800 hover:bg-red-600 p-3 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                        aria-label={label}
                      >
                        <Icon size={20} className="text-gray-300 group-hover:text-white transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Services Section - Hidden on mobile */}
                <div className="hidden md:flex justify-center">
                  <div className="flex flex-col items-start text-left">
                    <h4 className="text-lg font-semibold mb-6 text-white text-center w-full">
                      Our Services
                    </h4>
                    <ul className="space-y-3 w-full">
                      {[
                        'Wedding Photography',
                        'Portrait Sessions',
                        'Corporate Events',
                        'Product Photography',
                        'Real Estate',
                        'Family Portraits'
                      ].map((service) => (
                        <li key={service}>
                          <a
                            href="#"
                            className="text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center"
                          >
                            <span className="w-2 h-2 bg-red-600 rounded-full mr-3 transition-transform"></span>
                            {service}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Contact Info Section - Hidden on mobile */}
                <div className="hidden md:flex justify-center">
                  <div className="flex flex-col items-start text-left">
                    <h4 className="text-lg font-semibold mb-6 text-white text-center w-full">
                      Get in Touch
                    </h4>
                    <div className="space-y-4 w-full">
                      <div className="flex items-start">
                        <div className="bg-red-600/20 p-2 rounded-lg mr-3 mt-1">
                          <MapPin size={16} className="text-red-400" />
                        </div>
                        <div>
                          <p className="text-gray-300 text-sm text-left">
                            7, Thiruvalluvar Salai<br />
                            Opp Bus Stand, Dindigul-624001
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-red-600/20 p-2 rounded-lg mr-3">
                          <Phone size={16} className="text-red-400" />
                        </div>
                        <a href="tel:+919790497138" className="text-gray-300 hover:text-red-400 transition-colors text-left">
                          +91 97904 97138
                        </a>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-red-600/20 p-2 rounded-lg mr-3">
                          <Mail size={16} className="text-red-400" />
                        </div>
                        <a href="mailto:silambacolourlab@gmail.com" className="text-gray-300 hover:text-red-400 transition-colors text-left">
                          silambacolourlab@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Bottom Bar */}
          {!isHidden && (
            <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
                {/* Left side */}
                <p>
                  © {currentYear} Silamba Colour Lab & Studio. All rights reserved.
                </p>

                {/* Right side with padding */}
                <p className="mt-2 md:mt-0 pr-6">
                  Designed and Developed by{' '}
                  <a
                    href="https://www.m.s.rahgul.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:underline"
                  >
                    M.S. Rahgul
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
