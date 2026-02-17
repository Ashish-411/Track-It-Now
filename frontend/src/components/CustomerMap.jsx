import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { useAuth } from "../contexts/AuthContext";
import { getUserLocation } from "../utils/Location";
import { agentIcon, customerIcon, selectedAgentIcon } from "../utils/mapIcon";
import api from "../api";
import "leaflet/dist/leaflet.css";

function RecenterMap({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) map.setView([location.lat, location.lng], 14);
  }, [location, map]);
  return null;
}

function CustomerMap({ parcelId }) {
  const { user, token } = useAuth();
  const [customerLocation, setCustomerLocation] = useState(null);
  const [nearbyAgents, setNearbyAgents] = useState({});   // always an object/map
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isAssigned, setIsAssigned] = useState(false);
  const [loading, setLoading] = useState(true);

  const wsRef = useRef(null);
  const shouldConnect = useRef(false);
  const reconnectTimeout = useRef(null);

  // ── Get customer location on mount ────────────────────────────────────────
  useEffect(() => {
    getUserLocation()
      .then((loc) => { setCustomerLocation(loc); setLoading(false); })
      .catch(() => { alert("Please enable location services"); setLoading(false); });
  }, []);

  // ── WebSocket factory ──────────────────────────────────────────────────────
  const connectWebSocket = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) return;

    if (!customerLocation || !user?.id || !token) return;

    console.log("CustomerMap: connecting WebSocket…");
    const ws = new WebSocket(
      `ws://localhost:8000/api/agent/search-agents/${user.id}` +
      `?lat=${customerLocation.lat}&lng=${customerLocation.lng}&token=${token}`
    );
    wsRef.current = ws;

    ws.onopen = () => console.log("CustomerMap: connected to agent stream");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Initial snapshot — merge only agents not already tracked
      if (data.nearby_agents) {
        setNearbyAgents((prev) => {
          const next = { ...prev };
          data.nearby_agents.forEach((agent) => {
            const id = String(agent.agent_id);
            if (!next[id]) {
              next[id] = { id, location: { lat: agent.lat, lng: agent.lng } };
            }
          });
          return next;
        });
      }

      // Real-time position update — upsert by id (no duplicates possible)
      else if (data.type === "online-agent-location") {
        const id = String(data.agent_id);
        setNearbyAgents((prev) => ({
          ...prev,
          [id]: { id, location: { lat: data.lat, lng: data.lng } },
        }));
      }
    };

    ws.onclose = (event) => {
      console.log("CustomerMap: agent stream closed", event.code);
      wsRef.current = null;
      // Auto-reconnect unless deliberately closed (code 1000)
      if (shouldConnect.current && event.code !== 1000) {
        reconnectTimeout.current = setTimeout(() => {
          if (shouldConnect.current) connectWebSocket();
        }, 3000);
      }
    };

    ws.onerror = (err) => console.log("CustomerMap: WS error", err);
  }, [customerLocation, user?.id, token]);

  // ── Connect when location is ready, disconnect on unmount ─────────────────
  useEffect(() => {
    if (!customerLocation || !user || !token) return;

    shouldConnect.current = true;
    connectWebSocket();

    return () => {
      shouldConnect.current = false;
      clearTimeout(reconnectTimeout.current);
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
        wsRef.current = null;
      }
    };
  }, [customerLocation, user?.id, token, connectWebSocket]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAgentClick = (agent) => {
    if (isAssigned) return;
    setSelectedAgent(agent);
  };

  const handleAssignAgent = async (agent) => {
    const target = agent || selectedAgent;
    if (!target) { alert("Please select an agent first"); return; }

    try {
      const res = await api.post("/api/delivery/assign", {
        parcel_id: parcelId,
        agent_id: target.id,
      });
      console.log("Assign Agent response:", res);
      setIsAssigned(true);
      // FIX: keep state as an object so Object.values() keeps working
      setNearbyAgents({ [target.id]: target });
    } catch (err) {
      console.log("Agent Assign Failed", err.response?.data);
    }
  };

  // ── Render guards ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading map...</p>
      </div>
    );
  }

  if (!customerLocation) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Unable to get your location. Please enable location services.</p>
      </div>
    );
  }

  const agentList = Object.values(nearbyAgents);   // always derived from the object

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <MapContainer
        center={[customerLocation.lat, customerLocation.lng]}
        zoom={14}
        style={{ flex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Customer marker */}
        <Marker
          position={[customerLocation.lat, customerLocation.lng]}
          icon={customerIcon}
        >
          <Popup>
            <strong>Your Location</strong><br />{user?.name}
          </Popup>
        </Marker>

        {/* 1 km radius circle */}
        <Circle
          center={[customerLocation.lat, customerLocation.lng]}
          radius={1000}
          pathOptions={{
            color: "#2196F3",
            fillColor: "#2196F3",
            fillOpacity: 0.1,
            weight: 2,
            dashArray: "5, 5",
          }}
        />

        {/* Agent markers — keys are guaranteed unique because nearbyAgents is a map */}
        {agentList.map((agent) => (
          <Marker
            key={agent.id}
            position={[agent.location.lat, agent.location.lng]}
            icon={selectedAgent?.id === agent.id ? selectedAgentIcon : agentIcon}
            eventHandlers={{ click: () => handleAgentClick(agent) }}
          >
            <Popup>
              <div style={{ textAlign: "center" }}>
                <strong>Agent {agent.id}</strong>
                {selectedAgent?.id === agent.id && !isAssigned && (
                  <button
                    onClick={() => handleAssignAgent(agent)}
                    style={{
                      display: "block",
                      marginTop: "0.5rem",
                      padding: "0.5rem 1rem",
                      background: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Assign Agent
                  </button>
                )}
                {isAssigned && selectedAgent?.id === agent.id && (
                  <span style={{ color: "#4CAF50", fontWeight: "bold" }}>✓ Assigned</span>
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
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
      }}>
        {!isAssigned ? (
          <>
            <p style={{ margin: "0 0 0.5rem 0" }}>
              <strong>Available Agents:</strong> {agentList.length}
            </p>
            {selectedAgent ? (
              <div>
                <p style={{ margin: "0.5rem 0" }}>
                  Selected: <strong>Agent {selectedAgent.id}</strong>
                </p>
                <button
                  onClick={() => handleAssignAgent(selectedAgent)}
                  style={{
                    padding: "0.75rem 2rem",
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                    fontSize: "1rem",
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
              ✓ Agent <strong>{selectedAgent?.id}</strong> has been assigned
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