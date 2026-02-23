import { MapContainer, TileLayer, Marker, useMap, Polyline } from "react-leaflet";
import { agentIcon, customerIcon } from "../utils/mapIcon";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getRoute } from "../utils/Location";

const receiverIcon = L.divIcon({
  className: "",
  html: `<div style="font-size:32px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35));user-select:none;">🏠</div>`,
  iconSize:   [32, 32],
  iconAnchor: [16, 32],
  popupAnchor:[0, -34],
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    const valid = points.filter(Boolean);
    if (valid.length === 0) return;
    if (valid.length === 1) { map.setView(valid[0], 15); return; }
    map.fitBounds(L.latLngBounds(valid), { padding: [60, 60] });
  }, [points.map(p => p?.join(",")).join("|")]);
  return null;
}

function AgentLiveMap({ agentLocation, senderLat, senderLng, receiverLat, receiverLng, deliveryStatus }) {
  const [routePoints, setRoutePoints] = useState([]);

  const hasSender   = senderLat   != null && senderLng   != null;
  const hasReceiver = receiverLat != null && receiverLng != null;
  const hasAgent    = agentLocation != null;


  // Switch route based on delivery status
  // - pending/default  → agent ➜ sender (pickup route)
  // - picked_up+       → agent ➜ receiver (delivery route)
  useEffect(() => {
    if (!hasAgent) return;

    const isPickedUp = deliveryStatus === "picked_up" || deliveryStatus === "in_transit";

    const destination = isPickedUp
      ? (hasReceiver ? { lat: receiverLat, lng: receiverLng } : null)
      : (hasSender   ? { lat: senderLat,   lng: senderLng   } : null);

    if (!destination) return;

    getRoute(agentLocation, destination).then(result => {
      if (result?.routePoints) setRoutePoints(result.routePoints);
    });

  }, [
    // Re-fetch when agent moves significantly or status changes
    agentLocation?.lat?.toFixed(3),
    agentLocation?.lng?.toFixed(3),
    deliveryStatus,
  ]);

  const initialCenter = agentLocation
    ? [agentLocation.lat, agentLocation.lng]
    : hasSender   ? [senderLat, senderLng]
    : hasReceiver ? [receiverLat, receiverLng]
    : [27.7, 85.3];

    
    // Route line color: blue for pickup, green for delivery
    const isPickedUp = deliveryStatus === "picked_up" || deliveryStatus === "in_transit";
    const routeColor = isPickedUp ? "#1a1a1a;" : "#1a1a1a;";
    
    const boundPoints = [
      hasAgent    ? [agentLocation.lat, agentLocation.lng] : null,
      isPickedUp
          ? (hasReceiver ? [receiverLat, receiverLng] : null)
          : (hasSender   ? [senderLat, senderLng]     : null),
  ];
  return (
    <MapContainer center={initialCenter} zoom={14} style={{ height: "100%", width: "100%" }}>
       <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Route polyline */}
      {routePoints.length > 0 && (
        <Polyline
          positions={routePoints.map(p => [p.lat, p.lng])}
          pathOptions={{ color: routeColor, weight: 5, opacity: 0.8 }}
        />
      )}
      {agentLocation && (
        <Marker position={[agentLocation.lat, agentLocation.lng]} icon={agentIcon} />
      )}
      {hasSender && (
        <Marker position={[senderLat, senderLng]} icon={customerIcon} />
      )}
      {hasReceiver && (
        <Marker position={[receiverLat, receiverLng]} icon={receiverIcon} />
      )}
      <FitBounds points={boundPoints} />
    </MapContainer>
  );
}

export default AgentLiveMap;