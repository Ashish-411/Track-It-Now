import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import AgentMap from "../components/AgentMap";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useNotification } from "../contexts/NotificationContext";
import { WS_URL } from "../constants";
function AgentLiveTrack() {
  const { user, token } = useAuth();
  const {agentAssignment} = useNotification();
  const navigate = useNavigate();
  const [agentLocation, setAgentLocation] = useState(null);
  const [isAssigned, setIsAssigned] = useState(false);
  const location = useLocation();
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
  useEffect(() => {
  if (!agentAssignment) return;

  console.log("Assignment received:", agentAssignment);

  setIsAssigned(true);
  setAssignedParcel(agentAssignment);

  navigate(`/agent/delivery/${agentAssignment.tracking_code}`);
}, [agentAssignment, navigate]);

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
      `${WS_URL}/api/agent/go-online/${user.id}?token=${token}`
    );
    ws.current = socket;

    socket.onopen = () => {
      console.log("Agent Location WebSocket Connected");
      setWsReady(true);
    };

    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === "_assigned") {
        
    //   }
    // };

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
          <style>{`
        @keyframes livePulse {
          0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          60%  { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        `}
      </style>
     {/* Header bar */}
      <div style={{
        position: "relative",
        zIndex: 1000,
        background: "rgba(10, 15, 50, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 28px",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        {/* Left side */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <div style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>
            Agent Live Tracking:
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
              👤 Agent: <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{user?.name}</strong>
            </div>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Status:</span>

            {/* Live / Offline indicator */}
            {isLive ? (
              <div style={{
                display: "flex", alignItems: "center", gap: "7px",
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: "20px",
                padding: "5px 12px 5px 9px",
              }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#10b981", flexShrink: 0,
                  animation: "livePulse 2s ease-in-out infinite",
                }} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#10b981", letterSpacing: "0.04em" }}>
                  LIVE
                </span>
              </div>
            ) : (
              <div style={{
                display: "flex", alignItems: "center", gap: "7px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "20px",
                padding: "5px 12px 5px 9px",
              }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#ef4444", flexShrink: 0,
                }} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.04em" }}>
                  OFFLINE
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          title="Go Offline and Exit"
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.2)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          }}
          style={{
            width: "38px", height: "38px",
            borderRadius: "11px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)",
            fontSize: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
            lineHeight: 1,
          }}
        >
          <IoMdClose/>
        </button>
      </div>
            {/* Map */}
            <AgentMap
              onLocationUpdate={handleLocationUpdate}
              isAssigned={isAssigned}
              isLive={isLive}
            />
      </div>
  );
}

export default AgentLiveTrack;