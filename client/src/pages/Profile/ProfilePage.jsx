import React from "react";
import { useTrips } from "../../context/TripContext";
import { ProfileSettingsView } from "../../components/profile/ProfileSettingsView";

export const ProfilePage = () => {
  const { savedTrips } = useTrips();

  return (
    <ProfileSettingsView
      savedTripsCount={savedTrips.length}
      favoritesCount={savedTrips.filter((t) => t.isFavorite).length}
    />
  );
};
export default ProfilePage;
