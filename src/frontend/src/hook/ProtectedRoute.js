import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthHook";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  console.log(user);

  if (user == null) {
    console.log("Oops! You need to login first before we go");
    return <Navigate to="/blocked" />;
  }

  return children;
};
