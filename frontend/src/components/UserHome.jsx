import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
// <Component Import>
import Header from "./Header";
import TrackSection from "./TrackSection";
import CreateParcelSection from "./CreateParcelSection";
import ParcelIcon from "./ParcelIcon";
// </Component Import>
import "../styles/Home.css";
function UserHome(){
    const {logout} = useAuth(); 
    const {notifications, fetchSenderParcel, senderParcels, clearSenderNotifications} = useNotification();
    const dummyParcel = {
    id: 3,
    sender_id: 101,
    receiver_id: 202,
    current_status: "on_the_way",
    description: "Dummy Parcel - Click to view details",
    created_at: "2024-02-01T10:30:00Z",
    updated_at: "2024-02-01T14:45:00Z",
    source: {
        lat: 27.7172,
        lng: 85.3240
    },
    destination: {
        lat: 28.2096,
        lng: 83.9856
    }
};
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
        <div className="home-container">
            <div className="app-container">
                <Header />
                <main className="main-content">
                    <TrackSection/>

                    {/* create parcel section */}
                    <CreateParcelSection/>
                    <div className="content-wrapper">
                        <div className="flex justify-between items-center mb-24">
                
                        </div>
                        
                        
                        {/* Example of how you can display parcels in a grid */}
                        <div className="grid-2 mb-24">
                            {senderParcels.length === 0 
                                ? <p>No parcels yet.</p>
                                : senderParcels.map((parcel) => (
                                    <ParcelIcon key={parcel.id} parcel={parcel} /> // 👈 display each parcel
                                ))
                            }
                            {/* Your parcel cards will go here */}
                        </div>
                        {/* <ParcelIcon parcel={dummyParcel}/> */}
            
                        <button 
                            type="button" 
                            onClick={ () =>{
                                clearSenderNotifications();
                                logout();}}
                            className="btn btn-outline"
                        >
                            Logout
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );

}
export default UserHome;