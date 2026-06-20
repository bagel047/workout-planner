import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // decode JWT payload to get user info
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("JWT payload:", payload);
        setUser({ username: payload.sub, id: payload.userId });
      } catch {
        setToken(null);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, [token]);

  const login = (tokenFromServer) => {
    localStorage.setItem("token", tokenFromServer);
    setToken(tokenFromServer);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
