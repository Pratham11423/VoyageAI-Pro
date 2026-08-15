import React from "react";
import { DollarSign, Wallet, PieChart, Users, Sparkles } from "lucide-react";

export const CostSummary = ({
  costBreakdown,
  durationDays,
  travelersCount,
  budgetTier,
}) => {
  const {
    accommodationTotal,
    foodTotal,
    transportTotal,
    attractionsTotal,
    miscellaneousTotal,
    grandTotalUSD,
    perPersonUSD,
  } = costBreakdown;

  const dailyBudgetUSD = Math.round(grandTotalUSD / (durationDays || 1));

  const items = [
    { label: "Hotels & Stays", amount: accommodationTotal, color: "bg-emerald-500", barColor: "from-emerald-500 to-teal-400" },
    { label: "Food & Dining", amount: foodTotal, color: "bg-amber-500", barColor: "from-amber-500 to-orange-400" },
    { label: "Transportation", amount: transportTotal, color: "bg-cyan-500", barColor: "from-cyan-500 to-blue-400" },
    { label: "Attractions & Tickets", amount: attractionsTotal, color: "bg-indigo-500", barColor: "from-indigo-500 to-purple-400" },
    { label: "Misc & Shopping", amount: miscellaneousTotal, color: "bg-rose-500", barColor: "from-rose-500 to-pink-400" },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Estimated Budget & Cost Breakdown</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">
          {budgetTier} Tier
        </span>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Total Estimated Cost
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            ${grandTotalUSD.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">For entire trip & party</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            Cost Per Traveler
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 mt-1">
            ${perPersonUSD.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{travelersCount} traveler(s)</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <PieChart className="w-3.5 h-3.5 text-amber-400" />
            Average Daily Spend
          </div>
          <div className="text-2xl font-extrabold text-amber-300 mt-1">
            ${dailyBudgetUSD.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across {durationDays} days</div>
        </div>
      </div>

      {/* Visual Category Breakdown Progress Bars */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category Allocation</h4>
        {items.map((cat) => {
          const percent = grandTotalUSD > 0 ? Math.round((cat.amount / grandTotalUSD) * 100) : 0;
          return (
            <div key={cat.label} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                  {cat.label}
                </span>
                <span className="text-slate-200 font-semibold">
                  ${cat.amount.toLocaleString()}{" "}
                  <span className="text-slate-500 font-normal">({percent}%)</span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${percent}%` }}
                  className={`h-full bg-gradient-to-r ${cat.barColor} transition-all duration-500`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>Prices are intelligent estimates based on real-time seasonal averages for {durationDays} days.</span>
      </div>
    </div>
  );
};
