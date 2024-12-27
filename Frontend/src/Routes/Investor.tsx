import React from "react"
import {Route,Routes} from "react-router-dom"
import Register from "../Components/Common/Register"
import Login from "../Components/Common/Login"
import Otp from "../Components/Common/OTP"
import InvestorProfile from "../Components/Investor/InvestorProfile";
import InvestorProtectedRoute from "./ProtectedRoutes/InvestorProtectedRoute";
import InvestorReverseProtectedRoute from "./ProtectedRoutes/ReverseInvestorProtected"
import InvestorHome from "../Components/Investor/InvestorHome"



const Investor: React.FC = ()=>{
    return(
        <>
        <Routes>
            
         

             <Route
             path="/register"
             element={<InvestorReverseProtectedRoute component={Register}/>}
             /> 
             <Route
             path="/login"
             element={<InvestorReverseProtectedRoute component={Login}/>}
             /> 

             <Route path="/otp"
             element={<InvestorReverseProtectedRoute component={Otp}/>}
             />
              <Route path="/"
              element={<InvestorProtectedRoute component={InvestorHome}/>}
              />
       <Route
       path="/profile"
         element={<InvestorProtectedRoute component={InvestorProfile} />}
       />
             
        </Routes>
        </>
    )
}

export default Investor