import { TicketsOrBookings } from "@/components/pages/profile/TicketsOrBookings";
import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import routes from "@/data/routes.json";

export default async function MyBookingsPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent("/user/my_bookings"),
    );
  }

  return (
    <main className="mx-auto mb-[90px] w-[95%] sm:w-[90%]">
      <BreadcrumbUI className="my-5" />
      <div className="bg-white rounded-2xl border border-sand-200 p-6 md:p-8 shadow-card-terracotta">
        <TicketsOrBookings />
      </div>
    </main>
  );
}
