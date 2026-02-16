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
 const [loading,setLoading] = useState(false);


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

const fetchSenderParcel = useCallback(async() => {
    setLoading(true);
    try {
        const res = await api.get("/api/parcel/parcels?created=true");
        setSenderNotifications(Array.isArray(res.data) ? res.data : []);
    }catch(err) {
        console.error("failed to fetch sender parcels", err);
    }finally{
        setLoading(false);
    }
}, []); // Empty deps since it doesn't depend on external values

  return (
    <NotificationContext.Provider value={{notifications,
                                        senderNotifications,
                                        removeNotification,
                                        fetchSenderParcel,
                                        }}>
      {children}
    </NotificationContext.Provider>         
  );
};

export const useNotification = () => useContext(NotificationContext);
