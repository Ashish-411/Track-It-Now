import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
// <Component Import>
import Header from "./Header";
import TrackSection from "./TrackSection";
import CreateParcelSection from "./CreateParcelSection";
// </Component Import>
import "../styles/Home.css";
function UserHome(){
     const {logout} = useAuth(); 
    const {notifications, fetchSenderParcel} = useNotification();

    useEffect(() =>{
        const latest = notifications[0];

        if(!latest) return;

        if(latest.type === "parcel_created"){
            alert(latest.message);
            fetchSenderParcel();
        }
    },[notifications,fetchSenderParcel]);
    
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
                            {/* Your parcel cards will go here */}
                        </div>
                        
                        <button 
                            type="button" 
                            onClick={logout}
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