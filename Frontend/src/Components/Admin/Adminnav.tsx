import React from "react";
import logo from "../Layout/Image/logo.jpeg";


const Adminnav: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent z-50">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-13"
          />
        </div>
      </div>
    </nav>
  );
};

export default Adminnav;
