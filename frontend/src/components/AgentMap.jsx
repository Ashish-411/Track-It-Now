import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import { useAuth } from "../contexts/AuthContext";
import { watchUserLocation, stopWatchingLocation } from "../utils/Location";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});
function RecenterMap({ location }) {
  const map = useMap();
  
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 15);
    }
  }, [location, map]);
  
  return null;
}
function AgentMap({onLocationUpdate, isAssigned , isLive}){
    const { user } = useAuth();
    const [agentLocation, setAgentLocation] = useState(null);
    const [radius, setRadius] = useState(1000);
    const [isExpanding, setIsExpanding] = useState(true);
    const [watchId, setWatchId] = useState(null);

  // Watch agent's live location
  useEffect(() => {
    if (!isLive) return;

    const id = watchUserLocation(
      (location) => {
        setAgentLocation(location);
        onLocationUpdate(location);   
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Please enable location services");
      }
    );

    setWatchId(id);

    return () => {
      if (id !== null) {
        stopWatchingLocation(id);
      }
    };
  }, [isLive, onLocationUpdate]);

  // Animate circle (breathing effect)
  useEffect(() => {
    if (isAssigned) return;

    const interval = setInterval(() => {
      setRadius((prevRadius) => {
        if (isExpanding) {
          if (prevRadius >= 1000) {
            setIsExpanding(false);
            return 1000;
          }
          return prevRadius + 20;
        } else {
          if (prevRadius <= 500) {
            setIsExpanding(true);
            return 500;
          }
          return prevRadius - 20;
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isExpanding, isAssigned]);

  return (
    <>

      {/* Map */}
      {isLive && agentLocation ? (
        <MapContainer
          center={[agentLocation.lat, agentLocation.lng]}
          zoom={15}
          style={{ flex: 1 }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={[agentLocation.lat, agentLocation.lng]} />
          
          {!isAssigned && (
            <Circle
              center={[agentLocation.lat, agentLocation.lng]}
              radius={radius}
              pathOptions={{
                color: "#4CAF50",
                fillColor: "#4CAF50",
                fillOpacity: 0.2,
                weight: 2,
              }}
            />
          )}
          
          <RecenterMap location={agentLocation} />
        </MapContainer>
      ) : (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f0f0",
        }}>
          <p style={{ fontSize: "1.2rem", color: "#666" }}>
            Loading...
          </p>
        </div>
      )}
    </>
  );

}
export default AgentMap;