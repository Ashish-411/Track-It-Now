import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
// <Component Import>
import TrackSection from "./TrackSection";
import CreateParcelSection from "./CreateParcelSection";
import FeatureParcel from "../components/FeatureParcel";
// </Component Import>
import "../styles/Home.css";

function UserHome(){
    const {notifications, fetchSenderParcel, senderParcels, clearSenderNotifications} = useNotification();
    
    useEffect(() =>{
        fetchSenderParcel();
    },[fetchSenderParcel]);

    useEffect(() =>{
        const latest = notifications[0];

        if(!latest) return;

        if(latest.type === "parcel_created"){
            alert(latest.message);
        }
    },[notifications]);
    
    return(
        <>
            {/* Blue Section - Top part with blue background */}
            <div className="blue-content">
                <TrackSection/>
                {/* TrackSection is in the blue area */}
            </div>

            {/* Create Parcel Section - Sits on the boundary between blue and white */}
            <CreateParcelSection/>
            
            {/* White Section - Bottom part with white background */}
            <div className="white-content">
                <div className="content-wrapper">
                    {senderParcels.length === 0 ? (
                        <div className="no-parcels">
                            <p>No parcels yet. Create your first parcel!</p>
                        </div>
                    ) : (
                        <FeatureParcel parcels={senderParcels} />
                    )}
                </div>
            </div>
        </>
    );
}

export default UserHome;