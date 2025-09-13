import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHomePage = location.pathname === "/";
  const isaboutPage = location.pathname === "/about";
  const iscontactPage = location.pathname === "/contact";
  const isTransparent =  isaboutPage && !scrolled || iscontactPage && !scrolled;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Define nav link classes differently based on header transparency
  // When transparent, default white and bold, hover/active dark red
  // Else, default dark gray, hover red, active red
  const getNavLinkClasses = (href: string) => {
    if (isTransparent) {
      return `font-bold ${
        isActive(href)
          ? "text-red-600"
          : "text-white"
      } hover:text-red-600 relative inline-block px-2 py-1 transition-colors duration-200`;
    } else {
      return `font-medium ${
        isActive(href)
          ? "text-red-700"
          : "text-gray-700"
      } hover:text-red-600 relative inline-block px-2 py-1 transition-colors duration-200`;
    }
  };

  // Underline indicator color based on header state and active link
  const getUnderlineClasses = () => {
    return isTransparent ? "bg-red-600" : "bg-red-600";
  };

  // Admin button classes
  const adminBtnClass = `btn-primary text-xs sm:text-sm px-4 sm:px-6 rounded font-semibold ml-2 sm:ml-4 ${
    isTransparent ? "bg-red-600 bg-opacity-90 hover:bg-opacity-95 text-white" : ""
  }`;

  return (
    <header
      className={`${isTransparent ? "bg-transparent py-5" : "bg-white py-4 shadow-md"} fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-10 sm:h-10">
          <Link to="/" className="flex items-center group transition-transform duration-300" aria-label="Home">
            <img
              src="/logo.png"
              alt="Silamba Colour Lab & Studio"
              className={`h-12 w-auto sm:h-11 transition-opacity ${isTransparent ? "opacity-90" : "opacity-100"}`}
              style={{ minWidth: 40 }}
            />
            {!isTransparent && (
              <div className="ml-2 min-w-0">
                <h1 className="gradient-text font-bold text-lg sm:text-2xl truncate" style={{ lineHeight: 1.05 }}>
                  Silamba Colour Lab & Studio
                </h1>
                <p className="text-xs text-gray-500 truncate max-w-[300px]">
                  Professional photography Service in Dindigul
                </p>
              </div>
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map(({ name, href }) => (
              <Link key={name} to={href} className={getNavLinkClasses(href)}>
                {name}
                {isActive(href) && <span className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${getUnderlineClasses()}`} />}
              </Link>
            ))}
            <Link to="/cms/login" className={adminBtnClass}>
              Admin
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${isTransparent ? "text-white" : "text-black"}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={`md:hidden bg-white shadow-lg animate-slide-down z-40 ${isTransparent ? "bg-opacity-95" : ""}`}>
          <nav className="container mx-auto px-4 py-5 space-y-2">
            {navigation.map(({ name, href }) => (
              <Link
                key={name}
                to={href}
                onClick={() => setIsOpen(false)}
                className={`block rounded py-2 text-center font-medium text-base transition-colors ${
                  isActive(href) ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600"
                }`}
              >
                {name}
              </Link>
            ))}
            <Link
              to="/cms/login"
              onClick={() => setIsOpen(false)}
              className="block rounded py-2 mt-3 text-center btn-primary text-xs"
            >
              Admin
            </Link>
            <hr className="my-3 border-gray-200" />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
