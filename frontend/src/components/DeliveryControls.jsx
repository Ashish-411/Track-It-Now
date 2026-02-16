import { useState } from "react";

function DeliveryControls() {
    const parcel = "picked_up";
  const [currentStatus, setCurrentStatus] = useState(parcel);

  const handlePickedUp = () => {
    setCurrentStatus("picked_up");
    onStatusChange("picked_up");
  };

  const handleInTransit = () => {
    setCurrentStatus("in_transit");
    onStatusChange("in_transit");
  };

  const handleDelivered = () => {
    setCurrentStatus("delivered");
    onStatusChange("delivered");
  };

  return (
    <div style={{
      padding: "1rem",
      background: "white",
      borderTop: "2px solid #ddd",
      boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
    }}>
      <h3>Delivery Controls</h3>
      <p><strong>Parcel ID:</strong> {parcel.trackingId}</p>
      <p><strong>Current Status:</strong> {currentStatus}</p>
      <p><strong>Pickup:</strong> {parcel.senderName}</p>
      <p><strong>Dropoff:</strong> {parcel.receiverName}</p>
      
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          onClick={handlePickedUp}
          disabled={currentStatus !== "pending"}
          style={{
            padding: "0.75rem 1.5rem",
            background: currentStatus === "pending" ? "#2196F3" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: currentStatus === "pending" ? "pointer" : "not-allowed",
          }}
        >
          Mark as Picked Up
        </button>
        
        <button
          onClick={handleInTransit}
          disabled={currentStatus !== "picked_up"}
          style={{
            padding: "0.75rem 1.5rem",
            background: currentStatus === "picked_up" ? "#FF9800" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: currentStatus === "picked_up" ? "pointer" : "not-allowed",
          }}
        >
          In Transit
        </button>
        
        <button
          onClick={handleDelivered}
          disabled={currentStatus !== "in_transit"}
          style={{
            padding: "0.75rem 1.5rem",
            background: currentStatus === "in_transit" ? "#4CAF50" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: currentStatus === "in_transit" ? "pointer" : "not-allowed",
          }}
        >
          Mark as Delivered
        </button>
      </div>
    </div>
  );
}

export default DeliveryControls;