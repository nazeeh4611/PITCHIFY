import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { useGetToken } from "../../token/Gettoken";

interface ReverseProtectedRouteProps {
  component: React.ComponentType<any>;
}

const AdminReverseProtectedRoute: React.FC<ReverseProtectedRouteProps> = ({
  component: Component,
}) => {
  const token = useGetToken("admin");
  const location = useLocation();

  return !token ? (
    <Component /> 
  ) : (
    <Navigate to="/admin/login" state={{ from: location }} />
  );
};

export default AdminReverseProtectedRoute;
