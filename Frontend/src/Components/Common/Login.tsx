import { useLocation, useNavigate } from "react-router-dom";
import React,{useEffect,useRef,useState} from "react";
import Navbar from "../Layout/Navbar"; 
import Registerimg from "../Layout/Image/Registerimg.png"; 
import logo from "../Layout/Image/logo.jpeg"; 
import Glogo from "../Layout/Image/Glogo.png"; 
import Register from "./Register";
import { Link } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux"
import {RootState} from '../../Redux/Store'
import axios from "axios";
import { EntrepreneurAuth } from "../../Redux/EntrepreneurTokenSlice";
import { InvestorAuth } from "../../Redux/InvestorTokenSlice";

const Login: React.FC = () => {
  const location = useLocation();
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur"; 

const emailRef = useRef<HTMLInputElement>(null);
const passwordRef = useRef<HTMLInputElement>(null);


const [emailError,setEmailError] = useState("");
const [passwordError,setPasswordError] = useState("");
const dispatch = useDispatch()
const navigate = useNavigate()



  

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
   try {
    
    setEmailError("");
    setPasswordError("");

    if(!emailRef.current || !passwordRef.current){
      console.error("refs are not initialized");
      return 
    }

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const response = await axios.post(`http://localhost:3009/api/${userType}/login`,{
      email:email,password:password,
      Headers:{
        "Content-Type" : "application/json"
      }
    })

    console.log(response.data.token,"here is the resposnse")
    if (response && response.data.token) {
      console.log(response.data.token, "this is the token");

      // Dispatch token to Redux
      if(userType=="entrepreneur"){
        dispatch(
          EntrepreneurAuth({
            token: response.data.token,
          })
        );
      }else if(userType=="investor"){
        dispatch(
          InvestorAuth({
            token:response.data.token
          })
        );
      }

      // Navigate to the login page
      navigate(`/${userType}/profile`);
    }
  } catch (error) {
    console.error("error")
   }

  }
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
            <form className="space-y-6" onSubmit={handleLogin}>
              <input
                ref={emailRef}
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <input
              ref={passwordRef}
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
              <Link to={`/${userType}/register`} className="font-semibold hover:underline" style={{ color: "#00186E" }}>
             Register
            </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
