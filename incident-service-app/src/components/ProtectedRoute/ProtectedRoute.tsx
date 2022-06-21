import { Navigate } from "react-router-dom";
import { Layout } from "../../pages/layout/Layout";
import { isAuthenticated } from "../../services/auth.service";

export const ProtectedRoute = ({ children }: { children: any }) => {
  if (isAuthenticated()) return   <Layout>{children}</Layout>;
  else if (!isAuthenticated()) return <Navigate to="/login" />;
  else return null;
};
