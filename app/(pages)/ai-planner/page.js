import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { auth } from "@/lib/auth";
import { PlannerUI } from "@/components/pages/ai-planner/PlannerUI";

export const metadata = {
  title: "AI Itinerary Planner | Bungoma Tours",
  description: "Let our AI instantly build your custom day-by-day travel plan for Western Kenya.",
};

export default async function AIPlannerPage() {
  const session = await auth();

  return (
    <>
      <Nav session={session} />
      <main className="min-h-screen bg-sand-50 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian-900 text-savanna-400 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse" />
              Powered by AI
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-obsidian-900 mb-4">
              Your Perfect Trip, <span className="text-terracotta-600 italic">Instantly</span>
            </h1>
            <p className="text-obsidian-600 text-lg max-w-2xl mx-auto">
              Tell us what you love, and our AI travel concierge will craft a customized, day-by-day itinerary for your Western Kenya adventure in seconds.
            </p>
          </div>
          <PlannerUI />
        </div>
      </main>
      <Footer />
    </>
  );
}
