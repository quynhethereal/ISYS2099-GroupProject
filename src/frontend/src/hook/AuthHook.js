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
    await loginUser(data).then((res) => {
      setUser(res);
    });
  };

  useEffect(() => {
    if (user) {
      // navigate("/customer");
      console.log(user);
    }
    // eslint-disable-next-line
  }, [setUser]);

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
