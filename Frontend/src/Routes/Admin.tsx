import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../Components/Admin/AdminLogin";
import InvestorList from "../Components/Admin/InvestorList";
import EntrepreneurList from "../Components/Admin/EntrepreneurList";
import AdminProtectedRoute from "./ProtectedRoutes/AdminProtectedRoute";
import AdminReverseProtectedRoute from "./ProtectedRoutes/ReverseAdminProtected";

const Admin: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminReverseProtectedRoute component={AdminLogin} />} />
        <Route path="/investorlist" element={<AdminProtectedRoute component={InvestorList} />} />
        <Route path="/entrepreneurlist" element={<AdminProtectedRoute component={EntrepreneurList} />} />
      </Routes>
    </>
  );
};

export default Admin;
