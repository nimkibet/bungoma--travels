import { PackageBuilder } from "@/components/pages/package-builder/PackageBuilder";

export const metadata = {
  title: "Build Your Package | Bungoma Tours",
  description: "Customize your dream Western Kenya tour. Select attractions and get instant pricing.",
};

export default function PackageBuilderPage() {
  return (
    <main className="min-h-screen bg-sand-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-black text-obsidian-900 mb-4">
            Build Your <span className="text-terracotta-600">Dream Package</span>
          </h1>
          <p className="text-obsidian-600 text-lg">
            Select the attractions you want to visit and tell us who's coming. We'll instantly calculate your custom package price.
          </p>
        </div>
        
        <PackageBuilder />
      </div>
    </main>
  );
}
