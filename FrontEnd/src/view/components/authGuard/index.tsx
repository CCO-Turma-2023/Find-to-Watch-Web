import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};

const AuthGuard = () => {
  const isAuth = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthGuard;
