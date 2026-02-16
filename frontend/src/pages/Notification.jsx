import { useRequest } from "../contexts/RequestContext";
import { useNotification } from "../contexts/NotificationContext";
import ParcelRequest from "../components/ParcelRequest";
import ParcelAccept from "../components/ParcelAccept";
import { useEffect, useState } from "react";
function Notification(){
    const {notifications, senderNotifications,fetchSenderParcel} = useNotification();

    useEffect(() =>{
        fetchSenderParcel();
    },[fetchSenderParcel]);
    console.log(senderNotifications);
     const hasNotifications = notifications.length > 0 || senderNotifications.length > 0;

    return (
      <div>
        {!hasNotifications && <p>No Notifications</p>}

      {notifications.length > 0 && 
      notifications.map((n, index) => {
        if (n.type === "parcel_request") {
          return <ParcelRequest key={index} notification={n} />;
        }
        return null;
      })}
      {
        senderNotifications.length > 0 && 
        senderNotifications.map((sn,index) =>{
          return <ParcelAccept key = {index} notification={sn}/>
        })
      }
    </div>
    
    );

}
export default Notification;