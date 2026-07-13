"use client";
import { useState } from "react";
import Image from "next/image";

export function PlannerUI() {
  const [form, setForm] = useState({
    days: 3,
    groupType: "Solo",
    budget: "Moderate",
    interests: "Nature, Hiking, Culture",
  });
  
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  async function generateItinerary(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setItinerary(data.itinerary);
      } else {
        setError(data.error || "Failed to generate itinerary.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inpClasses = "w-full px-4 py-3 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm bg-white text-obsidian-800 shadow-sm transition-all";
  const lblClasses = "block text-xs font-bold text-obsidian-500 uppercase tracking-wider mb-2";

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      {/* Form Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-sand-200/50 border border-sand-100">
        <form onSubmit={generateItinerary} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div>
            <label className={lblClasses}>Duration (Days)</label>
            <input type="number" min="1" max="14" className={inpClasses} value={form.days} onChange={e => setForm({...form, days: parseInt(e.target.value)})} />
          </div>
          <div>
            <label className={lblClasses}>Group Type</label>
            <select className={inpClasses} value={form.groupType} onChange={e => setForm({...form, groupType: e.target.value})}>
              <option>Solo</option>
              <option>Couple</option>
              <option>Family</option>
              <option>Friends / Group</option>
            </select>
          </div>
          <div>
            <label className={lblClasses}>Budget Level</label>
            <select className={inpClasses} value={form.budget} onChange={e => setForm({...form, budget: e.target.value})}>
              <option>Budget-friendly</option>
              <option>Moderate</option>
              <option>Luxury / Premium</option>
            </select>
          </div>
          <div>
            <label className={lblClasses}>Main Interests</label>
            <input type="text" className={inpClasses} placeholder="e.g. Wildlife, Hiking, Food" value={form.interests} onChange={e => setForm({...form, interests: e.target.value})} />
          </div>
          
          <div className="md:col-span-2 lg:col-span-4 mt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-terracotta py-4 text-lg shadow-lg shadow-terracotta-500/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  ✨ Generate My Itinerary
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </div>
        </form>
        {error && <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}
      </div>

      {/* Loading State */}
      {loading && !itinerary && (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-20 h-20 relative mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-sand-200 border-t-terracotta-500 animate-spin" />
            <div className="absolute inset-4 rounded-full border-4 border-sand-200 border-b-savanna-500 animate-spin-reverse" />
          </div>
          <h3 className="font-display text-2xl font-bold text-obsidian-800 mb-2">Analyzing destinations...</h3>
          <p className="text-obsidian-500">Our AI is reading through local insights to craft your perfect trip.</p>
        </div>
      )}

      {/* Itinerary Result */}
      {itinerary && !loading && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center bg-obsidian-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80')] bg-cover bg-center" />
            <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-4">
                {form.days} Days • {form.groupType} • {form.budget}
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{itinerary.title}</h2>
              <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">{itinerary.summary}</p>
              
              {itinerary.estimatedTotalCostKES && (
                <div className="mt-8 inline-flex flex-col items-center p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                  <span className="text-xs uppercase tracking-widest text-white/50 mb-1">Estimated Cost</span>
                  <span className="font-display text-3xl text-savanna-400 font-bold">KES {itinerary.estimatedTotalCostKES.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6">
            {itinerary.days?.map((day, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 md:p-8 shadow-lg shadow-sand-200/30 border border-sand-100 flex flex-col md:flex-row gap-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-sand-200 group-hover:bg-terracotta-500 transition-colors duration-500" />
                
                <div className="md:w-1/4 shrink-0">
                  <div className="text-terracotta-600 font-black text-6xl font-display opacity-20 absolute -top-4 -left-2">
                    {day.dayNumber}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xs font-bold text-obsidian-400 uppercase tracking-widest mb-1">Day {day.dayNumber}</h3>
                    <h4 className="font-display text-xl font-bold text-obsidian-800 leading-tight">{day.theme}</h4>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  {day.activities?.map((act, j) => (
                    <div key={j} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-savanna-500 before:rounded-full">
                      <div className="text-sm font-bold text-terracotta-600 mb-1">{act.time}</div>
                      <h5 className="text-lg font-bold text-obsidian-800 mb-2">{act.title}</h5>
                      <p className="text-obsidian-600 text-sm leading-relaxed">{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8">
            <button className="btn-terracotta px-10 py-4 text-lg shadow-xl shadow-terracotta-500/20">
              Save This Itinerary
            </button>
            <p className="text-muted-foreground text-sm mt-4">You can access your saved itineraries from your dashboard.</p>
          </div>
        </div>
      )}
    </div>
  );
}
