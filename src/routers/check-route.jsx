import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";

const CheckRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.user ? (
    <Navigate to="/dash-board" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default CheckRoute;
