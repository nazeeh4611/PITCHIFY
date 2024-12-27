import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { useGetToken } from "../../token/Gettoken";

interface ReverseProtectedRouteProps {
  component: React.ComponentType<any>;
}

const InvestorReverseProtectedRoute: React.FC<ReverseProtectedRouteProps> = ({
  component: Component,
}) => {
  const token = useGetToken("investor");
  const location = useLocation();

  return !token ? (
    <Component /> 
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
};

export default InvestorReverseProtectedRoute;
