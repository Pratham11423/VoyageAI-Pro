import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Compass,
  Utensils,
  Hotel,
  Bus,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const DayScheduleView = ({
  dayData,
  destinationName,
  onFocusMapLocation,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getCategoryTheme = (cat) => {
    switch (cat) {
      case "food":
        return {
          bg: "bg-amber-950/60",
          border: "border-amber-800/60",
          text: "text-amber-400",
          icon: Utensils,
          badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        };
      case "hotel":
        return {
          bg: "bg-emerald-950/60",
          border: "border-emerald-800/60",
          text: "text-emerald-400",
          icon: Hotel,
          badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        };
      case "transit":
        return {
          bg: "bg-rose-950/60",
          border: "border-rose-800/60",
          text: "text-rose-400",
          icon: Bus,
          badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        };
      case "attraction":
      default:
        return {
          bg: "bg-cyan-950/60",
          border: "border-cyan-800/60",
          text: "text-cyan-400",
          icon: Compass,
          badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        };
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md transition-all">
      {/* Day Accordion Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 hover:bg-slate-800/80 cursor-pointer flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-black text-base flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            D{dayData.day}
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              {dayData.title}
              {dayData.date && (
                <span className="text-xs text-slate-400 font-normal">({dayData.date})</span>
              )}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{dayData.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-normal">Est. Day Spend</span>
            <span className="text-sm font-bold text-emerald-400">
              ${dayData.dailyEstimatedCostUSD}
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded Schedule Timeline */}
      {isExpanded && (
        <div className="p-5 space-y-6 animate-in fade-in duration-200">
          {/* Timeline Items */}
          <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 ml-2">
            {dayData.schedule.map((item, idx) => {
              const theme = getCategoryTheme(item.category);
              const CategoryIcon = theme.icon;

              return (
                <div key={idx} className="relative group">
                  {/* Timeline Point Bullet */}
                  <div
                    className={`absolute -left-[31px] top-1.5 w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-md ${theme.bg} ${theme.text}`}
                  >
                    <CategoryIcon className="w-3 h-3" />
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 p-4 rounded-xl shadow-md transition-all group-hover:shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-300 bg-slate-900 border border-slate-700/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {item.time}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border uppercase ${theme.badgeBg}`}
                        >
                          {item.category}
                        </span>
                      </div>

                      {item.estimatedCostUSD > 0 && (
                        <span className="text-xs font-bold text-emerald-400">
                          ${item.estimatedCostUSD}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">{item.activity}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.description}</p>

                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-medium text-slate-300">{item.location}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.coordinates && onFocusMapLocation && (
                          <button
                            type="button"
                            onClick={() => onFocusMapLocation(item.coordinates, item.activity)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            Focus Map
                          </button>
                        )}

                        <a
                          href={
                            item.mapUrl ||
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.activity} ${destinationName}`)}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          <span>Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insider Tip Box */}
          {dayData.insiderTip && (
            <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-xs text-cyan-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cyan-300">Local Insider Tip: </span>
                {dayData.insiderTip}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
