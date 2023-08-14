import { createContext, useContext, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./LocalStorageHook";
import { loginUser } from "../action/auth/auth";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage("lazada-login-token", null);
  //   localStorage.setItem("lazada-login-token", JSON.stringify(data));

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
    if (user) {
      navigate("/customer");
    }
    // eslint-disable-next-line
  }, [user]);

  const logout = () => {};

  const value = useMemo(
    () => ({
      user,
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
