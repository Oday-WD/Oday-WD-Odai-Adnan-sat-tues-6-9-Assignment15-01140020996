import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedAuthRoutes = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return <Outlet />;
};

export default ProtectedAuthRoutes;
