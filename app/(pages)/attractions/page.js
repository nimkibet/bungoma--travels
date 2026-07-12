"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = ["All", "Nature", "Wildlife", "Cultural", "Adventure", "Beach", "Historical", "Religious"];

function AttractionCard({ attraction }) {
  const img = attraction.images?.[0] ||
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=75";
  return (
    <Link href={`/attractions/${attraction.slug}`} className="attraction-card group flex flex-col" id={`attraction-${attraction.slug}`}>
      <div className="relative h-52 overflow-hidden rounded-t-2xl">
        <Image src={img} alt={attraction.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">{attraction.category}</div>
        {attraction.featured && <div className="absolute top-3 right-3 bg-savanna-500 text-obsidian-900 text-xs font-bold px-2.5 py-1 rounded-full">★ Featured</div>}
      </div>
      <div className="relative z-10 flex flex-col flex-1 p-5 bg-white rounded-b-2xl">
        <h3 className="font-display text-lg font-bold text-obsidian-800 mb-1 group-hover:text-terracotta-600 transition-colors line-clamp-1">{attraction.title}</h3>
        <p className="text-muted-foreground text-sm mb-2">📍 {attraction.location?.county || "Western Kenya"}</p>
        <p className="text-obsidian-600 text-sm line-clamp-2 flex-1 mb-3">{attraction.shortDescription || attraction.description?.slice(0, 120)}</p>
        <div className="flex flex-wrap gap-1.5">
          {attraction.entryFee?.citizen > 0 && <span className="price-badge-citizen">🇰🇪 KES {attraction.entryFee.citizen.toLocaleString()}</span>}
          {attraction.entryFee?.resident > 0 && <span className="price-badge-resident">🌍 KES {attraction.entryFee.resident.toLocaleString()}</span>}
          {attraction.entryFee?.foreigner > 0 && <span className="price-badge-foreigner">✈️ KES {attraction.entryFee.foreigner.toLocaleString()}</span>}
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-card-terracotta">
      <div className="skeleton h-52" />
      <div className="p-5 space-y-3"><div className="skeleton h-5 w-3/4" /><div className="skeleton h-4 w-1/2" /><div className="skeleton h-4 w-full" /><div className="skeleton h-8 w-1/3" /></div>
    </div>
  );
}

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");

  const fetchAttractions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (category !== "All") params.set("category", category);
      const res = await fetch(`/api/attractions?${params}`);
      const data = await res.json();
      if (data.success) {
        setAttractions(data.attractions);
        setPagination(data.pagination);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [category, page]);

  useEffect(() => { fetchAttractions(); }, [fetchAttractions]);

  const filtered = search.trim()
    ? attractions.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.location?.county?.toLowerCase().includes(search.toLowerCase()))
    : attractions;

  return (
    <>
      {/* Hero header */}
      <div className="relative h-64 bg-savanna-gradient flex items-end pb-8">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,#dc440f,#dc440f 2px,transparent 2px,transparent 20px)" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8">
          <p className="text-savanna-300 font-semibold uppercase tracking-widest text-sm mb-2">✦ Explore</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">All Attractions</h1>
          <p className="text-white/70 mt-2">{pagination?.total || 0} destinations across Western Kenya</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "repeating-linear-gradient(90deg,#dc440f 0,#dc440f 8px,#f59009 8px,#f59009 16px,#22c55e 16px,#22c55e 24px,#1a1a1a 24px,#1a1a1a 32px)" }} />
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              id="attractions-search"
              type="text"
              placeholder="Search attractions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase()}`}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  category === cat
                    ? "bg-terracotta-600 text-white shadow-card-terracotta"
                    : "bg-sand-100 text-obsidian-600 hover:bg-sand-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length > 0
            ? filtered.map(a => <AttractionCard key={a._id} attraction={a} />)
            : (
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">🌍</div>
                <p className="font-display text-2xl text-obsidian-700 mb-2">No attractions found</p>
                <p className="text-muted-foreground">Try a different category or search term</p>
              </div>
            )
          }
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                id={`page-btn-${p}`}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                  p === page ? "bg-terracotta-600 text-white" : "bg-sand-100 text-obsidian-600 hover:bg-sand-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
