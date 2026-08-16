import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import confetti from "canvas-confetti";

const TripContext = createContext(undefined);

export const TripProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentTrip, setCurrentTrip] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isSavingTrip, setIsSavingTrip] = useState(false);
  const [isSavedCurrent, setIsSavedCurrent] = useState(false);
  const [focusedMapCoords, setFocusedMapCoords] = useState(null);

  const fetchSavedTrips = useCallback(async () => {
    if (!user) {
      setSavedTrips([]);
      return;
    }
    setIsLoadingSaved(true);
    try {
      const res = await api.get("/api/trips");
      setSavedTrips(res.data.trips || []);
    } catch (e) {
      console.error("Failed to load saved trips", e);
    } finally {
      setIsLoadingSaved(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedTrips();
  }, [fetchSavedTrips]);

  const generateTrip = async (formData) => {
    setIsGenerating(true);
    setIsSavedCurrent(false);
    try {
      const res = await api.post("/api/ai/generate-trip", formData);
      const data = res.data;
      if (data.tripData) {
        const trip = {
          ...data.tripData,
          durationDays: formData.durationDays,
          travelersCount: formData.travelersCount,
          travelersType: formData.travelersType,
          budgetTier: formData.budgetTier,
          interests: formData.interests,
          accommodationPref: formData.accommodationPref,
          transportPref: formData.transportPref,
        };
        setCurrentTrip(trip);
        showToast(`AI Trip generated for ${trip.destination}!`, "success");
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
        return { success: true, trip };
      } else {
        showToast(data.error || "Failed to generate AI trip plan.", "error");
        return { success: false, error: data.error };
      }
    } catch (err) {
      let errMsg = "Network error generating AI travel plan.";
      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          errMsg = "Session expired. Please log in again.";
        } else if (status === 403) {
          errMsg = "Access forbidden. You do not have permission.";
        } else if (status === 404) {
          errMsg = "Travel planning service endpoint not found.";
        } else if (status === 429) {
          errMsg = "Too many requests. Please wait a moment and try again.";
        } else if (status >= 500) {
          errMsg = err.response.data?.error || "Server error occurred while generating itinerary. Please try again.";
        } else {
          errMsg = err.response.data?.error || errMsg;
        }
      } else if (err.request) {
        errMsg = "Unable to connect to the travel planning service. Please check your internet connection or try again later.";
      }
      console.error("[TripContext] Error generating trip:", err);
      showToast(errMsg, "error");
      return { success: false, error: errMsg };
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCurrentTrip = async () => {
    if (!currentTrip) return { success: false, error: "No trip to save" };
    setIsSavingTrip(true);
    try {
      const res = await api.post("/api/trips", currentTrip);
      setIsSavedCurrent(true);
      showToast("Trip saved to your account!", "success");
      await fetchSavedTrips();
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {}
      return { success: true, trip: res.data.trip };
    } catch (err) {
      const errMsg = err.response?.data?.error || "Error saving trip.";
      showToast(errMsg, "error");
      return { success: false, error: errMsg };
    } finally {
      setIsSavingTrip(false);
    }
  };

  const toggleFavorite = async (id, currentFav) => {
    try {
      await api.put(`/api/trips/${id}`, { isFavorite: !currentFav });
      showToast(currentFav ? "Removed from favorites" : "Added to favorites", "success");
      await fetchSavedTrips();
    } catch (err) {
      showToast("Failed to update favorite status", "error");
    }
  };

  const deleteTrip = async (id) => {
    try {
      await api.delete(`/api/trips/${id}`);
      showToast("Trip deleted", "info");
      await fetchSavedTrips();
    } catch (err) {
      showToast("Failed to delete trip", "error");
    }
  };

  const duplicateTrip = async (id) => {
    try {
      await api.post(`/api/trips/${id}/duplicate`);
      showToast("Trip duplicated!", "success");
      await fetchSavedTrips();
    } catch (err) {
      showToast("Failed to duplicate trip", "error");
    }
  };

  return (
    <TripContext.Provider
      value={{
        currentTrip,
        setCurrentTrip,
        savedTrips,
        setSavedTrips,
        isGenerating,
        isLoadingSaved,
        isSavingTrip,
        isSavedCurrent,
        setIsSavedCurrent,
        focusedMapCoords,
        setFocusedMapCoords,
        fetchSavedTrips,
        generateTrip,
        saveCurrentTrip,
        toggleFavorite,
        deleteTrip,
        duplicateTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripProvider");
  }
  return context;
};
