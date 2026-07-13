"use client";
import { useState, useEffect } from "react";

export function SiteContentManager() {
  const [page, setPage] = useState("home");
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [page]);

  async function fetchContent() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/content?page=${page}`);
      const data = await res.json();
      if (data.success) {
        setContent(data.content || {});
      } else {
        setMsg({ type: "error", text: data.error });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Failed to load content" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, content })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "✅ Content saved successfully!" });
      } else {
        setMsg({ type: "error", text: data.error });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Failed to save content" });
    } finally {
      setSaving(false);
    }
  }

  function handleNestedChange(section, field, value) {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  }

  const inp = "w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm bg-white";
  const lbl = "block text-xs font-bold text-obsidian-600 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-card-terracotta p-8">
        <div className="flex justify-between items-center mb-6 border-b border-sand-200 pb-4">
          <h2 className="font-display text-2xl font-bold text-obsidian-800">Dynamic Page Editor</h2>
          <select 
            value={page} 
            onChange={(e) => setPage(e.target.value)}
            className="px-4 py-2 rounded-xl border border-sand-200 text-sm font-semibold"
          >
            <option value="home">Homepage</option>
            {/* Can add more pages later */}
          </select>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${msg.type === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
            {msg.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading content...</div>
        ) : (
          <div className="space-y-10">
            {page === "home" && (
              <>
                {/* HERO SECTION */}
                <section className="bg-sand-50 p-6 rounded-2xl border border-sand-200">
                  <h3 className="font-display text-xl font-bold text-obsidian-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🌅</span> Hero Section
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Title Line 1</label>
                        <input className={inp} placeholder="Discover" value={content.hero?.titleLine1 || ""} onChange={e => handleNestedChange("hero", "titleLine1", e.target.value)} />
                      </div>
                      <div>
                        <label className={lbl}>Title Line 2 (Italic)</label>
                        <input className={inp} placeholder="Western Kenya" value={content.hero?.titleLine2 || ""} onChange={e => handleNestedChange("hero", "titleLine2", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Subtitle / Description</label>
                      <textarea rows={3} className={inp} placeholder="From the volcanic peaks..." value={content.hero?.subtitle || ""} onChange={e => handleNestedChange("hero", "subtitle", e.target.value)} />
                    </div>
                  </div>
                </section>

                {/* ATTRACTION HIGHLIGHTS */}
                <section className="bg-sand-50 p-6 rounded-2xl border border-sand-200">
                  <h3 className="font-display text-xl font-bold text-obsidian-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🏔️</span> Attraction Highlights
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={lbl}>Section Title</label>
                      <input className={inp} placeholder="Kenya's Natural Wonders" value={content.highlights?.title || ""} onChange={e => handleNestedChange("highlights", "title", e.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Section Subtitle (Eyebrow)</label>
                      <input className={inp} placeholder="✦ Iconic Destinations" value={content.highlights?.subtitle || ""} onChange={e => handleNestedChange("highlights", "subtitle", e.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Description</label>
                      <textarea rows={2} className={inp} placeholder="From volcanic peaks to ancient forests..." value={content.highlights?.description || ""} onChange={e => handleNestedChange("highlights", "description", e.target.value)} />
                    </div>
                  </div>
                </section>

                {/* FEATURED ATTRACTIONS */}
                <section className="bg-sand-50 p-6 rounded-2xl border border-sand-200">
                  <h3 className="font-display text-xl font-bold text-obsidian-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⭐</span> Featured Attractions
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={lbl}>Section Title</label>
                      <input className={inp} placeholder="Featured Attractions" value={content.featured?.title || ""} onChange={e => handleNestedChange("featured", "title", e.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Section Subtitle (Eyebrow)</label>
                      <input className={inp} placeholder="✦ Hand-Picked Experiences" value={content.featured?.subtitle || ""} onChange={e => handleNestedChange("featured", "subtitle", e.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Description</label>
                      <textarea rows={2} className={inp} placeholder="Our experts have curated..." value={content.featured?.description || ""} onChange={e => handleNestedChange("featured", "description", e.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Button Text</label>
                      <input className={inp} placeholder="View All Attractions" value={content.featured?.cta || ""} onChange={e => handleNestedChange("featured", "cta", e.target.value)} />
                    </div>
                  </div>
                </section>

                {/* WHY CHOOSE US */}
                <section className="bg-sand-50 p-6 rounded-2xl border border-sand-200">
                  <h3 className="font-display text-xl font-bold text-obsidian-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">✨</span> Why Choose Us
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Title Line 1</label>
                        <input className={inp} placeholder="The Bungoma Tours " value={content.whyUs?.titleLine1 || ""} onChange={e => handleNestedChange("whyUs", "titleLine1", e.target.value)} />
                      </div>
                      <div>
                        <label className={lbl}>Title Line 2 (Highlighted)</label>
                        <input className={inp} placeholder="Difference" value={content.whyUs?.titleLine2 || ""} onChange={e => handleNestedChange("whyUs", "titleLine2", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Description</label>
                      <textarea rows={2} className={inp} placeholder="We go beyond ordinary tourism..." value={content.whyUs?.description || ""} onChange={e => handleNestedChange("whyUs", "description", e.target.value)} />
                    </div>
                  </div>
                </section>
              </>
            )}

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="btn-terracotta py-3 px-8 text-lg font-bold shadow-lg shadow-terracotta-500/30 hover:shadow-terracotta-500/50"
              >
                {saving ? "Saving Changes..." : "💾 Save Published Site"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
