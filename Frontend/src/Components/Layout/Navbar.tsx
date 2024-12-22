import React, { useState } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  logoUrl: string;
  links: { label: string; href: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ logoUrl, links }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent z-50">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center">
          <img
            src={logoUrl}
            alt="Logo"
            className="h-12 w-13"
          />
        </div>

        {/* Navigation Links Container */}
        <div className="hidden lg:flex bg-white shadow-lg rounded-full px-6 py-2 items-center space-x-6">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className={`${
                link.label === "Login"
                  ? "px-4 py-2 bg-indigo-900 text-white rounded-full hover:bg-indigo-700"
                  : "text-black text-sm font-medium hover:text-indigo-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Icon */}
        <button 
          className="lg:hidden text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg rounded-lg px-6 py-4 space-y-4">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="text-black text-sm font-medium hover:text-indigo-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
