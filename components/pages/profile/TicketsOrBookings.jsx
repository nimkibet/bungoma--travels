import Image from "next/image";
import Link from "next/link";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { Booking } from "@/lib/db/models";

async function getAttractionBookings(userId) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  // Ensure Attraction model is registered
  require("@/lib/db/models");
  
  return Booking.find({ user: userId })
    .populate("attraction")
    .sort({ createdAt: -1 })
    .lean();
}

export async function TicketsOrBookings() {
  const session = await auth();
  const userId = session?.user?.id;
  
  const bookings = userId ? await getAttractionBookings(userId) : [];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[2rem] font-bold font-display text-obsidian-800">Your Bookings</h1>
        <div className="bg-sand-100 px-3 py-1.5 rounded-full text-xs font-semibold text-obsidian-600">
          {bookings.length} Booking{bookings.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white border border-sand-200 p-10 text-center shadow-card-terracotta">
            <div className="text-5xl">🌍</div>
            <div className="text-xl font-bold text-obsidian-800">No bookings found</div>
            <p className="max-w-md text-sm text-muted-foreground">
              You haven&apos;t booked any attractions yet. Start exploring Bungoma County and Western Kenya today!
            </p>
            <Link href="/attractions" className="btn-terracotta text-sm">
              Browse Attractions
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {bookings.map((booking) => {
              const attraction = booking.attraction || {};
              const img = attraction.images?.[0] || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=75";
              const totalGuests = (booking.numberOfGuests?.citizens || 0) + 
                                  (booking.numberOfGuests?.residents || 0) + 
                                  (booking.numberOfGuests?.foreigners || 0);
              
              const statusColors = {
                Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
                Paid: "bg-green-100 text-green-800 border-green-200",
                Failed: "bg-red-100 text-red-800 border-red-200",
                Refunded: "bg-blue-100 text-blue-800 border-blue-200",
              };

              return (
                <div 
                  key={booking._id.toString()} 
                  className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-card-terracotta hover:shadow-card-hover transition-all duration-300 flex flex-col"
                  id={`booking-card-${booking.confirmationCode}`}
                >
                  {/* Card Image Header */}
                  <div className="relative h-40">
                    <Image 
                      src={img} 
                      alt={attraction.title || "Attraction"} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[booking.paymentStatus] || "bg-sand-100"}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs text-savanna-300 font-semibold tracking-wider uppercase">
                        {attraction.category || "Tour"}
                      </p>
                      <h3 className="font-display text-lg font-bold truncate leading-tight mt-0.5">
                        {attraction.title || "Unknown Attraction"}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">Date of Visit</span>
                        <span className="font-semibold text-obsidian-800">
                          {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString("en-KE", { dateStyle: "medium" }) : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">Guests</span>
                        <span className="font-semibold text-obsidian-800">
                          {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">Confirmation</span>
                        <span className="font-semibold font-mono text-xs text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded border border-terracotta-100">
                          {booking.confirmationCode}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">Total Amount</span>
                        <span className="font-bold text-safari-700">
                          KES {booking.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Guest Breakdown */}
                    <div className="text-xs bg-sand-50 rounded-xl p-3 border border-sand-100 space-y-1">
                      <p className="text-muted-foreground font-semibold uppercase tracking-wider mb-1" style={{fontSize: '9px'}}>Guest Tiers</p>
                      {booking.numberOfGuests?.citizens > 0 && (
                        <div className="flex justify-between">
                          <span>Kenyan Citizen(s):</span>
                          <span className="font-bold">{booking.numberOfGuests.citizens}</span>
                        </div>
                      )}
                      {booking.numberOfGuests?.residents > 0 && (
                        <div className="flex justify-between">
                          <span>EA Resident(s):</span>
                          <span className="font-bold">{booking.numberOfGuests.residents}</span>
                        </div>
                      )}
                      {booking.numberOfGuests?.foreigners > 0 && (
                        <div className="flex justify-between">
                          <span>Foreign Visitor(s):</span>
                          <span className="font-bold">{booking.numberOfGuests.foreigners}</span>
                        </div>
                      )}
                    </div>

                    {booking.mpesaPhone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-sand-100">
                        <span className="text-safari-600">📱</span>
                        <span>Paid/Requested via M-PESA: <strong>{booking.mpesaPhone}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
