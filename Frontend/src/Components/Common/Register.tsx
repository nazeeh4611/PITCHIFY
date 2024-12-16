import React, { useState } from "react";
import Registerimg from "../Layout/Image/Registerimg.png";
import Navbar from "../Layout/Navbar";
import logo from '../Layout/Image/logo.jpeg';
import Glogo from "../Layout/Image/Glogo.png";
import Select from "./Select";
import axios from "axios";
import { Formerrors, hasFormerror, inputValidation, isFormEmpty } from "../../validation/validation";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: ""
  });

  const [error, setError] = useState<Formerrors>({});

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target;
    const error = inputValidation(name,value);
    setFormData({ ...formData,[name]:value});
  }




  const hanldeRegister = async (e:React.FormEvent)=>{
    e.preventDefault();


    if(hasFormerror(error)&&isFormEmpty(formData)){
      try {
        const response = await axios.post("http://localhost:3009/register",formData,{
          headers:{
            "Content-Type":"multipart/form-data"
          },
        });


        console.log(response)
      } catch (error) {
        
      }
    }
  }


  console.log("this page is regisetr")

  return (
    <>
      <Navbar
        logoUrl={logo}
        links={[
          { label: 'Home', href: '/' },
          { label: 'Explore Premium', href: '/explore-premium' },
          { label: 'About Us', href: '/about-us' },
          { label: 'Login', href: '/login' },
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
              REGISTER AS ENTREPRENEUR
            </h3>
            <button className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg mb-4">
              <img
                src={Glogo}
                alt="Google logo"
                className="w-5 h-5 mr-2"
              />
              CONTINUE WITH GOOGLE
            </button>
            <form className="space-y-6">
            <input
                type="firstname"
                placeholder="First Name"
                value={formData.firstname}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
                type="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
               <input
                type="number"
                placeholder="Phone"
                value={formData.phone}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
               <input
                type="confirmpassword"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
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
              If you already have an account?{' '}
              <a
                href="/login"
                className="font-semibold hover:underline"
                style={{ color: "#00186E" }}
              >
                LOGIN
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

