import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../Components/Admin/AdminLogin";
import InvestorList from "../Components/Admin/InvestorList";
import EntrepreneurList from "../Components/Admin/EntrepreneurList";

const Admin: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/investorlist" element={<InvestorList />} />
        <Route path="/entrepreneurlist" element={<EntrepreneurList />} />
      </Routes>
    </>
  );
};

export default Admin;
