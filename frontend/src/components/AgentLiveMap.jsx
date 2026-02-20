import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { agentIcon, customerIcon } from "../utils/mapIcon";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

function AgentLiveMap({ agentLocation, senderLat, senderLng, receiverLat, receiverLng }) {
  const hasSender   = senderLat   != null && senderLng   != null;
  const hasReceiver = receiverLat != null && receiverLng != null;

  const initialCenter = agentLocation
    ? [agentLocation.lat, agentLocation.lng]
    : hasSender   ? [senderLat, senderLng]
    : hasReceiver ? [receiverLat, receiverLng]
    : [27.7, 85.3];

  const boundPoints = [
    agentLocation ? [agentLocation.lat, agentLocation.lng] : null,
    hasSender     ? [senderLat, senderLng]                 : null,
    hasReceiver   ? [receiverLat, receiverLng]             : null,
  ];

  return (
    <MapContainer center={initialCenter} zoom={14} style={{ height: "100%", width: "100%" }}>
       <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
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