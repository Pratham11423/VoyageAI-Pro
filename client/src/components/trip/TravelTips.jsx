import React, { useState } from "react";
import { CloudSun, Briefcase, BookOpen, ShieldCheck, DollarSign, Check } from "lucide-react";

export const TravelTips = ({ tips }) => {
  const [packedItems, setPackingItems] = useState({});

  const togglePacked = (item) => {
    setPackingItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          AI Local Travel Guide & Smart Tips
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Essential insider guidance, cultural customs, weather forecasts, and interactive packing list.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weather & Best Time */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <CloudSun className="w-4 h-4 text-amber-400" />
            Weather & Visiting Window
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{tips.weatherSummary}</p>
          <div className="pt-2 border-t border-slate-800/80 text-xs text-cyan-300 font-medium">
            <span className="text-slate-400">Optimal Window: </span>
            {tips.bestTimeToVisit}
          </div>
        </div>

        {/* Currency & Safety */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Currency, Tipping & Safety
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{tips.currencyAndTipping}</p>
          <div className="pt-2 border-t border-slate-800/80 text-xs text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{tips.safetyAdvice}</span>
          </div>
        </div>
      </div>

      {/* Local Etiquette & Customs */}
      {tips.localEtiquette && tips.localEtiquette.length > 0 && (
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Local Cultural Etiquette
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {tips.localEtiquette.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Packing List */}
      {tips.packingEssentials && tips.packingEssentials.length > 0 && (
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            Interactive Packing List
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tips.packingEssentials.map((item) => {
              const isChecked = !!packedItems[item];
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => togglePacked(item)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-all ${
                    isChecked
                      ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 line-through opacity-70"
                      : "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isChecked ? "bg-emerald-500 border-emerald-400 text-slate-950" : "border-slate-600"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="truncate">{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
