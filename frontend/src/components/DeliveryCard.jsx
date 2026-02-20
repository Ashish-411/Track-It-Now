import { useEffect, useState } from "react";
import { getPlaceName } from "../utils/Location";
import "../styles/DeliveryCard.css";

function formatLocation(place) {
  if (!place) return "Locating...";
  const city = place.city.replace(/\s*(Metropolitan|Sub-Metropolitan|Municipal)\s*City\s*/i, "").trim();
  const parts = [place.road, place.suburb, city].filter(Boolean);
  return parts.join(", ") || place.full || "Unknown";
}

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function DeliveryCard({ item }) {
  const [placeName, setPlaceName] = useState("Locating...");

  // parcel_destination is [lat, lng]
  useEffect(() => {
    const dest = item.parcel_destination;
    if (!dest || dest.length < 2) { setPlaceName("No location"); return; }

    getPlaceName(dest[0], dest[1]).then(place => {
      setPlaceName(formatLocation(place));
    });
  }, [item.parcel_destination]);

  return (
  <div className="dc-card">
    {/* Left: icon */}
    <div className="dc-icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
        <path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>
      </svg>
    </div>

    {/* Right: all details */}
    <div className="dc-details">
      <span className="dc-parcel-id">#PKG-{String(item.parcel_id).padStart(4, '0')}</span>
      <div className="dc-desc">{item.parcel_description || "No description"}</div>

      <div className="dc-row">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span className="dc-place">{placeName}</span>
      </div>

      <div className="dc-date">{formatDate(item.created_at)}</div>
    </div>
  </div>
);
}

export default DeliveryCard;