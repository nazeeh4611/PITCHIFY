import React from "react";
import { Route,Routes } from "react-router-dom";
import Select from "../Components/Common/Select";
import Homepage from "../Components/Common/Homepage";
const Common:React.FC = () =>{

    return(
        <>
      <Routes>
      <Route
             path="/"
             element={<Homepage/>}
             />
            <Route path="/select" element={<Select/>}/>
      </Routes>
     
        </>
    )

}

export default Common