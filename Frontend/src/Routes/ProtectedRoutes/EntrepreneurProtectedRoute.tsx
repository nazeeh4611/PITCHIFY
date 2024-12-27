import { Navigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useGetToken } from "../../token/Gettoken";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

const EntrepreneurProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
}) => {
  const token = useGetToken("entrepreneur");
    console.log(token,"token is getting")
  const location = useLocation();

  return (token? (
    <Component/>
  ):(
    <Navigate to="/" state={{from:location}} />
  ))
};

export default EntrepreneurProtectedRoute;
