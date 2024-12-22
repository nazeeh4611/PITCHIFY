import React from "react"
import {Route,Routes} from "react-router-dom"
import Register from "../Components/Common/Register"
import Login from "../Components/Common/Login"
import Otp from "../Components/Common/OTP"





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
             
        </Routes>
        </>
    )
}

export default Investor