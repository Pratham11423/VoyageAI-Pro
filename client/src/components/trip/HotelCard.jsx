import React from "react";
import { Hotel as HotelIcon, Star, MapPin, ExternalLink, Check, Sparkles } from "lucide-react";

export const HotelCard = ({ hotel, destination }) => {
  const mapUrl =
    hotel.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${destination}`)}`;

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-emerald-950/20 flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <HotelIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors line-clamp-1">
                {hotel.name}
              </h4>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{hotel.rating}</span>
                {hotel.reviewsCount && (
                  <span className="text-slate-500 font-normal">({hotel.reviewsCount} reviews)</span>
                )}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full shrink-0">
            {hotel.priceRangeUSD}
          </span>
        </div>

        {/* Address */}
        <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="line-clamp-1">{hotel.address}</span>
        </p>

        {hotel.matchReason && (
          <p className="text-xs text-emerald-300/90 bg-emerald-950/40 border border-emerald-900/50 p-2 rounded-lg mb-3 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{hotel.matchReason}</span>
          </p>
        )}

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities.slice(0, 4).map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">Google Places Verified</span>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>View on Map</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
