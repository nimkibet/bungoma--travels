"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function BookingForm({ attractionSlug, entryFee, session }) {
  const router = useRouter();
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);
  const formattedDefaultDate = defaultDate.toISOString().split("T")[0];

  const [form, setForm] = useState({
    travelDate: formattedDefaultDate,
    citizens: 0,
    residents: 0,
    foreigners: 0,
    mpesaPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // stores booking data
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // "Pending", "Paid", "Failed"

  // Poll for payment status
  useEffect(() => {
    let intervalId;
    if (success && paymentStatus === "Pending") {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/bookings/${success._id}/status`);
          const data = await res.json();
          if (data.success && data.paymentStatus !== "Pending") {
            setPaymentStatus(data.paymentStatus);
            if (data.paymentStatus === "Failed") {
              setError(`Payment failed or was cancelled. Reason: ${data.paymentReference}`);
            }
          }
        } catch (err) {
          console.error("Error polling payment status:", err);
        }
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [success, paymentStatus]);

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
    setPaymentStatus(null);
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
        setPaymentStatus("Pending");
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
        {paymentStatus === "Pending" && (
          <div className="mb-4">
            <div className="w-12 h-12 border-4 border-safari-200 border-t-safari-600 rounded-full animate-spin mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-safari-800 mb-2">Waiting for M-PESA...</h3>
            <p className="text-safari-600 text-sm">Please check your phone and enter your PIN to complete the payment.</p>
          </div>
        )}
        
        {paymentStatus === "Paid" && (
          <div className="mb-4 animate-in zoom-in duration-300">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="font-display text-2xl font-bold text-green-700 mb-2">Payment Successful!</h3>
            <p className="text-green-600 text-sm font-medium">Your booking is fully confirmed.</p>
          </div>
        )}

        {paymentStatus === "Failed" && (
          <div className="mb-4 animate-in zoom-in duration-300">
            <div className="text-5xl mb-3">❌</div>
            <h3 className="font-display text-2xl font-bold text-red-700 mb-2">Payment Failed</h3>
            <p className="text-red-600 text-sm mb-4">{error || "The M-PESA transaction was not completed."}</p>
            <button onClick={() => { setSuccess(null); setPaymentStatus(null); }} className="btn-terracotta py-2 px-6">Try Again</button>
          </div>
        )}

        <div className="bg-white rounded-lg p-4 mt-4 border border-safari-200 text-left">
          <p className="text-safari-700 text-sm mb-1">Confirmation Code:</p>
          <p className="font-bold text-lg text-safari-900 mb-3">{success.confirmationCode}</p>
          <p className="text-safari-600 text-sm flex justify-between">
            <span>Total Amount:</span>
            <strong className="text-obsidian-900">KES {success.totalAmount?.toLocaleString()}</strong>
          </p>
        </div>
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
