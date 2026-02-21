import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { useCallback } from 'react';
import { deduplicateDeliveries } from "../utils/deliveryUtils";
import api from "../api";
import { BACKEND_WEBSOCKET } from "../constants";
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);


export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);
  const [notifications, setNotification] = useState([]);
  const [senderNotifications, setSenderNotifications] = useState(() =>{
  try {
        const stored = localStorage.getItem("senderNotifications");
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
 });
 const [agentParcel, setAgentParcel] = useState(() => {
    try {
        const stored = localStorage.getItem("agentParcel");
        return stored ? JSON.parse(stored) : null;
    } catch { return null; }
})
 const [senderParcels, setSenderParcels] = useState([]);
 const [singleParcel, setSingleParcel] = useState(() =>{
    try{
        const stored = localStorage.getItem("singleParcel");
        return stored ? JSON.parse(stored) : null;
    }catch(err){
        return null;
    }
 });
 const [loading,setLoading] = useState(false);
const [agentAssignment, setAgentAssignment] = useState(() => {
    try {
        const stored = localStorage.getItem("agentAssignment");
        return stored ? JSON.parse(stored) : null;
    } catch { return null; }
}); 
const [deliveryAssignment, setDeliveryAssignment] = useState(() => {
    try {
        const stored = localStorage.getItem("deliveryAssignment");
        return stored ? JSON.parse(stored) : [];
    } catch { return []; }
});
const [statusNotifications, setStatusNotifications] = useState(() => {
    try {
        const stored = localStorage.getItem("statusNotifications");
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
});

//fetch agent deliviries
const [agentDeliveries, setAgentDeliveries] = useState([]);
const [deliveriesLoading, setDeliveriesLoading] = useState(false);

const [deliveryStatus, setDeliveryStatus] = useState(() => {
    try {
        const assignment = localStorage.getItem("agentAssignment");
        if (!assignment) return "pending";
        return localStorage.getItem("deliveryStatus") ?? "pending";
    } catch { return "pending"; }
});

//clear notifications
 const clearSenderNotifications = () => {
    setSenderNotifications([]);
    localStorage.removeItem("senderNotifications");
};
//  clearActiveDelivery
const clearActiveDelivery = () => {
    setAgentAssignment(null);
    setAgentParcel(null);
    setDeliveryStatus("pending");          // ← resets cleanly
    localStorage.removeItem("agentAssignment");
    localStorage.removeItem("agentParcel");
    localStorage.removeItem("deliveryStatus");
};

const clearDeliveryAssignment = () => {
    setDeliveryAssignment([]);
    localStorage.removeItem("deliveryAssignment")
}
const clearAgentStorage = () => {
    setAgentAssignment(null);
    setAgentParcel(null);
    setSingleParcel(null);
    setAgentDeliveries([]);
    clearActiveDelivery();
    localStorage.removeItem("agentAssignment");
    localStorage.removeItem("agentParcel");
    localStorage.removeItem("deliveryAssignment");
    localStorage.removeItem("singleParcel");
};
const fetchAgentParcel = useCallback(async (parcelId) => {
    try {
        const res = await api.get(`/api/parcel/read?parcel_id=${parcelId}`);
        console.log("agent received sender parcel",res.data);
        setAgentParcel(res.data);
    } catch (err) {
        console.log("Status:", err.response?.status);
        console.log("Message:", err.response?.data);
    }
}, []);
useEffect(() => {
    if (!agentAssignment?.parcel_id || agentParcel) return;
    fetchAgentParcel(agentAssignment.parcel_id);
}, [agentAssignment?.parcel_id, agentParcel]);

const fetchAgentDeliveries = useCallback(async () => {
    if (!user?.id || user.role !== "agent") return;
    setDeliveriesLoading(true);
    try {
        const res = await api.get(`/api/agent/deliveries?agent_id=${user.id}`);
        setAgentDeliveries(deduplicateDeliveries(res.data));
    } catch (err) {
        console.error("Failed to fetch agent deliveries:", err);
    } finally {
        setDeliveriesLoading(false);
    }
}, [user?.id]);
useEffect(() => {
    if (!user || !token || user.role !== "agent") return;
    fetchAgentDeliveries();
}, [user?.id, token]);


 const fetchSenderParcel = useCallback(async() => {
    setLoading(true);
    try {
        const res = await api.get("/api/parcel/parcels?created=true");
        const data = Array.isArray(res.data) ? res.data : [];
        setSenderParcels([...data].reverse());
    }catch(err) {
       console.log("Status:", err.response?.status);
      console.log("Message:", err.response?.data); 
    }finally{
        setLoading(false);
    }
}, []); // Empty deps since it doesn't depend on external values

  //storing notification 
useEffect(() => {
    localStorage.setItem("senderNotifications", JSON.stringify(senderNotifications));
}, [senderNotifications]);

useEffect(() => {
    if (agentParcel) {
        localStorage.setItem("agentParcel", JSON.stringify(agentParcel));
    }
}, [agentParcel]);

useEffect(() => {
    if (agentAssignment) {
        localStorage.setItem("agentAssignment", JSON.stringify(agentAssignment));
    }
}, [agentAssignment]);
useEffect(() => {
    if (deliveryAssignment) {
        localStorage.setItem("deliveryAssignment", JSON.stringify(deliveryAssignment));
    }
}, [deliveryAssignment]);

useEffect(() =>{
    if(singleParcel){
        localStorage.setItem("singleParcel",JSON.stringify(singleParcel));
    }
},[singleParcel]);
useEffect(() => {
    localStorage.setItem("statusNotifications", JSON.stringify(statusNotifications));
}, [statusNotifications]);


  useEffect(() => {
    if (!user || !token) return;

    if (socketRef.current) return;

    socketRef.current = new WebSocket(
      `ws://localhost:8000/api/parcel/receive_notification/${user.id}?token=${token}`
    );
    // socketRef.current = new WebSocket(
    //   `${BACKEND_WEBSOCKET}/api/parcel/receive_notification/${user.id}?token=${token}`
    // );
    socketRef.current.onopen=() =>{
      console.log("Notification WebSocket Connected");
    }
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "parcel_created") {
          setSenderNotifications(prev => [data, ...prev]); 
          fetchSenderParcel();                          
        }else if(data.type === "parcel_request"){
        console.log("Received:", data);
        setNotification(prev => [data,...prev]);
    }
    else if(data.type === "parcel-assigned"){
      console.log(data);
      alert(data.message);
      setAgentAssignment(data);
      fetchAgentParcel(data.parcel_id);
    }else if(data.type === "agent-assigned"){
        console.log("Receiver got parcel",data);
        alert(data.message);
        setDeliveryAssignment(prev => [
            ...prev,
            {
                tracking_code: data.tracking_code,
                parcelId: data.parcel_id,
                message: data.message,
            }
        ])

    }else if(data.type === "parcel-status-changed"){
        console.log("Parcel Status changed:",data);
        console.log(data.message);
        alert(data.message);
        setStatusNotifications(prev => [data, ...prev]);
        setSenderParcels(prev =>
            prev.map(p => p.id === data.parcel_id 
                ? { ...p, current_status: data.status } 
                : p)
            )
        }
    }
    socketRef.current.onclose = (e) => {
      console.log("Notification WebSocket closed",e);
    };

    return () => {
      socketRef.current?.close(); // closes ONLY when provider unmounts (logout/app close)
      socketRef.current = null;
    };
  }, [user?.id, token]);
  const removeNotification = (requestId) => {
    setNotification(prev =>
      prev.filter(n => n.request_id !== requestId)
    );
  };
  return (
    <NotificationContext.Provider value={{notifications,
                                        senderNotifications,
                                        senderParcels,
                                        loading,
                                        agentAssignment,
                                        agentParcel,
                                        singleParcel,
                                        deliveryAssignment,
                                        statusNotifications,
                                        agentDeliveries,
                                        deliveryStatus,
                                        setDeliveryStatus,
                                        setSingleParcel,
                                        setDeliveryAssignment,
                                        clearDeliveryAssignment,
                                        clearAgentStorage,
                                        clearActiveDelivery,
                                        setStatusNotifications,
                                        removeNotification,
                                        clearSenderNotifications,
                                        fetchSenderParcel,
                                        }}>
      {children}
    </NotificationContext.Provider>         
  );
};