import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useGetToken } from "../../token/Gettoken";

interface ProtectedRouteProps {
    component: React.ComponentType; 
}

const EntrepreneurProtectedRoute: React.FC<ProtectedRouteProps> = ({
    component: Component,
}) => {
  const navigate = useNavigate();
  const token = useGetToken("entrepreneur");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    console.log("token in protected route");
    if (!token) {
      console.log("No valid token found");
      navigate("/");
      return;
    }
    setIsAuthenticated(true);
  }, [navigate, token]);
 
if(!isAuthenticated){
  navigate("/")
}
  return isAuthenticated ? <Component /> : null;
};

export default EntrepreneurProtectedRoute;
