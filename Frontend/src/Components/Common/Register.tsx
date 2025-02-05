import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { validationSchema } from "../../validation/validation"; 
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../Layout/Navbar";
import logo from "../Layout/Image/logo.jpeg";
import Glogo from "../Layout/Image/Glogo.png";
import Registerimg from "../Layout/Image/Registerimg.png";
import { Link } from "react-router-dom";
import axios from "axios";
import shortlogo from "../Layout/Image/shortlogo.png";

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur";
  const navigate = useNavigate();

  const handleRegister = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("firstname", values.firstname);
      formData.append("lastname", values.lastname);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);
      formData.append("confirmpassword", values.confirmPassword);

      const response = await axios.post(`http://localhost:3009/api/${userType}/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Registration successful:", response.data);
      if (response) {
        navigate(`/${userType}/otp?email=${values.email}`);
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

  const togglePassword = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/" },
          { label: "Explore Premium", href: "/explore-premium" },
          { label: "About Us", href: "/about-us" },
        ]}
      />
      <div className="flex justify-center px-4 pt-20 pb-8">
        <div className="bg-white rounded-[2%] shadow-lg p-4 sm:p-6 md:p-8 flex flex-col md:flex-row w-[95%] max-w-7xl">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left p-2 sm:p-4 relative">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 text-gray-800">We Help You To Grow with</h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: "#00186E" }}>PITCHIFY</h2>
            <img
              src={Registerimg}
              alt="3D figure with briefcase"
              className="hidden md:block absolute top-44 w-[600px] md:w-[800px] lg:w-[900px] opacity-80 pointer-events-none"
            />
          </div>

          <div className="flex-1 p-2 sm:p-4">
            <h3 className="text-md sm:text-lg md:text-xl font-bold text-gray-700 text-center mb-4">REGISTER AS {userType.toUpperCase()}</h3>
            <button className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg mb-4">
              <img src={Glogo} alt="Google logo" className="w-5 h-5 mr-2" />
              CONTINUE WITH GOOGLE
            </button>
            <Formik
              initialValues={{
                firstname: "",
                lastname: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleRegister}
            >
              <Form className="space-y-3">
                <div className="relative">
                  <Field
                    name="firstname"
                    type="text"
                    placeholder="First Name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                  />
                  <ErrorMessage name="firstname" component="div" className="absolute text-red-500 text-sm mt-1 left-0" />
                </div>
                <div className="relative">
                  <Field
                    name="lastname"
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                  />
                  <ErrorMessage name="lastname" component="div" className="absolute text-red-500 text-sm mt-1 left-0" />
                </div>
                <div className="relative">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                  />
                  <ErrorMessage name="email" component="div" className="absolute text-red-500 text-sm mt-1 left-0" />
                </div>
                <div className="relative">
                  <Field
                    name="phone"
                    type="text"
                    placeholder="Phone"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                  />
                  <ErrorMessage name="phone" component="div" className="absolute text-red-500 text-sm mt-1 left-0" />
                </div>
                <div className="relative">
                  <Field name="password">
                    {({ field }: any) => (
                      <div className="relative">
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword('password')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage name="password" component="div" className="absolute text-red-500 text-sm mt-1 left-0" />
                </div>
                <div className="relative">
                  <Field name="confirmPassword">
                    {({ field }: any) => (
                      <div className="relative">
                        <input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                        <button
                          type="button"
                          onClick={() => togglePassword('confirmPassword')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage name="confirmPassword" component="div" className="absolute text-red-500 text-sm mt-1 left-0" />
                </div>
                <button
                  type="submit"
                  className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-300"
                  style={{ background: "#00186E" }}
                >
                  SIGN UP
                </button>
              </Form>
            </Formik>
            <p className="text-center text-sm text-gray-600 mt-4">
              If you already have an account?{" "}
              <Link
                to={`/${userType}/login`}
                className="font-semibold hover:underline"
                style={{ color: "#00186E" }}
              >
                LOGIN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;