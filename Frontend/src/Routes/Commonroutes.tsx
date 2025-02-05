import React from "react";
import { Route,Routes } from "react-router-dom";
import Select from "../Components/Common/Select";
import Homepage from "../Components/Common/Homepage";
import CommonrReverseProtectedRoute from "./ProtectedRoutes/\/ReverseProtectedCommonRoute";
const Common:React.FC = () =>{

    return(
        <>
      <Routes>
      <Route
             path="/"
             element={<CommonrReverseProtectedRoute component={Homepage}/>}
             />
            <Route path="/select" element={<CommonrReverseProtectedRoute component={Select}/>}/>
      </Routes>
     
        </>
    )

}

export default Common