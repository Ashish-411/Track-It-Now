import { useState } from "react";
import "../styles/TrackingSection.css";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";

function TrackSection(){
    const [trackingId, setTrackingId] = useState("");
    const navigate = useNavigate();
    const {deliveryAssignment} = useNotification();
    function handleTrackClick(e){
      e.preventDefault();
      const match = deliveryAssignment.find(d => d.tracking_code === trackingId);
      if(match){
        navigate(`/track/${trackingId}`, {state: {parcelId  : match.parcelId}});   
      }else{
        alert("Tracking Code Not Found");
      }


    }
    return (
    <section className="tracking-section">
      <div className="tracking-input-group">
        <div className="input-wrapper">
          <CiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Enter Your Tracking Id"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="tracking-input"
            required
          />
        </div>
        <button className="track-btn" onClick={handleTrackClick}>
          Track
        </button>
      </div>
    </section>
  );
}
export default TrackSection;