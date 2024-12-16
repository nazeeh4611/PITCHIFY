import React from "react"
import {Route,Routes} from "react-router-dom"
import Register from "../Components/Common/Register"
import Login from "../Components/Common/Login"





const Entreprenuer: React.FC = ()=>{
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
             
        </Routes>
        </>
    )
}

export default Entreprenuer