import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useGetToken } from "../../token/Gettoken";

interface ProtectedRouteProps {
    component: React.ComponentType<any>;  // Allow any component type (React.FC or class component)
}

const investorProtectedRoute: React.FC<ProtectedRouteProps> = ({
    component: Component,
}) => {
  const navigate = useNavigate();
  const token = useGetToken("investor");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
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
  return isAuthenticated ? <Component /> :null;
};

export default investorProtectedRoute;
