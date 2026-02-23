//Agent Live Share Delivery Page
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { watchUserLocation, stopWatchingLocation } from "../utils/Location";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import AgentLiveMap from "../components/AgentLiveMap";
import DeliveryControls from "../components/DeliveryControls";
import { WS_URL } from "../constants";

function ActiveDelivery() {
  const { user, token }                  = useAuth();
  const {tracking_code}                  = useParams();
  const { agentParcel, agentAssignment,deliveryStatus } = useNotification();
  const navigate                         = useNavigate();

  const [agentLocation, setAgentLocation] = useState(null);
  const [wsReady, setWsReady]             = useState(false);
  const ws               = useRef(null);
  const agentLocationRef = useRef(null);
  const shouldConnect    = useRef(false);
  const reconnectTimeout = useRef(null);
  const lastLocRef = useRef(null);

  const senderLat   = agentParcel?.source?.[0];
  const senderLng   = agentParcel?.source?.[1];
  const receiverLat = agentParcel?.destination?.[0];
  const receiverLng = agentParcel?.destination?.[1];

  //check valid tracking code from parameter
  const match = agentAssignment?.tracking_code === tracking_code;
useEffect(() => {
    if (deliveryStatus === "delivered") return; 
    if (!agentAssignment) return;               
    if (!match) navigate("/unauthorized"); 
}, [match, deliveryStatus,agentAssignment]);

  const connectWebSocket = useCallback(() => {
    if (ws.current &&
      (ws.current.readyState === WebSocket.OPEN ||
       ws.current.readyState === WebSocket.CONNECTING)) return;
    if (!user?.id || !token || !agentAssignment?.tracking_code) return;

    const socket = new WebSocket(
      `${WS_URL}/api/track/live-share/${user.id}/${agentAssignment.tracking_code}?token=${token}`
    );
    
    ws.current = socket;

    socket.onopen  = () => { console.log("Delivery WS connected"); setWsReady(true); };
    socket.onclose = (event) => {
      ws.current = null;
      setWsReady(false);
      if (shouldConnect.current && event.code !== 1000) {
        reconnectTimeout.current = setTimeout(() => {
          if (shouldConnect.current) connectWebSocket();
        }, 3000);
      }
    };
    socket.onerror = (err) => console.log("Delivery WS error:", err);
  }, [user?.id, token, agentAssignment?.tracking_code]);

  useEffect(() => {
    if (!user || !token || !agentAssignment?.tracking_code) return;
    shouldConnect.current = true;
    connectWebSocket();
    return () => {
      shouldConnect.current = false;
      clearTimeout(reconnectTimeout.current);
      ws.current?.close(1000, "ActiveDelivery unmounted");
      ws.current = null;
    };
  }, [user?.id, token, agentAssignment?.tracking_code, connectWebSocket]);

  // useEffect(() => {
  //   if (!user?.id) return;
  //   const interval = setInterval(() => {
  //     const socket = ws.current;
  //     //const loc    = agentLocationRef.current;
  //     const loc = agentLocation;
  //     if (!loc || !socket || socket.readyState !== WebSocket.OPEN) return;
  //     socket.send(JSON.stringify({
  //       type:        "AGENT_LOCATION",
  //       agent_id:    user.id,
  //       lat:         loc.lat,
  //       lng:         loc.lng,
  //       timestamp:   loc.timestamp,
  //       delivery_id: agentAssignment?.delivery_id,
  //     }));
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [user?.id]);
  useEffect(() => {
  if (!user?.id || !agentAssignment?.delivery_id) return; 

  const interval = setInterval(() => {
    const socket = ws.current;
    const loc = agentLocationRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (!loc) return;

    console.log("Sending location (even if unchanged)");

    socket.send(JSON.stringify({
      type:        "AGENT_LOCATION",
      agent_id:    user?.id,
      lat:         loc.lat,
      lng:         loc.lng,
      timestamp:   Date.now(), // always fresh timestamp
      delivery_id: agentAssignment?.delivery_id,
    }));

  }, 5000); // send every 5 seconds 

  return () => clearInterval(interval);

}, [user?.id, agentAssignment?.delivery_id]);


 useEffect(() => {
  const id = watchUserLocation(
    (loc) => {

      const last = lastLocRef.current;

      setAgentLocation(loc);
      agentLocationRef.current = loc;

      //check31 meter movement
      if (
        !last ||
        Math.abs(loc.lat - last.lat) > 0.00003 ||
        Math.abs(loc.lng - last.lng) > 0.00003
      ) {
        agentLocationRef.current = loc;
        lastLocRef.current = loc;

        const socket = ws.current;

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "AGENT_LOCATION",
            agent_id: user?.id,
            lat: loc.lat,
            lng: loc.lng,
            timestamp: Date.now(),
            delivery_id: agentAssignment?.delivery_id,
          }));

          console.log("Moved ~3 meter and location sent");
        }
      }
    },
    (err) => {
      console.error("Location error:", err);
      alert("Please enable location services");
    }
  );

  return () => {
    if (id !== null) stopWatchingLocation(id);
  };
}, []);


  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "12px 16px",
        background:     "#fff",
        borderBottom:   "1px solid #e5e7eb",
        boxShadow:      "0 2px 8px rgba(0,0,0,.06)",
        flexShrink:     0,
        zIndex:         1000,
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Active Delivery</p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827", letterSpacing: 1 }}>
            #{agentAssignment?.tracking_code}
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          style={{
            background:     "none",
            border:         "1px solid #e5e7eb",
            borderRadius:   8,
            width:          36,
            height:         36,
            fontSize:       18,
            cursor:         "pointer",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            color:          "#6b7280",
          }}
        >
          ✕
        </button>
      </div>

      {/* Map */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgentLiveMap
          agentLocation={agentLocation}
          senderLat={senderLat}
          senderLng={senderLng}
          receiverLat={receiverLat}
          receiverLng={receiverLng}
        />
      </div>
      {/* Delivery Controls */}
      <DeliveryControls/>
    </div>
  );
}

export default ActiveDelivery;