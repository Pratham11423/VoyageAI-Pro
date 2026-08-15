import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { User, Settings, Save, LogOut, Compass, Heart, Calendar, Search, ChevronDown, Check } from "lucide-react";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
];

export const ProfileSettingsView = ({
  savedTripsCount,
  favoritesCount,
}) => {
  const { user, logout, checkAuth } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState("USD");
  const [pace, setPace] = useState("moderate");
  const [isSaving, setIsSaving] = useState(false);

  // Searchable Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.defaultCurrency) setCurrency(user.defaultCurrency);
    if (user?.pacePreference) setPace(user.pacePreference);
  }, [user]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          defaultCurrency: currency,
          pacePreference: pace,
        }),
      });
      if (res.ok) {
        showToast("Profile settings updated!", "success");
        await checkAuth();
      } else {
        showToast("Failed to update profile", "error");
      }
    } catch {
      showToast("Error updating profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCurrencyInfo = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{savedTripsCount}</div>
            <div className="text-xs text-slate-400 font-medium">Saved Travel Plans</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-800/60 flex items-center justify-center text-rose-400">
            <Heart className="w-6 h-6 fill-rose-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{favoritesCount}</div>
            <div className="text-xs text-slate-400 font-medium">Favorite Destinations</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">Active</div>
            <div className="text-xs text-slate-400 font-medium">Account Status</div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-cyan-500 overflow-hidden flex items-center justify-center text-slate-300">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-cyan-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{user?.name || "Traveler Account"}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email (Read Only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Searchable Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default Currency</label>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer flex items-center justify-between hover:border-slate-650 transition-all"
              >
                <span>
                  {selectedCurrencyInfo.code} ({selectedCurrencyInfo.symbol} - {selectedCurrencyInfo.name})
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-2 animate-in fade-in duration-100">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search currency..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                    {filteredCurrencies.length > 0 ? (
                      filteredCurrencies.map((c) => (
                        <div
                          key={c.code}
                          onClick={() => {
                            setCurrency(c.code);
                            setIsDropdownOpen(false);
                            setSearchQuery("");
                          }}
                          className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer transition-all ${
                            currency === c.code
                              ? "bg-cyan-950/80 text-cyan-300 font-bold"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <span>{c.code} ({c.symbol} - {c.name})</span>
                          {currency === c.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-xs text-slate-500 py-3">No currencies found</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Travel Pace Preference</label>
              <select
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="relaxed">Relaxed & Leisurely (2-3 sights/day)</option>
                <option value="moderate">Moderate & Balanced (3-4 sights/day)</option>
                <option value="fast-paced">Action-Packed Fast Pace (5+ sights/day)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving Preferences..." : "Save Preferences"}
          </button>
        </form>
      </div>
    </div>
  );
};
