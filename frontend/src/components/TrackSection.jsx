import { useState } from "react";
import "../styles/TrackingSection.css";
import { CiSearch } from "react-icons/ci";

function TrackSection(){
    const [trackingId, setTrackingId] = useState("");
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
          />
        </div>
        <button className="track-btn">
          Track
        </button>
      </div>
    </section>
  );
}
export default TrackSection;