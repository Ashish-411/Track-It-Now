import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { useAuth } from "../contexts/AuthContext";
import { getUserLocation } from "../utils/Location";
import { agentIcon, customerIcon, selectedAgentIcon} from "../utils/mapIcon";
import "leaflet/dist/leaflet.css";function RecenterMap({ location }) {
  const map = useMap();
  
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 14);
    }
  }, [location, map]);
  
  return null;
}
function CustomerMap({ parcelId }) {
  const { user , token} = useAuth();
  const [customerLocation, setCustomerLocation] = useState(null);
  const [nearbyAgents, setNearbyAgents] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isAssigned, setIsAssigned] = useState(false);
  const [loading, setLoading] = useState(true);

   // Get customer location on mount
  useEffect(() => {
    getUserLocation()
      .then((location) => {
        setCustomerLocation(location);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting location:", error);
        alert("Please enable location services");
        setLoading(false);
      });
  }, []);
  //websocket for connection
  useEffect(() => {
  if (!customerLocation) return;
  if(!user) return;  

  const ws = new WebSocket(
    `ws://localhost:8000/api/agent/search-agents/${user.id}?lat=${customerLocation.lat}&lng=${customerLocation.lng}&token=${token}`
  );

  ws.onopen = () => {
    console.log("Connected to agent stream");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("WS Data:", data);

    // SNAPSHOT: show nearby agents
    if (data.nearby_agents) {
      const agentsMap = {};

      data.nearby_agents.forEach(agent => {
        agentsMap[agent.agent_id] = {
          id: agent.agent_id,
          location: { lat: agent.lat, lng: agent.lng }
        };
      });

      setNearbyAgents(agentsMap);
    }

    // REAL-TIME UPDATE: move agent
    else if (data.type === "agent-location-update") {
      setNearbyAgents(prev => ({
        ...prev,
        [data.agent_id]: {
          ...prev[data.agent_id],
          id: data.agent_id,
          location: { lat: data.lat, lng: data.lng }
        }
      }));
    }
  };

  ws.onclose = () => console.log("Customer Map : Agent stream closed");
  ws.onerror = (err) => console.error(" Customer Map: WS error", err);

  return () => ws.close();

}, [customerLocation,user,token]);
  // Handle agent selection
  const handleAgentClick = (agent) => {
    if (isAssigned) return; // Can't change after assignment
    setSelectedAgent(agent);
  };

  // Assign selected agent to delivery
  const handleAssignAgent = () => {
    if (!selectedAgent) {
      alert("Please select an agent first");
      return;
    }

    // Call API to assign agent
    // POST /api/parcels/:parcelId/assign-agent
    // Body: { agentId: selectedAgent.id }

    setIsAssigned(true);
    
    // Emit via WebSocket
    // socket.emit('assign-agent', {
    //   parcelId: parcelId,
    //   agentId: selectedAgent.id,
    //   customerLocation: customerLocation
    // });

    // Clear other agents
    setNearbyAgents([selectedAgent]);
  };

  if (loading) {
    return (
      <div style={{ 
        flex: 1, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <p>Loading map...</p>
      </div>
    );
  }

  if (!customerLocation) {
    return (
      <div style={{ 
        flex: 1, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <p>Unable to get your location. Please enable location services.</p>
      </div>
    );
  }
  return (
    <>
      {/* Map */}
      <MapContainer
        center={[customerLocation.lat, customerLocation.lng]}
        zoom={14}
        style={{ flex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Customer location marker */}
        <Marker 
          position={[customerLocation.lat, customerLocation.lng]} 
          icon={customerIcon}
        >
          <Popup>
            <strong>Your Location</strong>
            <br />
            {user?.name}
          </Popup>
        </Marker>

        {/* Customer radius circle (1km) */}
        <Circle
          center={[customerLocation.lat, customerLocation.lng]}
          radius={1000}
          pathOptions={{
            color: "#2196F3",
            fillColor: "#2196F3",
            fillOpacity: 0.1,
            weight: 2,
            dashArray: "5, 5"
          }}
        />

        {/* Nearby agents */}
        {Object.values(nearbyAgents).map((agent) => (
          <Marker
            key={agent.id}
            position={[agent.location.lat, agent.location.lng]}
            icon={selectedAgent?.id === agent.id ? selectedAgentIcon : agentIcon}
            eventHandlers={{
              click: () => handleAgentClick(agent)
            }}
          >
            <Popup>
              <div style={{ textAlign: "center" }}>
                <strong>{agent.name}</strong>
                <br />
                 📍 2 km
                <br />
                {selectedAgent?.id === agent.id && !isAssigned && (
                  <button
                    onClick={handleAssignAgent}
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.5rem 1rem",
                      background: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Assign Agent
                  </button>
                )}
                {isAssigned && selectedAgent?.id === agent.id && (
                  <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
                    ✓ Assigned
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <RecenterMap location={customerLocation} />
      </MapContainer>

      {/* Bottom controls */}
      <div style={{
        padding: "1rem",
        background: "white",
        borderTop: "2px solid #ddd",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
      }}>
        {!isAssigned ? (
          <>
            <p style={{ margin: "0 0 0.5rem 0" }}>
              <strong>Available Agents:</strong> {nearbyAgents.length}
            </p>
            {selectedAgent ? (
              <div>
                <p style={{ margin: "0.5rem 0" }}>
                  Selected: <strong>{selectedAgent.name}</strong> (2 km away)
                </p>
                <button
                  onClick={handleAssignAgent}
                  style={{
                    padding: "0.75rem 2rem",
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                    fontSize: "1rem"
                  }}
                >
                  Confirm & Assign Agent
                </button>
              </div>
            ) : (
              <p style={{ margin: "0.5rem 0", color: "#666" }}>
                Click on an agent marker to select
              </p>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0.5rem 0", color: "#4CAF50", fontSize: "1.1rem" }}>
              ✓ Agent <strong>{selectedAgent.name}</strong> has been assigned
            </p>
            <p style={{ margin: "0.5rem 0", color: "#666" }}>
              The agent will pick up your parcel shortly
            </p>
          </div>
        )}
      </div>
    </>
  );

}
export default CustomerMap;