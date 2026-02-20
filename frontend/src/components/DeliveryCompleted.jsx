import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";

function DeliveryCompleted() {
    const navigate = useNavigate();
    const { agentAssignment } = useNotification();

    return (
        <div style={{
            padding:        "32px 24px",
            background:     "rgba(9,20,54,0.97)",
            borderTop:      "1px solid rgba(255,255,255,0.08)",
            boxShadow:      "0 -8px 32px rgba(0,0,0,0.35)",
            flexShrink:     0,
            fontFamily:     "'Outfit', sans-serif",
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            gap:            16,
            textAlign:      "center",
        }}>
            {/* Success icon */}
            <div style={{
                width:          64, height: 64,
                borderRadius:   "50%",
                background:     "linear-gradient(135deg, #00c97d, #00e599)",
                boxShadow:      "0 0 0 12px rgba(0,229,153,0.1), 0 8px 24px rgba(0,229,153,0.3)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontSize:       28,
                color:          "#051a0d",
                fontWeight:     800,
                animation:      "dc-pop 0.4s cubic-bezier(0.34,1.5,0.64,1) both",
            }}>
                ✓
            </div>

            {/* Text */}
            <div>
                <div style={{
                    fontSize:      18,
                    fontWeight:    800,
                    color:         "#e8eeff",
                    letterSpacing: "-0.02em",
                    marginBottom:  4,
                }}>
                    Delivery Completed!
                </div>
                <div style={{
                    fontSize:      12,
                    fontWeight:    500,
                    color:         "rgba(200,212,255,0.45)",
                    fontFamily:    "'JetBrains Mono', monospace",
                    letterSpacing: "0.01em",
                }}>
                    #{agentAssignment?.tracking_code}
                </div>
            </div>

            {/* Status badge */}
            <div style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           7,
                padding:       "6px 16px",
                borderRadius:  20,
                background:    "rgba(0,229,153,0.1)",
                border:        "1px solid rgba(0,229,153,0.25)",
                fontSize:      11,
                fontWeight:    700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:         "#00e599",
            }}>
                <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#00e599", display: "inline-block",
                }} />
                Successfully Delivered
            </div>

            {/* Go home button */}
            <button
                onClick={() => navigate("/")}
                style={{
                    width:          "100%",
                    padding:        "13px",
                    background:     "linear-gradient(135deg, #4f8aff 0%, #2b6cff 100%)",
                    color:          "#fff",
                    border:         "none",
                    borderRadius:   12,
                    fontSize:       13,
                    fontWeight:     700,
                    fontFamily:     "'Outfit', sans-serif",
                    cursor:         "pointer",
                    letterSpacing:  "0.01em",
                    boxShadow:      "0 4px 18px rgba(79,138,255,0.35)",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            8,
                    marginTop:      4,
                }}
            >
                ← Go to Home
            </button>

            <style>{`
                @keyframes dc-pop {
                    from { opacity: 0; transform: scale(0.6); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

export default DeliveryCompleted;