import React, { useState, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import Registerimg from "../Layout/Image/Registerimg.png";
import Navbar from "../Layout/Navbar";
import logo from "../Layout/Image/logo.jpeg";
import Glogo from "../Layout/Image/Glogo.png";
import axios from "axios"; 
import Otp from "./OTP";
import * as CryptoJS from 'crypto-js';
import { Link } from "react-router-dom";




const Register: React.FC = () => {
  const location = useLocation(); // Get location
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur"; // Determine user type
  const navigate = useNavigate()

  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailref = useRef<HTMLInputElement>(null);
  const PasswordRef = useRef<HTMLInputElement>(null);
  const confirmPassRef = useRef<HTMLInputElement>(null);

  const [firstnameError, setfirstnameError] = useState('');
  const [lastnameError, setlastnameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPassError] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setfirstnameError('');
    setlastnameError('');
    setPhoneError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPassError('');

    if (!firstnameRef.current || !lastnameRef.current || !emailref.current || !phoneRef.current || !PasswordRef.current || !confirmPassRef.current) {
      console.error("Refs are not initialized");
      return;
    }
    // const encryptedEmail = CryptoJS.AES.encrypt(emailref.current.value, "emailsecret").toString();
    const email = emailref.current.value
    console.log("Encrypted Email:", email);
    
    try {
      const formData = new FormData();
      formData.append("firstname", firstnameRef.current.value);
      formData.append("lastname", lastnameRef.current.value);
      formData.append("email", emailref.current.value);
      formData.append("phone", phoneRef.current.value);
      formData.append("password", PasswordRef.current.value);
      formData.append("confirmpassword", confirmPassRef.current.value);


      for (let [key, value] of formData.entries()) {
        console.log(`${key}:${value}`)
     }
      const response = await axios.post(`http://localhost:3009/api/${userType}/register`, formData,{
        headers:{
          'Content-Type' : 'application/json'
        }
      });
      console.log("Registration successful:", response.data);
       if(response){
        navigate(`/${userType}/otp?email=${email}`)
      }
    } catch (error) {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };




  return (
    <>
      <Navbar
        logoUrl={logo}
        links={[
          { label: "Home", href: "/" },
          { label: "Explore Premium", href: "/explore-premium" },
          { label: "About Us", href: "/about-us" },
          { label: "Login", href: "/login" },
        ]}
      />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-2 sm:p-4 relative">
        <div
          className="bg-white rounded-[2%] shadow-lg p-4 sm:p-6 md:p-10 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "80vh",
            height: "auto",
          }}
        >
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left p-4 sm:p-6 relative">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold mb-2 sm:mb-4 text-gray-800">
              We Help You To Grow with
            </h1>
            <h2
              className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6"
              style={{ color: "#00186E" }}
            >
              PITCHIFY
            </h2>
            <img
              src={Registerimg}
              alt="3D figure with briefcase"
              className="hidden md:block absolute top-44 w-[700px] md:w-[900px] lg:w-[1200px] opacity-80 pointer-events-none"
            />
          </div>

          <div className="flex-1 p-4 sm:p-6 md:p-10">
            <h3 className="text-md sm:text-lg md:text-xl font-bold text-gray-700 text-center mb-4 sm:mb-6">
              REGISTER AS {userType.toUpperCase()}
            </h3>
            <button className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg mb-4">
              <img src={Glogo} alt="Google logo" className="w-5 h-5 mr-2" />
              CONTINUE WITH GOOGLE
            </button>
            <form onSubmit={handleRegister} className="space-y-6">
              <input
                ref={firstnameRef}
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
                ref={lastnameRef}
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
                ref={emailref}
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
                ref={phoneRef}
                type="number"
                placeholder="Phone"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
                ref={PasswordRef}
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
                ref={confirmPassRef}
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <button
                type="submit"
                className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-300"
                style={{ background: "#00186E" }}
              >
                SIGN UP
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              If you already have an account?{" "}
              <Link
                to={`/${userType}/login`} // Dynamic link based on user type
                className="font-semibold hover:underline"
                style={{ color: "#00186E" }}
              >
                LOGIN
             </Link>
            </p>
          </div>
        </div>
      </div>
         </>
  );
};

export default Register;
