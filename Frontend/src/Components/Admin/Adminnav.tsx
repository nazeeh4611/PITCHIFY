import React from "react";
import logo from "../Layout/Image/logo.jpeg";
import { Menu } from "lucide-react";

interface AdminnavProps {
  toggleSidebar?: () => void;
}

const Adminnav: React.FC<AdminnavProps> = ({ toggleSidebar }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent z-50">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <div className="flex items-center">
          {toggleSidebar && (
            <button 
              className="mr-4 md:hidden" 
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6 text-indigo-950" />
            </button>
          )}
          <img
            src={logo}
            alt="Logo"
            className="h-10 sm:h-12 w-auto"
          />
        </div>
      </div>
    </nav>
  );
};

export default Adminnav;