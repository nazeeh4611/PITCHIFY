import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { useGetToken } from "../../token/Gettoken";

interface ReverseProtectedRouteProp {
  component: React.ComponentType<any>;
}

const CommonrReverseProtectedRoute: React.FC<ReverseProtectedRouteProp > = ({
  component: Component,
}) => {
  const token = useGetToken("investor")||useGetToken('investor');
  console.log("token")
  const location = useLocation();

  return !token ? (
    <Component /> 
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
};

export default CommonrReverseProtectedRoute;
