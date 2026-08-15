import React, { useState } from "react";
import {
  Search,
  Heart,
  Calendar,
  DollarSign,
  Trash2,
  Copy,
  ExternalLink,
  MapPin,
  Sparkles,
  Users,
  Compass,
} from "lucide-react";

export const SavedTripsView = ({
  trips,
  onSelectTrip,
  onToggleFavorite,
  onDeleteTrip,
  onDuplicateTrip,
  isLoading,
  onNewTripClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.country.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === "favorites") return t.isFavorite;
    if (filterTab === "planned") return t.status === "planned";
    if (filterTab === "completed") return t.status === "completed";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            Your Saved AI Itineraries
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access, edit, duplicate, and review all your generated travel plans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search destination or title..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={onNewTripClick}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Plan New Trip
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-slate-800">
        {[
          { key: "all", label: `All Saved (${trips.length})` },
          { key: "favorites", label: `Favorites (${trips.filter((t) => t.isFavorite).length})` },
          { key: "planned", label: `Planned (${trips.filter((t) => t.status === "planned").length})` },
          { key: "completed", label: `Completed (${trips.filter((t) => t.status === "completed").length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-4 py-2 font-semibold transition-all border-b-2 -mb-[1px] ${
              filterTab === tab.key
                ? "border-cyan-400 text-cyan-300 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse p-4 flex flex-col justify-between">
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-800 rounded w-1/2" />
                <div className="h-3 bg-slate-800 rounded w-2/3" />
              </div>
              <div className="h-8 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredTrips.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-8">
          <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Saved Trips Found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            {searchTerm || filterTab !== "all"
              ? "No itineraries match your current search or filter criteria."
              : "You haven't saved any travel plans yet. Create your first AI itinerary!"}
          </p>
          <button
            onClick={onNewTripClick}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-xs shadow-lg"
          >
            Create First AI Trip
          </button>
        </div>
      )}

      {/* Trips Grid */}
      {!isLoading && filteredTrips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrips.map((trip) => {
            const cost = trip.costBreakdown?.grandTotalUSD || parseFloat(trip.totalBudgetUSD || "0");
            const tripId = trip.id || trip._id;

            return (
              <div
                key={tripId}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:shadow-cyan-950/20 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {trip.destination}
                    </span>

                    <button
                      onClick={() => onToggleFavorite(tripId, trip.isFavorite)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                      title={trip.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          trip.isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-500"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & Country */}
                  <h3
                    onClick={() => onSelectTrip(trip)}
                    className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer mb-2"
                  >
                    {trip.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>
                        {trip.durationDays} Days ({trip.startDate || "Flexible Dates"})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {trip.travelersCount} Traveler(s) • {trip.travelersType}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Est. Cost: ${cost.toLocaleString()} ({trip.budgetTier})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateTrip(tripId)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700 transition-colors"
                      title="Duplicate Trip"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(tripId)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-slate-700 transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>View Itinerary</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Delete Confirm Modal Overlay */}
                {deleteConfirmId === tripId && (
                  <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl max-w-xs w-full shadow-2xl space-y-3">
                      <h4 className="font-bold text-white text-sm">Delete Itinerary?</h4>
                      <p className="text-xs text-slate-300">
                        Are you sure you want to delete <span className="text-cyan-300 font-semibold">{trip.title}</span>? This action cannot be undone.
                      </p>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 font-medium hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            onDeleteTrip(tripId);
                            setDeleteConfirmId(null);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs bg-rose-600 text-white font-bold hover:bg-rose-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
