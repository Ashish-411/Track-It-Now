import { Marker, TileLayer, MapContainer } from "react-leaflet";
import { customerIcon, agentIcon } from "../utils/mapIcon";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const receiverIcon = L.divIcon({
    className: "",
    html: `<div style="font-size:32px;line-height:1;">🏠</div>`,
    iconSize:   [32, 32],
    iconAnchor: [16, 32],
});

function CustomerLiveMap({ senderLat, senderLng, receiverLat, receiverLng, agentLocation }) {
    const hasSender   = senderLat   != null && senderLng   != null;
    const hasReceiver = receiverLat != null && receiverLng != null;

    const center = hasSender   ? [senderLat, senderLng]
                 : hasReceiver ? [receiverLat, receiverLng]
                 : [27.7, 85.3];

    return (
        <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
             <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {hasSender && (
                <Marker position={[senderLat, senderLng]} icon={customerIcon} />
            )}
            {hasReceiver && (
                <Marker position={[receiverLat, receiverLng]} icon={receiverIcon} />
            )}
            {agentLocation && (
                <Marker position={[agentLocation.lat, agentLocation.lng]} icon={agentIcon} />
            )}
        </MapContainer>
    );
}

export default CustomerLiveMap;