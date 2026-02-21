import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import api from "../api";
// <Component Import>
import TrackSection from "./TrackSection";
import CreateParcelSection from "./CreateParcelSection";
import FeatureParcel from "../components/FeatureParcel";
// </Component Import>
import "../styles/Home.css";

function UserHome(){
    const {notifications, fetchSenderParcel, senderParcels} = useNotification();
    
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

                {/* keep content above image */}
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <TrackSection />
                    </div>                {/* TrackSection is in the blue area */}
                <img
                    src="./background.png"
                    alt=""
                    aria-hidden="true"
                    className="user-img-bg"
                />
            </div>
            <div className="create-parcel-boundary">
                        <CreateParcelSection />
            </div>
            {/* Create Parcel Section - Sits on the boundary between blue and white */}
            
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