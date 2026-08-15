import React, { useState } from "react";
import { DestinationSearch } from "./DestinationSearch";
import {
  Calendar,
  Users,
  DollarSign,
  Compass,
  Hotel,
  Bus,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const INTEREST_OPTIONS = [
  { id: "Culture", name: "Historical Places", icon: "🏛️" },
  { id: "Food", name: "Food & Culinary", icon: "🍜" },
  { id: "Adventure", name: "Outdoor Adventure", icon: "🧗" },
  { id: "Nature", name: "Nature & Parks", icon: "🌿" },
  { id: "Shopping", name: "Shopping & Markets", icon: "🛍️" },
  { id: "Nightlife", name: "Nightlife & Bars", icon: "🍸" },
  { id: "Beaches", name: "Beaches & Coastal", icon: "🏖️" },
  { id: "Mountains", name: "Mountains & Hiking", icon: "⛰️" },
  { id: "Wildlife", name: "Wildlife & Safaris", icon: "🦁" },
  { id: "Photography", name: "Photography Spots", icon: "📸" },
  { id: "Art", name: "Art & Museums", icon: "🎨" },
  { id: "Wellness", name: "Wellness & Spa", icon: "🧘" },
];

const ACCOMMODATION_OPTIONS = [
  "Budget Hotel",
  "Boutique Hotel",
  "Luxury Hotel",
  "Resort",
  "Hostel",
  "Airbnb",
];

const TRANSPORT_OPTIONS = [
  "Public Transport",
  "Taxi & Ride-Hailing",
  "Rental Car",
  "Walking",
];

export const PlannerForm = ({
  onSubmit,
  isGenerating,
  initialData,
}) => {
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [coordinates, setCoordinates] = useState(initialData?.coordinates);
  const [budgetTier, setBudgetTier] = useState(
    initialData?.budgetTier || "Moderate"
  );
  const [durationDays, setDurationDays] = useState(initialData?.durationDays || 3);
  const [travelersCount, setTravelersCount] = useState(initialData?.travelersCount || 1);
  const [travelersType, setTravelersType] = useState(
    initialData?.travelersType || "Solo"
  );
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [interests, setInterests] = useState(
    initialData?.interests || ["Culture", "Food", "Nature"]
  );
  const [accommodationPref, setAccommodationPref] = useState(
    initialData?.accommodationPref || "Boutique Hotel"
  );
  const [transportPref, setTransportPref] = useState(
    initialData?.transportPref || "Public Transport"
  );

  const [errors, setErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleInterest = (interestName) => {
    if (interests.includes(interestName)) {
      setInterests(interests.filter((i) => i !== interestName));
    } else {
      if (interests.length >= 6) return; // Limit to 6
      setInterests([...interests, interestName]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination.trim()) {
      setErrors({ destination: "Destination is required to generate your AI trip." });
      return;
    }
    setErrors({});

    onSubmit({
      destination: destination.trim(),
      coordinates,
      budgetTier,
      durationDays,
      travelersCount,
      travelersType,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      interests,
      accommodationPref,
      transportPref,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            AI Travel Itinerary Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure your dream destination, budget, party size, and travel style for instant Mistral AI planning.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Destination Search */}
        <DestinationSearch
          value={destination}
          onChange={(val) => {
            setDestination(val);
            if (errors.destination) setErrors({});
          }}
          onSelectCoordinates={(coords) => setCoordinates(coords)}
          error={errors.destination}
        />

        {/* Budget Tier Picker */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Budget Profile
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { tier: "Budget", label: "Budget $", desc: "Hostels, Street Food, Transit" },
              { tier: "Moderate", label: "Moderate $$", desc: "3-4★ Hotels, Bistro Dining" },
              { tier: "Luxury", label: "Luxury $$$", desc: "5★ Resorts, Fine Dining" },
              { tier: "Ultra-Luxury", label: "Ultra $$$$", desc: "Private Villas, VIP Concierge" },
            ].map((item) => (
              <button
                type="button"
                key={item.tier}
                onClick={() => setBudgetTier(item.tier)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  budgetTier === item.tier
                    ? "bg-gradient-to-br from-cyan-950 to-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10 text-cyan-300"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                {budgetTier === item.tier && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-sm" />
                )}
                <div className="font-bold text-sm">{item.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration & Travelers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duration Slider */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Trip Duration: <span className="text-cyan-300 font-bold">{durationDays} Days</span>
              </label>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1 Day Quick Trip</span>
              <span>7 Days Week</span>
              <span>14 Days Expedition</span>
            </div>
          </div>

          {/* Travelers Type & Count */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <label className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              Travel Party
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 grid grid-cols-4 gap-1 text-xs">
                {["Solo", "Couple", "Family", "Friends"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setTravelersType(type);
                      if (type === "Solo") setTravelersCount(1);
                      if (type === "Couple") setTravelersCount(2);
                      if (type === "Family" && travelersCount < 3) setTravelersCount(4);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                      travelersType === type
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Count Adjuster */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1">
                <button
                  type="button"
                  onClick={() => setTravelersCount((c) => Math.max(1, c - 1))}
                  className="text-slate-400 hover:text-white px-1 text-sm font-bold"
                >
                  -
                </button>
                <span className="text-xs font-bold text-cyan-300 w-4 text-center">{travelersCount}</span>
                <button
                  type="button"
                  onClick={() => setTravelersCount((c) => Math.min(10, c + 1))}
                  className="text-slate-400 hover:text-white px-1 text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Interests Multiselect */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              Travel Interests & Vibe
            </span>
            <span className="text-xs text-slate-400 font-normal">Select up to 6</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {INTEREST_OPTIONS.map((item) => {
              const isSelected = interests.includes(item.id) || interests.includes(item.name);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInterest(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-cyan-950/80 border-cyan-500/80 text-cyan-300 shadow-md shadow-cyan-950/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 py-1"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvanced ? "Hide Accommodation & Travel Dates" : "More Options (Dates, Accommodation & Transport)"}
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-4 pt-3 border-t border-slate-800/80 animate-in fade-in duration-200">
              {/* Optional Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date (Optional)</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Accommodation & Transport */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Hotel className="w-3.5 h-3.5 text-emerald-400" /> Accommodation Style
                  </label>
                  <select
                    value={accommodationPref}
                    onChange={(e) => setAccommodationPref(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {ACCOMMODATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5 text-cyan-400" /> Primary Transport
                  </label>
                  <select
                    value={transportPref}
                    onChange={(e) => setTransportPref(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {TRANSPORT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 border border-cyan-400/30 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed text-base"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin text-cyan-300" />
              <span>Generating AI Itinerary with Mistral AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
              <span>Generate Custom AI Travel Plan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
