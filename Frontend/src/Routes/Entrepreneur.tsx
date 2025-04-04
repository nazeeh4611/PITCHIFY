import React from "react";
import { Route, Routes } from "react-router-dom";
import EntrepreneurProfile from "../Components/Entrepreneur/EntrepreneurProfile";
import EntrepreneurProtectedRoute from "./ProtectedRoutes/EntrepreneurProtectedRoute";
import EntrepreneurReverseProtectedRoute from "./ProtectedRoutes/ReverseEntreprenuerProtect";
import EntrepreneurHome from "../Components/Entrepreneur/EntrepreneurHome";
import EntrepreneurModels from "../Components/Entrepreneur/EntrepreneurModels";
import Addmodel from "../Components/Entrepreneur/AddModel";
import ModelDetails from "../Components/Entrepreneur/EntrepreneurModelDetails";
import EntrepreneurSubscription from "../Components/Entrepreneur/EntrepreneurSubscription";
import EntrepreneurPricingPage from "../Components/Entrepreneur/EntrepreneurPricingPage";
import Review from "../Components/Entrepreneur/Rate-Review";
import ChatPage from "../Components/Entrepreneur/EntrepreneurChat";
import JoinMeeting from "../Components/Common/Joinmeet";
import VideoCallPage from "../Components/Common/VideoCallpage";
import InvestorSearchPage from "../Components/Entrepreneur/PremiumInvestorList";

const Entrepreneur: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/profile"  element={<EntrepreneurProtectedRoute component={EntrepreneurProfile} />} />
        <Route path="/" element={<EntrepreneurProtectedRoute component={EntrepreneurHome} />}/>
        <Route  path="/models" element={<EntrepreneurProtectedRoute component={EntrepreneurModels}/>}/>
        <Route  path="/add-model" element={<EntrepreneurProtectedRoute component={Addmodel}/>}/>
        <Route path="/model-details/:id" element={<EntrepreneurProtectedRoute component={ModelDetails} />} />
        <Route path="/premium" element={< EntrepreneurProtectedRoute component={EntrepreneurSubscription} />} />
        <Route path="/plan-details" element={<EntrepreneurProtectedRoute component={EntrepreneurPricingPage} />} />
        <Route path="/rate-review" element={<EntrepreneurProtectedRoute component={Review}/>}/>
        <Route path="/chat" element={<EntrepreneurProtectedRoute component={ChatPage}/>}/>
        <Route path="/join-meeting/:roomId" element={<JoinMeeting />} />
        <Route path="/video-call/:roomId" element={<VideoCallPage />} />
        <Route path="/investor-list" element={<InvestorSearchPage />} />


        </Routes>
    </>
  );
};

export default Entrepreneur;
