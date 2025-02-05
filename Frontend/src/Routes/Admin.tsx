import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../Components/Admin/AdminLogin";
import InvestorList from "../Components/Admin/InvestorList";
import EntrepreneurList from "../Components/Admin/EntrepreneurList";
import AdminProtectedRoute from "./ProtectedRoutes/AdminProtectedRoute";
import AdminReverseProtectedRoute from "./ProtectedRoutes/ReverseAdminProtected";
import Category from "../Components/Admin/Category";
import InvestorDetails from "../Components/Investor/InvestorDetails";
import AdminInvestorDetails from "../Components/Admin/AdminInvestorDetails";
import PremiumPlans from "../Components/Admin/Subscription";

const Admin: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminReverseProtectedRoute component={AdminLogin} />} />
        <Route path="/investorlist" element={<AdminProtectedRoute component={InvestorList} />} />
        <Route path="/entrepreneurlist" element={<AdminProtectedRoute component={EntrepreneurList} />} />
        <Route path="/category" element={<AdminProtectedRoute component={Category}/>} />
        <Route path="/investor-details/:id" element={<AdminProtectedRoute component={AdminInvestorDetails}/>}/>
        <Route path="/subscription" element={<AdminProtectedRoute component={PremiumPlans}/>}/>
      </Routes>
    </>
  );
};

export default Admin;
