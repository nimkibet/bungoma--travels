"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function BookingForm({ attractionSlug, entryFee, session }) {
  const router = useRouter();
  const [form, setForm] = useState({
    travelDate: "",
    citizens: 0,
    residents: 0,
    foreigners: 0,
    mpesaPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  if (!session?.user) {
    return (
      <div className="text-center p-4 bg-sand-50 rounded-xl border border-sand-200">
        <p className="text-obsidian-600 text-sm mb-3 font-medium">Sign in to book this attraction</p>
        <Link href="/login" className="btn-terracotta text-sm py-2 px-6 inline-block">
          Sign In to Book
        </Link>
      </div>
    );
  }

  const totalCost =
    (form.citizens || 0) * (entryFee?.citizen || 0) +
    (form.residents || 0) * (entryFee?.resident || 0) +
    (form.foreigners || 0) * (entryFee?.foreigner || 0);

  const totalGuests = (form.citizens || 0) + (form.residents || 0) + (form.foreigners || 0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (totalGuests === 0) {
      setError("Please add at least 1 guest");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attractionSlug,
          travelDate: form.travelDate,
          numberOfGuests: {
            citizen: form.citizens,
            resident: form.residents,
            foreigner: form.foreigners,
          },
          mpesaPhone: form.mpesaPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.booking);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-safari-50 border border-safari-300 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-display text-xl font-bold text-safari-800 mb-2">Booking Confirmed!</h3>
        <p className="text-safari-700 text-sm mb-2">Confirmation Code:</p>
        <p className="font-bold text-lg text-safari-900 bg-white px-4 py-2 rounded-lg border border-safari-300 mb-4">
          {success.confirmationCode}
        </p>
        <p className="text-safari-600 text-sm mb-4">
          Total: <strong>KES {success.totalAmount?.toLocaleString()}</strong>
        </p>
        <p className="text-xs text-safari-600">
          Pay via MPesa to complete your booking. An M-Pesa prompt will be sent to your phone shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id={`booking-form-${attractionSlug}`}>
      <h3 className="font-display text-lg font-bold text-obsidian-800">Book Your Visit</h3>

      {/* Date */}
      <div>
        <label htmlFor="travel-date" className="block text-sm font-semibold text-obsidian-700 mb-1.5">
          Travel Date
        </label>
        <input
          id="travel-date"
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={form.travelDate}
          onChange={e => setForm(f => ({ ...f, travelDate: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm"
        />
      </div>

      {/* Guest counts */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-obsidian-700">Number of Guests</label>
        {entryFee?.citizen > 0 && (
          <div className="flex items-center justify-between bg-safari-50 px-3 py-2.5 rounded-xl border border-safari-200">
            <div>
              <span className="text-sm font-medium text-safari-800">🇰🇪 Citizens</span>
              <span className="text-xs text-safari-600 ml-2">KES {entryFee.citizen.toLocaleString()}/ea</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setForm(f => ({ ...f, citizens: Math.max(0, f.citizens - 1) }))} className="w-7 h-7 rounded-full bg-white border border-safari-300 text-safari-700 font-bold text-lg leading-none cursor-pointer hover:bg-safari-100 transition-colors flex items-center justify-center">−</button>
              <span className="w-6 text-center text-sm font-bold text-obsidian-800">{form.citizens}</span>
              <button type="button" onClick={() => setForm(f => ({ ...f, citizens: f.citizens + 1 }))} className="w-7 h-7 rounded-full bg-safari-700 text-white font-bold text-lg leading-none cursor-pointer hover:bg-safari-800 transition-colors flex items-center justify-center">+</button>
            </div>
          </div>
        )}
        {entryFee?.resident > 0 && (
          <div className="flex items-center justify-between bg-savanna-50 px-3 py-2.5 rounded-xl border border-savanna-200">
            <div>
              <span className="text-sm font-medium text-savanna-800">🌍 Residents</span>
              <span className="text-xs text-savanna-600 ml-2">KES {entryFee.resident.toLocaleString()}/ea</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setForm(f => ({ ...f, residents: Math.max(0, f.residents - 1) }))} className="w-7 h-7 rounded-full bg-white border border-savanna-300 text-savanna-700 font-bold cursor-pointer hover:bg-savanna-100 transition-colors flex items-center justify-center">−</button>
              <span className="w-6 text-center text-sm font-bold text-obsidian-800">{form.residents}</span>
              <button type="button" onClick={() => setForm(f => ({ ...f, residents: f.residents + 1 }))} className="w-7 h-7 rounded-full bg-savanna-500 text-white font-bold cursor-pointer hover:bg-savanna-600 transition-colors flex items-center justify-center">+</button>
            </div>
          </div>
        )}
        {entryFee?.foreigner > 0 && (
          <div className="flex items-center justify-between bg-terracotta-50 px-3 py-2.5 rounded-xl border border-terracotta-200">
            <div>
              <span className="text-sm font-medium text-terracotta-800">✈️ International</span>
              <span className="text-xs text-terracotta-600 ml-2">KES {entryFee.foreigner.toLocaleString()}/ea</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setForm(f => ({ ...f, foreigners: Math.max(0, f.foreigners - 1) }))} className="w-7 h-7 rounded-full bg-white border border-terracotta-300 text-terracotta-700 font-bold cursor-pointer hover:bg-terracotta-100 transition-colors flex items-center justify-center">−</button>
              <span className="w-6 text-center text-sm font-bold text-obsidian-800">{form.foreigners}</span>
              <button type="button" onClick={() => setForm(f => ({ ...f, foreigners: f.foreigners + 1 }))} className="w-7 h-7 rounded-full bg-terracotta-600 text-white font-bold cursor-pointer hover:bg-terracotta-700 transition-colors flex items-center justify-center">+</button>
            </div>
          </div>
        )}
      </div>

      {/* MPesa phone */}
      <div>
        <label htmlFor="mpesa-phone" className="block text-sm font-semibold text-obsidian-700 mb-1.5">
          MPesa Phone Number
        </label>
        <input
          id="mpesa-phone"
          type="tel"
          placeholder="07XXXXXXXX or 2547XXXXXXXX"
          value={form.mpesaPhone}
          onChange={e => setForm(f => ({ ...f, mpesaPhone: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl border border-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm"
        />
      </div>

      {/* Total */}
      {totalCost > 0 && (
        <div className="bg-obsidian-900 text-white rounded-xl p-4 flex justify-between items-center">
          <span className="font-semibold">{totalGuests} guest{totalGuests !== 1 ? "s" : ""}</span>
          <span className="font-display text-xl font-bold text-savanna-400">
            KES {totalCost.toLocaleString()}
          </span>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        id="submit-booking-btn"
        disabled={loading || totalGuests === 0}
        className="w-full btn-terracotta py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? "Processing..." : `Book via MPesa${totalCost > 0 ? ` — KES ${totalCost.toLocaleString()}` : ""}`}
      </button>
    </form>
  );
}
