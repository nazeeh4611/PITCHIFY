import React from "react";
import { Route,Routes } from "react-router-dom";
import Select from "../Components/Common/Select";
import Homepage from "../Components/Common/Homepage";
import CommonrReverseProtectedRoute from "./ProtectedRoutes/\/ReverseProtectedCommonRoute";
import VideoCallPage from "../Components/Common/VideoCallpage";
const Common:React.FC = () =>{

    return(
        <>
      <Routes>
      <Route
             path="/"
             element={<CommonrReverseProtectedRoute component={Homepage}/>}
             />
            <Route path="/select" element={<CommonrReverseProtectedRoute component={Select}/>}/>
            {/* <Route path="/video-call/:roomId" element={<VideoCallPage />} /> */}

      </Routes>
     
        </>
    )

}

export default Common