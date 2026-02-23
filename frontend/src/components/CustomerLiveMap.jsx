import { Marker, TileLayer, MapContainer , Polyline, useMap} from "react-leaflet";
import { customerIcon, agentIcon } from "../utils/mapIcon";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getRoute } from "../utils/Location";
import { useState, useEffect } from "react";

const receiverIcon = L.divIcon({
    className: "",
    html: `<div style="font-size:32px;line-height:1;">🏠</div>`,
    iconSize:   [32, 32],
    iconAnchor: [16, 32],
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
function CustomerLiveMap({ senderLat, senderLng, receiverLat, receiverLng, agentLocation }) {
    const [routePoints, setRoutePoints] = useState([]);

    const hasSender   = senderLat   != null && senderLng   != null;
    const hasReceiver = receiverLat != null && receiverLng != null;
    const hasAgent = agentLocation != null;  
    // Customer always sees: agent → receiver (drop-off)
    useEffect(() => {

        if (!hasAgent || !hasReceiver) return;

        getRoute(
            { lat: agentLocation.lat, lng: agentLocation.lng },
            { lat: receiverLat, lng: receiverLng }
        ).then(result => {
            if (result?.routePoints) setRoutePoints(result.routePoints);
        });
    }, [
        agentLocation?.lat,
        agentLocation?.lng,
        receiverLat,
        receiverLng,
    ]);

    const center =  hasAgent    ? [agentLocation.lat, agentLocation.lng]
                 :  hasSender   ? [senderLat, senderLng]
                 : hasReceiver ? [receiverLat, receiverLng]
                 : [27.7, 85.3];

    const boundPoints = [
        hasAgent    ? [agentLocation.lat, agentLocation.lng] : null,
        hasReceiver ? [receiverLat, receiverLng]             : null,
        // sender excluded — customer doesn't need to see pickup point in bounds
    ];

    return (
        <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
             <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {/* Route: agent → receiver, always green */}
            {routePoints.length > 0 && (
                <Polyline
                    positions={routePoints.map(p => [p.lat, p.lng])}
                    pathOptions={{ color: "#00e599", weight: 5, opacity: 0.8 }}
                />
            )}
            {hasSender && (
                <Marker position={[senderLat, senderLng]} icon={customerIcon} />
            )}
            {hasReceiver && (
                <Marker position={[receiverLat, receiverLng]} icon={receiverIcon} />
            )}
            {agentLocation && (
                <Marker position={[agentLocation.lat, agentLocation.lng]} icon={agentIcon} />
            )}
            <FitBounds points={boundPoints} />

        </MapContainer>
    );
}

export default CustomerLiveMap;