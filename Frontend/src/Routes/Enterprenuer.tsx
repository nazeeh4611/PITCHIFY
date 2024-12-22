import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "../Components/Common/Register";
import Login from "../Components/Common/Login";
import Otp from "../Components/Common/OTP";
import EntrepreneurProfile from "../Components/Entrepreneur/EntrepreneurProfile";
import EntrepreneurProtectedRoute from "./ProtectedRoutes/EntrepreneurProtectedRoute";

const Entrepreneur: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route
          path="/profile"
          element={<EntrepreneurProtectedRoute component={EntrepreneurProfile} />}
        />
      </Routes>
    </>
  );
};

export default Entrepreneur;
