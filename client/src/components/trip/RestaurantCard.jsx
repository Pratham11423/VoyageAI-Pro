import React from "react";
import { Utensils, Star, MapPin, ExternalLink, Sparkles } from "lucide-react";

export const RestaurantCard = ({ restaurant, destination }) => {
  const mapUrl =
    restaurant.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${destination}`)}`;

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-amber-950/20 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                {restaurant.name}
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-300 font-medium">{restaurant.cuisine}</span>
                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {restaurant.rating}
                </span>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full shrink-0">
            {restaurant.priceLevel}
          </span>
        </div>

        <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="line-clamp-1">{restaurant.address}</span>
        </p>

        {restaurant.signatureDish && (
          <div className="bg-amber-950/30 border border-amber-900/40 p-2.5 rounded-xl text-xs text-amber-200/90 mb-3 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Must Try: </span>
              {restaurant.signatureDish}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">Google Places Verified</span>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>Directions</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
