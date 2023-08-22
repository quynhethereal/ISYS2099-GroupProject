import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthHook";

export const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (user == null) {
    return <Navigate to="/blocked" />;
  }
  if (user?.role !== role) {
    return <Navigate to="/blocked" />;
  }

  return children;
};
