import React from "react";
import {
  Cpu,
  Shield,
  MapPin,
  Database,
  Zap,
  Sparkles,
  Layers,
} from "lucide-react";

export const ArchitectureDocs = () => {
  return (
    <div className="space-y-8 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-2xl backdrop-blur-md text-slate-200">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full mb-2">
          <Cpu className="w-3.5 h-3.5" /> Full-Stack Architecture Documentation
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          Production AI Travel Planner Architecture & Engineering Spec
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Detailed technical blueprint showcasing the AI travel planning workflow, prompt engineering, JWT auth security, Google Maps API integration, and database design.
        </p>
      </div>

      {/* 1. Complete Workflow Diagram */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          1. Complete AI Planning Workflow
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The application follows an asynchronous end-to-end AI execution pipeline:
        </p>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto text-cyan-300 space-y-2">
          <div>User Enters Destination & Budget & Duration & Interests</div>
          <div className="text-slate-500 pl-4">↓</div>
          <div>Destination Geocoding (Google Geocoding / OpenStreetMap Nominatim)</div>
          <div className="text-slate-500 pl-4">↓</div>
          <div>Retrieve Top Places, Restaurants & Hotels Metadata via Places API</div>
          <div className="text-slate-500 pl-4">↓</div>
          <div>Dynamic System Prompt Construction with Strict JSON Schema Constraints</div>
          <div className="text-slate-500 pl-4">↓</div>
          <div>OpenAI GPT Model Completion Request (json_object format)</div>
          <div className="text-slate-500 pl-4">↓</div>
          <div>Parse & Validate Structured Itinerary, Schedule & Cost Breakdown</div>
          <div className="text-slate-500 pl-4">↓</div>
          <div>Render Day-by-Day Interactive Schedule & Interactive Canvas Map</div>
          <div className="text-slate-500 pl-4">↓</div>
          <div>Save Structured Trip in MongoDB via Mongoose ORM</div>
        </div>
      </div>

      {/* 2. JWT Auth & Security */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          2. Authentication & Security Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Password Hashing & JWT
            </h4>
            <p className="text-slate-300">
              Passwords are salted and hashed using <strong>bcryptjs</strong> (10 salt rounds) before database insertion. Auth tokens use <strong>jsonwebtoken</strong> signed with server secret keys and sent via Auth header JWT Bearer token format.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" /> API Protection & Input Validation
            </h4>
            <p className="text-slate-300">
              Protected endpoints inspect Bearer headers. Inputs undergo validation for length, destination string sanitization, and duration limits (1-14 days).
            </p>
          </div>
        </div>
      </div>

      {/* 3. Google Maps APIs */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          3. Google Maps Platform APIs Integration
        </h3>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-3">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">1. Places API (Autocomplete & Details):</span>
              <span className="text-slate-300">Provides destination suggestions, place IDs, user ratings, opening hours, and address strings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">2. Geocoding API:</span>
              <span className="text-slate-300">Converts textual city/landmark inputs into exact GPS latitude & longitude coordinates.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">3. Interactive Maps API:</span>
              <span className="text-slate-300">Displays custom colored pin markers for Hotels, Restaurants, and Sights with connecting route lines.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Prompt Engineering */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          4. AI Prompt Engineering & Reliable Outputs
        </h3>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
          <p className="text-slate-300">
            To guarantee 100% parseable, valid JSON without hallunicated schema breaks, we enforce OpenAI&apos;s <code className="bg-slate-900 px-1 py-0.5 rounded text-purple-300">response_format: &#123; type: &quot;json_object&quot; &#125;</code> and supply a strict JSON schema in the system prompt instructions.
          </p>
          <div className="bg-slate-900 p-3 rounded-lg text-slate-400 font-mono text-[11px] overflow-x-auto">
            SYSTEM: &quot;You are a Senior AI Travel Concierge. Respond strictly with JSON adhering to: &#123; title, summary, itinerary, hotels, restaurants, costBreakdown &#125;&quot;
          </div>
        </div>
      </div>

      {/* 5. Database Schema */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          5. Database Collections / Relational Schema
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-indigo-300 mb-1">users Collection</h4>
            <p className="text-slate-400 text-[11px]">Stores user identity, hashed passwords, avatars, and timestamps.</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-cyan-300 mb-1">trips Collection</h4>
            <p className="text-slate-400 text-[11px]">Stores full itinerary JSON payloads, destination, coordinates, cost breakdowns, and favorites status.</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-emerald-300 mb-1">userpreferences Collection</h4>
            <p className="text-slate-400 text-[11px]">Stores default currency, favorite travel vibes, and pace preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
