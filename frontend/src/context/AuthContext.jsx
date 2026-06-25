import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("JWT payload:", payload);
        if (payload.sub || payload.userId) {
          setUser({
            username: payload.sub || payload.email || "user",
            id: payload.userId,
            avatarUrl: payload.avatarUrl || null,
          });
        } else {
          // invalid token
          setToken(null);
          localStorage.removeItem("token");
        }
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
