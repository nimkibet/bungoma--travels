"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { SiteContentManager } from "./components/SiteContentManager";

// ── Stat Card ──
function StatCard({ icon, label, value, color = "terracotta" }) {
  const colorMap = {
    terracotta: "bg-terracotta-50 border-terracotta-200 text-terracotta-700",
    safari: "bg-safari-50 border-safari-200 text-safari-700",
    savanna: "bg-savanna-50 border-savanna-200 text-savanna-700",
    obsidian: "bg-obsidian-100 border-obsidian-200 text-obsidian-700",
  };
  return (
    <div className={`${colorMap[color]} border rounded-2xl p-5 flex items-center gap-4`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-sm font-semibold opacity-70">{label}</p>
        <p className="text-2xl font-bold font-display">{value}</p>
      </div>
    </div>
  );
}

// ── Add Attraction Form ──
function AddAttractionForm({ onSuccess, initialData }) {
  const [form, setForm] = useState(initialData || {
    title: "", location: { county: "", region: "" }, description: "", shortDescription: "",
    category: "Nature",
    entryFee: { citizen: 0, resident: 0, foreigner: 0 },
    seo: { metaTitle: "", metaDescription: "" },
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const fileInputRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      const res = await fetch("/api/attractions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setMsg({ type: "error", text: data.error });
        setLoading(false);
        return;
      }

      // If an image was selected, upload it immediately
      if (selectedImage) {
        setMsg({ type: "success", text: `✅ Created! Uploading image...` });
        try {
          await fetch(`/api/attractions/${data.attraction.slug}/images`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: selectedImage }),
          });
        } catch (err) {
          console.error("Image upload failed:", err);
          // Don't fail the whole creation if image fails
        }
      }

      setMsg({ type: "success", text: `✅ "${data.attraction.title}" successfully created!` });
      // Reset image
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      onSuccess?.(data.attraction);
    } catch { 
      setMsg({ type: "error", text: "Network error" }); 
    }
    finally { setLoading(false); }
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  }

  const inp = "w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm bg-white";
  const lbl = "block text-xs font-bold text-obsidian-600 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="add-attraction-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={lbl}>Title *</label>
          <input id="attr-title" required className={inp} placeholder="Mount Elgon National Park" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>Category</label>
          <select id="attr-category" className={inp} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {["Nature","Wildlife","Cultural","Adventure","Beach","Historical","Religious"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>County *</label>
          <input id="attr-county" required className={inp} placeholder="Bungoma" value={form.location.county} onChange={e => setForm(f => ({ ...f, location: { ...f.location, county: e.target.value } }))} />
        </div>
        <div>
          <label className={lbl}>Region</label>
          <input id="attr-region" className={inp} placeholder="Western Kenya" value={form.location.region} onChange={e => setForm(f => ({ ...f, location: { ...f.location, region: e.target.value } }))} />
        </div>
      </div>

      <div>
        <label className={lbl}>Short Description (max 300 chars)</label>
        <input id="attr-short-desc" className={inp} maxLength={300} placeholder="A brief one-liner for cards" value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} />
      </div>

      <div>
        <label className={lbl}>Full Description *</label>
        <textarea id="attr-description" required rows={5} className={`${inp} resize-none`} placeholder="Detailed description of the attraction..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>

      {/* Entry fees */}
      <div>
        <label className={lbl}>Entry Fees (KES)</label>
        <div className="grid grid-cols-3 gap-3">
          {[["citizen","🇰🇪 Citizen"],["resident","🌍 Resident"],["foreigner","✈️ Foreigner"]].map(([k,l]) => (
            <div key={k}>
              <label className="text-xs text-muted-foreground mb-1 block">{l}</label>
              <input id={`attr-fee-${k}`} type="number" min={0} className={inp} placeholder="0" value={form.entryFee[k]} onChange={e => setForm(f => ({ ...f, entryFee: { ...f.entryFee, [k]: Number(e.target.value) } }))} />
            </div>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-sand-50 rounded-2xl border border-sand-200 p-5 space-y-4">
        <h4 className="font-display font-bold text-obsidian-700">SEO Metadata</h4>
        <div>
          <label className={lbl}>Meta Title (max 70 chars)</label>
          <input id="attr-meta-title" className={inp} maxLength={70} placeholder="SEO title for search engines" value={form.seo.metaTitle} onChange={e => setForm(f => ({ ...f, seo: { ...f.seo, metaTitle: e.target.value } }))} />
          <p className="text-xs text-muted-foreground mt-1">{form.seo.metaTitle.length}/70</p>
        </div>
        <div>
          <label className={lbl}>Meta Description (max 160 chars)</label>
          <textarea id="attr-meta-desc" rows={3} className={`${inp} resize-none`} maxLength={160} placeholder="SEO description for search engines..." value={form.seo.metaDescription} onChange={e => setForm(f => ({ ...f, seo: { ...f.seo, metaDescription: e.target.value } }))} />
          <p className="text-xs text-muted-foreground mt-1">{form.seo.metaDescription.length}/160</p>
        </div>
      </div>

      {/* Instant Image Upload */}
      <div className="bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] p-5 space-y-4">
        <h4 className="font-display font-bold text-[#0C4A6E]">Primary Image (Optional)</h4>
        <div className="flex items-center gap-4">
          {selectedImage ? (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#0EA5E9]">
              <Image src={selectedImage} alt="Preview" fill className="object-cover" />
              <button 
                type="button" 
                onClick={() => { setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
              >✕</button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-lg border-2 border-dashed border-[#0EA5E9]/50 flex flex-col items-center justify-center cursor-pointer hover:bg-[#0EA5E9]/5 transition-colors"
            >
              <span className="text-2xl mb-1">📸</span>
              <span className="text-[10px] text-[#0EA5E9] font-semibold uppercase">Add Image</span>
            </div>
          )}
          <div className="flex-1">
            <p className="text-xs text-[#0C4A6E]/70 mb-2">Select an image to be automatically uploaded and attached to this attraction the moment it is created.</p>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0EA5E9]/10 file:text-[#0EA5E9] hover:file:bg-[#0EA5E9]/20 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input id="attr-featured" type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-terracotta-600 rounded cursor-pointer" />
        <label htmlFor="attr-featured" className="text-sm font-medium text-obsidian-700 cursor-pointer">Mark as Featured</label>
      </div>

      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${msg.type === "success" ? "bg-safari-50 border border-safari-300 text-safari-800" : "bg-red-50 border border-red-300 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      <button type="submit" id="add-attraction-submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold shadow-lg shadow-[#EA580C]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Processing..." : initialData ? "Duplicate Attraction" : "Create Attraction"}
      </button>
    </form>
  );
}

// ── Media Manager ──
function MediaManager({ attraction, onUpdate }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [msg, setMsg] = useState(null);

  async function uploadFile(file) {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setUploading(true); setMsg(null);
      try {
        const res = await fetch(`/api/attractions/${attraction.slug}/images`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: ev.target.result }),
        });
        const data = await res.json();
        if (data.success) { setMsg({ type: "success", text: "Image uploaded!" }); onUpdate?.(); }
        else setMsg({ type: "error", text: data.error });
      } catch { setMsg({ type: "error", text: "Upload failed" }); }
      finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  }

  function onDrop(e) {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) uploadFile(file);
  }

  async function removeImage(url) {
    setRemoving(url); setMsg(null);
    try {
      const res = await fetch(`/api/attractions/${attraction.slug}/images`, {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      const data = await res.json();
      if (data.success) { setMsg({ type: "success", text: "Image removed from Cloudinary & MongoDB" }); onUpdate?.(); }
      else setMsg({ type: "error", text: data.error });
    } catch { setMsg({ type: "error", text: "Remove failed" }); }
    finally { setRemoving(null); }
  }

  return (
    <div className="space-y-5">
      {/* Drag & drop upload zone */}
      <div
        id="media-drop-zone"
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragging ? "border-terracotta-500 bg-terracotta-50" : "border-sand-300 bg-sand-50 hover:border-terracotta-400 hover:bg-terracotta-50/50"
        }`}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" id="media-file-input"
          onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }} />
        {uploading ? (
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto border-4 border-terracotta-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-terracotta-600 font-semibold">Uploading to Cloudinary...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="w-12 h-12 mx-auto text-sand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="font-semibold text-obsidian-700">Drag & drop an image here</p>
            <p className="text-sm text-muted-foreground">or click to browse — instantly uploads to Cloudinary</p>
          </div>
        )}
      </div>

      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${msg.type === "success" ? "bg-safari-50 border border-safari-300 text-safari-800" : "bg-red-50 border border-red-300 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      {/* Existing images */}
      {attraction.images?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {attraction.images.map((url, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-sand-100">
              <Image src={url} alt={`Image ${i + 1}`} fill sizes="200px" className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                <button
                  id={`remove-img-${i}`}
                  onClick={() => removeImage(url)}
                  disabled={removing === url}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-red-700 disabled:opacity-50"
                >
                  {removing === url ? "Removing..." : "🗑 Remove"}
                </button>
              </div>
              <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm text-center py-4">No images yet. Upload one above.</p>
      )}
    </div>
  );
}

// ── Main Admin Dashboard ──
export default function AdminDashboardPage() {
  const [attractions, setAttractions] = useState([]);
  const [stats, setStats] = useState({ total: 0, featured: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [editSeo, setEditSeo] = useState(null);
  const [seoSaving, setSeoSaving] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);

  const fetchAttractions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/attractions?limit=100");
      const data = await res.json();
      if (data.success) {
        setAttractions(data.attractions);
        setStats({
          total: data.pagination?.total || data.attractions.length,
          featured: data.attractions.filter(a => a.featured).length,
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAttractions(); }, [fetchAttractions]);

  async function saveSeo(slug) {
    setSeoSaving(true);
    try {
      await fetch(`/api/attractions/${slug}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seo: editSeo }),
      });
      setEditSeo(null);
      fetchAttractions();
    } finally { setSeoSaving(false); }
  }

  async function toggleFeatured(slug, current) {
    await fetch(`/api/attractions/${slug}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !current }),
    });
    fetchAttractions();
  }

  async function deactivate(slug) {
    if (!confirm("Deactivate this attraction?")) return;
    await fetch(`/api/attractions/${slug}`, { method: "DELETE" });
    fetchAttractions();
  }

  function handleDuplicate(attraction) {
    setDuplicateData({
      title: `${attraction.title} (Copy)`,
      location: attraction.location || { county: "", region: "" },
      description: attraction.description || "",
      shortDescription: attraction.shortDescription || "",
      category: attraction.category || "Nature",
      entryFee: attraction.entryFee || { citizen: 0, resident: 0, foreigner: 0 },
      seo: attraction.seo || { metaTitle: "", metaDescription: "" },
      featured: false,
    });
    setActiveTab("add-attraction");
  }

  const tabs = ["overview", "add-attraction", "media-manager", "seo-manager"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Tab nav */}
      <div className="bg-white p-1.5 rounded-xl inline-flex flex-wrap gap-2 shadow-sm border border-[#BAE6FD]/50">
        {[
          { id: "overview", label: "📊 Overview" },
          { id: "site-content", label: "📝 Site Content" },
          { id: "add-attraction", label: "➕ Add Attraction" },
          { id: "media-manager", label: "🖼 Media Manager" },
          { id: "seo-manager", label: "🔍 SEO Manager" },
        ].map(tab => (
          <button
            key={tab.id}
            id={`admin-tab-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === "add-attraction" && activeTab !== "add-attraction") {
                setDuplicateData(null);
              }
            }}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === tab.id 
                ? "bg-[#0EA5E9] text-white shadow-md shadow-[#0EA5E9]/20" 
                : "text-[#0C4A6E]/60 hover:text-[#0C4A6E] hover:bg-[#F0F9FF]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="🗺️" label="Total Attractions" value={stats.total} color="terracotta" />
              <StatCard icon="⭐" label="Featured" value={stats.featured} color="savanna" />
              <StatCard icon="📸" label="Images Seeded" value="11" color="safari" />
              <StatCard icon="☁️" label="Cloudinary Folder" value="bungoma_tours" color="obsidian" />
            </div>

            {/* Attractions table */}
            <div className="bg-white rounded-2xl shadow-card-terracotta overflow-hidden">
              <div className="px-6 py-4 border-b border-sand-200 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-obsidian-800">All Attractions</h2>
                <button onClick={fetchAttractions} className="text-sm text-terracotta-600 hover:text-terracotta-700 font-semibold cursor-pointer">↻ Refresh</button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading attractions...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-sand-50 border-b border-sand-200">
                      <tr>
                        {["Title","Category","Location","Featured","Fees (KES)","Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-obsidian-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100">
                      {attractions.map(a => (
                        <tr key={a._id} className="hover:bg-sand-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-obsidian-800 max-w-[180px] truncate">{a.title}</div>
                            <div className="text-xs text-muted-foreground">/{a.slug}</div>
                          </td>
                          <td className="px-4 py-3"><span className="bg-sand-100 text-obsidian-600 text-xs px-2 py-1 rounded-full">{a.category}</span></td>
                          <td className="px-4 py-3 text-obsidian-600">{a.location?.county}</td>
                          <td className="px-4 py-3">
                            <button id={`toggle-featured-${a.slug}`} onClick={() => toggleFeatured(a.slug, a.featured)} className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${a.featured ? "bg-savanna-500" : "bg-sand-300"} relative`}>
                              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${a.featured ? "translate-x-4" : "translate-x-0.5"}`} />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs space-y-0.5">
                              {a.entryFee?.citizen > 0 && <div>🇰🇪 {a.entryFee.citizen.toLocaleString()}</div>}
                              {a.entryFee?.resident > 0 && <div>🌍 {a.entryFee.resident.toLocaleString()}</div>}
                              {a.entryFee?.foreigner > 0 && <div>✈️ {a.entryFee.foreigner.toLocaleString()}</div>}
                              {!a.entryFee?.citizen && !a.entryFee?.resident && !a.entryFee?.foreigner && <div className="text-safari-600">Free</div>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button id={`duplicate-${a.slug}`} onClick={() => handleDuplicate(a)} className="text-xs bg-savanna-50 text-savanna-700 border border-savanna-200 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-savanna-100 transition-colors font-semibold">📋 Duplicate</button>
                              <button id={`manage-media-${a.slug}`} onClick={() => { setSelectedAttraction(a); setActiveTab("media-manager"); }} className="text-xs bg-terracotta-50 text-terracotta-700 border border-terracotta-200 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-terracotta-100 transition-colors font-semibold">📸 Media</button>
                              <button id={`edit-seo-${a.slug}`} onClick={() => { setEditSeo(a.seo || {}); setSelectedAttraction(a); setActiveTab("seo-manager"); }} className="text-xs bg-safari-50 text-safari-700 border border-safari-200 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-safari-100 transition-colors font-semibold">🔍 SEO</button>
                              <button id={`deactivate-${a.slug}`} onClick={() => deactivate(a.slug)} className="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-red-100 transition-colors font-semibold">🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {attractions.length === 0 && (
                    <div className="text-center py-12 text-[#94A3B8]">
                      <div className="text-4xl mb-2">🌍</div>
                      <p>No attractions yet. Add your first one!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ADD ATTRACTION ── */}
        {activeTab === "add-attraction" && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-2xl shadow-card-terracotta p-8">
              <h2 className="font-display text-2xl font-bold text-[#0C4A6E] mb-6 border-b border-[#BAE6FD] pb-4">
                {duplicateData ? "Duplicate Attraction" : "Add New Attraction"}
              </h2>
              <AddAttractionForm onSuccess={(newAttraction) => { 
                setDuplicateData(null); 
                fetchAttractions(); 
                if (newAttraction) {
                  // We already uploaded the primary image in the form!
                  // But we still select it so they can add more in the media manager
                  setSelectedAttraction(newAttraction);
                  setActiveTab("overview");
                }
              }} initialData={duplicateData} />
            </div>
          </div>
        )}

        {/* ── MEDIA MANAGER ── */}
        {activeTab === "media-manager" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-card-terracotta p-6">
              <h2 className="font-display text-2xl font-bold text-obsidian-800 mb-4">Media Manager</h2>

              {/* Attraction selector */}
              <div className="mb-6">
                <label htmlFor="media-attraction-select" className="block text-xs font-bold text-obsidian-600 uppercase tracking-wider mb-2">Select Attraction</label>
                <select
                  id="media-attraction-select"
                  className="w-full max-w-md px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm"
                  value={selectedAttraction?.slug || ""}
                  onChange={e => setSelectedAttraction(attractions.find(a => a.slug === e.target.value) || null)}
                >
                  <option value="">— Choose an attraction —</option>
                  {attractions.map(a => <option key={a.slug} value={a.slug}>{a.title}</option>)}
                </select>
              </div>

              {selectedAttraction ? (
                <div>
                  <h3 className="font-display text-lg font-bold text-obsidian-700 mb-4">
                    {selectedAttraction.title} — {selectedAttraction.images?.length || 0} image{selectedAttraction.images?.length !== 1 ? "s" : ""}
                  </h3>
                  <MediaManager
                    attraction={selectedAttraction}
                    onUpdate={() => {
                      fetchAttractions();
                      // Re-fetch to get updated images
                      setTimeout(() => {
                        fetch(`/api/attractions/${selectedAttraction.slug}`)
                          .then(r => r.json())
                          .then(d => { if (d.success) setSelectedAttraction(d.attraction); });
                      }, 500);
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="text-5xl mb-4">🖼</div>
                  <p className="font-medium text-obsidian-600">Select an attraction to manage its images</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SEO MANAGER ── */}
        {activeTab === "seo-manager" && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white rounded-2xl shadow-card-terracotta p-8">
              <h2 className="font-display text-2xl font-bold text-obsidian-800 mb-4">SEO Manager</h2>

              {/* Attraction selector */}
              <div className="mb-6">
                <label htmlFor="seo-attraction-select" className="block text-xs font-bold text-obsidian-600 uppercase tracking-wider mb-2">Select Attraction</label>
                <select
                  id="seo-attraction-select"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm"
                  value={selectedAttraction?.slug || ""}
                  onChange={e => {
                    const a = attractions.find(x => x.slug === e.target.value) || null;
                    setSelectedAttraction(a);
                    setEditSeo(a?.seo ? { ...a.seo } : { metaTitle: "", metaDescription: "", keywords: [] });
                  }}
                >
                  <option value="">— Choose an attraction —</option>
                  {attractions.map(a => <option key={a.slug} value={a.slug}>{a.title}</option>)}
                </select>
              </div>

              {selectedAttraction && editSeo && (
                <div className="space-y-5">
                  <div>
                    <label htmlFor="seo-meta-title" className="block text-xs font-bold text-obsidian-600 uppercase tracking-wider mb-1.5">
                      Meta Title <span className="text-muted-foreground font-normal">({(editSeo.metaTitle || "").length}/70)</span>
                    </label>
                    <input
                      id="seo-meta-title"
                      maxLength={70}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm"
                      placeholder={`${selectedAttraction.title} | Bungoma Tours`}
                      value={editSeo.metaTitle || ""}
                      onChange={e => setEditSeo(s => ({ ...s, metaTitle: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="seo-meta-desc" className="block text-xs font-bold text-obsidian-600 uppercase tracking-wider mb-1.5">
                      Meta Description <span className="text-muted-foreground font-normal">({(editSeo.metaDescription || "").length}/160)</span>
                    </label>
                    <textarea
                      id="seo-meta-desc"
                      rows={4}
                      maxLength={160}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm resize-none"
                      placeholder="Compelling meta description for search engines..."
                      value={editSeo.metaDescription || ""}
                      onChange={e => setEditSeo(s => ({ ...s, metaDescription: e.target.value }))}
                    />
                  </div>

                  {/* Preview */}
                  <div className="bg-sand-50 rounded-xl p-4 border border-sand-200">
                    <p className="text-xs font-bold text-obsidian-500 uppercase tracking-wider mb-3">Google Preview</p>
                    <p className="text-blue-700 text-lg font-medium leading-tight hover:underline cursor-pointer">
                      {editSeo.metaTitle || `${selectedAttraction.title} | Bungoma Tours`}
                    </p>
                    <p className="text-green-700 text-sm mt-0.5">bungomaattractions.co.ke/attractions/{selectedAttraction.slug}</p>
                    <p className="text-obsidian-600 text-sm mt-1 leading-relaxed">
                      {editSeo.metaDescription || selectedAttraction.shortDescription || "No description set."}
                    </p>
                  </div>

                  <button
                    id="save-seo-btn"
                    onClick={() => saveSeo(selectedAttraction.slug)}
                    disabled={seoSaving}
                    className="btn-terracotta w-full py-3 disabled:opacity-50"
                  >
                    {seoSaving ? "Saving..." : "💾 Save SEO Metadata"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SITE CONTENT MANAGER ── */}
        {activeTab === "site-content" && (
          <SiteContentManager />
        )}
      </div>
  );
}
