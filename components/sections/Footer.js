import Link from "next/link";

export async function Footer() {
  return (
    <footer className="bg-obsidian-900 text-white relative overflow-hidden">
      {/* Beadwork top border */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{
          background:
            "repeating-linear-gradient(90deg,#dc440f 0,#dc440f 8px,#f59009 8px,#f59009 16px,#22c55e 16px,#22c55e 24px,#1a1a1a 24px,#1a1a1a 32px)",
        }}
      />

      {/* Decorative beadwork background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,#dc440f,#dc440f 2px,transparent 2px,transparent 20px),repeating-linear-gradient(-45deg,#f59009,#f59009 2px,transparent 2px,transparent 20px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-terracotta-600 flex items-center justify-center text-xl font-bold font-display">
                BT
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Bungoma Tours</h2>
                <p className="text-white/50 text-xs">Discover Western Kenya</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Your gateway to Western Kenya&apos;s most spectacular natural and cultural
              attractions. Authentic African experiences, fair KES pricing, and MPesa payments.
            </p>
            <div className="flex gap-3 mt-5">
              {["Facebook","Twitter","Instagram","YouTube"].map(s => (
                <a key={s} href="#" aria-label={s} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-terracotta-600 transition-colors duration-200 flex items-center justify-center text-xs font-bold">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-savanna-400 mb-4 uppercase text-sm tracking-wider">Explore</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/attractions", label: "All Attractions" },
                { href: "/attractions?category=Nature", label: "Nature Parks" },
                { href: "/attractions?category=Wildlife", label: "Wildlife Safaris" },
                { href: "/attractions?category=Beach", label: "Beach Destinations" },
                { href: "/attractions?featured=true", label: "Featured Tours" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-terracotta-400 text-sm transition-colors duration-200">
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-savanna-400 mb-4 uppercase text-sm tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-terracotta-400 mt-0.5">📍</span>
                <span>Bungoma Town, Western Kenya</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta-400 mt-0.5">📞</span>
                <a href="tel:+254700000000" className="hover:text-terracotta-400 transition-colors">+254 700 000 000</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta-400 mt-0.5">✉️</span>
                <a href="mailto:info@bungomaattractions.co.ke" className="hover:text-terracotta-400 transition-colors break-all">info@bungomaattractions.co.ke</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-safari-400 mt-0.5">📱</span>
                <span>Pay via M-PESA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Bungoma Tours. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/40">
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white/70 transition-colors">Terms of Service</Link>
            <Link href="/(pages)/dashboard/admin" className="hover:text-savanna-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
