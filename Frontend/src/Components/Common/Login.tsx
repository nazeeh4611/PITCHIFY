import { useLocation } from "react-router-dom";
import React from "react";
import Navbar from "../Layout/Navbar"; 
import Registerimg from "../Layout/Image/Registerimg.png"; 
import logo from "../Layout/Image/logo.jpeg"; 
import Glogo from "../Layout/Image/Glogo.png"; 
import Register from "./Register";


const Login: React.FC = () => {
  const location = useLocation();
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur"; // Determine user type


  return (
    <>
      <Navbar
        logoUrl={logo}
        links={[
          { label: "Home", href: "/" },
          { label: "Explore Premium", href: "/explore-premium" },
          { label: "About Us", href: "/about-us" },
          { label: "Login", href: "/select" },
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
            <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-gray-800">
              We Help You To Grow with
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: "#00186E" }}>
              PITCHIFY
            </h2>
            <img
              src={Registerimg}
              alt="3D figure with briefcase"
              className="absolute top-44 left-0 w-[500px] md:w-[700px] lg:w-[1000px] opacity-80 pointer-events-none"
            />
          </div>
          <div className="flex-1 p-6 md:p-10">
            <h3 className="text-lg md:text-xl font-bold text-gray-700 text-center mb-8">
              LOGIN AS {userType.toUpperCase()}
            </h3>
            <button className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg mb-6">
              <img src={Glogo} alt="Google logo" className="w-5 h-5 mr-2" />
              CONTINUE WITH GOOGLE
            </button>
            <form className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <button
                type="submit"
                className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-300"
                style={{ background: "#00186E" }}
              >
                SIGN IN
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
              If you don't have an account?{" "}
              <a href={`/${userType}/register`} className="font-semibold hover:underline" style={{ color: "#00186E" }}>
                REGISTER
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
