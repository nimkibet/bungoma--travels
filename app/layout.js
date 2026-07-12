import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/app/StoreProvider";
import { SessionProvider } from "next-auth/react";
import mongoose from "mongoose";
import dynamic from "next/dynamic";
import MaintenancePage from "./MaintenancePage";
import { MaintenanceNotice } from "./MaintenanceNotice";
import SetNecessaryCookies from "./SetNecessaryCookies";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { headers } from "next/headers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: {
    default: "Bungoma Tours | Discover Western Kenya's Hidden Gems",
    template: "%s | Bungoma Tours",
  },
  description:
    "Explore Mount Elgon, Nabuyole Falls, Kakamega Forest and the best attractions in Western Kenya. Premium guided tours with authentic local experiences.",
  keywords: [
    "Bungoma Tours",
    "Kenya tourism",
    "Western Kenya",
    "Mount Elgon",
    "Nabuyole Falls",
    "Kakamega Forest",
    "safari Kenya",
    "Maasai Mara",
    "Kenya attractions",
    "African travel",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Bungoma Tours | Discover Western Kenya's Hidden Gems",
    description:
      "Authentic Kenyan travel experiences — from volcanic peaks to cascading waterfalls and ancient forests.",
    siteName: "Bungoma Tours",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bungoma Tours",
    description: "Discover Western Kenya's most breathtaking attractions.",
  },
};

export default async function RootLayout({ children }) {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (e) {
      console.error("[MongoDB] Connection error:", e.message);
    }
  }



  const websiteConfig = await getOneDoc("WebsiteConfig", {}, ["websiteConfig"], 60);
  const maintenanceMode = websiteConfig?.maintenanceMode ?? { enabled: false };
  const alloweRoutesWhileMaintenance = maintenanceMode?.allowlistedRoutes ?? [];
  const currentPathname = headers().get("x-pathname");

  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className={jakarta.className}>
        {maintenanceMode.enabled === true &&
        !alloweRoutesWhileMaintenance.some(
          (path) =>
            path === currentPathname ||
            (path !== "/" && currentPathname.startsWith(path))
        ) ? (
          <MaintenancePage
            message={maintenanceMode.message}
            startsAt={maintenanceMode.startsAt || 0}
            endsAt={maintenanceMode.endsAt || 0}
          />
        ) : (
          <StoreProvider>
            <SessionProvider>
              <div className="mx-auto max-w-[1440px]">
                <MaintenanceNotice maintenanceMode={maintenanceMode} />
                {children}
              </div>
            </SessionProvider>
          </StoreProvider>
        )}
        <NextTopLoader showSpinner={false} color="#dc440f" height={3} />
        <Toaster richColors closeButton expand position="top-right" />
        <SetNecessaryCookies />
      </body>
    </html>
  );
}
