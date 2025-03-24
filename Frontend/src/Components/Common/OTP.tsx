import React, { useState, useRef } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Navbar from "../Layout/Navbar";
import Registerimg from "../Layout/Image/Registerimg.png";
import logo from "../Layout/Image/logo.jpeg";
import shortlogo from "../Layout/Image/shortlogo.png";
import Glogo from "../Layout/Image/Glogo.png";
import { EntrepreneurAuth } from "../../Redux/EntrepreneurTokenSlice";
import { InvestorAuth } from "../../Redux/InvestorTokenSlice";
import { useNavigate } from "react-router-dom";

const Select = () => {
  const [activeModal, setActiveModal] = useState<"login" | "register" | "otp" | null>(null);
  const [userType, setUserType] = useState("entrepreneur");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(4).fill(""));
  const [timer, setTimer] = useState(30);
  const [otpEmail, setOtpEmail] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelectUserType = (type) => {
    setUserType(type);
    setActiveModal("login");
  };

  const closeModal = () => {
    setActiveModal(null);
    resetForms();
  };

  const resetForms = () => {
    loginFormik.resetForm();
    registerFormik.resetForm();
    setShowPassword(false);
    setShowConfirmPassword(false);
    setOtpValues(Array(4).fill(""));
  };

  const switchToRegister = () => {
    setActiveModal("register");
    resetForms();
  };

  const switchToLogin = () => {
    setActiveModal("login");
    resetForms();
  };

  const switchToOtp = (email) => {
    setActiveModal("otp");
    setOtpEmail(email);
    startOtpTimer();
  };

  const startOtpTimer = () => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const loginFormik = useFormik({
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
      } catch (error) {
        loginFormik.setErrors({
          email: error.response?.data?.message || "Login failed. Please check your credentials.",
        });
      }
    },
  });

  const registerFormik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Confirm password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
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

        if (response) {
          switchToOtp(values.email);
        }
      } catch (error) {
        console.error("Registration failed:", error);
        registerFormik.setErrors({
          email: "Registration failed. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoogleSuccess = async (credentialResponse) => {
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

  const handleOtpChange = (e, index) => {
    const value = e.target.value.slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      const enteredOtp = otpValues.join("");
      const response = await axios.post(
        `http://localhost:3009/api/${userType}/verifyotp`,
        { otp: enteredOtp, emaildata: otpEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response && response.data.token) {
        if (userType === "entrepreneur") {
          dispatch(EntrepreneurAuth({ token: response.data.token }));
        } else if (userType === "investor") {
          dispatch(InvestorAuth({ token: response.data.token }));
        }
        navigate(`/${userType}/profile`);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const togglePassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleRegisterWithGoogle = (e) => {
    e.preventDefault();
    (document.querySelector('.google-login-button') as HTMLElement)?.click();
  };

  return (
    <GoogleOAuthProvider clientId="47427121826-p61iendcce2dbfin1ie78omlgspjuv9s.apps.googleusercontent.com">
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
                onClick={() => handleSelectUserType("entrepreneur")}
                className="w-1/2 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-300"
                style={{ background: "#00186E" }}
              >
                As Entrepreneur
              </button>
              <button
                onClick={() => handleSelectUserType("investor")}
                className="w-1/2 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-300"
                style={{ background: "#00186E" }}
              >
                As Investor
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeModal === 'login' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-lg md:text-xl font-bold text-gray-700 text-center mb-8">
              LOGIN AS {userType.toUpperCase()}
            </h3>
            
            <div className="mb-6">
              <div className="google-login-button" style={{ display: 'none' }}>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Google login failed")} />
              </div>
              <button 
                onClick={handleRegisterWithGoogle}
                className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
              >
                <img src={Glogo} alt="Google logo" className="w-5 h-5 mr-2" />
                CONTINUE WITH GOOGLE
              </button>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            
            <form className="space-y-6" onSubmit={loginFormik.handleSubmit}>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none" 
                  {...loginFormik.getFieldProps("email")} 
                />
                {loginFormik.touched.email && loginFormik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1">{loginFormik.errors.email}</div>
                ) : null}
              </div>
              
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none" 
                  {...loginFormik.getFieldProps("password")} 
                />
                <button 
                  type="button" 
                  onClick={() => togglePassword('password')} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {loginFormik.touched.password && loginFormik.errors.password ? (
                  <div className="text-red-500 text-sm mt-1">{loginFormik.errors.password}</div>
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
              <button 
                onClick={switchToRegister}
                className="font-semibold hover:underline ml-1" 
                style={{ color: "#00186E" }}
                type="button"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      )}

      {activeModal === 'register' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-lg md:text-xl font-bold text-gray-700 text-center mb-8">
              REGISTER AS {userType.toUpperCase()}
            </h3>
            
            <div className="mb-6">
              <div className="google-login-button" style={{ display: 'none' }}>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Google login failed")} />
              </div>
              <button 
                onClick={handleRegisterWithGoogle}
                className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                type="button"
              >
                <img src={Glogo} alt="Google logo" className="w-5 h-5 mr-2" />
                CONTINUE WITH GOOGLE
              </button>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            
            <form className="space-y-4" onSubmit={registerFormik.handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  {...registerFormik.getFieldProps("firstname")}
                />
                {registerFormik.touched.firstname && registerFormik.errors.firstname ? (
                  <div className="text-red-500 text-sm mt-1">{registerFormik.errors.firstname}</div>
                ) : null}
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  {...registerFormik.getFieldProps("lastname")}
                />
                {registerFormik.touched.lastname && registerFormik.errors.lastname ? (
                  <div className="text-red-500 text-sm mt-1">{registerFormik.errors.lastname}</div>
                ) : null}
              </div>
              
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  {...registerFormik.getFieldProps("email")}
                />
                {registerFormik.touched.email && registerFormik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1">{registerFormik.errors.email}</div>
                ) : null}
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  {...registerFormik.getFieldProps("phone")}
                />
                {registerFormik.touched.phone && registerFormik.errors.phone ? (
                  <div className="text-red-500 text-sm mt-1">{registerFormik.errors.phone}</div>
                ) : null}
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  {...registerFormik.getFieldProps("password")}
                />
                <button
                  type="button"
                  onClick={() => togglePassword('password')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {registerFormik.touched.password && registerFormik.errors.password ? (
                  <div className="text-red-500 text-sm mt-1">{registerFormik.errors.password}</div>
                ) : null}
              </div>
              
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  {...registerFormik.getFieldProps("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => togglePassword('confirmPassword')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword ? (
                  <div className="text-red-500 text-sm mt-1">{registerFormik.errors.confirmPassword}</div>
                ) : null}
              </div>
              
              <button
                type="submit"
                className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-800"
                style={{ background: "#00186E" }}
              >
                SIGN UP
              </button>
            </form>
            
            <p className="text-center text-sm text-gray-600 mt-6">
              If you already have an account?
              <button
                onClick={switchToLogin}
                className="font-semibold hover:underline ml-1"
                style={{ color: "#00186E" }}
                type="button"
              >
                LOGIN
              </button>
            </p>
          </div>
        </div>
      )}

      {activeModal === 'otp' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-lg md:text-xl font-bold text-gray-700 text-center mb-8">
              ENTER OTP
            </h3>
            
            <div className="flex justify-center gap-4 mb-6">
              {otpValues.map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={otpValues[index]}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-12 border-2 border-indigo-800 rounded-md text-center text-xl text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>
            
            <button
              onClick={handleSubmitOtp}
              className="w-full text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-800"
              style={{ background: "#00186E" }}
            >
              SUBMIT
            </button>
            
            <div className="mt-4 text-center text-gray-600 text-sm">
              <p>
                Resend OTP in{" "}
                <span className="font-bold text-black">
                  0:{timer.toString().padStart(2, "0")}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </GoogleOAuthProvider>
  );
};

export default Select;