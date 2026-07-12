import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import routes from "@/data/routes.json";

export default async function FavouritesPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  if (!isLoggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent(routes.favourites.path),
    );
  }

  return (
    <main className="mx-auto mb-[90px] w-[95%] sm:w-[90%] px-4 py-8">
      <div className="bg-white rounded-2xl border border-sand-200 p-8 md:p-12 shadow-card-terracotta text-center max-w-2xl mx-auto space-y-6">
        <div className="text-6xl animate-bounce">❤️</div>
        <h1 className="font-display text-3xl font-bold text-obsidian-800 beadwork-border pb-4">
          Your Saved Favourites
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Create a personalized list of Western Kenya&apos;s hidden gems! Save your top attractions, waterfalls, and national parks to easily plan your itinerary.
        </p>
        <div className="bg-sand-50 rounded-xl p-4 border border-sand-100 text-xs text-obsidian-600 inline-block">
          💡 Click the heart icon on any attraction page to save it here.
        </div>
        <div>
          <Link href="/attractions" className="btn-terracotta inline-block">
            Explore Attractions
          </Link>
        </div>
      </div>
    </main>
  );
}
