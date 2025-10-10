import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid } from "../../../app/services/api.service";

const AuthGuard = () => {
  return isTokenValid() ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default AuthGuard;
