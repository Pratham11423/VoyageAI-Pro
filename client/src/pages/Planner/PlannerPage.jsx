import React, { useState, useMemo } from "react";
import { useTrips } from "../../context/TripContext";
import { useAuth } from "../../context/AuthContext";
import { PlannerForm } from "../../components/trip/PlannerForm";
import { InteractiveMap } from "../../components/map/InteractiveMap";
import { DayScheduleView } from "../../components/trip/DayScheduleView";
import { HotelCard } from "../../components/trip/HotelCard";
import { RestaurantCard } from "../../components/trip/RestaurantCard";
import { AttractionCard } from "../../components/trip/AttractionCard";
import { CostSummary } from "../../components/trip/CostSummary";
import { TravelTips } from "../../components/trip/TravelTips";
import { MapPin, Save, Printer, Check, Calendar, Hotel, Utensils, Layers, BookOpen } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export const PlannerPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    currentTrip,
    isGenerating,
    isSavingTrip,
    isSavedCurrent,
    focusedMapCoords,
    setFocusedMapCoords,
    generateTrip,
    saveCurrentTrip,
  } = useTrips();

  const [activeSubTab, setActiveSubTab] = useState("itinerary");

  const mapMarkers = useMemo(() => {
    if (!currentTrip) return [];
    const list = [];

    currentTrip.itinerary?.forEach((day) => {
      day.schedule?.forEach((item, idx) => {
        if (item.coordinates?.lat) {
          list.push({
            id: `sch-${day.day}-${idx}`,
            type: "schedule",
            title: item.activity,
            timeSlot: item.time,
            cost: item.estimatedCostUSD > 0 ? `$${item.estimatedCostUSD}` : undefined,
            coordinates: item.coordinates,
            dayNumber: day.day,
            address: item.location,
            googleMapsUrl: item.mapUrl,
          });
        }
      });
    });

    currentTrip.hotels?.forEach((h, idx) => {
      if (h.coordinates?.lat) {
        list.push({
          id: `hotel-${idx}`,
          type: "hotel",
          title: h.name,
          rating: h.rating,
          cost: h.priceRangeUSD,
          address: h.address,
          coordinates: h.coordinates,
          googleMapsUrl: h.googleMapsUrl,
        });
      }
    });

    currentTrip.restaurants?.forEach((r, idx) => {
      if (r.coordinates?.lat) {
        list.push({
          id: `rest-${idx}`,
          type: "restaurant",
          title: r.name,
          rating: r.rating,
          cost: r.priceLevel,
          address: r.address,
          coordinates: r.coordinates,
          googleMapsUrl: r.googleMapsUrl,
        });
      }
    });

    currentTrip.attractions?.forEach((a, idx) => {
      if (a.coordinates?.lat) {
        list.push({
          id: `attr-${idx}`,
          type: "attraction",
          title: a.name,
          rating: a.rating,
          cost: a.admissionFeeUSD === 0 ? "Free" : a.admissionFeeUSD ? `$${a.admissionFeeUSD}` : undefined,
          address: a.address,
          coordinates: a.coordinates,
          googleMapsUrl: a.googleMapsUrl,
        });
      }
    });

    return list;
  }, [currentTrip]);

  return (
    <div className="space-y-8">
      <PlannerForm onSubmit={generateTrip} isGenerating={isGenerating} initialData={currentTrip || {}} />

      {currentTrip && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold text-cyan-300 bg-cyan-950 border border-cyan-800 px-3 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {currentTrip.destination}, {currentTrip.country}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-0.5 rounded-full">
                  {currentTrip.budgetTier} Tier
                </span>
                <span className="text-xs text-slate-300 bg-slate-800 px-3 py-0.5 rounded-full">
                  {currentTrip.durationDays} Days • {currentTrip.travelersCount} Traveler(s)
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">{currentTrip.title}</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">{currentTrip.summary}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={saveCurrentTrip}
                disabled={isSavingTrip || isSavedCurrent}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg ${
                  isSavedCurrent
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800/80"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                }`}
              >
                {isSavedCurrent ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" /> Saved to Account
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> {isSavingTrip ? "Saving..." : "Save Trip"}
                  </>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Export / Print
              </button>
            </div>
          </div>

          <InteractiveMap
            center={focusedMapCoords || currentTrip.coordinates}
            destinationName={currentTrip.destination}
            markers={mapMarkers}
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-slate-800">
            {[
              { key: "itinerary", label: `Day Schedule (${currentTrip.itinerary?.length || 0})`, icon: Calendar },
              { key: "hotels", label: `Hotels (${currentTrip.hotels?.length || 0})`, icon: Hotel },
              { key: "restaurants", label: `Dining (${currentTrip.restaurants?.length || 0})`, icon: Utensils },
              { key: "attractions", label: `Attractions (${currentTrip.attractions?.length || 0})`, icon: MapPin },
              { key: "costs", label: "Cost Breakdown", icon: Layers },
              { key: "tips", label: "Travel Tips & Guide", icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveSubTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 font-bold transition-all border-b-2 -mb-[1px] ${
                    isActive
                      ? "border-cyan-400 text-cyan-300 bg-cyan-950/40 rounded-t-xl"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeSubTab === "itinerary" && (
            <div className="space-y-4">
              {currentTrip.itinerary?.map((day) => (
                <DayScheduleView
                  key={day.day}
                  dayData={day}
                  destinationName={currentTrip.destination}
                  onFocusMapLocation={(coords) => {
                    setFocusedMapCoords(coords);
                    showToast("Focused map on activity location", "info");
                  }}
                />
              ))}
            </div>
          )}

          {activeSubTab === "hotels" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTrip.hotels?.map((h, idx) => (
                <HotelCard key={idx} hotel={h} destination={currentTrip.destination} />
              ))}
            </div>
          )}

          {activeSubTab === "restaurants" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTrip.restaurants?.map((r, idx) => (
                <RestaurantCard key={idx} restaurant={r} destination={currentTrip.destination} />
              ))}
            </div>
          )}

          {activeSubTab === "attractions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTrip.attractions?.map((a, idx) => (
                <AttractionCard key={idx} attraction={a} destination={currentTrip.destination} />
              ))}
            </div>
          )}

          {activeSubTab === "costs" && (
            <CostSummary
              costBreakdown={currentTrip.costBreakdown}
              durationDays={currentTrip.durationDays}
              travelersCount={currentTrip.travelersCount}
              budgetTier={currentTrip.budgetTier}
            />
          )}

          {activeSubTab === "tips" && <TravelTips tips={currentTrip.travelTips} />}
        </div>
      )}
    </div>
  );
};

export default PlannerPage;
