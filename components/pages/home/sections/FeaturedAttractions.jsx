"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

function PriceBadges({ entryFee }) {
  if (!entryFee) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {entryFee.citizen > 0 && (
        <span className="price-badge-citizen">
          🇰🇪 KES {entryFee.citizen?.toLocaleString()}
        </span>
      )}
      {entryFee.resident > 0 && (
        <span className="price-badge-resident">
          🌍 KES {entryFee.resident?.toLocaleString()}
        </span>
      )}
      {entryFee.foreigner > 0 && (
        <span className="price-badge-foreigner">
          ✈️ KES {entryFee.foreigner?.toLocaleString()}
        </span>
      )}
    </div>
  );
}

function AttractionCard({ attraction }) {
  const img =
    attraction.images?.[0] ||
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=75";

  return (
    <Link
      href={`/attractions/${attraction.slug}`}
      className="attraction-card group flex flex-col"
      id={`attraction-card-${attraction.slug}`}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden rounded-t-2xl">
        <Image
          src={img}
          alt={attraction.title}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {attraction.category || "Nature"}
        </div>
        {attraction.featured && (
          <div className="absolute top-3 right-3 bg-savanna-500 text-obsidian-900 text-xs font-bold px-2.5 py-1 rounded-full">
            ★ Featured
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 p-5 bg-white rounded-b-2xl">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-bold text-obsidian-800 leading-tight group-hover:text-terracotta-600 transition-colors">
            {attraction.title}
          </h3>
          {attraction.rating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <svg className="w-4 h-4 text-savanna-500 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-obsidian-700">
                {attraction.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          📍 {attraction.location?.county || "Western Kenya"}
          {attraction.location?.region ? `, ${attraction.location.region}` : ""}
        </p>

        {attraction.shortDescription && (
          <p className="text-obsidian-600 text-sm line-clamp-2 mb-3 flex-1">
            {attraction.shortDescription}
          </p>
        )}

        <PriceBadges entryFee={attraction.entryFee} />

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-sand-200 flex items-center justify-between">
          <span className="text-terracotta-600 text-sm font-semibold group-hover:text-terracotta-700 transition-colors">
            View Details →
          </span>
          <div className="flex gap-1">
            {attraction.images?.slice(0, 3).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-sand-300" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-card-terracotta">
      <div className="skeleton h-56" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    </div>
  );
}

export function FeaturedAttractions({ cmsData }) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const featuredData = cmsData?.featured || {};

  useEffect(() => {
    fetch("/api/attractions?featured=true&limit=6")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAttractions(data.attractions);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-terracotta-600 font-semibold uppercase tracking-widest text-sm mb-3">
            {featuredData.subtitle || "✦ Hand-Picked Experiences"}
          </p>
          <h2 className="section-title">
            <span className="section-title-underline">{featuredData.title || "Featured Attractions"}</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl">
            {featuredData.description || "Our experts have curated the most breathtaking and culturally rich destinations across Western Kenya for your journey."}
          </p>
        </div>
        <Link
          href="/attractions"
          id="view-all-attractions-link"
          className="shrink-0 btn-terracotta"
        >
          {featuredData.cta || "View All Attractions"}
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : attractions.length > 0
          ? attractions.map((a) => <AttractionCard key={a._id} attraction={a} />)
          : (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-obsidian-600 text-lg font-medium mb-2">
                No featured attractions yet
              </p>
              <p className="text-muted-foreground text-sm">
                Check back soon or{" "}
                <Link href="/attractions" className="text-terracotta-600 hover:underline">
                  browse all attractions
                </Link>
              </p>
            </div>
          )}
      </div>
    </section>
  );
}
