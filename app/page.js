import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { BungomaHero } from "@/components/pages/home/sections/BungomaHero";
import { AttractionHighlights } from "@/components/pages/home/sections/AttractionHighlights";
import { WhyBungomaSection } from "@/components/pages/home/sections/WhyBungomaSection";
import { FeaturedAttractions } from "@/components/pages/home/sections/FeaturedAttractions";
import { Reviews } from "@/components/pages/home/sections/Reviews";
import { auth } from "@/lib/auth";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { Suspense } from "react";

export const metadata = {
  title: "Bungoma Tours | Discover Western Kenya's Hidden Gems",
  description:
    "Explore Mount Elgon, Nabuyole Falls, Kakamega Forest and the best attractions in Western Kenya. Book your authentic African adventure today.",
};

function ReviewsSkeleton() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <div className="animate-pulse space-y-6 text-center">
        <div className="h-4 w-32 bg-sand-200 rounded mx-auto" />
        <div className="h-8 w-64 bg-sand-200 rounded mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-sand-200 rounded-2xl p-6 space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-sand-200" />
                <div className="space-y-2 text-left">
                  <div className="h-4 w-24 bg-sand-200 rounded" />
                  <div className="h-3 w-16 bg-sand-200 rounded" />
                </div>
              </div>
              <div className="h-4 bg-sand-200 rounded w-full" />
              <div className="h-4 bg-sand-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const session = await auth();
  
  // Fetch CMS Data for homepage
  const pageDataRaw = await getOneDoc("PageContent", { page: "home" }, [], false);
  const pageData = pageDataRaw?.content || {};

  return (
    <>
      <header className="relative">
        <Nav type="home" className="absolute left-0 top-0 z-10" session={session} />
        <BungomaHero cmsData={pageData} />
      </header>

      <main className="mx-auto w-full overflow-hidden">
        <AttractionHighlights cmsData={pageData} />
        <FeaturedAttractions cmsData={pageData} />
        <WhyBungomaSection cmsData={pageData} />
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
