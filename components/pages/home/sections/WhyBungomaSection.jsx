const WHY_ITEMS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Local Expertise",
    desc: "Our guides are born and raised in Western Kenya — they know every hidden trail, waterfall, and cultural secret.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Safe & Vetted",
    desc: "All tour operators and guides are government-certified. We guarantee safe, insured experiences at every destination.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "KES Pricing",
    desc: "Transparent, fair pricing in Kenyan Shillings with different tiers for citizens, residents, and foreign visitors.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: "MPesa Booking",
    desc: "Book and pay instantly using MPesa Lipa Na M-PESA. No foreign cards required — simple mobile money payments.",
  },
];

export function WhyBungomaSection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-obsidian-900 relative overflow-hidden">
      {/* Decorative beadwork pattern background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #dc440f, #dc440f 2px, transparent 2px, transparent 20px), repeating-linear-gradient(-45deg, #f59009, #f59009 2px, transparent 2px, transparent 20px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-savanna-400 font-semibold uppercase tracking-widest text-sm mb-3">
            ✦ Why Choose Us
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            The Bungoma Tours{" "}
            <span className="text-gradient-terracotta">Difference</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            We go beyond ordinary tourism to give you genuine, deeply-rooted
            African experiences that stay with you forever.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="group glass-card p-7 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-terracotta-600/20 border border-terracotta-600/30 flex items-center justify-center text-terracotta-400 mb-5 group-hover:bg-terracotta-600/30 transition-colors">
                {item.icon}
              </div>

              <h3 className="font-display text-xl font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>

              {/* Bottom accent */}
              <div className="mt-5 w-12 h-0.5 bg-terracotta-600 group-hover:w-full transition-all duration-500 rounded-full" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="/attractions"
            id="why-section-cta"
            className="btn-terracotta inline-block text-lg px-12 py-4 animate-pulse-glow"
          >
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  );
}
