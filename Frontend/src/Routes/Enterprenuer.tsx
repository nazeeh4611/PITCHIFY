import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "../Components/Common/Register";
import Login from "../Components/Common/Login";
import Otp from "../Components/Common/OTP";
import EntrepreneurProfile from "../Components/Entrepreneur/EntrepreneurProfile";
import EntrepreneurProtectedRoute from "./ProtectedRoutes/EntrepreneurProtectedRoute";
import EntrepreneurReverseProtectedRoute from "./ProtectedRoutes/ReverseEntreprenuerProtect";
import ModelListing from "../Components/Entrepreneur/EntrepreneurModels"; // Import ModelListing component

const Entrepreneur: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/register" element={<EntrepreneurReverseProtectedRoute component={Register} />} />
        <Route path="/login" element={<EntrepreneurReverseProtectedRoute component={Login} />} />
        <Route path="/otp" element={<EntrepreneurReverseProtectedRoute component={Otp} />} />
        <Route
          path="/profile"
          element={<EntrepreneurProtectedRoute component={EntrepreneurProfile} />}
        >
          {/* Nested routes inside profile */}
          <Route path="model" element={<ModelListing />} />
        </Route>
      </Routes>
    </>
  );
};

export default Entrepreneur;
