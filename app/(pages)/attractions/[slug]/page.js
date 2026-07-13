import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import mongoose from "mongoose";
import { Attraction } from "@/lib/db/models";
import { BookingForm } from "@/components/pages/attractions/BookingForm";
import { auth } from "@/lib/auth";
import { WeatherWidget } from "@/components/pages/attractions/WeatherWidget";

async function getAttraction(slug) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  return Attraction.findOne({ slug, isActive: true }).lean();
}

export async function generateMetadata({ params }) {
  const attraction = await getAttraction(params.slug);
  if (!attraction) return {};
  return {
    title: attraction.seo?.metaTitle || `${attraction.title} | Bungoma Tours`,
    description: attraction.seo?.metaDescription || attraction.shortDescription,
  };
}

export default async function AttractionDetailPage({ params }) {
  const [attraction, session] = await Promise.all([
    getAttraction(params.slug),
    auth(),
  ]);

  if (!attraction) return notFound();

  const primaryImage = attraction.images?.[0] ||
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=85";

  return (
    <>
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <Image src={primaryImage} alt={attraction.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-obsidian-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "repeating-linear-gradient(90deg,#dc440f 0,#dc440f 8px,#f59009 8px,#f59009 16px,#22c55e 16px,#22c55e 24px,#1a1a1a 24px,#1a1a1a 32px)" }} />

        <div className="absolute bottom-10 left-4 md:left-12 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-terracotta-600 text-white text-xs font-bold px-3 py-1 rounded-full">{attraction.category}</span>
            {attraction.featured && <span className="bg-savanna-500 text-obsidian-900 text-xs font-bold px-3 py-1 rounded-full">★ Featured</span>}
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">{attraction.title}</h1>
          <p className="text-white/80 text-lg">📍 {attraction.location?.county}{attraction.location?.region ? `, ${attraction.location.region}` : ""}</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-terracotta-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/attractions" className="hover:text-terracotta-600 transition-colors">Attractions</Link>
              <span>/</span>
              <span className="text-obsidian-700 font-medium">{attraction.title}</span>
            </nav>

            {/* Description */}
            <div>
              <h2 className="font-display text-2xl font-bold text-obsidian-800 mb-4 beadwork-border pb-4">About This Attraction</h2>
              <p className="text-obsidian-600 leading-relaxed text-lg whitespace-pre-line">{attraction.description}</p>
            </div>

            {/* Image gallery */}
            {attraction.images?.length > 1 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-obsidian-800 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {attraction.images.map((img, i) => (
                    <div key={i} className="relative h-40 rounded-xl overflow-hidden group">
                      <Image src={img} alt={`${attraction.title} - image ${i + 1}`} fill sizes="200px" className="object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            {attraction.facilities?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-obsidian-800 mb-4">Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {attraction.facilities.map(f => (
                    <span key={f} className="bg-sand-100 text-obsidian-700 text-sm px-3 py-1.5 rounded-full border border-sand-200">✓ {f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Opening hours */}
            {attraction.openingHours && (
              <div className="bg-safari-50 border border-safari-200 rounded-2xl p-6">
                <h3 className="font-display text-lg font-bold text-safari-800 mb-3">⏰ Opening Hours</h3>
                <p className="text-safari-700 font-medium">{attraction.openingHours.open} – {attraction.openingHours.close}</p>
                <p className="text-safari-600 text-sm mt-1">{attraction.openingHours.daysOpen?.join(", ")}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <div className="mb-6">
              <WeatherWidget location={attraction.location?.county || "Bungoma"} />
            </div>

            {/* Pricing card */}
              <div className="bg-white rounded-2xl shadow-card-terracotta p-6 sticky top-24">
                <h3 className="font-display text-xl font-bold text-obsidian-800 mb-5 beadwork-border pb-4">Entry Fees (KES)</h3>
                <div className="space-y-4">
                  {attraction.entryFee?.citizen > 0 && (
                    <div className="flex justify-between items-center p-3 bg-safari-50 rounded-xl border border-safari-200">
                      <span className="text-safari-800 font-semibold flex items-center gap-2">🇰🇪 Kenyan Citizen</span>
                      <span className="font-bold text-safari-700 text-lg">KES {attraction.entryFee.citizen.toLocaleString()}</span>
                    </div>
                  )}
                  {attraction.entryFee?.resident > 0 && (
                    <div className="flex justify-between items-center p-3 bg-savanna-50 rounded-xl border border-savanna-200">
                      <span className="text-savanna-800 font-semibold flex items-center gap-2">🌍 East African Resident</span>
                      <span className="font-bold text-savanna-700 text-lg">KES {attraction.entryFee.resident.toLocaleString()}</span>
                    </div>
                  )}
                  {attraction.entryFee?.foreigner > 0 && (
                    <div className="flex justify-between items-center p-3 bg-terracotta-50 rounded-xl border border-terracotta-200">
                      <span className="text-terracotta-800 font-semibold flex items-center gap-2">✈️ International Visitor</span>
                      <span className="font-bold text-terracotta-700 text-lg">KES {attraction.entryFee.foreigner.toLocaleString()}</span>
                    </div>
                  )}
                  {(!attraction.entryFee?.citizen && !attraction.entryFee?.resident && !attraction.entryFee?.foreigner) && (
                    <p className="text-center text-safari-600 font-semibold py-4">🎉 Free Entry</p>
                  )}
                </div>

                {/* Booking form */}
                <div className="mt-6 pt-6 border-t border-sand-200">
                  <BookingForm
                    attractionSlug={attraction.slug}
                    entryFee={attraction.entryFee}
                    session={session}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
