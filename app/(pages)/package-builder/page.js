import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { auth } from "@/lib/auth";
import { PackageBuilder } from "@/components/pages/package-builder/PackageBuilder";

export const metadata = {
  title: "Build Your Custom Package | Bungoma Tours",
  description: "Select your favorite attractions, hotels, and experiences. Watch your price update live and book instantly.",
};

export default async function PackageBuilderPage() {
  const session = await auth();

  return (
    <>
      <Nav session={session} />
      <main className="min-h-screen bg-sand-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-black text-obsidian-900 mb-4">
              Build Your <span className="text-terracotta-600">Custom Safari</span>
            </h1>
            <p className="text-obsidian-600 text-lg max-w-2xl mx-auto">
              Select the experiences, parks, and attractions you want to visit. Customize your itinerary block by block and see your total price update instantly.
            </p>
          </div>
          
          <PackageBuilder />
        </div>
      </main>
      <Footer />
    </>
  );
}
