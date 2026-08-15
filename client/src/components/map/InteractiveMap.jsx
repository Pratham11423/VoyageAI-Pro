import React, { useState, useMemo } from "react";
import { MapPin, Navigation, Hotel, Utensils, Compass, Layers, ExternalLink } from "lucide-react";

export const InteractiveMap = ({
  center,
  destinationName,
  markers,
  activeMarkerId,
  onMarkerSelect,
  className = "h-[450px] w-full",
}) => {
  const [filter, setFilter] = useState("all");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(13);

  // Compute map bounds to fit markers nicely
  const filteredMarkers = useMemo(() => {
    if (filter === "all") return markers;
    if (filter === "hotels") return markers.filter((m) => m.type === "hotel");
    if (filter === "restaurants") return markers.filter((m) => m.type === "restaurant");
    if (filter === "attractions") return markers.filter((m) => m.type === "attraction");
    if (filter === "schedule") return markers.filter((m) => m.type === "schedule");
    return markers;
  }, [markers, filter]);

  // Convert Lat/Lng to SVG percent offsets relative to map center
  const getPositionStyle = (lat, lng) => {
    const latDelta = center.lat - lat;
    const lngDelta = lng - center.lng;

    const scale = (zoomLevel / 13) * 800; // factor
    const top = 50 + latDelta * scale;
    const left = 50 + lngDelta * scale;

    const clamp = (val) => Math.max(8, Math.min(92, val));

    return {
      top: `${clamp(top)}%`,
      left: `${clamp(left)}%`,
    };
  };

  const currentMarker = selectedMarker || markers.find((m) => m.id === activeMarkerId);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-2xl flex flex-col ${className}`}>
      {/* Map Header & Filter Toolbar */}
      <div className="bg-slate-800/90 backdrop-blur-md px-4 py-3 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Interactive Destination Map</span>
          <span className="text-xs font-normal text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
            {destinationName}
          </span>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filter === "all" ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            All ({markers.length})
          </button>
          <button
            onClick={() => setFilter("schedule")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              filter === "schedule" ? "bg-cyan-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Compass className="w-3 h-3 text-cyan-400" /> Daily Itinerary
          </button>
          <button
            onClick={() => setFilter("hotels")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              filter === "hotels" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Hotel className="w-3 h-3 text-emerald-400" /> Hotels
          </button>
          <button
            onClick={() => setFilter("restaurants")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              filter === "restaurants" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Utensils className="w-3 h-3 text-amber-400" /> Dining
          </button>
          <button
            onClick={() => setFilter("attractions")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              filter === "attractions" ? "bg-indigo-500 text-white font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <MapPin className="w-3 h-3 text-indigo-400" /> Sights
          </button>
        </div>
      </div>

      {/* Main Map View Canvas */}
      <div className="relative flex-1 bg-slate-950/80 overflow-hidden select-none">
        {/* Dark Modern Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
        
        {/* Decorative Map Topographic Features */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none stroke-cyan-500/30" fill="none">
          <path d="M 0 100 Q 200 150 400 80 T 800 200 T 1200 150" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M 100 0 Q 300 300 600 200 T 1000 400" strokeWidth="1.5" />
          <circle cx="50%" cy="50%" r="200" strokeWidth="1" strokeDasharray="4 8" className="animate-spin-slow" />
          <circle cx="50%" cy="50%" r="350" strokeWidth="0.5" />
        </svg>

        {/* Center Target Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30 flex items-center justify-center">
          <div className="w-16 h-16 border border-cyan-400 rounded-full animate-ping" />
          <div className="w-2 h-2 bg-cyan-400 rounded-full" />
        </div>

        {/* Schedule Connecting Route SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <polyline
            points={filteredMarkers
              .map((m) => {
                const pos = getPositionStyle(m.coordinates.lat, m.coordinates.lng);
                return `${pos.left.replace("%", "")}% ${pos.top.replace("%", "")}%`;
              })
              .join(" , ")}
            fill="none"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="3"
            strokeDasharray="6,6"
            strokeLinecap="round"
          />
        </svg>

        {/* Markers Pins */}
        {filteredMarkers.map((marker) => {
          const pos = getPositionStyle(marker.coordinates.lat, marker.coordinates.lng);
          const isSelected = currentMarker?.id === marker.id;

          let colorClass = "bg-cyan-500 text-slate-950 shadow-cyan-500/50";
          let IconComponent = Compass;

          if (marker.type === "hotel") {
            colorClass = "bg-emerald-500 text-slate-950 shadow-emerald-500/50";
            IconComponent = Hotel;
          } else if (marker.type === "restaurant") {
            colorClass = "bg-amber-500 text-slate-950 shadow-amber-500/50";
            IconComponent = Utensils;
          } else if (marker.type === "attraction") {
            colorClass = "bg-indigo-500 text-white shadow-indigo-500/50";
            IconComponent = MapPin;
          }

          return (
            <div
              key={marker.id}
              style={pos}
              onClick={() => {
                setSelectedMarker(marker);
                if (onMarkerSelect) onMarkerSelect(marker);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group transition-all duration-300 ${
                isSelected ? "scale-125 z-30" : "hover:scale-115"
              }`}
            >
              <div className="relative flex items-center justify-center">
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-white/20 animate-ping" />
                )}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-slate-900 ${colorClass}`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                {marker.dayNumber && (
                  <span className="absolute -top-1.5 -right-2 bg-slate-900 border border-slate-700 text-cyan-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-md">
                    D{marker.dayNumber}
                  </span>
                )}
              </div>

              {/* Pin Hover Label */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/95 text-slate-200 text-[11px] font-medium px-2 py-0.5 rounded shadow-lg border border-slate-700 whitespace-nowrap pointer-events-none z-40">
                {marker.title}
              </div>
            </div>
          );
        })}

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-20">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
            className="w-8 h-8 bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:bg-slate-700 rounded-lg flex items-center justify-center text-lg font-bold shadow-lg"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 8))}
            className="w-8 h-8 bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:bg-slate-700 rounded-lg flex items-center justify-center text-lg font-bold shadow-lg"
            title="Zoom Out"
          >
            −
          </button>
        </div>

        {/* Selected Marker Popup Card */}
        {currentMarker && (
          <div className="absolute bottom-4 left-4 right-14 sm:right-auto sm:max-w-xs z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`p-1.5 rounded-lg text-xs font-semibold ${
                    currentMarker.type === "hotel"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                      : currentMarker.type === "restaurant"
                      ? "bg-amber-950 text-amber-400 border border-amber-800/50"
                      : currentMarker.type === "attraction"
                      ? "bg-indigo-950 text-indigo-400 border border-indigo-800/50"
                      : "bg-cyan-950 text-cyan-400 border border-cyan-800/50"
                  }`}
                >
                  {currentMarker.type.toUpperCase()}
                </span>
                {currentMarker.rating && (
                  <span className="text-xs font-bold text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    ★ {currentMarker.rating}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm font-bold text-white mt-1.5 line-clamp-1">{currentMarker.title}</h4>
            {currentMarker.address && (
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                {currentMarker.address}
              </p>
            )}

            {currentMarker.timeSlot && (
              <p className="text-xs text-cyan-300 mt-1 font-medium">
                Time: {currentMarker.timeSlot}
              </p>
            )}

            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
              {currentMarker.cost && (
                <span className="text-xs font-bold text-emerald-400">
                  {typeof currentMarker.cost === "number" ? `$${currentMarker.cost}` : currentMarker.cost}
                </span>
              )}

              <a
                href={
                  currentMarker.googleMapsUrl ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentMarker.title} ${destinationName}`)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Directions <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
