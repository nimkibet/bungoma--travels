import dynamic from "next/dynamic";

// Leaflet map must be dynamically imported because it depends on window
const MapComponent = dynamic(() => import("@/components/pages/attractions/AttractionsMap"), { ssr: false, loading: () => (
  <div className="w-full h-[600px] bg-sand-100 flex items-center justify-center rounded-3xl animate-pulse">
    <div className="text-obsidian-400 font-display font-bold text-xl flex items-center gap-2">
      <span className="w-6 h-6 border-4 border-sand-300 border-t-terracotta-500 rounded-full animate-spin" />
      Loading Map...
    </div>
  </div>
)});

export const metadata = {
  title: "Interactive Map | Bungoma Tours",
  description: "Explore the attractions of Western Kenya on our interactive map.",
};

export default function InteractiveMapPage() {
  return (
    <main className="min-h-screen bg-sand-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[calc(100vh-100px)] flex flex-col">
        <div className="mb-6">
          <h1 className="font-display text-4xl md:text-5xl font-black text-obsidian-900 mb-2">
            Explore <span className="text-terracotta-600">Western Kenya</span>
          </h1>
          <p className="text-obsidian-600 text-lg">
            Discover breathtaking attractions, waterfalls, and cultural sites across the region.
          </p>
        </div>
        
        <div className="flex-1 w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative z-0">
          <MapComponent />
        </div>
      </div>
    </main>
  );
}
