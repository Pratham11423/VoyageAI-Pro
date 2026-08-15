import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { Settings, Moon, Sun, Globe, Bell, Ruler, CircleDollarSign } from "lucide-react";

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState("metric");

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast("Application settings saved!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5 mb-6">
          <Settings className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-lg font-bold text-white">Application Settings & Preferences</h3>
            <p className="text-xs text-slate-400">Configure language, theme, currency conversions, and notification services.</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Theme Section */}
          <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
              <div>
                <div className="text-sm font-bold text-white">Color Mode</div>
                <div className="text-xs text-slate-400">Switch between dark mode and light mode interface.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              Toggle Color Theme ({theme.toUpperCase()})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Currency */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <CircleDollarSign className="w-4 h-4 text-emerald-400" /> Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="JPY">JPY (¥ - Japanese Yen)</option>
                <option value="AUD">AUD ($ - Australian Dollar)</option>
              </select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" /> Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Notifications */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400" /> Push Notifications
              </label>
              <select
                value={notifications ? "enabled" : "disabled"}
                onChange={(e) => setNotifications(e.target.value === "enabled")}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            {/* Units */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-indigo-400" /> Measurement Units
              </label>
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="metric">Metric (Kilometers, Celsius)</option>
                <option value="imperial">Imperial (Miles, Fahrenheit)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SettingsPage;
