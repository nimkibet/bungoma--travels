"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=85",
    alt: "Maasai Mara Wildlife Reserve",
    location: "Maasai Mara",
  },
  {
    src: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1600&q=85",
    alt: "Mount Elgon National Park",
    location: "Mount Elgon, Bungoma",
  },
  {
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85",
    alt: "Kakamega Rainforest",
    location: "Kakamega Forest",
  },
];

export function BungomaHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
        setIsTransitioning(false);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_IMAGES[currentSlide];

  return (
    <section className="relative h-[92vh] min-h-[640px] max-h-[900px] w-full overflow-hidden flex items-center justify-center">
      {/* Background image with crossfade */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Multi-layered overlay: deep obsidian at bottom, terracotta tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-obsidian-900/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-terracotta-900/40 via-transparent to-transparent" />

      {/* Animated beadwork border at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5 animate-beadwork-slide"
        style={{
          background:
            "repeating-linear-gradient(90deg, #dc440f 0,#dc440f 8px,#f59009 8px,#f59009 16px,#22c55e 16px,#22c55e 24px,#1a1a1a 24px,#1a1a1a 32px)",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* Location badge */}
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-savanna-400 animate-pulse" />
          <span className="text-white/90 text-sm font-medium tracking-wide">
            {slide.location}
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-4 animate-slide-up [animation-delay:100ms]">
          <span className="block">Discover</span>
          <span className="block text-gradient-terracotta italic">Western Kenya</span>
        </h1>

        <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed animate-slide-up [animation-delay:200ms]">
          From the volcanic peaks of Mount Elgon to the thundering Nabuyole Falls —
          authentic African adventures await you in Bungoma County.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up [animation-delay:300ms]">
          <Link href="/attractions" className="btn-terracotta text-lg px-10 py-4">
            Explore Attractions
          </Link>
          <Link href="/attractions?featured=true" className="btn-ghost-light text-lg px-10 py-4">
            Featured Tours
          </Link>
        </div>

        {/* Stats strip */}
        <div className="flex gap-8 mt-12 animate-slide-up [animation-delay:400ms]">
          {[
            { label: "Attractions", value: "40+" },
            { label: "Happy Visitors", value: "12K+" },
            { label: "Counties", value: "8" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-savanna-400 text-2xl font-bold font-display">{stat.value}</div>
              <div className="text-white/60 text-xs tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            id={`hero-slide-${i}`}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === currentSlide
                ? "w-8 h-2 bg-terracotta-500"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
