import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const { user, checkAuth } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [loadingPref, setLoadingPref] = useState(false);

  const fetchPreferences = async () => {
    if (!user) return;
    setLoadingPref(true);
    try {
      const res = await api.get("/api/auth/profile/preferences");
      setPreferences(res.data.preferences);
    } catch (e) {
      console.error("Failed to load user preferences", e);
    } finally {
      setLoadingPref(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const updateProfile = async (data) => {
    try {
      const res = await api.put("/api/auth/profile", data);
      await checkAuth();
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Failed to update profile" };
    }
  };

  const uploadAvatar = async (formData) => {
    try {
      const res = await api.post("/api/auth/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await checkAuth();
      return { success: true, avatar: res.data.avatar };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Failed to upload avatar" };
    }
  };

  const updatePreferences = async (prefData) => {
    try {
      const res = await api.put("/api/auth/profile/preferences", prefData);
      setPreferences(res.data.preferences);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Failed to update preferences" };
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete("/api/auth/profile");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Failed to delete account" };
    }
  };

  return (
    <UserContext.Provider value={{ preferences, loadingPref, fetchPreferences, updateProfile, uploadAvatar, updatePreferences, deleteAccount }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
