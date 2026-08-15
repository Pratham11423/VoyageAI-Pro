import React from "react";
import { useTrips } from "../../context/TripContext";
import { SavedTripsView } from "../../components/trip/SavedTripsView";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

export const SavedTripsPage = ({ filterFavorites = false }) => {
  const {
    savedTrips,
    isLoadingSaved,
    toggleFavorite,
    deleteTrip,
    duplicateTrip,
    setCurrentTrip,
    setIsSavedCurrent,
  } = useTrips();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSelectTrip = (trip) => {
    const full = {
      id: trip.id || trip._id,
      title: trip.title,
      summary: trip.summary || `Saved trip to ${trip.destination}`,
      destination: trip.destination,
      country: trip.country,
      coordinates: trip.coordinates || { lat: 48.8566, lng: 2.3522 },
      durationDays: trip.durationDays,
      travelersCount: trip.travelersCount,
      travelersType: trip.travelersType,
      budgetTier: trip.budgetTier,
      interests: trip.interests || [],
      accommodationPref: trip.accommodationPref || "Moderate Hotel",
      transportPref: trip.transportPref || "Public Transport",
      itinerary: trip.itinerary,
      hotels: trip.hotels || [],
      restaurants: trip.restaurants || [],
      attractions: trip.attractions || [],
      costBreakdown: trip.costBreakdown,
      travelTips: trip.travelTips || {
        weatherSummary: "Mild and pleasant weather expected.",
        bestTimeToVisit: "Spring or Autumn",
        localEtiquette: ["Be respectful at cultural monuments"],
        packingEssentials: ["Walking shoes", "Power bank"],
        currencyAndTipping: "Credit cards accepted",
        safetyAdvice: "Keep valuables safe",
      },
    };
    setCurrentTrip(full);
    setIsSavedCurrent(true);
    navigate("/planner");
    showToast(`Loaded ${trip.destination} itinerary`, "info");
  };

  const tripsToShow = filterFavorites
    ? savedTrips.filter((t) => t.isFavorite)
    : savedTrips;

  return (
    <SavedTripsView
      trips={tripsToShow}
      onSelectTrip={handleSelectTrip}
      onToggleFavorite={toggleFavorite}
      onDeleteTrip={deleteTrip}
      onDuplicateTrip={duplicateTrip}
      isLoading={isLoadingSaved}
      onNewTripClick={() => navigate("/planner")}
    />
  );
};
export default SavedTripsPage;
