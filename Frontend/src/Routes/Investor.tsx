import React from "react"
import {Route,Routes} from "react-router-dom"
import Register from "../Components/Common/Register"
import Login from "../Components/Common/Login"
import Otp from "../Components/Common/OTP"
import InvestorProfile from "../Components/Investor/InvestorProfile";
import InvestorProtectedRoute from "./ProtectedRoutes/InvestorProtectedRoute";




const Investor: React.FC = ()=>{
    return(
        <>
        <Routes>
            
         

             <Route
             path="/register"
             element={<Register/>}
             /> 
             <Route
             path="/login"
             element={<Login/>}
             /> 

             <Route path="/otp"
             element={<Otp/>}
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