import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../Components/Admin/AdminLogin";
import InvestorList from "../Components/Admin/InvestorList";
import EntrepreneurList from "../Components/Admin/EntrepreneurList";
import AdminProtectedRoute from "./ProtectedRoutes/AdminProtectedRoute";
import AdminReverseProtectedRoute from "./ProtectedRoutes/ReverseAdminProtected";
import Category from "../Components/Admin/Category";
import AdminInvestorDetails from "../Components/Admin/AdminInvestorDetails";
import PremiumPlans from "../Components/Admin/Subscription";
import EntrepreneurDetails from "../Components/Admin/EntrepreneurDetails";
import ModelDetails from "../Components/Admin/AdminModeldetails";
import AdminDashboard from "../Components/Admin/AdminDashboard";

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
        <Route path="/entrepreneurlist/:id" element={<AdminProtectedRoute component={EntrepreneurDetails}/>}/>
        <Route path="/model/:id" element={<AdminProtectedRoute component={ModelDetails}/>}/>
        <Route path="/dashboard" element={<AdminProtectedRoute component={AdminDashboard}/>}/>
      </Routes>
    </>
  );
};

export default Admin;
