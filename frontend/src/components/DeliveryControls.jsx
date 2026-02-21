import { useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import DeliveryCompleted from "./DeliveryCompleted";
function DeliveryControls() {
    const { agentParcel, agentAssignment, clearActiveDelivery,deliveryStatus, setDeliveryStatus } = useNotification();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

const updateStatus = async (status) => {
    setLoading(true);
    const parcelId     = agentParcel?.id;
    const trackingCode = agentAssignment?.tracking_code;
    try {
        if (status === "delivered") {
            await api.post(`/api/parcel/delivery_completed?parcel_id=${parcelId}&tracking_code=${trackingCode}`);
            setDeliveryStatus("delivered"); // ← triggers <DeliveryCompleted/>
            clearActiveDelivery();
            localStorage.removeItem("deliveryStatus");
            return;
        }

        // All other statuses use the normal update route
        await api.post(`/api/parcel/status/update?parcel_id=${parcelId}&status=${status}`);
        setDeliveryStatus(status);
        localStorage.setItem("deliveryStatus", status);

    } catch (err) {
        console.log("Status update failed:", err.response?.data);
        alert("Failed to update status");
    } finally {
        setLoading(false);
    }
};
     const steps = [
        { label: "Mark as Picked Up",  status: "picked_up",  requires: "pending",    color: "#2196F3" },
        { label: "In Transit",          status: "in_transit", requires: "picked_up",  color: "#FF9800" },
        { label: "Mark as Delivered",   status: "delivered",  requires: "in_transit", color: "#4CAF50" },
     ]
 const isDone = (requires) => {
        const order = ["pending", "picked_up", "in_transit", "delivered"];
        return order.indexOf(deliveryStatus) > order.indexOf(requires);
    };
    if(deliveryStatus === "delivered"){
        return <DeliveryCompleted/>
    }
    return (
        <div style={{
            padding:         "18px 24px 22px",
            background:      "rgba(9,20,54,0.97)",
            borderTop:       "1px solid rgba(255,255,255,0.08)",
            boxShadow:       "0 -8px 32px rgba(0,0,0,0.35)",
            flexShrink:      0,
            fontFamily:      "'Outfit', sans-serif",
        }}>
            {/* Label */}
            <div style={{
                display:        "flex",
                alignItems:     "center",
                gap:            8,
                marginBottom:   12,
            }}>
                <div style={{ width: 18, height: 2, borderRadius: 2, background: "#4f8aff", flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,212,255,0.4)" }}>
                    Update Status
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
            </div>

            {/* Tracking + status */}
            <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                    fontFamily:    "'JetBrains Mono', monospace",
                    fontSize:      12, fontWeight: 500,
                    color:         "rgba(200,212,255,0.55)",
                    letterSpacing: "0.01em",
                }}>
                    #{agentAssignment?.tracking_code}
                </span>

                {/* Status badge */}
                <span style={{
                    display:       "inline-flex",
                    alignItems:    "center",
                    gap:           6,
                    padding:       "4px 12px",
                    borderRadius:  20,
                    fontSize:      10,
                    fontWeight:    700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    background:    deliveryStatus === "delivered" ? "rgba(0,229,153,0.12)"
                                 : deliveryStatus === "in_transit" ? "rgba(245,158,11,0.12)"
                                 : deliveryStatus === "picked_up"  ? "rgba(79,138,255,0.12)"
                                 : "rgba(245,158,11,0.12)",
                    border:        deliveryStatus === "delivered" ? "1px solid rgba(0,229,153,0.25)"
                                 : deliveryStatus === "in_transit" ? "1px solid rgba(245,158,11,0.25)"
                                 : deliveryStatus === "picked_up"  ? "1px solid rgba(79,138,255,0.25)"
                                 : "1px solid rgba(245,158,11,0.25)",
                    color:         deliveryStatus === "delivered" ? "#00e599"
                                 : deliveryStatus === "in_transit" ? "#f59e0b"
                                 : deliveryStatus === "picked_up"  ? "#7aaaff"
                                 : "#f59e0b",
                }}>
                    <span style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: "currentColor", display: "inline-block",
                    }} />
                    {deliveryStatus.replace("_", " ")}
                </span>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8 }}>
                {steps.map(({ label, status, requires, icon }) => {
                    const isActive = deliveryStatus === requires;
                    const done     = isDone(requires);

                    return (
                        <button
                            key={status}
                            onClick={() => updateStatus(status)}
                            disabled={!isActive || loading}
                            style={{
                                flex:          1,
                                padding:       "12px 8px",
                                border:        "none",
                                borderRadius:  12,
                                cursor:        isActive && !loading ? "pointer" : "not-allowed",
                                fontSize:      11,
                                fontWeight:    700,
                                fontFamily:    "'Outfit', sans-serif",
                                letterSpacing: "0.01em",
                                transition:    "all 0.18s",
                                display:       "flex",
                                flexDirection: "column",
                                alignItems:    "center",
                                gap:           5,
                                // Done state
                                ...(done ? {
                                    background: "linear-gradient(135deg, #00c97d, #00e599)",
                                    color:      "#051a0d",
                                    boxShadow:  "0 4px 14px rgba(0,229,153,0.25)",
                                } :
                                // Active state
                                isActive ? {
                                    background: "linear-gradient(135deg, #4f8aff 0%, #2b6cff 100%)",
                                    color:      "#fff",
                                    boxShadow:  "0 4px 18px rgba(79,138,255,0.35)",
                                } :
                                // Inactive state
                                {
                                    background: "rgba(255,255,255,0.04)",
                                    border:     "1px solid rgba(255,255,255,0.07)",
                                    color:      "rgba(200,212,255,0.28)",
                                }),
                            }}
                        >
                            <span style={{ fontSize: 16, lineHeight: 1 }}>
                                {done ? "✓" : icon}
                            </span>
                            {loading && isActive ? "..." : label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default DeliveryControls;