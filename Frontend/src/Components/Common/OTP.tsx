import React, { useState, useEffect, useRef } from "react";
import Registerimg from "../Layout/Image/Registerimg.png";
import { useLocation,useNavigate,useSearchParams } from "react-router-dom";
import axios from "axios";
import {useDispatch} from "react-redux"
import { EntrepreneurAuth } from "../../Redux/EntrepreneurTokenSlice";
import { InvestorAuth } from "../../Redux/InvestorTokenSlice";
interface OtpInputProps {
  length?: number; // Default OTP length: 4
}

const Otp: React.FC<OtpInputProps> = ({ length = 4 }) => {
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur"; // Determine user type
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [timer, setTimer] = useState<number>(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);



  // Timer Countdown Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(-1); 
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus(); // Move to next input
    }
  };

  // Handle Key Down for Backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Move to previous input
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const query = queryParams.get("email");
      const enteredOtp = otp.join("");
      const response = await axios.post(
        `http://localhost:3009/api/${userType}/verifyotp`,
        { otp: enteredOtp, emaildata: query },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response && response.data.token) {
        console.log(response.data.token, "this is the token");
  
        // Dispatch token to Redux

        if(userType == "entrepreneur"){
          dispatch(
            EntrepreneurAuth({
              token: response.data.token,
            })
          );
        }else if(userType=="investor"){
          dispatch(
            InvestorAuth({
              token: response.data.token,
            })
          );
        }
      
  
        // Navigate to the login page
        navigate(`/${userType}/profile`);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };
  
  return (
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

        <div className="flex justify-center items-center bg-white p-4">
          <div className="bg-white border-2 border-indigo-800 rounded-lg p-6 w-[400px] text-center relative shadow-md">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#00186E" }}>
              ENTER OTP
            </h2>
            <div className="flex justify-center gap-4 mb-6">
              {otp.map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 border-2 border-indigo-800 rounded-md text-center text-xl text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>
            <button
              // Removed submit functionality
              className="bg-indigo-800 text-white font-semibold py-2 rounded-md w-full hover:bg-indigo-900 transition"   
              style={{ background: "#00186E" }}
            onClick={handleSubmit} >
              SUBMIT
            </button>
            <div className="mt-4 text-gray-600 text-sm">
              <p>
                Resend OTP in{" "}
                <span className="font-bold text-black">
                  0:{timer.toString().padStart(2, "0")}
                </span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Otp;
