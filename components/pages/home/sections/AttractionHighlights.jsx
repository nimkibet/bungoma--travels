import Image from "next/image";

const HIGHLIGHTS = [
  {
    icon: "🏔️",
    title: "Mount Elgon",
    desc: "Africa's oldest volcano with the world's largest caldera. Hike through afro-montane forests to Wagagai Peak.",
    img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=75",
    color: "from-safari-900 to-safari-700",
  },
  {
    icon: "💧",
    title: "Nabuyole Falls",
    desc: "The magnificent Nzoia River plunges 10 metres into roaring mist. A hidden gem right in Bungoma County.",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75",
    color: "from-blue-900 to-blue-700",
  },
  {
    icon: "🦁",
    title: "Maasai Mara",
    desc: "Witness the Great Migration — 1.5 million wildebeest crossing the Mara River in nature's greatest spectacle.",
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=75",
    color: "from-savanna-900 to-savanna-700",
  },
  {
    icon: "🌿",
    title: "Kakamega Forest",
    desc: "Kenya's only tropical rainforest, home to 330+ bird species, primates, and ancient hardwood trees.",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=75",
    color: "from-emerald-900 to-emerald-700",
  },
];

export function AttractionHighlights() {
  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-sand-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-terracotta-600 font-semibold uppercase tracking-widest text-sm mb-3">
            ✦ Iconic Destinations
          </p>
          <h2 className="section-title mb-4">Kenya&apos;s Natural Wonders</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From volcanic peaks to ancient forests, Western Kenya is home to
            some of Africa&apos;s most spectacular and least-visited natural attractions.
          </p>
        </div>

        {/* Highlights grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHTS.map((item, i) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl h-72 cursor-pointer"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Background image */}
              <Image
                src={item.img}
                alt={item.title}
                fill
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${item.color}/80 to-transparent opacity-80`} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-3xl mb-2 drop-shadow-lg">{item.icon}</span>
                <h3 className="font-display text-xl font-bold text-white mb-1 drop-shadow">
                  {item.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3">
                  {item.desc}
                </p>
              </div>

              {/* Beadwork bottom strip */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "repeating-linear-gradient(90deg,#dc440f 0,#dc440f 8px,#f59009 8px,#f59009 16px,#22c55e 16px,#22c55e 24px,#1a1a1a 24px,#1a1a1a 32px)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
