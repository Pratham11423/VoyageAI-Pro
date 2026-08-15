import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTrips } from "../../context/TripContext";
import { useNavigate, Link } from "react-router-dom";
import { Compass, Heart, Calendar, ArrowRight, Sparkles, Shield, User } from "lucide-react";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { savedTrips } = useTrips();
  const navigate = useNavigate();

  const recentTrips = savedTrips.slice(0, 3);
  const favoritesCount = savedTrips.filter((t) => t.isFavorite).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-bold rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Welcome Back
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Explore the World with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">VoyageAI Pro</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome back, {user?.name || "Traveler"}! Generate bespoke day-by-day travel plans, search top local hotels and dining spots, and track budgets automatically.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate("/planner")}
              className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center gap-2 group"
            >
              <span>Launch AI Planner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{savedTrips.length}</div>
            <div className="text-xs text-slate-400 font-medium">Saved Travel Plans</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-800/60 flex items-center justify-center text-rose-400">
            <Heart className="w-6 h-6 fill-rose-400 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{favoritesCount}</div>
            <div className="text-xs text-slate-400 font-medium">Favorite Destinations</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">Active</div>
            <div className="text-xs text-slate-400 font-medium">Premium Member</div>
          </div>
        </div>
      </div>

      {/* Recent Trips Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" /> Recent Trips
          </h3>
          {savedTrips.length > 0 && (
            <Link to="/trips" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentTrips.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 p-8 text-center rounded-2xl">
            <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white">No plans generated yet</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">Plan a custom travel plan using Mistral AI concierge services.</p>
            <button
              onClick={() => navigate("/planner")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl shadow"
            >
              Build Trip Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentTrips.map((trip) => {
              const tripId = trip.id || trip._id;
              return (
                <div
                  key={tripId}
                  onClick={() => navigate("/trips")}
                  className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl shadow-md hover:shadow-cyan-950/10 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold bg-cyan-950 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded-full">
                      {trip.destination}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {trip.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {trip.durationDays} Days • {trip.travelersCount} Travelers
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span>{trip.budgetTier} Tier</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardPage;
