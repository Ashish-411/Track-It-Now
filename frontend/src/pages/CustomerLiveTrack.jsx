import { useEffect, useRef, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { useLocation } from "react-router-dom";
import CustomerLiveMap from "../components/CustomerLiveMap";
import api from "../api";
import { BACKEND_WEBSOCKET } from "../constants";
import { getPlaceName } from "../utils/Location";

function CustomerLiveTrack() {
    const { tracking_code }    = useParams();
    const { user, token }      = useAuth();
    const { singleParcel, setSingleParcel, deliveryAssignment } = useNotification();
    const navigate             = useNavigate();
    const [agentLocation, setAgentLocation] = useState(null);
    const [dropoffPlace, setDropoffPlace]   = useState(null);
    const { state }            = useLocation();
    
    const match = deliveryAssignment.find(d => d.tracking_code === tracking_code);
    if (!match) navigate("/unauthorized");
    
    const source      = singleParcel?.source;
    const destination = singleParcel?.destination;
    const senderLat   = source?.[0];
    const senderLng   = source?.[1];
    const receiverLat = destination?.[0];
    const receiverLng = destination?.[1];
    
    const ws               = useRef(null);
    const shouldConnect    = useRef(false);
    const reconnectTimeout = useRef(null);
    
    useEffect(() => {
        if (!state?.parcelId) return;
        api.get(`/api/parcel/read?parcel_id=${state.parcelId}`)
        .then(res => setSingleParcel(res.data))
        .catch(err => console.log("Failed to fetch parcel:", err.response?.data));
    }, [state?.parcelId]);
    
    // Reverse geocode destination for display
    useEffect(() => {
        if (!receiverLat || !receiverLng) return;
        getPlaceName(receiverLat, receiverLng).then(place => {
            if (!place) return;
            const city = place.city.replace(/\s*(Metropolitan|Sub-Metropolitan|Municipal)\s*City\s*/i, "").trim();
            setDropoffPlace({
                road:    place.road || place.suburb || "Drop-off Point",
                suburb:  [place.suburb, city].filter(Boolean).join(", ") || place.full,
            });
        });
    }, [receiverLat, receiverLng]);
    
    const connectWebSocket = useCallback(() => {
        if (ws.current &&
            (ws.current.readyState === WebSocket.OPEN ||
                ws.current.readyState === WebSocket.CONNECTING)) return;
                if (!user?.id || !token || !tracking_code) return;
                
                const socket = new WebSocket(
                    `ws://localhost:8000/api/track/${user.id}/${tracking_code}?token=${token}`
                );
        //         const socket = new WebSocket(
        //             `${BACKEND_WEBSOCKET}/api/track/${user.id}/${tracking_code}?token=${token}`
        // );
        ws.current = socket;
        socket.onopen = () => console.log("Customer tracking WS connected");
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Got agent data:",data);
            setAgentLocation({ lat: data.lat, lng: data.lng });
        };
        socket.onclose = (e) => {
            ws.current = null;
            if (shouldConnect.current && e.code !== 1000) {
                reconnectTimeout.current = setTimeout(() => {
                    if (shouldConnect.current) connectWebSocket();
                }, 3000);
            }
        };
        socket.onerror = (e) => console.log("Customer WS error:", e);
    }, [user?.id, token, tracking_code]);

    useEffect(() => {
        if (!user || !token || !tracking_code) return;
        shouldConnect.current = true;
        connectWebSocket();
        return () => {
            shouldConnect.current = false;
            clearTimeout(reconnectTimeout.current);
            ws.current?.close(1000, "CustomerTrack unmounted");
            ws.current = null;
        };
    }, [user?.id, token, tracking_code, connectWebSocket]);

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

            .clt-topbar {
                position: fixed;
                top: 0; left: 0; right: 0;
                z-index: 1000;
                padding: 16px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                pointer-events: none;
            }
            .clt-topbar-left {
                display: flex; align-items: center; gap: 10px;
                pointer-events: all;
            }
            .clt-back-btn {
                display: flex; align-items: center; gap: 7px;
                background: rgba(9,20,54,0.88);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 12px; padding: 9px 16px;
                color: rgba(200,212,255,0.85); font-size: 13px; font-weight: 600;
                cursor: pointer; font-family: 'Outfit', sans-serif;
                transition: background 0.15s;
            }
            .clt-back-btn:hover { background: rgba(21,41,104,0.95); }

            .clt-logo-pill {
                position: absolute; left: 50%; transform: translateX(-50%);
                background: rgba(9,20,54,0.88);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 14px; padding: 8px 20px;
                pointer-events: all;
            }
            .clt-logo {
                font-size: 16px; font-weight: 800;
                color: #e8eeff; letter-spacing: -0.02em;
                font-family: 'Outfit', sans-serif;
            }
            .clt-logo em { color: #7aaaff; font-style: normal; }

            .clt-close-btn {
                width: 40px; height: 40px; border-radius: 12px;
                background: rgba(9,20,54,0.88);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                border: 1px solid rgba(255,255,255,0.12);
                color: rgba(200,212,255,0.7); font-size: 16px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: all 0.15s;
                pointer-events: all;
            }
            .clt-close-btn:hover {
                background: rgba(255,60,60,0.2);
                border-color: rgba(255,60,60,0.3);
                color: #ff6060;
            }

            /* Left HUD */
            .clt-left-hud {
                position: fixed;
                top: 50%; transform: translateY(-50%);
                left: 24px; z-index: 1000;
                display: flex; flex-direction: column; gap: 10px;
                animation: clt-fadeInLeft 0.5s ease 0.2s both;
            }
            @keyframes clt-fadeInLeft {
                from { opacity:0; transform: translateY(-50%) translateX(-10px); }
                to   { opacity:1; transform: translateY(-50%) translateX(0); }
            }
            .clt-hud-card {
                background: rgba(9,20,54,0.88);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                border: 1px solid rgba(255,255,255,0.09);
                border-radius: 16px; padding: 14px 16px;
                min-width: 160px;
            }
            .clt-hud-lbl {
                font-size: 9.5px; font-weight: 700; letter-spacing: 0.1em;
                text-transform: uppercase; color: rgba(200,212,255,0.38);
                margin-bottom: 6px; font-family: 'Outfit', sans-serif;
            }
            .clt-hud-val {
                font-size: 14px; font-weight: 700; color: #e8eeff;
                display: flex; align-items: center; gap: 7px;
                font-family: 'Outfit', sans-serif;
            }
            .clt-hud-sub {
                font-size: 11px; color: rgba(200,212,255,0.45);
                margin-top: 3px; font-family: 'Outfit', sans-serif;
            }
            .clt-live-badge {
                display: inline-flex; align-items: center; gap: 6px;
                background: rgba(0,229,153,0.1);
                border: 1px solid rgba(0,229,153,0.25);
                border-radius: 20px; padding: 5px 12px;
            }
            .clt-live-dot {
                width: 6px; height: 6px; border-radius: 50%;
                background: #00e599;
                animation: clt-pulse 1.8s infinite;
                box-shadow: 0 0 0 0 rgba(0,229,153,0.4);
            }
            @keyframes clt-pulse {
                0%   { box-shadow: 0 0 0 0 rgba(0,229,153,0.4); }
                60%  { box-shadow: 0 0 0 5px rgba(0,229,153,0); }
                100% { box-shadow: 0 0 0 0 rgba(0,229,153,0); }
            }
            .clt-live-text {
                font-size: 11px; font-weight: 700; color: #00e599;
                letter-spacing: 0.04em; text-transform: uppercase;
                font-family: 'Outfit', sans-serif;
            }

            /* Bottom card */
            .clt-bottom-card {
                position: fixed;
                bottom: 24px; left: 50%; transform: translateX(-50%);
                z-index: 1000;
                width: min(760px, calc(100% - 48px));
                background: rgba(9,20,54,0.92);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 24px; padding: 22px 28px;
                display: flex; align-items: center; gap: 24px;
                box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,138,255,0.08);
                animation: clt-slideUp 0.5s cubic-bezier(0.34,1.3,0.64,1) both;
            }
            @keyframes clt-slideUp {
                from { opacity:0; transform: translateX(-50%) translateY(20px); }
                to   { opacity:1; transform: translateX(-50%) translateY(0); }
            }
            .clt-divider {
                width: 1px; height: 56px;
                background: rgba(255,255,255,0.08); flex-shrink: 0;
            }
            .clt-card-lbl {
                font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
                text-transform: uppercase; color: rgba(200,212,255,0.4);
                margin-bottom: 5px; font-family: 'Outfit', sans-serif;
            }
            .clt-tracking-id {
                font-family: 'JetBrains Mono', monospace;
                font-size: 15px; font-weight: 500; color: #e8eeff;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                letter-spacing: 0.02em;
            }
            .clt-dest-val {
                font-size: 14px; font-weight: 600; color: #e8eeff;
                font-family: 'Outfit', sans-serif;
            }
            .clt-dest-sub {
                font-size: 11.5px; color: rgba(200,212,255,0.5);
                margin-top: 2px; font-family: 'Outfit', sans-serif;
            }
            .clt-status-badge {
                display: inline-flex; align-items: center; gap: 7px;
                background: rgba(0,229,153,0.12);
                border: 1px solid rgba(0,229,153,0.3);
                border-radius: 20px; padding: 6px 14px;
            }
            .clt-status-dot {
                width: 7px; height: 7px; border-radius: 50%;
                background: #00e599;
                animation: clt-pulse 2s ease-in-out infinite;
            }
            .clt-status-text {
                font-size: 12px; font-weight: 700; color: #00e599;
                letter-spacing: 0.04em; text-transform: uppercase;
                font-family: 'Outfit', sans-serif;
            }

            @media (max-width: 600px) {
                .clt-left-hud { display: none; }
                .clt-bottom-card { padding: 16px 18px; gap: 14px; border-radius: 18px; }
                .clt-logo-pill { display: none; }
                .clt-tracking-id { font-size: 12px; }
            }
        `}</style>

        <div style={{ height: "100vh", width: "100%", position: "relative", overflow: "hidden" }}>

            {/* TOP BAR */}
            <div className="clt-topbar">
                <div className="clt-topbar-left">
                    <button className="clt-back-btn" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                </div>
                <div className="clt-logo-pill">
                    <div className="clt-logo">Track<em>It</em>Now</div>
                </div>
                <button className="clt-close-btn" onClick={() => navigate("/")}>✕</button>
            </div>

            {/* LEFT HUD */}
            <div className="clt-left-hud">
                <div className="clt-hud-card">
                    <div className="clt-hud-lbl">Delivery Status</div>
                    <div className="clt-live-badge">
                        <div className="clt-live-dot" />
                        <span className="clt-live-text">Active</span>
                    </div>
                </div>

                <div className="clt-hud-card">
                    <div className="clt-hud-lbl">Drop-off Point</div>
                    <div className="clt-hud-val">
                        🏠 {dropoffPlace?.road || "Locating..."}
                    </div>
                    {dropoffPlace?.suburb && (
                        <div className="clt-hud-sub">{dropoffPlace.suburb}</div>
                    )}
                </div>

                {receiverLat && receiverLng && (
                    <div className="clt-hud-card">
                        <div className="clt-hud-lbl">Coordinates</div>
                        <div className="clt-hud-val" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500 }}>
                            {receiverLat.toFixed(4)}, {receiverLng.toFixed(4)}
                        </div>
                    </div>
                )}
            </div>

            {/* MAP — full screen behind everything */}
            <div style={{ position: "absolute", inset: 0 }}>
                <CustomerLiveMap
                    senderLat={senderLat}
                    senderLng={senderLng}
                    receiverLat={receiverLat}
                    receiverLng={receiverLng}
                    agentLocation={agentLocation}
                />
            </div>

            {/* BOTTOM CARD */}
            <div className="clt-bottom-card">
                <div style={{ flexShrink: 0 }}>
                    <div className="clt-card-lbl">Status</div>
                    <div className="clt-status-badge">
                        <div className="clt-status-dot" />
                        <span className="clt-status-text">Live</span>
                    </div>
                </div>

                <div className="clt-divider" />

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="clt-card-lbl">Tracking ID</div>
                    <div className="clt-tracking-id">#{tracking_code}</div>
                </div>

                <div className="clt-divider" />

                <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <div className="clt-card-lbl">Destination</div>
                    <div className="clt-dest-val">{dropoffPlace?.road || "—"}</div>
                    {dropoffPlace?.suburb && (
                        <div className="clt-dest-sub">{dropoffPlace.suburb}</div>
                    )}
                </div>
            </div>

        </div>
        </>
    );
}

export default CustomerLiveTrack;