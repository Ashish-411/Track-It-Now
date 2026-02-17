import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { useCallback } from 'react';

import api from "../api";
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);
  const [notifications, setNotification] = useState([]);
 const [senderNotifications, setSenderNotifications] = useState([]);
 const [senderParcels, setSenderParcls] = useState([]);
 const [loading,setLoading] = useState(false);

 const fetchSenderParcel = useCallback(async() => {
    setLoading(true);
    try {
        const res = await api.get("/api/parcel/parcels?created=true");
        const data = Array.isArray(res.data) ? res.data : [];
        setSenderParcls([...data].reverse());
    }catch(err) {
       console.log("Status:", err.response?.status);
      console.log("Message:", err.response?.data); 
    }finally{
        setLoading(false);
    }
}, []); // Empty deps since it doesn't depend on external values


  useEffect(() => {
    if (!user || !token) return;

    if (socketRef.current) return;

    socketRef.current = new WebSocket(
      `ws://localhost:8000/api/parcel/receive_notification/${user.id}?token=${token}`
    );

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);
      setNotification(prev => [data,...prev]);

      if (data.type === "parcel_created") {
        setSenderNotifications(prev => [data, ...prev]); 
        fetchSenderParcel();                          
    }

    };

    socketRef.current.onclose = (e) => {
      console.log("WebSocket closed",e);
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
                                        removeNotification,
                                        fetchSenderParcel,
                                        }}>
      {children}
    </NotificationContext.Provider>         
  );
};

export const useNotification = () => useContext(NotificationContext);
