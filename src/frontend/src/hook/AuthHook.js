import { createContext, useContext, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "./LocalStorageHook";
import { loginUser } from "../action/auth/auth";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useLocalStorage("lazada-login-token", null);

  const token = () => {
    const jwtToken = JSON.parse(
      localStorage.getItem("lazada-login-token")
    )?.token;
    return jwtToken;
  };

  const login = async (data) => {
    const result = await loginUser(data).then((res) => {
      if (res) {
        setUser(res);
        return true;
      }
      return false;
    });
    return result;
  };

  useEffect(() => {
    if (user && location.pathname === "/" && user.role === "admin") {
      navigate("/admin");
    } else if (user && location.pathname === "/" && user.role === "sellers") {
      navigate("seller");
    } else if (user && location.pathname === "/" && user.role === "customer") {
      navigate("/customer");
    }
    // eslint-disable-next-line
  }, [user]);

  const logout = () => {};

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
