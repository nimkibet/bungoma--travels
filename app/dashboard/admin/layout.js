import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOneDoc } from "@/lib/db/getOperationDB";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Admin Portal | Bungoma Tours",
};

export default async function AdminLayout({ children }) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/user/login");
  }

  // Security Patch: Ensure the user is an admin
  const user = await getOneDoc("User", { email: session.user.email }, [], false);
  if (user?.role !== "admin") {
    redirect("/"); // Unauthorized users get bounced to home
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF] overflow-hidden font-jakarta">
      {/* Sidebar - Pro Max Style */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-[#1E293B]">
          <Link href="/dashboard/admin" className="font-playfair text-2xl font-bold text-[#38BDF8]">
            Bungoma<span className="text-white">Admin</span>
          </Link>
          <p className="text-xs text-[#94A3B8] mt-1">Management Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/dashboard/admin" className="block px-4 py-3 rounded-lg bg-[#0EA5E9]/10 text-[#38BDF8] font-medium border border-[#0EA5E9]/20 transition-all">
            📊 Overview & Attractions
          </Link>
        </nav>

        <div className="p-4 border-t border-[#1E293B] space-y-3">
          <Link href="/" className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold transition-colors text-sm shadow-lg shadow-[#EA580C]/20">
            🌍 View Live Website
          </Link>
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {session.user?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{session.user?.email}</p>
              <p className="text-xs text-[#38BDF8]">Pro Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#F0F9FF]">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-[#BAE6FD] px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold text-[#0C4A6E]">Control Center</h1>
          <div className="text-sm text-[#0C4A6E]/70 flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-[#E8F2F8] border border-[#BAE6FD] text-xs font-semibold text-[#0EA5E9]">
              System Status: Online
            </span>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
