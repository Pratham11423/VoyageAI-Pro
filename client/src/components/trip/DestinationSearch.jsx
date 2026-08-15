import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Sparkles, X, Globe } from "lucide-react";
import axios from "axios";

const FEATURED_DESTINATIONS = [
  { name: "Paris, France", flag: "🇫🇷", lat: 48.8566, lng: 2.3522 },
  { name: "Tokyo, Japan", flag: "🇯🇵", lat: 35.6762, lng: 139.6503 },
  { name: "New York, USA", flag: "🇺🇸", lat: 40.7128, lng: -74.006 },
  { name: "Rome, Italy", flag: "🇮🇹", lat: 41.9028, lng: 12.4964 },
  { name: "Bali, Indonesia", flag: "🇮🇩", lat: -8.4095, lng: 115.1889 },
  { name: "London, UK", flag: "🇬🇧", lat: 51.5074, lng: -0.1278 },
  { name: "Dubai, UAE", flag: "🇦🇪", lat: 25.2048, lng: 55.2708 },
  { name: "Barcelona, Spain", flag: "🇪🇸", lat: 41.3851, lng: 2.1734 },
];

export const DestinationSearch = ({
  value,
  onChange,
  onSelectCoordinates,
  error,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/maps/search?q=${encodeURIComponent(query)}`);
        setSuggestions(res.data.results || []);
      } catch (err) {
        console.error("Failed to fetch search suggestions", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (destName, lat, lng) => {
    setQuery(destName);
    onChange(destName);
    if (lat && lng && onSelectCoordinates) {
      onSelectCoordinates({ lat, lng });
    }
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="block text-sm font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-cyan-400" />
          Where do you want to go?
        </span>
        <span className="text-xs text-slate-400 font-normal">e.g. City, Country, or Landmark</span>
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-cyan-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Enter destination (e.g. Kyoto, Japan or Paris, France)"
          className={`w-full pl-11 pr-10 py-3 bg-slate-900/90 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm font-medium ${
            error ? "border-rose-500/80 focus:border-rose-500" : "border-slate-700/80 focus:border-cyan-500"
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onChange("");
              setSuggestions([]);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}

      {/* Popular Presets Bar */}
      <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 shrink-0 font-medium text-[11px]">Popular:</span>
        {FEATURED_DESTINATIONS.map((dest) => (
          <button
            key={dest.name}
            type="button"
            onClick={() => handleSelect(dest.name, dest.lat, dest.lng)}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all"
          >
            <span>{dest.flag}</span>
            <span>{dest.name.split(",")[0]}</span>
          </button>
        ))}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="p-3 text-xs text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              Searching global destinations & Google Maps Places...
            </div>
          )}

          {!isLoading &&
            suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(item.description, item.lat, item.lng)}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-800 hover:text-cyan-300 flex items-center gap-2.5 transition-colors"
              >
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="line-clamp-1">{item.description}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
