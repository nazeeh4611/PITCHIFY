import React from "react"
import {Route,Routes} from "react-router-dom"
import Register from "../Components/Common/Register"
import Login from "../Components/Common/Login"
import Otp from "../Components/Common/OTP"
import InvestorProfile from "../Components/Investor/InvestorProfile";
import InvestorProtectedRoute from "./ProtectedRoutes/InvestorProtectedRoute";
import InvestorReverseProtectedRoute from "./ProtectedRoutes/ReverseInvestorProtected"
import InvestorHome from "../Components/Investor/InvestorHome"
import InvestorDetails from "../Components/Investor/InvestorDetails"
import BusinessModelsPage from "../Components/Investor/InvestorModels"
import ModelDetialsInvestor from "../Components/Investor/InvestorModelDetails"
import InvestorSubscription from "../Components/Investor/InvestorSubscription"
import PricingPage from "../Components/Investor/PricingPage"
import ChatPage from "../Components/Investor/InvestorChat"
import VideoCallPage from "../Components/Common/VideoCallpage"
import InvestorVideoCallPage from "../Components/Investor/investorVideocall"
import InvestorSavedModels from "../Components/Investor/SavedModels"
import ExclusiveModels from "../Components/Investor/InvestorExlusivemodels"



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
            <Route
            path="/investordetails"
              element={<InvestorProtectedRoute component={InvestorDetails} />}
            />
             <Route path="/models" element={<InvestorProtectedRoute component={BusinessModelsPage}/>} />
             <Route path="/model-details/:id" element={<InvestorProtectedRoute component={ModelDetialsInvestor}/>} />
             <Route path="/premium" element={<InvestorProtectedRoute component={InvestorSubscription}/>} />
             <Route path="/plan-details" element={<InvestorProtectedRoute component={PricingPage}/>} />
             <Route path="/chat" element={<InvestorProtectedRoute component={ChatPage}/>} />
             <Route path="/video-call/:roomId" element={<InvestorVideoCallPage />} />
             <Route path="/savedmodels" element={<InvestorSavedModels/>} />
             <Route path="/exclusivemodels" element={<ExclusiveModels/>} />
        </Routes>
        </>
    )
}

export default Investor