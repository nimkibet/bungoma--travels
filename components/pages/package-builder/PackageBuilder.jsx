"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export function PackageBuilder() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the builder
  const [selectedItems, setSelectedItems] = useState([]);
  const [guests, setGuests] = useState({ citizens: 1, residents: 0, foreigners: 0 });

  useEffect(() => {
    fetch("/api/attractions")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAttractions(data.attractions);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const totalGuests = guests.citizens + guests.residents + guests.foreigners;

  // Calculate total price based on selected items and guest types
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const c = guests.citizens * (item.entryFee?.citizen || 0);
      const r = guests.residents * (item.entryFee?.resident || 0);
      const f = guests.foreigners * (item.entryFee?.foreigner || 0);
      return total + c + r + f;
    }, 0);
  };

  const totalPrice = calculateTotal();

  const handleToggleItem = (attraction) => {
    if (selectedItems.find(i => i._id === attraction._id)) {
      setSelectedItems(selectedItems.filter(i => i._id !== attraction._id));
    } else {
      setSelectedItems([...selectedItems, attraction]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-sand-200 border-t-terracotta-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative">
      
      {/* LEFT: Attraction Selection */}
      <div className="w-full lg:w-2/3 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-sand-200">
          <h2 className="font-display text-2xl font-bold text-obsidian-800 mb-6 flex items-center gap-2">
            <span>1️⃣</span> Configure Your Group
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Citizens */}
            <div className="bg-sand-50 p-4 rounded-xl border border-sand-200 flex flex-col items-center">
              <span className="text-sm font-bold text-obsidian-600 mb-2">🇰🇪 Citizens</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setGuests(g => ({...g, citizens: Math.max(0, g.citizens - 1)}))} className="w-8 h-8 rounded-full bg-white border border-sand-300 font-bold hover:bg-sand-100">−</button>
                <span className="font-bold text-lg w-4 text-center">{guests.citizens}</span>
                <button onClick={() => setGuests(g => ({...g, citizens: g.citizens + 1}))} className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-700 font-bold hover:bg-terracotta-200">+</button>
              </div>
            </div>
            {/* Residents */}
            <div className="bg-sand-50 p-4 rounded-xl border border-sand-200 flex flex-col items-center">
              <span className="text-sm font-bold text-obsidian-600 mb-2">🌍 Residents</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setGuests(g => ({...g, residents: Math.max(0, g.residents - 1)}))} className="w-8 h-8 rounded-full bg-white border border-sand-300 font-bold hover:bg-sand-100">−</button>
                <span className="font-bold text-lg w-4 text-center">{guests.residents}</span>
                <button onClick={() => setGuests(g => ({...g, residents: g.residents + 1}))} className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-700 font-bold hover:bg-terracotta-200">+</button>
              </div>
            </div>
            {/* Foreigners */}
            <div className="bg-sand-50 p-4 rounded-xl border border-sand-200 flex flex-col items-center">
              <span className="text-sm font-bold text-obsidian-600 mb-2">✈️ Internationals</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setGuests(g => ({...g, foreigners: Math.max(0, g.foreigners - 1)}))} className="w-8 h-8 rounded-full bg-white border border-sand-300 font-bold hover:bg-sand-100">−</button>
                <span className="font-bold text-lg w-4 text-center">{guests.foreigners}</span>
                <button onClick={() => setGuests(g => ({...g, foreigners: g.foreigners + 1}))} className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-700 font-bold hover:bg-terracotta-200">+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-sand-200">
          <h2 className="font-display text-2xl font-bold text-obsidian-800 mb-6 flex items-center gap-2">
            <span>2️⃣</span> Select Experiences
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {attractions.map(attraction => {
              const isSelected = !!selectedItems.find(i => i._id === attraction._id);
              return (
                <div 
                  key={attraction._id}
                  onClick={() => handleToggleItem(attraction)}
                  className={`group relative flex items-center gap-4 p-3 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-terracotta-500 bg-terracotta-50/50' : 'border-sand-200 hover:border-terracotta-300 bg-white'}`}
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                    <Image 
                      src={attraction.images?.[0] || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=75"}
                      alt={attraction.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-obsidian-800 line-clamp-1">{attraction.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{attraction.location?.county}</p>
                    <div className="mt-1 text-xs font-bold text-terracotta-600">
                      from KES {attraction.entryFee?.citizen || 0}
                    </div>
                  </div>
                  <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center mr-2 transition-colors ${isSelected ? 'bg-terracotta-500 border-terracotta-500' : 'border-sand-300 group-hover:border-terracotta-400'}`}>
                    {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Live Summary / Cart */}
      <div className="w-full lg:w-1/3 lg:sticky lg:top-28">
        <div className="bg-obsidian-900 rounded-3xl p-6 shadow-2xl text-white">
          <h2 className="font-display text-2xl font-bold mb-6 border-b border-white/10 pb-4">Trip Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
            {selectedItems.length === 0 ? (
              <p className="text-white/50 text-center py-8 italic">No experiences selected yet. Add some to build your package.</p>
            ) : (
              selectedItems.map(item => {
                const itemTotal = (guests.citizens * (item.entryFee?.citizen || 0)) +
                                  (guests.residents * (item.entryFee?.resident || 0)) +
                                  (guests.foreigners * (item.entryFee?.foreigner || 0));
                
                return (
                  <div key={item._id} className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-bold text-sm text-white/90">{item.title}</div>
                      <button onClick={() => handleToggleItem(item)} className="text-xs text-red-400 hover:text-red-300 mt-0.5">Remove</button>
                    </div>
                    <div className="font-mono text-sm">KES {itemTotal.toLocaleString()}</div>
                  </div>
                )
              })
            )}
          </div>

          <div className="border-t border-white/10 pt-4 mb-6">
            <div className="flex justify-between items-center text-white/70 text-sm mb-2">
              <span>Total Guests</span>
              <span>{totalGuests}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-bold text-lg text-white">Total Estimated Price</span>
              <span className="font-display text-3xl font-bold text-savanna-400">KES {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <button 
            disabled={selectedItems.length === 0 || totalGuests === 0}
            className="w-full btn-terracotta py-4 text-lg shadow-lg shadow-terracotta-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book This Custom Package
          </button>
        </div>
      </div>

    </div>
  );
}
