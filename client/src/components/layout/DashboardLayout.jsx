import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTrips } from "../../context/TripContext";
import {
  Sparkles,
  Compass,
  Bookmark,
  Heart,
  Settings,
  BookOpen,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";
import { AuthModal } from "../auth/AuthModal";

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { savedTrips } = useTrips();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/planner", label: "AI Trip Planner", icon: Compass, badge: null },
    { to: "/trips", label: "Saved Trips", icon: Bookmark, badge: savedTrips.length || null },
    { to: "/favorites", label: "Favorite Destinations", icon: Heart, badge: savedTrips.filter(t => t.isFavorite).length || null },
    { to: "/profile", label: "Profile Settings", icon: Settings, badge: null },
    { to: "/settings", label: "Preferences & Settings", icon: Settings, badge: null },
    { to: "/docs", label: "Architecture Spec", icon: BookOpen, badge: null }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block">
                  VoyageAI <span className="text-cyan-400">Pro</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">Mistral AI Travel Engine</span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/50 text-cyan-300 font-bold shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.to === "/favorites" ? "bg-rose-955/80 text-rose-300 border border-rose-800" : "bg-slate-800 text-slate-300"}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="pt-4 border-t border-slate-800">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div className="truncate">
                  <span className="block text-xs font-bold text-white truncate">{user.name}</span>
                  <span className="block text-[10px] text-slate-400 truncate">{user.email}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-rose-400 transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-2.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Navbar */}
        <header className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-slate-300 hover:text-white p-1.5 rounded-lg bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                VoyageAI Travel Command Center
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Powered by Mistral AI & MongoDB Atlas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!user && (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                Log In
              </button>
            )}

            <button
              onClick={() => navigate("/planner")}
              className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New AI Plan</span>
            </button>
          </div>
        </header>

        {/* Page Content Outlet */}
        <div className="p-4 sm:p-8 space-y-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
