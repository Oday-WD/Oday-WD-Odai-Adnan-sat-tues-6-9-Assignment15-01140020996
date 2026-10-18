import { useAuth } from "../context/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={"/auth/login"} />;
  }
  return <Outlet />;
};
