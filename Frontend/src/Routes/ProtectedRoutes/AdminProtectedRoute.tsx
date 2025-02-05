import { Navigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useGetToken } from "../../token/Gettoken";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
}) => {
  const token = useGetToken("admin");
    console.log(token,"token is getting")
  const location = useLocation();

  return (token? (
    <Component/>
  ):(
    <Navigate to="/admin/login" state={{from:location}} />
  ))
};

export default AdminProtectedRoute;
