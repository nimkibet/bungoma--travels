"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AttractionsMap() {
  const [attractions, setAttractions] = useState([]);

  useEffect(() => {
    fetch("/api/attractions")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter attractions that have coordinates
          // For those that don't, we'll assign dummy coordinates in Western Kenya for the demo
          const mapped = data.attractions.map(a => {
            if (a.location?.coordinates?.lat && a.location?.coordinates?.lng) {
              return a;
            }
            // Western Kenya roughly around Bungoma/Kakamega: Lat 0.56, Lng 34.56
            // We'll add some slight random offset for the demo if they don't have coordinates
            const lat = 0.56 + (Math.random() - 0.5) * 0.5;
            const lng = 34.56 + (Math.random() - 0.5) * 0.5;
            return { ...a, location: { ...a.location, coordinates: { lat, lng } } };
          });
          setAttractions(mapped);
        }
      });
  }, []);

  const center = [0.56, 34.56]; // Approximate center of Western Kenya

  return (
    <MapContainer center={center} zoom={9} className="w-full h-full z-0 relative">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {attractions.map(attraction => {
        const { lat, lng } = attraction.location?.coordinates || {};
        if (!lat || !lng) return null;

        return (
          <Marker key={attraction._id} position={[lat, lng]}>
            <Popup className="custom-popup">
              <div className="w-48">
                <div className="h-24 w-full bg-sand-200 rounded-lg overflow-hidden mb-2 relative">
                  <img 
                    src={attraction.images?.[0] || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400"} 
                    alt={attraction.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold font-display text-obsidian-900 leading-tight mb-1">{attraction.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{attraction.shortDescription}</p>
                <a href={`/attractions/${attraction.slug}`} className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700">
                  View Details →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
