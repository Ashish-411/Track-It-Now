import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import AgentMap from "../components/AgentMap";
import DeliveryControls from "../components/DeliveryControls";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

function AgentLiveTrack() {
  const { user, token } = useAuth();
  const [agentLocation, setAgentLocation] = useState(null);
  const [isAssigned, setIsAssigned] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(() => location.state?.shouldGoLive ?? false);
  const [wsReady, setWsReady] = useState(false);
  const [assignedParcel, setAssignedParcel] = useState(null);

  const ws = useRef(null);
  const agentLocationRef = useRef(null);
  const isLiveRef = useRef(isLive);         // Ref so interval always sees latest value
  const shouldConnect = useRef(false);       // Controls whether reconnect should happen
  const reconnectTimeout = useRef(null);

  // Keep isLiveRef in sync with state
  useEffect(() => {
    isLiveRef.current = isLive;
  }, [isLive]);

  // ── WebSocket factory ──────────────────────────────────────────────────────
  const connectWebSocket = useCallback(() => {
    // Don't open a second socket if one is already open or mid-handshake
    if (
      ws.current &&
      (ws.current.readyState === WebSocket.OPEN ||
        ws.current.readyState === WebSocket.CONNECTING)
    ) return;

    if (!user?.id || !token) return;

    console.log("Connecting WebSocket…");
    const socket = new WebSocket(
      `ws://localhost:8000/api/agent/go-online/${user.id}?token=${token}`
    );
    ws.current = socket;

    socket.onopen = () => {
      console.log("Agent Location WebSocket Connected");
      setWsReady(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "AGENT_ASSIGNED") {
        setIsAssigned(true);
        setAssignedParcel(data.parcel);
        console.log("Assigned Parcel:", data.parcel);
      }
    };

    socket.onclose = (event) => {
      console.log("Agent Live Track WebSocket Disconnected", event.code);
      ws.current = null;
      setWsReady(false);
      // Auto-reconnect unless it was a deliberate close (code 1000)
      if (shouldConnect.current && event.code !== 1000) {
        console.log("Scheduling reconnect in 3 s…");
        reconnectTimeout.current = setTimeout(() => {
          if (shouldConnect.current) connectWebSocket();
        }, 3000);
      }
    };

    socket.onerror = (error) => {
      console.log("Agent Live Track WebSocket error:", error);
      // onclose fires after onerror, so reconnect logic lives there
    };
  }, [user?.id, token]);

  // ── Mount / unmount lifecycle ──────────────────────────────────────────────
  useEffect(() => {
    if (!user || !token) return;

    shouldConnect.current = true;
    connectWebSocket();

    return () => {
      shouldConnect.current = false;
      clearTimeout(reconnectTimeout.current);
      if (ws.current) {
        ws.current.close(1000, "Component unmounted"); // 1000 prevents auto-reconnect
        ws.current = null;
      }
    };
  }, [user?.id, token, connectWebSocket]);

  // ── Location broadcast interval ────────────────────────────────────────────
  // Runs once on mount; reads fresh values through refs each tick so it never
  // needs to be recreated when isLive / wsReady change.
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      const socket = ws.current;
      const loc = agentLocationRef.current;

      if (!isLiveRef.current) return;                          // not live yet
      if (!loc) { console.log("No location yet, skipping"); return; }
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.log("Socket not ready, state:", socket?.readyState);
        return;
      }

      const payload = {
        type: "AGENT_LOCATION",
        agent_id: user.id,
        lat: loc.lat,
        lng: loc.lng,
      };
      console.log("SENDING:", payload);
      socket.send(JSON.stringify(payload));
    }, 5000);

    return () => clearInterval(interval);
  }, [user?.id]); // intentionally minimal — live values come from refs

  // ── Callbacks ──────────────────────────────────────────────────────────────
  const handleLocationUpdate = (loc) => {
    setAgentLocation(loc);
    agentLocationRef.current = loc;
  };

  const handleClose = () => {
    setIsLive(false);
    navigate("/");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header bar */}
      <div
        style={{
          padding: "1rem",
          background: "#333",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Agent Live Tracking</h2>
          <p style={{ margin: "0.5rem 0 0 0" }}>Agent: {user?.name}</p>
          <p style={{ margin: "0.25rem 0 0 0" }}>
            Status: {isLive ? "🟢 Live" : "🔴 Offline"}
          </p>
          {isAssigned && (
            <p style={{ margin: "0.25rem 0 0 0" }}>✅ Assigned to delivery</p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "2rem",
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          title="Go Offline and Exit"
        >
          <IoMdClose />
        </button>
      </div>

      {/* Map */}
      <AgentMap
        onLocationUpdate={handleLocationUpdate}
        isAssigned={isAssigned}
        isLive={isLive}
      />

      {/* Delivery controls — only shown when assigned */}
      {isAssigned && (
        <DeliveryControls
          // parcel={assignedParcel}
          // onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default AgentLiveTrack;