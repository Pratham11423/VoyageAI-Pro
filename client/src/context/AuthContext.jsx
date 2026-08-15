import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Set up Axios default headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const checkAuth = async () => {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await axios.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      if (res.data && res.data.user) {
        setUser({
          userId: res.data.user.id || res.data.user._id,
          email: res.data.user.email,
          name: res.data.user.name,
          role: res.data.user.role,
          avatar: res.data.user.avatar,
        });
        setToken(savedToken);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (e) {
      console.error("Auth check failed", e);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, pass) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password: pass });
      const data = res.data;
      
      setUser({
        userId: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        avatar: data.user.avatar,
      });
      setToken(data.token);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error || "Login failed";
      return { success: false, error: errMsg };
    }
  };

  const register = async (name, email, pass) => {
    try {
      const res = await axios.post("/api/auth/register", { name, email, password: pass });
      const data = res.data;
      
      setUser({
        userId: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        avatar: data.user.avatar,
      });
      setToken(data.token);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error || "Registration failed";
      return { success: false, error: errMsg };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
