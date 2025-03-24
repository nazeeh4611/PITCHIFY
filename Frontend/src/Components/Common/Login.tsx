import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import Navbar from "../Layout/Navbar";
import Registerimg from "../Layout/Image/Registerimg.png";
import logo from "../Layout/Image/logo.jpeg";
import shortlogo from "../Layout/Image/shortlogo.png";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { EntrepreneurAuth } from "../../Redux/EntrepreneurTokenSlice";
import { InvestorAuth } from "../../Redux/InvestorTokenSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const location = useLocation();
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const { email, password } = values;
        const response = await axios.post(`http://localhost:3009/api/${userType}/login`, { email, password });

        if (response && response.data.token) {
          if (userType === "entrepreneur") {
            dispatch(EntrepreneurAuth({ token: response.data.token }));
          } else if (userType === "investor") {
            dispatch(InvestorAuth({ token: response.data.token }));
          }
          navigate(`/${userType}/`);
        }
      } catch (error: any) {
        formik.setErrors({
          email: error.response?.data?.message || "Login failed. Please check your credentials.",
        });
      }
    },
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const email = payload.email;
      
      const response = await axios.post(`http://localhost:3009/api/${userType}/google-login`, { 
        token: credential,
        email: email,
        user: userType
      });
      
      if (response.data.token) {
        if (userType === "entrepreneur") {
          dispatch(EntrepreneurAuth({ token: response.data.token }));
        } else if (userType === "investor") {
          dispatch(InvestorAuth({ token: response.data.token }));
        }
        navigate(`/${userType}/`);
      }
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <GoogleOAuthProvider clientId="47427121826-p61iendcce2dbfin1ie78omlgspjuv9s.apps.googleusercontent.com">
      <Navbar logoUrl={logo} shortLogoUrl={shortlogo} links={[{ label: "Home", href: "/" }, { label: "Explore Premium", href: "/explore-premium" }, { label: "About Us", href: "/about-us" }]} />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
        <div className="bg-white rounded-[2%] shadow-lg p-4 sm:p-6 md:p-10 w-full max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10">
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-6 relative">
            <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-gray-800">We Help You To Grow with</h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: "#00186E" }}>PITCHIFY</h2>
            <button 
              onClick={toggleModal} 
              className="mt-6 px-6 py-2 text-white font-semibold rounded-lg hover:bg-indigo-800"
              style={{ background: "#00186E" }}
            >
              LOGIN
            </button>
            <img src={Registerimg} alt="3D figure with briefcase" className="hidden md:block absolute top-44 left-0 w-[500px] md:w-[700px] lg:w-[1000px] opacity-80 pointer-events-none" />
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button 
                onClick={toggleModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-lg md:text-xl font-bold text-gray-700 text-center mb-8">LOGIN AS {userType.toUpperCase()}</h3>
              
              <div className="mb-6">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Google login failed")} />
              </div>
              
              <div className="flex items-center mb-6">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>
              
              <form className="space-y-6" onSubmit={formik.handleSubmit}>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none" 
                    {...formik.getFieldProps("email")} 
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                  ) : null}
                </div>
                
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none" 
                    {...formik.getFieldProps("password")} 
                  />
                  <button 
                    type="button" 
                    onClick={togglePassword} 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                  ) : null}
                </div>
                
                <button 
                  type="submit" 
                  className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-800" 
                  style={{ background: "#00186E" }}
                >
                  SIGN IN
                </button>
              </form>
              
              <p className="text-center text-sm text-gray-600 mt-6">
                If you don't have an account? 
                <Link 
                  to={`/${userType}/register`} 
                  className="font-semibold hover:underline ml-1" 
                  style={{ color: "#00186E" }}
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;