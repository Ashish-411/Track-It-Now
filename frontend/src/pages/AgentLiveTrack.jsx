import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import AgentMap from "../components/AgentMap";
import DeliveryControls from "../components/DeliveryControls";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io"; // Import close icon

function AgentLiveTrack(){
    const { user , token} = useAuth();
    const [agentLocation, setAgentLocation] = useState(null);
    const [isAssigned, setIsAssigned] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [isLive, setIsLive] = useState(false);
    const [wsReady, setWsReady] = useState(false);

    //const [assignedParcel, setAssignedParcel] = useState(null);
    const assignedParcel = 1;
    const ws = useRef(null);
    const agentLocationRef = useRef(null);

     // Auto-start when coming from "Go Online" button
    useEffect(() => {
      if (location.state?.shouldGoLive) {
        setIsLive(true);
      }
    }, [location.state]);

    // Initialize WebSocket
    useEffect(() => {
      if (!user || !token) return;

      if(ws.current) return;

      const socket = new WebSocket(`ws://localhost:8000/api/agent/go-online/${user.id}?token=${token}`);
      ws.current = socket;
      socket.onopen = () => {
        console.log(" Agent Location WebSocket Connected");
        setWsReady(true);

        // identify agent
        // ws.current.send(JSON.stringify({
        //   type: "AGENT_ONLINE",
        //   agentId: user.id
        // }));
      };
      //on message
      socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // when customer selects this agent
      if (data.type === "AGENT_ASSIGNED") {
        setIsAssigned(true);
        //setAssignedParcel(data.parcel);
        console.log("Assigned Parcel:", data.parcel);
      }
    };

    socket.onclose = () => {
    console.log("Agent Live Track WebSocket Disconnected");
    setWsReady(false);
    ws.current = null
    };
    socket.onerror = (error) => {
    console.log("Agnet Live Track WebSocket error:", error);
    };
    return () => {
    if (ws.current) {
      ws.current.close();
    }
  };
  }, [user,token]);
  
  
  useEffect(() =>{
      console.log("Trying to send");
      
      if (!agentLocation || !isLive || !ws.current){
        console.log("if statement stopped this code");
        return;
      } 
      
      const interval = setInterval(() => {
        console.log("STATE:", ws.current?.readyState);
        if (ws.current?.readyState === WebSocket.OPEN && agentLocationRef.current) {
            const payload = {
            type: "AGENT_LOCATION",
            agent_id: user.id,
            lat: agentLocationRef.current.lat,
            lng: agentLocationRef.current.lng,
            };

        console.log("SENDING:", payload);

    ws.current.send(JSON.stringify(payload));
  }

  }, 5000); // every 5 seconds

  return () => clearInterval(interval); //
}, [isLive,wsReady, user?.id]);
   

  // Handle location updates from AgentMap child component
    const handleLocationUpdate = (location) => {
      setAgentLocation(location);
      agentLocationRef.current = location;
    };
    // Handle close button
  const handleClose = () => {
    setIsLive(false);
    // if (ws.current) {
    //     ws.current.send(JSON.stringify({
    //       type: "AGENT_OFFLINE",
    //       agentId: user.id
    //     }));
    //  }
    navigate("/"); // Navigate to home page
  };
  
    // Handle status change from DeliveryControls
  //   const handleStatusChange = (newStatus) => {
  //     if (socket && assignedParcel) {
  //       socket.emit('parcel-status-update', {
  //         parcelId: assignedParcel.id,
  //         status: newStatus,
  //         agentId: user.id
  //       });
  //     }
  //   };
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ 
        padding: "1rem", 
        background: "#333", 
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Agent Live Tracking</h2>
          <p style={{ margin: "0.5rem 0 0 0" }}>Agent: {user?.name}</p>
          <p style={{ margin: "0.25rem 0 0 0" }}>
            Status: {isLive ? "🟢 Live" : "🔴 Offline"}
          </p>
          {isAssigned && <p style={{ margin: "0.25rem 0 0 0" }}>✅ Assigned to delivery</p>}
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
          onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          title="Go Offline and Exit"
        >
          <IoMdClose />
        </button>
      </div>
      {/* Map Component */}
      <AgentMap 
        onLocationUpdate={handleLocationUpdate}
        isAssigned={isAssigned}
        isLive = {isLive}
      />
      
      {/* Delivery Controls (shown when assigned) */}
      {isAssigned && (
        <DeliveryControls 
          //parcel={assignedParcel}
          //onStatusChange={handleStatusChange}
        />
      )}
    </div>
    );
}
export default AgentLiveTrack;