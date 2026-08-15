import React from "react";
import { Compass, Star, MapPin, ExternalLink, Clock, Ticket } from "lucide-react";

export const AttractionCard = ({ attraction, destination }) => {
  const mapUrl =
    attraction.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${attraction.name} ${destination}`)}`;

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-indigo-950/20 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors line-clamp-1">
                {attraction.name}
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-indigo-300 font-medium">{attraction.category}</span>
                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {attraction.rating}
                </span>
              </div>
            </div>
          </div>
          {attraction.admissionFeeUSD !== undefined && (
            <span className="text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1">
              <Ticket className="w-3 h-3 text-indigo-400" />
              {attraction.admissionFeeUSD === 0 ? "Free Entry" : `$${attraction.admissionFeeUSD}`}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="line-clamp-1">{attraction.address}</span>
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 mb-3">
          {attraction.openingHours && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{attraction.openingHours}</span>
            </div>
          )}
          {attraction.recommendedDuration && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{attraction.recommendedDuration}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">Top Attraction</span>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>Explore Sights</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
