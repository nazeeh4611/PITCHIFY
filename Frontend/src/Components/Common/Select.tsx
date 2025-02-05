import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Registerimg from "../Layout/Image/Registerimg.png";
import logo from "../Layout/Image/logo.jpeg";
import shortlogo from "../Layout/Image/shortlogo.png"

const Select: React.FC = () => {


  console.log("this page is select")
  const navigate = useNavigate();

  const handleNavigation = (userType: string) => {
    const route = userType.toLowerCase(); // Convert userType to lowercase to match route structure
    navigate(`/${route}/login`, {
      state: { heading: `LOGIN AS ${userType.toUpperCase()}` },
    });
  };

  return (
    <>
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/" },
          { label: "Explore Premium", href: "/explore-premium" },
          { label: "About Us", href: "/about-us" },
          { label: "Login", href: "/login" },
        ]}
      />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
        <div
          className="bg-white rounded-[2%] shadow-lg p-4 sm:p-6 md:p-10 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "80vh",
            height: "auto",
          }}
        >
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left p-6 relative">
            <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-gray-800 mt-10 md:mt-16">
              We Help You To Grow with
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: "#00186E" }}>
              PITCHIFY
            </h2>
            <img
              src={Registerimg}
              alt="3D figure with briefcase"
              className="hidden md:block absolute top-44 w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] opacity-80 pointer-events-none"
            />
          </div>
          <div className="flex-1 p-4 sm:p-6 md:p-10">
            <h1 className="text-lg md:text-xl font-bold text-gray-700 text-center mb-6 mt-20 md:mt-28">
              START YOUR JOURNEY
            </h1>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleNavigation("Entrepreneur")}
                className="w-1/2 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-300"
                style={{ background: "#00186E" }}
              >
                As Entrepreneur
              </button>
              <button
                onClick={() => handleNavigation("Investor")}
                className="w-1/2 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-300"
                style={{ background: "#00186E" }}
              >
                As Investor
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Select;
