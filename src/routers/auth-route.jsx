import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";

const AuthRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return allowedRoles?.includes(auth?.user?.role) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login-page" state={{ from: location }} replace />
  );
};

export default AuthRoute;
